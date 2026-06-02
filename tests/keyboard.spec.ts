import { expect, test } from "@playwright/test"
import { gotoDoc, openPopoverTrigger } from "./fixtures"

// Keyboard contract — APG conformance for the interactive components.
// These catch regressions like "Arrow keys stopped cycling tabs" or
// "ESC no longer dismisses the menu" that visual tests would miss.

test.describe("Tabs (APG)", () => {
  test("arrow keys cycle triggers; Home/End jump to ends", async ({
    page,
  }) => {
    await gotoDoc(page, "tabs")
    const trigger = page.locator(
      '#ex-basic-tabs [data-tab-trigger]:not([disabled])',
    )
    const first = trigger.first()
    await first.focus()
    await page.keyboard.press("ArrowRight")
    await expect(trigger.nth(1)).toBeFocused()
    await page.keyboard.press("End")
    await expect(trigger.last()).toBeFocused()
    await page.keyboard.press("Home")
    await expect(first).toBeFocused()
  })
})

test.describe("Accordion (APG)", () => {
  test("ArrowDown / ArrowUp / Home / End move focus across summaries", async ({
    page,
  }) => {
    await gotoDoc(page, "accordion")
    const summaries = page.locator(
      '#ex-acc-single [data-slot="accordion-trigger"]',
    )
    await summaries.first().focus()
    await page.keyboard.press("ArrowDown")
    await expect(summaries.nth(1)).toBeFocused()
    await page.keyboard.press("End")
    await expect(summaries.last()).toBeFocused()
    await page.keyboard.press("Home")
    await expect(summaries.first()).toBeFocused()
  })
})

test.describe("DropdownMenu (APG)", () => {
  test("Arrow keys cycle; Home/End jump; type-to-find lands on matching item", async ({
    page,
  }) => {
    await gotoDoc(page, "dropdown-menu")
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    const items = page.locator('#ex-ddm-1 [role="menuitem"]')
    // First item is auto-focused on open (see DropdownMenu boot).
    await expect(items.first()).toBeFocused()

    await page.keyboard.press("ArrowDown")
    await expect(items.nth(1)).toBeFocused()
    await page.keyboard.press("End")
    await expect(items.last()).toBeFocused()
    await page.keyboard.press("Home")
    await expect(items.first()).toBeFocused()

    // Type-to-find: focus jumps to "Settings" when we type "s".
    await page.keyboard.press("s")
    await expect(page.locator('#ex-ddm-1 [role="menuitem"]', { hasText: "Settings" })).toBeFocused()
  })

  test("ESC closes the menu (native popover)", async ({ page }) => {
    await gotoDoc(page, "dropdown-menu")
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    await page.keyboard.press("Escape")
    await expect(page.locator("#ex-ddm-1")).not.toBeVisible()
  })
})

test.describe("Tooltip (APG)", () => {
  // Regression: pressing ESC suppressed the tooltip but the suppress
  // flag was only cleared on mouseleave — keyboard-only users who Tab
  // away and Tab back never saw the tooltip again. Fixed by clearing
  // on focusout too.
  test("ESC + Tab away + Tab back re-reveals the tooltip", async ({
    page,
  }) => {
    await gotoDoc(page, "tooltip")
    // The Focus+ESC example has two tooltip triggers side by side.
    const t1 = page.locator("#ex-tt-kb-1")
    const t2 = page.locator("#ex-tt-kb-2")
    const btn1 = t1.locator("xpath=..").locator("button").first()
    const btn2 = t2.locator("xpath=..").locator("button").first()

    // 1. Focus first trigger → tooltip becomes visible (opacity 1).
    await btn1.focus()
    await expect.poll(() => t1.evaluate((el) => getComputedStyle(el).opacity)).toBe("1")

    // 2. ESC → tooltip hidden, focus leaves trigger.
    await page.keyboard.press("Escape")
    await expect.poll(() => t1.evaluate((el) => getComputedStyle(el).opacity)).toBe("0")

    // 3. Tab to the next trigger → moves focus AWAY from first wrapper.
    await btn2.focus()

    // 4. Tab back to first trigger → tooltip should reveal AGAIN.
    await btn1.focus()
    await expect.poll(() => t1.evaluate((el) => getComputedStyle(el).opacity)).toBe("1")
  })
})

test.describe("Dialog", () => {
  test("ESC closes the dialog", async ({ page }) => {
    await gotoDoc(page, "dialog")
    // Open the first demo dialog.
    const trigger = page.locator('[data-dialog-trigger]').first()
    await trigger.click()
    // Wait for any dialog[open] to appear.
    const dialog = page.locator("dialog[open]").first()
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
  })
})
