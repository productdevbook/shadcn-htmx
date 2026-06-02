/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Card — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth (1:1 class strings):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/card.tsx
//
// Card is structural — a rounded container with a Header / Title /
// Description / Content / Footer layout. No interactivity, no JS.
// Pair it with htmx attributes on inner elements when you need to swap
// the contents server-side.

type CardAs = "div" | "article" | "section" | "li" | "aside"

export function Card(
  props: PropsWithChildren<
    {
      class?: ClassValue
      id?: string
      // Semantic element. shadcn upstream hardcodes <div>; we default to
      // <div> for backwards-compat but encourage <article> for self-
      // contained content (product card, blog tile, comment) and
      // <section> for thematic groups inside a landmark.
      // See repos/mdn/files/en-us/web/html/reference/elements/article/index.md:10,65-68
      as?: CardAs
      // Pair with the id of the CardTitle inside so the rendered <article>
      // / <section> has an accessible name for AT landmark navigation.
      ariaLabelledby?: string
      ariaLabel?: string
    } & Record<string, any>
  >,
) {
  const { class: className, children, as = "div", ariaLabelledby, ariaLabel, ...rest } = props
  const Tag: any = as
  return (
    <Tag
      data-slot="card"
      class={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className,
      )}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardHeader(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="card-header"
      class={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

export function CardTitle(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div data-slot="card-title" class={cn("leading-none font-semibold", props.class)}>
      {props.children}
    </div>
  )
}

export function CardDescription(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="card-description"
      class={cn("text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </div>
  )
}

// Sits in the top-right of CardHeader; the header grid auto-detects it and
// switches to two columns via `has-data-[slot=card-action]:grid-cols-[1fr_auto]`.
export function CardAction(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="card-action"
      class={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

export function CardContent(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div data-slot="card-content" class={cn("px-6", props.class)}>
      {props.children}
    </div>
  )
}

export function CardFooter(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="card-footer"
      class={cn("flex items-center px-6 [.border-t]:pt-6", props.class)}
    >
      {props.children}
    </div>
  )
}
