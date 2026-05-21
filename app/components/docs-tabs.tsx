/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"

// JS-free preview/code tabs for the docs site. Each instance is two radio
// inputs that look like tab triggers; panels are revealed via :has()
// sibling selectors driven by which radio is checked.
//
// Why radio inputs and not <button role="tab">:
//   - Native keyboard navigation (arrow keys cycle, Space selects) for free.
//   - No JavaScript needed for the docs site.
//   - Screen readers announce them clearly.
//
// Limitation: this is a *docs-only* helper, hard-wired to "preview" and
// "code" values so the selectors are static and Tailwind can scan them.
// The production Tabs component (when shipped as a registry item) will
// implement the full APG tabs pattern with role="tablist".

type Props = {
  id: string
  preview: Child
  code: Child
  default?: "preview" | "code"
}

export function DocsTabs(props: Props) {
  const def = props.default ?? "preview"
  return (
    <div class="docs-tabs">
      <div role="tablist" class="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        <input
          type="radio"
          name={props.id}
          id={`${props.id}-preview`}
          value="preview"
          class="peer/preview sr-only"
          checked={def === "preview"}
        />
        <label
          for={`${props.id}-preview`}
          class={
            "inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition-all " +
            "peer-checked/preview:bg-background peer-checked/preview:text-foreground peer-checked/preview:shadow-sm " +
            "peer-focus-visible/preview:ring-[3px] peer-focus-visible/preview:ring-ring/50"
          }
        >
          Preview
        </label>
        <input
          type="radio"
          name={props.id}
          id={`${props.id}-code`}
          value="code"
          class="peer/code sr-only"
          checked={def === "code"}
        />
        <label
          for={`${props.id}-code`}
          class={
            "inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition-all " +
            "peer-checked/code:bg-background peer-checked/code:text-foreground peer-checked/code:shadow-sm " +
            "peer-focus-visible/code:ring-[3px] peer-focus-visible/code:ring-ring/50"
          }
        >
          Code
        </label>
      </div>
      <div class="mt-3">
        <div class="docs-tab-preview block">{props.preview}</div>
        <div class="docs-tab-code hidden">{props.code}</div>
      </div>
    </div>
  )
}
