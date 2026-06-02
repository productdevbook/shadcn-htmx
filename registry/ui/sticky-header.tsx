/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Sticky Header — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A page / section / table header that pins on scroll AND visually reacts
// (shadow + solid background) the moment it becomes STUCK — with NO
// IntersectionObserver sentinel hack. The browser tells us it's stuck.
//
// How it works (all native, zero JS):
//   - The root is `position: sticky; top: <top>` so the platform pins it to
//     the top edge of its nearest scroll container ancestor.
//       repos/mdn/files/en-us/web/css/reference/properties/position/index.md
//       ("sticky": "scroll along with its container, until it is at the top
//        of the container … and will then stop scrolling, so it stays
//        visible.")
//   - The SAME element is a scroll-state query container
//     (`container-type: scroll-state`). A `@container scroll-state(stuck: top)`
//     query then matches whenever this sticky element is stuck to the top
//     edge, and applies styles to its DESCENDANTS.
//       repos/mdn/.../web/css/guides/conditional_rules/container_scroll-state_queries/index.md
//       ("stuck: Queries whether a container with a position value of sticky
//        is stuck to an edge of its scroll container ancestor. … you could
//        give them a different color scheme or layout.")
//       repos/mdn/files/en-us/web/css/reference/at-rules/@container/index.md
//     This is exactly the MDN "Using `stuck` queries" recipe (a sticky
//     <header> that is BOTH the sticky element and the scroll-state
//     container), translated to our token system.
//
// The container query + the descendant reveal rules can't be expressed
// portably as Tailwind utilities (the styled target is a DESCENDANT of the
// query container, and `scroll-state(stuck: top)` isn't a first-class
// variant). So — exactly like Tree / Treegrid / Sidebar in this repo — the
// rules live in one tiny block scoped to [data-slot="sticky-header"] in
// app/styles/input.css. Children opt in to the stuck styling with
// data-sticky-revealed (shadow + solid background) so authors keep full
// control of which part of the header reacts.
//
// Progressive enhancement, not emulation: where scroll-state() is
// unsupported the header STILL pins (plain position: sticky); it just
// doesn't get the extra stuck shadow. We never polyfill the query.
//
// htmx-friendly: hx-* / data-* / aria-* forward via {...rest}, so a sticky
// table header or toolbar can re-fetch its body without losing its pin.

export type StickyHeaderElement = "div" | "header" | "section" | "nav"

// Element to render as. A page banner uses <header>; a sticky section title
// uses <header> inside its <section>; a sticky toolbar can use <div>.
const ELEMENT_BY_AS: Record<StickyHeaderElement, StickyHeaderElement> = {
  div: "div",
  header: "header",
  section: "section",
  nav: "nav",
}

// Root classes. The sticky pin + scroll-state container are set as inline
// utilities; the stuck reveal styling for descendants lives in the scoped
// CSS block (see header comment). We keep a base background so the header is
// never transparent over scrolling content even before it sticks.
const base =
  "sticky z-30 bg-background/95 supports-[backdrop-filter]:bg-background/80 " +
  "[container-type:scroll-state]"

type StickyHeaderProps = PropsWithChildren<{
  as?: StickyHeaderElement
  class?: ClassValue
  // Offset from the top edge of the scroll container at which the header
  // pins (CSS `top`). Defaults to 0. Pass a Tailwind class via `class`
  // (e.g. "top-16") to pin below a fixed app bar instead.
  top?: number | string
  id?: string
  // Forward htmx attrs (e.g. a sticky table header that re-sorts its body),
  // plus data-* / aria-*.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
  role?: string
}>

export function StickyHeader(props: StickyHeaderProps) {
  const { children, as = "header", class: className, top, id, ...rest } = props
  const Tag = ELEMENT_BY_AS[as] as any
  // top defaults to 0 (pin flush to the scroll container's top edge). A
  // numeric value is treated as pixels; a string passes through verbatim.
  const topValue =
    top === undefined ? "0" : typeof top === "number" ? `${top}px` : top
  return (
    <Tag
      id={id}
      data-slot="sticky-header"
      class={cn(base, className)}
      style={`top:${topValue}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// The reveal target. Wrap the part of the header that should react (gain a
// shadow + solid background) once the header is stuck. Multiple revealed
// regions are fine. The actual stuck styling is applied by the scoped CSS
// block via the data-sticky-revealed hook.
const revealedBase = "transition-shadow transition-colors duration-200"

type StickyHeaderBarProps = PropsWithChildren<{
  as?: "div" | "header" | "nav"
  class?: ClassValue
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function StickyHeaderBar(props: StickyHeaderBarProps) {
  const { children, as = "div", class: className, ...rest } = props
  const Tag = (as as string) as any
  return (
    <Tag
      data-slot="sticky-header-bar"
      data-sticky-revealed=""
      class={cn(revealedBase, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
