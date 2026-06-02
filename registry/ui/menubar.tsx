/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Menubar — shadcn-htmx, htmx v4 + Tailwind v4.
//
// An app-style, visually-persistent horizontal bar of menus (File / Edit /
// View …). Each top-level item is a button that opens a submenu.
//
// shadcn-ui ships @radix-ui/react-menubar; we rebuild the SAME semantics on
// web standards instead of a JS-driven overlay:
//   - The bar is role="menubar" (default aria-orientation horizontal).
//   - Each trigger is role="menuitem" with aria-haspopup="menu" +
//     aria-expanded, and opens its submenu via the native Popover API
//     (popovertarget + popover="auto"). The platform then gives us light
//     dismiss, ESC, top-layer rendering, and focus restoration for free —
//     exactly like dropdown-menu.tsx.
//   - Submenu items are role="menuitem" and reuse the dropdown-menu item
//     styling/contract.
//
// The APG composite-widget keyboard contract (roving tabindex on the bar,
// ArrowLeft/Right along the bar, ArrowDown to open + focus first item,
// ArrowUp/Down inside a menu, Home/End, type-ahead, ESC) lives in
// public/site.js keyed on data-slot="menubar" — the platform does not
// provide composite menu navigation.
//
// Refs:
//   repos/aria-practices/content/patterns/menubar/menu-and-menubar-pattern.html
//     (Menu and Menubar pattern: roles/states + full keyboard contract)
//   repos/aria-practices/content/patterns/menubar/examples/menubar-navigation.html
//     (roving tabindex: first menuitem tabindex=0, parents carry
//      aria-haspopup + aria-expanded)
//   repos/mdn/files/en-us/web/api/popover_api/
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/menubar_role/
//   registry/ui/dropdown-menu.tsx (submenu/popover + item styling reused here)

// --- Root --------------------------------------------------------------

const menubarBase =
  "inline-flex h-9 items-center gap-0.5 rounded-md border bg-background p-1 shadow-xs"

export function Menubar(
  props: PropsWithChildren<{
    ariaLabel?: string
    class?: ClassValue
  }>,
) {
  const { ariaLabel, class: className, children } = props
  return (
    <div
      role="menubar"
      data-slot="menubar"
      aria-label={ariaLabel}
      class={cn(menubarBase, className)}
    >
      {children}
    </div>
  )
}

// --- Menu (trigger + popover submenu) ----------------------------------

const menubarTriggerBase =
  "flex select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none " +
  "focus:bg-accent focus:text-accent-foreground " +
  "aria-[expanded=true]:bg-accent aria-[expanded=true]:text-accent-foreground " +
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"

const menubarContentBase =
  "z-50 m-0 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none " +
  "[&:not(:popover-open)]:hidden " +
  "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out] " +
  "anchor-popover-bottom"

// MenubarMenu pairs a top-level trigger with its submenu popover. The
// trigger is the parent menuitem (aria-haspopup + aria-expanded); the
// popover is role="menu". `id` wires popovertarget → popover.
export function MenubarMenu(
  props: PropsWithChildren<{
    // Visible label of the top-level menu (e.g. "File").
    label: string
    // Unique id; the trigger's popovertarget and the menu's id.
    id: string
    disabled?: boolean
    triggerClass?: ClassValue
    contentClass?: ClassValue
  }>,
) {
  const { label, id, disabled, triggerClass, contentClass, children } = props
  return (
    <div data-slot="menubar-menu" class="contents">
      <button
        type="button"
        role="menuitem"
        // Roving tabindex: site.js promotes the first enabled trigger to
        // tabindex="0" on boot; the rest stay at -1.
        tabindex={-1}
        popovertarget={id}
        popovertargetaction="toggle"
        aria-haspopup="menu"
        aria-expanded="false"
        data-slot="menubar-trigger"
        data-menu-for={id}
        data-disabled={disabled ? "true" : undefined}
        disabled={disabled || undefined}
        class={cn(menubarTriggerBase, triggerClass)}
      >
        {label}
      </button>
      <div
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        data-slot="menubar-content"
        data-side="bottom"
        class={cn(menubarContentBase, contentClass)}
      >
        {children}
      </div>
    </div>
  )
}

// --- Items (mirrors dropdown-menu item contract) -----------------------

const itemBase =
  "relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none " +
  "focus:bg-accent focus:text-accent-foreground " +
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " +
  "[&_svg]:size-4 [&_svg]:shrink-0"

export type MenubarItemVariant = "default" | "destructive"

const variantMap: Record<MenubarItemVariant, string> = {
  default: "",
  destructive: "text-destructive focus:bg-destructive/10 focus:text-destructive",
}

type MenubarItemProps = PropsWithChildren<{
  onclick?: string
  href?: string
  disabled?: boolean
  variant?: MenubarItemVariant
  class?: ClassValue
  "hx-get"?: string
  "hx-post"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
}>

export function MenubarItem(props: MenubarItemProps) {
  const { children, onclick, href, disabled, variant = "default", class: className, ...rest } = props
  const Tag: any = href ? "a" : "button"
  return (
    <Tag
      role="menuitem"
      type={href ? undefined : "button"}
      tabindex={-1}
      href={href}
      onclick={onclick}
      data-slot="menubar-item"
      data-disabled={disabled ? "true" : undefined}
      class={cn(itemBase, variantMap[variant], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function MenubarSeparator(props: { class?: ClassValue }) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="menubar-separator"
      class={cn("-mx-1 my-1 h-px bg-border", props.class)}
    />
  )
}

export function MenubarLabel(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="menubar-label"
      class={cn("px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase", props.class)}
    >
      {props.children}
    </div>
  )
}
