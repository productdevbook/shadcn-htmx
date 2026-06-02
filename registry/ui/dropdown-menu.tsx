/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Dropdown Menu — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Built on top of the native HTML Popover API (popover + popovertarget),
// so the platform gives us:
//   - Light dismiss when the user clicks outside.
//   - ESC closes the menu.
//   - Top-layer rendering.
//   - Focus restoration to the trigger after close.
//
// On top, public/site.js implements the APG menu keyboard contract:
//   - ArrowDown / ArrowUp move focus between menuitems.
//   - Home / End jump to first / last.
//   - Type-to-find: pressing a letter focuses the next menuitem whose
//     label starts with that letter.
//   - Enter / Space activate the focused item.
//
// Refs:
//   repos/aria-practices/content/patterns/menu-button/
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/menu_role/

export type DropdownMenuSide = "top" | "right" | "bottom" | "left"

type DropdownMenuProps = PropsWithChildren<{
  // Required — matches popovertarget on the trigger.
  id: string
  // Which side of the trigger the menu opens on. site.js reads data-side
  // and positions the popover via JS (CSS Anchor Positioning isn't yet
  // shipped in every browser).
  side?: DropdownMenuSide
  class?: ClassValue
}>

export function DropdownMenu(props: DropdownMenuProps) {
  const { id, side = "bottom", class: className, children } = props
  return (
    <div
      id={id}
      popover="auto"
      role="menu"
      data-slot="dropdown-menu"
      data-side={side}
      class={cn(
        "z-50 m-0 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
        "[&:not(:popover-open)]:hidden",
        "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
        className,
      )}
    >
      {children}
    </div>
  )
}

type DropdownMenuTriggerProps = PropsWithChildren<{
  menuFor: string
  class?: ClassValue
  id?: string
}>

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return (
    <button
      id={props.id}
      type="button"
      popovertarget={props.menuFor}
      popovertargetaction="toggle"
      data-slot="dropdown-menu-trigger"
      aria-haspopup="menu"
      class={cn(props.class)}
    >
      {props.children}
    </button>
  )
}

type DropdownMenuItemProps = PropsWithChildren<{
  // Action when the item is activated. Most calls just need `onClickHref`
  // or pass htmx attrs; we keep the API thin.
  onclick?: string
  href?: string
  disabled?: boolean
  // Show as a destructive/danger menu item (red).
  variant?: "default" | "destructive"
  class?: ClassValue
  // htmx attributes ride along onto the button/anchor.
  "hx-get"?: string
  "hx-post"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
}>

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const { children, onclick, href, disabled, variant = "default", class: className, ...rest } = props
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
    <Tag
      role="menuitem"
      type={href ? undefined : "button"}
      tabindex={-1}
      href={href}
      onclick={onclick}
      data-slot="dropdown-menu-item"
      data-disabled={disabled ? "true" : undefined}
      class={cn(itemBase, variantCls, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function DropdownMenuSeparator(props: { class?: ClassValue }) {
  return (
    <div
      role="separator"
      data-slot="dropdown-menu-separator"
      class={cn("-mx-1 my-1 h-px bg-border", props.class)}
    />
  )
}

export function DropdownMenuLabel(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="dropdown-menu-label"
      class={cn("px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase", props.class)}
    >
      {props.children}
    </div>
  )
}
