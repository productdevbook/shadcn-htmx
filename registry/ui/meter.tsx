/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Meter — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth:
//   shadcn/ui ships no Meter component. This is a native-platform addition
//   distinct from Progress: a gauge of a value within a known range
//   (battery, disk usage, score) — NOT task completion.
//
// We render the real native <meter> element (implicit role="meter"), so the
// browser supplies the role + value semantics and AT announces the gauge.
//   repos/mdn/files/en-us/web/html/reference/elements/meter/index.md
//     - value/min/max/low/high/optimum attributes (lines 33-48)
//     - "Implicit ARIA role: meter" and "Permitted ARIA roles: No role
//       permitted" (lines 123-134) — so we DO NOT set role/aria-value*; the
//       element maps value/min/max onto aria-valuenow/min/max itself.
//
// APG: WAI-ARIA Meter pattern
//   repos/aria-practices/content/patterns/meter/meter-pattern.html
//     - Keyboard Interaction: "Not applicable" (line 46) — a meter is not
//       interactive; no JS keyboard contract.
//     - Accessible name via aria-labelledby (visible label) or aria-label
//       (lines 61-64). We pair with a native <label for> in the docs.
//     - aria-valuetext for human-readable values, e.g. "50% (6 hours)
//       remaining" (lines 56-59) — surfaced via the `valuetext` prop.
//
// Cross-browser styling note: WebKit/Blink expose ::-webkit-meter-* and
// Gecko exposes ::-moz-meter-bar. Both need `appearance: none` to accept
// custom styles. Those pseudo-elements can't take Tailwind classes, so the
// fill/track theming lives in app/styles/input.css scoped to
// [data-slot="meter"]. Tailwind utilities here only size the box.

const meterBase =
  "block h-2 w-full overflow-hidden rounded-full bg-primary/20 align-middle"

export function meterClasses(opts?: { class?: ClassValue }): string {
  return cn(meterBase, opts?.class)
}

type MeterProps = {
  // Current value. Clamped by the browser to [min, max].
  value: number
  min?: number
  max?: number
  // Lower/upper bounds of the "low" and "high" zones. Combined with optimum
  // they drive the optimum / suboptimum / even-less-good fill color.
  low?: number
  high?: number
  optimum?: number
  id?: string
  // Accessible name — required when there's no linked <label>.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // Human-readable value for AT (e.g. "12.4 GB of 16 GB"). Falls back to the
  // child text content the element already carries.
  valuetext?: string
  // Fallback text content for legacy AT and as the visible value in browsers
  // without <meter> support. Defaults to a "value/max" string.
  children?: Child
  class?: ClassValue

  // htmx — refresh the gauge from the server.
  "hx-get"?: string
  "hx-post"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
}

export function Meter(props: MeterProps) {
  const {
    value,
    min = 0,
    max = 1,
    low,
    high,
    optimum,
    id,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    valuetext,
    children,
    class: className,
    ...rest
  } = props
  const fallback = children ?? `${value} / ${max}`
  return (
    <meter
      id={id}
      data-slot="meter"
      value={value}
      min={min}
      max={max}
      low={low}
      high={high}
      optimum={optimum}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-valuetext={valuetext}
      class={meterClasses({ class: className })}
      {...rest}
    >
      {fallback}
    </meter>
  )
}
