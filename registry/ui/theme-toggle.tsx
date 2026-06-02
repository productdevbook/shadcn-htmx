/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Theme Toggle — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A light / dark / system colour-scheme switcher. By default it honours the
// operating-system preference; an explicit choice is persisted in a cookie so
// the server can re-render the correct theme on the next request with NO
// flash of the wrong colours.
//
// Built on web-standard primitives — no framework theming runtime:
//   - prefers-color-scheme media feature (the "system" default):
//       repos/mdn/files/en-us/web/css/reference/at-rules/@media/prefers-color-scheme/index.md
//   - color-scheme property (so native form controls + scrollbars follow):
//       repos/mdn/files/en-us/web/css/reference/properties/color-scheme/index.md
//   - cookie persistence + a synchronous pre-paint boot script for no-flash,
//     adapted (NOT copied) from the web.dev theming patterns:
//       repos/web.dev/src/site/content/en/patterns/theming/theme-switch
//       repos/web.dev/src/site/content/en/patterns/theming/color-schemes
//     web.dev uses localStorage; we use a cookie so the *server* can read it
//     and render `.dark` up front — localStorage isn't available server-side,
//     which is why htmx/SSR apps prefer a cookie here.
//
// We model the three states as a native radio group rather than a 2-state
// button, because "system" is a real third choice — a toggle can't express
// it. Grouping native <input type="radio"> by `name` gives us arrow-key
// roving focus, single-selection, and aria-checked for free; only one option
// is selected at a time. The web.dev color-schemes pattern uses the same
// radio-form shape (assets/body.html). We layer the visual segmented control
// on top of appearance-none inputs via peer-checked, the way switch.tsx and
// radio-group.tsx do.
//   APG radio group pattern: repos/aria-practices/content/patterns/radio/
//
// Tailwind v4 dark mode here is class-based: `.dark` on <html>
// (@custom-variant dark (&:is(.dark *)) in app/styles/input.css). The boot
// script returned in the docs site.js toggles that class; "system" leaves the
// class off and lets prefers-color-scheme drive it via CSS.

export type ThemeChoice = "system" | "light" | "dark"

// Fixed, ordered set — the three real states. Each carries its icon + label.
export const THEME_OPTIONS: ThemeChoice[] = ["system", "light", "dark"]

const groupBase =
  "inline-flex items-center gap-0.5 rounded-md border bg-muted p-0.5 text-muted-foreground shadow-xs " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50"

// The visible chip for each option. The real <input type="radio"> is a
// peer sibling rendered visually-hidden but still focusable; its :checked /
// :focus-visible state styles the label via the peer-* variants. This keeps
// keyboard + AT behaviour native while letting us draw a segmented control.
const itemBase =
  "relative inline-flex size-7 cursor-pointer items-center justify-center rounded-[5px] outline-none transition-colors " +
  "peer-hover:bg-background/60 peer-hover:text-foreground " +
  "peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-xs " +
  "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 " +
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

const inputBase =
  "peer sr-only"

export function themeToggleClasses(opts?: { class?: ClassValue }): string {
  return cn(groupBase, opts?.class)
}

const ICONS: Record<ThemeChoice, Child> = {
  system: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  ),
  light: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  ),
  dark: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
}

const LABELS: Record<ThemeChoice, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
}

type ThemeToggleProps = {
  // The server-resolved current choice (from the cookie, or "system" when no
  // cookie is set). Drives which radio renders checked so there's no flash.
  value?: ThemeChoice
  // The radio group `name` + the cookie key the boot script reads/writes.
  // Defaults to "theme".
  name?: string
  // Id prefix for the inputs/labels (so multiple toggles can coexist).
  id?: string
  disabled?: boolean
  // Accessible name for the whole group (role=radiogroup). Defaults to
  // "Colour theme".
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  class?: ClassValue

  // htmx — fire on change to persist the choice server-side as well as in the
  // cookie (e.g. write it to the user's profile). The boot script already
  // applies the visual theme; this is purely for server persistence.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-vals"?: string
}

export function ThemeToggle(props: ThemeToggleProps) {
  const {
    value = "system",
    name = "theme",
    id = "theme-toggle",
    disabled,
    ariaLabel = "Colour theme",
    ariaLabelledby,
    ariaDescribedby,
    class: className,
    ...rest
  } = props

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabelledby ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-disabled={disabled ? "true" : undefined}
      data-slot="theme-toggle"
      data-name={name}
      data-value={value}
      class={themeToggleClasses({ class: className })}
      {...rest}
    >
      {THEME_OPTIONS.map((choice) => {
        const inputId = `${id}-${choice}`
        return (
          <span class="relative inline-flex">
            <input
              type="radio"
              id={inputId}
              name={name}
              value={choice}
              checked={choice === value}
              disabled={disabled}
              class={inputBase}
              data-slot="theme-toggle-item"
            />
            <label for={inputId} class={itemBase} data-slot="theme-toggle-label" title={LABELS[choice]}>
              {ICONS[choice]}
              <span class="sr-only">{LABELS[choice]}</span>
            </label>
          </span>
        )
      })}
    </div>
  )
}
