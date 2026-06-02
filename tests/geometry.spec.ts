import { expect, test } from "@playwright/test"
import { expectAnchored, gotoDoc, openPopoverTrigger, rect } from "./fixtures"

// Geometry tests — assert anchored floating elements (popover, dropdown,
// tooltip) sit in the right place relative to their trigger.
//
// These catch the exact class of bug we hit in development:
//   - Dropdown menu rendering off-canvas because the centred-fallback CSS
//     beat the trigger anchoring.
//   - Tooltip wrapper width including the absolute child, breaking
//     horizontal centring.

test.describe("Popover", () => {
  test("opens anchored below its trigger", async ({ page }) => {
    await gotoDoc(page, "popover")
    const trigger = page.locator('[popovertarget="ex-pop-1"]').first()
    await openPopoverTrigger(page, '[popovertarget="ex-pop-1"]')
    const popover = page.locator("#ex-pop-1")
    await expectAnchored(trigger, popover, "bottom")
  })
})

test.describe("DropdownMenu", () => {
  test("menu opens anchored below trigger and focuses first item", async ({
    page,
  }) => {
    await gotoDoc(page, "dropdown-menu")
    const trigger = page.locator('[popovertarget="ex-ddm-1"]').first()
    await openPopoverTrigger(page, '[popovertarget="ex-ddm-1"]')
    const menu = page.locator("#ex-ddm-1")
    await expectAnchored(trigger, menu, "bottom")

    // APG: first menuitem receives focus on open.
    await expect(menu.locator('[role="menuitem"]').first()).toBeFocused()
  })
})

test.describe("Tooltip", () => {
  // The /docs/tooltip Sides example has four tooltips, one per side.
  const cases: Array<{
    id: string
    side: "top" | "right" | "bottom" | "left"
  }> = [
    { id: "ex-tt-t", side: "top" },
    { id: "ex-tt-r", side: "right" },
    { id: "ex-tt-b", side: "bottom" },
    { id: "ex-tt-l", side: "left" },
  ]

  for (const { id, side } of cases) {
    test(`${side} side is anchored to its trigger`, async ({ page }) => {
      await gotoDoc(page, "tooltip")
      const tooltip = page.locator(`#${id}`)
      // The trigger is the previous sibling button inside the wrapper.
      const trigger = tooltip.locator(":scope ~ button, :scope >> xpath=../button").first()
      // Force-show the tooltip so we can measure (hover is flaky in
      // headless geometry tests).
      await tooltip.evaluate((el) => {
        ;(el as HTMLElement).style.opacity = "1"
      })
      await expectAnchored(trigger, tooltip, side)
    })
  }

  test("wrapper shrink-wraps the trigger (not the tooltip)", async ({ page }) => {
    // The exact bug we hit: with inline-flex, the absolute tooltip child
    // contributed to wrapper width, throwing off horizontal centring.
    await gotoDoc(page, "tooltip")
    const tooltip = page.locator("#ex-tt-t")
    const wrapper = tooltip.locator("xpath=..")
    const trigger = wrapper.locator("button").first()

    const w = await rect(wrapper)
    const b = await rect(trigger)
    // Wrapper must equal trigger width (tolerate 1px rounding).
    expect(Math.abs(w.width - b.width)).toBeLessThanOrEqual(1)
  })
})
