/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Range Slider (two-thumb) — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn-ui ships a multi-thumb slider built on Radix's <Slider> with N
// <SliderThumb> children, each a div with role="slider" and hand-rolled
// pointer/keyboard handling. We do NOT copy that. Instead we stack TWO real
// <input type="range"> on a single track. The platform then gives us, per
// thumb, for free:
//   - role="slider" (implicit on type=range)
//   - aria-valuemin / aria-valuemax / aria-valuenow auto-managed from
//     each input's min/max/value — no manual ARIA bookkeeping
//   - the full APG slider keyboard contract: Arrow keys, Home/End,
//     PageUp/PageDown — see the (Multi-Thumb) Slider Pattern, which says
//     "Each thumb is in the page tab sequence and has the keyboard
//     interactions described in the Slider Pattern."
//   - focus ring + disabled handling
// Each input is form-submittable (name=min / name=max).
//
// What the platform does NOT give us, and what public/site.js layers on
// (keyed off data-slot="range-slider"):
//   - thumbs must not cross. The APG (Multi-Thumb) pattern: "the maximum
//     value of the thumb that sets the lower end of the range is limited
//     by the current value of the thumb that sets the upper end". Native
//     range inputs don't know about each other, so on `input` we clamp.
//   - the coloured fill BETWEEN the thumbs. We publish --range-min /
//     --range-max as percentages on the root; a pseudo-track div paints
//     the segment between them.
//
// We reuse Slider's exact track/thumb Tailwind so the two look identical.
// Both Chromium (-webkit-) and Firefox (-moz-) need separate thumb rules.
//
// Refs:
//   repos/aria-practices/content/patterns/slider-multithumb/slider-multithumb-pattern.html
//   repos/aria-practices/content/patterns/slider-multithumb/examples/slider-multithumb.html
//   repos/mdn/files/en-us/web/html/reference/elements/input/range/index.md
//   (note: `required`/`readonly` are ignored on type=range per MDN, so we omit them)

const ROOT_CLASS =
  "relative flex h-4 w-full touch-none items-center select-none"

const TRACK_CLASS =
  "pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted"

// The active segment between the two thumbs. site.js sets --range-min /
// --range-max (percentages) on the root; we read them here.
const FILL_CLASS =
  "pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary [left:var(--range-min,0%)] [right:calc(100%-var(--range-max,100%))]"

// Each native <input type="range">. Stacked on the same track; transparent
// track so only the thumb shows. pointer-events:none on the bar but auto on
// the thumb so both thumbs stay grabbable even where they overlap.
const INPUT_CLASS = cn(
  "pointer-events-none absolute inset-x-0 top-1/2 m-0 h-4 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none",
  "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
  "focus-visible:[&::-webkit-slider-thumb]:ring-[3px] focus-visible:[&::-webkit-slider-thumb]:ring-ring/50",
  "focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-ring)_50%,transparent)]",
  "disabled:cursor-not-allowed",
)

type RangeSliderProps = {
  id?: string
  // Form field names for the two ends. Each input submits independently.
  minName?: string
  maxName?: string
  // Current values of the lower / upper thumbs.
  minValue?: number
  maxValue?: number
  // Track bounds + step (shared by both thumbs).
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  form?: string
  // ARIA / labelling. Each thumb needs its own accessible name (APG: a
  // multi-thumb slider's thumbs are distinct controls — "Minimum" / "Maximum").
  minLabel?: string
  maxLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // Human-readable values for AT, e.g. "$120" instead of "120".
  minValuetext?: string
  maxValuetext?: string
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function RangeSlider(props: RangeSliderProps) {
  const {
    id,
    minName = "min",
    maxName = "max",
    minValue,
    maxValue,
    min = 0,
    max = 100,
    step,
    disabled,
    form,
    minLabel = "Minimum",
    maxLabel = "Maximum",
    ariaLabelledby,
    ariaDescribedby,
    minValuetext,
    maxValuetext,
    class: className,
    ...rest
  } = props

  const lo = minValue ?? min
  const hi = maxValue ?? max
  const span = max - min || 1
  // Initial fill (site.js keeps it in sync after interaction).
  const minPct = `${((lo - min) / span) * 100}%`
  const maxPct = `${((hi - min) / span) * 100}%`

  return (
    <span
      data-slot="range-slider"
      data-disabled={disabled ? "true" : undefined}
      style={`--range-min:${minPct};--range-max:${maxPct}`}
      class={cn(ROOT_CLASS, disabled && "opacity-50", className)}
      {...rest}
    >
      <span class={TRACK_CLASS} aria-hidden="true"></span>
      <span class={FILL_CLASS} aria-hidden="true"></span>
      <input
        type="range"
        data-range="min"
        id={id ? `${id}-min` : undefined}
        name={minName}
        value={lo}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        form={form}
        aria-label={ariaLabelledby ? undefined : minLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-valuetext={minValuetext}
        class={INPUT_CLASS}
      />
      <input
        type="range"
        data-range="max"
        id={id ? `${id}-max` : undefined}
        name={maxName}
        value={hi}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        form={form}
        aria-label={ariaLabelledby ? undefined : maxLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-valuetext={maxValuetext}
        class={INPUT_CLASS}
      />
    </span>
  )
}
