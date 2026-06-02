/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Load More — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A self-replacing pagination trigger. It appends the next page and swaps a
// fresh trigger in its place; when the server omits the trigger, the chain
// ends. Two modes:
//   - "click"    → a real <button>. Works with no JS (it's a plain button);
//                  htmx upgrades the click into a request.
//   - "intersect"/"revealed" → a scroll sentinel that fires when it enters
//                  the viewport (IntersectionObserver under the hood).
//
// shadcn/ui has no "load more" widget (it's a hypermedia loading pattern, not
// a Radix primitive), so there is no React source of truth to mirror. We build
// it straight from the htmx v4 loading patterns and the platform docs:
//   repos/htmx/www/src/content/patterns/01-loading/01-click-to-load.md
//     (button + hx-swap="outerHTML" + hx-target="this" → self-replace)
//   repos/htmx/www/src/content/patterns/01-loading/02-infinite-scroll.md
//     (sentinel + hx-trigger="revealed" / "intersect once")
//   repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md
//     (verified v4: synthetic `revealed` and `intersect` events; `intersect`
//      supports root:<sel> and threshold:<float>; use `intersect once` inside
//      an overflow-y:scroll container, `revealed` for the page viewport)
//   repos/htmx/www/src/content/reference/01-attributes/07-hx-swap.md
//     (verified v4: `outerHTML` replaces the target element wholesale)
//   repos/htmx/www/src/content/reference/01-attributes/19-hx-indicator.md
//     (the htmx-request class rides on this element while in flight; the
//      .htmx-indicator child is revealed → our skeleton/spinner fallback)
//   repos/mdn/files/en-us/web/api/intersection_observer_api/index.md
//     (the platform API htmx's intersect/revealed triggers are built on —
//      "implementing infinite-scrolling websites … as you scroll")
//
// Why a real <button> for the click mode: progressive enhancement. Without JS
// the button still submits (wrap it in a <form action> if you need a true
// no-JS navigation); with htmx it self-replaces in place. No emulation of any
// platform feature — the trigger IS the platform's button / IntersectionObserver.
//
// Zero JS of our own: htmx owns the request lifecycle and the IntersectionObserver.
// The in-flight skeleton is pure CSS via the .htmx-indicator opacity contract.

export type LoadMoreTrigger = "click" | "intersect" | "revealed"

// Click mode renders a button styled like the ghost Button (so it reads as a
// quiet, full-width "show more" affordance); the sentinel modes render a
// muted, centred status strip like the feed sentinel.
const buttonClasses =
  "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap outline-none transition-all " +
  "text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  // While the request this button triggers is in flight, htmx adds
  // .htmx-request here; we mute the trigger so it can't be re-fired.
  "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

const sentinelClasses =
  "flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground"

// The default inline spinner. It carries the htmx-indicator class so it is
// hidden until htmx flips on .htmx-request on the trigger, then fades in.
function Spinner() {
  return (
    <span
      class="htmx-indicator size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
      aria-hidden="true"
    />
  )
}

type LoadMoreProps = PropsWithChildren<{
  // Next-page URL. Sets hx-get for you.
  href?: string
  // "click" → <button>; "intersect"/"revealed" → scroll sentinel <div>.
  trigger?: LoadMoreTrigger
  // Visible label for the click button (ignored by sentinel modes, which use
  // their children / default spinner).
  label?: string
  // Accessible name. On the sentinel modes the visible text is decorative, so
  // an explicit label keeps AT announcements meaningful.
  ariaLabel?: string
  // Disable the click trigger (no effect on sentinel modes).
  disabled?: boolean
  class?: ClassValue
  id?: string
  // htmx / data / aria attributes ride onto the trigger element. Forwarded so
  // call sites can override hx-target, add hx-indicator, hx-vals, etc.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function LoadMore(props: LoadMoreProps) {
  const {
    href,
    trigger = "click",
    label = "Load more",
    ariaLabel,
    disabled,
    class: className,
    id,
    children,
    ...rest
  } = props as any

  // Sentinel modes: revealed (page viewport) or intersect (overflow container).
  if (trigger === "intersect" || trigger === "revealed") {
    const hxTrigger = trigger === "intersect" ? "intersect once" : "revealed"
    return (
      <div
        id={id}
        data-slot="load-more"
        data-trigger={trigger}
        role="status"
        aria-label={ariaLabel ?? "Loading more"}
        hx-get={href}
        hx-trigger={hxTrigger}
        hx-swap="outerHTML"
        class={cn(sentinelClasses, className)}
        {...rest}
      >
        {children ?? (
          <>
            <Spinner />
            Loading more…
          </>
        )}
      </div>
    )
  }

  // Click mode: a real button that self-replaces. outerHTML + target=this so
  // the response (next items + a fresh trigger) takes this element's place.
  return (
    <button
      type="button"
      id={id}
      data-slot="load-more"
      data-trigger="click"
      disabled={disabled}
      aria-label={ariaLabel}
      hx-get={href}
      hx-trigger="click"
      hx-target="this"
      hx-swap="outerHTML"
      class={cn(buttonClasses, className)}
      {...rest}
    >
      <Spinner />
      {children ?? label}
    </button>
  )
}
