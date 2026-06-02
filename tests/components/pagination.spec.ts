import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Pagination — APG pattern: a <nav> landmark with role="navigation" (implicit),
// aria-label describing the navigation, and aria-current="page" on the active
// page link. Previous/Next get aria-label so AT users hear "Previous page"
// rather than "<".

test.describe("Pagination", () => {
  test("route exists and renders", async ({ page }) => {
    await gotoDoc(page, "pagination")
    await expect(page.locator("h1", { hasText: "Pagination" })).toBeVisible()
  })

  test("nav landmark has an accessible name", async ({ page }) => {
    await gotoDoc(page, "pagination")
    const nav = page.locator('nav[data-slot="pagination"]').first()
    await expect(nav).toBeVisible()
    const label = await nav.getAttribute("aria-label")
    expect(label && label.length > 0, "pagination nav needs aria-label").toBeTruthy()
  })

  test("active page carries aria-current=\"page\"", async ({ page }) => {
    await gotoDoc(page, "pagination")
    // Each pagination instance must have exactly one current page.
    const navs = page.locator('[data-slot="pagination"]')
    const count = await navs.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const nav = navs.nth(i)
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
    }
  })

  test("previous and next controls have accessible labels", async ({ page }) => {
    await gotoDoc(page, "pagination")
    const prev = page.locator('[data-slot="pagination-prev"]').first()
    const next = page.locator('[data-slot="pagination-next"]').first()
    await expect(prev).toHaveAttribute("aria-label", /previous/i)
    await expect(next).toHaveAttribute("aria-label", /next/i)
  })

  test("htmx — clicking a page swaps in updated content", async ({ page }) => {
    await gotoDoc(page, "pagination")
    // Scope to the htmx example host (page links inside #ex-pag-host).
    const host = page.locator("#ex-pag-host")
    const page2 = host.locator('[data-test="page-2"]')
    await page2.click()
    // After swap, aria-current within the host moves to page 2.
    await expect(host.locator('[aria-current="page"]')).toHaveText("2")
  })
})
