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

export type ComboboxOption = { value: string; label?: string }

type ComboboxProps = {
  // The input's id. The <datalist> gets `${id}-list`; if you wire htmx
  // to fetch options dynamically, target that id.
  id: string
  name?: string
  // Initial options. Server-filtered comboboxes can pass [] and let
  // htmx populate the datalist on input.
  options?: ComboboxOption[]
  placeholder?: string
  value?: string
  required?: boolean
  disabled?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
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
    placeholder,
    value,
    required,
    disabled,
    ariaLabel,
    ariaLabelledby,
    class: className,
    ...rest
  } = props
  const listId = `${id}-list`
  return (
    <span data-slot="combobox" class={cn("inline-block w-full", className)}>
      <input
        type="text"
        id={id}
        name={name}
        list={listId}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        // autocomplete="off" stops the browser from layering its own
        // history-based suggestions on top of the datalist.
        autocomplete="off"
        class="flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {...rest}
      />
      <datalist id={listId} data-slot="combobox-list">
        {options.map((o) => (
          <option value={o.value} label={o.label} />
        ))}
      </datalist>
    </span>
  )
}

// Server-rendered single option used by htmx endpoints. Lets the server
// return a typed component instead of raw HTML strings.
export function ComboboxOption(props: ComboboxOption) {
  return <option value={props.value} label={props.label} />
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
