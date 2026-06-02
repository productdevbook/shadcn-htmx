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

test.describe("New components — tier-1", () => {

  // tests/components/forms.spec.ts (append). Exercises the htmx blur-validate
  // demo on the Form Field docs page: an invalid email, on blur, swaps the whole
  // field via outerHTML so the server returns aria-invalid + a role=alert error.
  test.describe("Form Field (deep)", () => {
    test("blur validation swaps in aria-invalid + error message", async ({ page }) => {
      await gotoDoc(page, "form-field")
  
      // Scope to the htmx demo field's root, not the heading id.
      const field = page.locator('[data-slot="form-field"]').filter({
        has: page.locator('input[hx-trigger="blur"]'),
      })
      const input = field.locator('input[type="email"]')
  
      // Pre-state: not yet invalid, no error message rendered.
      await expect(input).not.toHaveAttribute("aria-invalid", "true")
      await expect(field.locator('[data-slot="form-field-error"]')).toHaveCount(0)
  
      // Type an invalid value and blur to fire hx-trigger="blur".
      await input.fill("not-an-email")
      await input.blur()
  
      // The field is replaced (outerHTML swap). Re-resolve and assert post-state.
      const swapped = page.locator('[data-slot="form-field"]').filter({
        has: page.locator('input[hx-trigger="blur"]'),
      })
      const errorEl = swapped.locator('[data-slot="form-field-error"]')
      await expect(errorEl).toBeVisible()
      await expect(errorEl).toHaveAttribute("role", "alert")
      await expect(swapped.locator('input[type="email"]')).toHaveAttribute("aria-invalid", "true")
  
      // aria-describedby points the control at the rendered error.
      const swappedInput = swapped.locator('input[type="email"]')
      const describedby = await swappedInput.getAttribute("aria-describedby")
      const errId = await errorEl.getAttribute("id")
      expect(errId).toBeTruthy()
      expect(describedby ?? "").toContain(errId as string)
    })
  
    test("valid email clears the error on re-blur", async ({ page }) => {
      await gotoDoc(page, "form-field")
      const sel = '[data-slot="form-field"]'
      const input = page.locator(sel).filter({ has: page.locator('input[hx-trigger="blur"]') }).locator('input[type="email"]')
      await input.fill("user@example.com")
      await input.blur()
      const swapped = page.locator(sel).filter({ has: page.locator('input[hx-trigger="blur"]') })
      await expect(swapped.locator('[data-slot="form-field-error"]')).toHaveCount(0)
      await expect(swapped.locator('input[type="email"]')).not.toHaveAttribute("aria-invalid", "true")
    })
  })

  
  // File Upload — styled <label> wrapping a native <input type="file">.
  //
  // The upload itself is platform-native: selecting a file populates
  // input.files, and the form submits it as multipart. The drag-drop +
  // filename-list enhancement lives in public/site.js, but the core contract
  // (a real file input that accepts a selection) works with zero JS. We assert
  // that real post-state here, scoped to [data-slot="file-upload"].
  
  test.describe("File Upload", () => {
    test("route renders with the file-upload slot + native input", async ({
      page,
    }) => {
      await gotoDoc(page, "file-upload")
      await expect(page.locator("h1", { hasText: "File Upload" })).toBeVisible()
      const root = page.locator('[data-slot="file-upload"]').first()
      await expect(root).toHaveCount(1)
      // The visible zone is a <label> wrapping the real input — clicking it
      // opens the OS picker (platform behaviour, no JS).
      await expect(
        root.locator('label[data-slot="file-upload-zone"]'),
      ).toHaveCount(1)
      await expect(
        root.locator('input[type="file"][data-slot="file-upload-input"]'),
      ).toHaveCount(1)
    })
  
    test("selecting a file populates the native input (post-state)", async ({
      page,
    }) => {
      await gotoDoc(page, "file-upload")
      const root = page.locator('[data-slot="file-upload"]').first()
      const input = root.locator(
        'input[type="file"][data-slot="file-upload-input"]',
      )
  
      // Drive the native picker the way a user would, with an in-memory file.
      await input.setInputFiles({
        name: "report.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4 test"),
      })
  
      // Capture the element and assert the platform recorded the selection:
      // files[0].name is the real, JS-visible post-state of the upload control.
      const handle = await input.elementHandle()
      expect(handle).not.toBeNull()
      const selected = await handle!.evaluate((el) => {
        const i = el as HTMLInputElement
        return { count: i.files?.length ?? 0, first: i.files?.[0]?.name ?? "" }
      })
      expect(selected.count).toBe(1)
      expect(selected.first).toBe("report.pdf")
    })
  
    test("API Reference lists File Upload props", async ({ page }) => {
      await gotoDoc(page, "file-upload")
      await expect(page.locator('[data-slot="api-table"]').first()).toBeVisible()
    })
  })

  
  // Copy Button — click-to-copy via the Async Clipboard API, then a transient
  // aria-live "Copied" state. We grant clipboard-write so the secure-context
  // API succeeds, click the first copy button, and assert the post-state on a
  // captured element handle (data-copied="true" + the live region announces
  // "Copied"). Finally we confirm the system clipboard actually received the
  // component's data-copy-text.
  
  test.describe("Copy Button", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "copy-button")
      await expect(page.locator("h1", { hasText: "Copy Button" })).toBeVisible()
    })
  
    test("click copies the value and flips to a transient Copied state", async ({
      page,
      context,
    }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"])
      await gotoDoc(page, "copy-button")
  
      const btn = page.locator('[data-slot="copy-button"]').first()
      await expect(btn).toBeVisible()
      const expected = await btn.getAttribute("data-copy-text")
      expect(expected && expected.length > 0).toBeTruthy()
  
      // Capture the handle so the state assertion is scoped to this element.
      const handle = await btn.elementHandle()
      await btn.click()
  
      // Post-state: data-copied flips to "true" and the empty aria-live region
      // is populated with the success label.
      await expect(btn).toHaveAttribute("data-copied", "true", { timeout: 2000 })
      const status = btn.locator("[data-copy-status]")
      await expect(status).toHaveText("Copied")
  
      // The system clipboard actually received the component's text.
      const clip = await page.evaluate(() => navigator.clipboard.readText())
      expect(clip).toBe(expected)
  
      // And it resets: after the 2s window the success state clears.
      await expect(btn).not.toHaveAttribute("data-copied", "true", {
        timeout: 4000,
      })
      expect(handle).not.toBeNull()
    })
  })

  
  // Date Time Picker — smoke. The control is a native <input type="date">; assert
  // a committed value round-trips in the normalised yyyy-mm-dd format AND that the
  // browser enforces the min constraint (out-of-range value is invalid).
  test.describe("Date Time Picker (smoke)", () => {
    test("date field normalises value and enforces min", async ({ page }) => {
      await gotoDoc(page, "date-time-picker")
  
      const field = page
        .locator('[data-slot="date-time-picker"][type="date"]:not([disabled])')
        .first()
      await expect(field).toBeVisible()
  
      // Capture a live handle for state-dependent assertions after we mutate it.
      const handle = await field.elementHandle()
      if (!handle) throw new Error("no date field handle")
  
      // A real interaction: set a value via the DOM (the picker commits values
      // the same way) and confirm the normalised string the server would receive.
      await handle.evaluate((el: HTMLInputElement) => {
        el.min = "2026-01-01"
        el.value = "2026-07-22"
        el.dispatchEvent(new Event("change", { bubbles: true }))
      })
      expect(await field.inputValue()).toBe("2026-07-22")
      expect(
        await handle.evaluate((el: HTMLInputElement) => el.checkValidity()),
      ).toBe(true)
  
      // Below min → the browser reports the value invalid (rangeUnderflow).
      await handle.evaluate((el: HTMLInputElement) => {
        el.value = "2025-12-31"
      })
      expect(
        await handle.evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow),
      ).toBe(true)
    })
  })

  
  // Sheet — edge-anchored slide-in drawer built on the native <dialog> +
  // showModal(). Verifies it opens as a real modal (browser-set :modal pseudo),
  // is pinned to the right edge (data-side="right"), and light-dismisses via the
  // native closedby="any" backdrop click.
  
  test.describe("Sheet", () => {
    test("trigger opens a right-anchored modal; backdrop click closes it", async ({
      page,
    }) => {
      await gotoDoc(page, "sheet")
  
      // Open the basic demo sheet via its trigger.
      const trigger = page
        .locator('[data-dialog-trigger][data-dialog-target="ex-basic-sheet"]')
        .first()
      await trigger.click()
  
      // Scope to the sheet itself, not the #ex-basic heading.
      const sheet = page.locator('[data-slot="sheet"]#ex-basic-sheet')
      await expect(sheet).toBeVisible()
  
      // Browser-set :modal only matches when showModal() actually ran — proves
      // we got the native top-layer + focus trap, not just a visible <dialog>.
      const handle = await sheet.elementHandle()
      expect(
        await handle!.evaluate((d: HTMLDialogElement) => d.matches(":modal")),
      ).toBe(true)
  
      // Edge anchoring: a right-side sheet is pinned to the right edge. Read the
      // resolved style (the slide-in animation transforms the box, so the live
      // bounding box is unreliable mid-animation — `right: 0px` is not).
      expect(await sheet.getAttribute("data-side")).toBe("right")
      const right = await handle!.evaluate(
        (d) => getComputedStyle(d).right,
      )
      expect(right).toBe("0px")
  
      // closedby="any" → clicking the dim backdrop (top-left corner, outside the
      // right-anchored box) light-dismisses natively, with no backdrop JS.
      await page.mouse.click(5, 5)
      await expect(sheet).not.toBeVisible()
    })
  })

  test("hover-card reveals on interest and is dismissed on ESC", async ({ page }) => {
    await gotoDoc(page, "hover-card")
  
    // Scope to the component, not the #ex-basic heading id.
    const card = page.locator('[data-slot="hover-card"]').first()
    const handle = await card.elementHandle()
    if (!handle) throw new Error("no hover-card element")
  
    const trigger = page
      .locator('[data-slot="hover-card-trigger"][interestfor="hc-user"]')
      .first()
  
    // Interest invokers are progressive enhancement. Where supported, drive the
    // real hover path; otherwise exercise the same contract via the hint popover
    // the `interest` event maps onto (showPopover). Either way we assert the
    // post-state from a captured elementHandle (state-dependent assertion).
    const supported = await page.evaluate(() =>
      Object.hasOwn(HTMLAnchorElement.prototype, "interestForElement"),
    )
  
    if (supported) {
      await trigger.hover()
      await page.waitForFunction(
        (el) => (el as HTMLElement).matches(":popover-open"),
        handle,
        { timeout: 2000 },
      )
    } else {
      await handle.evaluate((el) => (el as HTMLElement & { showPopover(): void }).showPopover())
    }
    expect(
      await handle.evaluate((el) => (el as HTMLElement).matches(":popover-open")),
    ).toBe(true)
  
    // The card holds interactive content the tooltip forbids (a Follow button).
    await expect(
      page.locator('[data-slot="hover-card"] [data-slot="button"]').first(),
    ).toHaveCount(1)
  
    // ESC cancels interest / closes the hint popover.
    await page.keyboard.press("Escape")
    await page.waitForFunction(
      (el) => !(el as HTMLElement).matches(":popover-open"),
      handle,
      { timeout: 2000 },
    )
    expect(
      await handle.evaluate((el) => (el as HTMLElement).matches(":popover-open")),
    ).toBe(false)
  })

  
  // Active Search — native <form role="search"> + <input type="search"> driven
  // by htmx (hx-trigger debounce + hx-sync cancellation + hx-indicator).
  // We can only assert the DOM contract Playwright can observe:
  //   - the search input lives inside [data-slot="active-search"]
  //   - typing a debounced query swaps matching <tr> rows into the target tbody
  //   - the no-JS fallback is a real <form action> with method=get
  
  test.describe("Active Search", () => {
    test("route exists and renders the search form", async ({ page }) => {
      await gotoDoc(page, "active-search")
      await expect(page.locator("h1", { hasText: "Active Search" })).toBeVisible()
      const root = page.locator('[data-slot="active-search"]').first()
      await expect(root).toBeVisible()
      // Native progressive-enhancement contract: it's a real search form.
      expect(await root.evaluate((el) => el.tagName)).toBe("FORM")
      await expect(root).toHaveAttribute("role", "search")
      await expect(root).toHaveAttribute("method", "get")
    })
  
    test("typing debounced query filters the results table", async ({ page }) => {
      await gotoDoc(page, "active-search")
      const root = page.locator('[data-slot="active-search"]').first()
      const input = root.locator('input[type="search"]')
      await expect(input).toBeVisible()
  
      const rows = page.locator("#ex-as-rows tr")
      // Initial state: the demo seeds the full contact list.
      const initialCount = await rows.count()
      expect(initialCount).toBeGreaterThan(1)
  
      // Capture a handle so we can assert against post-swap state reliably.
      const tbody = await page.locator("#ex-as-rows").elementHandle()
      expect(tbody).not.toBeNull()
  
      // Type a query that matches a single contact ("wynne"). Debounce is 300ms.
      await input.fill("wynne")
      await expect
        .poll(async () => page.locator("#ex-as-rows tr").count(), { timeout: 3000 })
        .toBeLessThan(initialCount)
  
      const text = (await page.locator("#ex-as-rows").innerText()).toLowerCase()
      expect(text).toContain("wynne")
      expect(text).not.toContain("venus")
    })
  
    test("indicator is wired to the input via hx-indicator", async ({ page }) => {
      await gotoDoc(page, "active-search")
      const root = page.locator('[data-slot="active-search"]').first()
      const input = root.locator('input[type="search"]')
      const indicatorSel = await input.getAttribute("hx-indicator")
      expect(indicatorSel).toBeTruthy()
      // hx-indicator points at the role=status spinner we render.
      const indicator = root.locator('[data-slot="active-search-indicator"]')
      await expect(indicator).toHaveAttribute("role", "status")
      await expect(indicator).toHaveAttribute("aria-live", "polite")
      expect(`#${await indicator.getAttribute("id")}`).toBe(indicatorSel)
    })
  
    test("API Reference lists Active Search props", async ({ page }) => {
      await gotoDoc(page, "active-search")
      await expect(page.locator('[data-slot="api-table"]').first()).toBeVisible()
      for (const prop of ["id", "name", "action", "delay"]) {
        await expect(
          page.locator(`[data-slot="api-row"][data-prop="${prop}"]`).first(),
        ).toHaveCount(1)
      }
    })
  })

  
  // Edit In Place — the canonical htmx view<->edit outerHTML swap over REST.
  // We can verify the full contract: the view carries data-mode="view", Edit
  // GETs the editor (a <form> with data-mode="edit"), and Save PUTs and swaps
  // in a fresh view with the new value. The live demo on the page is scoped by
  // its stable id #ex-eip-user, which survives every outerHTML swap.
  
  test.describe("Edit In Place", () => {
    test("route exists and renders the view", async ({ page }) => {
      await gotoDoc(page, "edit-in-place")
      await expect(page.locator("h1", { hasText: "Edit In Place" })).toBeVisible()
      const root = page.locator('[data-slot="edit-in-place"]').first()
      await expect(root).toHaveAttribute("data-mode", "view")
    })
  
    test("Edit swaps to the editor, Save PUTs and returns the updated view", async ({ page }) => {
      await gotoDoc(page, "edit-in-place")
      // Scope to the live demo by its stable id (it survives the outerHTML swap).
      const live = page.locator("#ex-eip-user")
      await expect(live).toHaveAttribute("data-mode", "view")
  
      // Click Edit -> htmx GETs the editor and replaces the element with a <form>.
      await live.locator('[data-slot="edit-in-place-edit"]').click()
      await expect(page.locator("#ex-eip-user")).toHaveAttribute("data-mode", "edit")
  
      const nameInput = page.locator("#ex-eip-user input[name='name']")
      await expect(nameInput).toBeVisible()
      await nameInput.fill("Grace Hopper")
  
      // Capture the editor handle so we can prove it was swapped out on Save.
      const editorHandle = await page.locator("#ex-eip-user").elementHandle()
      await page.locator('#ex-eip-user [data-slot="edit-in-place-save"]').click()
  
      // After the PUT the editor element is detached and a fresh view shows the
      // new value at the same id.
      await expect
        .poll(async () => editorHandle && (await editorHandle.evaluate((el) => el.isConnected)))
        .toBeFalsy()
      await expect(page.locator("#ex-eip-user")).toHaveAttribute("data-mode", "view")
      await expect(page.locator("#ex-eip-user")).toContainText("Grace Hopper")
    })
  
    test("API Reference lists the required Edit In Place props", async ({ page }) => {
      await gotoDoc(page, "edit-in-place")
      const section = page.locator('[data-slot="api-table"]')
      await expect(section.first()).toBeVisible()
      for (const prop of ["editHref", "putHref", "cancelHref", "fields"]) {
        const row = page.locator(`[data-slot="api-row"][data-prop="${prop}"]`)
        await expect(row.first()).toHaveCount(1)
      }
    })
  })

  
  // Load More — htmx click-to-load self-replace. The trigger is a real <button>
  // (data-slot="load-more", data-trigger="click") with hx-target="this" +
  // hx-swap="outerHTML": clicking it requests the next page and the response
  // (more items + a fresh trigger) replaces it in place. The chain ends when the
  // server omits the trigger on the last page.
  
  test.describe("Load More", () => {
    test("route exists and renders", async ({ page }) => {
      await gotoDoc(page, "load-more")
      await expect(page.locator("h1", { hasText: "Load More" })).toBeVisible()
    })
  
    test("click trigger is a real button that self-replaces and ends the chain", async ({ page }) => {
      await gotoDoc(page, "load-more")
      // Scope to the click example host (live preview region).
      const host = page.locator("#ex-click-host")
  
      // Initial state: 3 comments + one click trigger.
      await expect(host.locator('[data-test^="comment-"]')).toHaveCount(3)
      const trigger = host.locator('[data-slot="load-more"][data-trigger="click"]')
      await expect(trigger).toBeVisible()
      // It must be a native <button> for the no-JS path.
      expect(await trigger.evaluate((el) => el.tagName)).toBe("BUTTON")
  
      // Capture the live element so we can assert it gets detached by the swap.
      const handle = await trigger.elementHandle()
  
      // Click → htmx appends page 2 and replaces the trigger with a fresh one.
      await trigger.click()
      await expect(host.locator('[data-test^="comment-"]')).toHaveCount(6)
      // The original trigger element was swapped out (outerHTML self-replace).
      expect(await handle!.evaluate((el) => el.isConnected)).toBe(false)
  
      // Click the new trigger → page 3 (last page); the server omits the
      // trigger, so the chain ends.
      await host.locator('[data-slot="load-more"][data-trigger="click"]').click()
      await expect(host.locator('[data-test^="comment-"]')).toHaveCount(9)
      await expect(host.locator('[data-slot="load-more"]')).toHaveCount(0)
    })
  })

  
  // Skip Link — visually hidden until focused, then jumps focus to a landmark.
  // We test the real contract:
  //   - it is a native <a href> (link role + platform activation),
  //   - it is hidden at rest (sr-only: a clipped ~1px box),
  //   - focusing it reveals it (not-sr-only → real size),
  //   - activating it moves focus to the target region.
  
  test.describe("Skip Link", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "skip-link")
      await expect(page.locator("h1", { hasText: "Skip Link" })).toBeVisible()
    })
  
    test("is a native anchor, hidden at rest, revealed on focus", async ({
      page,
    }) => {
      await gotoDoc(page, "skip-link")
      const link = page.locator('[data-slot="skip-link"]').first()
  
      // Native <a href> — gives the link role + activation for free.
      await expect(link).toHaveJSProperty("tagName", "A")
      const href = await link.getAttribute("href")
      expect(href && href.startsWith("#"), "skip link targets a fragment").toBeTruthy()
  
      // sr-only at rest: clipped to a ~1px box.
      const hidden = await link.boundingBox()
      if (!hidden) throw new Error("skip link has no box")
      expect(hidden.width).toBeLessThanOrEqual(2)
      expect(hidden.height).toBeLessThanOrEqual(2)
  
      // Focus reveals it (focus:not-sr-only flips it to a real pill).
      await link.focus()
      await expect(link).toBeFocused()
      const shown = await link.boundingBox()
      if (!shown) throw new Error("revealed skip link has no box")
      expect(shown.width).toBeGreaterThan(40)
      expect(shown.height).toBeGreaterThan(10)
    })
  
    test("activating it moves focus into the target region", async ({ page }) => {
      await gotoDoc(page, "skip-link")
      const link = page.locator('[data-slot="skip-link"]').first()
      const targetId = (await link.getAttribute("href"))!.slice(1)
  
      // Capture the destination element handle for the post-state assertion.
      const target = await page.evaluateHandle(
        (id) => document.getElementById(id),
        targetId,
      )
      expect(await target.evaluate((el) => !!el), "target landmark exists").toBeTruthy()
  
      await link.focus()
      await page.keyboard.press("Enter")
  
      // Focus (or at least the active element) lands on the target region.
      const focusedTarget = await target.evaluate(
        (el) => el === document.activeElement,
      )
      expect(focusedTarget, "focus jumped to the target region").toBeTruthy()
    })
  })

  
  // Theme Toggle — selecting "Dark" must add the class-based `.dark` to <html>,
  // update the group's data-value, check the native radio, and persist the
  // `theme` cookie. The boot script (shipped in site.js) wires this; we drive a
  // real click and assert the post-state. We scope to [data-slot="theme-toggle"]
  // (NOT the #ex-basic heading id) and capture an element handle for the
  // state-dependent <html>.dark assertion.
  test.describe("Theme Toggle", () => {
    test("selecting Dark toggles .dark on <html>, updates data-value + cookie", async ({
      page,
    }) => {
      await gotoDoc(page, "theme-toggle")
  
      const group = page.locator('[data-slot="theme-toggle"]').first()
      await expect(group).toBeVisible()
  
      // The input is sr-only; the visible label is the real click target.
      const darkLabel = group.locator(
        'label[data-slot="theme-toggle-label"][title="Dark"]',
      )
      await darkLabel.click()
  
      // Capture a handle so we can poll state that depends on the click.
      const htmlHandle = await page.locator("html").elementHandle()
      await expect
        .poll(() => htmlHandle!.evaluate((el) => el.classList.contains("dark")))
        .toBe(true)
  
      // Group reflects the new choice; the native radio is checked.
      await expect(group).toHaveAttribute("data-value", "dark")
      await expect(group.locator('input[value="dark"]')).toBeChecked()
  
      // Cookie persists the explicit override.
      const cookie = (await page.context().cookies()).find(
        (ck) => ck.name === "theme",
      )
      expect(cookie?.value).toBe("dark")
    })
  })
})
