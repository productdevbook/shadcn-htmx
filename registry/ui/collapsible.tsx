/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Collapsible — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn upstream uses Radix Collapsible (a CollapsibleTrigger button + a
// CollapsibleContent region wired together with aria-expanded / aria-controls
// and JS state). We use the native HTML disclosure widget instead:
//   <details><summary>Trigger</summary>...content...</details>
// so the platform gives us, with zero JS:
//   - Click / Space / Enter toggles open (browser default on <summary>).
//   - <summary> is implicitly role="button", focusable, with its text as the
//     accessible name; the browser sets aria-expanded to mirror `open`.
//   - The content is the accessible description of the summary.
//
// This is the WAI-ARIA Disclosure (Show/Hide) pattern: a single button that
// shows/hides one section of content. Distinct from Accordion — Collapsible
// is a standalone, single show/hide, NOT a group, so there is no `name`
// attribute and no exclusive grouping. No public/site.js hook is required:
// the entire keyboard contract (Enter / Space) is native to <summary>.
//
// Refs:
//   repos/aria-practices/content/patterns/disclosure/disclosure-pattern.html
//     (Keyboard: Enter / Space toggle; role=button; aria-expanded true/false)
//   repos/mdn/files/en-us/web/html/reference/elements/details/index.md
//     (`open` boolean; implicit ARIA role=group; toggle event)
//   repos/mdn/files/en-us/web/html/reference/elements/summary/index.md
//     (click/Space toggles parent <details>; display:list-item marker)

type CollapsibleProps = PropsWithChildren<{
  // Pre-open the disclosure on initial render.
  open?: boolean
  disabled?: boolean
  class?: ClassValue
}>

export function Collapsible(props: CollapsibleProps) {
  const { open, disabled, class: className, children, ...rest } = props
  return (
    <details
      data-slot="collapsible"
      data-disabled={disabled ? "true" : undefined}
      open={open}
      class={cn(
        "w-full",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
    </details>
  )
}

type CollapsibleTriggerProps = PropsWithChildren<{ class?: ClassValue }>

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const { class: className, children, ...rest } = props
  return (
    <summary
      data-slot="collapsible-trigger"
      class={cn(
        "flex cursor-pointer items-center justify-between gap-4 rounded-md py-2 text-left text-sm font-medium transition-all outline-none select-none marker:hidden " +
          "hover:underline " +
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
          "list-none [&::-webkit-details-marker]:hidden " +
          // Rotate the chevron when the parent <details> is open.
          "[details[open]>&_[data-slot=collapsible-chevron]]:rotate-180",
        className,
      )}
      {...rest}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        data-slot="collapsible-chevron"
        class="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
  )
}

type CollapsibleContentProps = PropsWithChildren<{ class?: ClassValue }>

export function CollapsibleContent(props: CollapsibleContentProps) {
  const { class: className, children, ...rest } = props
  return (
    <div
      data-slot="collapsible-content"
      class={cn("overflow-hidden pt-2 pb-1 text-sm", className)}
      {...rest}
    >
      {children}
    </div>
  )
}
