/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cloneElement, isValidElement } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Form Field — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A field-row wrapper that composes a <label>, a single control slot, an
// optional description, and an optional error message — auto-wiring the
// label's `for`, the control's `aria-describedby` (description + error ids),
// and `aria-invalid`. The visual error state is driven by the native
// `:user-invalid` pseudo-class so the field only "turns red" AFTER the user
// has interacted and a submit was attempted — no JS, no premature errors.
//
// Source of truth (shadcn anatomy — FormField / FormItem / FormLabel /
// FormControl / FormDescription / FormMessage):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/form.tsx
// Upstream couples those parts to react-hook-form via React context. We have
// no client form runtime, so instead we lift the wiring to the server: one
// component reads `id`/`invalid`/`description`/`error`, derives the ids, and
// clones them onto the control child. Same semantic HTML, zero client state.
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

type FormFieldProps = {
  // The single control to wire up (an <Input>, <Textarea>, <Select>, …).
  // We clone it to inject id + aria-describedby + aria-invalid.
  children?: Child
  // Visible label text. Omit to render no label (e.g. control is self-labelled).
  label?: Child
  // The control's id. The label points at it via `for`, and the description /
  // error ids are derived from it (`${id}-description`, `${id}-error`).
  // Authored as the natural HTML attribute name `for`; `htmlFor` is accepted
  // as an alias for ergonomics.
  for?: string
  htmlFor?: string
  // Helper text under the label.
  description?: Child
  // Error message. When set (and `invalid` is not explicitly false) the field
  // is marked aria-invalid and the message is announced.
  error?: Child
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

  const isInvalid = invalid ?? (error != null && error !== false)
  const descriptionId = htmlFor && description != null ? `${htmlFor}-description` : undefined
  const errorId = htmlFor && isInvalid && error != null ? `${htmlFor}-error` : undefined
  // aria-describedby: description first, then error (announced after the name).
  const describedby = [descriptionId, errorId].filter(Boolean).join(" ") || undefined

  // Clone the control child to inject the wiring. Mirrors the asChild pattern
  // in registry/ui/button.tsx (hono/jsx cloneElement + isValidElement).
  let control: Child = children
  if (isValidElement(children)) {
    const child = children as any
    control = cloneElement(child, {
      id: child?.props?.id ?? htmlFor,
      "aria-describedby": cn(child?.props?.["aria-describedby"], describedby) || undefined,
      "aria-invalid": isInvalid ? "true" : child?.props?.["aria-invalid"],
      "aria-required": required ? "true" : child?.props?.["aria-required"],
    })
  }

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
      {control}
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
  children?: Child
  // The <legend> caption for the group.
  legend?: Child
  description?: Child
  error?: Child
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

  const isInvalid = invalid ?? (error != null && error !== false)
  const descriptionId = id && description != null ? `${id}-description` : undefined
  const errorId = id && isInvalid && error != null ? `${id}-error` : undefined
  const describedby = [descriptionId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <fieldset
      class={cn(fieldBase, "min-w-0 border-0 p-0", className)}
      data-slot="form-field"
      data-invalid={isInvalid ? "true" : undefined}
      disabled={disabled}
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
