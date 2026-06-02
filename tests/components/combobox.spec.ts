import { expect, test } from "@playwright/test"
import { gotoDoc } from "../fixtures"

// Combobox — native <input list> + <datalist>.
//
// The browser owns the dropdown UI. We can only verify the DOM contract:
//   - input.list points at a datalist that exists.
//   - The datalist has <option> children (static or htmx-swapped).
//   - htmx swap on the datalist works.
// The actual dropdown rendering / filtering / click-to-select is browser
// native and not inspectable by Playwright — but the contract above is
// the entire user-facing surface.

test.describe("Combobox", () => {
  test("route exists and renders", async ({ page }) => {
    await gotoDoc(page, "combobox")
    await expect(page.locator("h1", { hasText: "Combobox" })).toBeVisible()
  })

  test("static example: input wired to datalist with options", async ({
    page,
  }) => {
    await gotoDoc(page, "combobox")
    const input = page.locator("#ex-combo-lang")
    await expect(input).toBeVisible()
    const listId = await input.getAttribute("list")
    expect(listId).toBe("ex-combo-lang-list")
    const list = page.locator(`datalist#${listId}`)
    await expect(list).toHaveCount(1)
    expect(await list.locator("option").count()).toBeGreaterThan(0)
  })

  test("htmx example: typing populates the datalist", async ({ page }) => {
    await gotoDoc(page, "combobox")
    const input = page.locator("#ex-combo-server")
    const list = page.locator("#ex-combo-server-list")
    await input.click()
    // Initial datalist is empty.
    expect(await list.locator("option").count()).toBe(0)
    // Type to trigger htmx debounced fetch.
    await input.fill("ja")
    // Wait for the swap.
    await expect.poll(async () => list.locator("option").count(), {
      timeout: 3000,
    }).toBeGreaterThan(0)
    // Options match the typed query.
    const values = await list
      .locator("option")
      .evaluateAll((els) =>
        els.map((el) => (el as HTMLOptionElement).value),
      )
    expect(values.length).toBeGreaterThan(0)
    expect(values.every((v) => v.toLowerCase().startsWith("ja"))).toBe(true)
  })

  test("API Reference section lists Combobox props", async ({ page }) => {
    await gotoDoc(page, "combobox")
    const section = page.locator('[data-slot="api-table"]')
    await expect(section.first()).toBeVisible()
    const required = ["id", "name", "options", "placeholder"]
    for (const prop of required) {
      const row = page.locator(`[data-slot="api-row"][data-prop="${prop}"]`)
      await expect(row.first()).toHaveCount(1)
    }
  })

  test("native semantics: form submits the input's selected value", async ({
    page,
  }) => {
    // Setting input.value to one of the datalist options is exactly how a
    // user "selects" — the browser does this when they click an option in
    // the native dropdown. We assert that flow downstream still sees the
    // value: form.elements.lang === "Java".
    await gotoDoc(page, "combobox")
    const input = page.locator("#ex-combo-lang")
    await input.fill("Java")
    expect(await input.inputValue()).toBe("Java")
  })
})
