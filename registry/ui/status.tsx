/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Status — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A persistent POLITE live-region announcer for non-urgent updates:
// "Saved", "3 results", "Draft autosaved 14:02". The non-interruptive
// counterpart to Alert/Toast — the region lives on the page from first
// paint and you swap text INTO it (htmx innerHTML/textContent), so AT
// announces the change only when the user is idle. Never moves focus.
//
// Two structural roles, per APG / MDN:
//   role="status" (default) — implicit aria-live="polite" + aria-atomic="true".
//     A single advisory message that is replaced wholesale ("Saved").
//   role="log" — implicit aria-live="polite" + aria-atomic="false".
//     An append-only sequence read in arrival order (activity / chat log);
//     only the newly-added entry is announced, not the whole list.
//
// Both are NAMED regions (aria-label) so AT users can find them. We set
// aria-live AND the role explicitly (some older AT honours only one) and
// pin aria-atomic to the role's correct default so swaps behave.
//
// Refs:
//   repos/aria-practices/content/practices/structural-roles/structural-roles-practice.html
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/status_role/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/log_role/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-live/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-atomic/index.md
//   repos/htmx/www/reference.md (hx-* forwarded via {...rest}; swap text in)
//
// Composition:
//   <Status ariaLabel="Save status">Saved</Status>
//   <Status as="log" ariaLabel="Activity">
//     <StatusItem>Connected</StatusItem>
//     <StatusItem>Synced 3 files</StatusItem>
//   </Status>

export type StatusRole = "status" | "log"
export type StatusTone = "default" | "muted" | "success" | "destructive"

// role="status" reads the whole region on change (atomic). role="log" reads
// only the appended item (non-atomic) so a growing list isn't re-read in full.
const ROLE_ATOMIC: Record<StatusRole, "true" | "false"> = {
  status: "true",
  log: "false",
}

const base =
  "block min-h-5 text-sm"

const tones: Record<StatusTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-emerald-700 dark:text-emerald-300",
  destructive: "text-destructive",
}

export function statusClasses(opts?: {
  tone?: StatusTone
  class?: ClassValue
}): string {
  const tone = opts?.tone ?? "muted"
  return cn(base, tones[tone], opts?.class)
}

type StatusProps = PropsWithChildren<{
  // Structural role. "status" = single advisory message (atomic). "log" =
  // append-only ordered sequence (only new entries announced).
  as?: StatusRole
  // Text tone. Defaults to "muted" — status text is supporting, not primary.
  tone?: StatusTone
  // Override aria-atomic if you have an unusual case; otherwise it tracks
  // the role's correct implicit default (status=true, log=false).
  ariaAtomic?: boolean
  // Required-by-spec accessible name for log; strongly recommended for
  // status so AT can announce "Save status: Saved".
  ariaLabel?: string
  ariaLabelledby?: string
  id?: string
  class?: ClassValue
  // hx-*, data-*, aria-* and anything else flow straight onto the region.
  [key: string]: unknown
}>

export function Status(props: StatusProps) {
  const {
    children,
    as = "status",
    tone,
    ariaAtomic,
    ariaLabel,
    ariaLabelledby,
    id,
    class: className,
    ...rest
  } = props
  const atomic =
    ariaAtomic === undefined
      ? ROLE_ATOMIC[as]
      : ariaAtomic
        ? "true"
        : "false"
  return (
    <div
      id={id}
      data-slot="status"
      data-role={as}
      role={as}
      aria-live="polite"
      aria-atomic={atomic}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      class={statusClasses({ tone, class: className })}
      {...rest}
    >
      {children}
    </div>
  )
}

// A single entry inside a role="log" region. Plain <div> so the log stays a
// simple ordered flow; the parent's aria-live announces each appended item.
export function StatusItem(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <div
      id={props.id}
      data-slot="status-item"
      class={cn("py-0.5", props.class)}
    >
      {props.children}
    </div>
  )
}
