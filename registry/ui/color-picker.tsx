/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Color Picker — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Built on native <input type="color">. The browser owns the entire picker
// UI (a platform color dialog or a validating text field) and guarantees the
// value is a valid CSS color — we never reimplement any of that. shadcn/ui has
// no color-picker; we mirror the Input anatomy
// (repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/input.tsx) and lean on the
// platform exactly like registry/ui/slider.tsx does for <input type=range>.
//
// What the platform gives us, per MDN:
//   - the whole color-selection UI + value validation; an invalid value is
//     coerced and :invalid is applied (we never parse colors ourselves)
//   - `value` is a CSS <color>; default is #000000 when omitted/invalid
//   - `alpha` (boolean) lets the user edit the alpha channel
//   - `colorspace` ("limited-srgb" | "display-p3") hints the picker + gamut
//   - `input` fires continuously as the color changes, `change` on dismiss
//   - supported common attributes: autocomplete, list (a <datalist> of swatches)
//   - it has NO implicit ARIA role, so a visible <label for> or ariaLabel is
//     required for an accessible name
//   See repos/mdn/files/en-us/web/html/reference/elements/input/color/index.md
//       (Value:54, alpha/colorspace:63-69, events:96, common attrs:219,
//        validation:121, Implicit ARIA Role: none:244)
//
// We hide the browser's default swatch chrome via Tailwind v4's pseudo-element
// selectors ([&::-webkit-color-swatch] / [&::-moz-color-swatch]) so the control
// reads as one rounded shadcn swatch — the same -webkit-/-moz- pairing the
// Slider uses for its thumb. Both engines need separate rules.
//
// JS budget: none for the swatch itself (it is a real <input>). The optional
// `showValue` hex readout is synced by a 6-line handler in public/site.js keyed
// on data-slot="color-picker"; with showValue={false} it is zero-JS.

export type ColorSpace = "limited-srgb" | "display-p3"

const swatchBase =
  // The native <input type=color> styled as a single rounded swatch button.
  "size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1 shadow-xs outline-none transition-[color,box-shadow] " +
  "dark:bg-input/30 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "[&.htmx-request]:opacity-70 " +
  // Strip the platform swatch chrome so only our rounded fill shows.
  "[&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0 " +
  "[&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0"

const valueText =
  "font-mono text-sm tabular-nums text-muted-foreground uppercase select-none"

export function colorPickerClasses(opts?: { class?: ClassValue }): string {
  return cn(swatchBase, opts?.class)
}

type ColorPickerProps = {
  id?: string
  name?: string
  // A CSS <color>. Defaults to #000000 if omitted or invalid (per MDN).
  value?: string
  required?: boolean
  disabled?: boolean
  autofocus?: boolean
  form?: string
  // Id of a <datalist> of preset color swatches the browser offers.
  list?: string
  autocomplete?: string

  // Let the user edit the alpha channel (experimental; ignored where unsupported).
  alpha?: boolean
  // Hint the picker's color space + gamut.
  colorspace?: ColorSpace

  // Render the hex value next to the swatch as a live <output>. Defaults to
  // true. With false the component is a bare swatch (zero JS).
  showValue?: boolean

  // ARIA / labelling. <input type=color> has no implicit role, so a visible
  // <label for> or one of these is required for an accessible name.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  ariaRequired?: boolean

  class?: ClassValue

  // htmx v4 passthrough — fires on the input's change event by default (when
  // the picker is dismissed). Use hx-trigger="input" to push every adjustment.
  // See repos/htmx/www/reference.md.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function ColorPicker(props: ColorPickerProps) {
  const {
    id,
    name,
    value = "#000000",
    required,
    disabled,
    autofocus,
    form,
    list,
    autocomplete,
    alpha,
    colorspace,
    showValue = true,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    class: className,
    ...rest
  } = props

  const swatch = (
    <input
      type="color"
      id={id}
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      autofocus={autofocus}
      form={form}
      list={list}
      autocomplete={autocomplete}
      alpha={alpha ? "" : undefined}
      colorspace={colorspace}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
      aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
      data-slot={showValue ? "color-picker-swatch" : "color-picker"}
      class={cn(swatchBase, !showValue && className)}
      {...(showValue ? {} : rest)}
    />
  )

  if (!showValue) return swatch

  // showValue on: a flex shell pairs the native swatch with a live hex
  // <output> that public/site.js mirrors from the input's value (keyed on
  // data-slot="color-picker"). The output is decorative (aria-hidden) — the
  // input is the labelled control and the source of truth for forms + AT.
  return (
    <span
      data-slot="color-picker"
      data-disabled={disabled ? "true" : undefined}
      class={cn("inline-flex items-center gap-2", disabled && "opacity-50", className)}
      {...rest}
    >
      {swatch}
      <output data-slot="color-picker-value" aria-hidden="true" class={valueText}>
        {value}
      </output>
    </span>
  )
}
