/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cloneElement, isValidElement } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Hover Card — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A rich preview surface revealed when the user shows INTEREST in a trigger
// (hover, keyboard focus, or long-press). Unlike Tooltip — which the APG
// forbids from holding interactive content and which defers to this primitive
// — a Hover Card MAY contain links, buttons and other interactive content
// (e.g. a "Follow" button on a user preview).
//
// Built entirely on the native Popover API "interest invoker" mechanism — zero
// JS:
//   - The trigger (an <a> or <button>) carries `interestfor` pointing at the
//     card's id. The browser reveals the card on hover / focus / long-press
//     and hides it on lose-interest, with NO state machine of ours.
//   - The card is `popover="hint"`. Per spec a `hint` popover does NOT light-
//     dismiss `auto` popovers, can itself be light-dismissed, and responds to
//     ESC (close request) — exactly the contract we want for a preview card.
//   - Associating a popover with its interest invoker creates an IMPLICIT
//     anchor reference, so the card is positioned with CSS `position-area`
//     relative to the trigger — no JS positioner, unlike registry/ui/popover.tsx
//     which targets older click-popovers without anchor support.
//
// Progressive enhancement: in browsers without interest invokers the trigger
// is just a normal <a>/<button> (which still works), and `popover="hint"`
// falls back to `popover="manual"`, so the card simply stays hidden — no error,
// no broken UI.
//
// Refs:
//   repos/mdn/files/en-us/web/api/popover_api/using_interest_invokers/index.md
//   repos/mdn/files/en-us/web/api/popover_api/index.md  (popover="hint" state)
//   repos/mdn/files/en-us/web/html/reference/elements/a/index.md:89  (interestfor)
//   repos/mdn/files/en-us/web/css/reference/properties/position-area/index.md
//   repos/shadcn-ui/apps/v4/registry/  (HoverCard anatomy: trigger + content)

export type HoverCardSide = "top" | "right" | "bottom" | "left"

// Layout-only positioning utilities (see app/styles/input.css). They map a
// side hint onto a CSS `position-area` tile relative to the implicit anchor
// (the interest invoker), and fall back to a centred placement in browsers
// without CSS Anchor Positioning. Colour comes from theme tokens below.
const sideAnchor: Record<HoverCardSide, string> = {
  top: "anchor-hovercard-top",
  bottom: "anchor-hovercard-bottom",
  left: "anchor-hovercard-left",
  right: "anchor-hovercard-right",
}

const contentBase =
  "z-50 m-0 w-64 rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none " +
  // Native [popover] is display:none until shown; reveal + animate on open.
  "[&:not(:popover-open)]:hidden " +
  // animate-fade/scale-in keyframed in input.css (shared scn-popover-in).
  "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]"

export function hoverCardContentClasses(opts?: {
  side?: HoverCardSide
  class?: ClassValue
}): string {
  const side = opts?.side ?? "bottom"
  return cn(contentBase, sideAnchor[side], opts?.class)
}

type HoverCardTriggerProps = PropsWithChildren<{
  // Id of the HoverCard this reveals (its `interestfor` target).
  cardFor: string
  // Render the wrapped child element (e.g. an <a href>) with the trigger
  // wiring merged onto it, instead of the default bare <a>. SSR-friendly
  // equivalent of shadcn's Radix `asChild`.
  asChild?: boolean
  // Destination for the default <a>. Interest invokers REVEAL on hover/focus
  // but the trigger still navigates on click, so a real href keeps it useful
  // (and functional in non-supporting browsers).
  href?: string
  class?: ClassValue
  id?: string
}>

export function HoverCardTrigger(props: HoverCardTriggerProps) {
  const { cardFor, asChild, href, class: className, id, children, ...rest } = props

  // asChild: clone the single child (an <a>/<button>) and merge the interest-
  // invoker wiring onto it so the markup the page already has becomes the
  // trigger — no extra wrapper element in the accessibility tree.
  if (asChild && isValidElement(children)) {
    const child = children as any
    return cloneElement(child, {
      ...rest,
      interestfor: cardFor,
      "data-slot": "hover-card-trigger",
      class: cn(child?.props?.class, className),
    })
  }

  // Default: a real <a>. interestfor reveals the card on interest; click still
  // navigates. Anchors are the canonical interest-invoker element (MDN).
  return (
    <a
      id={id}
      href={href ?? "#"}
      interestfor={cardFor}
      data-slot="hover-card-trigger"
      class={cn(className)}
      {...rest}
    >
      {children}
    </a>
  )
}

type HoverCardProps = PropsWithChildren<{
  // Required — referenced by the trigger's `interestfor`.
  id: string
  // Placement relative to the trigger. Drives `position-area` (anchor) with a
  // centred fallback. Default "bottom".
  side?: HoverCardSide
  class?: ClassValue
  // Forward hx-*, data-*, aria-* (e.g. hx-get to lazily fetch the preview).
  [key: string]: unknown
}>

export function HoverCard(props: HoverCardProps) {
  const { id, side = "bottom", class: className, children, ...rest } = props
  return (
    <div
      id={id}
      // `hint`: shows on interest, light-dismissable, ESC-closeable, and does
      // NOT close sibling `auto` popovers. Falls back to `manual` (stays
      // hidden) in unsupporting browsers — safe progressive enhancement.
      // Cast: hono/jsx's `popover` type predates the `"hint"` state.
      {...({ popover: "hint" } as Record<string, string>)}
      data-slot="hover-card"
      data-side={side}
      class={hoverCardContentClasses({ side, class: className })}
      {...rest}
    >
      {children}
    </div>
  )
}
