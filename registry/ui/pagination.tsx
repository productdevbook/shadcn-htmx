/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Pagination — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A standard navigation strip with Previous / 1 / 2 / 3 / … / Next.
// We render a real <nav> landmark with aria-label so AT users can jump
// to it directly. The active page carries aria-current="page" per WAI:
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-current/
//
// Server-driven model: each page link is a real <a> with href OR an htmx
// button that swaps a target. The component itself doesn't manage state
// — give it the page numbers + an href/builder + the active page.

type PaginationProps = PropsWithChildren<{
  // Accessible label for the navigation landmark.
  ariaLabel?: string
  class?: ClassValue
}>

export function Pagination(props: PaginationProps) {
  const { ariaLabel = "Pagination", class: className, children } = props
  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel}
      class={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul class="flex flex-row items-center gap-1">{children}</ul>
    </nav>
  )
}

// Each page (or ellipsis) goes inside an <li>.
type PaginationItemProps = PropsWithChildren<{ class?: ClassValue }>
export function PaginationItem(props: PaginationItemProps) {
  return <li class={cn(props.class)}>{props.children}</li>
}

// A single page link. `active` adds aria-current="page" + visual emphasis.
type PaginationLinkProps = PropsWithChildren<{
  href?: string
  active?: boolean
  class?: ClassValue
  // htmx attrs ride along.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>
export function PaginationLink(props: PaginationLinkProps) {
  const { href, active, class: className, children, ...rest } = props
  const Tag: any = href ? "a" : "button"
  return (
    <Tag
      href={href}
      type={href ? undefined : "button"}
      data-slot="pagination-link"
      aria-current={active ? "page" : undefined}
      class={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        active && "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Previous / Next chrome — same as PaginationLink but with built-in
// aria-label so screen readers don't say "<" or ">".
type PaginationNavProps = PropsWithChildren<{
  href?: string
  disabled?: boolean
  class?: ClassValue
  [key: `hx-${string}`]: any
}>

export function PaginationPrevious(props: PaginationNavProps) {
  const { href, disabled, class: className, children, ...rest } = props
  return (
    <PaginationLink
      href={disabled ? undefined : href}
      class={cn("gap-1 pl-2.5", disabled && "pointer-events-none opacity-50", className)}
      data-slot="pagination-prev"
      aria-label="Previous page"
      aria-disabled={disabled ? "true" : undefined}
      {...rest}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {children ?? <span>Previous</span>}
    </PaginationLink>
  )
}

export function PaginationNext(props: PaginationNavProps) {
  const { href, disabled, class: className, children, ...rest } = props
  return (
    <PaginationLink
      href={disabled ? undefined : href}
      class={cn("gap-1 pr-2.5", disabled && "pointer-events-none opacity-50", className)}
      data-slot="pagination-next"
      aria-label="Next page"
      aria-disabled={disabled ? "true" : undefined}
      {...rest}
    >
      {children ?? <span>Next</span>}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </PaginationLink>
  )
}

// Decorative ellipsis between page ranges. aria-hidden so AT skips it
// (the page numbers carry the meaning).
export function PaginationEllipsis(props: { class?: ClassValue }) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      class={cn("flex h-9 w-9 items-center justify-center text-muted-foreground", props.class)}
    >
      …
    </span>
  )
}
