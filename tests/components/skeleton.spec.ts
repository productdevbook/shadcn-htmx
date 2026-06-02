import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Skeleton — loading placeholder. Pure visual, but we test the contract:
//   - role="status" or aria-busy so AT knows content is loading.
//   - An accessible label ("Loading…") so the announcement is meaningful.
//   - The shape utilities pass through (the size of the rendered element
//     matches the size class we asked for).

test.describe("Skeleton", () => {
  test("route exists and renders the docs page", async ({ page }) => {
    await gotoDoc(page, "skeleton")
    await expect(page.locator("h1", { hasText: "Skeleton" })).toBeVisible()
  })

  test("renders with role=status + aria-busy + accessible name", async ({
    page,
  }) => {
    await gotoDoc(page, "skeleton")
    const sk = page.locator('[data-slot="skeleton"]').first()
    await expect(sk).toBeVisible()
    await expect(sk).toHaveAttribute("role", "status")
    await expect(sk).toHaveAttribute("aria-busy", "true")
    // aria-label or aria-labelledby must produce a non-empty accessible name.
    const label = await sk.evaluate((el) => el.getAttribute("aria-label"))
    expect(label && label.length > 0, "skeleton must have an accessible name").toBeTruthy()
  })

  test("size class controls actual rendered width", async ({ page }) => {
    await gotoDoc(page, "skeleton")
    // The docs page has a row example labelled "row-1" with width class w-64.
    const row = page.locator('[data-slot="skeleton"][data-test="row-1"]')
    const box = await row.boundingBox()
    if (!box) throw new Error("skeleton has no box")
    // w-64 = 16rem = 256px. Allow ±2px for sub-pixel rounding.
    expect(Math.abs(box.width - 256)).toBeLessThanOrEqual(2)
  })
})
