/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Treegrid — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A treegrid is a hierarchical, 2-D-navigable grid: rows can be expanded /
// collapsed like a tree, and cells are navigable like a grid. shadcn/ui has
// no Treegrid, so there is no React source of truth to mirror — the contract
// here comes straight from the WAI-ARIA APG.
//
// Accessibility contract follows the APG Treegrid pattern + its example:
//   repos/aria-practices/content/patterns/treegrid/treegrid-pattern.html
//   repos/aria-practices/content/patterns/treegrid/examples/treegrid-1.html
//   repos/aria-practices/content/patterns/treegrid/examples/js/treegrid-1.js
//     (the keyboard model in public/site.js is a faithful port of this file —
//      the "rows focused first, but cells can be focused" variant, which is
//      doAllowRowFocus=true / doStartRowFocus=true in the example.)
//
// The contract, distilled from the pattern + example:
//   - Container is an HTML <table> with role="treegrid" and a label
//     (aria-label or aria-labelledby).
//   - The header is one <tr> of <th role="columnheader" scope="col">.
//   - Every body <tr> carries role="row" + aria-level (1-based),
//     aria-posinset and aria-setsize (position within its sibling set).
//   - A PARENT row (one with child rows) carries aria-expanded on the <tr>
//     itself ("rows focused first" variant). Rows with no children OMIT
//     aria-expanded, otherwise AT would announce them as empty parents.
//   - Cells are <td role="gridcell">.
//   - Collapsed descendant rows are hidden with the native `hidden`
//     attribute, which drops them from layout AND the accessibility tree
//     (repos/mdn/.../web/html/reference/global_attributes/hidden).
//   - Focus management is a roving tabindex over the rows; cells become
//     focusable on demand. An inline boot <script> sets the first visible
//     row to tabindex="0" before paint; public/site.js (data-slot="treegrid")
//     owns the live Up/Down/Left/Right/Home/End/Ctrl+Home/Ctrl+End/Enter
//     keyboard contract and the roving-tabindex bookkeeping.
//
// Refs:
//   repos/mdn/files/en-us/web/html/reference/elements/table/index.md
//   repos/mdn/files/en-us/web/html/reference/global_attributes/hidden/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/treegrid_role
//
// Composition:
//   <Treegrid ariaLabel="Inbox" columns={["Subject", "Summary", "Email"]}>
//     <TreegridRow level={1} posinset={1} setsize={1} expanded>
//       <TreegridCell>Treegrids are awesome</TreegridCell>
//       <TreegridCell>Want to learn how to use them?</TreegridCell>
//       <TreegridCell><a href="mailto:a@b.c">a@b.c</a></TreegridCell>
//     </TreegridRow>
//     <TreegridRow level={2} posinset={1} setsize={2}>…</TreegridRow>
//   </Treegrid>

const containerBase = "relative w-full overflow-auto"

const tableBase = "w-full caption-bottom border-collapse text-sm"

const headRowBase = "border-b"

const headCellBase =
  "h-10 px-2 text-left align-middle font-medium text-muted-foreground"

const rowBase =
  "border-b outline-none transition-colors hover:bg-muted/50 " +
  // Roving-tabindex focus + selection styling. The row (or a cell inside it)
  // is the focus target; we light up both via :focus and :focus-within.
  "focus-visible:bg-accent focus-visible:text-accent-foreground " +
  "[&:focus-within]:bg-muted/60 " +
  "aria-selected:bg-muted data-[state=selected]:bg-muted"

const cellBase =
  "px-2 py-1.5 align-middle outline-none " +
  "focus-visible:bg-accent focus-visible:text-accent-foreground"

// First-cell wrapper holds the expand/collapse chevron + the indent. The
// chevron is an inline SVG rendered for parent rows only; its rotation is
// driven by the row's aria-expanded via a [data-slot="treegrid"] rule in
// app/styles/input.css (Tailwind utilities can't target an ancestor's ARIA
// state on a descendant pseudo).
const firstCellInnerBase = "flex items-center gap-1.5"

export type TreegridProps = PropsWithChildren<{
  // Column header labels. Rendered as <th role="columnheader" scope="col">.
  columns: string[]
  // Required accessible name (APG: treegrid must be labelled).
  ariaLabel?: string
  ariaLabelledby?: string
  class?: ClassValue
  wrapperClass?: ClassValue
  id?: string
  // htmx / data / aria attributes ride onto the <table>.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Treegrid(props: TreegridProps) {
  const {
    columns,
    ariaLabel,
    ariaLabelledby,
    class: className,
    wrapperClass,
    children,
    ...rest
  } = props as any
  // Boot script: set the roving tabindex before paint so the treegrid is a
  // single tab stop immediately. The first body row gets tabindex="0", every
  // other row tabindex="-1"; any pre-focusable widgets inside rows are taken
  // out of the tab order (tabindex="-1") until their row becomes active.
  // Mirrors initAttributes() in the APG example's treegrid-1.js.
  const boot = `(function(el){
    var rows = el.querySelectorAll('tbody > tr[role="row"]');
    rows.forEach(function(r, i){ r.setAttribute('tabindex', i === 0 ? '0' : '-1'); });
    el.querySelectorAll('tbody a,tbody button,tbody input,tbody [tabindex]').forEach(function(f){
      if (f.getAttribute('role') === 'row') return;
      f.setAttribute('tabindex', '-1');
    });
    el.setAttribute('data-treegrid-ready', 'true');
  })(document.currentScript.previousElementSibling);`
  return (
    <div class={cn(containerBase, wrapperClass)}>
      <table
        role="treegrid"
        data-slot="treegrid"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        class={cn(tableBase, className)}
        {...rest}
      >
        <thead>
          <tr role="row" class={headRowBase}>
            {(columns as string[]).map((label) => (
              <th role="columnheader" scope="col" class={headCellBase}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </div>
  )
}

export type TreegridRowProps = PropsWithChildren<{
  // 1-based depth in the hierarchy. Root rows are level 1.
  level: number
  // 1-based position of this row within its sibling set.
  posinset: number
  // Total number of rows in this row's sibling set at this level.
  setsize: number
  // Parent rows only: true = children visible, false = collapsed. Omit on
  // leaf rows so AT doesn't announce them as empty parents.
  expanded?: boolean
  // Collapsed descendant rows pass hidden so they leave layout + the a11y
  // tree until their ancestor is expanded.
  hidden?: boolean
  // Single-select treegrids set this on the selected row.
  selected?: boolean
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function TreegridRow(props: TreegridRowProps) {
  const {
    level,
    posinset,
    setsize,
    expanded,
    hidden,
    selected,
    class: className,
    children,
    ...rest
  } = props as any
  return (
    <tr
      role="row"
      data-slot="treegrid-row"
      aria-level={level}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-expanded={expanded === undefined ? undefined : expanded ? "true" : "false"}
      aria-selected={selected === undefined ? undefined : selected ? "true" : "false"}
      hidden={hidden ? true : undefined}
      class={cn(rowBase, className)}
      {...rest}
    >
      {children}
    </tr>
  )
}

export type TreegridCellProps = PropsWithChildren<{
  // The first cell of every row hosts the expand/collapse chevron + indent.
  // Set `first` on it and pass the row's `level` so the indent matches depth.
  first?: boolean
  level?: number
  // Mark the first cell of a PARENT row so the chevron renders. Mirrors the
  // row's aria-expanded; leaf rows leave this false/undefined.
  expandable?: boolean
  class?: ClassValue
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function TreegridCell(props: TreegridCellProps) {
  const {
    first,
    level = 1,
    expandable,
    class: className,
    children,
    ...rest
  } = props as any
  if (!first) {
    return (
      <td role="gridcell" data-slot="treegrid-cell" class={cn(cellBase, className)} {...rest}>
        {children}
      </td>
    )
  }
  // Indent the first cell by depth. 1rem per level keeps the hierarchy legible
  // without needing bespoke theme tokens; level 1 sits flush.
  const indent = (level - 1) * 1
  return (
    <td role="gridcell" data-slot="treegrid-cell" class={cn(cellBase, className)} {...rest}>
      <span class={firstCellInnerBase} style={`padding-left:${indent}rem`}>
        {expandable ? (
          <svg
            data-slot="treegrid-chevron"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5 shrink-0 text-muted-foreground transition-transform"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <span class="size-3.5 shrink-0" aria-hidden="true" />
        )}
        <span>{children}</span>
      </span>
    </td>
  )
}
