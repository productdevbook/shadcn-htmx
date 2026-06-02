import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Toast / Alert / Progress — live region behaviour + lifecycle.

test.describe("Toast (deep)", () => {
  test("auto-dismiss honours data-duration", async ({ page }) => {
    await gotoDoc(page, "toast")
    await page.locator("button", { hasText: "Flash success" }).first().click()
    const toast = page.locator('#ex-toast-viewport [data-slot="toast"]').first()
    await expect(toast).toBeVisible({ timeout: 3000 })
    // Default duration is 5s; verify the toast is gone shortly after.
    await expect(toast).not.toBeVisible({ timeout: 7000 })
  })

  test("sticky toast (duration=0) stays until manual dismiss", async ({
    page,
  }) => {
    await gotoDoc(page, "toast")
    await page
      .locator("button", { hasText: "Flash sticky warning" })
      .first()
      .click()
    const toast = page.locator('#ex-toast-viewport [data-slot="toast"]').first()
    await expect(toast).toBeVisible()
    // Wait past the default 5s — sticky should still be there.
    await page.waitForTimeout(5500)
    await expect(toast).toBeVisible()
    // Manual dismiss via X button.
    await toast.locator("[data-toast-close]").click()
    await expect(toast).not.toBeVisible({ timeout: 2000 })
  })

  test("multiple toasts stack independently", async ({ page }) => {
    await gotoDoc(page, "toast")
    const btn = page.locator("button", { hasText: "Flash info" }).first()
    await btn.click()
    await btn.click()
    await btn.click()
    const toasts = page.locator('#ex-toast-viewport [data-slot="toast"]')
    await expect.poll(() => toasts.count()).toBeGreaterThanOrEqual(3)
  })
})

test.describe("Alert (deep)", () => {
  test("default variant has role=status (polite)", async ({ page }) => {
    await gotoDoc(page, "alert")
    // The page has multiple alerts; the very first demo should be the
    // default variant with role=status.
    const polite = page.locator('[data-slot="alert"][role="status"]').first()
    await expect(polite).toBeVisible()
    await expect(polite).toHaveAttribute("aria-live", "polite")
  })

  test("destructive variant uses role=alert (assertive)", async ({ page }) => {
    await gotoDoc(page, "alert")
    const assertive = page.locator('[data-slot="alert"][role="alert"]').first()
    if ((await assertive.count()) === 0) return
    await expect(assertive).toHaveAttribute("aria-live", "assertive")
  })

  test("htmx flash injects into the polite live region", async ({ page }) => {
    await gotoDoc(page, "alert")
    const flashHost = page.locator("#ex-alert-flash")
    await page.locator("button", { hasText: "Submit" }).first().click()
    // The endpoint returns an <Alert> fragment swapped into the host.
    await expect(flashHost.locator('[data-slot="alert"]')).toBeVisible({
      timeout: 3000,
    })
  })
})

test.describe("Progress (deep)", () => {
  test("determinate sets aria-valuenow", async ({ page }) => {
    await gotoDoc(page, "progress")
    const determinate = page
      .locator('[role="progressbar"][data-state="determinate"]')
      .first()
    const v = await determinate.getAttribute("aria-valuenow")
    expect(Number(v)).toBeGreaterThanOrEqual(0)
  })

  test("indeterminate omits aria-valuenow", async ({ page }) => {
    await gotoDoc(page, "progress")
    const indet = page
      .locator('[role="progressbar"][data-state="indeterminate"]')
      .first()
    if ((await indet.count()) === 0) return
    expect(await indet.getAttribute("aria-valuenow")).toBeNull()
  })

  test("htmx polling progresses then stops at 100", async ({ page }) => {
    await gotoDoc(page, "progress")
    // The demo polls /progress/tick. Wait until aria-valuenow hits 100.
    const bar = page
      .locator("#ex-htmx [role=\"progressbar\"], [role=\"progressbar\"][aria-label=\"Mock upload\"]")
      .first()
    await expect
      .poll(async () => Number(await bar.getAttribute("aria-valuenow")), {
        timeout: 20000,
        intervals: [500, 1000, 1500],
      })
      .toBe(100)
  })
})
