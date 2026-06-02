/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Relative Time — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A semantic timestamp. The server renders BOTH a machine-readable instant
// (the `datetime` attribute) and a human-readable label as the element's text
// content ("3 days ago", "May 15, 2024"). With no JavaScript the server label
// is what the user sees — fully progressive. When the optional site.js block
// is present it re-localises the label to the visitor's locale + timezone via
// the Intl APIs and keeps relative labels fresh, degrading silently to the
// server text if Intl is unavailable.
//
// Built on the native <time> element:
//   - <time datetime> carries the machine-readable instant; the child text is
//     the human label. Per the spec, when `datetime` is present the element
//     MAY have descendant text; the datetime value is the attribute.
//       repos/mdn/files/en-us/web/html/reference/elements/time/index.md
//     The implicit ARIA role is `time` (a structural role with an HTML
//     equivalent), so no extra role/ARIA is needed — AT reads the text label.
//   - The localising script (returned in the docs site.js) uses the platform
//     Intl.RelativeTimeFormat / Intl.DateTimeFormat. These are web standards,
//     not a userland date library, so there is nothing to emulate: if a UA
//     lacks them the server label simply stays.
//   - htmx attrs (hx-*) and data-*/aria-* flow through {...rest} so a label
//     can be hx-swapped or refreshed; verified against repos/htmx/www/reference.md.
//
// Style analogues (tokens + anatomy kept in sync):
//   registry/ui/badge.tsx   — inline element, data-slot, {...rest} forwarding
//   registry/ui/status.tsx  — text-token tones for supporting/secondary text
//
// Composition:
//   <RelativeTime datetime="2024-05-12T09:00:00Z">3 days ago</RelativeTime>
//   <RelativeTime datetime="2024-05-12T09:00:00Z" format="datetime" tone="muted">
//     May 12, 2024
//   </RelativeTime>

// "relative" → script renders "3 days ago" via Intl.RelativeTimeFormat.
// "datetime" → script renders an absolute, locale-formatted date/time via
// Intl.DateTimeFormat. The server text is the fallback for both.
export type RelativeTimeFormat = "relative" | "datetime"

export type RelativeTimeTone = "default" | "muted"

const base = "tabular-nums"

const tones: Record<RelativeTimeTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
}

export function relativeTimeClasses(opts?: {
  tone?: RelativeTimeTone
  class?: ClassValue
}): string {
  const tone = opts?.tone ?? "muted"
  return cn(base, tones[tone], opts?.class)
}

type RelativeTimeProps = PropsWithChildren<{
  // Machine-readable instant — any valid HTML `datetime` value. An ISO 8601
  // string (e.g. "2024-05-12T09:00:00Z") is what the script can parse to
  // re-localise; other valid `datetime` microsyntaxes still render natively.
  datetime: string
  // How the script should format the label. "relative" (default) → "3 days
  // ago"; "datetime" → an absolute locale/timezone-aware date+time.
  format?: RelativeTimeFormat
  // Text tone. Defaults to "muted" — timestamps are usually supporting text.
  tone?: RelativeTimeTone
  id?: string
  class?: ClassValue
  // hx-*, data-*, aria-*, title, etc. flow straight onto the <time> element.
  [key: string]: unknown
}>

export function RelativeTime(props: RelativeTimeProps) {
  const {
    children,
    datetime,
    format = "relative",
    tone,
    id,
    class: className,
    ...rest
  } = props

  return (
    <time
      id={id}
      datetime={datetime}
      data-slot="relative-time"
      data-relative-time=""
      data-format={format}
      class={relativeTimeClasses({ tone, class: className })}
      {...rest}
    >
      {children}
    </time>
  )
}
