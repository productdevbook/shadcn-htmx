import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Slider — native <input type="range"> wrapped with styled track + thumb.
// We test the platform contract (keyboard, ARIA) rather than re-implementing
// it. Native gives us:
//   - aria-valuemin / aria-valuemax / aria-valuenow auto-managed
//   - Arrow keys, Home/End, PageUp/Down
//   - role="slider" implicit

test.describe("Slider", () => {
  test("route exists and renders", async ({ page }) => {
    await gotoDoc(page, "slider")
    await expect(page.locator("h1", { hasText: "Slider" })).toBeVisible()
  })

  test("renders a native range input with ARIA range exposed", async ({
    page,
  }) => {
    await gotoDoc(page, "slider")
    const input = page.locator('[data-slot="slider"] input[type="range"]').first()
    await expect(input).toBeVisible()
    // Native <input type="range"> exposes role=slider with implicit
    // aria-valuemin/max/now mapped from min/max/value. Confirm DOM
    // attributes match.
    await expect(input).toHaveAttribute("min", "0")
    await expect(input).toHaveAttribute("max", "100")
  })

  test("arrow keys change value (native keyboard contract)", async ({
    page,
  }) => {
    await gotoDoc(page, "slider")
    const input = page.locator('[data-slot="slider"] input[type="range"]').first()
    // Set a known starting value to make assertions stable.
    await input.evaluate((el: HTMLInputElement) => {
      el.value = "50"
    })
    await input.focus()
    await page.keyboard.press("ArrowRight")
    expect(await input.inputValue()).toBe("51")
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.press("ArrowLeft")
    expect(await input.inputValue()).toBe("49")
    await page.keyboard.press("Home")
    expect(await input.inputValue()).toBe("0")
    await page.keyboard.press("End")
    expect(await input.inputValue()).toBe("100")
  })

  test("disabled blocks keyboard input", async ({ page }) => {
    await gotoDoc(page, "slider")
    // data-test passthrough lands on the input (the focusable element).
    const disabled = page.locator(
      '[data-slot="slider"] input[type="range"][data-test="disabled"]',
    )
    await expect(disabled).toBeDisabled()
  })

  test("has an accessible name (aria-label or label[for])", async ({
    page,
  }) => {
    await gotoDoc(page, "slider")
    const input = page.locator('[data-slot="slider"] input[type="range"]').first()
    const acc = await input.evaluate((el: HTMLInputElement) => {
      // Check aria-label, aria-labelledby, or an associated <label[for]>.
      if (el.getAttribute("aria-label")) return el.getAttribute("aria-label")
      const lb = el.getAttribute("aria-labelledby")
      if (lb) return document.getElementById(lb)?.textContent?.trim() || null
      const lab = document.querySelector(`label[for="${el.id}"]`)
      return lab?.textContent?.trim() || null
    })
    expect(acc, "slider must have an accessible name").toBeTruthy()
  })
})
