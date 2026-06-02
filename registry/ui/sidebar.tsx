/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Sidebar — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A responsive app-navigation sidebar: a fixed rail on wide screens that
// collapses to an off-canvas drawer (opened by a labelled hamburger) on narrow
// screens. The nav links are real <a href> anchors and the open/close works
// WITHOUT JavaScript.
//
// How it works (web-standards, progressive enhancement):
//   - LAYOUT is CSS grid. The shell uses grid-template-columns:
//     minmax(<rail>, …) 1fr — the rail track + a 1fr content track — exactly
//     the one-line "sidebar says" pattern. On narrow screens both children
//     collapse to one stacked column so the rail can float over the content.
//       repos/web.dev/src/site/content/en/patterns/layout/sidebar-says/index.md
//       repos/web.dev/src/site/content/en/patterns/layout/sidebar-says/assets/style.css
//       repos/mdn/files/en-us/web/css/reference/properties/grid-template-columns/index.md
//       repos/mdn/files/en-us/web/css/reference/values/minmax/index.md
//   - OPEN / CLOSE on narrow screens is the CSS :target pseudo-class, the same
//     no-JS technique as the web.dev Sidenav component. The hamburger is an
//     <a href="#nav"> and the scrim/close is an <a href="#">; navigating the
//     URL fragment flips the drawer's `:target` state, which CSS animates in.
//       repos/web.dev/src/site/content/en/patterns/components/sidenav/index.md
//       repos/web.dev/src/site/content/en/patterns/components/sidenav/assets/body.html
//       repos/web.dev/src/site/content/en/patterns/components/sidenav/assets/style.css
//       repos/mdn/files/en-us/web/css/reference/selectors/_colon_target/index.md
//   - SEMANTICS: the rail is a <nav> (navigation landmark — name it when a page
//     has more than one nav). Links are native <a>, so role=link + Enter-to-
//     activate come from the platform; no JS, no ARIA needed.
//       repos/mdn/files/en-us/web/accessibility/aria/reference/roles/navigation_role/index.md
//       repos/mdn/files/en-us/web/html/reference/elements/a/index.md
//
// The responsive drawer mechanics (the @media + :target transform/visibility
// transition and the reduced-motion guard) live in app/styles/input.css keyed
// off data-slot="sidebar", because a media-scoped :target transition can't be
// expressed in utility classes alone — see the CSS block returned with this
// component. A TINY shared script in public/site.js adds the web.dev Sidenav
// keyboard nicety: Escape closes the open drawer (history.back so the fragment
// clears) and focus moves to the toggle/close after the slide. It is keyed on
// data-slot="sidebar" and is purely an enhancement — the component opens and
// closes with the script absent.

// --- Layout shell ------------------------------------------------------

// The shell is a grid. On narrow screens it is a single stacked column
// (grid-cols-1) so the rail can become an absolutely-positioned drawer that
// floats over the content. From `sm` up it becomes the two-track rail+content
// layout: a minmax() rail track + a 1fr content track ("sidebar says").
//
// Height comes from the --sidebar-h custom property (default 100svh — the full
// viewport for a real app shell). A docs/demo host can shrink it by setting
// --sidebar-h on the layout (e.g. style="--sidebar-h: 22rem") without touching
// the class strings, so the rail + drawer fit a bounded preview box.
const sidebarLayoutBase =
  "relative grid w-full grid-cols-1 [--sidebar-h:100svh] [min-height:var(--sidebar-h)] " +
  "sm:grid-cols-[minmax(var(--sidebar-w,16rem),20rem)_minmax(0,1fr)]"

export function SidebarLayout(
  props: PropsWithChildren<{ class?: ClassValue }> & Record<string, any>,
) {
  const { class: className, children, ...rest } = props
  return (
    <div
      data-slot="sidebar-layout"
      class={cn(sidebarLayoutBase, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

// --- Trigger (labelled hamburger, narrow screens only) -----------------

// A real anchor to the drawer's id, so it works with zero JS: navigating to
// #<id> makes the <aside> match :target and the CSS slides it in. Hidden from
// `sm` up where the rail is always visible.
const sidebarTriggerBase =
  "inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium shadow-xs " +
  "hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none " +
  "sm:hidden"

export function SidebarTrigger(
  props: {
    // Id of the <Sidebar> to open. Becomes the href fragment (#<sidebarFor>).
    sidebarFor: string
    label?: string
    class?: ClassValue
  } & Record<string, any>,
) {
  const { sidebarFor, label = "Menu", class: className, ...rest } = props
  return (
    <a
      href={`#${sidebarFor}`}
      data-slot="sidebar-trigger"
      data-sidebar-open={sidebarFor}
      aria-label={`Open ${label}`}
      aria-controls={sidebarFor}
      class={cn(sidebarTriggerBase, className)}
      {...rest}
    >
      {/* Hamburger glyph — three lines. role/aria handled by the anchor. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
        aria-hidden="true"
      >
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
      {label}
    </a>
  )
}

// --- Sidebar (the rail / off-canvas drawer) ----------------------------

// Wide screens: a bordered, full-height rail in the first grid track.
// Narrow screens: positioned off-canvas (the @media :target rule in input.css
// slides it in). z-50 so it floats over the content; the scrim sits behind it.
const sidebarBase =
  "flex h-[var(--sidebar-h,100svh)] flex-col gap-2 border-r bg-card text-card-foreground " +
  // Narrow-screen drawer footprint. The slide-in transform + visibility
  // transition is the :target rule in input.css (data-slot="sidebar"). On
  // narrow screens the drawer is absolute (relative to the layout shell) so a
  // bounded docs preview confines it instead of covering the whole viewport.
  "max-sm:absolute max-sm:inset-y-0 max-sm:left-0 max-sm:z-50 max-sm:h-full max-sm:w-72 max-sm:max-w-[85vw] max-sm:shadow-lg " +
  // Wide screens: the rail is sticky to the top of the content track so it
  // stays put while the main column scrolls.
  "sm:sticky sm:top-0"

export function Sidebar(
  props: PropsWithChildren<{
    // Id targeted by the trigger's href fragment. Required for the no-JS
    // :target open/close.
    id: string
    // Accessible name for the <nav> landmark. Give a unique one when a page
    // has more than one navigation landmark.
    ariaLabel?: string
    ariaLabelledby?: string
    class?: ClassValue
  }> & Record<string, any>,
) {
  const {
    id,
    ariaLabel,
    ariaLabelledby,
    class: className,
    children,
    ...rest
  } = props
  return (
    <nav
      id={id}
      data-slot="sidebar"
      // tabindex makes the drawer programmatically focusable so site.js can
      // move focus into it after the slide (web.dev Sidenav focus nicety).
      tabindex={-1}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      class={cn(sidebarBase, className)}
      {...rest}
    >
      {children}
    </nav>
  )
}

// --- Scrim / close (narrow screens) ------------------------------------

// A full-screen dim layer that is itself the close affordance: it is an
// <a href="#"> so clicking it clears the URL fragment and the drawer slides
// back out — no JS. Sits below the drawer (z-40) and is hidden from `sm` up.
// The @media :target rule in input.css fades it in only while the drawer is
// open, and toggles its pointer-events so it never traps clicks when closed.
const sidebarScrimBase =
  "absolute inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"

export function SidebarScrim(
  props: { sidebarFor: string; class?: ClassValue } & Record<string, any>,
) {
  const { sidebarFor, class: className, ...rest } = props
  return (
    <a
      href="#"
      data-slot="sidebar-scrim"
      data-sidebar-scrim-for={sidebarFor}
      aria-label="Close navigation"
      tabindex={-1}
      class={cn(sidebarScrimBase, className)}
      {...rest}
    />
  )
}

// In-drawer close affordance (the X in the top-right of the drawer). Same
// no-JS mechanism: an <a href="#"> that clears the fragment. Hidden on wide.
const sidebarCloseBase =
  "absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity " +
  "hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none " +
  "sm:hidden"

export function SidebarClose(props: { class?: ClassValue } & Record<string, any>) {
  const { class: className, ...rest } = props
  return (
    <a
      href="#"
      data-slot="sidebar-close"
      aria-label="Close navigation"
      class={cn(sidebarCloseBase, className)}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </a>
  )
}

// --- Inner structure ---------------------------------------------------

// Header — a fixed strip at the top of the rail (logo / app name).
export function SidebarHeader(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="sidebar-header"
      class={cn("flex items-center gap-2 px-4 py-3 text-sm font-semibold", props.class)}
    >
      {props.children}
    </div>
  )
}

// Body — the scrollable middle region holding the nav groups.
export function SidebarBody(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="sidebar-body"
      class={cn("flex-1 overflow-y-auto px-2 py-2", props.class)}
    >
      {props.children}
    </div>
  )
}

// Footer — pinned to the bottom of the rail (account, settings).
export function SidebarFooter(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="sidebar-footer"
      class={cn("mt-auto border-t px-4 py-3 text-sm", props.class)}
    >
      {props.children}
    </div>
  )
}

// Group — a labelled cluster of nav items.
export function SidebarGroup(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div data-slot="sidebar-group" class={cn("py-2", props.class)}>
      {props.children}
    </div>
  )
}

// Group label — a small section heading above a cluster of items.
export function SidebarGroupLabel(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <div
      id={props.id}
      data-slot="sidebar-group-label"
      class={cn(
        "px-3 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

// Item — a real navigation anchor. Pass `current` for the active page; it sets
// aria-current="page" and the active styling.
const sidebarItemBase =
  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-foreground " +
  "hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none " +
  // Active item: filled with the primary token (aria-current="page").
  "aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground aria-[current=page]:hover:bg-primary"

export function SidebarItem(
  props: PropsWithChildren<{
    href: string
    // Marks the link to the current page — sets aria-current="page" + active fill.
    current?: boolean
    icon?: Child
    class?: ClassValue
  }> & Record<string, any>,
) {
  const { href, current, icon, class: className, children, ...rest } = props
  return (
    <a
      href={href}
      data-slot="sidebar-item"
      aria-current={current ? "page" : undefined}
      class={cn(sidebarItemBase, className)}
      {...rest}
    >
      {icon}
      {children}
    </a>
  )
}

// Content — the main column to the right of the rail. A landmark <main>.
export function SidebarContent(
  props: PropsWithChildren<{ class?: ClassValue }> & Record<string, any>,
) {
  const { class: className, children, ...rest } = props
  return (
    <main
      data-slot="sidebar-content"
      class={cn("min-w-0 flex-1", className)}
      {...rest}
    >
      {children}
    </main>
  )
}
