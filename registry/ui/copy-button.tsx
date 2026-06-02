/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Copy Button — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Click-to-copy button: writes an associated string (a snippet, an API key, a
// URL) to the system clipboard, then flips to a transient "Copied" state and
// announces it through a visually-hidden aria-live region. The docs site's own
// code-block is a consumer.
//
// Built on the Async Clipboard API. navigator.clipboard.writeText(text)
// returns a Promise that resolves once the system clipboard has been updated;
// it works only in a secure context (HTTPS / localhost) and from a window that
// has focus:
//   repos/mdn/files/en-us/web/api/clipboard/writetext/index.md
// The shared behaviour in site.js follows web.dev's progressive-enhancement
// recipe — use the async API when present, otherwise fall back to a throwaway
// <textarea> + document.execCommand('copy'):
//   repos/web.dev/src/site/content/en/patterns/clipboard/copy-text/index.md
//
// Accessibility:
//   - A native <button> gives us role=button + Space/Enter activation for free
//     (APG button pattern: repos/aria-practices/content/patterns/button/).
//   - The transition is announced through an EMPTY element carrying
//     aria-live="polite": site.js writes "Copied" into it on success. MDN: the
//     aria-live attribute is set on an empty element that is then populated, so
//     AT announces the change without moving focus —
//     repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-live/index.md
//   - This is NOT a toggle: aria-pressed is wrong here (the label/state is
//     transient feedback, not a sticky on/off), so we use aria-live instead.
//
// All hx-*, data-* and aria-* attributes are forwarded onto the <button> via
// {...rest}, so the button can also trigger an htmx request if you want one.

export type CopyButtonVariant = "outline" | "ghost" | "secondary"
export type CopyButtonSize = "default" | "sm" | "icon"

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 " +
  // Transient success state. site.js sets data-copied="true" for a beat, then
  // clears it; we swap the copy glyph for the check and tint it success-green.
  "[&[data-copied=true]]:text-emerald-600 dark:[&[data-copied=true]]:text-emerald-400 " +
  "[&_[data-copy-check]]:hidden [&[data-copied=true]_[data-copy-icon]]:hidden [&[data-copied=true]_[data-copy-check]]:inline-flex"

const variants: Record<CopyButtonVariant, string> = {
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
}

const sizes: Record<CopyButtonSize, string> = {
  default: "h-8 px-2.5",
  sm: "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
  icon: "size-8 [&]:px-0",
}

type CopyButtonProps = {
  // The string written to the clipboard. Either pass `value` directly, or
  // point `copyTarget` at the id of an element whose text/value to copy
  // (so the docs code-block can be a consumer without duplicating its text).
  value?: string
  copyTarget?: string
  variant?: CopyButtonVariant
  size?: CopyButtonSize
  // Visible label next to the icon (default "Copy" / "Copied"). For size
  // "icon" the label is dropped and the accessible name comes from ariaLabel.
  label?: string
  copiedLabel?: string
  // Accessible name. Required for size="icon"; otherwise the visible label
  // supplies the name.
  ariaLabel?: string
  // Politeness of the success announcement. polite waits for a graceful
  // pause; assertive interrupts. Default polite (MDN aria-live).
  live?: "polite" | "assertive"
  disabled?: boolean
  class?: ClassValue
  id?: string
  // Forward arbitrary attributes (hx-*, data-*, aria-*, name/value/form, …).
  [key: string]: any
}

const CopyIcon = () => (
  <svg
    data-copy-icon
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    data-copy-check
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export function CopyButton(props: CopyButtonProps) {
  const {
    value,
    copyTarget,
    variant = "outline",
    size = "default",
    label = "Copy",
    copiedLabel = "Copied",
    ariaLabel,
    live = "polite",
    disabled,
    class: className,
    id,
    ...rest
  } = props

  const iconOnly = size === "icon"
  const classes = cn(base, variants[variant], sizes[size], className)

  return (
    <button
      type="button"
      id={id}
      data-slot="copy-button"
      data-variant={variant}
      data-size={size}
      data-copy-text={value}
      data-copy-target={copyTarget}
      data-copied-label={copiedLabel}
      disabled={disabled}
      aria-label={ariaLabel ?? (iconOnly ? label : undefined)}
      class={classes}
      {...rest}
    >
      <CopyIcon />
      <CheckIcon />
      {!iconOnly && (
        <span data-copy-label>{label}</span>
      )}
      {/* Empty aria-live region — site.js writes "Copied" here on success so
          AT announces it without moving focus. MDN: aria-live on an empty
          element that is then populated. */}
      <span class="sr-only" aria-live={live} data-copy-status></span>
    </button>
  )
}
