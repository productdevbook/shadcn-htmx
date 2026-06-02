/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cloneElement, isValidElement } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Aspect Ratio — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A ratio-box wrapper that locks a child (image / video / iframe / embed /
// chart slot) to a fixed width-to-height ratio while it resizes fluidly,
// eliminating layout shift. One CSS declaration does all the work — there
// is no JavaScript here.
//
// shadcn/ui's upstream AspectRatio wraps Radix's primitive, which predates
// native browser support and emulates the ratio with a padding-bottom hack
// + absolute positioning. We do NOT copy that: the platform now ships the
// real thing, so we use the native CSS `aspect-ratio` property instead. No
// hacks (see AGENTS.md rule 4).
//   Upstream (anatomy only):
//     repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/aspect-ratio.tsx
//
// Built on:
//   - CSS `aspect-ratio` — defines the desired width-to-height ratio of the
//     box; the browser keeps it as the box resizes. At least one of the
//     box's sizes must be automatic for it to take effect (we leave height
//     auto, width fluid).
//       repos/mdn/files/en-us/web/css/reference/properties/aspect-ratio/index.md
//   - CSS `object-fit` — how a replaced element (img/video) fills the box:
//     `cover` crops to fill, `contain` letterboxes to fit. Note object-fit
//     has no effect on <iframe>/<embed>, which already stretch to the box.
//       repos/mdn/files/en-us/web/css/reference/properties/object-fit/index.md
//   - web.dev "Aspect ratio image card" pattern (`aspect-ratio: 16 / 9`,
//     no padding-top hack):
//       repos/web.dev/src/site/content/en/patterns/layout/aspect-ratio-image-card/index.md
//
// Tailwind v4: `aspect-video` = 16/9, `aspect-square` = 1/1; any other
// ratio is the arbitrary `aspect-[w/h]` utility. `object-cover` /
// `object-contain` map to the object-fit keywords.

export type AspectRatioFit = "cover" | "contain"

// Named ratios mapped to Tailwind's stock aspect utilities; everything else
// falls through to the arbitrary `aspect-[w/h]` form below.
const NAMED_RATIO: Record<string, string> = {
  "1/1": "aspect-square",
  "16/9": "aspect-video",
}

const fitClasses: Record<AspectRatioFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
}

// Turn a ratio prop into a Tailwind class. Accepts:
//   - a number   → 1.78        → aspect-[1.78]
//   - "16/9"     → aspect-video (or aspect-[w/h] for unmapped ratios)
function ratioClass(ratio: number | string): string {
  if (typeof ratio === "number") return `aspect-[${ratio}]`
  const key = ratio.replace(/\s+/g, "")
  return NAMED_RATIO[key] ?? `aspect-[${key}]`
}

type AspectRatioProps = {
  // Width-to-height ratio. A number (e.g. 1.778) or a "w/h" string
  // (e.g. "16/9", "4/3"). Defaults to a 16:9 video frame.
  ratio?: number | string
  // How a replaced child (img/video) fills the box. `cover` crops, `contain`
  // letterboxes. Ignored for non-replaced children (iframe/embed/div).
  fit?: AspectRatioFit
  class?: ClassValue
  id?: string
  // The locked element: an <img>, <video>, <iframe>, <embed>, or any block.
  // A single valid element child is cloned so the sizing + object-fit
  // classes land directly on it (the wrapper only carries the ratio).
  children?: Child
  // Forward hx-*, data-*, aria-*, and standard attributes onto the root.
  [key: string]: unknown
}

const root = "relative block w-full overflow-hidden"

export function AspectRatio(props: AspectRatioProps) {
  const {
    ratio = "16/9",
    fit = "cover",
    class: className,
    id,
    children,
    ...rest
  } = props

  const rootClasses = cn(root, ratioClass(ratio), className)

  // Annotate the single child so it stretches to fill the ratio box and
  // applies object-fit (mirrors button/tooltip cloneElement convention).
  let child: Child = children
  if (isValidElement(children)) {
    const el = children as any
    child = cloneElement(el, {
      "data-slot": "aspect-ratio-content",
      class: cn("size-full", fitClasses[fit], el?.props?.class),
    })
  }

  return (
    <div
      id={id}
      data-slot="aspect-ratio"
      data-ratio={typeof ratio === "number" ? String(ratio) : ratio}
      class={rootClasses}
      {...rest}
    >
      {child}
    </div>
  )
}
