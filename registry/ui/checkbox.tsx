/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Native <input type="checkbox"> with shadcn polish. Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/checkbox.tsx
//
// The upstream shadcn uses Radix Checkbox, which renders a styled div with
// role="checkbox" and hides the native input. We can't depend on Radix in
// our SSR setup, so we keep a real <input type="checkbox"> (form-submittable,
// keyboard-accessible, accessible-name aware) and layer a check icon on top.
//
// Pairing with a Label: use the htmlFor pattern — clicking the label toggles
// the checkbox. Indeterminate state must be set via JS (the HTML attribute
// alone won't do it); we mirror the data-state attribute on the wrapper so
// custom styling can react.

const inputBase =
  "peer size-4 shrink-0 appearance-none rounded-[4px] border border-input bg-background shadow-xs transition-shadow outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "checked:border-primary checked:bg-primary " +
  "indeterminate:border-primary indeterminate:bg-primary " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "dark:bg-input/30"

export function checkboxClasses(opts?: { class?: ClassValue }): string {
  return cn(inputBase, opts?.class)
}

type CheckboxProps = {
  id?: string
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  // Render the SSR hook for an initially-indeterminate checkbox. `indeterminate`
  // is an IDL-only property with no HTML content attribute (WHATWG HTML: it is
  // initially false and "cannot be set using an HTML attribute"), so an SSR
  // component emits data-initial-indeterminate="true" and a tiny on-mount
  // script flips el.indeterminate. See repos/whatwg-html/source (indeterminate
  // IDL attribute) and the input/checkbox MDN reference.
  indeterminate?: boolean
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  form?: string
  class?: ClassValue
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean
  // ID of a visible element containing an error message. Pair with
  // ariaInvalid for the full WCAG error-identification pattern.
  // See repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-errormessage/index.md
  ariaErrormessage?: string
  // ARIA flag for non-editable checkboxes. Unlike HTML readonly (not valid
  // on checkbox), aria-readonly keeps the element focusable + announces it
  // as read-only. Use when you want the user to land on the box and hear
  // *why* it's locked. See repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-readonly/index.md
  ariaReadonly?: boolean
  // Tri-state semantic. The DOM property `indeterminate` controls the
  // visual ::indeterminate pseudo (we set it from JS in docs); this prop
  // surfaces the same to assistive tech via aria-checked="mixed".
  // See repos/mdn/files/en-us/web/accessibility/aria/reference/roles/checkbox_role/index.md:30,66-67
  ariaChecked?: boolean | "mixed"
  // If this checkbox toggles visibility/state of other UI, point at the
  // controlled element's id.
  ariaControls?: string

  // htmx — fire on the input's change event. Useful for "save on toggle"
  // patterns where the server records the new state and may return updated
  // UI (e.g. a row swap).
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-vals"?: string
  "hx-include"?: string
}

export function Checkbox(props: CheckboxProps) {
  const {
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaErrormessage,
    ariaReadonly,
    ariaChecked,
    ariaControls,
    checked,
    defaultChecked,
    indeterminate,
    ...rest
  } = props

  return (
    <span class="relative inline-flex size-4 shrink-0 align-middle">
      <input
        type="checkbox"
        class={checkboxClasses({ class: className })}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
        aria-errormessage={ariaErrormessage}
        aria-readonly={ariaReadonly === undefined ? undefined : String(ariaReadonly)}
        aria-checked={ariaChecked === undefined ? undefined : String(ariaChecked)}
        aria-controls={ariaControls}
        data-slot="checkbox"
        // Hono JSX does not map defaultChecked -> checked like React. Resolve it
        // here so the prop is real: explicit `checked` wins, then `defaultChecked`,
        // and `false` serializes to no attribute (never an invalid defaultChecked="...").
        checked={(checked ?? defaultChecked) || undefined}
        // indeterminate has no HTML content attribute; emit the on-mount hook
        // a script reads to set el.indeterminate. See repos/whatwg-html/source.
        data-initial-indeterminate={indeterminate ? "true" : undefined}
        {...rest}
      />
      {/* Check icon — visible only when peer (the input) is :checked. */}
      <svg
        class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-checked:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {/* Dash icon for the :indeterminate state. */}
      <svg
        class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-indeterminate:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
  )
}
