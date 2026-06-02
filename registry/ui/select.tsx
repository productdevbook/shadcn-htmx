/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Select — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Upstream shadcn uses a Radix Popover with custom items (rich content
// support, virtualization, etc.). For an SSR-friendly htmx setup, the
// native <select> is hard to beat: it brings full keyboard control,
// type-to-search, mobile-native pickers, accessible name handling, and
// form submission with zero JS. We restyle it with `appearance-none` and
// layer a chevron icon on top — the native dropdown rendering still pops
// from inside (browser-controlled).
//
// MDN: repos/mdn/files/en-us/web/html/reference/elements/select/

const triggerBase =
  "peer flex h-9 w-full min-w-0 cursor-pointer appearance-none items-center rounded-md border border-input bg-background px-3 pr-8 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "md:text-sm dark:bg-input/30 " +
  "[&.htmx-request]:opacity-70"

export function selectTriggerClasses(opts?: { class?: ClassValue }): string {
  return cn(triggerBase, opts?.class)
}

type SelectProps = PropsWithChildren<{
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  // Renders as a list box if >=2 (default 1 = dropdown).
  size?: number
  form?: string
  autocomplete?: string
  // Focus this select on initial page load (one per document).
  autofocus?: boolean
  class?: ClassValue

  // ARIA
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean
  ariaRequired?: boolean

  // htmx — fire when the user picks a new option.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-vals"?: string
  "hx-include"?: string
}>

export function Select(props: SelectProps) {
  const {
    class: className,
    children,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    ...rest
  } = props
  return (
    <span class="relative inline-flex w-full">
      <select
        class={selectTriggerClasses({ class: className })}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
        aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
        data-slot="select"
        {...rest}
      >
        {children}
      </select>
      {/* Chevron — hidden on multi-line listbox (size > 1) where native UI
          doesn't render a chevron. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  )
}

// Re-exports for ergonomic composition. <option> and <optgroup> are the
// native primitives — no special styling needed beyond what the browser does.
export function SelectOption(
  props: PropsWithChildren<{
    value: string
    disabled?: boolean
    selected?: boolean
    label?: string
  }>,
) {
  const { value, disabled, selected, label, children } = props
  return (
    <option value={value} disabled={disabled} selected={selected} label={label}>
      {children}
    </option>
  )
}

export function SelectGroup(
  props: PropsWithChildren<{ label: string; disabled?: boolean }>,
) {
  return (
    <optgroup label={props.label} disabled={props.disabled}>
      {props.children}
    </optgroup>
  )
}
