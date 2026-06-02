/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Table — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Pure semantic <table>/<thead>/<tbody>/<tr>/<th scope="col">/<td>. We
// don't reach for ARIA grid roles — the native table model is correct
// for tabular data and AT users get column/row navigation for free.
//
// Sortable columns:
//   - <th> carries aria-sort="none" | "ascending" | "descending"
//   - The sort affordance is a real <button> inside the <th> so it's
//     keyboard-activatable (Enter / Space) — not the whole <th>.
//   - The button can carry htmx attrs (hx-get) to re-fetch the body.
//
// Refs:
//   repos/mdn/files/en-us/web/html/reference/elements/table/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-sort/

type Sort = "none" | "ascending" | "descending"

type TableProps = PropsWithChildren<{
  class?: ClassValue
  // Wrapper allows horizontal scroll on small screens.
  wrapperClass?: ClassValue
}>

export function Table(props: TableProps) {
  return (
    <div class={cn("relative w-full overflow-auto", props.wrapperClass)}>
      <table
        data-slot="table"
        class={cn("w-full caption-bottom text-sm", props.class)}
      >
        {props.children}
      </table>
    </div>
  )
}

export function TableHeader(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <thead
      data-slot="table-header"
      class={cn("[&_tr]:border-b", props.class)}
    >
      {props.children}
    </thead>
  )
}

export function TableBody(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <tbody
      data-slot="table-body"
      class={cn("[&_tr:last-child]:border-0", props.class)}
    >
      {props.children}
    </tbody>
  )
}

export function TableFooter(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        props.class,
      )}
    >
      {props.children}
    </tfoot>
  )
}

export function TableRow(
  props: PropsWithChildren<
    { class?: ClassValue } & Record<`hx-${string}`, any>
  >,
) {
  const { children, class: className, ...rest } = props
  return (
    <tr
      data-slot="table-row"
      class={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  )
}

type TableHeadProps = PropsWithChildren<{
  class?: ClassValue
  scope?: "col" | "row" | "colgroup" | "rowgroup"
  // Sort state. Omit for non-sortable columns.
  sort?: Sort
  // Native <th> spanning + association attrs (MDN: web/html/reference/elements/th).
  colspan?: number
  rowspan?: number
  // id / headers let complex tables explicitly associate cells with headers
  // (MDN th: "Associate header cells with other header cells").
  id?: string
  headers?: string
  // Short spoken label AT announces in place of verbose header text
  // (MDN th: abbr — non-deprecated on <th>).
  abbr?: string
  // htmx attrs for the sort button (e.g. hx-get to re-fetch with new sort).
  [key: `hx-${string}`]: any
  // Click handler — used when sort button needs custom JS instead of htmx.
  onclick?: string
}>

export function TableHead(props: TableHeadProps) {
  const {
    children,
    class: className,
    scope = "col",
    sort,
    onclick,
    colspan,
    rowspan,
    id,
    headers,
    abbr,
    ...rest
  } = props
  const sortable = sort !== undefined
  if (!sortable) {
    return (
      <th
        scope={scope}
        colspan={colspan}
        rowspan={rowspan}
        id={id}
        headers={headers}
        abbr={abbr}
        data-slot="table-head"
        class={cn(
          "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
          className,
        )}
      >
        {children}
      </th>
    )
  }
  return (
    <th
      scope={scope}
      colspan={colspan}
      rowspan={rowspan}
      id={id}
      headers={headers}
      abbr={abbr}
      data-slot="table-head"
      data-sortable="true"
      aria-sort={sort}
      class={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
        className,
      )}
    >
      <button
        type="button"
        onclick={onclick}
        class="inline-flex h-7 items-center gap-1.5 rounded-md px-2 -ml-2 hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        {...rest}
      >
        {children}
        {sort === "ascending" && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        )}
        {sort === "descending" && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
        {sort === "none" && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 opacity-30" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>
    </th>
  )
}

export function TableCell(
  props: PropsWithChildren<{
    class?: ClassValue
    colspan?: number
    // Native <td> spanning + association attrs (MDN: web/html/reference/elements/td).
    rowspan?: number
    scope?: "row"
    id?: string
    // headers: space-separated list of header cell ids for complex tables
    // (MDN td: "Associate data cells with header cells").
    headers?: string
  }>,
) {
  return (
    <td
      colspan={props.colspan}
      rowspan={props.rowspan}
      scope={props.scope}
      id={props.id}
      headers={props.headers}
      data-slot="table-cell"
      class={cn("p-2 align-middle", props.class)}
    >
      {props.children}
    </td>
  )
}

export function TableCaption(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <caption
      data-slot="table-caption"
      class={cn("mt-4 text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </caption>
  )
}
