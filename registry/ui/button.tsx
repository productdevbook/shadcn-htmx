/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Variants mirror shadcn/ui's Button (new-york-v4), translated to htmx-friendly
// server-rendered JSX. Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/button.tsx
//
// Accessibility contract follows the WAI-ARIA APG button pattern:
//   repos/aria-practices/content/patterns/button/button-pattern.html
// Because we render a real <button>, role and Space/Enter activation come for
// free from the platform — we only add aria-* where the pattern demands it.

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"

export type ButtonSize = "default" | "sm" | "lg" | "icon"

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none " +
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
  // htmx v4: while a request triggered by/targeting this button is in flight,
  // htmx adds the .htmx-request class. We mirror disabled affordance.
  "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60",
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizes: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
}

export function buttonClasses(opts?: {
  variant?: ButtonVariant
  size?: ButtonSize
  class?: ClassValue
}): string {
  const variant = opts?.variant ?? "default"
  const size = opts?.size ?? "default"
  return cn(base, variants[variant], sizes[size], opts?.class)
}

// Props beyond visual variants. We intentionally type only the htmx attributes
// we use here — Hono's JSX accepts unknown attribute names on intrinsic
// elements, but typing the ones we care about keeps the call sites honest.
type ButtonProps = PropsWithChildren<{
  variant?: ButtonVariant
  size?: ButtonSize
  class?: ClassValue
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  // APG: ARIA toggle button. When set, aria-pressed reflects the state and
  // the label must stay constant across states.
  pressed?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // htmx v4 attributes (subset). See repos/htmx/www/src/content/reference/01-attributes/.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-delete"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-indicator"?: string
  "hx-confirm"?: string
  "hx-vals"?: string
  // v4: "disable form elements during requests" (renamed from v3's hx-disabled-elt).
  // See repos/htmx/www/src/content/docs/01-get-started/02-migration.md.
  "hx-disable"?: string
  id?: string
  name?: string
  value?: string
  form?: string
}>

export function Button(props: ButtonProps) {
  const {
    children,
    variant,
    size,
    class: className,
    type = "button",
    disabled,
    pressed,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ...rest
  } = props

  return (
    <button
      type={type}
      class={buttonClasses({ variant, size, class: className })}
      disabled={disabled}
      aria-pressed={pressed === undefined ? undefined : pressed}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      {...rest}
    >
      {children}
    </button>
  )
}
