/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Lazy Load — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A deferred-content container. It renders a placeholder immediately, then
// fetches its own contents after the page paints and swaps them in. The
// placeholder reserves vertical space so the swap does not push the page
// around (Cumulative Layout Shift). Pair it with <Skeleton> for slow
// dashboard panels or per-tab content that you don't want to block first
// paint on.
//
// shadcn/ui has no "lazy load" widget — it is a hypermedia loading pattern,
// not a Radix primitive, so there is no React source of truth to mirror. We
// build it straight from the htmx v4 lazy-load pattern and the platform docs:
//   repos/htmx/www/src/content/patterns/01-loading/03-lazy-load.md
//     (the canonical pattern: a placeholder div with hx-get + hx-trigger="load";
//      htmx swaps the response in when it arrives. The "Layout shift" note
//      says to reserve space with min-height to protect the Lighthouse/CLS
//      score — that is exactly what `reserve`/min-height does here. The
//      "Infinite loops" note warns against echoing hx-trigger="load" in the
//      response: our default hx-swap="innerHTML" keeps the trigger host in
//      place, so the response body must NOT repeat the trigger.)
//   repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md
//     (verified v4: synthetic `load` fires when the element enters the DOM —
//      "Useful for lazy-loading content"; `revealed` fires when it scrolls
//      into the viewport; use `intersect once` instead when the element lives
//      inside an `overflow-y: scroll` container.)
//   repos/htmx/www/src/content/reference/01-attributes/07-hx-swap.md
//     (verified v4: `innerHTML` — the default — replaces the *contents* of the
//      target, leaving our reserved-space wrapper in the DOM; `outerHTML`
//      replaces the wrapper wholesale, for when the response brings its own
//      box. We default to innerHTML so the reserved height survives the swap.)
//   repos/htmx/www/src/content/reference/01-attributes/01-hx-get.md
//     (the request the container issues for its own contents.)
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-busy/index.md
//     (verified: aria-busy="true" on a region tells AT "this content is still
//      being modified — wait before announcing". The role="status" live region
//      announces once the busy content settles. Both ride away with the
//      innerHTML swap because they live on the wrapper, which is fine — htmx
//      flips nothing for us, so we keep them simple and static.)
//   repos/mdn/files/en-us/web/api/intersection_observer_api/index.md
//     (the platform API htmx's revealed/intersect triggers are built on —
//      "implementing infinite-scrolling websites … as you scroll".)
//
// Zero JS of our own: htmx owns the request and the IntersectionObserver; the
// in-flight state is the placeholder we render. No emulation of any platform
// feature — the trigger IS htmx's `load` event / the platform's
// IntersectionObserver.

export type LazyLoadTrigger = "load" | "revealed" | "intersect"
export type LazyLoadSwap = "innerHTML" | "outerHTML"

// Maps our trigger prop to the literal hx-trigger value. `intersect once`
// fires a single time when the element first crosses the viewport (the
// overflow-container form); `revealed` is the page-viewport form; `load`
// fires immediately on insertion.
const TRIGGER_MAP: Record<LazyLoadTrigger, string> = {
  load: "load",
  revealed: "revealed",
  intersect: "intersect once",
}

// The reserved-space wrapper. min-h keeps a stable box so the swap doesn't
// shift the page; centred so the default placeholder/spinner sits middle.
const rootClasses =
  "flex w-full items-center justify-center text-sm text-muted-foreground"

// Default placeholder: a muted inline spinner + caption. It is the visible
// "loading" state until the response swaps in. Pass children to override it
// (e.g. a composed <Skeleton> silhouette).
function Spinner() {
  return (
    <span
      class="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
      aria-hidden="true"
    />
  )
}

type LazyLoadProps = PropsWithChildren<{
  // URL to fetch this container's contents from. Sets hx-get for you.
  src?: string
  // When the fetch fires. "load" → immediately on insertion (deferred but
  // eager); "revealed" → when scrolled into the page viewport; "intersect"
  // → first viewport crossing inside an overflow-y:scroll container.
  trigger?: LazyLoadTrigger
  // How the response lands. "innerHTML" (default) replaces the contents and
  // keeps this reserved-space wrapper; "outerHTML" replaces the wrapper.
  swap?: LazyLoadSwap
  // Reserved minimum height (any CSS length, e.g. "12rem" or "200px"). Sets
  // min-height inline so the box holds its size before content arrives —
  // prevents layout shift (CLS).
  reserve?: string
  // Accessible name for the loading region ("Loading sales report").
  ariaLabel?: string
  class?: ClassValue
  id?: string
  // htmx / data / aria attributes ride onto the container. Forwarded so call
  // sites can override hx-target, add hx-indicator, hx-vals, hx-swap timing,
  // etc.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function LazyLoad(props: LazyLoadProps) {
  const {
    src,
    trigger = "load",
    swap = "innerHTML",
    reserve,
    ariaLabel = "Loading",
    class: className,
    id,
    children,
    ...rest
  } = props as any

  return (
    <div
      id={id}
      data-slot="lazy-load"
      data-trigger={trigger}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      hx-get={src}
      hx-trigger={TRIGGER_MAP[trigger as LazyLoadTrigger]}
      hx-swap={swap}
      style={reserve ? `min-height:${reserve}` : undefined}
      class={cn(rootClasses, className)}
      {...rest}
    >
      {children ?? (
        <span class="flex items-center gap-2">
          <Spinner />
          Loading…
        </span>
      )}
    </div>
  )
}
