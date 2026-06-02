/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Autosize Textarea — a <textarea> that grows and shrinks to fit its content
// between min/max bounds, delivered by ONE CSS declaration instead of the
// classic scrollHeight JS hack. Source of truth for the platform behaviour:
//   repos/mdn/files/en-us/web/css/reference/properties/field-sizing/index.md
//     - "field-sizing: content overrides the default preferred sizing of form
//        elements … configure text inputs to shrinkwrap their content and grow
//        as more text is entered."
//     - "<textarea> … If unable to grow due to a width constraint, they grow in
//        height to display additional rows … When a height constraint is then
//        reached, they show a scrollbar."
//     - "rows/cols have no effect on <textarea> with field-sizing: content set."
//     - "using min-height and max-height alongside field-sizing: content is
//        quite effective … allow the control to grow and shrink … and prevent
//        the control from becoming too large or too small."
//   repos/mdn/files/en-us/web/html/reference/elements/textarea/index.md
//        (native element, dirname, wrap, readonly/disabled semantics)
//
// Tailwind v4 ships the utility natively — see
//   repos/tailwindcss/packages/tailwindcss/src/utilities.ts
//     staticUtility('field-sizing-content', [['field-sizing','content']])
//     staticUtility('field-sizing-fixed',   [['field-sizing','fixed']])
//
// htmx attrs (hx-post / hx-trigger="input changed delay:…") verified against
//   repos/htmx/www/reference.md (forwarded untouched via {...rest}).
//
// Style analogue: registry/ui/textarea.tsx (shares the base field styling).
//
// DEGRADATION: where field-sizing is unsupported, the rule is simply ignored
// and the element renders as an ordinary fixed-height textarea sized by
// min-height (and rows, which the browser then honours). No JS, no polyfill —
// progressive enhancement, not emulation. Pass autosize={false} to opt out
// explicitly (field-sizing-fixed), turning it into a plain bounded textarea.

// Bounds are expressed as utilities so a single CSS line drives the resize.
// Defaults: grow from ~2 lines up to ~10 lines, then scroll.
const base =
  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "placeholder:text-muted-foreground " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "md:text-sm dark:bg-input/30 " +
  // htmx-request: dim while a request triggered by/targeting this textarea is
  // in flight (e.g. autosave / live-validation).
  "[&.htmx-request]:opacity-70"

// Sizing keyword maps. content => grows with text; fixed => classic textarea
// (resizable handle only). Kept as Record<Union,string> per house style.
const sizing: Record<"content" | "fixed", string> = {
  content: "field-sizing-content resize-none",
  fixed: "field-sizing-fixed resize-y",
}

export function autosizeTextareaClasses(opts?: {
  autosize?: boolean
  minHeight?: ClassValue
  maxHeight?: ClassValue
  class?: ClassValue
}): string {
  const auto = opts?.autosize !== false
  return cn(
    base,
    auto ? sizing.content : sizing.fixed,
    opts?.minHeight ?? "min-h-16",
    // Past the max, field-sizing: content yields a scrollbar (per MDN).
    opts?.maxHeight ?? "max-h-80",
    "overflow-auto",
    opts?.class,
  )
}

type AutosizeTextareaProps = {
  class?: ClassValue
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean

  // Autosize behaviour. true (default) => field-sizing: content; false =>
  // field-sizing: fixed, a plain bounded textarea with a drag handle.
  autosize?: boolean

  // Lower / upper growth bounds, as Tailwind height utilities. These are the
  // RIGHT levers for field-sizing per MDN — not width/height, which would
  // reimpose a fixed size and defeat the feature.
  minHeight?: ClassValue
  maxHeight?: ClassValue

  // rows/cols are honoured ONLY as the no-support fallback size — they have no
  // effect once field-sizing: content applies (MDN). Useful for graceful
  // degradation in older engines.
  rows?: number
  cols?: number

  // Validation
  minLength?: number
  maxLength?: number

  // Mobile UX
  autocomplete?: string
  autofocus?: boolean
  spellcheck?: boolean
  autocapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters"
  autocorrect?: "on" | "off"

  // Submits the text directionality (ltr/rtl) as a separate form field.
  // See repos/mdn/files/en-us/web/html/reference/elements/textarea/index.md
  dirname?: string

  // Wrapping
  wrap?: "hard" | "soft" | "off"

  // ARIA
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  ariaRequired?: boolean

  // Form metadata
  form?: string

  // htmx attributes — fire on blur or hx-trigger="input changed delay:300ms"
  // for live validation / autosave patterns. See repos/htmx/www/reference.md.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-indicator"?: string
  "hx-vals"?: string
  "hx-include"?: string
}

export function AutosizeTextarea(props: AutosizeTextareaProps) {
  const {
    class: className,
    autosize,
    minHeight,
    maxHeight,
    value,
    defaultValue,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    ...rest
  } = props

  return (
    <textarea
      class={autosizeTextareaClasses({ autosize, minHeight, maxHeight, class: className })}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
      aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
      data-slot="autosize-textarea"
      data-autosize={autosize === false ? "false" : "true"}
      {...rest}
    >{value ?? defaultValue}</textarea>
  )
}
