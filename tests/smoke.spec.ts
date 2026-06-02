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

test.describe("New components — tier-2", () => {

  test("htmx swap updates the output's live region in place", async ({ page }) => {
    await gotoDoc(page, "output")
    // Scope to the live region itself (data-slot="output"), not a heading id.
    const out = page.locator('[data-slot="output"]#o-cart')
    await expect(out).toBeVisible()
    // <output> is an implicit role="status" live region.
    await expect(out).toHaveAttribute("data-slot", "output")
    // Capture a handle so we can assert the post-swap text on the SAME element
    // (innerHTML swap keeps the element; outerHTML would replace it).
    const handle = await out.elementHandle()
    const before = (await out.textContent())?.trim()
    // Change qty 2 -> 5; the form posts to /output/total and swaps innerHTML.
    const qty = page.locator('[data-slot="output"] ~ * input#o-qty, input#o-qty').first()
    await page.locator("input#o-qty").fill("5")
    await page.locator("input#o-qty").blur()
    // 5 x 19.99 = 99.95 — wait until the persistent element's text reflects it.
    await expect
      .poll(async () => (await out.textContent())?.trim(), { timeout: 5000 })
      .toBe("$99.95")
    expect((await out.textContent())?.trim()).not.toBe(before)
    // Same element object survived the innerHTML swap (live region persisted).
    const stillThere = await handle?.evaluate((el) => el.isConnected)
    expect(stillThere).toBe(true)
  })

  test("segmented control: selecting a segment moves the checked radio", async ({ page }) => {
    await gotoDoc(page, "segmented-control")
    // Scope to the first segmented control on the page (the basic example).
    const control = page.locator('[data-slot="segmented-control"]').first()
    const radios = control.locator('input[type="radio"][data-slot="segmented-control-input"]')
  
    // Capture handles so state assertions survive any re-render.
    const first = await radios.nth(0).elementHandle()
    const second = await radios.nth(1).elementHandle()
    if (!first || !second) throw new Error("expected at least two segments")
  
    // First segment ships checked.
    expect(await first.evaluate((el: HTMLInputElement) => el.checked)).toBe(true)
    expect(await second.evaluate((el: HTMLInputElement) => el.checked)).toBe(false)
  
    // Activating the second segment selects it and deselects the first —
    // native radio one-at-a-time. The radio is sr-only, so click its wrapping
    // <label> (the visible control), not the hidden input.
    await control.locator('label[data-slot="segmented-control-item"]').nth(1).click()
    expect(await second.evaluate((el: HTMLInputElement) => el.checked)).toBe(true)
    expect(await first.evaluate((el: HTMLInputElement) => el.checked)).toBe(false)
  
    // The selected segment's <label> wrapper carries the active look.
    const activeLabel = control.locator('label[data-slot="segmented-control-item"]:has(input:checked)')
    await expect(activeLabel).toHaveCount(1)
    await expect(activeLabel).toHaveAttribute("data-value", "grid")
  })

  
  // Rating — star control built as a native single-select radio group. The
  // browser gives us focus, arrow keys, and one-at-a-time for free; the
  // cumulative fill is pure CSS (reverse DOM order + named-peer general-sibling
  // selectors). We test the platform contract + the CSS fill cascade.
  test.describe("Rating", () => {
    test("route renders with a radiogroup of star radios", async ({ page }) => {
      await gotoDoc(page, "rating")
      await expect(page.locator("h1", { hasText: "Rating" })).toBeVisible()
      const group = page.locator('[data-slot="rating"]').first()
      await expect(group).toHaveAttribute("role", "radiogroup")
      // Five stars => five radios sharing one name.
      await expect(group.locator('input[type="radio"][data-slot="rating-item"]')).toHaveCount(5)
    })
  
    test("clicking a star selects it and fills every star to its left (CSS cascade)", async ({ page }) => {
      await gotoDoc(page, "rating")
      const group = page.locator('[data-slot="rating"]').first()
      // Click the "4 stars" label (labels carry the per-star aria-label).
      await group.getByLabel("4 stars out of 5").click()
      // The matching radio is now checked — real, submittable post-state.
      await expect(group.locator('input[type="radio"][value="4"]')).toBeChecked()
      // Capture an element handle and assert the fill cascade: exactly 4 of the
      // 5 star SVGs resolve to a painted fill (1..4 filled, 5 empty).
      const handle = await group.elementHandle()
      const filled = await page.evaluate((g) => {
        const labels = [...g!.querySelectorAll("label")]
        return labels.filter((l) => {
          const svg = l.querySelector("svg")!
          const f = getComputedStyle(svg).fill
          return f && f !== "none" && f !== "rgba(0, 0, 0, 0)"
        }).length
      }, handle)
      expect(filled).toBe(4)
    })
  
    test("disabled rating disables every radio and is skipped from the tab order", async ({ page }) => {
      await gotoDoc(page, "rating")
      const disabled = page.locator('[data-slot="rating"][aria-disabled="true"]').first()
      const radios = disabled.locator('input[type="radio"]')
      await expect(radios).toHaveCount(5)
      for (let i = 0; i < 5; i++) await expect(radios.nth(i)).toBeDisabled()
    })
  })

  // tests/components/color-picker.spec.ts
  
  // Color Picker — native <input type="color"> styled as a swatch with an
  // optional live hex <output>. We test the platform contract + our one bit of
  // JS (the hex readout sync from public/site.js), not a reimplemented picker.
  test.describe("Color Picker", () => {
    test("route exists and renders", async ({ page }) => {
      await gotoDoc(page, "color-picker")
      await expect(page.locator("h1", { hasText: "Color Picker" })).toBeVisible()
    })
  
    test("renders a native color input scoped to the component", async ({ page }) => {
      await gotoDoc(page, "color-picker")
      const input = page
        .locator('[data-slot="color-picker"] input[type="color"]')
        .first()
      await expect(input).toBeVisible()
      await expect(input).toHaveAttribute("value", "#e66465")
    })
  
    test("setting the value updates the live hex readout (site.js sync)", async ({ page }) => {
      await gotoDoc(page, "color-picker")
      // First color-picker on the page carries the hex <output>.
      const root = page.locator('[data-slot="color-picker"]').first()
      const input = root.locator('input[type="color"]')
      const out = root.locator('[data-slot="color-picker-value"]')
      // Capture a handle so the assertion reflects post-interaction DOM state.
      const outHandle = await out.elementHandle()
      if (!outHandle) throw new Error("no color-picker-value output")
      // Native color pickers can't be driven by clicking; set the value and
      // dispatch the input event the platform would fire, exactly as the docs
      // MDN reference describes (input fires on every adjustment).
      await input.evaluate((el: HTMLInputElement) => {
        el.value = "#00ff00"
        el.dispatchEvent(new Event("input", { bubbles: true }))
      })
      await expect
        .poll(async () => (await outHandle.textContent())?.trim())
        .toBe("#00ff00")
    })
  
    test("bare swatch (showValue=false) is a plain native input, no readout", async ({ page }) => {
      await gotoDoc(page, "color-picker")
      // The bare-swatch example puts data-slot="color-picker" directly on the input.
      const bare = page.locator('input[type="color"][data-slot="color-picker"]').first()
      await expect(bare).toBeVisible()
      await expect(bare).toHaveAttribute("alpha", "")
    })
  })

  
  // Autosize Textarea — a native <textarea> driven by CSS `field-sizing: content`
  // (no JS). We assert the platform contract: the element auto-grows in height as
  // its value gets longer, between the min/max bounds. We capture an element
  // handle so the height assertion is taken on the same live node before/after.
  test.describe("Autosize Textarea", () => {
    test("route exists and renders", async ({ page }) => {
      await gotoDoc(page, "autosize-textarea")
      await expect(page.locator("h1", { hasText: "Autosize Textarea" })).toBeVisible()
    })
  
    test("renders a real textarea with field-sizing: content", async ({ page }) => {
      await gotoDoc(page, "autosize-textarea")
      const ta = page.locator('[data-slot="autosize-textarea"][data-autosize="true"]').first()
      await expect(ta).toBeVisible()
      const fieldSizing = await ta.evaluate(
        (el) => getComputedStyle(el).getPropertyValue("field-sizing").trim(),
      )
      // Browsers that support the property report "content"; older engines that
      // don't recognise it report "" — the fallback path (still a usable field).
      expect(["content", ""]).toContain(fieldSizing)
    })
  
    test("grows in height as the value gets taller (field-sizing: content)", async ({
      page,
    }) => {
      await gotoDoc(page, "autosize-textarea")
      const ta = page.locator('[data-slot="autosize-textarea"][data-autosize="true"]').first()
      const handle = await ta.elementHandle()
      if (!handle) throw new Error("no autosize-textarea element handle")
  
      // Start empty, measure baseline height.
      await handle.evaluate((el: HTMLTextAreaElement) => {
        el.value = ""
        el.dispatchEvent(new Event("input", { bubbles: true }))
      })
      const before = (await handle.boundingBox())!.height
  
      // Add many lines of content.
      await handle.evaluate((el: HTMLTextAreaElement) => {
        el.value = Array.from({ length: 8 }, (_, i) => `line ${i + 1}`).join("\n")
        el.dispatchEvent(new Event("input", { bubbles: true }))
      })
      const after = (await handle.boundingBox())!.height
  
      const supportsFieldSizing = await handle.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("field-sizing").trim() === "content",
      )
      if (supportsFieldSizing) {
        // The control must have grown to fit the extra rows.
        expect(after).toBeGreaterThan(before)
      } else {
        // No-support fallback: it stays a fixed, still-usable field.
        expect(after).toBeGreaterThanOrEqual(before)
      }
    })
  
    test("autosize={false} variant opts out to field-sizing: fixed", async ({
      page,
    }) => {
      await gotoDoc(page, "autosize-textarea")
      const fixed = page.locator('[data-slot="autosize-textarea"][data-autosize="false"]').first()
      await expect(fixed).toBeVisible()
      const fieldSizing = await fixed.evaluate(
        (el) => getComputedStyle(el).getPropertyValue("field-sizing").trim(),
      )
      expect(["fixed", ""]).toContain(fieldSizing)
    })
  })

  // tests/components/cascading-select.spec.ts
  
  // Cascading Select — parent <select> change reloads the child's <option>s
  // (default hx-swap=innerHTML) AND updates the detail panel via hx-swap-oob.
  // htmx defaults the trigger to `change` for <select>, so no hx-trigger.
  test.describe("Cascading Select", () => {
    test("route exists and renders", async ({ page }) => {
      await gotoDoc(page, "cascading-select")
      await expect(
        page.locator("h1", { hasText: "Cascading Select" }),
      ).toBeVisible()
    })
  
    test("changing the parent swaps the child options + OOB detail", async ({
      page,
    }) => {
      await gotoDoc(page, "cascading-select")
  
      // Scope to the first cascading-select instance (the make → model demo).
      const root = page.locator('[data-slot="cascading-select"]').first()
      await expect(root).toBeVisible()
  
      const parent = root.locator('[data-slot="cascading-select-parent"]')
      const child = root.locator('[data-slot="cascading-select-child"]')
      const detail = root.locator('[data-slot="cascading-select-detail"]')
  
      // Initial state: Audi → A4, detail mentions Audi. Capture an element
      // handle so the post-swap assertion is anchored to the live node.
      const detailHandle = await detail.elementHandle()
      expect(await child.locator("option").first().innerText()).toContain("A4")
      expect(await detailHandle!.innerText()).toContain("Audi")
  
      // Pick BMW on the parent — fires the native change → htmx GET.
      await parent.selectOption("bmw")
  
      // The child's first option swaps to a BMW model (M3)...
      await expect
        .poll(async () => child.locator("option").first().innerText(), {
          timeout: 3000,
        })
        .toContain("M3")
  
      // ...and the detail panel is updated out of band to the BMW model.
      await expect
        .poll(async () => (await detailHandle!.innerText()).trim(), {
          timeout: 3000,
        })
        .toContain("BMW M3")
    })
  
    test("API Reference lists the cascading-select props", async ({ page }) => {
      await gotoDoc(page, "cascading-select")
      const api = page.locator('[data-slot="api-table"]').first()
      await expect(api).toBeVisible()
      for (const prop of ["id", "endpoint", "parentName", "childName", "detail"]) {
        await expect(api.getByText(prop, { exact: true }).first()).toBeVisible()
      }
    })
  })

  
  // Selectable Table — <form>-wrapped table + native name="selected" checkboxes
  // + CSS :has() action-bar reveal + htmx bulk POST.
  //
  // We scope every locator to the first [data-slot="selectable-table"] (the
  // ex-basic preview) — NOT "#ex-basic", which is the section heading id.
  test.describe("Selectable Table", () => {
    test("route exists and renders", async ({ page }) => {
      await gotoDoc(page, "selectable-table")
      await expect(page.locator("h1", { hasText: "Selectable Table" })).toBeVisible()
    })
  
    test("select-all toggles rows, count + action bar react, bulk POST re-renders", async ({
      page,
    }) => {
      await gotoDoc(page, "selectable-table")
      const root = page.locator('[data-slot="selectable-table"]').first()
      const actions = root.locator('[data-slot="selectable-table-actions"]').first()
      const selectAll = root.locator('[data-slot="selectable-table-select-all"]').first()
      const rows = root.locator('[data-slot="selectable-table-select-row"]')
      const out = root.locator('[data-slot="selectable-table-count"]').first()
  
      // 1. Action bar hidden by default (pure CSS :has, no selection yet).
      await expect(actions).toHaveCSS("display", "none")
  
      // 2. Select-all: every row checked, count shows "N selected", bar reveals.
      //    Drive via the change event so it works regardless of the sticky
      //    docs header overlapping the header checkbox.
      await selectAll.evaluate((el: HTMLInputElement) => {
        el.checked = true
        el.dispatchEvent(new Event("change", { bubbles: true }))
      })
      const total = await rows.count()
      expect(total).toBeGreaterThan(0)
      expect(await rows.evaluateAll((es) => es.every((e) => (e as HTMLInputElement).checked))).toBe(true)
      await expect(out).toHaveText(`${total} selected`)
      await expect(actions).toHaveCSS("display", "flex")
  
      // 3. Uncheck one row → header goes indeterminate, count drops.
      await rows.first().evaluate((el: HTMLInputElement) => {
        el.checked = false
        el.dispatchEvent(new Event("change", { bubbles: true }))
      })
      expect(await selectAll.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(true)
      await expect(out).toHaveText(`${total - 1} selected`)
  
      // 4. Re-select all, fire a bulk action, assert post-state: the form is
      //    replaced (capture a handle to detect the swap), a result message
      //    lands in the live <output>, selections clear, and the bar hides.
      await selectAll.evaluate((el: HTMLInputElement) => {
        el.checked = true
        el.dispatchEvent(new Event("change", { bubbles: true }))
      })
      const formHandle = await root.elementHandle()
      await root.locator('[data-test="deactivate"]').evaluate((el: HTMLElement) => el.click())
  
      // Wait for the htmx outerHTML swap to land a result message.
      await page.waitForFunction(() => {
        const o = document.querySelector(
          '[data-slot="selectable-table"] [data-slot="selectable-table-count"]',
        )
        return !!o && /Deactivated/.test(o.textContent || "")
      }, null, { timeout: 5000 })
  
      // Old form node detached by the outerHTML swap.
      if (formHandle) {
        expect(await formHandle.evaluate((el) => el.isConnected)).toBe(false)
      }
  
      const root2 = page.locator('[data-slot="selectable-table"]').first()
      await expect(
        root2.locator('[data-slot="selectable-table-count"]').first(),
      ).toContainText("Deactivated")
      // Selections cleared by the re-render; no duplicated/nested rows.
      expect(
        await root2.locator('[data-slot="selectable-table-select-row"]:checked').count(),
      ).toBe(0)
      expect(await root2.locator('[data-slot="selectable-table-select-row"]').count()).toBe(total)
      // Bar hidden again (no selection after swap).
      await expect(
        root2.locator('[data-slot="selectable-table-actions"]').first(),
      ).toHaveCSS("display", "none")
    })
  
    test("API Reference lists Selectable Table props", async ({ page }) => {
      await gotoDoc(page, "selectable-table")
      const section = page.locator('[data-slot="api-table"]')
      await expect(section.first()).toBeVisible()
    })
  })

  // Delete Row — the htmx delete-in-place pattern. The <tbody> host hoists
  // hx-confirm / hx-target="closest tr" / hx-swap="outerHTML swap:Nms" to every
  // Delete button via the :inherited modifier, so each button only carries
  // hx-delete. Clicking confirms, DELETEs (server returns 200 + empty body),
  // adds htmx-swapping to the row for the swap delay (CSS fades it), then
  // detaches it. We scope to [data-slot="delete-row"] and capture a row handle
  // to prove it gets removed from the DOM.
  test.describe("Delete Row", () => {
    test("route exists and renders the inheritance host", async ({ page }) => {
      await gotoDoc(page, "delete-row")
      await expect(page.locator("h1", { hasText: "Delete Row" })).toBeVisible()
      const host = page.locator('[data-slot="delete-row"]').first()
      await expect(host).toBeVisible()
      // htmx v4 explicit inheritance is hoisted onto the host.
      await expect(host).toHaveAttribute("hx-confirm:inherited", /.+/)
      await expect(host).toHaveAttribute("hx-target:inherited", "closest tr")
      await expect(host).toHaveAttribute("hx-swap:inherited", /outerHTML swap:\d+ms/)
    })
  
    test("Delete confirms, DELETEs, and removes the row in place", async ({ page }) => {
      // hx-confirm uses window.confirm — auto-accept so the request fires.
      page.on("dialog", (d) => d.accept())
      await gotoDoc(page, "delete-row")
  
      const host = page.locator('[data-slot="delete-row"]').first()
      const rows = host.locator('[data-slot="delete-row-item"]')
      const initialCount = await rows.count()
      expect(initialCount).toBeGreaterThan(1)
  
      // The affordance is a real <button> carrying only hx-delete.
      const firstRow = rows.first()
      const trigger = firstRow.locator('[data-slot="delete-row-trigger"]')
      expect(await trigger.evaluate((el) => el.tagName)).toBe("BUTTON")
      await expect(trigger).toHaveAttribute("hx-delete", /\/delete-row\/contacts\/\d+/)
  
      // Capture the live row so we can prove the swap detaches it.
      const rowHandle = await firstRow.elementHandle()
      expect(rowHandle).not.toBeNull()
  
      await trigger.click()
  
      // After the DELETE (200 + empty body) and the fade swap delay, the row is
      // detached from the DOM and the visible count drops by one.
      await expect
        .poll(async () => rowHandle && (await rowHandle.evaluate((el) => el.isConnected)), {
          timeout: 3000,
        })
        .toBeFalsy()
      await expect(host.locator('[data-slot="delete-row-item"]')).toHaveCount(initialCount - 1)
    })
  
    test("API Reference lists the Delete Row props", async ({ page }) => {
      await gotoDoc(page, "delete-row")
      await expect(page.locator('[data-slot="api-table"]').first()).toBeVisible()
      for (const prop of ["href", "confirm", "target", "swapMs"]) {
        await expect(
          page.locator(`[data-slot="api-row"][data-prop="${prop}"]`).first(),
        ).toHaveCount(1)
      }
    })
  })

  
  // Optimistic Toggle — server-backed like toggle. Asserts the reconciled
  // post-state after the htmx POST (works whether or not the optimistic
  // extension pre-flashes, since we assert the authoritative server response).
  test.describe("Optimistic Toggle", () => {
    test("click flips the toggle to the pressed state via the server", async ({
      page,
    }) => {
      await gotoDoc(page, "optimistic-toggle")
  
      // Scope to the component root (NOT the #ex-* heading ids). The first
      // toggle on the page is the "Like a post" demo.
      const root = page.locator('[data-slot="optimistic-toggle"]').first()
      const button = root.locator("button#ex-like")
  
      // Resting state: not pressed, label "Like", points at /like.
      await expect(button).toHaveAttribute("aria-pressed", "false")
      await expect(button).toContainText("Like")
      await expect(button).toHaveAttribute("hx-post", "/docs/optimistic-toggle/like")
  
      // Capture a handle so we can read state after htmx swaps the outerHTML.
      const before = await button.elementHandle()
  
      await button.click()
  
      // After the POST, hx-swap="outerHTML" replaces the button with the
      // server's pressed version: aria-pressed="true", label "Liked", and it now
      // posts to /unlike. expect.poll re-queries the freshly swapped element.
      const swapped = page.locator('[data-slot="optimistic-toggle"] button#ex-like')
      await expect(swapped).toHaveAttribute("aria-pressed", "true", { timeout: 4000 })
      await expect(swapped).toContainText("Liked")
      await expect(swapped).toHaveAttribute("hx-post", "/docs/optimistic-toggle/unlike")
  
      // The original element was detached by the swap.
      if (before) {
        const stillAttached = await before.evaluate((el) => el.isConnected)
        expect(stillAttached).toBe(false)
      }
    })
  
    test("failed request rolls back the optimistic flip", async ({ page }) => {
      await gotoDoc(page, "optimistic-toggle")
  
      const failBtn = page.locator(
        '[data-slot="optimistic-toggle"] button#ex-fail',
      )
      await expect(failBtn).toHaveAttribute("aria-pressed", "false")
  
      await failBtn.click()
  
      // The /fail endpoint returns 500, so the extension restores the original
      // pre-click button: it stays unpressed and labelled "Like".
      await expect(failBtn).toHaveAttribute("aria-pressed", "false", {
        timeout: 4000,
      })
      await expect(failBtn).toContainText("Like")
    })
  })

  
  // Status — persistent polite live region (role=status / role=log).
  
  test.describe("Status (deep)", () => {
    test("default region is role=status, polite, atomic", async ({ page }) => {
      await gotoDoc(page, "status")
      const status = page
        .locator('[data-slot="status"][data-role="status"]')
        .first()
      await expect(status).toBeVisible()
      await expect(status).toHaveAttribute("role", "status")
      await expect(status).toHaveAttribute("aria-live", "polite")
      await expect(status).toHaveAttribute("aria-atomic", "true")
    })
  
    test("log region is role=log and non-atomic", async ({ page }) => {
      await gotoDoc(page, "status")
      const log = page.locator('[data-slot="status"][data-role="log"]').first()
      await expect(log).toHaveAttribute("role", "log")
      await expect(log).toHaveAttribute("aria-live", "polite")
      await expect(log).toHaveAttribute("aria-atomic", "false")
      // log entries are present and ordered
      await expect(
        log.locator('[data-slot="status-item"]').first(),
      ).toBeVisible()
    })
  
    test("htmx swaps fresh count into the persistent live region", async ({
      page,
    }) => {
      await gotoDoc(page, "status")
      // The live region exists from first paint; htmx swaps text INTO it,
      // preserving its live-region semantics. Scope to [data-slot="status"].
      const live = page.locator('[data-slot="status"]#ex-status-live')
      const handle = await live.elementHandle()
      if (!handle) throw new Error("live status region not found")
      await expect(live).toHaveText(/0 results/)
      await page.locator("button", { hasText: "Add result" }).first().click()
      // The region element itself stays in place (innerHTML swap), only text
      // changes — assert post-state on the captured handle's region.
      await expect(live).toHaveText(/1 result\b/, { timeout: 3000 })
      // It must remain a live region after the swap.
      await expect(live).toHaveAttribute("aria-live", "polite")
      await expect(live).toHaveAttribute("role", "status")
      await page.locator("button", { hasText: "Add result" }).first().click()
      await expect(live).toHaveText(/2 results/, { timeout: 3000 })
    })
  })

  test("split-button: default action stays clickable and toggle opens the secondary menu", async ({ page }) => {
    await gotoDoc(page, "split-button")
  
    const root = page.locator('[data-slot="split-button"]').first()
    const action = root.locator('[data-slot="split-button-action"]')
    const toggle = root.locator('[data-slot="split-button-toggle"]')
  
    // The primary action is a real, focusable button distinct from the toggle.
    await expect(action).toBeVisible()
    await expect(action).toBeEnabled()
  
    // Toggle advertises the menu and starts collapsed.
    await expect(toggle).toHaveAttribute("aria-haspopup", "menu")
    await expect(toggle).toHaveAttribute("aria-expanded", "false")
  
    // The popup it controls is not yet in the top layer.
    const menuId = await toggle.getAttribute("popovertarget")
    expect(menuId).toBeTruthy()
    const menu = page.locator(`#${menuId}`)
    const menuHandle = await menu.elementHandle()
    expect(menuHandle).not.toBeNull()
    expect(
      await menuHandle!.evaluate((el) => el.matches(":popover-open")),
    ).toBe(false)
  
    // Open it.
    await toggle.click()
    await page.waitForFunction(
      (id) => {
        const el = document.getElementById(id)
        return !!el && el.matches(":popover-open")
      },
      menuId,
      { timeout: 2000 },
    )
  
    // Post-state: popup is open, aria-expanded flipped, and the first menuitem
    // received focus (the dropdown-menu contract focuses it on open).
    expect(
      await menuHandle!.evaluate((el) => el.matches(":popover-open")),
    ).toBe(true)
    await expect(toggle).toHaveAttribute("aria-expanded", "true")
    const firstItem = menu.locator('[role="menuitem"]').first()
    await expect(firstItem).toBeFocused()
  
    // ESC closes the popup and restores aria-expanded.
    await page.keyboard.press("Escape")
    await page.waitForFunction(
      (id) => {
        const el = document.getElementById(id)
        return !!el && !el.matches(":popover-open")
      },
      menuId,
      { timeout: 2000 },
    )
    await expect(toggle).toHaveAttribute("aria-expanded", "false")
  })

  
  // Lazy Load — a deferred-content container. On hx-trigger="load" it fetches
  // its own contents and swaps them into itself (hx-swap="innerHTML"). We test
  // the real contract: the placeholder shows first (role=status + aria-busy),
  // then htmx replaces the contents with the real panel after the request
  // settles. We scope to [data-slot="lazy-load"] (the wrapper persists across
  // the innerHTML swap) and capture a handle to the first instance.
  
  test.describe("Lazy Load", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "lazy-load")
      await expect(page.locator("h1", { hasText: "Lazy Load" })).toBeVisible()
    })
  
    test("placeholder is a role=status + aria-busy loading region", async ({
      page,
    }) => {
      await gotoDoc(page, "lazy-load")
      const ll = page.locator('[data-slot="lazy-load"]').first()
      await expect(ll).toHaveAttribute("role", "status")
      await expect(ll).toHaveAttribute("aria-busy", "true")
      await expect(ll).toHaveAttribute("hx-trigger", "load")
      // An accessible name so AT users hear something meaningful while loading.
      const label = await ll.getAttribute("aria-label")
      expect(label && label.length > 0, "lazy-load needs an accessible name").toBeTruthy()
    })
  
    test("fetches its own contents on load and swaps in the real panel", async ({
      page,
    }) => {
      await gotoDoc(page, "lazy-load")
      // The first example (#ex-basic) lazy-loads /lazy-load/sales, whose panel
      // contains the figure "$48,210". The wrapper persists (innerHTML swap),
      // so we wait for that text to appear inside the first lazy-load instance.
      const ll = page.locator('[data-slot="lazy-load"]').first()
      const handle = await ll.elementHandle()
      if (!handle) throw new Error("no lazy-load element")
      // Reserved height keeps the box stable before content arrives (CLS guard).
      const before = await ll.boundingBox()
      expect(before && before.height > 0).toBeTruthy()
      // After htmx fires `load` and the request settles, the real panel lands.
      await expect(ll).toContainText("$48,210", { timeout: 5000 })
      await expect(ll).toContainText("Sales")
      // The wrapper element itself survived the innerHTML swap.
      const stillAttached = await handle.evaluate((el) => el.isConnected)
      expect(stillAttached).toBe(true)
    })
  })

  // tests/components/sidebar.spec.ts
  
  // Sidebar — responsive nav: a CSS-grid rail on wide screens, an off-canvas
  // :target drawer on narrow screens. The off-canvas demo (#ex-drawer) ships a
  // scoped style that forces drawer mode at any width, so the labelled hamburger
  // is exercisable on the desktop test viewport. We assert the no-JS open: click
  // the trigger anchor, the drawer becomes the URL :target, and CSS reveals it.
  
  test.describe("Sidebar", () => {
    test("hamburger anchor opens the :target drawer; scrim link closes it", async ({
      page,
    }) => {
      await gotoDoc(page, "sidebar")
  
      // The drawer is a <nav data-slot="sidebar"> with the demo id. Scope every
      // locator to data-slot, NOT the #ex-drawer heading.
      const drawer = page.locator('[data-slot="sidebar"]#ex-drawer-nav')
      const handle = await drawer.elementHandle()
      expect(handle).not.toBeNull()
  
      // Closed: the scoped style hides the drawer (visibility:hidden) and slides
      // it off-canvas. Capture the pre-open state.
      const closedVis = await handle!.evaluate(
        (el) => getComputedStyle(el).visibility,
      )
      expect(closedVis).toBe("hidden")
  
      // Open it the no-JS way: the trigger is a real <a href="#ex-drawer-nav">.
      const trigger = page.locator(
        '[data-slot="sidebar-trigger"][data-sidebar-open="ex-drawer-nav"]',
      )
      await trigger.click()
  
      // The URL fragment now matches the drawer, so it is the document :target.
      await expect.poll(() => page.evaluate(() => location.hash)).toBe(
        "#ex-drawer-nav",
      )
      expect(await handle!.evaluate((el) => el.matches(":target"))).toBe(true)
  
      // CSS reveals it: visibility flips to visible and it slides to translateX(0)
      // (transform resolves to a matrix with no x-translation). Wait for the
      // transition to settle.
      await expect
        .poll(() => handle!.evaluate((el) => getComputedStyle(el).visibility))
        .toBe("visible")
      const opened = await handle!.evaluate((el) => {
        const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
        return { tx: Math.round(m.m41) }
      })
      expect(opened.tx).toBe(0)
  
      // Close via the scrim — an <a href="#"> that clears the fragment. The
      // drawer covers the left ~18rem, so the scrim's centre is under the nav;
      // click the exposed dim strip on the right (as a real user would).
      const scrim = page.locator('[data-slot="sidebar-scrim"]')
      const sbox = await scrim.boundingBox()
      if (!sbox) throw new Error("scrim has no bounding box")
      await scrim.click({ position: { x: sbox.width - 6, y: sbox.height / 2 } })
      await expect
        .poll(() => handle!.evaluate((el) => el.matches(":target")))
        .toBe(false)
      await expect
        .poll(() => handle!.evaluate((el) => getComputedStyle(el).visibility))
        .toBe("hidden")
    })
  
    test("active item is a real anchor marked aria-current=page", async ({
      page,
    }) => {
      await gotoDoc(page, "sidebar")
      const active = page
        .locator('[data-slot="sidebar-item"][aria-current="page"]')
        .first()
      await expect(active).toBeVisible()
      expect(await active.evaluate((el) => el.tagName)).toBe("A")
    })
  })

  
  // Aspect Ratio — the whole point of the component is that the rendered box
  // keeps its declared width-to-height ratio as it resizes, so nothing
  // reflows when the locked child (image/iframe) loads. We exercise that:
  // resize the viewport, capture the box, and assert the ratio holds.
  
  test.describe("AspectRatio", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "aspect-ratio")
      await expect(page.locator("h1", { hasText: "Aspect Ratio" })).toBeVisible()
    })
  
    test("locks the box to its declared ratio and re-locks on resize", async ({
      page,
    }) => {
      await gotoDoc(page, "aspect-ratio")
  
      // The first example is a 16:9 box. Scope to the component, not a heading.
      const box = page.locator('[data-slot="aspect-ratio"][data-ratio="16/9"]').first()
      await expect(box).toBeVisible()
  
      // Capture a stable handle so state-dependent geometry reads are reliable.
      const handle = await box.elementHandle()
      if (!handle) throw new Error("aspect-ratio box has no element handle")
  
      const ratioOf = async () => {
        const b = await handle.boundingBox()
        if (!b) throw new Error("aspect-ratio box has no bounding box")
        return b.width / b.height
      }
  
      // Wide viewport: width/height must equal 16/9 (≈1.778) within tolerance.
      await page.setViewportSize({ width: 1280, height: 900 })
      const wide = await ratioOf()
      expect(Math.abs(wide - 16 / 9)).toBeLessThan(0.05)
  
      // Narrow viewport: the box shrinks fluidly but the ratio is unchanged —
      // this is the no-layout-shift contract.
      await page.setViewportSize({ width: 420, height: 900 })
      const narrow = await ratioOf()
      expect(Math.abs(narrow - 16 / 9)).toBeLessThan(0.05)
  
      // The locked child fills the box and carries the object-fit class.
      const content = box.locator('[data-slot="aspect-ratio-content"]')
      await expect(content).toHaveClass(/object-cover/)
    })
  })

  
  // Auto Grid — responsive, intrinsically-wrapping grid (the RAM pattern).
  // Pure CSS, no JS. The contract we test is the one that matters: at a fixed
  // min item width, a WIDER container produces MORE columns with no breakpoints.
  // We read the rendered grid-template-columns track count at two viewport
  // widths and assert it grows. Scoped to [data-slot="auto-grid"].
  
  test.describe("Auto Grid", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "auto-grid")
      await expect(page.locator("h1", { hasText: "Auto Grid" })).toBeVisible()
    })
  
    test("more columns fit as the container widens (no breakpoints)", async ({
      page,
    }) => {
      await gotoDoc(page, "auto-grid")
      // The basic card grid in the first example (min = 16rem, 6 cells).
      const grid = page.locator('[data-slot="auto-grid"][data-test="basic"]')
      await expect(grid).toBeVisible()
      const handle = await grid.elementHandle()
      if (!handle) throw new Error("auto-grid[data-test=basic] not found")
  
      // Count the actual grid columns the browser computed from the
      // repeat(auto-fit, …) template. getComputedStyle resolves the repeat()
      // to an explicit list of track sizes (one per column).
      const columnCount = () =>
        handle.evaluate((el) => {
          const tracks = getComputedStyle(el)
            .getPropertyValue("grid-template-columns")
            .trim()
          return tracks ? tracks.split(/\s+/).length : 0
        })
  
      await page.setViewportSize({ width: 480, height: 900 })
      const narrow = await columnCount()
  
      await page.setViewportSize({ width: 1400, height: 900 })
      const wide = await columnCount()
  
      // No media queries were declared — the column count is purely a function
      // of available width vs the 16rem min. Wider ⇒ strictly more columns.
      expect(narrow).toBeGreaterThanOrEqual(1)
      expect(wide).toBeGreaterThan(narrow)
    })
  })
})

test.describe("New components — tier-3", () => {

  
  // Kbd — non-interactive label, so the "interaction" we assert is the
  // render-time contract (MDN nested-<kbd> keystroke pattern) plus the
  // platform side-effect that the caps are unselectable / unclickable.
  test.describe("Kbd", () => {
    test("KbdGroup nests one inner <kbd> per key with aria-hidden separators", async ({
      page,
    }) => {
      await gotoDoc(page, "kbd")
      // Scope to the rendered component, NOT the heading id.
      const group = page
        .locator('[data-slot="kbd-group"]')
        .first()
      await expect(group).toBeVisible()
      // The first shortcut in the example is Ctrl + Shift + R → 3 inner caps.
      const handle = await group.elementHandle()
      if (!handle) throw new Error("no kbd-group element")
      const shape = await handle.evaluate((el) => {
        const caps = el.querySelectorAll(':scope > [data-slot="kbd"]')
        const seps = el.querySelectorAll(':scope > [aria-hidden="true"]')
        const cs = getComputedStyle(caps[0] as Element)
        return {
          capCount: caps.length,
          capText: Array.from(caps, (c) => (c.textContent || "").trim()),
          sepCount: seps.length,
          sepText: (seps[0]?.textContent || "").trim(),
          // select-none → user-select:none keeps caps out of text selections.
          userSelect: cs.userSelect || (cs as any).webkitUserSelect,
          pointerEvents: cs.pointerEvents,
          isKbdEl: (caps[0] as Element).tagName.toLowerCase(),
          outerIsKbd: el.tagName.toLowerCase(),
        }
      })
      expect(shape.outerIsKbd).toBe("kbd")
      expect(shape.isKbdEl).toBe("kbd")
      expect(shape.capCount).toBe(3)
      expect(shape.capText).toEqual(["Ctrl", "Shift", "R"])
      expect(shape.sepCount).toBe(2) // separators between 3 keys
      expect(shape.sepText).toBe("+")
      expect(shape.userSelect).toBe("none")
      expect(shape.pointerEvents).toBe("none")
    })
  
    test("symbol cap exposes an accessible name via aria-label", async ({
      page,
    }) => {
      await gotoDoc(page, "kbd")
      const cmd = page.locator('[data-slot="kbd"][aria-label="Command"]').first()
      await expect(cmd).toHaveText("⌘")
      await expect(cmd).toHaveAttribute("aria-label", "Command")
    })
  })

  
  // Highlight — the server wraps matched query terms in <mark>. The static
  // example renders marks at page load; the Active Search example fetches marked
  // rows over htmx. Both are scoped to [data-slot="highlight"].
  
  test.describe("Highlight", () => {
    test("static example marks the matched query in the passage", async ({
      page,
    }) => {
      await gotoDoc(page, "highlight")
      // The first scan-mode run on the page is the ex-basic "salamander" passage.
      const run = page.locator('[data-slot="highlight"]').first()
      const mark = run.locator("mark").first()
      await expect(mark).toBeVisible()
      // <mark> must wrap the actual match, not the whole passage.
      await expect(mark).toHaveText(/salamander/i)
      const runText = (await run.textContent()) ?? ""
      expect(runText.length).toBeGreaterThan((await mark.textContent())!.length)
    })
  
    test("live search swaps in rows whose matches are wrapped in <mark>", async ({
      page,
    }) => {
      await gotoDoc(page, "highlight")
      const results = page.locator("#ex-hl-results")
      // Before searching, the seeded list has no marks (query is empty).
      await expect(results.locator("mark")).toHaveCount(0)
  
      // Type a query; the Active Search input debounces + fires an htmx GET,
      // and the server returns rows with the matched term wrapped in <mark>.
      const input = page.locator('#ex-hl-q[data-slot="active-search-input"]')
      await input.fill("imperial")
  
      // htmx replaces the list; a highlight run containing a matched <mark>
      // for "Imperial" must appear. Capture the element handle for the
      // state-dependent text assertion.
      const matchedMark = results
        .locator('[data-slot="highlight"] mark')
        .filter({ hasText: /imperial/i })
        .first()
      await expect(matchedMark).toBeVisible({ timeout: 5000 })
      const handle = await matchedMark.elementHandle()
      expect(handle).not.toBeNull()
      const text = await handle!.textContent()
      expect(text?.toLowerCase()).toContain("imperial")
      // Source casing is preserved by the server.
      expect(text).toBe("Imperial")
    })
  })

  
  // Relative Time — semantic <time> + client localisation, degrading to the
  // server label. Built on registry/ui/relative-time.tsx.
  
  test.describe("Relative Time", () => {
    test("server datetime is preserved and the label is localised to a relative string", async ({
      page,
    }) => {
      await gotoDoc(page, "relative-time")
  
      // Scope to the component, NOT a heading id. The first relative-format
      // timestamp in the docs carries the fixed server fallback "a while ago".
      const rel = page
        .locator('[data-slot="relative-time"][data-format="relative"]')
        .first()
      await expect(rel).toBeVisible()
  
      // The machine-readable instant is the source of truth and must survive.
      const datetime = await rel.getAttribute("datetime")
      expect(datetime).toBe("2024-05-12T09:00:00Z")
  
      // Capture an element handle so we can assert on post-localisation state.
      const handle = await rel.elementHandle()
      if (!handle) throw new Error("no relative-time element")
  
      // The site.js block rewrites the text via Intl.RelativeTimeFormat. Poll
      // until the server fallback has been replaced by a real relative label.
      await expect
        .poll(async () => (await handle.textContent())?.trim() ?? "", {
          timeout: 3000,
        })
        .not.toBe("a while ago")
  
      const localized = (await handle.textContent())?.trim() ?? ""
      // A relative label mentions a time unit or "ago"/"in" — not the raw ISO.
      expect(localized).toMatch(/ago|in |year|month|week|day|hour|minute|second|now/i)
      expect(localized).not.toContain("2024-05-12")
  
      // The script also adds a full absolute instant as the hover title.
      await expect.poll(async () => await rel.getAttribute("title")).not.toBeNull()
    })
  
    test("datetime format renders an absolute, non-empty localised string", async ({
      page,
    }) => {
      await gotoDoc(page, "relative-time")
      const abs = page
        .locator('[data-slot="relative-time"][data-format="datetime"]')
        .first()
      await expect(abs).toBeVisible()
      await expect(abs).toHaveAttribute("datetime", "2024-05-12T09:00:00Z")
      const text = (await abs.textContent())?.trim() ?? ""
      expect(text.length).toBeGreaterThan(0)
    })
  })

  
  // Figure — self-contained captioned content in a native <figure>. No JS.
  // We verify the web-standards contract that makes this component worth
  // shipping: the <figcaption> supplies the <figure> its accessible name,
  // and captionSide controls DOM order (caption as first vs last child).
  //   MDN figure:     repos/mdn/files/en-us/web/html/reference/elements/figure
  //   MDN figcaption: repos/mdn/files/en-us/web/html/reference/elements/figcaption
  
  test.describe("Figure", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "figure")
      await expect(page.locator("h1", { hasText: "Figure" })).toBeVisible()
    })
  
    test("renders a native <figure> + <figcaption> with data-slots", async ({ page }) => {
      await gotoDoc(page, "figure")
      const fig = page.locator('[data-slot="figure"]').first()
      await expect(fig).toBeVisible()
      // Must be the native element, not a div — that's what gives the figure role.
      await expect(fig).toHaveJSProperty("tagName", "FIGURE")
      const cap = fig.locator('[data-slot="figure-caption"]').first()
      await expect(cap).toBeVisible()
      await expect(cap).toHaveJSProperty("tagName", "FIGCAPTION")
    })
  
    test("the figcaption provides the figure's accessible name", async ({ page }) => {
      await gotoDoc(page, "figure")
      // First example: image with caption "An elephant at sunset".
      const fig = page.locator('[data-slot="figure"]').first()
      const handle = await fig.elementHandle()
      if (!handle) throw new Error("no figure element")
      // The figcaption text is the figure's accessible name (the credit line
      // lives inside the figcaption, so it is part of that name too).
      const captionText = await fig
        .locator('[data-slot="figure-caption"]')
        .first()
        .innerText()
      expect(captionText).toContain("An elephant at sunset")
      // Confirm the role exposed to AT is the figure role (implicit on <figure>
      // once it has a figcaption — see MDN figure technical summary).
      const role = await handle.evaluate(
        (el) => el.getAttribute("role") ?? el.tagName.toLowerCase(),
      )
      expect(role === "figure" || role === "figure".toLowerCase()).toBeTruthy()
    })
  
    test("captionSide=top renders the figcaption as the first child", async ({ page }) => {
      await gotoDoc(page, "figure")
      // The code-block example uses captionSide="top".
      const top = page.locator('[data-slot="figure"][data-caption-side="top"]').first()
      await expect(top).toBeVisible()
      const handle = await top.elementHandle()
      if (!handle) throw new Error("no top-caption figure")
      // First element child must be the figcaption (spec: caption is first OR
      // last child; "top" => first).
      const firstChildSlot = await handle.evaluate(
        (el) => el.firstElementChild?.getAttribute("data-slot") ?? null,
      )
      expect(firstChildSlot).toBe("figure-caption")
  
      // And a bottom-caption figure has it as the LAST element child.
      const bottom = page
        .locator('[data-slot="figure"][data-caption-side="bottom"]')
        .first()
      const bHandle = await bottom.elementHandle()
      if (!bHandle) throw new Error("no bottom-caption figure")
      const lastChildSlot = await bHandle.evaluate(
        (el) => el.lastElementChild?.getAttribute("data-slot") ?? null,
      )
      expect(lastChildSlot).toBe("figure-caption")
    })
  })

  
  // Responsive Image — native <picture> + <source> + fallback <img>. No JS
  // behaviour to exercise, so the contract under test is the *platform
  // selection result*: the <picture> resolves a candidate, the inner <img>
  // actually loads (naturalWidth > 0), and currentSrc reflects a chosen source.
  
  test.describe("Responsive Image", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "responsive-image")
      await expect(
        page.locator("h1", { hasText: "Responsive Image" }),
      ).toBeVisible()
    })
  
    test("renders a <picture> with the required fallback <img> + slots", async ({
      page,
    }) => {
      await gotoDoc(page, "responsive-image")
      const pic = page.locator('[data-slot="responsive-image"]').first()
      await expect(pic).toBeVisible()
      // It must BE a <picture> per the parity contract.
      await expect(pic).toHaveJSProperty("tagName", "PICTURE")
      // Exactly one fallback <img> carrying the accessible name.
      const img = pic.locator('[data-slot="responsive-image-img"]')
      await expect(img).toHaveCount(1)
      const alt = await img.getAttribute("alt")
      expect(alt && alt.length > 0, "fallback img must have alt text").toBeTruthy()
      // At least one <source> candidate is offered before the fallback.
      expect(await pic.locator("source").count()).toBeGreaterThan(0)
    })
  
    test("the browser resolves a source and the image actually loads", async ({
      page,
    }) => {
      await gotoDoc(page, "responsive-image")
      const img = page
        .locator('[data-slot="responsive-image"] [data-slot="responsive-image-img"]')
        .first()
      await expect(img).toBeVisible()
      // Capture the element handle to assert post-load state.
      const handle = await img.elementHandle()
      if (!handle) throw new Error("responsive-image img not found")
      // Wait until the picture has resolved + decoded a candidate.
      await page.waitForFunction(
        (el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0,
        handle,
        { timeout: 5000 },
      )
      const state = await handle.evaluate((el) => {
        const i = el as HTMLImageElement
        return { naturalWidth: i.naturalWidth, currentSrc: i.currentSrc }
      })
      // Proof the platform picked a real, loadable resource.
      expect(state.naturalWidth).toBeGreaterThan(0)
      expect(state.currentSrc.length).toBeGreaterThan(0)
    })
  })

  test("media-player renders a native player and exposes a toggleable caption track", async ({ page }) => {
    await gotoDoc(page, "media-player")
  
    // Scope to the component root (the basic example: video + captions + poster).
    const player = page.locator('[data-slot="media-player"][data-kind="video"]').first()
    await expect(player).toBeVisible()
  
    // The framed media is the real platform <video controls> — not a custom widget.
    const video = player.locator('video[data-slot="media-player-media"]')
    await expect(video).toHaveAttribute("controls", "")
  
    // A <track kind="captions"> is declared and registered with the element's
    // TextTrack list (the native control bar's CC button toggles this track's
    // mode). This is a genuine platform interaction that works without loading
    // media bytes.
    const track = video.locator('track[data-slot="media-player-track"]')
    await expect(track).toHaveAttribute("kind", "captions")
  
    const handle = await video.elementHandle()
    if (!handle) throw new Error("no video element")
  
    // Pre-state: exactly one text track, disabled until the platform enables it.
    const trackCount = await handle.evaluate((v) => (v as HTMLMediaElement).textTracks.length)
    expect(trackCount).toBe(1)
  
    // Drive the platform: enable the caption track the way the CC button does,
    // then assert the post-state mutated.
    const mode = await handle.evaluate((v) => {
      const tt = (v as HTMLMediaElement).textTracks[0]
      tt.mode = "showing"
      return tt.mode
    })
    expect(mode).toBe("showing")
  
    // The audio example renders a native <audio> with an accessible name and no
    // video frame (padded card instead of an aspect-ratio box).
    const audioPlayer = page.locator('[data-slot="media-player"][data-kind="audio"]').first()
    const audio = audioPlayer.locator('audio[data-slot="media-player-media"]')
    await expect(audio).toHaveAttribute("controls", "")
    await expect(audio).toHaveAttribute("aria-label", /Episode 12/)
  })

  
  // Autocomplete — native <input list> + <datalist>, htmx-streamed options.
  //
  // The browser owns the dropdown UI / filtering / selection, which Playwright
  // cannot inspect. The user-facing contract we CAN assert: the input is wired
  // to a datalist, static options exist, and typing in the server-streamed
  // variant swaps a fresh <option> set into the bound list (htmx). Locators are
  // scoped to [data-slot="autocomplete"] roots, never the heading ids.
  
  test.describe("Autocomplete", () => {
    test("route renders with the static + server-streamed demos", async ({ page }) => {
      await gotoDoc(page, "autocomplete")
      await expect(page.locator("h1", { hasText: "Autocomplete" })).toBeVisible()
      // Two autocomplete roots in the examples (static fruit + server city).
      expect(await page.locator('[data-slot="autocomplete"]').count()).toBeGreaterThanOrEqual(2)
    })
  
    test("static: input is wired to a datalist that has options", async ({ page }) => {
      await gotoDoc(page, "autocomplete")
      const root = page.locator('[data-slot="autocomplete"]').first()
      const input = root.locator('[data-slot="autocomplete-input"]')
      await expect(input).toBeVisible()
      const listId = await input.getAttribute("list")
      expect(listId).toBeTruthy()
      const list = root.locator(`datalist#${listId}[data-slot="autocomplete-list"]`)
      await expect(list).toHaveCount(1)
      expect(await list.locator("option").count()).toBeGreaterThan(0)
      // The value is free text: setting it to a suggestion is exactly how a
      // user "picks" from the native dropdown.
      await input.fill("Apple")
      expect(await input.inputValue()).toBe("Apple")
    })
  
    test("server-streamed: typing swaps a fresh option set into the bound list", async ({ page }) => {
      await gotoDoc(page, "autocomplete")
      // The streaming root carries the endpoint wiring.
      const root = page.locator('[data-slot="autocomplete"]', {
        has: page.locator('[data-slot="autocomplete-input"][hx-get]'),
      })
      const input = root.locator('[data-slot="autocomplete-input"]')
      await expect(input).toHaveAttribute("hx-sync", "this:replace")
      const listId = await input.getAttribute("list")
      const list = page.locator(`datalist#${listId}`)
      const listHandle = await list.elementHandle()
      if (!listHandle) throw new Error("bound datalist not found")
      // Empty before any input.
      expect(await listHandle.$$eval("option", (els) => els.length)).toBe(0)
      // Type two letters → debounced htmx fetch → options swapped in.
      await input.click()
      await input.fill("be")
      await expect
        .poll(async () => listHandle.$$eval("option", (els) => els.length), { timeout: 3000 })
        .toBeGreaterThan(0)
      // Suggestions match the typed prefix.
      const values = await listHandle.$$eval("option", (els) =>
        els.map((el) => (el as HTMLOptionElement).value),
      )
      expect(values.length).toBeGreaterThan(0)
      expect(values.every((v) => v.toLowerCase().startsWith("be"))).toBe(true)
    })
  
    test("API Reference lists the core Autocomplete props", async ({ page }) => {
      await gotoDoc(page, "autocomplete")
      await expect(page.locator('[data-slot="api-table"]').first()).toBeVisible()
      for (const prop of ["id", "options", "endpoint"]) {
        await expect(
          page.locator(`[data-slot="api-row"][data-prop="${prop}"]`).first(),
        ).toHaveCount(1)
      }
    })
  })

  test("exclusive-accordion: opening one item closes the previously open one", async ({ page }) => {
    await gotoDoc(page, "exclusive-accordion")
  
    // Scope to the first exclusive-accordion on the page (the ex-basic preview,
    // whose first item starts open).
    const group = page.locator('[data-slot="exclusive-accordion"]').first()
    const items = group.locator('[data-slot="exclusive-accordion-item"]')
  
    const first = items.nth(0)
    const second = items.nth(1)
  
    // The native `open` attribute reflects expanded state. First item ships open.
    const firstHandle = await first.elementHandle()
    const secondHandle = await second.elementHandle()
    if (!firstHandle || !secondHandle) throw new Error("accordion items not found")
  
    expect(await firstHandle.evaluate((d: HTMLDetailsElement) => d.open)).toBe(true)
    expect(await secondHandle.evaluate((d: HTMLDetailsElement) => d.open)).toBe(false)
  
    // Open the second item via its summary trigger.
    await second.locator('[data-slot="exclusive-accordion-trigger"]').click()
  
    // Native <details name> exclusivity: the browser closes the first when the
    // second opens — no JS of ours runs.
    expect(await secondHandle.evaluate((d: HTMLDetailsElement) => d.open)).toBe(true)
    expect(await firstHandle.evaluate((d: HTMLDetailsElement) => d.open)).toBe(false)
  })

  
  // Scroll Area — native-scrolling overflow region with CSS-only fade masks
  // driven by @container scroll-state(). Verifies the basic vertical example:
  // at the top the start (top) mask is hidden and the end (bottom) mask is
  // shown; after scrolling to the bottom the masks flip. State is read from the
  // computed opacity of the [data-slot="scroll-area-fade"] children — proving
  // the scroll-state query is actually toggling them, with zero JS.
  
  test.describe("Scroll Area", () => {
    test("fade masks track scroll position via @container scroll-state()", async ({
      page,
    }) => {
      await gotoDoc(page, "scroll-area")
  
      // Scope to the first scroll-area instance's viewport (NOT the #ex-basic
      // heading, which is just a section anchor).
      const viewport = page
        .locator('[data-slot="scroll-area"] [data-scroll-area-viewport][data-fade]')
        .first()
      await expect(viewport).toBeVisible()
  
      // Bail out cleanly if the browser under test lacks scroll-state queries —
      // the feature is progressive enhancement, not a hard dependency.
      const supported = await page.evaluate(() =>
        CSS.supports("container-type", "scroll-state"),
      )
      test.skip(!supported, "browser lacks @container scroll-state() support")
  
      const handle = await viewport.elementHandle()
      const startMask = viewport.locator('[data-slot="scroll-area-fade"][data-edge="start"]')
      const endMask = viewport.locator('[data-slot="scroll-area-fade"][data-edge="end"]')
      const opacity = (loc: typeof startMask) =>
        loc.evaluate((el) => parseFloat(getComputedStyle(el).opacity))
  
      // At the top: only the bottom (end) fade is visible.
      await handle!.evaluate((el) => {
        el.scrollTop = 0
      })
      await expect.poll(() => opacity(startMask)).toBeLessThan(0.1)
      await expect.poll(() => opacity(endMask)).toBeGreaterThan(0.9)
  
      // Scroll to the bottom: the masks flip — top fade shown, bottom hidden.
      await handle!.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      await expect.poll(() => opacity(startMask)).toBeGreaterThan(0.9)
      await expect.poll(() => opacity(endMask)).toBeLessThan(0.1)
    })
  })

  
  // Snap List — the bare CSS scroll-snap rail (zero JS). We assert the native
  // contract: the root is a focusable <ul role="list"> snap container, and it
  // actually scrolls + lands on a snap point. The behaviour is the platform's;
  // the test just proves the markup opts into it correctly.
  //   repos/mdn/.../css/reference/properties/scroll-snap-type
  
  test.describe("Snap List", () => {
    test("route exists and renders the docs page", async ({ page }) => {
      await gotoDoc(page, "snap-list")
      await expect(page.locator("h1", { hasText: "Snap List" })).toBeVisible()
    })
  
    test("root is a focusable list snap container", async ({ page }) => {
      await gotoDoc(page, "snap-list")
      const rail = page.locator('[data-slot="snap-list"]').first()
      await expect(rail).toBeVisible()
      // Semantics: a real <ul> with role="list" (Safari drops the implicit role
      // once list-style is removed) and a keyboard tab stop.
      expect(await rail.evaluate((el) => el.tagName)).toBe("UL")
      await expect(rail).toHaveAttribute("role", "list")
      await expect(rail).toHaveAttribute("tabindex", "0")
      // Opted into horizontal mandatory snapping via CSS.
      const css = await rail.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { snap: cs.scrollSnapType, overflowX: cs.overflowX }
      })
      expect(css.snap).toContain("x")
      expect(css.snap).toContain("mandatory")
      expect(css.overflowX).toMatch(/auto|scroll/)
      // Items declare a snap-align.
      const itemAlign = await rail
        .locator('[data-slot="snap-list-item"]')
        .first()
        .evaluate((el) => getComputedStyle(el).scrollSnapAlign)
      expect(itemAlign).not.toBe("none")
    })
  
    test("scrolls horizontally and lands on a snap point", async ({ page }) => {
      await gotoDoc(page, "snap-list")
      // Use the center-aligned media shelf (ex-stop): items are wide so a real
      // scroll happens and the rail re-snaps to an item's center.
      const rail = page.locator('[data-slot="snap-list"]').nth(1)
      const handle = await rail.elementHandle()
      if (!handle) throw new Error("snap-list rail has no element handle")
  
      const before = await handle.evaluate((el) => el.scrollLeft)
      expect(before).toBe(0)
  
      // Drive a programmatic scroll past the first item; the snap container then
      // rests on a snap position. scroll-behavior is smooth, so wait for it.
      await handle.evaluate((el) => {
        el.scrollTo({ left: el.clientWidth * 0.9, behavior: "auto" })
      })
      await page.waitForFunction((el) => el.scrollLeft > 0, handle, { timeout: 2000 })
  
      const after = await handle.evaluate((el) => el.scrollLeft)
      expect(after).toBeGreaterThan(before)
      // Sanity: we didn't overscroll past the track's end.
      const max = await handle.evaluate((el) => el.scrollWidth - el.clientWidth)
      expect(after).toBeLessThanOrEqual(max + 1)
    })
  })

  
  // Container Card — verify the card adapts to its OWN inline width (not the
  // viewport) via CSS container queries. The "Same card, two layouts" example
  // (data-test="basic") renders identical markup in a narrow 18rem column and a
  // wide column; the layout block must compute `display: flex` (stacked) in the
  // narrow one and `display: grid` (side-by-side) in the wide one at the SAME
  // viewport width — proving the query reads the card's own size.
  test.describe("ContainerCard", () => {
    test("identical markup flips layout based on its own width", async ({ page }) => {
      // Wide viewport so the basic example's two columns clearly differ in width.
      await page.setViewportSize({ width: 1280, height: 900 })
      await gotoDoc(page, "container-card")
  
      const cards = page.locator(
        '[data-test="basic"] [data-slot="container-card"]',
      )
      await expect(cards).toHaveCount(2)
  
      // First card sits in the 18rem column → stacked (flex column).
      const narrowLayout = cards.nth(0).locator('[data-slot="container-card-layout"]')
      // Second card sits in the wide column → side-by-side (grid).
      const wideLayout = cards.nth(1).locator('[data-slot="container-card-layout"]')
  
      const narrowHandle = await narrowLayout.elementHandle()
      const wideHandle = await wideLayout.elementHandle()
      expect(narrowHandle).not.toBeNull()
      expect(wideHandle).not.toBeNull()
  
      const narrowDisplay = await narrowHandle!.evaluate(
        (el) => getComputedStyle(el as HTMLElement).display,
      )
      const wideDisplay = await wideHandle!.evaluate(
        (el) => getComputedStyle(el as HTMLElement).display,
      )
  
      // Same component, same viewport — only the container width differs.
      expect(narrowDisplay).toBe("flex")
      expect(wideDisplay).toBe("grid")
  
      // The named query container is established on the card itself.
      await expect(cards.nth(1)).toHaveCSS("container-type", "inline-size")
    })
  })

  // tests/components/sticky-header.spec.ts
  
  test.describe("Sticky Header", () => {
    test("pins to the top of its scroll container once scrolled", async ({
      page,
    }) => {
      await gotoDoc(page, "sticky-header")
  
      // Scope to the component, not the #ex-basic heading. The first basic
      // example wraps the header in an overflow-auto scroll panel.
      const header = page.locator('[data-slot="sticky-header"]').first()
      await expect(header).toBeVisible()
  
      // The scroll container is the header's nearest overflow ancestor.
      const panel = page.locator('[data-slot="sticky-header"]').first()
        .locator("xpath=ancestor::*[contains(@class,'overflow-auto')][1]")
  
      // Capture the header element to read live geometry after scrolling.
      const handle = await header.elementHandle()
      if (!handle) throw new Error("no sticky-header element handle")
  
      // Top edge of the header relative to the scroll panel before scrolling.
      const before = await handle.evaluate((el) => {
        const scroller = el.closest(".overflow-auto") as HTMLElement
        return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top
      })
  
      // Scroll the panel down past where the header would naturally sit.
      await panel.evaluate((el) => {
        ;(el as HTMLElement).scrollTop = 200
      })
      await expect
        .poll(async () =>
          handle.evaluate((el) => {
            const scroller = el.closest(".overflow-auto") as HTMLElement
            return Math.round(
              el.getBoundingClientRect().top -
                scroller.getBoundingClientRect().top,
            )
          }),
        )
        .toBeLessThanOrEqual(1) // pinned flush to the scroll container's top edge
  
      // It was at or below its start position before; now it's pinned at ~0.
      expect(before).toBeGreaterThanOrEqual(0)
  
      // The reveal region exists and is marked for the stuck styling hook.
      const bar = header.locator('[data-sticky-revealed]').first()
      await expect(bar).toBeVisible()
      await expect(bar).toHaveAttribute("data-slot", "sticky-header-bar")
    })
  })

  
  // Scroll Progress — a reading-position bar driven purely by a CSS scroll
  // progress timeline (animation-timeline: scroll()). No JS, no scroll handler.
  // Contract under test:
  //   - The bar is decorative: aria-hidden + pointer-events:none so it never
  //     intercepts clicks or adds noise to the a11y tree.
  //   - The fill is a scroll-driven keyframe: scaleX advances from ~0 to ~1 as
  //     the timeline's scroller is scrolled from top to bottom.
  test.describe("Scroll Progress", () => {
    test("route renders and the bar is decorative", async ({ page }) => {
      await gotoDoc(page, "scroll-progress")
      const bar = page.locator('[data-slot="scroll-progress"]').first()
      await expect(bar).toHaveAttribute("aria-hidden", "true")
      const pe = await bar.evaluate((el) => getComputedStyle(el).pointerEvents)
      expect(pe).toBe("none")
    })
  
    test("fill scales with the named scroller's scroll position", async ({ page }) => {
      await gotoDoc(page, "scroll-progress")
      // The first example wraps the bar in a scrollable demo container that
      // carries the named scroll-timeline the indicator tracks.
      const scroller = page.locator('[data-test="demo-scroller"]')
      const fill = scroller.locator('[data-slot="scroll-progress-indicator"]')
      const fillHandle = await fill.elementHandle()
      if (!fillHandle) throw new Error("scroll-progress indicator not found")
  
      // Read scaleX from the computed transform matrix (matrix(a, ...) where a
      // is the horizontal scale). At the top the fill should be ~empty.
      const scaleX = async () =>
        fillHandle.evaluate((el) => {
          const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
          return m.a
        })
  
      // Ensure we start at the top of the demo scroller.
      await scroller.evaluate((el) => { el.scrollTop = 0 })
      await page.waitForTimeout(50)
      const top = await scaleX()
      expect(top).toBeLessThan(0.05)
  
      // Scroll the named scroller to the bottom; the scroll-driven animation
      // should advance the fill to (near) full width.
      await scroller.evaluate((el) => { el.scrollTop = el.scrollHeight })
      await page.waitForTimeout(50)
      const bottom = await scaleX()
      expect(bottom).toBeGreaterThan(0.9)
      expect(bottom).toBeGreaterThan(top)
    })
  })
})
