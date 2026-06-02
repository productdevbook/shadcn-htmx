/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Accordion — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn upstream uses Radix Accordion. We use the native HTML
//   <details><summary>...</summary>...</details>
// so the platform gives us:
//   - Click / Space / Enter toggles open (browser default).
//   - aria-expanded mirrors the open attribute (browser-set on <summary>).
//   - <summary> is implicitly role="button" with accessible name from text.
//
// Native `<details name="...">` attribute (HTML Living Standard) makes the
// group exclusive — opening one item closes the others, no JS required.
// We use that for `type="single"`. For `type="multiple"` (the default) we
// omit the name attribute and every item can be expanded independently.
//
// Public/site.js adds the APG keyboard contract on top:
//   - Down/Up Arrow: move focus between summaries in the same accordion.
//   - Home / End: focus first / last summary.
//
// Refs:
//   repos/mdn/files/en-us/web/html/reference/elements/details/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/summary/index.md
//   repos/aria-practices/content/patterns/accordion/

export type AccordionType = "single" | "multiple"

type AccordionProps = PropsWithChildren<{
  // Required so the exclusive-accordion `name` attribute can scope items.
  id: string
  type?: AccordionType
  class?: ClassValue
}>

export function Accordion(props: AccordionProps) {
  const { id, type = "multiple", class: className, children } = props
  return (
    <div
      id={id}
      data-slot="accordion"
      data-accordion
      data-type={type}
      data-group-name={type === "single" ? id : undefined}
      class={cn("w-full", className)}
    >
      {children}
    </div>
  )
}

type AccordionItemProps = PropsWithChildren<{
  // Distinct value per item. Emitted as the `data-value` attribute so each
  // item is individually identifiable; the boot script does not derive any
  // aria-controls wiring from it. (Native <details>/<summary> is a disclosure
  // widget where aria-controls is optional per the WAI-ARIA Disclosure
  // pattern — repos/aria-practices/content/patterns/disclosure/.)
  value: string
  // Pre-open this item on initial render.
  open?: boolean
  disabled?: boolean
  class?: ClassValue
}>

export function AccordionItem(props: AccordionItemProps) {
  const { value, open, disabled, class: className, children, ...rest } = props
  return (
    <details
      data-slot="accordion-item"
      data-value={value}
      data-disabled={disabled ? "true" : undefined}
      // The boot script in registry/ui/accordion's Accordion wrapper assigns
      // the `name` attribute at render time for type="single" so it groups
      // exclusively. (We can't compute it here without context.)
      open={open}
      class={cn(
        "border-b last:border-b-0",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      // Forward hx-* / global attributes so the native `toggle` event (fired
      // by <details> just after open/close) can drive zero-JS lazy loading,
      // e.g. hx-trigger="toggle once" hx-get=...
      // repos/mdn/files/en-us/web/api/htmlelement/toggle_event/index.md
      // repos/htmx hx-trigger: accepts any DOM event.
      {...rest}
    >
      {children}
    </details>
  )
}

type AccordionTriggerProps = PropsWithChildren<{ class?: ClassValue }>

export function AccordionTrigger(props: AccordionTriggerProps) {
  const { class: className, children, ...rest } = props
  return (
    <summary
      data-slot="accordion-trigger"
      class={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none select-none marker:hidden " +
          "hover:underline " +
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
          "list-none [&::-webkit-details-marker]:hidden " +
          // Rotate the chevron when the parent <details> is open.
          "[details[open]>&_[data-slot=accordion-chevron]]:rotate-180",
        className,
      )}
      // Forward hx-* / global attributes onto the <summary> control.
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
        data-slot="accordion-chevron"
        class="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
  )
}

type AccordionContentProps = PropsWithChildren<{ class?: ClassValue }>

export function AccordionContent(props: AccordionContentProps) {
  const { class: className, children, ...rest } = props
  return (
    <div
      data-slot="accordion-content"
      class={cn("overflow-hidden pt-0 pb-4 text-sm", className)}
      // Forward hx-* / global attributes so a panel can lazy-load on first
      // open: hx-trigger="toggle once" hx-get=... on the enclosing <details>,
      // or hx-* directly here. repos/htmx hx-trigger accepts any DOM event.
      {...rest}
    >
      {children}
    </div>
  )
}
