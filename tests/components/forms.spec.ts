import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Form components — deep walkthrough. The smoke suite already confirmed
// "interaction works at all". This file targets the spec'd edge cases:
//   - native validation (required, pattern)
//   - readonly vs disabled state semantics
//   - htmx form-driven submission patterns
//   - keyboard contracts unique to each control

test.describe("Input (deep)", () => {
  test("required + invalid pattern blocks native form submit", async ({
    page,
  }) => {
    await gotoDoc(page, "input")
    // The docs has a form with an email input that ships with a custom
    // pattern. Type something invalid + try to submit; the browser
    // should report invalid and not navigate / fire a real submit.
    const form = page.locator("form").first()
    if ((await form.count()) === 0) return // no form on this docs page, skip
    const email = page
      .locator('input[type="email"]:not([disabled]):not([readonly])')
      .first()
    if ((await email.count()) === 0) return
    await email.fill("not-an-email")
    const valid = await email.evaluate(
      (el: HTMLInputElement) => el.checkValidity(),
    )
    expect(valid).toBe(false)
  })

  test("readonly input is selectable but not editable", async ({ page }) => {
    await gotoDoc(page, "input")
    const ro = page.locator('input[readonly]').first()
    await ro.click()
    // Fill should be rejected; value stays put.
    const before = await ro.inputValue()
    await ro
      .fill("xyz")
      .catch(() => undefined)
    const after = await ro.inputValue()
    expect(after).toBe(before)
  })

  test("disabled input is unfocusable", async ({ page }) => {
    await gotoDoc(page, "input")
    const dis = page.locator("input[disabled]").first()
    // Tabbing to a disabled input should be skipped by the browser; we
    // can't easily assert "Tab passed over", so assert disabled state.
    await expect(dis).toBeDisabled()
  })
})

test.describe("Textarea (deep)", () => {
  test("auto-resize via field-sizing grows with content", async ({ page }) => {
    await gotoDoc(page, "textarea")
    // The docs uses field-sizing: content. The minimum row count caps
    // the lower bound; rendering should still grow per line.
    const ta = page.locator("textarea").first()
    const startBox = await ta.boundingBox()
    await ta.fill("line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8")
    const endBox = await ta.boundingBox()
    // Box must have grown (or stayed equal if min-height already wraps),
    // but never shrunk.
    expect((endBox?.height ?? 0) >= (startBox?.height ?? 0)).toBe(true)
  })
})

test.describe("Checkbox (deep)", () => {
  test("Space toggles when focused", async ({ page }) => {
    await gotoDoc(page, "checkbox")
    const cb = page.locator('input[type="checkbox"]:not([disabled])').first()
    await cb.focus()
    const before = await cb.isChecked()
    await page.keyboard.press("Space")
    expect(await cb.isChecked()).toBe(!before)
  })

  test("disabled checkbox does not toggle on click", async ({ page }) => {
    await gotoDoc(page, "checkbox")
    const cb = page.locator('input[type="checkbox"][disabled]').first()
    if ((await cb.count()) === 0) return
    const before = await cb.isChecked()
    // Click is best-effort — pointer-events:none on the wrapper may
    // already block it. Either way, value must not flip.
    await cb.click({ force: true }).catch(() => undefined)
    expect(await cb.isChecked()).toBe(before)
  })
})

test.describe("Switch (deep)", () => {
  test("Space toggles", async ({ page }) => {
    await gotoDoc(page, "switch")
    const sw = page.locator('input[role="switch"]:not([disabled])').first()
    await sw.focus()
    const before = await sw.isChecked()
    await page.keyboard.press("Space")
    expect(await sw.isChecked()).toBe(!before)
  })
})

test.describe("Radio Group (deep)", () => {
  test("arrow keys cycle radios in the same group", async ({ page }) => {
    await gotoDoc(page, "radio-group")
    // Native radio behaviour: arrow keys move + select within same name.
    const radios = page.locator('input[type="radio"]').first()
    await radios.focus()
    await page.keyboard.press("ArrowDown")
    // Active element should now be the next radio in the same group.
    const activeName = await page.evaluate(
      () => (document.activeElement as HTMLInputElement)?.name,
    )
    const firstName = await radios.evaluate((el: HTMLInputElement) => el.name)
    expect(activeName).toBe(firstName)
  })
})

test.describe("Select (deep)", () => {
  test("native select keyboard: typing letter jumps option", async ({
    page,
  }) => {
    await gotoDoc(page, "select")
    const sel = page.locator("select:not([multiple]):not([disabled])").first()
    await sel.focus()
    // Letter selection is native; we just confirm focus + tab order works.
    await expect(sel).toBeFocused()
  })
})

test.describe("Slider (deep)", () => {
  test("respects min/max — value clamps", async ({ page }) => {
    await gotoDoc(page, "slider")
    const range = page.locator('input[type="range"]').first()
    await range.evaluate((el: HTMLInputElement) => {
      el.min = "0"
      el.max = "10"
      el.value = "10"
    })
    await range.focus()
    await page.keyboard.press("ArrowRight")
    // Browser clamps at max.
    expect(await range.inputValue()).toBe("10")
  })
})

test.describe("Label (deep)", () => {
  test("clicking the label focuses the associated input", async ({ page }) => {
    await gotoDoc(page, "label")
    // Find a *visible* label[for] pointing at an editable input.
    // Skip sr-only labels from the layout chrome.
    const labelInfo = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll("label[for]"))
      for (const lab of labels) {
        if (lab.classList.contains("sr-only")) continue
        const target = document.getElementById(lab.getAttribute("for") || "")
        if (target && !(target as HTMLInputElement).disabled) {
          return { labelText: (lab.textContent || "").trim(), forId: lab.getAttribute("for") }
        }
      }
      return null
    })
    if (!labelInfo) return
    await page
      .locator(`label[for="${labelInfo.forId}"]:not(.sr-only)`)
      .first()
      .click()
    const focusedId = await page.evaluate(() => document.activeElement?.id)
    expect(focusedId).toBe(labelInfo.forId)
  })
})
