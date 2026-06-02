/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Native <input> with shadcn styling. Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/input.tsx
//
// We render a real <input> so every native behaviour is preserved:
// constraint validation (required, pattern, min/max), client-side autofill,
// browser autocomplete, and the input-mode keyboards on mobile.

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "color"
  | "file"
  | "hidden"

const base =
  "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "selection:bg-primary selection:text-primary-foreground " +
  "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground " +
  "placeholder:text-muted-foreground " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "md:text-sm dark:bg-input/30 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  // htmx-request: dim while a request triggered by/targeting this input is
  // in flight (e.g. live-validation patterns).
  "[&.htmx-request]:opacity-70"

export function inputClasses(opts?: { class?: ClassValue }): string {
  return cn(base, opts?.class)
}

type InputProps = {
  type?: InputType
  class?: ClassValue
  id?: string
  name?: string
  value?: string | number
  defaultValue?: string | number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean

  // String/numeric constraints. The browser enforces these natively when the
  // input is inside a <form> that submits.
  minLength?: number
  maxLength?: number
  min?: number | string
  max?: number | string
  step?: number | string
  pattern?: string

  // Mobile UX: hint to the OS keyboard layout (numeric, decimal, email, …)
  // and the Enter key label (done, search, send, …).
  inputmode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"
  enterkeyhint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send"

  // Submits the text directionality (ltr/rtl) as a separate form field
  // named by this attribute's value. Critical for multilingual forms — the
  // server can preserve the writer's intent even if it doesn't speak the
  // language. Valid for text/search/url/tel/email.
  // See repos/mdn/files/en-us/web/html/reference/elements/input/index.md:357
  dirname?: string

  // type="file" only — request the OS camera with a specific facing mode.
  capture?: "user" | "environment" | boolean

  // Mobile keyboard capitalisation. iOS/Safari honour this aggressively;
  // most useful as "off" for email/password/url where auto-caps is wrong.
  autocapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters"

  // Visible width in characters for text/email/password/tel/url. Mostly
  // superseded by CSS but useful for graceful fallback rendering.
  size?: number

  // Autofill / completion.
  autocomplete?: string
  autofocus?: boolean
  list?: string

  // For type="file".
  accept?: string
  multiple?: boolean

  // ARIA
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  ariaRequired?: boolean

  // Form metadata
  form?: string

  // htmx v4 attributes (subset). htmx fires hx-* on the trigger event, default
  // for an input is "change" (or "input" for type=search). Use hx-trigger to
  // override, e.g. hx-trigger="input changed delay:300ms".
  // See repos/htmx/www/src/content/reference/01-attributes/.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-indicator"?: string
  "hx-vals"?: string
  "hx-include"?: string
  "hx-disable"?: string
}

export function Input(props: InputProps) {
  const {
    type = "text",
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    ...rest
  } = props

  return (
    <input
      type={type}
      class={inputClasses({ class: className })}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
      aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
      data-slot="input"
      {...rest}
    />
  )
}
