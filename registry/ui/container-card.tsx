/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Container Card — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A self-adapting card that restyles based on its OWN inline width rather than
// the viewport. The same markup renders stacked (media above text) when it sits
// in a narrow column or sidebar, and side-by-side (media beside text) when it
// has room — so one component drops into a sidebar, a wide content column, or a
// grid cell with no per-call breakpoints. Pure CSS; zero JavaScript.
//
// Built on (read before editing):
//   - CSS `container-type: inline-size` — establishes the card as a size query
//     container so its descendants can be styled against the card's own inline
//     width (computed in isolation, with inline-size containment to avoid query
//     loops). We name the container so the threshold variant targets THIS card
//     and not some ancestor container.
//       repos/mdn/files/en-us/web/css/reference/properties/container-type/index.md
//   - The web.dev "Container query card" pattern — base styles are single
//     column / centred; an `@container (min-width: …)` rule flips to a
//     two-column grid and reveals the description at wider container sizes.
//       repos/web.dev/src/site/content/en/patterns/layout/container-query-card/index.md
//       repos/web.dev/src/site/content/en/patterns/layout/container-query-card/assets/style.css
//
// shadcn/ui's Card is a static container with no self-adapting behaviour, so
// there is no upstream class string to mirror 1:1 — we keep the same visual
// shell (rounded border, bg-card, shadow) as registry/ui/card.tsx and add the
// container-query layout.
//   Card shell mirrored from: registry/ui/card.tsx
//
// Tailwind v4 container queries (verified against the engine):
//   - `@container/container-card` → container-type: inline-size + container-name
//     (repos/tailwindcss/packages/tailwindcss/src/utilities.ts: the `@container`
//      functional utility emits `container-type` and, with a modifier, the
//      `container-name`).
//   - `@min-[28rem]/container-card:<util>` → wraps the utility in
//     `@container container-card (min-width: 28rem)` so it only fires when THIS
//     named card is at least the threshold wide
//     (repos/tailwindcss/packages/tailwindcss/src/variants.ts: the `@container`
//      variant supports an optional name then the size query).
//
// The threshold is published as the `--container-card-break` custom property so
// it is documented/inspectable, but the actual query lives in the arbitrary
// `@min-[…]` variant (container queries can't read a custom property in the
// query condition itself — that is a platform limitation, not a hack).

type ContainerCardAs = "article" | "section" | "div" | "li" | "aside"

// The query-container root. `@container/container-card` is the whole point:
// container-type: inline-size + the name `container-card`. The visual shell
// matches registry/ui/card.tsx (rounded, bordered, bg-card, shadow).
const ROOT =
  "@container/container-card overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"

// The layout block. Stacked by default (flex column). At >= the break width of
// THIS named container, it becomes a two-column grid with the media beside the
// body — matching the web.dev pattern's `display: grid; grid-template-columns:
// 40% 1fr` flip.
const LAYOUT =
  "flex flex-col @min-[28rem]/container-card:grid @min-[28rem]/container-card:grid-cols-[40%_1fr] @min-[28rem]/container-card:items-stretch"

// Media slot: full-bleed banner when stacked; locked column when side-by-side.
const MEDIA =
  "bg-muted aspect-video w-full @min-[28rem]/container-card:aspect-auto @min-[28rem]/container-card:h-full"

// Body: generous padding; centred text when stacked, left-aligned when wide
// (mirrors the pattern's `text-align: center` → `left` flip).
const BODY =
  "flex flex-col gap-2 p-6 text-center @min-[28rem]/container-card:text-left"

const TITLE = "leading-none font-semibold"
const DESCRIPTION = "text-sm text-muted-foreground"
// Footer actions: centred when stacked, pushed to the start when side-by-side.
const FOOTER =
  "mt-2 flex items-center justify-center gap-2 @min-[28rem]/container-card:justify-start"

type ContainerCardProps = PropsWithChildren<{
  // Semantic element. Defaults to <article> because a container card is almost
  // always self-contained, syndicatable content (product, post, comment).
  // See repos/mdn/files/en-us/web/html/reference/elements/article/index.md
  as?: ContainerCardAs
  // The media child (img / video / picture / div). Rendered in the media slot
  // ABOVE the body when stacked, BESIDE it when wide. Omit for a text-only card.
  media?: Child
  // Inline width at which the card flips from stacked to side-by-side. Any CSS
  // length the @container query understands. Published as the
  // --container-card-break custom property for inspection. Note: changing the
  // numeric threshold requires editing the @min-[…] variant too, since a
  // container query condition cannot read a custom property (platform limit).
  break?: string
  ariaLabel?: string
  // Pair with the id of the title inside so the <article>/<section> has an
  // accessible name for AT landmark navigation.
  ariaLabelledby?: string
  class?: ClassValue
  id?: string
  // Forward hx-*, data-*, aria-*, and standard attributes onto the root.
  [key: string]: unknown
}>

export function ContainerCard(props: ContainerCardProps) {
  const {
    as = "article",
    media,
    break: breakAt = "28rem",
    ariaLabel,
    ariaLabelledby,
    class: className,
    id,
    children,
    ...rest
  } = props as ContainerCardProps
  const Tag: any = as
  return (
    <Tag
      id={id}
      data-slot="container-card"
      // Documented threshold; the active query lives in the @min-[28rem] variant.
      style={`--container-card-break:${breakAt}`}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      class={cn(ROOT, className)}
      {...rest}
    >
      <div data-slot="container-card-layout" class={LAYOUT}>
        {media ? (
          <div data-slot="container-card-media" class={MEDIA}>
            {media}
          </div>
        ) : null}
        <div data-slot="container-card-body" class={BODY}>
          {children}
        </div>
      </div>
    </Tag>
  )
}

export function ContainerCardTitle(
  props: PropsWithChildren<{ class?: ClassValue; id?: string }>,
) {
  return (
    <div data-slot="container-card-title" id={props.id} class={cn(TITLE, props.class)}>
      {props.children}
    </div>
  )
}

export function ContainerCardDescription(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <p data-slot="container-card-description" class={cn(DESCRIPTION, props.class)}>
      {props.children}
    </p>
  )
}

export function ContainerCardFooter(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div data-slot="container-card-footer" class={cn(FOOTER, props.class)}>
      {props.children}
    </div>
  )
}
