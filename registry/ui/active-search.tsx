/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Active Search — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A debounced live-search box that filters an external results list/table as
// the user types, with an inline loading indicator and stale-request
// cancellation. It degrades to a normal GET search on Enter when JS is off.
//
// **Native-first.** The control is a real <form> wrapping <input type="search">.
//   - The <form action> means Enter submits a normal navigation search with
//     zero JS — progressive enhancement, not emulation.
//   - <input type="search"> gives the platform clear-field affordance + a
//     `search` event that fires on Enter and when the field is cleared.
//     We add `search` to hx-trigger so clearing re-runs the filter.
//     See repos/mdn/files/en-us/web/html/reference/elements/input/search/index.md
//        repos/mdn/files/en-us/web/api/htmlinputelement/search_event/index.md
//
// htmx wiring (verified against the vendored v4 source):
//   - hx-trigger="input changed delay:Nms, search" — `input changed delay`
//     debounces keystrokes and ignores no-op keys (arrows); the `search`
//     event covers Enter + the native clear button.
//     See repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md
//        repos/htmx/www/src/content/patterns/02-forms/01-active-search.md
//   - hx-sync="this:replace" — aborts the in-flight request and replaces it
//     with the latest one, so stale responses never clobber fresh input.
//     See repos/htmx/www/src/content/reference/01-attributes/21-hx-sync.md
//   - hx-indicator — htmx toggles the `.htmx-request` class on the indicator
//     while a request is in flight; we drive an opacity transition off it.
//     See repos/htmx/www/src/content/reference/01-attributes/19-hx-indicator.md
//
// No custom JS: the debounce, cancellation, and indicator are all htmx; the
// no-JS fallback is the native <form>. data-slot is for styling/testing hooks.

const formBase = "relative w-full"

const inputBase =
  "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 pr-9 pl-9 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "selection:bg-primary selection:text-primary-foreground " +
  "placeholder:text-muted-foreground " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "md:text-sm dark:bg-input/30 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  // Hide the WebKit clear button — htmx's `search` trigger + our spinner is
  // the affordance, and the native X overlaps the indicator.
  "[&::-webkit-search-cancel-button]:hidden"

// Leading magnifier icon, centred in the left padding gutter.
const searchIconClass =
  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"

// Trailing spinner. `htmx-indicator` is hidden by default; htmx adds
// `.htmx-request` to it (via hx-indicator) while the request is in flight,
// fading it in. role=status + aria-live="polite" announces "Searching…" to
// assistive tech without stealing focus.
const indicatorClass =
  "htmx-indicator pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"

export type ActiveSearchProps = {
  // Input id (and the base for the indicator id: `${id}-indicator`).
  id: string
  name?: string
  placeholder?: string
  value?: string
  // No-JS fallback: where the <form> navigates on Enter when htmx is absent.
  // Also the htmx request URL when hx-get isn't passed explicitly.
  action?: string
  // GET keeps the search idempotent and the no-JS fallback shareable as a URL.
  method?: "get" | "post"
  // Debounce window for the `input` trigger. Default 300ms.
  delay?: number
  required?: boolean
  disabled?: boolean
  autofocus?: boolean
  // Visible loading text for screen readers (defaults to "Searching…").
  loadingLabel?: string
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  class?: ClassValue
  inputClass?: ClassValue
  // Optional extra content rendered after the input inside the <form>
  // (e.g. a visually-hidden submit button for no-JS keyboards). Usually unused.
  children?: Child
  // htmx attrs ride onto the <input>. Typical setup:
  //   hx-get="/search"  hx-target="#results"  hx-swap="innerHTML"
  // hx-trigger / hx-sync / hx-indicator are supplied with sensible defaults
  // below but can be overridden by passing them explicitly.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function ActiveSearch(props: ActiveSearchProps) {
  const {
    id,
    name = "q",
    placeholder = "Search…",
    value,
    action,
    method = "get",
    delay = 300,
    required,
    disabled,
    autofocus,
    loadingLabel = "Searching…",
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    class: className,
    inputClass,
    children,
    ...rest
  } = props

  const indicatorId = `${id}-indicator`

  // Defaults that make the search "active". Anything passed in `rest`
  // (hx-trigger / hx-sync / hx-indicator / hx-get …) overrides these.
  const hxDefaults: Record<string, any> = {
    "hx-get": action,
    "hx-trigger": `input changed delay:${delay}ms, search`,
    "hx-sync": "this:replace",
    "hx-indicator": `#${indicatorId}`,
  }
  const hx = { ...hxDefaults, ...rest }

  return (
    <form
      data-slot="active-search"
      role="search"
      class={cn(formBase, className)}
      action={action}
      method={method}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={searchIconClass}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autofocus={autofocus}
        autocomplete="off"
        // Mobile: label the Enter key "search" and show the search keyboard.
        enterkeyhint="search"
        inputmode="search"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        data-slot="active-search-input"
        class={cn(inputBase, inputClass)}
        {...hx}
      />
      <span
        id={indicatorId}
        data-slot="active-search-indicator"
        role="status"
        aria-live="polite"
        class={indicatorClass}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4 animate-spin"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span class="sr-only">{loadingLabel}</span>
      </span>
      {children}
    </form>
  )
}
