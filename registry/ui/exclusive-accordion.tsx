/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Exclusive Accordion — shadcn-htmx, htmx v4 + Tailwind v4.
//
// The scriptless, single-open accordion. Several <details> elements share one
// `name` attribute, so the browser keeps exactly one open at a time: opening
// any item auto-closes the others. This is the pure-HTML exclusive variant of
// the APG-scripted accordion — ZERO JavaScript, no boot script, no site.js.
//
// shadcn upstream uses Radix Accordion (a JS state machine wiring buttons +
// regions with aria-expanded / aria-controls). We let the platform do it:
//   - Click / Space / Enter toggles open (browser default on <summary>).
//   - <summary> is implicitly role="button", focusable, with its text as the
//     accessible name; the browser sets aria-expanded to mirror `open`.
//   - <details name="..."> makes the group mutually exclusive natively. Per the
//     HTML spec, if more than one grouped item carries `open`, only the FIRST
//     in source order renders open — so we never produce an invalid state.
//
// This component differs from registry/ui/accordion.tsx (type="single"), which
// assigns the grouping `name` at runtime via public/site.js and layers the APG
// arrow-key contract on top. ExclusiveAccordion renders the `name` straight
// into the server HTML, so the exclusivity survives with JS disabled and there
// is no keyboard contract beyond what <summary> ships natively (Tab to focus,
// Enter / Space to toggle). That makes it the right pick for progressive-
// enhancement-first surfaces (docs FAQs, server-rendered settings panels).
//
// Refs:
//   repos/mdn/files/en-us/web/html/reference/elements/details/index.md
//     (`name` attribute — "give multiple <details> the same name value to
//      group them. Only one of the grouped <details> can be open at a time …
//      if multiple are given `open`, only the first in source order renders
//      open." Also: `open` boolean, the `toggle` event, implicit role=group.)
//   repos/mdn/files/en-us/web/html/reference/elements/summary/index.md
//     (click / Space toggles parent <details>; display:list-item marker.)
//   repos/aria-practices/content/patterns/accordion/ (the scripted contract we
//     deliberately do NOT emulate here — see the note above.)
//   repos/aria-practices/content/patterns/disclosure/ (native <details> is a
//     disclosure widget; aria-controls is optional.)

type ExclusiveAccordionProps = PropsWithChildren<{
  // Shared group name written onto every item's <details name>. Required —
  // it is what makes the group exclusive. Distinct accordions on one page
  // must use distinct names or they'd close each other.
  name: string
  class?: ClassValue
}>

export function ExclusiveAccordion(props: ExclusiveAccordionProps) {
  const { name, class: className, children, ...rest } = props
  return (
    <div
      data-slot="exclusive-accordion"
      data-name={name}
      class={cn("w-full", className)}
      {...rest}
    >
      {children}
    </div>
  )
}

type ExclusiveAccordionItemProps = PropsWithChildren<{
  // The shared group name. Pass the SAME value as the parent's `name`.
  name: string
  // Distinct identifier per item, emitted as data-value for targeting.
  value?: string
  // Pre-open this item on initial render. If two items in the group set this,
  // the browser opens only the first in source order (HTML spec).
  open?: boolean
  disabled?: boolean
  class?: ClassValue
}>

export function ExclusiveAccordionItem(props: ExclusiveAccordionItemProps) {
  const { name, value, open, disabled, class: className, children, ...rest } =
    props
  return (
    <details
      data-slot="exclusive-accordion-item"
      data-value={value}
      data-disabled={disabled ? "true" : undefined}
      name={name}
      open={open}
      class={cn(
        "border-b last:border-b-0",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
    </details>
  )
}

type ExclusiveAccordionTriggerProps = PropsWithChildren<{ class?: ClassValue }>

export function ExclusiveAccordionTrigger(
  props: ExclusiveAccordionTriggerProps,
) {
  const { class: className, children, ...rest } = props
  return (
    <summary
      data-slot="exclusive-accordion-trigger"
      class={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none select-none marker:hidden " +
          "hover:underline " +
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
          "list-none [&::-webkit-details-marker]:hidden " +
          // Rotate the chevron when the parent <details> is open.
          "[details[open]>&_[data-slot=exclusive-accordion-chevron]]:rotate-180",
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
        data-slot="exclusive-accordion-chevron"
        class="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
  )
}

type ExclusiveAccordionContentProps = PropsWithChildren<{ class?: ClassValue }>

export function ExclusiveAccordionContent(
  props: ExclusiveAccordionContentProps,
) {
  const { class: className, children, ...rest } = props
  return (
    <div
      data-slot="exclusive-accordion-content"
      class={cn("overflow-hidden pt-0 pb-4 text-sm", className)}
      {...rest}
    >
      {children}
    </div>
  )
}
