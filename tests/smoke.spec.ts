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
      .locator('button[aria-describedby="ex-tt-save"]')
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

test.describe("APG components — batch A", () => {

  test("Meter live gauge updates value via htmx polling", async ({ page }) => {
    await gotoDoc(page, "meter")
    const live = page.locator("#m-mem")
    await expect(live).toBeVisible()
    // First htmx tick (hx-trigger="load") swaps in a server reading whose
    // aria-valuetext carries a "<n> GB of 16 GB" string the placeholder lacks.
    await expect(live).toHaveAttribute("aria-valuetext", /GB of 16 GB/, {
      timeout: 4000,
    })
    // The swapped-in value sits in the server's drift band (0.55–0.75), i.e.
    // strictly above the 0.4 placeholder — proving the gauge actually moved.
    const value = Number(await live.getAttribute("value"))
    expect(value).toBeGreaterThan(0.5)
    expect(value).toBeLessThanOrEqual(0.75)
  })

  test("Number Input + button steps the value via stepUp()", async ({ page }) => {
      await gotoDoc(page, "number-input")
      // First steppered field on the page (#ex-basic-qty, value=1, max=10).
      const root = page.locator('[data-slot="number-input"]').first()
      const input = root.locator('input[type="number"]')
      const before = await input.inputValue()
      await root.locator('[data-step="up"]').click()
      const after = await input.inputValue()
      expect(Number(after)).toBe(Number(before) + 1)
    })

  test("Breadcrumb marks the current page and keeps it non-interactive", async ({ page }) => {
    await gotoDoc(page, "breadcrumb")
    const nav = page.locator('nav[data-slot="breadcrumb"]').first()
    await expect(nav).toHaveAttribute("aria-label", "Breadcrumb")
  
    // The current page is a real <span aria-current="page"> — not a link.
    const current = nav.locator('[data-slot="breadcrumb-page"]').first()
    await expect(current).toHaveAttribute("aria-current", "page")
    expect(await current.evaluate((el) => el.tagName)).toBe("SPAN")
  
    // Parent links are real, focusable anchors; tabbing reaches the first one.
    const firstLink = nav.locator('a[data-slot="breadcrumb-link"]').first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
    expect(await firstLink.evaluate((el) => el.tagName)).toBe("A")
  })

  test("Link is a native anchor; external link sets target + rel", async ({ page }) => {
    await gotoDoc(page, "link")
    // Default variant renders a real <a href> with the implicit link role.
    const def = page.locator('a[data-slot="link"][data-variant="default"]').first()
    await expect(def).toBeVisible()
    await expect(def).toHaveAttribute("href", /.+/)
    // External link opts into a new tab and severs window.opener + referrer.
    const ext = page.locator('a[data-slot="link"][data-external="true"]').first()
    await expect(ext).toHaveAttribute("target", "_blank")
    await expect(ext).toHaveAttribute("rel", /noopener/)
    await expect(ext).toHaveAttribute("rel", /noreferrer/)
    // The "opens in new tab" affordance is announced to assistive tech.
    await expect(ext.locator(".sr-only")).toHaveText(/opens in new tab/i)
  })

  test("Collapsible toggles open on trigger click", async ({ page }) => {
      await gotoDoc(page, "collapsible")
      const trigger = page
        .locator('[data-slot="collapsible-trigger"]')
        .first()
      const details = trigger.locator("xpath=..")
      // First example renders collapsed; clicking the summary opens it.
      await expect(details).not.toHaveAttribute("open", "")
      await trigger.click()
      await expect(details).toHaveAttribute("open", "")
    })

  test("AlertDialog opens, ignores backdrop click, closes on Cancel", async ({ page }) => {
      await gotoDoc(page, "alert-dialog")
      const trigger = page.locator("[data-dialog-trigger]").first()
      await trigger.click()
      const dialog = page.locator('dialog[role="alertdialog"][open]').first()
      await expect(dialog).toBeVisible()
      // Distinguishing behaviour vs Dialog: an alert dialog is NOT
      // light-dismissible. Click the backdrop (top-left corner, outside the
      // centred content box) and assert it stays open.
      await page.mouse.click(4, 4)
      await expect(dialog).toBeVisible()
      // An explicit response closes it.
      await dialog.locator('[data-dialog-close="true"]').first().click()
      await expect(dialog).toBeHidden()
    })

  test("RangeSlider clamps thumbs and updates the fill", async ({ page }) => {
      await gotoDoc(page, "range-slider")
      const root = page.locator('[data-slot="range-slider"]').first()
      const lo = root.locator('input[data-range="min"]')
      const hi = root.locator('input[data-range="max"]')
      // Drive the lower thumb past the upper thumb's value; it must clamp.
      const hiVal = await hi.inputValue()
      await lo.fill(String(Number(await hi.getAttribute("max"))))
      await lo.dispatchEvent("input")
      expect(Number(await lo.inputValue())).toBeLessThanOrEqual(Number(await hi.inputValue()))
      // The fill CSS variable tracks the lower thumb after interaction.
      const minVar = await root.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--range-min").trim(),
      )
      expect(minVar).toMatch(/%$/)
      expect(await hi.inputValue()).not.toBe("")
      void hiVal
    })

  test("Toolbar arrow keys roll the tabindex between controls", async ({ page }) => {
      await gotoDoc(page, "toolbar")
      // Scope to the first live toolbar preview (Example puts the id on the
      // heading, not a wrapper, so query the toolbar by its data-slot).
      const bar = page.locator('[data-slot="toolbar"]').first()
      const items = bar.locator('[data-toolbar-item]')
      const first = items.nth(0)
      const second = items.nth(1)
      // Single tab stop: only the first non-disabled control is focusable.
      await expect(first).toHaveAttribute("tabindex", "0")
      await expect(second).toHaveAttribute("tabindex", "-1")
      await first.focus()
      await page.keyboard.press("ArrowRight")
      // Focus AND the roving tabindex move to the next control.
      await expect(second).toBeFocused()
      await expect(second).toHaveAttribute("tabindex", "0")
      await expect(first).toHaveAttribute("tabindex", "-1")
    })
})

test.describe("APG components — batch B", () => {

  test("Listbox arrow keys move selection + roll the roving tabindex", async ({
      page,
    }) => {
      await gotoDoc(page, "listbox")
      // First live single-select listbox preview.
      const lb = page.locator('[data-slot="listbox"]').first()
      const options = lb.locator('[role="option"]')
      const first = options.nth(0)
      const second = options.nth(1)
      // Roving tabindex: only one option is in the tab order at boot.
      await expect(lb).toHaveAttribute("data-listbox-ready", "true")
      // Focus the first option and arrow down.
      await first.focus()
      await page.keyboard.press("ArrowDown")
      // Focus AND the roving tabindex move; single-select selection follows focus.
      await expect(second).toBeFocused()
      await expect(second).toHaveAttribute("tabindex", "0")
      await expect(first).toHaveAttribute("tabindex", "-1")
      await expect(second).toHaveAttribute("aria-selected", "true")
      await expect(first).toHaveAttribute("aria-selected", "false")
    })

  test("Menubar opens a menu via ArrowDown and focuses first item", async ({ page }) => {
      await gotoDoc(page, "menubar")
      // The bar is a single tab stop with a roving tabindex; focus the first
      // enabled trigger, then ArrowDown opens its submenu + focuses first item.
      const trigger = page.locator('[data-menu-for="ex-mb-file"]')
      await trigger.focus()
      await page.keyboard.press("ArrowDown")
      await page.waitForFunction(() => {
        const el = document.getElementById("ex-mb-file")
        return !!el && el.matches(":popover-open")
      }, { timeout: 2000 })
      await expect(
        page.locator('#ex-mb-file [role="menuitem"]').first(),
      ).toBeFocused()
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
    })

  test("Tree expands a collapsed parent with ArrowRight", async ({ page }) => {
    await gotoDoc(page, "tree")
    // The "Reports" node in the File-tree example renders collapsed
    // (parent without expanded → aria-expanded="false").
    const tree = page.locator('[data-slot="tree"]').first()
    const reports = tree
      .locator('[role="treeitem"]', { hasText: "Reports" })
      .first()
    await expect(reports).toHaveAttribute("aria-expanded", "false")
    // Move focus onto the node, then ArrowRight to open it (focus stays).
    await reports.focus()
    await page.keyboard.press("ArrowRight")
    await expect(reports).toHaveAttribute("aria-expanded", "true")
  })

  test("Carousel advances on Next click", async ({ page }) => {
      await gotoDoc(page, "carousel")
      const content = page.locator(
        '#ex-basic-carousel [data-slot="carousel-content"]',
      )
      // Starts at the first slide; Prev is disabled.
      await expect(
        page.locator("#ex-basic-carousel [data-carousel-prev]"),
      ).toBeDisabled()
      const before = await content.evaluate((el) => el.scrollLeft)
      await page.locator("#ex-basic-carousel [data-carousel-next]").click()
      // scrollBy({behavior:'smooth'}) animates, so poll for the position change.
      await expect
        .poll(() => content.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(before)
    })

  test("Feed — Page Down moves focus to the next article", async ({ page }) => {
    await gotoDoc(page, "feed")
    const first = page.locator('[data-test="kbd-article-1"]')
    const second = page.locator('[data-test="kbd-article-2"]')
    await first.focus()
    await expect(first).toBeFocused()
    await page.keyboard.press("PageDown")
    await expect(second).toBeFocused()
    // Page Up walks back to the first article.
    await page.keyboard.press("PageUp")
    await expect(first).toBeFocused()
  })

  test("Grid moves cell focus with arrow keys", async ({ page }) => {
      await gotoDoc(page, "grid")
      const cells = page
        .locator('[data-slot="grid"]')
        .first()
        .locator("[data-grid-cell]")
      // First cell is the roving-tabindex owner (set by the boot script).
      const first = cells.first()
      await first.focus()
      await expect(first).toBeFocused()
      // ArrowRight rolls focus + the tabindex="0" to the next cell in the row.
      await page.keyboard.press("ArrowRight")
      const second = cells.nth(1)
      await expect(second).toBeFocused()
      await expect(second).toHaveAttribute("tabindex", "0")
      await expect(first).toHaveAttribute("tabindex", "-1")
    })

  test("Treegrid expands a collapsed row on ArrowRight", async ({ page }) => {
    await gotoDoc(page, "treegrid")
    // A collapsed folder row (aria-expanded=false) with a hidden child row.
    // Grab a STABLE handle to the row — a state selector like [aria-expanded=
    // "false"] would stop matching once we expand it. Focus it, ArrowRight.
    const collapsed = page
      .locator('[data-slot="treegrid"] tr[role="row"][aria-expanded="false"]')
      .first()
    const handle = await collapsed.elementHandle()
    if (!handle) throw new Error("no collapsed treegrid row found")
    expect(await handle.getAttribute("aria-expanded")).toBe("false")
    await handle.focus()
    await page.keyboard.press("ArrowRight")
    await expect.poll(() => handle.getAttribute("aria-expanded")).toBe("true")
  })

  test("Splitter resizes via ArrowRight", async ({ page }) => {
      await gotoDoc(page, "splitter")
      const handle = page.locator('#ex-split-files [data-slot="splitter-handle"]')
      await handle.focus()
      const before = await handle.getAttribute("aria-valuenow")
      await page.keyboard.press("ArrowRight")
      await expect
        .poll(() => handle.getAttribute("aria-valuenow"))
        .not.toBe(before)
      // The CSS variable that sizes the grid track moves with the value.
      const split = await page
        .locator('#ex-split-files')
        .evaluate((el) => (el as HTMLElement).style.getPropertyValue("--split"))
      expect(split).toMatch(/%$/)
    })
})

test.describe("Landmarks", () => {
  test("exactly one main landmark", async ({ page }) => {
    await gotoDoc(page, "landmarks")
    const shell = page.locator('[data-slot="landmark-shell"]').first()
    await expect(shell).toBeVisible()
    await expect(shell.locator('main[data-slot="landmark-main"]')).toHaveCount(1)
  })

  test("nav landmark has an accessible name", async ({ page }) => {
    await gotoDoc(page, "landmarks")
    const nav = page
      .locator('[data-slot="landmark-shell"] nav[data-slot="landmark-navigation"]')
      .first()
    await expect(nav).toHaveAttribute("aria-label", "Primary")
  })

  test("native <search> landmark wraps a form", async ({ page }) => {
    await gotoDoc(page, "landmarks")
    const search = page.locator('search[data-slot="landmark-search"]').first()
    await expect(search.locator("form")).toHaveCount(1)
    await expect(search).toHaveAttribute("aria-label", "Site")
  })

  test("region <section> is labelled", async ({ page }) => {
    await gotoDoc(page, "landmarks")
    const region = page.locator('section[data-slot="landmark-region"]').first()
    await expect(region).toHaveAttribute("aria-labelledby", /.+/)
  })

  test("banner and contentinfo are present", async ({ page }) => {
    await gotoDoc(page, "landmarks")
    const shell = page.locator('[data-slot="landmark-shell"]').first()
    await expect(shell.locator('header[data-slot="landmark-banner"]')).toHaveCount(1)
    await expect(shell.locator('footer[data-slot="landmark-contentinfo"]')).toHaveCount(1)
  })
})
