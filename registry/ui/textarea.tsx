/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Native <textarea> with shadcn polish. Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/textarea.tsx
//
// Auto-resize is delivered by CSS `field-sizing: content` (the textarea grows
// with its value). No JS hooks required. See:
//   repos/mdn/files/en-us/web/css/field-sizing/

const base =
  "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none " +
  "placeholder:text-muted-foreground " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
  "md:text-sm dark:bg-input/30 " +
  // htmx-request: dim while a request triggered by/targeting this textarea is
  // in flight (e.g. live-validation).
  "[&.htmx-request]:opacity-70"

export function textareaClasses(opts?: { class?: ClassValue }): string {
  return cn(base, opts?.class)
}

type TextareaProps = {
  class?: ClassValue
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean

  // Sizing
  rows?: number
  cols?: number

  // Validation
  minLength?: number
  maxLength?: number

  // Mobile UX
  autocomplete?: string
  autofocus?: boolean
  spellcheck?: boolean

  // Submits the text directionality (ltr/rtl) as a separate form field.
  // Same as <input>: critical for multilingual content where the server
  // needs to preserve the writer's direction. See
  // repos/mdn/files/en-us/web/html/reference/elements/textarea/index.md
  dirname?: string

  // Mobile keyboard capitalisation hint (most useful as "off" for code,
  // JSON, or tag input where auto-caps is wrong).
  autocapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters"

  // Safari/WebKit extension. Disable when editing code, JSON, hashtags, etc.
  autocorrect?: "on" | "off"

  // Wrapping
  wrap?: "hard" | "soft" | "off"

  // ARIA
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"
  ariaRequired?: boolean

  // Form metadata
  form?: string

  // htmx attributes — fire on blur or hx-trigger="input changed delay:300ms"
  // for live validation / autosave patterns. See
  // repos/htmx/www/src/content/reference/01-attributes/.
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
}

export function Textarea(props: TextareaProps) {
  const {
    class: className,
    value,
    defaultValue,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ariaRequired,
    ...rest
  } = props

  return (
    <textarea
      class={textareaClasses({ class: className })}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
      aria-required={ariaRequired === undefined ? undefined : String(ariaRequired)}
      data-slot="textarea"
      {...rest}
    >{value ?? defaultValue}</textarea>
  )
}
