import { expect, test } from "@playwright/test"
import { gotoDoc, openPopoverTrigger } from "../fixtures"

// DropdownMenu — deep walkthrough beyond the smoke check.

test.describe("DropdownMenu (deep)", () => {
  test("click on item closes the menu and runs the action", async ({
    page,
  }) => {
    await gotoDoc(page, "dropdown-menu")
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    const menu = page.locator("#ex-ddm-1")
    // Click a non-destructive item.
    await menu.locator('[role="menuitem"]', { hasText: "Profile" }).click()
    // After click, the popover should close.
    await expect(menu).not.toBeVisible()
  })

  test("click outside closes the menu", async ({ page }) => {
    await gotoDoc(page, "dropdown-menu")
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    const menu = page.locator("#ex-ddm-1")
    // Click on the page heading, well outside.
    await page.locator("h1", { hasText: "Dropdown Menu" }).click()
    await expect(menu).not.toBeVisible()
  })

  test("focus returns to trigger after ESC", async ({ page }) => {
    await gotoDoc(page, "dropdown-menu")
    const trigger = page.locator('[popovertarget="ex-ddm-1"]').first()
    await trigger.click()
    const menu = page.locator("#ex-ddm-1")
    await expect(menu).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(menu).not.toBeVisible()
    // Native popover closes on ESC and restores focus to the invoker.
    await expect(trigger).toBeFocused()
  })

  test("data-disabled menuitem is skipped by arrow navigation", async ({
    page,
  }) => {
    // Inject a disabled item into the open menu and verify arrows skip it.
    await gotoDoc(page, "dropdown-menu")
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    await page.evaluate(() => {
      const menu = document.getElementById("ex-ddm-1")!
      const items = menu.querySelectorAll('[role="menuitem"]')
      // Mark the 2nd item disabled.
      items[1].setAttribute("data-disabled", "true")
    })
    // From first item, ArrowDown should skip the disabled one.
    const items = page.locator('#ex-ddm-1 [role="menuitem"]')
    await items.first().focus()
    await page.keyboard.press("ArrowDown")
    await expect(items.nth(2)).toBeFocused()
  })
})
