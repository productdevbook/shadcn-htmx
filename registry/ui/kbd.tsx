/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Kbd — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Native element (source of truth):
//   repos/mdn/files/en-us/web/html/reference/elements/kbd/index.md
//     - <kbd> denotes textual user input from a keyboard / voice / other
//       text-entry device. Implicit ARIA role: "no corresponding role"
//       (it's phrasing content, announced as plain text). No interaction,
//       so this component ships ZERO JavaScript.
//     - MDN's "Representing keystrokes within an input" pattern nests a
//       <kbd> per key inside an outer <kbd> that represents the whole
//       shortcut. We follow that: <KbdGroup> is the outer <kbd>, each
//       <Kbd> is an inner key. A lone <Kbd> (no group) is still a valid
//       single-key <kbd>.
//
// Visual styling translated from shadcn/ui's Kbd (kept on-brand with our
// theme tokens, not copied verbatim):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/kbd.tsx
//
// We use ONLY existing theme tokens (bg-muted / text-muted-foreground /
// border). select-none + pointer-events-none keep the key glyphs from being
// selected or clicked — they are a label, not a control.

const kbdBase =
  "pointer-events-none inline-flex h-5 w-fit min-w-5 shrink-0 select-none items-center justify-center gap-1 " +
  "rounded-sm border bg-muted px-1 font-sans text-xs font-medium text-muted-foreground " +
  "[&_svg:not([class*='size-'])]:size-3"

// The outer <kbd> that wraps a sequence of keys. MDN allows nesting <kbd>
// inside <kbd>; the group carries no background of its own so the inner
// keys read as discrete caps with separators (the "+" text) between them.
const kbdGroupBase = "inline-flex w-fit items-center gap-1 align-middle"

export function kbdClasses(opts?: { class?: ClassValue }): string {
  return cn(kbdBase, opts?.class)
}

export function kbdGroupClasses(opts?: { class?: ClassValue }): string {
  return cn(kbdGroupBase, opts?.class)
}

type KbdProps = PropsWithChildren<{
  class?: ClassValue
  id?: string
  // Accessible name override — useful for symbol-only keys (e.g. content
  // "⌘" with ariaLabel="Command"). See aria-label on MDN.
  ariaLabel?: string
  title?: string
  // htmx attrs / data-* / aria-* flow through via {...rest}.
}>

// A single key cap. Renders one <kbd>. Use inside <KbdGroup> for shortcuts.
export function Kbd(props: KbdProps) {
  const { children, class: className, id, ariaLabel, title, ...rest } = props
  return (
    <kbd
      id={id}
      data-slot="kbd"
      class={kbdClasses({ class: className })}
      aria-label={ariaLabel}
      title={title}
      {...rest}
    >
      {children}
    </kbd>
  )
}

type KbdGroupProps = PropsWithChildren<{
  class?: ClassValue
  id?: string
  // Convenience: render a shortcut from a list of key labels, joined by a
  // visible separator. Omit `keys` and pass children to compose manually.
  keys?: Child[]
  // Separator rendered between keys (default "+"). Set "" for none.
  separator?: Child
  // Accessible name for the whole shortcut, e.g. "Control Shift R". The
  // outer <kbd> is the labelled unit; per-key caps inherit no extra role.
  ariaLabel?: string
}>

// The outer <kbd> wrapping a key sequence (MDN nested-kbd pattern). When
// `keys` is supplied it renders one <Kbd> per entry with a separator text
// node between them; otherwise it renders `children` verbatim so callers
// can mix keys, "+" text, and icons by hand.
export function KbdGroup(props: KbdGroupProps) {
  const {
    children,
    class: className,
    id,
    keys,
    separator = "+",
    ariaLabel,
    ...rest
  } = props

  let body: Child
  if (keys && keys.length > 0) {
    const parts: Child[] = []
    keys.forEach((k, i) => {
      if (i > 0 && separator !== "" && separator != null) {
        parts.push(
          <span aria-hidden="true" class="text-muted-foreground/70">
            {separator}
          </span>,
        )
      }
      parts.push(<Kbd>{k}</Kbd>)
    })
    body = parts
  } else {
    body = children
  }

  return (
    <kbd
      id={id}
      data-slot="kbd-group"
      class={kbdGroupClasses({ class: className })}
      aria-label={ariaLabel}
      {...rest}
    >
      {body}
    </kbd>
  )
}
