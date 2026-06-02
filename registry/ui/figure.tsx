/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Figure — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Self-contained captioned content — an image, diagram, code block, or
// quotation — wrapped in a native <figure> whose <figcaption> supplies the
// figure's accessible name. Unlike <Card> (a generic styled surface),
// <Figure> is *referential*: it stands apart from the main flow and can be
// moved elsewhere without breaking it, and the caption is semantically tied
// to the content. No interactivity, no JavaScript.
//
// Built on (native elements; we add nothing the platform doesn't ship):
//   - <figure> — represents self-contained content, optionally captioned;
//     the figure, its caption, and its contents are one unit. Implicit ARIA
//     role "figure".
//       repos/mdn/files/en-us/web/html/reference/elements/figure/index.md
//   - <figcaption> — caption/legend for the parent <figure>; provides the
//     <figure> its accessible name. Must be the figure's first or last child
//     (the first <figcaption> found is presented as the caption).
//       repos/mdn/files/en-us/web/html/reference/elements/figcaption/index.md
//
// Anatomy mirrors shadcn's Card family (read for intent only, not copied —
// different element, different semantics):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/card.tsx
//
// Theme tokens only: border / bg-card / text-card-foreground for the surface,
// text-muted-foreground for the caption, bg-muted for plain content slots.

// Where the caption sits relative to the content. Both are valid per the
// spec (first OR last child); we render the <figcaption> in the chosen DOM
// position so the accessible name is correct either way.
export type FigureCaptionSide = "top" | "bottom"

type FigureProps = PropsWithChildren<{
  class?: ClassValue
  id?: string
  // Caption position. "bottom" (default) reads as a credit/label under the
  // content; "top" reads as a legend introducing it (common for code blocks
  // and quotations). See the MDN figure examples.
  captionSide?: FigureCaptionSide
  // Forward hx-*, data-*, aria-* and standard global attributes onto the
  // <figure> root.
  [key: string]: unknown
}>

// Surface: a bordered card-like box. We keep it visually distinct from the
// document body but lighter than a full Card (no shadow) so it reads as
// "referenced content", not a UI panel. Caption position is purely a matter
// of DOM order (figcaption first vs last) — both are spec-valid — so it needs
// no extra class; the column flow handles either. `data-caption-side` records
// the author's intent for styling hooks / tests.
const root =
  "flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-3 text-card-foreground"

export function Figure(props: FigureProps) {
  const {
    class: className,
    id,
    captionSide = "bottom",
    children,
    ...rest
  } = props

  return (
    <figure
      id={id}
      data-slot="figure"
      data-caption-side={captionSide}
      class={cn(root, className)}
      {...rest}
    >
      {children}
    </figure>
  )
}

// The content slot — image, code block, quote, diagram. Optional thin wrapper
// that gives non-replaced content (code, quotes) a muted backdrop and rounds
// it to match the surface. For a bare <img> you can skip this and put the
// image directly in <Figure>.
export function FigureContent(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="figure-content"
      class={cn(
        "overflow-hidden rounded-md bg-muted text-sm text-foreground",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

// The caption — renders a native <figcaption>, which gives the parent
// <figure> its accessible name. Keep it concise; it is the figure's label,
// not its body. Use <FigureCredit> inside for a secondary line (source,
// author) styled lighter.
export function FigureCaption(
  props: PropsWithChildren<{ class?: ClassValue; id?: string }>,
) {
  return (
    <figcaption
      id={props.id}
      data-slot="figure-caption"
      class={cn(
        "px-1 text-sm leading-snug text-muted-foreground",
        props.class,
      )}
    >
      {props.children}
    </figcaption>
  )
}

// Optional secondary line inside a caption (attribution / source / date),
// rendered a touch smaller. Purely presentational; stays inside <figcaption>
// so it remains part of the accessible name.
export function FigureCredit(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <span
      data-slot="figure-credit"
      class={cn("mt-1 block text-xs text-muted-foreground/80", props.class)}
    >
      {props.children}
    </span>
  )
}

export type { FigureProps }
export type FigureChild = Child
