/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Skip Link — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A "Skip to main content" link: the FIRST focusable element in the document,
// visually hidden until it receives keyboard focus, that jumps focus past the
// repeated banner/nav to the page's main landmark. This is the foundational
// keyboard entry point of the page shell — zero JavaScript, pure platform.
//
// Accessibility contract — WAI-ARIA APG Landmark Regions practice:
//   repos/aria-practices/content/practices/landmark-regions/landmark-regions-practice.html
//   "Landmark regions can also be used as targets for 'skip links' and by
//    browser extensions to enhance keyboard navigation." (Introduction)
// The skip link's destination is therefore a landmark — by default <main>
// (the Main landmark, exactly one per page):
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/main_role/index.md
//
// Built on a native <a href="#main"> (MDN: an <a> with href has the implicit
// `link` role + Enter-to-activate + focus-moves-to-fragment-target, all from
// the platform — no JS, no role/tabindex needed):
//   repos/mdn/files/en-us/web/html/reference/elements/a/index.md
//
// Reveal-on-focus is CSS-only. At rest the link is `sr-only` (the standard
// visually-hidden recipe — Tailwind's sr-only: position:absolute; 1px box;
// clip-path:inset(50%) — repos/tailwindcss/packages/tailwindcss/src/utilities.ts).
// Because that box is clipped and 1px, a pointer can't land on it, so the only
// way it gains focus is a keyboard Tab; on :focus we flip to `not-sr-only` and
// position it in the top-left. We key the reveal off :focus (not :focus-visible)
// so the revealed pill is consistent for every focus source, while staying
// invisible for mouse users who never tab to it.
//
// Visual styling mirrors the rest of the library: bg-primary pill on a ring,
// using only existing theme tokens.

const base =
  // Visually hidden at rest — the standard SR-only recipe. A clipped 1px box
  // can't be hit by a pointer, so focus only arrives via keyboard Tab.
  "sr-only " +
  // On focus, undo the clip and pin to the top-left as a real pill. `absolute`
  // positions it against the nearest positioned ancestor (the page <body> in
  // production; a relative wrapper in the docs preview).
  "focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 " +
  "focus:inline-flex focus:items-center focus:gap-2 focus:rounded-md " +
  "focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium " +
  "focus:text-primary-foreground focus:shadow-md focus:no-underline " +
  // Same focus ring as the rest of the library so the landing point is obvious.
  "focus:outline-none focus:ring-[3px] focus:ring-ring/50"

export function skipLinkClasses(opts?: { class?: ClassValue }): string {
  return cn(base, opts?.class)
}

type SkipLinkProps = PropsWithChildren<{
  // Fragment of the target landmark. Defaults to "#main" — the Main landmark.
  // Must match the id of the element focus should jump to (typically <main id="main">).
  href?: string
  class?: ClassValue
  id?: string

  // htmx v4 attributes (subset). Forwarded onto the <a> via {...rest}. A skip
  // link rarely needs htmx, but boosting same-origin links is supported.
  // See repos/htmx/www/reference.md.
  "hx-get"?: string
  "hx-boost"?: string
}>

export function SkipLink(props: SkipLinkProps) {
  const { children, href = "#main", class: className, id, ...rest } = props
  return (
    <a
      id={id}
      href={href}
      data-slot="skip-link"
      class={skipLinkClasses({ class: className })}
      {...rest}
    >
      {children ?? "Skip to main content"}
    </a>
  )
}
