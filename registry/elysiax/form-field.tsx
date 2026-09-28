/** @jsxImportSource @kitajs/html */
import type { Children } from "@kitajs/html"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Form Field — shadcn-htmx Elysia flavour (@kitajs/html), htmx v4 + Tailwind v4.
//
// A field-row wrapper that composes a <label>, a single control slot, an
// optional description, and an optional error message — auto-wiring the
// label's `for`, the description/error ids, and the field-level data-invalid
// state. The visual error state is driven by the native `:user-invalid`
// pseudo-class so the field only "turns red" AFTER the user has interacted
// and a submit was attempted — no JS, no premature errors.
//
// Source of truth (shadcn anatomy — FormField / FormItem / FormLabel /
// FormControl / FormDescription / FormMessage):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/form.tsx
// Upstream couples those parts to react-hook-form via React context. We have
// no client form runtime, so instead we lift the wiring to the server: one
// component reads `id`/`invalid`/`description`/`error`, derives the ids, and
// renders label/description/error around the control. Same semantic HTML,
// zero client state.
//
// Control wiring: the hono/jsx flavour clones the control child to inject
// id + aria-describedby + aria-invalid + aria-required. @kitajs/html has no
// cloneElement, so that is replaced by the exported formFieldControlProps()
// helper — spread it onto your control with the SAME `for`/`invalid`/
// `required` values you pass to FormField:
//   <FormField for="email" label="Email" error="Required">
//     <input type="email" {...formFieldControlProps({ id: "email", invalid: true })} />
//   </FormField>
// (FormField still derives and renders the description/error elements and
// their ids from `for`; the helper reproduces the control-side attributes.)
//
// Built on web platform primitives:
//   - <fieldset>/<legend> for grouping multiple controls under one caption.
//     repos/mdn/files/en-us/web/html/reference/elements/fieldset/index.md
//     repos/mdn/files/en-us/web/html/reference/elements/legend/index.md
//   - Constraint Validation + :user-invalid for "show error only after the
//     user tried" styling. :invalid fires before interaction (confusing);
//     :user-invalid fires only after a submit attempt + interaction.
//     repos/mdn/files/en-us/web/css/reference/selectors/_colon_user-invalid/index.md
//     repos/web.dev/src/site/content/en/learn/forms/validation/index.md (#javascript, :user-invalid aside)
//   - aria-describedby to connect the control to its description + error.
//     repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-describedby/index.md
//     repos/web.dev/src/site/content/en/learn/forms/accessibility/index.md ("Help users find the error message")
//
// htmx: the field forwards hx-* untouched, so a server can swap the whole
// field via hx-swap="outerHTML" and flip aria-invalid + inject the error in
// one shot. See repos/htmx/www/reference.md.

// Root row. `grid gap-2` mirrors shadcn FormItem. The `[&:has(:user-invalid)]`
// arbitrary selector lets the label adopt the destructive colour the moment
// the platform marks any descendant control :user-invalid — pure CSS.
const fieldBase =
  "grid gap-2 [&:has(:user-invalid)_[data-slot=form-field-label]]:text-destructive"

const labelBase =
  "flex items-center gap-2 text-sm leading-none font-medium select-none " +
  // Author-driven error state (server sets data-invalid when it knows).
  "data-[invalid=true]:text-destructive " +
  // Dim when the control inside is disabled.
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"

const descriptionBase = "text-sm text-muted-foreground"

// Error text. role="alert" + aria-live="assertive" so a swapped-in error is
// announced; destructive colour pairs with the label turning red. Hidden when
// empty so it doesn't leave a gap.
const errorBase = "text-sm font-medium text-destructive"

const legendBase = "text-sm leading-none font-medium select-none"

export function formFieldClasses(opts?: { class?: ClassValue }): string {
  return cn(fieldBase, opts?.class)
}

// Shared derivation of the description/error ids + describedby token list,
// used by both FormField (rendering) and formFieldControlProps (control-side
// attributes). Keep the logic in one place so the two never drift.
function deriveWiring(opts: {
  id?: string
  hasDescription: boolean
  hasError: boolean
  invalid?: boolean
}) {
  const isInvalid = opts.invalid ?? opts.hasError
  const descriptionId = opts.id && opts.hasDescription ? `${opts.id}-description` : undefined
  const errorId = opts.id && isInvalid && opts.hasError ? `${opts.id}-error` : undefined
  // aria-describedby: description first, then error (announced after the name).
  const describedby = [descriptionId, errorId].filter(Boolean).join(" ") || undefined
  return { isInvalid, descriptionId, errorId, describedby }
}

// Control-side attributes — replaces the hono flavour's cloneElement-based
// injection. Spread the result onto your control element. Pass the same
// values you give FormField (`for` → `id`, plus invalid/required and whether
// a description/error is rendered). Existing attributes on your control win
// if you spread this first and then write your own.
export function formFieldControlProps(opts: {
  // The control's id — same value as FormField's `for`.
  id?: string
  // Whether FormField renders a description for this field.
  hasDescription?: boolean
  // Whether FormField renders an error for this field.
  hasError?: boolean
  // Force the invalid state. Defaults to `true` when hasError is true.
  invalid?: boolean
  required?: boolean
  // Extra describedby ids of your own, merged ahead of the derived ones.
  ariaDescribedby?: string
}): Record<string, string | undefined> {
  const { describedby, isInvalid } = deriveWiring({
    id: opts.id,
    hasDescription: opts.hasDescription ?? false,
    hasError: opts.hasError ?? false,
    invalid: opts.invalid,
  })
  return {
    id: opts.id,
    "aria-describedby": cn(opts.ariaDescribedby, describedby) || undefined,
    "aria-invalid": isInvalid ? "true" : undefined,
    "aria-required": opts.required ? "true" : undefined,
  }
}

type FormFieldProps = {
  // The single control (an <Input>, <Textarea>, <Select>, …). Rendered as-is
  // — annotate it yourself with formFieldControlProps() (see header comment).
  children?: Children
  // Visible label text. Omit to render no label (e.g. control is self-labelled).
  label?: Children
  // The control's id. The label points at it via `for`, and the description /
  // error ids are derived from it (`${id}-description`, `${id}-error`).
  // Authored as the natural HTML attribute name `for`; `htmlFor` is accepted
  // as an alias for ergonomics.
  for?: string
  htmlFor?: string
  // Helper text under the label.
  description?: Children
  // Error message. When set (and `invalid` is not explicitly false) the field
  // is marked aria-invalid and the message is announced.
  error?: Children
  // Force the invalid state. Defaults to `true` when `error` is provided.
  invalid?: boolean
  // Marks the label with a required indicator and is forwarded as data-required.
  required?: boolean
  class?: ClassValue
  labelClass?: ClassValue
  // htmx + data-* + aria-* ride along onto the root.
  [key: string]: unknown
}

export function FormField(props: FormFieldProps) {
  const {
    children,
    label,
    for: forProp,
    htmlFor: htmlForProp,
    description,
    error,
    invalid,
    required,
    class: className,
    labelClass,
    ...rest
  } = props

  // Accept the natural HTML attribute `for` (how the docs/routes author it),
  // falling back to the `htmlFor` alias. Without this the id would leak onto
  // the root div via {...rest} and the label/aria wiring would never derive.
  const htmlFor = forProp ?? htmlForProp

  const { isInvalid, descriptionId, errorId } = deriveWiring({
    id: htmlFor,
    hasDescription: description != null,
    hasError: error != null && error !== false,
    invalid,
  })

  return (
    <div
      class={formFieldClasses({ class: className })}
      data-slot="form-field"
      data-invalid={isInvalid ? "true" : undefined}
      {...rest}
    >
      {label != null && (
        <label
          for={htmlFor}
          class={cn(labelBase, labelClass)}
          data-slot="form-field-label"
          data-invalid={isInvalid ? "true" : undefined}
          data-required={required ? "true" : undefined}
        >
          {label}
          {required && (
            <span class="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {description != null && (
        <p id={descriptionId} class={descriptionBase} data-slot="form-field-description">
          {description}
        </p>
      )}
      {isInvalid && error != null && (
        <p
          id={errorId}
          role="alert"
          aria-live="assertive"
          class={errorBase}
          data-slot="form-field-error"
        >
          {error}
        </p>
      )}
    </div>
  )
}

type FormFieldsetProps = {
  children?: Children
  // The <legend> caption for the group.
  legend?: Children
  description?: Children
  error?: Children
  invalid?: boolean
  // Disables every control inside the group natively (fieldset[disabled]).
  disabled?: boolean
  required?: boolean
  // id of the description/error so callers can point group controls at it.
  id?: string
  class?: ClassValue
  legendClass?: ClassValue
  [key: string]: unknown
}

// Fieldset variant — for grouping multiple controls (radios, checkboxes,
// related inputs) under one caption. The <legend> names the group for AT, and
// `disabled` on the <fieldset> disables every descendant control in one go.
//   repos/mdn/files/en-us/web/html/reference/elements/fieldset/index.md
export function FormFieldset(props: FormFieldsetProps) {
  const {
    children,
    legend,
    description,
    error,
    invalid,
    disabled,
    required,
    id,
    class: className,
    legendClass,
    ...rest
  } = props

  const { isInvalid, descriptionId, errorId, describedby } = deriveWiring({
    id,
    hasDescription: description != null,
    hasError: error != null && error !== false,
    invalid,
  })

  return (
    <fieldset
      class={cn(fieldBase, "min-w-0 border-0 p-0", className)}
      data-slot="form-field"
      data-invalid={isInvalid ? "true" : undefined}
      disabled={disabled || undefined}
      aria-describedby={describedby}
      aria-invalid={isInvalid ? "true" : undefined}
      aria-required={required ? "true" : undefined}
      {...rest}
    >
      {legend != null && (
        <legend
          class={cn(legendBase, "float-none mb-1 data-[invalid=true]:text-destructive", legendClass)}
          data-slot="form-field-legend"
          data-invalid={isInvalid ? "true" : undefined}
          data-required={required ? "true" : undefined}
        >
          {legend}
          {required && (
            <span class="text-destructive" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </legend>
      )}
      {children}
      {description != null && (
        <p id={descriptionId} class={descriptionBase} data-slot="form-field-description">
          {description}
        </p>
      )}
      {isInvalid && error != null && (
        <p
          id={errorId}
          role="alert"
          aria-live="assertive"
          class={errorBase}
          data-slot="form-field-error"
        >
          {error}
        </p>
      )}
    </fieldset>
  )
}
