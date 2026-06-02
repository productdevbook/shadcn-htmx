import { expect, test } from "@playwright/test"
import { gotoDoc } from "./fixtures"

// Every docs page (and the home page) must render without uncaught JS
// exceptions or console.error output from our own code. This guards against
// the kind of runtime breakage the static/registry checks can't see:
// a typo'd selector in site.js, a demo endpoint that throws, a bad attribute
// that htmx rejects at boot.
//
// We treat two signals as failures:
//   - `pageerror`  — an uncaught exception reached the window. Always a bug.
//   - `console.error` — except third-party resource-load noise (fonts/CDN),
//     which isn't something the component source controls.
//
// Keep SLUGS in sync with app/server.tsx route registrations.
const SLUGS = [
  "button", "input", "textarea", "label", "checkbox", "combobox", "switch",
  "radio-group", "select", "slider", "card", "avatar", "badge", "separator",
  "alert", "progress", "pagination", "skeleton", "table", "toast", "dialog",
  "dropdown-menu", "popover", "tooltip", "tabs", "accordion",
  // APG batch A
  "meter", "number-input", "breadcrumb", "link", "collapsible", "alert-dialog",
  "range-slider", "toolbar",
  // APG batch B
  "listbox", "menubar", "tree", "carousel", "feed", "grid", "treegrid", "splitter",
  // Landmarks (page-shell)
  "landmarks",
  // tier-2
  "output", "segmented-control", "rating", "color-picker", "autosize-textarea", "cascading-select", "selectable-table", "delete-row", "optimistic-toggle", "status", "split-button", "lazy-load", "sidebar", "aspect-ratio", "auto-grid",
  // tier-1
  "form-field", "file-upload", "copy-button", "date-time-picker", "sheet", "hover-card", "active-search", "edit-in-place", "load-more", "skip-link", "theme-toggle",
]

// Console "error" lines that aren't our fault (network/resource fetches).
const RESOURCE_NOISE = /Failed to load resource|net::ERR|ERR_|status of (4|5)\d\d|favicon/i

function attachConsoleGuards(errors: string[], slug: string) {
  return {
    onConsole: (msg: import("@playwright/test").ConsoleMessage) => {
      if (msg.type() !== "error") return
      const text = msg.text()
      if (RESOURCE_NOISE.test(text)) return
      errors.push(`[console.error /${slug}] ${text}`)
    },
    onPageError: (err: Error) => {
      errors.push(`[pageerror /${slug}] ${err.message}`)
    },
  }
}

test("home page renders without console errors", async ({ page }) => {
  const errors: string[] = []
  const guards = attachConsoleGuards(errors, "")
  page.on("console", guards.onConsole)
  page.on("pageerror", guards.onPageError)
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  expect(errors, errors.join("\n")).toEqual([])
})

for (const slug of SLUGS) {
  test(`console: /docs/${slug} renders without errors`, async ({ page }) => {
    const errors: string[] = []
    const guards = attachConsoleGuards(errors, slug)
    page.on("console", guards.onConsole)
    page.on("pageerror", guards.onPageError)
    await gotoDoc(page, slug)
    // Let deferred scripts (htmx, site.js) boot and any auto-running demos settle.
    await page.waitForLoadState("networkidle")
    expect(errors, errors.join("\n")).toEqual([])
  })
}
