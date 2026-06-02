/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Scroll Area — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A constrained-overflow region: content taller (or wider) than the box
// scrolls natively, with a themed scrollbar and optional fade masks that
// appear at the start / end edges only while there is more content to
// scroll to in that direction.
//
// shadcn/ui's upstream ScrollArea wraps Radix's ScrollArea, which hides the
// native scrollbar and re-implements the thumb + track + drag handling in
// JavaScript. We do NOT copy that (AGENTS.md rule 4: no emulating platform
// features). The browser already ships native scrolling, a keyboard-operable
// scroll container, and — now — themeable scrollbars and scroll-state queries.
// So this component is ZERO JavaScript:
//   Upstream (anatomy only):
//     repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/scroll-area.tsx
//
// Built on:
//   - CSS overflow — `overflow-y: auto` / `overflow-x: auto` makes the
//     viewport a scroll container that shows scrollbars only when needed and
//     respects the user's OS preference. A scroll region must be keyboard
//     operable, so the viewport carries tabindex="0" + role="region" + an
//     accessible name (aria-labelledby / aria-label). This is the exact
//     contract from the web.dev "Overflow" lesson (Scrolling and
//     accessibility): repos/web.dev/src/site/content/en/learn/css/overflow/index.md
//   - CSS scrollbar-width / scrollbar-color — the standard, cross-browser way
//     to theme a scrollbar (Tailwind v4 ships `scrollbar-thin` /
//     `scrollbar-thumb-*` / `scrollbar-track-*` utilities for them; verified
//     repos/tailwindcss/packages/tailwindcss/src/utilities.ts:2230-2255).
//   - CSS @container scroll-state(scrollable: <edge>) — toggles the fade
//     masks. The viewport is a scroll-state query container
//     (container-type: scroll-state); the masks are REAL `position: sticky`
//     CHILD elements of the viewport whose opacity is driven by whether the
//     container can still be scrolled towards that edge. (Verified in Chromium
//     136: the query styles DESCENDANTS of the scroll container — a
//     pseudo-element of the container itself is not matched, so the masks must
//     be real children.) Negative margins keep the sticky masks from adding to
//     the scroll length, so they overlay rather than push content:
//       repos/mdn/files/en-us/web/css/reference/at-rules/@container/index.md
//         (scrollable descriptor, lines 224-261)
//       repos/mdn/files/en-us/web/css/guides/conditional_rules/container_scroll-state_queries/index.md
//         ("Using `scrollable` queries")
//
// The container-type, the sticky-mask geometry, and the @container
// scroll-state(...) opacity rules live in app/styles/input.css, scoped to
// [data-slot="scroll-area"] (Tailwind has no utility for scroll-state
// container queries). Everything else is utilities.

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both"

// Root is the positioning context + clips the rounded corners.
const root = "relative overflow-hidden rounded-md"

// The scroll viewport. tabindex/role/name are set on the element so keyboard
// users get a tab stop + arrow-key scrolling (web.dev overflow a11y). The
// scrollbar utilities theme it with the standard scrollbar-width/-color
// properties. `data-scroll-area-viewport` + the data-fade flag let the CSS in
// input.css set container-type:scroll-state for this instance.
const viewportBase =
  "size-full scroll-smooth scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent " +
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-[inherit]"

const overflowAxis: Record<ScrollAreaOrientation, string> = {
  vertical: "overflow-y-auto overflow-x-hidden",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
}

type ScrollAreaProps = {
  // Which axis scrolls. Defaults to vertical (the common reading list / panel).
  orientation?: ScrollAreaOrientation
  // Show start/end (top/bottom or left/right) fade masks that fade in only
  // while more content can scroll into view in that direction. Default true.
  fade?: boolean
  // Accessible name for the scroll region. One of these is required for the
  // region to be announced to assistive tech (web.dev overflow a11y contract).
  ariaLabel?: string
  ariaLabelledby?: string
  // Extra classes for the ROOT. Set a height/max-height here (or on a wrapper)
  // so the region actually constrains its content, e.g. class="h-72".
  class?: ClassValue
  // Extra classes for the inner viewport (rarely needed; e.g. padding).
  viewportClass?: ClassValue
  id?: string
  children?: Child
  // Forward hx-*, data-*, aria-*, and standard attributes onto the root.
  [key: string]: unknown
}

// A single fade mask: a sticky, pointer-transparent child pinned to one edge.
// The gradient direction + which scroll-state query lights it up come from the
// CSS in input.css (keyed on the root's data-orientation + this data-edge).
function ScrollAreaFade(props: { edge: "start" | "end" }) {
  return (
    <div
      data-slot="scroll-area-fade"
      data-edge={props.edge}
      aria-hidden="true"
      class="pointer-events-none sticky z-[1] opacity-0 transition-opacity duration-200"
    />
  )
}

export function ScrollArea(props: ScrollAreaProps) {
  const {
    orientation = "vertical",
    fade = true,
    ariaLabel,
    ariaLabelledby,
    class: className,
    viewportClass,
    id,
    children,
    ...rest
  } = props

  return (
    <div id={id} data-slot="scroll-area" data-orientation={orientation} class={cn(root, className)} {...rest}>
      <div
        data-slot="scroll-area-viewport"
        data-scroll-area-viewport
        data-fade={fade ? "true" : undefined}
        role="region"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        tabindex={0}
        class={cn(viewportBase, overflowAxis[orientation], viewportClass)}
      >
        {fade && <ScrollAreaFade edge="start" />}
        {children}
        {fade && <ScrollAreaFade edge="end" />}
      </div>
    </div>
  )
}
