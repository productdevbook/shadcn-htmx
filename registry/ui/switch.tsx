/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Switch — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/switch.tsx
//
// Upstream uses Radix Switch (a div with role="switch"). We use a native
// <input type="checkbox" role="switch"> so the value is form-submittable,
// the platform handles keyboard activation (Space toggles), and the
// accessible name comes from a linked <label>.
//
// APG: WAI-ARIA Switch pattern
//   repos/aria-practices/content/patterns/switch/

export type SwitchSize = "sm" | "default"

const trackBase =
  "relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all align-middle"

const trackSize: Record<SwitchSize, string> = {
  default: "h-[1.15rem] w-8",
  sm: "h-3.5 w-6",
}

const inputBase =
  "peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full outline-none transition-colors " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "bg-input dark:bg-input/80 checked:bg-primary"

const thumbBase =
  "pointer-events-none absolute top-1/2 left-px -translate-y-1/2 rounded-full bg-background transition-transform " +
  "peer-checked:translate-x-[calc(100%-2px)] " +
  "dark:peer-checked:bg-primary-foreground dark:bg-foreground"

const thumbSize: Record<SwitchSize, string> = {
  default: "size-4",
  sm: "size-3",
}

export function switchClasses(opts?: {
  size?: SwitchSize
  class?: ClassValue
}): string {
  return cn(trackBase, trackSize[opts?.size ?? "default"], opts?.class)
}

type SwitchProps = {
  id?: string
  name?: string
  value?: string
  checked?: boolean
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: SwitchSize
  form?: string
  class?: ClassValue
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // Linked error message id (pair with aria-invalid on the input).
  ariaErrormessage?: string
  ariaInvalid?: boolean
  // Read-only state for non-native variants. APG switch role explicitly
  // supports aria-readonly. See
  // repos/mdn/files/en-us/web/accessibility/aria/reference/roles/switch_role/index.md:63-64
  ariaReadonly?: boolean
  // Surface element this switch shows/hides (e.g. a "advanced settings"
  // section that's only visible when on).
  ariaControls?: string

  // htmx — fire on toggle to persist the change.
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

export function Switch(props: SwitchProps) {
  const {
    size = "default",
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaErrormessage,
    ariaInvalid,
    ariaReadonly,
    ariaControls,
    ...rest
  } = props
  return (
    <span
      data-slot="switch"
      data-size={size}
      class={switchClasses({ size, class: className })}
    >
      <input
        type="checkbox"
        role="switch"
        class={inputBase}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
        aria-errormessage={ariaErrormessage}
        aria-readonly={ariaReadonly === undefined ? undefined : String(ariaReadonly)}
        aria-controls={ariaControls}
        {...rest}
      />
      <span class={cn(thumbBase, thumbSize[size])} data-slot="switch-thumb" aria-hidden="true" />
    </span>
  )
}
