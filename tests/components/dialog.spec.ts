import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Dialog — deep walkthrough. Catches focus-trap, focus-restoration,
// ESC, backdrop click, X close-button behaviour that the smoke suite
// only sniffs.

test.describe("Dialog (deep)", () => {
  test("open via trigger sets :modal and moves focus inside", async ({
    page,
  }) => {
    await gotoDoc(page, "dialog")
    const trigger = page
      .locator('[data-dialog-trigger][data-dialog-target="ex-form-dlg"]')
      .first()
    await trigger.click()
    const dlg = page.locator("#ex-form-dlg")
    await expect(dlg).toBeVisible()
    // Browser-set :modal pseudo only matches when showModal() ran.
    expect(await dlg.evaluate((d: HTMLDialogElement) => d.matches(":modal"))).toBe(true)
    // Focus moves to the first focusable inside the dialog.
    const focusedInside = await dlg.evaluate(
      (d) => d.contains(document.activeElement) && document.activeElement?.tagName !== "DIALOG",
    )
    expect(focusedInside).toBe(true)
  })

  test("ESC closes the dialog and restores focus to the trigger", async ({
    page,
  }) => {
    await gotoDoc(page, "dialog")
    // The DialogTrigger wraps a <button> in a <span data-dialog-trigger>.
    // Click + focus restoration both apply to the inner <button>.
    const triggerBtn = page
      .locator('[data-dialog-trigger][data-dialog-target="ex-form-dlg"] button')
      .first()
    await triggerBtn.scrollIntoViewIfNeeded()
    await triggerBtn.click()
    const dlg = page.locator("#ex-form-dlg")
    await expect(dlg).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dlg).not.toBeVisible()
    // Browser default for <dialog>.close() is to restore focus to the
    // element that had focus before showModal() was called.
    await expect(triggerBtn).toBeFocused()
  })

  test("X close button dismisses the dialog", async ({ page }) => {
    await gotoDoc(page, "dialog")
    const trigger = page
      .locator('[data-dialog-trigger][data-dialog-target="ex-form-dlg"]')
      .first()
    await trigger.click()
    const dlg = page.locator("#ex-form-dlg")
    await dlg.locator('[data-dialog-close]').first().click()
    await expect(dlg).not.toBeVisible()
  })

  test("backdrop click dismisses (when close-on-backdrop is on)", async ({
    page,
  }) => {
    await gotoDoc(page, "dialog")
    const trigger = page
      .locator('[data-dialog-trigger][data-dialog-target="ex-form-dlg"]')
      .first()
    await trigger.click()
    const dlg = page.locator("#ex-form-dlg")
    await expect(dlg).toBeVisible()
    // Click at the very top-left corner of the viewport — guaranteed
    // outside the dialog box but inside the backdrop.
    await page.mouse.click(5, 5)
    await expect(dlg).not.toBeVisible()
  })

  test("Tab does not escape the modal (focus trap)", async ({ page }) => {
    await gotoDoc(page, "dialog")
    const trigger = page
      .locator('[data-dialog-trigger][data-dialog-target="ex-form-dlg"]')
      .first()
    await trigger.click()
    const dlg = page.locator("#ex-form-dlg")
    await expect(dlg).toBeVisible()
    // Tab N times — focus should stay inside the modal (browser native
    // top-layer behaviour).
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab")
    }
    const stillInside = await dlg.evaluate(
      (d) => d.contains(document.activeElement),
    )
    expect(stillInside).toBe(true)
  })
})
