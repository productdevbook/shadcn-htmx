/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Breadcrumb — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn source of truth (React/Radix anatomy we mirror):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/breadcrumb.tsx
//   repos/shadcn-ui/apps/v4/content/docs/components/radix/breadcrumb.mdx
//
// APG pattern (the accessibility contract):
//   repos/aria-practices/content/patterns/breadcrumb/breadcrumb-pattern.html
// The APG says: keyboard interaction is "Not applicable" — a breadcrumb is
// just a list of links, so there is ZERO JS here. The ARIA contract is:
//   1. The trail lives inside a navigation landmark.            (<nav>)
//   2. The landmark is labelled via aria-label / aria-labelledby.
//   3. The link to the current page carries aria-current="page".
//      "If the element representing the current page is not a link,
//       aria-current is optional."
//
// HOW WE DIFFER FROM RADIX shadcn:
//   - Radix renders BreadcrumbPage as <span role="link" aria-disabled="true"
//     aria-current="page">. That role="link" is an emulation that makes AT
//     announce a non-interactive element as a link — exactly the kind of
//     platform-faking AGENTS.md forbids. We drop role/aria-disabled and ship
//     a plain <span aria-current="page">: a real non-link element, which the
//     APG explicitly endorses ("If … not a link, aria-current is optional").
//     We keep aria-current because it still conveys "this is the current page"
//     and is harmless on a span:
//       repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-current/
//   - Radix BreadcrumbSeparator/Ellipsis use role="presentation"; we use plain
//     aria-hidden="true" which already removes the node from the a11y tree
//     (MDN aria-hidden) — no extra role needed for a decorative <li>/<span>.
//   - We render BreadcrumbList as <ol> (ordered: hierarchy has a direction),
//     matching the APG description "list of links … in hierarchical order".
//       repos/mdn/files/en-us/web/html/reference/elements/ol/

// Root navigation landmark. data-slot="breadcrumb".
type BreadcrumbProps = PropsWithChildren<{
  // Accessible name for the navigation landmark.
  ariaLabel?: string
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>
export function Breadcrumb(props: BreadcrumbProps) {
  const { ariaLabel = "Breadcrumb", class: className, children, ...rest } = props
  return (
    <nav data-slot="breadcrumb" aria-label={ariaLabel} class={cn(className)} {...rest}>
      {children}
    </nav>
  )
}

// Ordered list of trail items.
type BreadcrumbListProps = PropsWithChildren<{
  class?: ClassValue
  [key: `data-${string}`]: any
}>
export function BreadcrumbList(props: BreadcrumbListProps) {
  const { class: className, children, ...rest } = props
  return (
    <ol
      data-slot="breadcrumb-list"
      class={cn(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...rest}
    >
      {children}
    </ol>
  )
}

// A single trail item (link, page, or ellipsis goes inside).
type BreadcrumbItemProps = PropsWithChildren<{
  class?: ClassValue
  [key: `data-${string}`]: any
}>
export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const { class: className, children, ...rest } = props
  return (
    <li data-slot="breadcrumb-item" class={cn("inline-flex items-center gap-1.5", className)} {...rest}>
      {children}
    </li>
  )
}

// A real <a> to a parent page. htmx attrs ride along for partial nav.
type BreadcrumbLinkProps = PropsWithChildren<{
  href?: string
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>
export function BreadcrumbLink(props: BreadcrumbLinkProps) {
  const { href, class: className, children, ...rest } = props
  return (
    <a
      href={href}
      data-slot="breadcrumb-link"
      class={cn(
        "transition-colors hover:text-foreground",
        "focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}

// The current page. Plain <span aria-current="page"> — NOT a link.
type BreadcrumbPageProps = PropsWithChildren<{
  class?: ClassValue
  [key: `data-${string}`]: any
}>
export function BreadcrumbPage(props: BreadcrumbPageProps) {
  const { class: className, children, ...rest } = props
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      class={cn("font-normal text-foreground", className)}
      {...rest}
    >
      {children}
    </span>
  )
}

// Decorative separator between items. aria-hidden so AT skips the glyph.
type BreadcrumbSeparatorProps = PropsWithChildren<{ class?: ClassValue }>
export function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const { class: className, children } = props
  return (
    <li
      data-slot="breadcrumb-separator"
      aria-hidden="true"
      class={cn("[&>svg]:size-3.5", className)}
    >
      {children ?? (
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
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </li>
  )
}

// Collapsed-range indicator. aria-hidden glyph + sr-only "More" text so AT
// users still hear that items were omitted.
export function BreadcrumbEllipsis(props: { class?: ClassValue }) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      aria-hidden="true"
      class={cn("flex size-9 items-center justify-center", props.class)}
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
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span class="sr-only">More</span>
    </span>
  )
}
