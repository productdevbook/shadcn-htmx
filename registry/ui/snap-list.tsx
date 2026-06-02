/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Snap List — shadcn-htmx, htmx v4 + Tailwind v4.
//
// The bare, reusable scroll-snapping rail: a gallery strip, chip row, media
// shelf, or date rail. This is the un-opinionated scroller that our Carousel
// (registry/ui/carousel.tsx) dresses up with Prev/Next buttons + carousel
// ARIA — here there are no controls, just native scrolling that snaps.
//
// Built entirely on CSS scroll snap — ZERO JavaScript. The platform owns the
// scrolling (mouse wheel, trackpad, touch swipe, and the browser's own
// keyboard scrolling of a focusable scroll region) and the snap behaviour:
//   - scroll-snap-type on the scroll container opts it into snapping and sets
//     the axis (x/y) + strictness (mandatory/proximity):
//       repos/mdn/files/en-us/web/css/reference/properties/scroll-snap-type/index.md
//   - scroll-snap-align on each child sets where it snaps (start/center/end):
//       repos/mdn/files/en-us/web/css/reference/properties/scroll-snap-align/index.md
//   - scroll-snap-stop: always forces the scroll to stop on each item rather
//     than flinging past several at once:
//       repos/mdn/files/en-us/web/css/reference/properties/scroll-snap-stop/index.md
//   Pattern reference (a horizontal, accessible, library-free media shelf):
//       repos/web.dev/src/site/content/en/patterns/components/media-scroller/index.md
//
// Tailwind v4 ships every utility we need natively, so no custom CSS:
//   snap-x / snap-y, snap-mandatory / snap-proximity, snap-start / snap-center
//   / snap-end, snap-always, scroll-pl / scroll-pt (scroll-padding so snapped
//   items aren't flush to the edge), scroll-smooth.
//   See repos/tailwindcss/packages/tailwindcss/src/utilities.ts:1846-1867.
// The .scrollbar-none helper (scrollbar-width:none + the WebKit supplement) is
// the same one the Carousel uses; it lives in app/styles/input.css.
//
// Native, future-facing styling hook (no JS, no extra CSS shipped here): a
// snapped item can be highlighted purely in CSS with a scroll-state container
// query — `@container scroll-state(snapped: x)` — once you opt the item into
// `container-type: scroll-state`. We don't bake that in (it needs a CSS rule
// we'd have to ship), but the rail is the snap container it queries:
//   repos/mdn/files/en-us/web/css/guides/conditional_rules/container_scroll-state_queries/index.md
//
// Semantics: this is a *list*, so the root is a real <ul> with role="list"
// (Safari drops the implicit list role once list-style is removed, so we set
// it back) and each item is an <li>. A scrollable region must be a tab stop to
// be operable by keyboard-only users, so the <ul> carries tabindex="0" and a
// visible focus ring. Name it via aria-label / aria-labelledby.
//   repos/mdn/files/en-us/web/html/reference/elements/ul/index.md

export type SnapListOrientation = "horizontal" | "vertical"
export type SnapListStrictness = "mandatory" | "proximity"
export type SnapListAlign = "start" | "center" | "end"

// The scroll container. We always set scroll-smooth (so any programmatic
// scrollIntoView animates), hide the scrollbar chrome, and add a focus ring
// because the region is a tab stop. The axis + strictness come from the maps.
const listBase =
  "flex list-none scroll-smooth scrollbar-none rounded-lg outline-none " +
  "focus-visible:ring-[3px] focus-visible:ring-ring/50"

// Axis: horizontal scrolls on x (row), vertical scrolls on y (column). The
// scroll container must overflow on the snap axis for snapping to engage.
const orientations: Record<SnapListOrientation, string> = {
  horizontal: "snap-x flex-row overflow-x-auto",
  vertical: "snap-y flex-col overflow-y-auto",
}

const strictnesses: Record<SnapListStrictness, string> = {
  mandatory: "snap-mandatory",
  proximity: "snap-proximity",
}

// Each item never shrinks below its content/basis and declares its snap line.
const itemBase = "min-w-0 shrink-0 grow-0"

const aligns: Record<SnapListAlign, string> = {
  start: "snap-start",
  center: "snap-center",
  end: "snap-end",
}

type SnapListProps = PropsWithChildren<{
  // Scroll/snap axis. horizontal (default) is the gallery-strip / chip-row
  // case; vertical is a snapping column. Drives scroll-snap-type's axis.
  orientation?: SnapListOrientation
  // scroll-snap-type strictness. mandatory always rests on a snap point;
  // proximity only snaps when a rest point is near (gentler on long content).
  snap?: SnapListStrictness
  // Accessible name for the list region (required when there's no visible
  // heading): becomes aria-label / aria-labelledby on the <ul>.
  ariaLabel?: string
  ariaLabelledby?: string
  class?: ClassValue
  // htmx + arbitrary attributes ride onto the root scroll container.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function SnapList(props: SnapListProps) {
  const {
    orientation = "horizontal",
    snap = "mandatory",
    ariaLabel,
    ariaLabelledby,
    class: className,
    children,
    ...rest
  } = props as any
  return (
    <ul
      data-slot="snap-list"
      data-orientation={orientation}
      data-snap={snap}
      role="list"
      tabindex={0}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      class={cn(listBase, orientations[orientation as SnapListOrientation], strictnesses[snap as SnapListStrictness], className)}
      {...rest}
    >
      {children}
    </ul>
  )
}

type SnapListItemProps = PropsWithChildren<{
  // Override the rail's default snap-align for this item.
  align?: SnapListAlign
  // scroll-snap-stop: always — the scroll cannot fling past this item; it must
  // come to rest on it. Use it to guarantee every item gets a stop.
  stop?: boolean
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function SnapListItem(props: SnapListItemProps) {
  const { align = "start", stop, class: className, children, ...rest } = props as any
  return (
    <li
      data-slot="snap-list-item"
      data-align={align}
      class={cn(itemBase, aligns[align as SnapListAlign], stop && "snap-always", className)}
      {...rest}
    >
      {children}
    </li>
  )
}
