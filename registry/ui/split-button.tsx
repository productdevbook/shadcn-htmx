/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Split Button — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A primary action <button> joined to a small disclosure toggle. The toggle
// opens a popup listing related secondary actions. Distinct from a dropdown
// menu: there is always a DEFAULT primary action that fires on its own click,
// independent of the menu.
//
// Anatomy / interaction modelled on Adam Argyle's web.dev split-button pattern
//   repos/web.dev/src/site/content/en/patterns/components/split-buttons/index.md
//   repos/web.dev/src/site/content/en/patterns/components/split-buttons/assets/body.html
// (joined primary button + a popup button carrying aria-haspopup; secondary
// actions live in a <ul> of <button>s). We translate its hover/focus CSS to
// theme-token Tailwind and drop its custom JS in favour of native primitives.
//
// Built on the native HTML Popover API (popover + popovertarget), so the
// platform gives us light-dismiss, ESC, top-layer rendering and focus
// restoration to the toggle — same approach as registry/ui/dropdown-menu.tsx.
//   repos/mdn/files/en-us/web/api/popover_api/
//   repos/mdn/files/en-us/web/html/reference/attributes/popovertarget/
//
// The popup carries data-slot="dropdown-menu" so it reuses the existing APG
// menu keyboard contract already shipped in public/site.js (ArrowUp/Down,
// Home/End, type-to-find, Enter/Space activate, click closes). A tiny
// split-button block in public/site.js mirrors the popup's open state onto
// the toggle's aria-expanded — the APG menu-button requirement the dropdown
// contract doesn't cover.
//   repos/aria-practices/content/patterns/menu-button/menu-button-pattern.html
//     ("aria-haspopup" on the trigger; "aria-expanded" true when displayed)
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/menu_role/
//
// htmx attrs / data-* / aria-* on the primary action ride through via {...rest}.
//   repos/htmx/www/reference.md (hx-get/hx-post/hx-target/hx-swap/…)

export type SplitButtonVariant = "default" | "secondary" | "destructive" | "outline"
export type SplitButtonSize = "sm" | "default" | "lg"
export type SplitButtonSide = "top" | "right" | "bottom" | "left"

// The joined group. Rounded on the outside; the two children square off their
// shared inner edge so they read as one control with a divider.
const rootClasses =
  "inline-flex items-stretch rounded-md shadow-xs outline-none isolate"

// Both segments share the same visual skin; only their inner radii differ.
const segmentBase =
  "inline-flex items-center justify-center font-medium whitespace-nowrap outline-none transition-colors " +
  "focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
  // htmx v4 in-flight affordance, mirroring registry/ui/button.tsx.
  "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

const variants: Record<SplitButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
}

// Per-size geometry for the primary action.
const actionSizes: Record<SplitButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
  default: "h-9 gap-2 px-4 text-sm has-[>svg]:px-3",
  lg: "h-10 gap-2 px-6 text-sm has-[>svg]:px-4",
}

// The toggle is square; width tracks its height per size.
const toggleSizes: Record<SplitButtonSize, string> = {
  sm: "w-8",
  default: "w-9",
  lg: "w-10",
}

// The hairline between the two segments. On a filled variant we tint the
// foreground colour down; on outline the shared border already divides them.
const dividerByVariant: Record<SplitButtonVariant, string> = {
  default: "border-l border-primary-foreground/20",
  secondary: "border-l border-foreground/15",
  destructive: "border-l border-white/25",
  outline: "border-l-0",
}

type SplitButtonProps = PropsWithChildren<{
  // Required — the popup id, matched by popovertarget on the toggle.
  menuId: string
  // Visible label of the primary action.
  label?: string
  variant?: SplitButtonVariant
  size?: SplitButtonSize
  // Which side of the toggle the popup opens on (positioned by site.js).
  side?: SplitButtonSide
  // Accessible name for the disclosure toggle (it has only an icon).
  toggleLabel?: string
  disabled?: boolean
  class?: ClassValue
  type?: "button" | "submit" | "reset"
  // htmx + form attrs ride onto the PRIMARY action button.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-delete"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-confirm"?: string
  name?: string
  value?: string
}>

// Down-chevron, mirrored from the web.dev pattern's popup-button glyph.
function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="size-4">
      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
  )
}

export function SplitButton(props: SplitButtonProps) {
  const {
    children,
    menuId,
    label,
    variant = "default",
    size = "default",
    side = "bottom",
    toggleLabel = "More actions",
    disabled,
    class: className,
    type = "button",
    ...rest
  } = props

  return (
    <div data-slot="split-button" class={cn(rootClasses, className)}>
      <button
        type={type}
        disabled={disabled}
        data-slot="split-button-action"
        class={cn(
          segmentBase,
          variants[variant],
          actionSizes[size],
          // Square off the toggle-facing edge.
          "rounded-l-md rounded-r-none",
        )}
        {...rest}
      >
        {label ?? children}
      </button>
      <button
        type="button"
        disabled={disabled}
        popovertarget={menuId}
        popovertargetaction="toggle"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label={toggleLabel}
        data-slot="split-button-toggle"
        class={cn(
          segmentBase,
          variants[variant],
          toggleSizes[size],
          dividerByVariant[variant],
          "rounded-r-md rounded-l-none",
        )}
      >
        <Chevron />
      </button>
    </div>
  )
}

type SplitButtonMenuProps = PropsWithChildren<{
  // Required — matches popovertarget on the toggle.
  id: string
  side?: SplitButtonSide
  class?: ClassValue
}>

// The popup of secondary actions. role="menu" + data-slot="dropdown-menu" so
// the existing public/site.js menu keyboard contract drives it for free.
export function SplitButtonMenu(props: SplitButtonMenuProps) {
  const { id, side = "bottom", class: className, children } = props
  return (
    <ul
      id={id}
      popover="auto"
      role="menu"
      data-slot="dropdown-menu"
      data-side={side}
      class={cn(
        "z-50 m-0 min-w-[12rem] list-none rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
        "[&:not(:popover-open)]:hidden",
        "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
        className,
      )}
    >
      {children}
    </ul>
  )
}

type SplitButtonItemProps = PropsWithChildren<{
  href?: string
  onclick?: string
  disabled?: boolean
  variant?: "default" | "destructive"
  class?: ClassValue
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-delete"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-confirm"?: string
}>

// One secondary action. Mirrors DropdownMenuItem so it inherits the same
// role="menuitem" keyboard + click-closes behaviour from site.js.
export function SplitButtonItem(props: SplitButtonItemProps) {
  const { children, href, onclick, disabled, variant = "default", class: className, ...rest } = props
  const itemBase =
    "relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none " +
    "focus:bg-accent focus:text-accent-foreground " +
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " +
    "[&_svg]:size-4 [&_svg]:shrink-0"
  const variantCls =
    variant === "destructive"
      ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
      : ""
  const Tag: any = href ? "a" : "button"
  return (
    <li role="none" class="contents">
      <Tag
        role="menuitem"
        type={href ? undefined : "button"}
        tabindex={-1}
        href={href}
        onclick={onclick}
        data-slot="split-button-item"
        data-disabled={disabled ? "true" : undefined}
        class={cn(itemBase, variantCls, className)}
        {...rest}
      >
        {children}
      </Tag>
    </li>
  )
}
