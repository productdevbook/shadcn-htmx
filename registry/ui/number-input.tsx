/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Number Input — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui has no dedicated "number input" — it composes one from <Input
// type="number"> + Button (see repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/input.tsx
// for the Input we mirror). We do the same, but lean entirely on the platform.
//
// The control IS a native <input type="number">. Per MDN that element ships:
//   - implicit role="spinbutton"
//   - aria-valuenow / aria-valuemin / aria-valuemax auto-managed from
//     value / min / max — no manual ARIA
//   - the full APG spinbutton keyboard contract built in: ArrowUp increases,
//     ArrowDown decreases, plus standard single-line text editing
//   - stepUp() / stepDown() DOM methods used by the optional +/- buttons
//   See repos/mdn/files/en-us/web/html/reference/elements/input/number/index.md:298,468
//   APG: repos/aria-practices/content/patterns/spinbutton/spinbutton-pattern.html
//
// Because the native input already satisfies the spinbutton pattern, the only
// JS is a 3-line stepUp/stepDown handler for the optional buttons (public/site.js,
// keyed on data-slot="number-input"). With `steppers={false}` it is zero-JS.
//
// We hide the browser's default up/down spinners (they are tiny and inconsistent
// across engines) and supply our own larger, accessible buttons instead — the
// APG quantity-spinbutton example takes the same approach
// (repos/aria-practices/content/patterns/spinbutton/examples/quantity-spinbutton.html).

// Shared <Input> base — kept byte-for-byte in sync with registry/ui/input.tsx
// so a number input looks identical to every other field. We add rules to hide
// the native spinner buttons and reserve right padding when our own steppers
// sit inside the field.
const inputBase =
  "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "selection:bg-primary selection:text-primary-foreground " +
  "placeholder:text-muted-foreground " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "md:text-sm dark:bg-input/30 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "[&.htmx-request]:opacity-70 " +
  // Hide the native up/down spinner — Chromium (-webkit) + Firefox (-moz).
  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"

// Stepper button: square, sized to the 9-unit field height, ghost styling that
// matches the muted/accent palette other controls use.
const stepperBtn =
  "inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors outline-none select-none " +
  "hover:text-foreground hover:bg-accent " +
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:relative focus-visible:z-10 " +
  "disabled:pointer-events-none disabled:opacity-50"

export function numberInputClasses(opts?: { class?: ClassValue }): string {
  return cn(inputBase, opts?.class)
}

type NumberInputProps = {
  id?: string
  name?: string
  value?: number | string
  placeholder?: string
  min?: number | string
  max?: number | string
  step?: number | string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  form?: string
  list?: string
  // Browser autofill hint — supported common attribute on <input type=number>
  // (e.g. "postal-code"). repos/mdn/.../elements/input/number/index.md:300,449
  autocomplete?: string

  // Render the styled −/+ stepper buttons around the field. Defaults to true.
  // When false the component is a bare native spinbutton (zero JS).
  steppers?: boolean

  // Mobile keyboard hint. "decimal" for prices, "numeric" for integers.
  inputmode?: "none" | "numeric" | "decimal"

  // ARIA / labelling. The native input is already role=spinbutton with
  // aria-valuenow/min/max derived from value/min/max.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  ariaRequired?: boolean
  // Human-readable value for screen readers when the raw number isn't friendly
  // (currency/units). APG spinbutton: aria-practices/.../spinbutton-pattern.html:92
  ariaValuetext?: string

  class?: ClassValue

  // htmx v4 passthrough — fires on the input's change event by default. Use
  // hx-trigger to override. See repos/htmx/www/reference.md.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function NumberInput(props: NumberInputProps) {
  const {
    id,
    name,
    value,
    placeholder,
    min,
    max,
    step,
    required,
    disabled,
    readonly,
    autofocus,
    form,
    list,
    autocomplete,
    steppers = true,
    inputmode,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    ariaValuetext,
    class: className,
    ...rest
  } = props

  const field = (
    <input
      type="number"
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      form={form}
      list={list}
      autocomplete={autocomplete}
      inputmode={inputmode}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-valuetext={ariaValuetext}
      aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
      aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
      data-slot={steppers ? "number-input-field" : "number-input"}
      class={cn(inputBase, steppers && "rounded-none border-0 text-center shadow-none focus-visible:ring-0", className)}
      {...(steppers ? {} : rest)}
    />
  )

  if (!steppers) return field

  // Steppers on: a flex shell carries the border + focus ring (focus-within),
  // the bare buttons call stepDown()/stepUp() via public/site.js, and the
  // input keeps its native role=spinbutton + arrow-key contract.
  return (
    <div
      data-slot="number-input"
      data-disabled={disabled ? "true" : undefined}
      class={cn(
        "flex h-9 w-full min-w-0 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
        "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50",
        className,
      )}
      {...rest}
    >
      <button
        type="button"
        data-step="down"
        tabindex={-1}
        disabled={disabled}
        aria-label="Decrease"
        title="Decrease"
        class={cn(stepperBtn, "rounded-l-md border-r border-input")}
      >
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M5 12h14" />
          </svg>
        </span>
      </button>
      {field}
      <button
        type="button"
        data-step="up"
        tabindex={-1}
        disabled={disabled}
        aria-label="Increase"
        title="Increase"
        class={cn(stepperBtn, "rounded-r-md border-l border-input")}
      >
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </span>
      </button>
    </div>
  )
}
