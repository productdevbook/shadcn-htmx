/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cloneElement, isValidElement } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Tooltip — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn upstream uses Radix Tooltip. For our SSR setup we lean on CSS
// hover + focus-within to show the tooltip — no client state machine
// needed for the common case. A tiny ESC handler in public/site.js
// implements the APG dismissal contract.
//
// APG rules we implement:
//   - Tooltip appears on hover AND keyboard focus (not just hover).
//   - ESC dismisses the visible tooltip.
//   - The tooltip is referenced by aria-describedby on the trigger so AT
//     announces it after the trigger's own name ("Save, Saves your work
//     to the server").
//   - The tooltip must NOT contain interactive content (no buttons, no
//     links) — if you need that, use Popover (coming) instead.
//
// Refs:
//   repos/aria-practices/content/patterns/tooltip/
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/tooltip_role/
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-describedby/

export type TooltipSide = "top" | "right" | "bottom" | "left"

const wrapperBase =
  // inline-block + w-fit so the wrapper shrink-wraps the trigger button.
  // The absolute-positioned tooltip child must not contribute width OR
  // cause the wrapper to stretch. Two pitfalls:
  //   1. inline-flex includes abs children in some sizing calcs → wider
  //      than the button → broken horizontal centring.
  //   2. CSS Grid and Flexbox blockify inline-* direct children (inline-block
  //      → block), which stretches the wrapper to fill the cell.
  // w-fit (width: fit-content) survives both — even when blockified to
  // block by a grid parent, the wrapper still shrinks to the trigger's
  // intrinsic width.
  "relative inline-block w-fit group/tooltip align-middle " +
  // Show on hover OR focus-within (APG: keyboard users get the same reveal).
  "[&:hover>[data-slot=tooltip-content]]:opacity-100 " +
  "[&:focus-within>[data-slot=tooltip-content]]:opacity-100 " +
  // ESC handler sets data-suppress="true"; we forcibly hide while it's set.
  "[&[data-suppress=true]>[data-slot=tooltip-content]]:opacity-0!"

const contentBase =
  "pointer-events-none absolute z-50 w-max max-w-xs rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md opacity-0 transition-opacity duration-150 " +
  // dark mode flips colors so tooltip stays high-contrast.
  "dark:bg-foreground dark:text-background"

const sidePosition: Record<TooltipSide, string> = {
  top: "left-1/2 -translate-x-1/2 bottom-[calc(100%+0.5rem)]",
  bottom: "left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)]",
  left: "top-1/2 -translate-y-1/2 right-[calc(100%+0.5rem)]",
  right: "top-1/2 -translate-y-1/2 left-[calc(100%+0.5rem)]",
}

type TooltipProps = PropsWithChildren<{
  // Required for aria-describedby pairing.
  id: string
  // Tooltip text (must be plain or limited inline content — no buttons).
  content: string
  side?: TooltipSide
  // Show only on hover (skip focus). Defaults to false — both hover and
  // focus reveal, per APG. Setting true is a degradation; keyboard users
  // lose discoverability.
  hoverOnly?: boolean
  class?: ClassValue
  contentClass?: ClassValue
}>

export function Tooltip(props: TooltipProps) {
  const {
    id,
    content,
    side = "top",
    hoverOnly = false,
    class: className,
    contentClass,
    children,
  } = props
  // APG/MDN: aria-describedby must live on the element that RECEIVES FOCUS —
  // the trigger — not on this inert wrapper span, or AT won't announce the
  // tooltip when the trigger is focused. Clone the single child to attach it.
  // Fall back to the wrapper only if children isn't one valid element, so the
  // description relationship is never silently dropped.
  const onTrigger = isValidElement(children)
  const trigger = onTrigger
    ? cloneElement(children as any, { "aria-describedby": id })
    : children
  return (
    <span
      data-slot="tooltip"
      data-side={side}
      data-tooltip-trigger
      // Tab-targetable for keyboard reveal. Skip when hoverOnly.
      tabindex={hoverOnly ? -1 : undefined}
      class={cn(wrapperBase, className)}
      aria-describedby={onTrigger ? undefined : id}
    >
      {trigger}
      <span
        id={id}
        role="tooltip"
        data-slot="tooltip-content"
        data-side={side}
        class={cn(contentBase, sidePosition[side], contentClass)}
      >
        {content}
      </span>
    </span>
  )
}
