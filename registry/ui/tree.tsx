/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Tree (Tree View) — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui has no first-party Tree primitive; community trees lean on Radix
// Accordion or a headless library. We instead build the exact WAI-ARIA APG
// Tree View widget from real list semantics:
//   repos/aria-practices/content/patterns/treeview/treeview-pattern.html
//   repos/aria-practices/content/patterns/treeview/examples/treeview-1b.html
//     (the "declared properties" file-directory example we model 1:1)
//   repos/aria-practices/content/patterns/treeview/examples/js/tree.js
//   repos/aria-practices/content/patterns/treeview/examples/js/treeitem.js
//     (the keyboard contract our site.js handler is modelled on)
// Role semantics confirmed against MDN:
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/tree_role
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/treeitem_role
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/group_role
//
// Anatomy (web-standard nested lists, the structure APG recommends):
//   <ul role="tree">                       ← TreeRoot, data-slot="tree"
//     <li role="treeitem" aria-expanded>    ← TreeItem (parent node)
//       <span data-slot="tree-label">…</span>
//       <ul role="group">                   ← TreeGroup
//         <li role="treeitem">…</li>         ← TreeItem (end node, no aria-expanded)
//       </ul>
//     </li>
//   </ul>
//
// Why not native <details>/<summary> underneath?  APG requires the treeitem
// (the <li>) to be the focusable element managed by a single ROVING tabindex —
// exactly one node is in the tab sequence, arrows move that 0 between visible
// nodes. A <summary> is independently focusable and would create competing tab
// stops that the roving model can't reconcile, so the platform's disclosure
// widget is the wrong primitive here. We keep the open/closed state on the
// node's aria-expanded attribute (CSS hides the collapsed <ul role="group">),
// which is exactly what the APG example does. The end result still degrades
// without JS: every group is visible (expanded) so the content stays reachable.
//
// public/site.js (keyed on data-slot="tree") owns the live APG keyboard +
// roving-tabindex contract: Up/Down move between VISIBLE nodes, Right expands /
// steps into the first child, Left collapses / steps to the parent, Home/End
// jump to first/last visible node, type-ahead matches node labels, `*` expands
// all siblings, Enter/Space select. An inline boot <script> seeds the roving
// tabindex (first node tabindex="0") before paint so there's no flash.

export type TreeProps = PropsWithChildren<{
  // Accessible name. APG: the tree element must be labelled via aria-label or
  // aria-labelledby. Pass one of these (ariaLabelledby points at a heading id).
  ariaLabel?: string
  ariaLabelledby?: string
  class?: ClassValue
  id?: string
  // htmx / data / aria passthrough onto the <ul role="tree">.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

// Collapsing closed parents (hide the child group of an aria-expanded=false
// node), the focus ring, hover, selected fill, disabled dimming, and chevron
// rotation are all handled by CSS attribute selectors scoped to
// [data-slot="tree"] in styles.css — see newThemeTokens. So the utility
// classes here are just layout + base text.
const treeBase = "w-fit min-w-56 select-none text-sm text-foreground"

export function Tree(props: TreeProps) {
  const { ariaLabel, ariaLabelledby, class: className, children, ...rest } =
    props as any
  // Seed the roving tabindex before paint: the first treeitem becomes the
  // single tab stop (tabindex="0"), every other node gets -1. Runs right after
  // this element is parsed so the tree is a single tab stop immediately, with
  // no flash of all-focusable nodes before site.js boots. Models the APG
  // example's `firstTreeitem.domNode.tabIndex = 0` initialisation.
  const boot = `(function(el){
    var items = el.querySelectorAll('[role="treeitem"]');
    items.forEach(function(it,i){ it.setAttribute('tabindex', i===0?'0':'-1'); });
    el.setAttribute('data-tree-ready','true');
  })(document.currentScript.previousElementSibling);`
  return (
    <>
      <ul
        role="tree"
        data-slot="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        class={cn(treeBase, className)}
        {...rest}
      >
        {children}
      </ul>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </>
  )
}

export type TreeItemProps = PropsWithChildren<{
  // Stable identifier emitted as data-value so consumers / htmx can target the
  // node. Not required for the ARIA contract.
  value?: string
  // Parent node: when set, this treeitem gets aria-expanded and is expected to
  // contain a <TreeGroup>. End nodes leave it undefined so they are NOT
  // mis-described as parents (APG: end nodes have no aria-expanded).
  expanded?: boolean
  // Mark a parent node without pre-expanding it. Forces aria-expanded="false".
  parent?: boolean
  // Single-select trees indicate the chosen node with aria-selected.
  selected?: boolean
  disabled?: boolean
  // Visible label. Prefer this over free children so type-ahead has clean text;
  // children render after it (e.g. a nested <TreeGroup>).
  label?: any
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

// The roving-tabindex node is the <li role="treeitem">; the visual focus ring,
// hover, selected fill, disabled dimming, and chevron rotation are all driven
// off the node's state attributes by plain CSS attribute selectors scoped to
// [data-slot="tree"] (appended to styles.css). This mirrors the APG example,
// which notes the open/closed and selected states are "synchronized by a CSS
// attribute selector" rather than per-element classes — and keeps the markup
// identical and tiny across all five flavours.
const treeItemLabel =
  "flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 outline-none"

export function TreeItem(props: TreeItemProps) {
  const {
    value,
    expanded,
    parent,
    selected,
    disabled,
    label,
    class: className,
    children,
    ...rest
  } = props as any
  // A node is a parent when it is explicitly marked `parent` or given an
  // `expanded` value. End nodes get NO aria-expanded (APG: an end node with
  // aria-expanded would be mis-announced as a parent). We require the flag
  // rather than sniffing for a child group so every flavour decides this the
  // same deterministic way at render time.
  const isParent = parent === true || expanded !== undefined
  const ariaExpanded = isParent ? (expanded ? "true" : "false") : undefined
  return (
    <li
      role="treeitem"
      data-slot="tree-item"
      data-value={value}
      // Seeded by the boot script / managed by site.js (roving tabindex).
      tabindex="-1"
      aria-expanded={ariaExpanded}
      aria-selected={selected ? "true" : "false"}
      aria-disabled={disabled ? "true" : undefined}
      class={cn(className)}
      {...rest}
    >
      <span data-slot="tree-label" class={treeItemLabel}>
        {isParent ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-slot="tree-chevron"
            class="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <span aria-hidden="true" class="size-4 shrink-0" />
        )}
        {label}
      </span>
      {children}
    </li>
  )
}

export type TreeGroupProps = PropsWithChildren<{ class?: ClassValue }>

// The child container of a parent node. role="group" is what lets the browser
// compute aria-level / aria-setsize / aria-posinset from the DOM and keeps the
// children out of the parent's accessible name (APG group role notes).
export function TreeGroup(props: TreeGroupProps) {
  return (
    <ul
      role="group"
      data-slot="tree-group"
      // Indent the branch; the connecting rail reads as hierarchy.
      class={cn("ml-3.5 border-l border-border pl-1.5", props.class)}
    >
      {props.children}
    </ul>
  )
}
