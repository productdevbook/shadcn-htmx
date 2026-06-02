/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Combobox — shadcn-htmx, htmx v4 + Tailwind v4.
//
// **Native-first.** This component is just `<input list>` + `<datalist>`.
// The browser handles:
//   - The dropdown UI
//   - Filtering as the user types
//   - Click + keyboard selection
//   - Focus management
//   - aria-controls / aria-expanded wiring (implicit)
//
// No custom JS event handlers, no MutationObserver, no race conditions.
// If you need server-driven suggestions, point htmx at the <datalist> and
// have the server return `<option>` tags — the browser uses them
// transparently.
//
// Refs:
//   repos/mdn/files/en-us/web/html/reference/elements/datalist/index.md
//   repos/mdn/files/en-us/web/html/reference/elements/input/index.md#list
//   repos/aria-practices/content/patterns/combobox/

// `disabled` marks an option non-checkable (browsers grey it out, it gets
// no click/focus events).
// repos/mdn/files/en-us/web/html/reference/elements/option/index.md:45
export type ComboboxOption = { value: string; label?: string; disabled?: boolean }

type ComboboxProps = {
  // The input's id. The <datalist> gets `${id}-list`; if you wire htmx
  // to fetch options dynamically, target that id.
  id: string
  name?: string
  // Initial options. Server-filtered comboboxes can pass [] and let
  // htmx populate the datalist on input.
  options?: ComboboxOption[]
  // `list` is valid on these 13 input types, not just text — a url/email/
  // search combobox, or a number/date/time/range/color picker with suggested
  // values, are all native datalist use cases.
  // repos/mdn/files/en-us/web/html/reference/elements/input/index.md:492
  type?:
    | "text"
    | "search"
    | "url"
    | "tel"
    | "email"
    | "number"
    | "date"
    | "datetime-local"
    | "month"
    | "week"
    | "time"
    | "range"
    | "color"
  placeholder?: string
  value?: string
  required?: boolean
  disabled?: boolean
  // The user can type any value that passes validation, even one not in the
  // suggestion list, so constrain the free-typed value with these.
  // repos/mdn/files/en-us/web/html/reference/elements/input/index.md:505
  maxlength?: number
  minlength?: number
  pattern?: string
  // Explains the pattern to AT / on validation failure (spec accessibility note).
  title?: string
  // Focusable + copy-selectable but not editable. Not supported on range/color.
  // repos/mdn/files/en-us/web/html/reference/elements/input/index.md:588
  readonly?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  class?: ClassValue
  // htmx attrs ride onto the input element. Typical server-filter setup:
  //   hx-get="/api/search"
  //   hx-trigger="input changed delay:200ms"
  //   hx-target="#<id>-list"       (points at the datalist)
  //   hx-swap="innerHTML"
  [key: `hx-${string}`]: any
}

export function Combobox(props: ComboboxProps) {
  const {
    id,
    name,
    options = [],
    type = "text",
    placeholder,
    value,
    required,
    disabled,
    maxlength,
    minlength,
    pattern,
    title,
    readonly,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    class: className,
    ...rest
  } = props
  const listId = `${id}-list`
  return (
    <span data-slot="combobox" class={cn("inline-block w-full", className)}>
      <input
        type={type}
        id={id}
        name={name}
        list={listId}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxlength={maxlength}
        minlength={minlength}
        pattern={pattern}
        title={title}
        readonly={readonly}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        // autocomplete="off" stops the browser from layering its own
        // history-based suggestions on top of the datalist.
        autocomplete="off"
        class="flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {...rest}
      />
      <datalist id={listId} data-slot="combobox-list">
        {options.map((o) => (
          <option value={o.value} label={o.label} disabled={o.disabled} />
        ))}
      </datalist>
    </span>
  )
}

// Server-rendered single option used by htmx endpoints. Lets the server
// return a typed component instead of raw HTML strings.
export function ComboboxOption(props: ComboboxOption) {
  return <option value={props.value} label={props.label} disabled={props.disabled} />
}

// Back-compat shim: the previous API exposed ComboboxNative for the
// static-options use case and Combobox for the custom richer one. We
// collapsed both into a single native Combobox; export the old name as
// an alias so existing import sites don't break.
export const ComboboxNative = Combobox

// Back-compat: ComboboxItem used to be the rich custom variant's option
// renderer. With native datalist, the right primitive is a plain
// <option> — exported via ComboboxOption above. Keeping the alias so
// existing consumers don't break.
export const ComboboxItem = ComboboxOption
