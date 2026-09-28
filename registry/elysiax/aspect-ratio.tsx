/** @jsxImportSource @kitajs/html */
import type { Children } from "@kitajs/html"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Aspect Ratio — shadcn-htmx Elysia flavour (@kitajs/html), htmx v4 + Tailwind v4.
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
//
// Child annotation: the hono/jsx flavour clones the single child element to
// land the sizing + object-fit classes on it. @kitajs/html has no
// cloneElement, so that is replaced by the exported
// aspectRatioContentClasses() helper — paste the class string (and
// data-slot="aspect-ratio-content") onto your child element yourself:
//   <AspectRatio ratio="16/9">
//     <img src="…" alt="…" data-slot="aspect-ratio-content"
//          class={aspectRatioContentClasses({ fit: "cover" })} />
//   </AspectRatio>

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

// Class string for the locked child element — replaces the hono flavour's
// cloneElement-based child annotation. Merges the stretch + object-fit
// classes with any of your own.
export function aspectRatioContentClasses(opts?: {
  fit?: AspectRatioFit
  class?: ClassValue
}): string {
  const fit = opts?.fit ?? "cover"
  return cn("size-full", fitClasses[fit], opts?.class)
}

type AspectRatioProps = {
  // Width-to-height ratio. A number (e.g. 1.778) or a "w/h" string
  // (e.g. "16/9", "4/3"). Defaults to a 16:9 video frame.
  ratio?: number | string
  class?: ClassValue
  id?: string
  // The locked element: an <img>, <video>, <iframe>, <embed>, or any block.
  // Rendered as-is — annotate it yourself with
  // data-slot="aspect-ratio-content" and aspectRatioContentClasses()
  // (see the header comment).
  children?: Children
  // Forward hx-*, data-*, aria-*, and standard attributes onto the root.
  [key: string]: unknown
}

const root = "relative block w-full overflow-hidden"

export function AspectRatio(props: AspectRatioProps) {
  const {
    ratio = "16/9",
    class: className,
    id,
    children,
    ...rest
  } = props

  const rootClasses = cn(root, ratioClass(ratio), className)

  return (
    <div
      id={id}
      data-slot="aspect-ratio"
      data-ratio={typeof ratio === "number" ? String(ratio) : ratio}
      class={rootClasses}
      {...rest}
    >
      {children}
    </div>
  )
}
