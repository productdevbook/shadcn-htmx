import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Tabs / Accordion / Pagination — deep walkthrough beyond the smoke tests.

test.describe("Tabs (deep)", () => {
  test("clicked panel becomes visible; others stay hidden", async ({
    page,
  }) => {
    await gotoDoc(page, "tabs")
    const triggers = page.locator(
      '#ex-basic-tabs [data-tab-trigger]:not([disabled])',
    )
    const panels = page.locator('#ex-basic-tabs [data-tab-panel]')
    const first = triggers.first()
    const second = triggers.nth(1)
    await second.click()
    // The panel whose value matches the active trigger should be visible.
    const activeValue = await second.getAttribute("data-tab-trigger")
    const activePanel = panels.locator(`[data-tab-panel="${activeValue}"]`)
    // panels.locator(...) chains badly; reuse direct locator instead.
    const visiblePanel = page.locator(
      `#ex-basic-tabs [data-tab-panel="${activeValue}"]`,
    )
    await expect(visiblePanel).toBeVisible()
    // Other panels should be hidden via [hidden] attribute.
    const total = await panels.count()
    let hiddenCount = 0
    for (let i = 0; i < total; i++) {
      const p = panels.nth(i)
      const v = await p.getAttribute("data-tab-panel")
      if (v !== activeValue) {
        const isHidden = await p.evaluate((el) => el.hasAttribute("hidden"))
        if (isHidden) hiddenCount++
      }
    }
    expect(hiddenCount).toBe(total - 1)
  })

  test("disabled trigger is skipped by arrow nav", async ({ page }) => {
    await gotoDoc(page, "tabs")
    // Mark a trigger as disabled at runtime and assert arrow nav skips it.
    await page.evaluate(() => {
      const triggers = document.querySelectorAll('#ex-basic-tabs [data-tab-trigger]')
      ;(triggers[1] as HTMLButtonElement).disabled = true
    })
    const triggers = page.locator(
      '#ex-basic-tabs [data-tab-trigger]:not([disabled])',
    )
    await triggers.first().focus()
    await page.keyboard.press("ArrowRight")
    // Should jump over the disabled middle trigger to the 3rd one
    // (which is index 1 in the filtered list).
    await expect(triggers.nth(1)).toBeFocused()
  })
})

test.describe("Accordion (deep)", () => {
  test("single-expand: opening one closes the others", async ({ page }) => {
    await gotoDoc(page, "accordion")
    const items = page.locator(
      '#ex-acc-single > [data-slot="accordion-item"]',
    )
    // Open item 2.
    await items.nth(1).locator('[data-slot="accordion-trigger"]').click()
    // Item 1 (originally open) should now be closed by the browser's
    // name="..."  exclusive group.
    const item0open = await items.nth(0).evaluate((el) => (el as HTMLDetailsElement).open)
    const item1open = await items.nth(1).evaluate((el) => (el as HTMLDetailsElement).open)
    expect(item1open).toBe(true)
    expect(item0open).toBe(false)
  })

  test("multi-expand: independently toggleable", async ({ page }) => {
    await gotoDoc(page, "accordion")
    const items = page.locator(
      '#ex-acc-multi > [data-slot="accordion-item"]',
    )
    // Confirm both 'a' and 'b' start open (defaultOpen).
    const openA = await items.nth(0).evaluate((el) => (el as HTMLDetailsElement).open)
    const openB = await items.nth(1).evaluate((el) => (el as HTMLDetailsElement).open)
    expect(openA).toBe(true)
    expect(openB).toBe(true)
    // Toggling one doesn't close the other.
    await items.nth(0).locator('[data-slot="accordion-trigger"]').click()
    expect(await items.nth(0).evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false)
    expect(await items.nth(1).evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true)
  })
})

test.describe("Pagination (deep)", () => {
  test("Previous on first page is aria-disabled", async ({ page }) => {
    await gotoDoc(page, "pagination")
    const host = page.locator("#ex-pag-host")
    // Page 1 is the initial state.
    const prev = host.locator('[data-slot="pagination-prev"]').first()
    await expect(prev).toHaveAttribute("aria-disabled", "true")
  })

  test("Next on last page is aria-disabled after navigating there", async ({
    page,
  }) => {
    await gotoDoc(page, "pagination")
    const host = page.locator("#ex-pag-host")
    // Click page 5 (the last in the demo).
    await host.locator('[data-test="page-5"]').click()
    await expect(host.locator('[aria-current="page"]')).toHaveText("5")
    const next = host.locator('[data-slot="pagination-next"]').first()
    await expect(next).toHaveAttribute("aria-disabled", "true")
  })

  test("clicking ellipsis does nothing (it is aria-hidden decoration)", async ({
    page,
  }) => {
    await gotoDoc(page, "pagination")
    const host = page.locator("#ex-pag-host")
    const ellipsis = host.locator('[data-slot="pagination-ellipsis"]')
    if ((await ellipsis.count()) > 0) {
      const before = await host
        .locator('[aria-current="page"]')
        .textContent()
      await ellipsis.first().click({ force: true })
      // No state change.
      const after = await host
        .locator('[aria-current="page"]')
        .textContent()
      expect(after).toBe(before)
    }
  })
})
