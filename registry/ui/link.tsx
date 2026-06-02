/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Link — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui has no standalone "link" primitive — it styles links through the
// Button `link` variant and the `typography` docs. We ship a dedicated,
// text-first anchor instead. Anatomy/intent cross-checked against the Button
// `link` variant: repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/button.tsx.
//
// Accessibility contract — WAI-ARIA APG Link pattern:
//   repos/aria-practices/content/patterns/link/link-pattern.html
// The APG itself says: "Authors are strongly encouraged to use a native host
// language link element, such as an HTML <a> element with an href attribute."
// So we render a real <a href>. That gives us, for free and without any JS:
//   - the implicit `link` role (MDN: <a> has role=link when href is present —
//     repos/mdn/files/en-us/web/html/reference/elements/a/index.md "Implicit
//     ARIA role"),
//   - Enter activates + moves focus to the target (the APG keyboard contract —
//     link-pattern.html "Keyboard Interaction": Enter executes the link),
//   - browser affordances the APG example flags as lost when you fake a link
//     with role=link on a <span>: open-in-new-tab, copy-link, drag, Shift+F10
//     context menu.
// The APG link *examples* (link/examples/link.html) only reach for
// role=link + tabindex=0 + onkeydown when the markup genuinely cannot be an
// <a> (a <span> or <img>). We expose that fallback via `as` + `role="link"`,
// but the default — and the path we document — is the native element.
//
// `external` sets target/rel and renders a visible "opens in new tab" icon +
// visually-hidden text, per MDN's "External links" guidance
// (a/index.md "External links and linking to non-HTML resources"). Modern
// browsers treat target="_blank" as rel="noopener" implicitly; we still emit
// rel="noopener noreferrer" so the protection is explicit and back-compatible.

export type LinkVariant =
  | "default" // underlined, primary colour — reads as a link in prose
  | "muted" // muted-foreground, underlined — low-emphasis inline link
  | "hover" // no underline at rest, underline on hover/focus — nav/menu link

const base =
  "inline-flex items-center gap-1 rounded-sm font-medium text-primary underline-offset-4 transition-colors outline-none " +
  // Native <a> is keyboard-focusable; render the same focus ring as the rest
  // of the library so the focus state is obvious. ring-ring/50 + a 2px ring.
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  // role=link fallback (non-anchor) must look identical and not show a text
  // cursor; the platform won't give it pointer affordance the way <a> does.
  "[&[role=link]]:cursor-pointer " +
  // Decorative SVGs inside the link (the external-link glyph) get sized here
  // so callers don't have to.
  "[&>svg]:pointer-events-none [&>svg]:size-3.5 [&>svg]:shrink-0"

const variants: Record<LinkVariant, string> = {
  default: "underline decoration-primary/40 hover:decoration-primary",
  muted:
    "text-muted-foreground underline decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground",
  hover: "no-underline hover:underline",
}

export function linkClasses(opts?: {
  variant?: LinkVariant
  class?: ClassValue
}): string {
  const variant = opts?.variant ?? "default"
  return cn(base, variants[variant], opts?.class)
}

type LinkProps = PropsWithChildren<{
  variant?: LinkVariant
  class?: ClassValue

  // The destination. Native <a href>. Omitting href yields a non-link
  // <a> (generic role) — usually you want href.
  href?: string

  // Treat the link as external: opens in a new browsing context and appends
  // the "opens in new tab" affordance (icon + SR-only text). See MDN
  // "External links" guidance. Sets target="_blank" rel="noopener noreferrer".
  external?: boolean

  // Standard <a> attributes (MDN). target/rel are managed by `external` but
  // can be set explicitly too.
  target?: "_self" | "_blank" | "_parent" | "_top" | (string & {})
  rel?: string
  download?: boolean | string
  hreflang?: string
  referrerpolicy?: string
  ping?: string
  type?: string

  id?: string
  ariaLabel?: string
  ariaLabelledby?: string
  // aria-describedby is a global ARIA attribute valid on the implicit `link`
  // role (MDN: <a href> exposes role=link). Reference a description distinct
  // from the link text — e.g. "PDF, 2MB" / "opens in new tab".
  ariaDescribedby?: string
  ariaCurrent?: "page" | "step" | "location" | "date" | "time" | "true" | "false"

  // APG fallback only: render a non-anchor element with role="link". The
  // platform will NOT navigate for you — wire navigation yourself (see docs).
  // We still add tabindex=0 + role=link so it's reachable and announced.
  as?: "a" | "span" | "button"
  role?: "link"

  // htmx v4 — e.g. boost a same-origin link into a fetch+swap. See
  // repos/htmx/www/src/content/reference/.
  "hx-get"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-boost"?: string
  "hx-push-url"?: string
}>

export function Link(props: LinkProps) {
  const {
    children,
    variant,
    class: className,
    href,
    external,
    target,
    rel,
    as,
    role,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaCurrent,
    ...rest
  } = props

  const Tag: any = as ?? "a"
  const isAnchor = Tag === "a"

  // External: open in a new tab and make that explicit. rel="noopener
  // noreferrer" drops window.opener + the Referer header.
  const resolvedTarget = external ? (target ?? "_blank") : target
  const resolvedRel = external ? (rel ?? "noopener noreferrer") : rel

  // APG fallback: a non-anchor element must be told it's a link (role=link)
  // and put in the tab order (tabindex=0). A native <a> already has both for
  // free — never override them. role="link" passed explicitly on an <a> is
  // ignored (it's already the implicit role).
  const resolvedRole = isAnchor ? undefined : "link"
  const tabindex = isAnchor ? undefined : 0

  const classes = linkClasses({ variant, class: className })

  return (
    <Tag
      id={props.id}
      href={isAnchor ? href : undefined}
      target={isAnchor ? resolvedTarget : undefined}
      rel={isAnchor ? resolvedRel : undefined}
      role={resolvedRole}
      tabindex={tabindex}
      // APG fallback: href is invalid on a non-anchor, so the browser won't
      // navigate (APG link/examples/link.html). Pass the destination through as
      // data-href so site.js can wire Enter/click on [role=link][data-href].
      data-href={!isAnchor ? href : undefined}
      data-slot="link"
      data-variant={variant ?? "default"}
      data-external={external ? "true" : undefined}
      class={classes}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-current={ariaCurrent}
      {...rest}
    >
      {children}
      {/* External-link glyph. aria-hidden — the SR-only text carries the
          meaning for assistive tech (MDN "External links" guidance). */}
      {external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </svg>
      )}
      {external && <span class="sr-only"> (opens in new tab)</span>}
    </Tag>
  )
}
