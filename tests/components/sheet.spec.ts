import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Sheet — edge-anchored slide-in drawer built on the native <dialog> +
// showModal(). Verifies it opens as a real modal (browser-set :modal pseudo),
// is pinned to the right edge (data-side="right"), and light-dismisses via the
// native closedby="any" backdrop click.

test.describe("Sheet", () => {
  test("trigger opens a right-anchored modal; backdrop click closes it", async ({
    page,
  }) => {
    await gotoDoc(page, "sheet")

    // Open the basic demo sheet via its trigger.
    const trigger = page
      .locator('[data-dialog-trigger][data-dialog-target="ex-basic-sheet"]')
      .first()
    await trigger.click()

    // Scope to the sheet itself, not the #ex-basic heading.
    const sheet = page.locator('[data-slot="sheet"]#ex-basic-sheet')
    await expect(sheet).toBeVisible()

    // Browser-set :modal only matches when showModal() actually ran — proves
    // we got the native top-layer + focus trap, not just a visible <dialog>.
    const handle = await sheet.elementHandle()
    expect(
      await handle!.evaluate((d: HTMLDialogElement) => d.matches(":modal")),
    ).toBe(true)

    // Edge anchoring: a right-side sheet is pinned to the right edge. Read the
    // resolved style (the slide-in animation transforms the box, so the live
    // bounding box is unreliable mid-animation — `right: 0px` is not).
    expect(await sheet.getAttribute("data-side")).toBe("right")
    const right = await handle!.evaluate(
      (d) => getComputedStyle(d).right,
    )
    expect(right).toBe("0px")

    // closedby="any" → clicking the dim backdrop (top-left corner, outside the
    // right-anchored box) light-dismisses natively, with no backdrop JS.
    await page.mouse.click(5, 5)
    await expect(sheet).not.toBeVisible()
  })
})
