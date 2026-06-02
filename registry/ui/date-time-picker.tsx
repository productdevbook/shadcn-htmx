/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Date Time Picker — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A family of native temporal fields. The control IS a real
// <input type="date|time|datetime-local|month|week"> — there is no JS calendar
// library and no userland popup. The browser ships the picker UI, the keyboard
// editing of each segment, locale-aware display, and constraint validation; we
// only restyle to match the rest of the form controls.
//
// Per MDN every variant normalises its submitted value to a fixed,
// machine-readable, locale-independent format regardless of how it is shown:
//   - date            → "yyyy-mm-dd"            step is days  (default 1)
//   - time            → "HH:mm" / "HH:mm:ss"    step is seconds (default 60);
//                        min/max have a *periodic domain* (may cross midnight)
//   - datetime-local  → "yyyy-mm-ddTHH:mm"      (a local date + time, no zone)
//   - month           → "YYYY-MM"
//   - week            → "yyyy-Www"              (ISO 8601 week number)
//
// Sources read for this component:
//   repos/mdn/files/en-us/web/html/reference/elements/input/date/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/input/time/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/input/datetime-local/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/input/month/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/input/week/index.md
//   htmx attrs verified against repos/htmx/www/reference.md
// Style analogue: registry/ui/input.tsx (same base + tokens, kept in sync).

export type DateTimeType = "date" | "time" | "datetime-local" | "month" | "week"

// Shared <Input> base — kept byte-for-byte in sync with registry/ui/input.tsx
// so a temporal field looks identical to every other control. We append rules
// to tame the engine-specific picker affordances:
//   - the calendar/clock indicator inherits the foreground colour and shows a
//     pointer cursor (it is the only chrome the browser exposes to CSS);
//   - the inner spin/edit fields drop their padding so the value sits flush.
const base =
  "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "selection:bg-primary selection:text-primary-foreground " +
  "placeholder:text-muted-foreground " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "md:text-sm dark:bg-input/30 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  // htmx-request: dim while a request triggered by this field is in flight.
  "[&.htmx-request]:opacity-70 " +
  // Style the native calendar/clock picker indicator (Chromium only exposes
  // this pseudo-element). Tint it to the foreground + show it is clickable.
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:invert " +
  "[&::-webkit-datetime-edit]:px-0 [&::-webkit-datetime-edit-fields-wrapper]:px-0"

export function dateTimePickerClasses(opts?: { class?: ClassValue }): string {
  return cn(base, opts?.class)
}

type DateTimePickerProps = {
  // Which native temporal control to render. Drives the picker UI, the value
  // format and the meaning of min/max/step.
  type?: DateTimeType

  id?: string
  name?: string
  // Initial value, in the variant's normalised format (e.g. "2026-06-02").
  value?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  form?: string
  // Id of a <datalist> of suggested values.
  list?: string

  // Temporal constraints, enforced natively by the browser. Each must be a
  // string in the same normalised format as the value (e.g. min="09:00").
  min?: string
  max?: string
  // Granularity. date: days (default 1); time/datetime-local: seconds
  // (default 60 → minutes, "1" → seconds); month: months; week: weeks.
  // "any" removes stepping.
  step?: number | string

  // ARIA / labelling. A native input already exposes its value to AT; pair it
  // with a <label for> or supply an accessible name here.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  ariaRequired?: boolean

  class?: ClassValue

  // htmx v4 passthrough — fires on the input's native change event by default
  // (the picker dispatches it on selection). Use hx-trigger to override.
  // See repos/htmx/www/reference.md.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}

export function DateTimePicker(props: DateTimePickerProps) {
  const {
    type = "date",
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    ...rest
  } = props

  return (
    <input
      type={type}
      class={dateTimePickerClasses({ class: className })}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
      aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
      data-slot="date-time-picker"
      {...rest}
    />
  )
}
