/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"
import { buttonClasses } from "@/registry/ui/button"
import { inputClasses } from "@/registry/ui/input"
import { labelClasses } from "@/registry/ui/label"

// Edit In Place — shadcn-htmx, htmx v4 + Tailwind v4.
//
// The canonical htmx editable record: a read-only view with an "Edit"
// affordance that swaps in a pre-filled form. Save = PUT; Cancel re-GETs
// the view. No modal, no custom JS — the whole thing rides on outerHTML
// swaps over REST.
//
// Built on:
//   repos/htmx/www/src/content/patterns/03-records/04-edit-in-place.md
//     (GET /users/1 → view, GET /users/1/edit → form, PUT /users/1 → view)
//   repos/htmx/www/src/content/reference/01-attributes/08-hx-target.md:12-17
//     hx-target="this" targets the element making the request.
//   repos/htmx/www/src/content/reference/01-attributes/07-hx-swap.md:35-41
//     hx-swap="outerHTML" replaces the whole element with the response.
//   repos/htmx/www/src/content/reference/01-attributes/03-hx-put.md
//     hx-put issues the REST PUT on Save.
//
// Native semantics:
//   - The view is a <dl> description list — the right element for
//     name/value record pairs.
//     repos/mdn/files/en-us/web/html/reference/elements/dl/index.md
//   - The edit affordance is a real <button> and the editor is a real
//     <form> with native <input>s, so constraint validation, Enter-to-
//     submit, and focus all come from the platform.
//     repos/mdn/files/en-us/web/html/reference/elements/form/index.md
//
// Class strings mirror Card (rounded bordered container) + Input + Button,
// so the view and the editor occupy the same visual footprint and the swap
// looks like an in-place toggle rather than a layout jump.
//
// Style analogues: registry/ui/card.tsx, registry/ui/input.tsx,
// registry/ui/button.tsx, registry/ui/label.tsx.

// Shared container so the read-only view and the editor render at the same
// size — the outerHTML swap then reads as a true in-place toggle.
const container =
  "flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm"

// One field's label, styled as the small uppercase eyebrow shadcn uses for
// record metadata.
const fieldTermClass =
  "text-xs font-medium tracking-wide text-muted-foreground uppercase"

const fieldValueClass = "mt-0.5 text-sm font-medium text-foreground"

export type EditInPlaceField = {
  // Visible label for the field, e.g. "Email".
  label: string
  // The current, read-only value shown in the view.
  value: Child
  // Form field name used by the editor's <input name>. Defaults to a
  // lowercased label, but pass it explicitly for anything non-trivial.
  name?: string
  // Input type for the editor (text, email, url, tel, …). Default "text".
  type?: string
  // Raw value passed to the editor's <input value>. Falls back to `value`
  // when that is a plain string.
  inputValue?: string
  required?: boolean
}

// ── View ────────────────────────────────────────────────────────────────
// The read-only record. Carries hx-target="this" + hx-swap="outerHTML" so
// any descendant request (the Edit button, and later the editor's Save /
// Cancel) replaces this whole element. `editHref` is the GET that returns
// the editor fragment.

type EditInPlaceProps = PropsWithChildren<{
  // GET endpoint that returns the editor form fragment.
  editHref: string
  // Fields rendered as a <dl>. Omit when you pass custom children instead.
  fields?: EditInPlaceField[]
  // Label on the Edit button. Default "Edit".
  editLabel?: string
  id?: string
  class?: ClassValue
}> &
  Record<string, any>

export function EditInPlace(props: EditInPlaceProps) {
  const {
    children,
    editHref,
    fields,
    editLabel = "Edit",
    class: className,
    id,
    ...rest
  } = props

  return (
    <div
      data-slot="edit-in-place"
      data-mode="view"
      id={id}
      hx-target="this"
      hx-swap="outerHTML"
      class={cn(container, className)}
      {...rest}
    >
      {fields ? (
        <dl class="flex flex-col gap-3" data-slot="edit-in-place-fields">
          {fields.map((f) => (
            <div>
              <dt class={fieldTermClass}>{f.label}</dt>
              <dd class={fieldValueClass}>{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        children
      )}
      <div class="flex">
        <button
          type="button"
          data-slot="edit-in-place-edit"
          hx-get={editHref}
          hx-target="closest [data-slot='edit-in-place']"
          hx-swap="outerHTML"
          class={buttonClasses({ variant: "outline", size: "sm" })}
        >
          {editLabel}
        </button>
      </div>
    </div>
  )
}

// ── Editor ──────────────────────────────────────────────────────────────
// The pre-filled form returned by `editHref`. Submitting issues the PUT
// (Save); Cancel re-GETs the view. Both target `this` form and swap
// outerHTML, restoring the view in place.

type EditInPlaceFormProps = PropsWithChildren<{
  // PUT endpoint hit on Save.
  putHref: string
  // GET endpoint that restores the read-only view on Cancel.
  cancelHref: string
  // Fields to pre-fill. Omit when you pass custom children instead.
  fields?: EditInPlaceField[]
  saveLabel?: string
  cancelLabel?: string
  id?: string
  class?: ClassValue
}> &
  Record<string, any>

export function EditInPlaceForm(props: EditInPlaceFormProps) {
  const {
    children,
    putHref,
    cancelHref,
    fields,
    saveLabel = "Save",
    cancelLabel = "Cancel",
    class: className,
    id,
    ...rest
  } = props

  return (
    <form
      data-slot="edit-in-place"
      data-mode="edit"
      id={id}
      hx-put={putHref}
      hx-target="this"
      hx-swap="outerHTML"
      class={cn(container, className)}
      {...rest}
    >
      {fields ? (
        <div class="flex flex-col gap-3" data-slot="edit-in-place-fields">
          {fields.map((f) => {
            const name = f.name ?? f.label.toLowerCase()
            const fieldId = `${id ?? "field"}-${name}`
            const value =
              f.inputValue ?? (typeof f.value === "string" ? f.value : undefined)
            return (
              <div class="grid gap-1.5">
                <label for={fieldId} class={labelClasses({ class: fieldTermClass })}>
                  {f.label}
                </label>
                <input
                  id={fieldId}
                  name={name}
                  type={f.type ?? "text"}
                  value={value}
                  required={f.required}
                  data-slot="input"
                  class={inputClasses()}
                />
              </div>
            )
          })}
        </div>
      ) : (
        children
      )}
      <div class="flex gap-2">
        <button
          type="submit"
          data-slot="edit-in-place-save"
          class={buttonClasses({ size: "sm" })}
        >
          {saveLabel}
        </button>
        <button
          type="button"
          data-slot="edit-in-place-cancel"
          hx-get={cancelHref}
          hx-target="closest [data-slot='edit-in-place']"
          hx-swap="outerHTML"
          class={buttonClasses({ variant: "secondary", size: "sm" })}
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  )
}
