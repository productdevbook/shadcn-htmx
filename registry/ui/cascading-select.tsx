/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Cascading Select — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A pair of dependent native <select>s: picking the parent (e.g. car make)
// reloads the child's <option>s (e.g. model) — and, optionally, a detail
// panel — from the server. One request, two updates: the response swaps the
// child options into the target, and a second fragment carrying
// hx-swap-oob updates the detail panel "out of band".
//
// Built on:
//   repos/htmx/www/src/content/patterns/02-forms/04-linked-selects.md
//     The canonical linked-selects recipe: parent <select hx-get hx-target>
//     swaps a fresh <option> list into the child; a detail card rides along.
//   repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md:32-37
//     htmx defaults the trigger to `change` for <select>, so NO hx-trigger is
//     needed — choosing an option fires the request.
//   repos/htmx/www/src/content/reference/01-attributes/13-hx-swap-oob.md
//     hx-swap-oob="true" on the detail fragment swaps it into #<id>-detail by
//     id, piggybacking a second update onto the same response.
//   repos/htmx/www/src/content/reference/01-attributes/07-hx-swap.md
//     default swap is innerHTML — the returned <option>s replace the child's
//     contents; hx-include carries the parent value with the request.
//
// Native semantics (the whole control is two real <select>s in a <fieldset>):
//   repos/mdn/files/en-us/web/html/reference/elements/select/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/option/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/fieldset/index.md
//     The <fieldset> + <legend> groups the related controls for AT. Each
//     <select> brings keyboard control, type-to-search, mobile pickers, and
//     form submission with zero JS. With htmx off the parent still submits
//     its value in a normal form post — progressive enhancement, not emulation.
//
// JS budget: NONE. The cascade is htmx's default `change` trigger + an OOB
// swap; there is no site.js for this component.
//
// Style analogues: registry/ui/select.tsx (the chevron-overlaid native
// <select>, classes mirrored verbatim) and registry/ui/edit-in-place.tsx
// (server-fragment composite returning bare <option>/<div> partials).

// Mirrors registry/ui/select.tsx `triggerBase` verbatim so a cascading
// select is visually identical to a standalone Select.
const triggerBase =
  "peer flex h-9 w-full min-w-0 cursor-pointer appearance-none items-center rounded-md border border-input bg-background px-3 pr-8 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "md:text-sm dark:bg-input/30 " +
  "[&.htmx-request]:opacity-70"

const fieldsetClass = "grid gap-4"
const legendClass =
  "mb-1 text-sm leading-none font-medium text-foreground"
const fieldClass = "grid gap-2"
const fieldLabelClass =
  "text-sm leading-none font-medium text-foreground select-none"
const chevronClass =
  "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50"
const detailClass = "text-sm text-muted-foreground"

function Chevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={chevronClass}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export type CascadingSelectProps = PropsWithChildren<{
  // Base id. The child select is `${id}-child`; the detail panel (if used) is
  // `${id}-detail`; the legend is `${id}-legend`.
  id: string
  // Endpoint the PARENT requests on change. Returns the child's <option>s,
  // and (optionally) a detail fragment with hx-swap-oob="true".
  endpoint: string
  // Form field names. Defaults: parent "parent", child "child".
  parentName?: string
  childName?: string
  // Visible group label rendered as <legend>.
  legend?: string
  // Per-select field labels (rendered as <label for>).
  parentLabel?: string
  childLabel?: string
  // Parent <option>s. Pass <option> elements (or SelectOption).
  children: Child
  // Initial child <option>s, shown before the first change fires.
  childOptions?: Child
  // Initial detail-panel content. Omit to skip the detail panel entirely.
  detail?: Child
  // Disable the whole group.
  disabled?: boolean
  // GET keeps the cascade idempotent + the no-JS form post shareable.
  method?: "get" | "post"
  class?: ClassValue
  // Escape hatch: forward arbitrary hx-* / data-* / aria-* onto the parent
  // <select> (e.g. hx-indicator). Overrides the defaults below.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function CascadingSelect(props: CascadingSelectProps) {
  const {
    id,
    endpoint,
    parentName = "parent",
    childName = "child",
    legend,
    parentLabel,
    childLabel,
    children,
    childOptions,
    detail,
    disabled,
    method = "get",
    class: className,
    ...rest
  } = props

  const childId = `${id}-child`
  const detailId = `${id}-detail`
  const legendId = `${id}-legend`

  // The parent's request: GET the endpoint, swap the child's <option>s
  // (innerHTML, the default). hx-include pins the parent value to the request
  // by name even if the trigger element changes. A detail fragment in the
  // response carries hx-swap-oob="true" to update #${id}-detail too.
  // No hx-trigger: htmx defaults <select> to `change`.
  const hxKey = method === "post" ? "hx-post" : "hx-get"
  const parentHx: Record<string, any> = {
    [hxKey]: endpoint,
    "hx-target": `#${childId}`,
    "hx-include": `[name='${parentName}']`,
  }
  const hx = { ...parentHx, ...rest }

  return (
    <fieldset
      data-slot="cascading-select"
      id={id}
      disabled={disabled}
      class={cn(fieldsetClass, className)}
      aria-labelledby={legend ? legendId : undefined}
    >
      {legend ? (
        <legend id={legendId} class={legendClass} data-slot="cascading-select-legend">
          {legend}
        </legend>
      ) : null}

      <div class={fieldClass}>
        {parentLabel ? (
          <label for={`${id}-parent`} class={fieldLabelClass}>
            {parentLabel}
          </label>
        ) : null}
        <span class="relative inline-flex w-full">
          <select
            id={`${id}-parent`}
            name={parentName}
            data-slot="cascading-select-parent"
            class={triggerBase}
            aria-controls={detail !== undefined ? `${childId} ${detailId}` : childId}
            {...hx}
          >
            {children}
          </select>
          <Chevron />
        </span>
      </div>

      <div class={fieldClass}>
        {childLabel ? (
          <label for={childId} class={fieldLabelClass}>
            {childLabel}
          </label>
        ) : null}
        <span class="relative inline-flex w-full">
          {/* The cascade target. htmx swaps fresh <option>s in here. */}
          <select
            id={childId}
            name={childName}
            data-slot="cascading-select-child"
            class={triggerBase}
          >
            {childOptions}
          </select>
          <Chevron />
        </span>
      </div>

      {detail !== undefined ? (
        // OOB swap target. aria-live so AT announces the detail change that
        // accompanies the option swap.
        <div
          id={detailId}
          data-slot="cascading-select-detail"
          aria-live="polite"
          class={detailClass}
        >
          {detail}
        </div>
      ) : null}
    </fieldset>
  )
}

// Re-export the native primitive for ergonomic option authoring (mirrors
// registry/ui/select.tsx). <option> needs no styling beyond the browser's.
export function CascadingSelectOption(
  props: PropsWithChildren<{ value: string; selected?: boolean; disabled?: boolean }>,
) {
  const { value, selected, disabled, children } = props
  return (
    <option value={value} selected={selected} disabled={disabled}>
      {children}
    </option>
  )
}

// A detail fragment ready for an out-of-band swap. Return this from the
// endpoint alongside the bare <option>s; htmx swaps it into #${id}-detail.
//
// hx-swap-oob="innerHTML" (not "true"/outerHTML) so the live #${id}-detail
// element stays in the DOM — only its contents are replaced. An outerHTML OOB
// swap would detach and replace the node, breaking the aria-live region's
// identity (and any element reference held to it). The encapsulating <div> is
// stripped by htmx; its children are swapped into the element matched by id.
export function CascadingSelectDetail(
  props: PropsWithChildren<{ id: string }>,
) {
  return (
    <div
      id={`${props.id}-detail`}
      data-slot="cascading-select-detail"
      hx-swap-oob="innerHTML"
      aria-live="polite"
      class={detailClass}
    >
      {props.children}
    </div>
  )
}
