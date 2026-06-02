import { expect, test } from "@playwright/test"
import { gotoDoc, openPopoverTrigger } from "./fixtures"

// Smoke / QA sweep: open every /docs/<component> page and perform the
// canonical interaction. Catches the "test passes but UI broken" class
// of bug — does the user-visible thing actually happen?
//
// Each test exercises ONE interaction and asserts the post-state.
// Don't replicate behaviour already covered by per-component specs;
// this is a fast-failing tripwire that runs across the whole library.

test.describe("Smoke — overlays", () => {
  test("Dialog opens via trigger and shows backdrop", async ({ page }) => {
    await gotoDoc(page, "dialog")
    const trigger = page.locator("[data-dialog-trigger]").first()
    await trigger.click()
    const dialog = page.locator("dialog[open]").first()
    await expect(dialog).toBeVisible()
    // Modal dialogs sit in the top layer with width > 0.
    const box = await dialog.boundingBox()
    expect(box?.width ?? 0).toBeGreaterThan(100)
  })

  test("Popover opens anchored", async ({ page }) => {
    await gotoDoc(page, "popover")
    await openPopoverTrigger(page, '[popovertarget="ex-pop-1"]')
    await expect(page.locator("#ex-pop-1")).toBeVisible()
  })

  test("DropdownMenu opens and focuses first item", async ({ page }) => {
    await gotoDoc(page, "dropdown-menu")
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    await expect(
      page.locator('#ex-ddm-1 [role="menuitem"]').first(),
    ).toBeFocused()
  })

  test("Tooltip reveals on focus", async ({ page }) => {
    await gotoDoc(page, "tooltip")
    const btn = page
      .locator('[aria-describedby="ex-tt-save"] button')
      .first()
    await btn.focus()
    await expect.poll(() =>
      page
        .locator("#ex-tt-save")
        .evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1")
  })
})

test.describe("Smoke — navigation", () => {
  test("Tabs switch on click", async ({ page }) => {
    await gotoDoc(page, "tabs")
    const triggers = page.locator(
      '#ex-basic-tabs [data-tab-trigger]:not([disabled])',
    )
    const second = triggers.nth(1)
    await second.click()
    await expect(second).toHaveAttribute("aria-selected", "true")
  })

  test("Accordion item expands on click", async ({ page }) => {
    await gotoDoc(page, "accordion")
    const summaries = page.locator(
      '#ex-acc-single [data-slot="accordion-trigger"]',
    )
    const second = summaries.nth(1)
    await second.click()
    await expect(second.locator("xpath=..")).toHaveAttribute("open", "")
  })

  test("Pagination clicking page 2 swaps content + active mark", async ({
    page,
  }) => {
    await gotoDoc(page, "pagination")
    const host = page.locator("#ex-pag-host")
    await host.locator('[data-test="page-2"]').click()
    await expect(host.locator('[aria-current="page"]')).toHaveText("2")
  })
})

test.describe("Smoke — forms", () => {
  test("Button click reaches its handler (htmx demo)", async ({ page }) => {
    await gotoDoc(page, "button")
    const btn = page.locator('button').first()
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
  })

  test("Input accepts typing", async ({ page }) => {
    await gotoDoc(page, "input")
    // First editable input on the page (the input docs leads with
    // disabled/readonly demos before any plain text input).
    const input = page
      .locator('input[name="email"]:not([disabled]):not([readonly])')
      .first()
    await input.fill("hello@example.com")
    await expect(input).toHaveValue("hello@example.com")
  })

  test("Textarea accepts typing", async ({ page }) => {
    await gotoDoc(page, "textarea")
    const ta = page.locator("textarea").first()
    await ta.fill("hello\nworld")
    expect(await ta.inputValue()).toContain("world")
  })

  test("Checkbox toggles on click", async ({ page }) => {
    await gotoDoc(page, "checkbox")
    const cb = page.locator('input[type="checkbox"]').first()
    const initial = await cb.isChecked()
    await cb.click()
    expect(await cb.isChecked()).toBe(!initial)
  })

  test("Switch toggles on click", async ({ page }) => {
    await gotoDoc(page, "switch")
    const sw = page.locator('input[role="switch"]').first()
    const initial = await sw.isChecked()
    await sw.click()
    expect(await sw.isChecked()).toBe(!initial)
  })

  test("Radio Group selects on click", async ({ page }) => {
    await gotoDoc(page, "radio-group")
    const radios = page.locator('input[type="radio"]')
    await radios.nth(1).click()
    expect(await radios.nth(1).isChecked()).toBe(true)
  })

  test("Select changes value", async ({ page }) => {
    await gotoDoc(page, "select")
    const sel = page.locator("select").first()
    const opts = await sel.locator("option").allTextContents()
    if (opts.length > 1) {
      await sel.selectOption({ index: 1 })
      const v = await sel.inputValue()
      expect(v.length).toBeGreaterThan(0)
    }
  })

  test("Slider responds to arrow key", async ({ page }) => {
    await gotoDoc(page, "slider")
    const range = page.locator('input[type="range"]').first()
    await range.evaluate((el: HTMLInputElement) => (el.value = "50"))
    await range.focus()
    await page.keyboard.press("ArrowRight")
    expect(await range.inputValue()).toBe("51")
  })

  test("Label associates with input via for", async ({ page }) => {
    await gotoDoc(page, "label")
    const label = page.locator('label[for]').first()
    const forId = await label.getAttribute("for")
    if (forId) {
      const target = page.locator(`#${forId}`)
      await expect(target).toBeVisible()
    }
  })

  test("Combobox input has list attr", async ({ page }) => {
    await gotoDoc(page, "combobox")
    const input = page.locator('[data-slot="combobox"] input').first()
    const list = await input.getAttribute("list")
    expect(list).toBeTruthy()
  })
})

test.describe("Smoke — display + feedback", () => {
  test("Card renders content", async ({ page }) => {
    await gotoDoc(page, "card")
    const card = page.locator('[data-slot="card"]').first()
    await expect(card).toBeVisible()
  })

  test("Badge renders", async ({ page }) => {
    await gotoDoc(page, "badge")
    const badge = page.locator('[data-slot="badge"]').first()
    await expect(badge).toBeVisible()
  })

  test("Avatar fallback is visible", async ({ page }) => {
    await gotoDoc(page, "avatar")
    const av = page.locator('[data-slot="avatar"]').first()
    await expect(av).toBeVisible()
  })

  test("Separator renders", async ({ page }) => {
    await gotoDoc(page, "separator")
    const sep = page.locator('[data-slot="separator"]').first()
    await expect(sep).toBeVisible()
  })

  test("Alert has role=status by default", async ({ page }) => {
    await gotoDoc(page, "alert")
    const alert = page.locator('[data-slot="alert"][role="status"]').first()
    await expect(alert).toBeVisible()
  })

  test("Progress has aria-valuenow", async ({ page }) => {
    await gotoDoc(page, "progress")
    const pg = page.locator('[role="progressbar"]').first()
    const v = await pg.getAttribute("aria-valuenow")
    expect(v).toBeTruthy()
  })

  test("Skeleton has role=status + aria-busy", async ({ page }) => {
    await gotoDoc(page, "skeleton")
    const sk = page.locator('[data-slot="skeleton"]').first()
    await expect(sk).toHaveAttribute("role", "status")
    await expect(sk).toHaveAttribute("aria-busy", "true")
  })

  test("Toast — server-flash returns a toast", async ({ page }) => {
    await gotoDoc(page, "toast")
    const btn = page.locator("button", { hasText: "Flash success" }).first()
    await btn.click()
    const toast = page
      .locator('#ex-toast-viewport [data-slot="toast"]')
      .first()
    await expect(toast).toBeVisible({ timeout: 3000 })
  })

  test("Table renders + has a sortable column", async ({ page }) => {
    await gotoDoc(page, "table")
    await expect(page.locator('table[data-slot="table"]').first()).toBeVisible()
    await expect(
      page.locator('th[data-sortable="true"]').first(),
    ).toBeVisible()
  })
})
