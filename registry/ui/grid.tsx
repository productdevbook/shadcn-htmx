/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Grid — shadcn-htmx, htmx v4 + Tailwind v4.
//
// An INTERACTIVE data grid: a single tab stop with 2-D arrow-key cell
// navigation (roving tabindex). This is deliberately distinct from the
// static <Table> component — Table is the right choice for read-only
// tabular data (every focusable link/button stays in the tab sequence and
// AT gets native row/column navigation). Reach for Grid only when you want
// spreadsheet-style cell focus and a SHORTER tab sequence (the whole grid
// is one tab stop). See the APG comparison of the two patterns.
//
// shadcn/ui has no Grid component — this maps to the WAI-ARIA APG Grid
// pattern, built on a real <table> so we inherit the semantic table model
// and only layer the grid roles + roving tabindex on top.
//
// Refs (read before editing):
//   repos/aria-practices/content/patterns/grid/grid-pattern.html
//     — keyboard contract + roles/states. Arrow keys move one cell; Home/End
//       jump to row ends; Ctrl+Home/End jump to the grid's first/last cell.
//   repos/aria-practices/content/patterns/grid/examples/js/dataGrid.js
//     — the reference roving-tabindex implementation we model (one cell at
//       tabindex="0", the rest at -1; setFocusPointer rolls the 0).
//   repos/mdn/files/en-us/web/html/reference/elements/table/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/grid_role/index.md
//
// The ARIA contract:
//   - The container is a <table role="grid"> with an accessible name
//     (aria-label or aria-labelledby). role="grid" switches screen readers
//     into application mode so the arrow-key contract is exposed.
//   - Native <tr> carries the implicit role="row"; <th scope="col"> the
//     implicit role="columnheader"; <td> the implicit role="gridcell". We
//     keep the native elements and do NOT add aria-rowspan/colspan — per the
//     APG note, a grid built from a <table> must use HTML rowspan/colspan.
//   - Every focusable cell is marked [data-grid-cell] so the keyboard layer
//     can build its 2-D map. Exactly one carries tabindex="0"; the rest -1.
//   - If a cell contains a single interactive widget (link/button), grid
//     navigation focuses that widget directly (APG "focus an element inside
//     the cell"); otherwise it focuses the cell itself. We expose that via
//     <GridCell as="a"> / interactive children — the cell stays the
//     [data-grid-cell] hook and is the thing that gets tabindex.
//   - aria-sort lives on a header cell when the column is sortable (the sort
//     control routes through htmx, exactly like <Table>).
//
// A tiny inline boot <script> sets the initial roving tabindex before paint
// (no flash of all-tabbable cells); public/site.js (keyed on
// data-slot="grid") owns the live arrow/Home/End/Ctrl+Home/End contract.

export type GridSort = "none" | "ascending" | "descending"

const gridBase = "w-full caption-bottom border-separate border-spacing-0 text-sm"

// Cells get a focus ring on the cell itself (roving tabindex lands here).
const cellBase =
  "border-b border-r px-3 py-2 align-middle outline-none " +
  "focus-visible:relative focus-visible:z-10 focus-visible:ring-[2px] focus-visible:ring-ring/50 " +
  // The roving-tabindex owner reads as the active cell even before focus.
  "data-[grid-active=true]:bg-muted/50"

const headBase =
  cellBase +
  " border-t bg-muted/50 text-left font-medium text-muted-foreground first:rounded-tl-md last:rounded-tr-md"

const dataCellBase = cellBase + " bg-background text-foreground"

type GridProps = PropsWithChildren<{
  // APG: a grid MUST have an accessible name. Provide one of these.
  ariaLabel?: string
  ariaLabelledby?: string
  // Optional caption/description element id (announced after the name).
  ariaDescribedby?: string
  // Total counts when rows/cols are virtualised or not all in the DOM.
  ariaRowcount?: number
  ariaColcount?: number
  // Editing is disabled across the whole grid (read-only data grid).
  ariaReadonly?: boolean
  // The grid supports selecting more than one cell/row. Pair with the
  // `selected` props on GridRow/GridCell; selectable-but-unselected nodes
  // should then carry aria-selected="false" so AT advertises selectability.
  // aria-multiselectable: w3c.github.io/aria/#aria-multiselectable
  ariaMultiselectable?: boolean
  class?: ClassValue
  wrapperClass?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Grid(props: GridProps) {
  const {
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaRowcount,
    ariaColcount,
    ariaReadonly,
    ariaMultiselectable,
    class: className,
    wrapperClass,
    children,
    ...rest
  } = props as any
  // Boot script: roll the roving tabindex to the FIRST focusable cell before
  // paint, so the grid is a single tab stop immediately (no flash of every
  // cell being tabbable). Models dataGrid.js setFocusPointer(0,0).
  const boot = `(function(el){
    var cells = el.querySelectorAll('[data-grid-cell]');
    cells.forEach(function(c,i){ c.setAttribute('tabindex', i===0 ? '0' : '-1'); });
    if (cells.length) cells[0].setAttribute('data-grid-active','true');
    el.setAttribute('data-grid-ready','true');
  })(document.currentScript.previousElementSibling);`
  return (
    <div class={cn("relative w-full overflow-auto rounded-md border", wrapperClass)}>
      <table
        role="grid"
        data-slot="grid"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-rowcount={ariaRowcount}
        aria-colcount={ariaColcount}
        aria-readonly={ariaReadonly ? "true" : undefined}
        aria-multiselectable={ariaMultiselectable ? "true" : undefined}
        class={cn(gridBase, className)}
        {...rest}
      >
        {children}
      </table>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </div>
  )
}

export function GridHeader(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <thead data-slot="grid-header" class={cn(props.class)}>
      {props.children}
    </thead>
  )
}

export function GridBody(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <tbody data-slot="grid-body" class={cn(props.class)}>
      {props.children}
    </tbody>
  )
}

type GridRowProps = PropsWithChildren<{
  class?: ClassValue
  // 1-based row position when not all rows are in the DOM (virtualised).
  ariaRowindex?: number
  // 1-based column index of the row's first cell when the visible columns are
  // contiguous: set aria-colindex ONCE on the row and browsers compute each
  // cell's column number (preferred over per-cell when columns are contiguous).
  // aria-colindex: w3c.github.io/aria/#aria-colindex
  ariaColindex?: number
  selected?: boolean
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}>

export function GridRow(props: GridRowProps) {
  const { children, class: className, ariaRowindex, ariaColindex, selected, ...rest } = props as any
  return (
    <tr
      data-slot="grid-row"
      aria-rowindex={ariaRowindex}
      aria-colindex={ariaColindex}
      aria-selected={selected ? "true" : undefined}
      class={cn("transition-colors", className)}
      {...rest}
    >
      {children}
    </tr>
  )
}

type GridColumnHeaderProps = PropsWithChildren<{
  class?: ClassValue
  // Sort state. Omit for non-sortable columns.
  sort?: GridSort
  // 1-based column position when columns are virtualised.
  ariaColindex?: number
  // htmx attrs ride onto the header cell (e.g. hx-get to re-fetch sorted).
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}>

// A column header. It is focusable (a [data-grid-cell]) so screen-reader
// users in application mode can reach it with the arrow keys — APG: header
// cells should be focusable when they provide functions like sort.
export function GridColumnHeader(props: GridColumnHeaderProps) {
  const { children, class: className, sort, ariaColindex, ...rest } = props as any
  const sortable = sort !== undefined
  return (
    <th
      scope="col"
      data-slot="grid-columnheader"
      data-grid-cell=""
      data-sortable={sortable ? "true" : undefined}
      aria-sort={sortable ? sort : undefined}
      aria-colindex={ariaColindex}
      class={cn(headBase, className)}
      {...rest}
    >
      <span class="inline-flex items-center gap-1.5">
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
      </span>
    </th>
  )
}

type GridRowHeaderProps = PropsWithChildren<{
  class?: ClassValue
  ariaColindex?: number
  [key: `data-${string}`]: any
}>

// A row header (scope="row") — title information for the row, focusable.
export function GridRowHeader(props: GridRowHeaderProps) {
  const { children, class: className, ariaColindex, ...rest } = props as any
  return (
    <th
      scope="row"
      data-slot="grid-rowheader"
      data-grid-cell=""
      aria-colindex={ariaColindex}
      class={cn(headBase, "font-medium text-foreground", className)}
      {...rest}
    >
      {children}
    </th>
  )
}

type GridCellProps = PropsWithChildren<{
  class?: ClassValue
  ariaColindex?: number
  selected?: boolean
  // Editing disabled for this specific cell.
  ariaReadonly?: boolean
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}>

export function GridCell(props: GridCellProps) {
  const { children, class: className, ariaColindex, selected, ariaReadonly, ...rest } =
    props as any
  return (
    <td
      data-slot="grid-cell"
      data-grid-cell=""
      aria-colindex={ariaColindex}
      aria-selected={selected ? "true" : undefined}
      aria-readonly={ariaReadonly ? "true" : undefined}
      class={cn(dataCellBase, className)}
      {...rest}
    >
      {children}
    </td>
  )
}
