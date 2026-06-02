/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Selectable Table — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A data table with row checkboxes, a header select-all, a live selection
// count, and a contextual bulk-action bar. Built entirely on web standards:
//
//   - A <form> wraps the <table>. Every row checkbox is a real
//     <input type="checkbox" name="selected" value="…">, so the checked
//     values are submitted as a repeated form field with no JS plumbing.
//   - Bulk-action <button>s carry hx-post; because they sit inside the form,
//     htmx serialises the enclosing form and submits every checked `selected`
//     value. hx-target / hx-swap on the form replace it with the server's
//     re-render (selections cleared, rows updated, result message).
//   - The action bar is revealed PURELY in CSS via :has() — no JS decides
//     visibility. `form:has(input[name=selected]:checked)` shows the bar and
//     highlights checked rows. This is the platform feature, not an emulation.
//   - The header "select-all" + the live count + the row indeterminate state
//     are the only behaviour that CSS can't express, so they live in a tiny
//     delegated site.js handler keyed on data-slot="selectable-table". The
//     table still works without it: every checkbox toggles and submits
//     natively; you just lose the convenience toggle and the running count.
//
// The <output> element is an implicit aria-live region, so the running count
// and the post-action result message are announced to AT without moving focus.
//
// Sources (read, never copied):
//   repos/htmx/www/src/content/patterns/03-records/01-bulk-actions.md
//   repos/htmx/www/src/content/reference/01-attributes/{02-hx-post,07-hx-swap,08-hx-target,22-hx-confirm}.md
//   repos/htmx/www/src/content/docs/02-core-concepts/02-hypermedia-controls.md (enclosing-form serialisation)
//   repos/mdn/files/en-us/web/css/reference/selectors/_colon_has/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/output/index.md (implicit aria-live)
//   repos/mdn/files/en-us/web/html/reference/elements/table/index.md
//   style analogues: registry/ui/table.tsx, registry/ui/checkbox.tsx

// Shared checkbox styling — mirrors registry/ui/checkbox.tsx so the row /
// select-all boxes look identical to the standalone <Checkbox>.
const checkboxInput =
  "peer size-4 shrink-0 appearance-none rounded-[4px] border border-input bg-background shadow-xs transition-shadow outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "checked:border-primary checked:bg-primary " +
  "indeterminate:border-primary indeterminate:bg-primary " +
  "dark:bg-input/30"

function CheckIcon() {
  return (
    <>
      <svg
        class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-checked:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <svg
        class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-indeterminate:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </>
  )
}

// ---- Root form -------------------------------------------------------

type SelectableTableProps = {
  // Endpoint-independent: each BulkAction carries its own hx-post. The form
  // owns the swap target/strategy so every action re-renders the whole table.
  "hx-target"?: string
  "hx-swap"?: string
  // Accessible name for the form region (announced as a group).
  ariaLabel?: string
  ariaLabelledby?: string
  id?: string
  class?: ClassValue
  children?: Child
  [key: `data-${string}`]: any
  [key: `hx-${string}`]: any
}

export function SelectableTable(props: SelectableTableProps) {
  const {
    class: className,
    ariaLabel,
    ariaLabelledby,
    children,
    ...rest
  } = props
  return (
    <form
      data-slot="selectable-table"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      // Named group so the action bar can react to :has(checked) via the
      // group-has-[…]/selectable-table arbitrary variant — pure CSS reveal.
      // NB: htmx v4 inheritance is EXPLICIT (repos/htmx/.../docs/03-features/
      // 08-attribute-inheritance.md), so we do NOT set hx-target/hx-swap here
      // and rely on children inheriting them — each BulkAction targets the
      // form explicitly instead (see below).
      class={cn("group/selectable-table w-full space-y-3", className)}
      {...rest}
    >
      {children}
    </form>
  )
}

// ---- Contextual action bar -------------------------------------------
// Hidden by default; revealed only while the form has a checked row box.
// Pure CSS :has() — the group-[…] arbitrary variant targets the bar based on
// the ancestor form's :has() state, so no JS toggles display.

type ActionsProps = {
  label?: Child
  class?: ClassValue
  children?: Child
}

export function SelectableTableActions(props: ActionsProps) {
  return (
    <div
      data-slot="selectable-table-actions"
      // hidden until any row checkbox is checked (CSS :has on the form root).
      class={cn(
        "hidden items-center gap-2 rounded-md border bg-muted px-3 py-2",
        "group-has-[input[name=selected]:checked]/selectable-table:flex",
        props.class,
      )}
    >
      {props.label !== undefined && (
        <span class="mr-1 text-xs font-medium text-muted-foreground">
          {props.label}
        </span>
      )}
      {props.children}
    </div>
  )
}

// A bulk-action button. Sits inside the form, so htmx serialises the enclosing
// form (all checked `selected` values) onto its hx-post request. It targets the
// closest [data-slot=selectable-table] form and swaps outerHTML, so the server
// re-render replaces the whole table. We set this EXPLICITLY (not via parent
// inheritance) because htmx v4 inheritance is opt-in, and because hx-target
// "this" on the form would resolve to the button, not the form. Override either
// with an explicit hx-target / hx-swap prop.
type BulkActionProps = {
  "hx-post"?: string
  "hx-target"?: string
  "hx-swap"?: string
  // Native browser confirm before firing (htmx hx-confirm).
  confirm?: string
  variant?: "default" | "destructive"
  type?: "submit" | "button"
  disabled?: boolean
  class?: ClassValue
  children?: Child
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

const bulkActionBase =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium whitespace-nowrap outline-none transition-colors " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

const bulkActionVariants: Record<NonNullable<BulkActionProps["variant"]>, string> = {
  default: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  destructive: "border-destructive/40 text-destructive hover:bg-destructive/10",
}

export function BulkAction(props: BulkActionProps) {
  const {
    class: className,
    confirm,
    variant = "default",
    type = "button",
    children,
    "hx-target": hxTarget,
    "hx-swap": hxSwap,
    ...rest
  } = props
  return (
    <button
      type={type}
      data-slot="selectable-table-action"
      hx-confirm={confirm}
      hx-target={hxTarget ?? "closest [data-slot='selectable-table']"}
      hx-swap={hxSwap ?? "outerHTML"}
      class={cn(bulkActionBase, bulkActionVariants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  )
}

// ---- Live selection count --------------------------------------------
// <output> is an implicit aria-live region. site.js writes the running count
// here; the server can also render a result message into it after a POST.

export function SelectableTableCount(
  props: { children?: Child; class?: ClassValue },
) {
  return (
    <output
      data-slot="selectable-table-count"
      class={cn("block text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </output>
  )
}

// ---- Table primitives (thin wrappers mirroring registry/ui/table.tsx) -

export function SelectableTableContent(
  props: { children?: Child; class?: ClassValue; wrapperClass?: ClassValue },
) {
  return (
    <div class={cn("relative w-full overflow-auto rounded-md border", props.wrapperClass)}>
      <table
        data-slot="selectable-table-content"
        class={cn("w-full caption-bottom text-sm", props.class)}
      >
        {props.children}
      </table>
    </div>
  )
}

export function SelectableTableHeader(props: { children?: Child; class?: ClassValue }) {
  return (
    <thead data-slot="selectable-table-header" class={cn("[&_tr]:border-b", props.class)}>
      {props.children}
    </thead>
  )
}

export function SelectableTableBody(props: { children?: Child; class?: ClassValue }) {
  return (
    <tbody data-slot="selectable-table-body" class={cn("[&_tr:last-child]:border-0", props.class)}>
      {props.children}
    </tbody>
  )
}

type RowProps = {
  // value submitted for this row when its checkbox is checked.
  value?: string
  children?: Child
  class?: ClassValue
}

export function SelectableTableRow(props: RowProps) {
  return (
    <tr
      data-slot="selectable-table-row"
      // Pure-CSS selected-row highlight, per the bulk-actions pattern.
      class={cn(
        "border-b transition-colors hover:bg-muted/50 has-[input[name=selected]:checked]:bg-muted",
        props.class,
      )}
    >
      {props.children}
    </tr>
  )
}

export function SelectableTableHead(
  props: { children?: Child; scope?: "col" | "row"; class?: ClassValue },
) {
  return (
    <th
      scope={props.scope ?? "col"}
      data-slot="selectable-table-head"
      class={cn("h-10 px-3 text-left align-middle font-medium text-muted-foreground", props.class)}
    >
      {props.children}
    </th>
  )
}

export function SelectableTableCell(
  props: { children?: Child; class?: ClassValue; colspan?: number; scope?: "row" },
) {
  return (
    <td
      colspan={props.colspan}
      scope={props.scope}
      data-slot="selectable-table-cell"
      class={cn("px-3 py-2 align-middle", props.class)}
    >
      {props.children}
    </td>
  )
}

// ---- Select-all (header) and row checkboxes --------------------------

// Header checkbox. site.js toggles every row box from it and keeps it
// in sync (checked / unchecked / indeterminate). Native + form-safe; it is
// not submitted (no name), it only drives the row boxes.
export function SelectAllCheckbox(
  props: { ariaLabel?: string; class?: ClassValue; id?: string },
) {
  return (
    <span class="relative inline-flex size-4 shrink-0 align-middle">
      <input
        type="checkbox"
        id={props.id}
        data-slot="selectable-table-select-all"
        aria-label={props.ariaLabel ?? "Select all rows"}
        class={cn(checkboxInput, props.class)}
      />
      <CheckIcon />
    </span>
  )
}

// Per-row checkbox. name="selected" makes the checked rows a repeated form
// field; value identifies the record.
export function SelectRowCheckbox(
  props: {
    value: string
    checked?: boolean
    ariaLabel?: string
    name?: string
    class?: ClassValue
    id?: string
  },
) {
  return (
    <span class="relative inline-flex size-4 shrink-0 align-middle">
      <input
        type="checkbox"
        id={props.id}
        name={props.name ?? "selected"}
        value={props.value}
        checked={props.checked || undefined}
        data-slot="selectable-table-select-row"
        aria-label={props.ariaLabel ?? `Select ${props.value}`}
        class={cn(checkboxInput, props.class)}
      />
      <CheckIcon />
    </span>
  )
}
