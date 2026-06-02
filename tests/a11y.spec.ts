import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { gotoDoc } from "./fixtures"

// Run axe-core on every /docs/* page. Fail the build on any "serious" or
// "critical" violation — those are real bugs (broken contrast, missing
// labels, ARIA misuse). We accept "minor" and "moderate" findings for
// now so we have a path to clean.

// Keep in sync with app/server.tsx route registrations.
const SLUGS = [
  "button",
  "input",
  "textarea",
  "label",
  "checkbox",
  "combobox",
  "switch",
  "radio-group",
  "select",
  "slider",
  "card",
  "avatar",
  "badge",
  "separator",
  "alert",
  "progress",
  "pagination",
  "skeleton",
  "table",
  "toast",
  "dialog",
  "dropdown-menu",
  "popover",
  "tooltip",
  "tabs",
  "accordion",
  // APG batch A
  "meter",
  "number-input",
  "breadcrumb",
  "link",
  "collapsible",
  "alert-dialog",
  "range-slider",
  "toolbar",
  // APG batch B
  "listbox",
  "menubar",
  "tree",
  "carousel",
  "feed",
  "grid",
  "treegrid",
  "splitter",
  "landmarks",
  // docs pages
  "cli",
  // tier-3
  "kbd",
  "highlight",
  "relative-time",
  "figure",
  "responsive-image",
  "media-player",
  "autocomplete",
  "exclusive-accordion",
  "scroll-area",
  "snap-list",
  "container-card",
  "sticky-header",
  "scroll-progress",
  // tier-2
  "output",
  "segmented-control",
  "rating",
  "color-picker",
  "autosize-textarea",
  "cascading-select",
  "selectable-table",
  "delete-row",
  "optimistic-toggle",
  "status",
  "split-button",
  "lazy-load",
  "sidebar",
  "aspect-ratio",
  "auto-grid",
  // tier-1
  "form-field",
  "file-upload",
  "copy-button",
  "date-time-picker",
  "sheet",
  "hover-card",
  "active-search",
  "edit-in-place",
  "load-more",
  "skip-link",
  "theme-toggle",
]

for (const slug of SLUGS) {
  test(`a11y: /docs/${slug}`, async ({ page }) => {
    await gotoDoc(page, slug)

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Color contrast on this docs site uses tokens we accept; revisit
      // once the design system has a final palette.
      .disableRules(["color-contrast"])
      .analyze()

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    )
    expect(
      blocking,
      `serious/critical a11y violations on /docs/${slug}:\n` +
        blocking
          .map(
            (v) =>
              `- ${v.id} (${v.impact}): ${v.help}\n  affecting ${v.nodes.length} node(s)`,
          )
          .join("\n"),
    ).toEqual([])
  })
}
