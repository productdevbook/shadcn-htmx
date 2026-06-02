/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Popover — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Uses the native HTML Popover API (popover + popovertarget attributes).
// The platform gives us:
//   - Top-layer rendering           (no z-index race with siblings).
//   - Light dismiss in "auto" mode  (click outside closes it).
//   - ESC closes the popover.
//   - aria-haspopup / aria-expanded auto-managed on the trigger.
//   - Focus restoration to the opener.
//
// shadcn upstream uses Radix Popover; we use the native equivalent.
//
// Refs:
//   repos/mdn/files/en-us/web/api/popover_api/  (overview)
//   repos/mdn/files/en-us/web/html/global_attributes/popover.md
//   repos/mdn/files/en-us/web/html/reference/attributes/popovertarget.md

export type PopoverSide = "top" | "right" | "bottom" | "left"

// Positioning is JS-driven in public/site.js (reads data-side and writes
// inline top/left on `toggle`). CSS Anchor Positioning would replace
// this, but it's Chrome-only at time of writing.

const base =
  "z-50 m-0 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none " +
  // Native [popover] is display:none by default and only revealed when
  // open. We add :popover-open animation via Tailwind.
  "[&:not(:popover-open)]:hidden " +
  // animate-fade-in is keyframed in input.css.
  "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]"

export function popoverClasses(opts?: { class?: ClassValue }): string {
  return cn(base, opts?.class)
}

type PopoverProps = PropsWithChildren<{
  // Required — used by the trigger via popovertarget.
  id: string
  // "auto" (default): light dismiss + ESC. "manual": only code can toggle.
  mode?: "auto" | "manual"
  // Side hint — used for anchor positioning if the browser supports it.
  side?: PopoverSide
  class?: ClassValue
}>

export function Popover(props: PopoverProps) {
  const { id, mode = "auto", side = "bottom", class: className, children } = props
  return (
    <div
      id={id}
      // Native popover attribute. `popover=""` is equivalent to popover="auto".
      popover={mode === "manual" ? "manual" : "auto"}
      data-slot="popover"
      data-side={side}
      class={cn(popoverClasses(), className)}
    >
      {children}
    </div>
  )
}

type PopoverTriggerProps = PropsWithChildren<{
  // ID of the popover this triggers.
  popoverTarget: string
  // What clicking the trigger does. Default "toggle".
  popoverTargetAction?: "show" | "hide" | "toggle"
  class?: ClassValue
  id?: string
}>

export function PopoverTrigger(props: PopoverTriggerProps) {
  const {
    popoverTarget,
    popoverTargetAction = "toggle",
    children,
    class: className,
    id,
  } = props
  // Renders a native <button> carrying the popovertarget attributes. For
  // richer chrome, spread { popovertarget, popovertargetaction } onto a
  // styled <Button> directly instead of using this trigger.
  return (
    <button
      id={id}
      type="button"
      popovertarget={popoverTarget}
      popovertargetaction={popoverTargetAction}
      data-slot="popover-trigger"
      class={cn(className)}
    >
      {children}
    </button>
  )
}
