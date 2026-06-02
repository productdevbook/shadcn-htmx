/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cloneElement, isValidElement } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Badge — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth (variants + base class 1:1):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/badge.tsx
//
// A non-interactive visual marker. Renders as <span> by default. Pass
// `as="a"` (or `asChild` with a child anchor) to make it a link — the
// upstream uses Radix Slot.Root; we use cloneElement.
//
// Accessibility:
//   - The badge's content (text) IS the accessible name. If you render an
//     icon-only badge, set `ariaLabel` so screen readers can name it.
//   - Status-style badges ("New", "3 unread") that update in place should
//     live inside an aria-live region (use Alert / Toast for that, not
//     Badge). Badge itself is presentational.
//   - See repos/mdn/files/en-us/web/html/reference/elements/span/index.md for
//     <span> semantics (none — it's a generic inline container).

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"

const base =
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "[&>svg]:pointer-events-none [&>svg]:size-3"

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
  destructive:
    "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
  outline:
    "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  link: "text-primary underline-offset-4 [a&]:hover:underline",
}

export function badgeClasses(opts?: {
  variant?: BadgeVariant
  class?: ClassValue
}): string {
  const variant = opts?.variant ?? "default"
  return cn(base, variants[variant], opts?.class)
}

type BadgeProps = PropsWithChildren<{
  variant?: BadgeVariant
  class?: ClassValue
  id?: string
  ariaLabel?: string
  ariaLabelledby?: string
  // Render as a different element. <a> is the common case (link badge).
  as?: "span" | "a" | "div" | "button"
  href?: string
  // SSR-friendly equivalent of shadcn's asChild — clone the single JSX
  // child and merge classes onto it. Useful for wrapping a custom <Link>.
  asChild?: boolean
}>

export function Badge(props: BadgeProps) {
  const {
    children,
    variant,
    class: className,
    as,
    href,
    asChild,
    ariaLabel,
    ariaLabelledby,
    id,
    ...rest
  } = props

  const classes = badgeClasses({ variant, class: className })

  if (asChild && isValidElement(children)) {
    const child = children as any
    return cloneElement(child, {
      ...rest,
      class: cn(classes, child?.props?.class),
      "data-slot": "badge",
      "data-variant": variant ?? "default",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    })
  }

  const Tag: any = as ?? (href ? "a" : "span")
  return (
    <Tag
      id={id}
      href={href}
      data-slot="badge"
      data-variant={variant ?? "default"}
      class={classes}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </Tag>
  )
}
