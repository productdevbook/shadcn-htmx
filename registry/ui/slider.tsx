/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Slider — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Built on native <input type="range">. The platform gives us:
//   - role="slider" implicit
//   - aria-valuemin / aria-valuemax / aria-valuenow auto-managed from
//     the min/max/value attributes — no manual ARIA needed
//   - Arrow keys, Home/End, PageUp/Down keyboard contract
//   - Focus ring, disabled state
//
// We restyle the track + thumb via Tailwind v4's [&::-webkit-slider-thumb]
// and [&::-moz-range-thumb] selectors (cross-browser). Both Chromium
// (-webkit-) and Firefox (-moz-) need separate rules.
//
// Refs:
//   repos/mdn/files/en-us/web/html/reference/elements/input/range/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/slider_role/

type SliderProps = {
  id?: string
  name?: string
  value?: number
  min?: number
  max?: number
  // step="any" means no stepping — any value is allowed (barring min/max),
  // giving a continuous range. See MDN input/range "Setting step to any".
  step?: number | "any"
  disabled?: boolean
  required?: boolean
  // The full <input> form-attr family.
  form?: string
  list?: string
  // ARIA / labelling.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // Tooltip-ish announcement for AT — e.g. "$24 / month" instead of "24".
  ariaValuetext?: string
  class?: ClassValue
  // htmx passthrough (e.g. push the new value to the server on change).
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function Slider(props: SliderProps) {
  const {
    id,
    name,
    value,
    min = 0,
    max = 100,
    step,
    disabled,
    required,
    form,
    list,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaValuetext,
    class: className,
    ...rest
  } = props
  return (
    <span
      data-slot="slider"
      data-disabled={disabled ? "true" : undefined}
      class={cn(
        "relative flex w-full touch-none items-center select-none",
        disabled && "opacity-50",
        className,
      )}
    >
      <input
        type="range"
        id={id}
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        form={form}
        list={list}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-valuetext={ariaValuetext}
        class={cn(
          // Hide the default platform appearance so we can style the
          // track + thumb ourselves.
          "h-2 w-full cursor-pointer appearance-none bg-transparent outline-none",
          "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted",
          "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted",
          // Thumb: round, sized, bordered. -webkit needs margin-top to
          // recentre on the track; -moz centers automatically.
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
          // Focus ring on the thumb when keyboard-focused.
          "focus-visible:[&::-webkit-slider-thumb]:ring-[3px] focus-visible:[&::-webkit-slider-thumb]:ring-ring/50",
          "focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-ring)_50%,transparent)]",
          // Disabled
          "disabled:cursor-not-allowed",
        )}
        {...rest}
      />
    </span>
  )
}
