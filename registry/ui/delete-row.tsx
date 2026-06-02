/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"
import { buttonClasses, type ButtonVariant, type ButtonSize } from "@/registry/ui/button"

// Delete Row — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A row/item delete affordance that confirms, sends DELETE, then fades out
// in place. One inherited declaration on the list host covers every row —
// no per-row wiring, no client-side list state. The server answers the
// DELETE with a 200 and an empty body, so the row is swapped with nothing
// and simply disappears.
//
// Built on:
//   repos/htmx/www/src/content/patterns/03-records/02-delete-in-place.md
//     The canonical pattern: the <tbody> hoists hx-confirm / hx-target /
//     hx-swap with the :inherited modifier; each Delete button only needs
//     hx-delete. During the swap delay htmx adds the htmx-swapping class to
//     the target row, which we use to drive a CSS opacity fade.
//   repos/htmx/www/src/content/docs/03-features/08-attribute-inheritance.md:10,29-32
//     htmx v4 inheritance is explicit — hoist an attribute to an ancestor
//     with the `:inherited` modifier (e.g. hx-confirm:inherited).
//   repos/htmx/www/src/content/reference/01-attributes/05-hx-delete.md:25-29
//     Respond to DELETE with a 200 + empty body to remove the element (a
//     204 performs no swap).
//   repos/htmx/www/src/content/reference/01-attributes/08-hx-target.md
//     hx-target="closest tr" targets the row containing the button.
//   repos/htmx/www/src/content/reference/01-attributes/07-hx-swap.md:211
//     hx-swap="outerHTML swap:Nms" delays the removal by N ms, giving the
//     fade transition time to play before the node is detached.
//   repos/htmx/www/src/content/reference/01-attributes/22-hx-confirm.md
//     hx-confirm prompts with window.confirm before issuing the request.
//   repos/htmx/src/htmx.js:1304,1394
//     htmx adds `htmx-swapping` to the target before the swap delay and
//     removes it after the swap — the hook our fade keys off.
//
// Native semantics:
//   - The list host is a real <tbody> (default) so the rows live in a valid
//     table model and AT users get row/column navigation for free.
//     repos/mdn/files/en-us/web/html/reference/elements/tbody/index.md
//   - The delete affordance is a real <button>, so Enter / Space activation
//     and focus come from the platform; no role/tabindex needed.
//     repos/aria-practices/content/patterns/button/button-pattern.html
//
// Style analogues: registry/ui/table.tsx (the row/cell model + transition
// idiom on <tr>), registry/ui/button.tsx (the affordance classes + the
// `[&.htmx-request]:…` arbitrary-variant idiom this fade mirrors).

// ── List host ─────────────────────────────────────────────────────────────
// The inheritance host. It hoists the shared delete behaviour onto every
// descendant Delete button via htmx's `:inherited` modifier, so a single
// declaration covers the whole list. Defaults to <tbody>; pass `as="ul"`
// (etc.) for non-table lists, and set the matching `target` (e.g. "closest
// li").

type ListTag = "tbody" | "ul" | "ol" | "div"

type DeleteRowListProps = PropsWithChildren<{
  // Confirmation question shown by the browser before each DELETE fires.
  // Pass null to skip confirmation entirely.
  confirm?: string | null
  // Selector for the element each Delete request removes. Default "closest
  // tr" — change to match `as` (e.g. "closest li" for a <ul>).
  target?: string
  // Fade duration in ms. Must match the row's CSS transition; both default
  // to 300ms. This is the htmx swap delay (hx-swap="… swap:Nms").
  swapMs?: number
  // Element the host renders as. Default "tbody".
  as?: ListTag
  class?: ClassValue
}> &
  Record<string, any>

export function DeleteRowList(props: DeleteRowListProps) {
  const {
    children,
    confirm = "Are you sure you want to delete this?",
    target = "closest tr",
    swapMs = 300,
    as = "tbody",
    class: className,
    ...rest
  } = props
  const Tag: any = as

  return (
    <Tag
      data-slot="delete-row"
      // htmx v4 explicit inheritance: every descendant Delete button picks
      // up these three attributes, so the per-row markup only needs
      // hx-delete. One declaration, every row.
      hx-confirm:inherited={confirm === null ? undefined : confirm}
      hx-target:inherited={target}
      hx-swap:inherited={`outerHTML swap:${swapMs}ms`}
      class={cn(className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// ── Row ─────────────────────────────────────────────────────────────────
// One deletable row. Carries the opacity transition so that when htmx adds
// `htmx-swapping` during the swap delay, the row fades out before it's
// detached. Defaults to <tr>; pass `as` to match the list host.

type RowTag = "tr" | "li" | "div"

type DeleteRowItemProps = PropsWithChildren<{
  // Duration of the fade in ms; must equal the host's swapMs. Default 300.
  swapMs?: number
  as?: RowTag
  class?: ClassValue
}> &
  Record<string, any>

export function DeleteRowItem(props: DeleteRowItemProps) {
  const { children, swapMs = 300, as = "tr", class: className, ...rest } = props
  const Tag: any = as

  return (
    <Tag
      data-slot="delete-row-item"
      // The fade: opacity transitions over the swap delay, and htmx's
      // `htmx-swapping` class (added to this row for the swap:Nms window)
      // drives it to 0 before the node is removed. Same arbitrary-variant
      // idiom as button.tsx's [&.htmx-request]:… hook.
      style={`transition-duration:${swapMs}ms`}
      class={cn(
        "transition-opacity ease-out [&.htmx-swapping]:opacity-0",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// ── Delete affordance ─────────────────────────────────────────────────────
// The per-row button. It only carries hx-delete — confirm / target / swap
// are inherited from DeleteRowList. Styled as a ghost button by default so
// it sits quietly in a cell; pass variant="destructive" for a louder one.

type DeleteRowProps = PropsWithChildren<{
  // DELETE endpoint for this row's resource. Respond 200 + empty body.
  href: string
  // Button label. Default "Delete". Use `ariaLabel` when the visible label
  // is an icon only.
  variant?: ButtonVariant
  size?: ButtonSize
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  disabled?: boolean
  class?: ClassValue
}> &
  Record<string, any>

export function DeleteRow(props: DeleteRowProps) {
  const {
    children,
    href,
    variant = "ghost",
    size = "sm",
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    disabled,
    class: className,
    ...rest
  } = props

  return (
    <button
      type="button"
      data-slot="delete-row-trigger"
      hx-delete={href}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      class={buttonClasses({
        variant,
        size,
        class: cn("text-muted-foreground hover:text-destructive", className),
      })}
      {...rest}
    >
      {children ?? "Delete"}
    </button>
  )
}
