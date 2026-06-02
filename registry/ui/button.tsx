/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cloneElement, isValidElement } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Variants mirror shadcn/ui's Button (new-york-v4), translated to htmx-friendly
// server-rendered JSX. Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/button.tsx
//
// Accessibility contract follows the WAI-ARIA APG button pattern:
//   repos/aria-practices/content/patterns/button/button-pattern.html
// Because we render a real <button>, role and Space/Enter activation come for
// free from the platform — we only add aria-* where the pattern demands it.
//
// Polymorphic rendering: shadcn uses Radix Slot.Root for `asChild`. Hono JSX
// has cloneElement, so we implement the same idea — pass a single JSX child
// (e.g. <a href="...">), and the button classes are merged onto it.

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"

export type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  // aria-disabled mirrors the disabled affordance for cases where the element
  // must stay focusable (so screen readers can land on it and announce why
  // it's unavailable). See repos/mdn/files/en-us/web/accessibility/aria/attributes/aria-disabled/.
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
  // htmx v4: while a request triggered by/targeting this button is in flight,
  // htmx adds the .htmx-request class. We mirror disabled affordance.
  "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizes: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
  sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
  "icon-sm": "size-8",
  "icon-lg": "size-10",
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

// Props beyond visual variants. We intentionally type the standard <button>
// attributes we actually want IDE support for. Hono's JSX accepts unknown
// attribute names on intrinsic elements, but typing the common ones keeps
// call sites honest.
type ButtonProps = PropsWithChildren<{
  variant?: ButtonVariant
  size?: ButtonSize
  class?: ClassValue
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  // aria-disabled keeps the element focusable while its action is unavailable
  // (so a screen reader can land on it and announce it), unlike native
  // `disabled` which removes it from the a11y tree / tab order. Independent of
  // `disabled`. See repos/aria-practices/content/patterns/button/button-pattern.html
  // and repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-disabled/.
  ariaDisabled?: boolean
  // APG: ARIA toggle button. When set, aria-pressed reflects the state and
  // the label must stay constant across states. aria-pressed is tri-state:
  // "mixed" means the items the toggle controls don't all share one value.
  // See repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-pressed/.
  pressed?: boolean | "mixed"
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string

  // Disclosure / menu / popover trigger contract. Lets a styled Button act as
  // an expandable trigger (accordion/collapsible) or menu/listbox/dialog
  // opener without hand-rolling a bare <button>.
  // See repos/aria-practices/content/patterns/button/button-pattern.html
  // and repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-expanded/
  // and repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-haspopup/.
  ariaExpanded?: boolean
  ariaHaspopup?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog"
  ariaControls?: string

  // Standard form attributes (MDN <button>). Useful for multi-submit-button
  // forms where one button posts to a different URL or method.
  id?: string
  name?: string
  value?: string
  form?: string
  formaction?: string
  formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"
  formmethod?: "get" | "post" | "dialog"
  formnovalidate?: boolean
  formtarget?: string
  popovertarget?: string
  popovertargetaction?: "show" | "hide" | "toggle"

  // Focus this button on initial page load (one per document).
  autofocus?: boolean

  // Invoker API (newer than popovertarget — declarative dialog/popover
  // control). `command` is one of: show-modal | close | request-close |
  // show-popover | hide-popover | toggle-popover | --custom; `commandfor`
  // is the target element id.
  // See repos/mdn/files/en-us/web/html/reference/elements/button/index.md:60-85
  command?:
    | "show-modal"
    | "close"
    | "request-close"
    | "show-popover"
    | "hide-popover"
    | "toggle-popover"
    | (string & {}) // `--custom-command` is allowed too
  commandfor?: string

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

  // Render as the single JSX child element (anchor, label, etc.) with the
  // button classes merged onto it. SSR-friendly equivalent of shadcn's
  // Radix-Slot-based `asChild` pattern.
  asChild?: boolean
}>

export function Button(props: ButtonProps) {
  const {
    children,
    variant,
    size,
    class: className,
    type = "button",
    disabled,
    ariaDisabled,
    pressed,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    asChild,
    ...rest
  } = props

  const classes = buttonClasses({ variant, size, class: className })

  // asChild path: clone the single child and merge classes/data-* onto it so
  // the call site can render as <a>, <label>, etc. while keeping the visual
  // contract. Throws softly (returns the children unchanged) if the child
  // isn't a valid element.
  if (asChild && isValidElement(children)) {
    const child = children as any
    const merged = cn(classes, child?.props?.class)
    return cloneElement(child, {
      ...rest,
      class: merged,
      "data-slot": "button",
      "data-variant": variant ?? "default",
      "data-size": size ?? "default",
      "aria-disabled": ariaDisabled ? "true" : undefined,
      "aria-pressed": pressed === undefined ? undefined : pressed,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-expanded": ariaExpanded === undefined ? undefined : ariaExpanded,
      "aria-haspopup": ariaHaspopup === undefined ? undefined : ariaHaspopup,
      "aria-controls": ariaControls,
    })
  }

  return (
    <button
      type={type}
      class={classes}
      disabled={disabled}
      aria-disabled={ariaDisabled ? "true" : undefined}
      aria-pressed={pressed === undefined ? undefined : pressed}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-expanded={ariaExpanded === undefined ? undefined : ariaExpanded}
      aria-haspopup={ariaHaspopup === undefined ? undefined : ariaHaspopup}
      aria-controls={ariaControls}
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      {...rest}
    >
      {children}
    </button>
  )
}
