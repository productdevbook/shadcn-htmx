/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Radio group — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/radio-group.tsx
//
// Upstream uses Radix RadioGroup. We use native <input type="radio"> grouped
// by name — the browser handles arrow-key navigation, focus management, and
// auto-activation for free. The styling layers a custom indicator (a filled
// dot) on top of the appearance-none input via the peer-checked variant.
//
// APG: WAI-ARIA Radio Group pattern.
//   repos/aria-practices/content/patterns/radio/

type RadioGroupProps = PropsWithChildren<{
  name: string
  defaultValue?: string
  // ARIA: required is a *group-level* concept — the requirement is "one of
  // these must be selected", not "this specific radio must be selected".
  // We set aria-required on the wrapper. For native browser validation, pass
  // the HTML `required` attribute to one (or all) RadioGroupItem(s) — the
  // browser treats any required radio in a name-group as making the whole
  // group required. See repos/mdn/files/en-us/web/html/reference/elements/input/radio/index.md
  required?: boolean
  disabled?: boolean
  // Layout hint to assistive tech. Default is vertical; set "horizontal" if
  // your radios sit side by side so arrow-key announcements match.
  // See repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-orientation/index.md
  orientation?: "horizontal" | "vertical"
  // Linked error message element id. Pair with aria-invalid on items + a
  // visible error text whose id matches.
  // See repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-errormessage/index.md
  ariaErrormessage?: string
  ariaInvalid?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // Surface element controlled by this group's value (e.g. a panel shown
  // when "Pro" is picked). Reference its id.
  ariaControls?: string
  class?: ClassValue
}>

export function RadioGroup(props: RadioGroupProps) {
  // The wrapper is just a layout grid + role; the radios inside share the
  // `name` so the browser groups them and handles arrow-key navigation.
  return (
    <div
      role="radiogroup"
      aria-label={props.ariaLabel}
      aria-labelledby={props.ariaLabelledby}
      aria-describedby={props.ariaDescribedby}
      aria-orientation={props.orientation}
      aria-required={props.required ? "true" : undefined}
      aria-disabled={props.disabled ? "true" : undefined}
      aria-invalid={props.ariaInvalid === undefined ? undefined : String(props.ariaInvalid)}
      aria-errormessage={props.ariaErrormessage}
      aria-controls={props.ariaControls}
      data-slot="radio-group"
      data-name={props.name}
      data-default-value={props.defaultValue}
      class={cn(
        "grid gap-3 data-[orientation=horizontal]:grid-flow-col data-[orientation=horizontal]:auto-cols-max",
        props.class,
      )}
      data-orientation={props.orientation}
    >
      {props.children}
    </div>
  )
}

const inputBase =
  "peer aspect-square size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "checked:border-primary " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "dark:bg-input/30"

const dotBase =
  "pointer-events-none absolute inset-0 m-auto size-2 hidden rounded-full bg-primary peer-checked:block"

export function radioGroupItemClasses(opts?: { class?: ClassValue }): string {
  return cn(inputBase, opts?.class)
}

type RadioGroupItemProps = {
  // The value submitted when this radio is the selected one in the group.
  value: string
  id?: string
  // The parent RadioGroup sets the group name; pass it through if you're not
  // rendering inside a <RadioGroup> wrapper.
  name?: string
  // Pre-select this item.
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  // Associate this radio with a <form> by its id when it's rendered outside
  // that form (common in SSR/htmx swaps). The form owner participates in how
  // the radio button group is reconciled.
  // See repos/whatwg-html/source ("The element's form owner changes").
  form?: string
  // Cross-load checked-state persistence control. Pass "off" to stop the
  // browser re-applying a prior selection on reload / back-forward.
  // See repos/mdn/files/en-us/web/html/reference/elements/input/radio/index.md (autocomplete)
  autocomplete?: string
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean
  class?: ClassValue
  // htmx — fire on the input's change event, e.g. live filters or revealing
  // dependent options when a choice is made.
  // See repos/htmx/www/content/attributes/hx-trigger.md
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

export function RadioGroupItem(props: RadioGroupItemProps) {
  const {
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ...rest
  } = props
  return (
    <span class="relative inline-flex size-4 shrink-0 align-middle">
      <input
        type="radio"
        class={radioGroupItemClasses({ class: className })}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
        data-slot="radio-group-item"
        {...rest}
      />
      <span class={dotBase} data-slot="radio-group-indicator" aria-hidden="true" />
    </span>
  )
}
