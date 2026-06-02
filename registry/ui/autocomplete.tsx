/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Autocomplete — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Free-text input with native typeahead suggestions: a real <input list>
// bound to a <datalist>. The light, native sibling of the APG combobox —
// where the combobox is a full listbox widget, this is the platform's own
// "suggestion list" affordance with zero behavioural JS of our own.
//
// **Native-first.** The browser owns everything:
//   - the suggestion dropdown UI and its positioning
//   - substring filtering of <option> values as the user types
//   - click + Up/Down + Enter selection, Escape to dismiss
//   - focus management and the implicit listbox role of <datalist>
// The value is always free text — an autocomplete *suggests*, it does not
// constrain. (Use <select> / the listbox component when the value must be
// one of a fixed set.)
//   See repos/mdn/files/en-us/web/html/reference/elements/datalist/index.md
//      ("<datalist> is not a replacement for <select>… The control can still
//       accept any value that passes validation.")
//      repos/mdn/files/en-us/web/html/reference/elements/input/index.md#list
//      ("The values provided are suggestions, not requirements.")
//
// htmx wiring (server-streamed suggestions, verified against the vendored
// v4 source). When `endpoint` is set we point htmx at this input and let the
// server return a fresh <option> set on each keystroke:
//   - hx-trigger="input changed delay:Nms" — debounce typing and ignore
//     no-op keys (arrows). The leading `input` event covers every keystroke.
//     See repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md
//        ("Events can be refined with filters and modifiers, e.g.
//          `input changed delay:1s`")
//   - hx-target="#<id>-list" + hx-swap="innerHTML" — swap the new options
//     straight into the bound <datalist>; the input keeps focus and the
//     browser re-renders the dropdown from the fresh list transparently.
//   - hx-sync="this:replace" — abort the in-flight request when the next
//     keystroke fires so a slow response can never clobber newer suggestions.
//     See repos/htmx/www/src/content/reference/01-attributes/21-hx-sync.md
//
// Style analogues: registry/ui/combobox.tsx (the datalist sibling) and
// registry/ui/input.tsx / registry/ui/active-search.tsx (the input chrome +
// the htmx defaults + the .htmx-request dimming convention).
//
// No site.js: the dropdown, filtering, and selection are all native; the
// only JS in play is htmx fetching options. data-slot hooks are for
// styling/testing only.

export type AutocompleteOption = { value: string; label?: string }

const inputBase =
  "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "selection:bg-primary selection:text-primary-foreground " +
  "placeholder:text-muted-foreground " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "md:text-sm dark:bg-input/30 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  // htmx-request: dim while a suggestion request triggered by this input is
  // in flight, matching the input/active-search convention.
  "[&.htmx-request]:opacity-70"

export function autocompleteInputClasses(opts?: { class?: ClassValue }): string {
  return cn(inputBase, opts?.class)
}

type AutocompleteProps = {
  // The input's id. The <datalist> is `${id}-list`; the default htmx
  // hx-target points at it, so server-streamed options land in the right list.
  id: string
  name?: string
  // Initial / static suggestions. Server-streamed autocompletes pass [] and
  // let htmx populate the datalist on input.
  options?: AutocompleteOption[]
  placeholder?: string
  value?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  // Length bounds the platform enforces on the free-text value.
  minLength?: number
  maxLength?: number
  // Debounce window for the `input` trigger when `endpoint` is set. Default 200ms.
  delay?: number
  // Convenience: when set, wires the standard server-streaming defaults
  //   hx-get={endpoint} hx-trigger="input changed delay:${delay}ms"
  //   hx-target="#${id}-list" hx-swap="innerHTML" hx-sync="this:replace"
  // Anything passed via hx-* in `rest` overrides these.
  endpoint?: string
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  class?: ClassValue
  inputClass?: ClassValue
  form?: string
  // htmx attrs ride onto the <input>. With `endpoint` you usually need none;
  // pass hx-* directly for full control (they override the endpoint defaults).
  //   See repos/htmx/www/reference.md
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function Autocomplete(props: AutocompleteProps) {
  const {
    id,
    name,
    options = [],
    placeholder,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    minLength,
    maxLength,
    delay = 200,
    endpoint,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    class: className,
    inputClass,
    form,
    ...rest
  } = props

  const listId = `${id}-list`

  // Server-streaming defaults, applied only when an endpoint is given.
  // Anything in `rest` (explicit hx-*) wins.
  const hxDefaults: Record<string, any> = endpoint
    ? {
        "hx-get": endpoint,
        "hx-trigger": `input changed delay:${delay}ms`,
        "hx-target": `#${listId}`,
        "hx-swap": "innerHTML",
        "hx-sync": "this:replace",
      }
    : {}
  const hx = { ...hxDefaults, ...rest }

  return (
    <span data-slot="autocomplete" class={cn("inline-block w-full", className)}>
      <input
        type="text"
        id={id}
        name={name}
        list={listId}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readonly={readonly}
        autofocus={autofocus}
        minlength={minLength}
        maxlength={maxLength}
        form={form}
        // autocomplete="off" stops the browser layering its own history
        // suggestions on top of the datalist.
        autocomplete="off"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
        data-slot="autocomplete-input"
        class={autocompleteInputClasses({ class: inputClass })}
        {...hx}
      />
      <datalist id={listId} data-slot="autocomplete-list">
        {options.map((o) => (
          <option value={o.value} label={o.label} />
        ))}
      </datalist>
    </span>
  )
}

// Server-rendered single suggestion used by htmx endpoints. Lets the server
// return a typed component instead of raw HTML strings.
export function AutocompleteOption(props: AutocompleteOption) {
  return <option value={props.value} label={props.label} />
}
