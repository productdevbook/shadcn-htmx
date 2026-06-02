/** @jsxImportSource hono/jsx */
import type { PropsWithChildren, Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Splitter (window splitter) — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui has no splitter; the closest analogue is the community
// "resizable" component built on react-resizable-panels. We do NOT copy that
// React/JS machinery. Instead we build the WAI-ARIA Window Splitter pattern on
// web standards: a CSS grid whose first track is sized by a single custom
// property (--split, a percentage), plus a real focusable divider.
//
// Accessibility contract follows the WAI-ARIA APG Window Splitter pattern:
//   repos/aria-practices/content/patterns/windowsplitter/windowsplitter-pattern.html
// and the focusable-separator widget semantics on MDN:
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/separator_role/index.md
//     ("If the separator is focusable … the value of aria-valuenow must be set
//      to a number reflecting the current position … An accessible name, with
//      aria-label should be included if there is more than one focusable
//      separator.")
//
// The contract we implement:
//   - The divider is the focusable widget: role="separator", tabindex="0",
//     aria-valuenow / aria-valuemin / aria-valuemax describing the SIZE of the
//     primary pane (APG: "A window splitter has a value that represents the
//     size of one of the panes … called the primary pane"), aria-orientation
//     reflecting the layout, aria-controls pointing at the primary pane, and an
//     accessible name matching the primary pane (aria-label / aria-labelledby).
//   - aria-valuemin is typically 0 (primary fully collapsed) and aria-valuemax
//     typically 100 (primary at its max), per the APG.
//
// What the platform does NOT give us, and what public/site.js layers on
// (keyed off data-slot="splitter" / the divider's role="separator"):
//   - pointer drag: dragging the divider updates --split + aria-valuenow.
//   - the APG keyboard contract: ArrowLeft/Right (or Up/Down when vertical)
//     resize by `step`; Home → valuemin, End → valuemax; Enter toggles collapse
//     (collapse to valuemin, restore to the previous position).
// The divider element carries data-* hooks (data-min/max/step/orientation and
// data-collapsed) so site.js needs no per-instance config.
//
// Refs:
//   repos/mdn/files/en-us/web/css/grid-template-columns/index.md (grid sizing)
//   repos/mdn/files/en-us/web/css/css_custom_properties (the --split variable)
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-controls/index.md

export type SplitterOrientation = "horizontal" | "vertical"

// The root is a CSS grid. For a horizontal split (panes side by side) the first
// COLUMN is the primary pane, sized to --split%; for a vertical split (panes
// stacked) the first ROW is the primary pane. The middle track is the divider's
// hit area (auto-sized to its own width/height).
const ROOT_CLASS =
  "grid w-full overflow-hidden rounded-md border bg-card " +
  // Horizontal: [primary | divider | secondary] across columns.
  "data-[orientation=horizontal]:h-64 " +
  "data-[orientation=horizontal]:grid-cols-[var(--split,50%)_auto_minmax(0,1fr)] " +
  // Vertical: [primary / divider / secondary] down rows.
  "data-[orientation=vertical]:h-96 " +
  "data-[orientation=vertical]:grid-rows-[var(--split,50%)_auto_minmax(0,1fr)]"

const PANE_CLASS = "min-h-0 min-w-0 overflow-auto p-4 text-sm text-foreground"

// The divider. A focusable separator widget: a thin bar with a grab handle.
// touch-none / select-none keep dragging from scrolling or selecting text.
const DIVIDER_CLASS =
  "group/splitter relative flex shrink-0 touch-none items-center justify-center bg-border outline-none transition-colors select-none " +
  "hover:bg-ring/40 focus-visible:bg-ring/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "data-[orientation=horizontal]:w-1.5 data-[orientation=horizontal]:cursor-col-resize data-[orientation=horizontal]:h-full " +
  "data-[orientation=vertical]:h-1.5 data-[orientation=vertical]:cursor-row-resize data-[orientation=vertical]:w-full"

// The visible grab affordance inside the divider (a short pill).
const HANDLE_CLASS =
  "pointer-events-none rounded-full bg-muted-foreground/40 transition-colors group-hover/splitter:bg-muted-foreground/70 " +
  "group-data-[orientation=horizontal]/splitter:h-6 group-data-[orientation=horizontal]/splitter:w-0.5 " +
  "group-data-[orientation=vertical]/splitter:w-6 group-data-[orientation=vertical]/splitter:h-0.5"

type SplitterProps = PropsWithChildren<{
  // Layout axis. horizontal → panes side by side; vertical → stacked.
  orientation?: SplitterOrientation
  // Content of the two panes.
  primary?: Child
  secondary?: Child
  // Current size of the primary pane, between min and max (percent of root).
  value?: number
  min?: number
  max?: number
  // Resize increment per arrow press (in the same units as value).
  step?: number
  // Accessible name for the divider. APG: the name matches the primary pane.
  // Provide a visible label's id via ariaLabelledby, else a literal ariaLabel.
  ariaLabel?: string
  ariaLabelledby?: string
  // Id given to the primary pane; the divider's aria-controls points at it.
  // Auto-derived from `id` when omitted.
  primaryId?: string
  id?: string
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Splitter(props: SplitterProps) {
  const {
    orientation = "horizontal",
    primary,
    secondary,
    value = 50,
    min = 0,
    max = 100,
    step = 10,
    ariaLabel,
    ariaLabelledby,
    primaryId,
    id,
    class: className,
    children,
    ...rest
  } = props as any

  // Clamp the initial value into [min, max] so --split and aria-valuenow agree.
  const now = Math.min(max, Math.max(min, value))
  const paneId = primaryId ?? (id ? `${id}-primary` : undefined)

  return (
    <div
      id={id}
      data-slot="splitter"
      data-orientation={orientation}
      style={`--split:${now}%`}
      class={cn(ROOT_CLASS, className)}
      {...rest}
    >
      <div data-slot="splitter-panel" data-splitter-panel="primary" id={paneId} class={PANE_CLASS}>
        {primary}
      </div>
      <div
        role="separator"
        tabindex={0}
        data-slot="splitter-handle"
        data-orientation={orientation}
        // Position bookkeeping for site.js (drag + keyboard), so it needs no
        // per-instance wiring. Mirrors aria-valuemin/max/step.
        data-min={min}
        data-max={max}
        data-step={step}
        data-collapsed="false"
        aria-orientation={orientation}
        aria-controls={paneId}
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
        // The value is the SIZE of the primary pane (APG). min/max are the
        // collapsed / fully-expanded positions, typically 0 / 100.
        aria-valuenow={now}
        aria-valuemin={min}
        aria-valuemax={max}
        class={DIVIDER_CLASS}
      >
        <span class={HANDLE_CLASS} aria-hidden="true"></span>
      </div>
      <div data-slot="splitter-panel" data-splitter-panel="secondary" class={PANE_CLASS}>
        {secondary}
        {children}
      </div>
    </div>
  )
}
