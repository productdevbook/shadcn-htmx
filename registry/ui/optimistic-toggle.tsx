/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Optimistic Toggle — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A server-backed action toggle (like / star / follow / pin). Clicking flips
// the appearance INSTANTLY to the toggled state, then reconciles with the
// server's HTML response — rolling back automatically if the request fails.
//
// Built on:
//   - Real htmx v4 events, NOT an extension. htmx v4 does not ship a working
//     "optimistic" attribute (the bundled src/ext/hx-optimistic.js is an
//     unfinished stub — "TODO: this needs to be updated to use the new internal
//     API" — and it does not flip aria-pressed nor cancel the error swap). So
//     the behaviour is a tiny self-contained script (OPTIMISTIC_TOGGLE_JS,
//     emitted once below) keyed on data-slot="optimistic-toggle":
//       • htmx:before:request — save the button's innerHTML + aria-pressed,
//         then flip aria-pressed and paint the <template>'s optimistic markup
//         in (the instant pre-network flip).
//       • htmx:before:swap — if the response is 4xx/5xx (ctx.response.status),
//         preventDefault() to CANCEL the swap (htmx v4 swaps error bodies by
//         default — see repos/htmx/src/htmx.js:1224) and restore the saved
//         markup + aria-pressed (rollback).
//       • on success htmx's hx-swap="outerHTML" replaces the button with the
//         server's authoritative version — no rollback code needed.
//     htmx v4 fires htmx:response:error for 4xx/5xx and lets a
//     htmx:before:swap listener veto the swap via preventDefault:
//     repos/htmx/CHANGELOG.md (htmx:response:error) and htmx.js:1224.
//   - A native <template> holds the optimistic markup. <template> content is
//     inert/not rendered until cloned, so it never shows until the script pulls
//     its innerHTML. repos/mdn/files/en-us/web/html/reference/elements/template/index.md
//   - A real <button> with aria-pressed: the platform gives us role=button and
//     Space/Enter activation for free, and aria-pressed carries the toggle
//     state. APG: Button (toggle) pattern — the accessible NAME must stay
//     constant across states; only aria-pressed flips.
//     repos/aria-practices/content/patterns/button/examples/button.html
//     repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-pressed/index.md
//
// Style analogue: registry/ui/button.tsx (variant/size maps, .htmx-request
// affordance, real <button>). We reuse Button's visual language.
//
// The target of the swap is the button itself (hx-target="this",
// hx-swap="outerHTML"), so on success the server returns a fresh <button> in
// the new state. The <template> lives OUTSIDE the swapped button (a sibling
// inside the data-slot wrapper) so it survives the swap and stays available
// for the next toggle. The optimistic source is pointed at by data-optimistic
// (a plain CSS selector the script reads — no extension involved).

// Shared optimistic-flip + rollback behaviour. Delegated on document.body so it
// covers buttons swapped in by htmx too; attached once via a global guard. It
// uses only real htmx v4 events and the platform <template> + aria-pressed, so
// it needs no extension. Copy this once into your app (e.g. site.js) — the
// component renders it inline for the docs/demo.
export const OPTIMISTIC_TOGGLE_JS = `(function(){
  if (window.__shadcnOptimisticToggle) return;
  window.__shadcnOptimisticToggle = true;

  // Resolve the <button data-slot> for an event whose source is the toggle.
  function toggleFor(detail){
    var ctx = detail && detail.ctx;
    var src = ctx && ctx.sourceElement;
    if (!src || !src.closest) return null;
    var btn = src.closest('[data-slot="optimistic-toggle"] > button[aria-pressed]');
    return btn || (src.matches && src.matches('button[aria-pressed]') &&
      src.closest('[data-slot="optimistic-toggle"]') ? src : null);
  }

  // Instant flip: stash the current markup, then paint the <template> in and
  // toggle aria-pressed BEFORE the network round-trip.
  document.body.addEventListener('htmx:before:request', function(e){
    var btn = toggleFor(e.detail);
    if (!btn) return;
    btn.__optHTML = btn.innerHTML;
    btn.__optPressed = btn.getAttribute('aria-pressed');
    var sel = btn.getAttribute('data-optimistic');
    var tmpl = sel && document.querySelector(sel);
    var inner = tmpl && tmpl.content ? tmpl.content.querySelector('[data-slot="optimistic-toggle-state"]') : null;
    if (inner) btn.innerHTML = inner.innerHTML;
    btn.setAttribute('aria-pressed', btn.__optPressed === 'true' ? 'false' : 'true');
  }, true);

  // On a 4xx/5xx response, cancel the swap (htmx v4 swaps error bodies by
  // default) and roll the optimistic flip back to exactly what it was.
  document.body.addEventListener('htmx:before:swap', function(e){
    var btn = toggleFor(e.detail);
    if (!btn || btn.__optHTML == null) return;
    var status = e.detail && e.detail.ctx && e.detail.ctx.response && e.detail.ctx.response.status;
    if (status >= 400){
      e.preventDefault();
      btn.innerHTML = btn.__optHTML;
      btn.setAttribute('aria-pressed', btn.__optPressed);
    }
    btn.__optHTML = null;
  }, true);

  // Network/abort failure (no response): also roll back.
  document.body.addEventListener('htmx:error', function(e){
    var btn = toggleFor(e.detail);
    if (!btn || btn.__optHTML == null) return;
    btn.innerHTML = btn.__optHTML;
    btn.setAttribute('aria-pressed', btn.__optPressed);
    btn.__optHTML = null;
  }, true);
})();`

export type OptimisticToggleVariant = "default" | "outline" | "ghost"
export type OptimisticToggleSize = "default" | "sm" | "lg" | "icon"

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
  // While the toggle request is in flight htmx adds .htmx-request to the
  // trigger; dim slightly so the optimistic state still reads as "pending".
  "[&.htmx-request]:opacity-80"

const variants: Record<OptimisticToggleVariant, string> = {
  // The pressed look comes from aria-pressed (data-driven below), so each
  // variant defines both the resting and the pressed treatment.
  default:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground " +
    "aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90",
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground " +
    "aria-pressed:border-primary aria-pressed:text-primary aria-pressed:bg-primary/10 aria-pressed:hover:bg-primary/15",
  ghost:
    "hover:bg-accent hover:text-accent-foreground " +
    "aria-pressed:bg-secondary aria-pressed:text-secondary-foreground aria-pressed:hover:bg-secondary/80",
}

const sizes: Record<OptimisticToggleSize, string> = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
}

export function optimisticToggleClasses(opts?: {
  variant?: OptimisticToggleVariant
  size?: OptimisticToggleSize
  class?: ClassValue
}): string {
  const variant = opts?.variant ?? "default"
  const size = opts?.size ?? "default"
  return cn(base, variants[variant], sizes[size], opts?.class)
}

type OptimisticToggleProps = {
  // Unique id. Seeds the button id (`{id}`) and the optimistic template id
  // (`{id}-optimistic`) that data-optimistic points the behaviour script at.
  id: string
  // Current persisted state (from your server / DB).
  pressed?: boolean
  variant?: OptimisticToggleVariant
  size?: OptimisticToggleSize
  class?: ClassValue
  disabled?: boolean
  // Stable accessible name. APG requires it not change between states —
  // "Like" stays "Like" whether pressed or not; aria-pressed carries state.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string

  // Visible content for the CURRENT (resting) state — icon and/or label.
  children: Child
  // Visible content for the OPTIMISTIC (just-toggled) state. Swapped in
  // instantly on click via the <template>, before the server responds.
  optimistic: Child

  // htmx — where to POST the toggle. The server should reply with a fresh
  // <button> in the new state (use OptimisticToggle again server-side).
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-delete"?: string
  // Defaults below target the button itself and swap its outerHTML so the
  // server response replaces the whole control.
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-vals"?: string
  "hx-confirm"?: string
  // Block double-submits while the toggle request is in flight (v4 name).
  "hx-disable"?: string
}

export function OptimisticToggle(props: OptimisticToggleProps) {
  const {
    id,
    pressed,
    variant = "default",
    size = "default",
    class: className,
    disabled,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    children,
    optimistic,
    ...rest
  } = props

  const templateId = `${id}-optimistic`
  const classes = optimisticToggleClasses({ variant, size, class: className })

  // hx-target/hx-swap default to replacing the button with the server's
  // authoritative response on success. data-optimistic points the behaviour
  // script at the <template> holding the just-toggled markup.
  const hxTarget = props["hx-target"] ?? "this"
  const hxSwap = props["hx-swap"] ?? "outerHTML"

  // Don't leak our defaults twice into ...rest.
  const { "hx-target": _t, "hx-swap": _s, ...hxRest } = rest

  return (
    <span data-slot="optimistic-toggle" class="contents">
      <button
        type="button"
        id={id}
        class={classes}
        disabled={disabled}
        aria-pressed={pressed === undefined ? "false" : String(pressed)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        data-variant={variant}
        data-size={size}
        hx-target={hxTarget}
        hx-swap={hxSwap}
        data-optimistic={`#${templateId}`}
        {...hxRest}
      >
        {children}
      </button>
      {/* Optimistic markup. <template> content is inert until the script clones
          its innerHTML, so it never renders on its own. The inner state span is
          tagged data-slot="optimistic-toggle-state" so the script can lift just
          the icon/label out of it. */}
      <template id={templateId}>
        <span
          data-slot="optimistic-toggle-state"
          class={cn(classes, "pointer-events-none")}
          aria-pressed="true"
        >
          {optimistic}
        </span>
      </template>
      {/* Optimistic-flip + rollback behaviour (attaches once, page-wide). */}
      <script dangerouslySetInnerHTML={{ __html: OPTIMISTIC_TOGGLE_JS }} />
    </span>
  )
}
