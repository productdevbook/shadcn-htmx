import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Table — semantic <table> with <thead>/<tbody>/<tr>/<th scope>/<td>.
// Sortable columns advertise their state via aria-sort
// (none|ascending|descending). Server-driven via htmx; the test only
// asserts the contract — not the visual styling.

test.describe("Table", () => {
  test("route exists and renders", async ({ page }) => {
    await gotoDoc(page, "table")
    await expect(page.locator("h1", { hasText: "Table" })).toBeVisible()
  })

  test("renders semantic table elements", async ({ page }) => {
    await gotoDoc(page, "table")
    const table = page.locator('table[data-slot="table"]').first()
    await expect(table).toBeVisible()
    await expect(table.locator("thead")).toHaveCount(1)
    await expect(table.locator("tbody")).toHaveCount(1)
    // Column headers must have scope="col" so AT links cells to headers.
    const ths = table.locator('thead th[scope="col"]')
    expect(await ths.count()).toBeGreaterThan(0)
  })

  test("sortable column has aria-sort + button trigger", async ({ page }) => {
    await gotoDoc(page, "table")
    // The demo has a sortable "Name" column.
    const sortable = page.locator('th[data-slot="table-head"][data-sortable="true"]').first()
    // aria-sort must reflect current state.
    const sortState = await sortable.getAttribute("aria-sort")
    expect(["none", "ascending", "descending"]).toContain(sortState)
    // The clickable element is a button inside the header (for keyboard).
    await expect(sortable.locator("button")).toBeVisible()
  })

  test("htmx — clicking sort updates aria-sort", async ({ page }) => {
    await gotoDoc(page, "table")
    const sortable = page.locator('th[data-slot="table-head"][data-sortable="true"]').first()
    const initial = await sortable.getAttribute("aria-sort")
    await sortable.locator("button").click()
    // After swap, aria-sort should have changed (none → ascending, etc.).
    await expect.poll(async () =>
      page
        .locator('th[data-slot="table-head"][data-sortable="true"]')
        .first()
        .getAttribute("aria-sort"),
    ).not.toBe(initial)
  })
})
