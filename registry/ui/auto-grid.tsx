/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Auto Grid — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A responsive, intrinsically-wrapping grid of equal cells with NO media
// queries: children flow into as many columns as fit at a configurable
// minimum item width, then grow to share the leftover space. This is the
// "RAM" pattern (Repeat, Auto, Minmax) — the card-grid recipe most people
// reach for. Pure CSS Grid; zero JavaScript.
//
// Built on (read before editing):
//   repos/web.dev/src/site/content/en/patterns/layout/repeat-auto-minmax/index.md
//     — the canonical recipe: `grid-template-columns: repeat(auto-fit,
//       minmax(150px, 1fr))`. auto-fit collapses empty tracks so filled
//       tracks grow; auto-fill keeps empty tracks (their width reserved).
//   repos/web.dev/src/site/content/en/learn/css/grid/index.md:295-389
//     — `minmax(0, 1fr)` forces equal share minus gaps; the
//       `auto-fill`/`auto-fit` keywords create "as many tracks as will fit"
//       with no media queries; the subtle auto-fill vs auto-fit difference.
//   repos/mdn/files/en-us/web/css/minmax/index.md (minmax function)
//   repos/mdn/files/en-us/web/css/min/index.md
//     — `min(var(--auto-grid-min), 100%)` guards the lower bound so a single
//       wide item can never overflow a container narrower than the min.
//
// shadcn/ui has no Auto Grid (React libraries leave layout to the consumer),
// so there is no class string to mirror — this is a layout primitive.
//
// API shape:
//   - `min`  : the per-item minimum width (any CSS length). Drives how many
//              columns fit. Default "16rem".
//   - `gap`  : the Tailwind gap step (number → gap-<n>) or a class. Default 4.
//   - `fill` : false (default) uses auto-fit — empty tracks collapse and
//              real items stretch to fill the row. true uses auto-fill —
//              empty tracks are kept, so a half-empty last row stays aligned
//              to the column rhythm rather than stretching.
//   - `as`   : the element/role. Default <div>. Use "ul"/"ol" for a list of
//              cards (each child should then be an <li>), or "section".
//
// We publish `--auto-grid-min` on the root and read it in an arbitrary
// `grid-template-columns` utility, exactly like RangeSlider publishes
// `--range-min`/`--range-max`. No runtime; the browser does the layout.

export type AutoGridAs = "div" | "ul" | "ol" | "section"

// repeat(auto-fit|auto-fill, minmax(min(var(--auto-grid-min), 100%), 1fr)).
// The min() guard means: never demand more than the container width, so one
// item in a too-narrow container shrinks instead of forcing a scrollbar.
const FIT_CLASS =
  "grid [grid-template-columns:repeat(auto-fit,minmax(min(var(--auto-grid-min,16rem),100%),1fr))]"
const FILL_CLASS =
  "grid [grid-template-columns:repeat(auto-fill,minmax(min(var(--auto-grid-min,16rem),100%),1fr))]"

// Gap presets so callers can pass a plain number; any other value (string)
// is treated as an explicit class and appended verbatim.
const GAP_CLASS: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
}

type AutoGridProps = PropsWithChildren<{
  // Minimum per-item width. Any CSS length ("16rem", "200px", "20ch").
  min?: string
  // Gap between cells: a number maps to gap-<n>; a string is used verbatim.
  gap?: number | string
  // auto-fill (keep empty tracks) instead of auto-fit (collapse them).
  fill?: boolean
  // Semantic element / role. "ul"/"ol" for a card list.
  as?: AutoGridAs
  ariaLabel?: string
  ariaLabelledby?: string
  class?: ClassValue
  id?: string
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function AutoGrid(props: AutoGridProps) {
  const {
    min = "16rem",
    gap = 4,
    fill = false,
    as = "div",
    ariaLabel,
    ariaLabelledby,
    class: className,
    children,
    ...rest
  } = props as any
  const Tag: any = as
  const gapClass = typeof gap === "number" ? (GAP_CLASS[gap] ?? "gap-4") : gap
  return (
    <Tag
      data-slot="auto-grid"
      data-fill={fill ? "true" : undefined}
      // Publish the per-item minimum; the grid-template-columns utility reads
      // it. Keeping it a custom property means callers tune density without
      // touching the (uncompilable-at-runtime) arbitrary class.
      style={`--auto-grid-min:${min}`}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      class={cn(fill ? FILL_CLASS : FIT_CLASS, gapClass, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
