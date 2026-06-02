/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Feed — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui has no "feed" component (it's a structural ARIA pattern, not a
// widget), so there's no React source of truth to mirror. We build it
// straight from the WAI-ARIA APG Feed pattern:
//   repos/aria-practices/content/patterns/feed/feed-pattern.html
//   repos/aria-practices/content/patterns/feed/examples/feed-display.html
//   repos/aria-practices/content/patterns/feed/examples/js/feed.js
//     (the PageUp/PageDown + Ctrl+Home/End reference implementation our
//      site.js keyboard contract is modelled on)
//
// Why this shape:
//   - A feed is a STRUCTURE, not a widget. Screen readers stay in reading
//     mode; the role="feed" container establishes an interoperability
//     contract for reliably loading content as the user scrolls (APG
//     "About This Pattern"). So the container is a plain <div role="feed">,
//     NOT focusable.
//   - Each unit of content is a real <article> (which already maps to
//     role="article" per the HTML AAM — we set role="article" explicitly to
//     stay faithful to the APG example markup and defensive against older AT).
//     repos/mdn/files/en-us/web/html/reference/elements/article/index.md
//   - Each article is focusable (tabindex="0") so AT reading cursors can land
//     on it and the page can scroll it into view (APG: the article containing
//     the reading cursor must contain DOM focus).
//   - aria-posinset / aria-setsize position each article in the set; setsize
//     can be -1 when the total is unknown (infinite feed). APG roles/states.
//   - aria-labelledby names each article from its title; aria-describedby
//     points at the primary content so AT users can skim.
//   - aria-busy on the feed flips true while a batch is loading and false
//     once the DOM is stable. APG: "extremely important that aria-busy is set
//     to false when the operation is complete." With htmx the busy attribute
//     rides on the freshly-swapped placeholder, so it's only present during
//     the in-flight request.
//
// htmx infinite scroll (verified against v4):
//   repos/htmx/www/src/content/patterns/01-loading/02-infinite-scroll.md
//   repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md#revealed
//   The trailing sentinel uses hx-trigger="revealed" + hx-get + hx-swap=
//   "outerHTML": when it scrolls into view it requests the next page, and the
//   response (next articles + a fresh sentinel) replaces it — a self-extending
//   chain. (Use "intersect once" instead when the feed lives inside an
//   overflow-y:scroll container, per the htmx docs.)
//
// The component is layout-only: you hand it <FeedArticle> children and a
// <FeedSentinel>. The keyboard contract lives in public/site.js keyed on
// data-slot="feed".

type FeedProps = PropsWithChildren<{
  // The feed needs an accessible name. Prefer ariaLabelledby pointing at a
  // visible heading; fall back to ariaLabel when there's no visible title.
  ariaLabel?: string
  ariaLabelledby?: string
  // True while a batch of articles is being added/removed. With htmx this is
  // usually set on the sentinel placeholder, not here.
  busy?: boolean
  class?: ClassValue
  id?: string
  // htmx / data / aria attributes ride onto the feed container.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Feed(props: FeedProps) {
  const { ariaLabel, ariaLabelledby, busy, class: className, id, children, ...rest } =
    props as any
  return (
    <div
      id={id}
      role="feed"
      data-slot="feed"
      aria-label={ariaLabelledby ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-busy={busy ? "true" : undefined}
      class={cn("flex flex-col gap-4", className)}
      {...rest}
    >
      {children}
    </div>
  )
}

type FeedArticleProps = PropsWithChildren<{
  // 1-based position in the feed.
  posinset: number
  // Total articles loaded (or total in the feed). Pass -1 when unknown.
  setsize: number
  // Id of the element inside this article that names it (the title). APG
  // requires each article to be labelled by its distinguishing content.
  labelledby: string
  // Id(s) of the element(s) providing the primary content, so AT can skim.
  describedby?: string
  class?: ClassValue
  id?: string
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function FeedArticle(props: FeedArticleProps) {
  const {
    posinset,
    setsize,
    labelledby,
    describedby,
    class: className,
    id,
    children,
    ...rest
  } = props as any
  return (
    <article
      id={id}
      role="article"
      data-slot="feed-article"
      // Focusable so the AT reading cursor can rest on it and the page can
      // scroll it into view (APG tabindex="0" on each article).
      tabindex={0}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      class={cn(
        "rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
      {...rest}
    >
      {children}
    </article>
  )
}

// Trailing placeholder that loads the next page when it scrolls into view.
// Defaults to the htmx infinite-scroll contract from the v4 docs: revealed +
// outerHTML so the response (next articles + a new sentinel) replaces it.
// Omit the sentinel from the server response when there are no more pages and
// the chain stops naturally.
type FeedSentinelProps = PropsWithChildren<{
  // The next-page URL. Sets hx-get for you.
  href?: string
  // Default "revealed"; pass "intersect once" when the feed scrolls inside an
  // overflow container (htmx docs note).
  trigger?: string
  class?: ClassValue
  id?: string
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}>

export function FeedSentinel(props: FeedSentinelProps) {
  const { href, trigger = "revealed", class: className, id, children, ...rest } =
    props as any
  return (
    <div
      id={id}
      data-slot="feed-sentinel"
      hx-get={href}
      hx-trigger={trigger}
      hx-swap="outerHTML"
      class={cn(
        "flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground",
        className,
      )}
      {...rest}
    >
      {children ?? (
        <>
          <span
            aria-hidden="true"
            class="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
          />
          Loading more…
        </>
      )}
    </div>
  )
}
