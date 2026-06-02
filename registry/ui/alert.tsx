/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Alert — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth (visual layout):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/alert.tsx
//
// Spec divergence from upstream — important: shadcn hardcodes role="alert"
// on every instance. That role is implicit aria-live="assertive" and
// interrupts the user's current screen-reader output. APG and WCAG advice
// is to reserve "assertive" announcements for genuinely time-sensitive
// content (errors after submit, lost connection). For typical
// informational messages ("Saved", "Filter updated") "polite" is correct;
// for static page content that's there on load, no role at all is
// correct. So we expose `live` and default to "polite" (role="status").
//
// Refs:
//   repos/aria-practices/content/patterns/alert/  ("alert" role guidance)
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/alert_role/
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/status_role/
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-live/
//
// Composition (matches shadcn):
//   <Alert>
//     <SomeIcon />
//     <AlertTitle>Heads up!</AlertTitle>
//     <AlertDescription>Body of the alert…</AlertDescription>
//   </Alert>

export type AlertVariant = "default" | "destructive" | "success" | "warning" | "info"

// "off"      — static informational content; no aria-live region.
// "polite"   — implicit role="status". AT waits until idle to announce.
// "assertive"— implicit role="alert". AT interrupts current speech. Use sparingly.
export type AlertLive = "off" | "polite" | "assertive"

const base =
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm " +
  "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 " +
  "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"

const variants: Record<AlertVariant, string> = {
  default: "bg-card text-card-foreground",
  destructive:
    "border-destructive/30 bg-destructive/5 text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
  success:
    "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 *:data-[slot=alert-description]:text-emerald-700/90 dark:text-emerald-300 dark:*:data-[slot=alert-description]:text-emerald-300/90 [&>svg]:text-current",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-800 *:data-[slot=alert-description]:text-amber-800/90 dark:text-amber-200 dark:*:data-[slot=alert-description]:text-amber-200/90 [&>svg]:text-current",
  info:
    "border-sky-500/30 bg-sky-500/5 text-sky-800 *:data-[slot=alert-description]:text-sky-800/90 dark:text-sky-200 dark:*:data-[slot=alert-description]:text-sky-200/90 [&>svg]:text-current",
}

export function alertClasses(opts?: {
  variant?: AlertVariant
  class?: ClassValue
}): string {
  const variant = opts?.variant ?? "default"
  return cn(base, variants[variant], opts?.class)
}

type AlertProps = PropsWithChildren<{
  variant?: AlertVariant
  // ARIA live-region politeness. "polite" (default) sets role="status".
  // "assertive" sets role="alert". "off" omits both — use for static info.
  live?: AlertLive
  // Override the role directly if you need something unusual; takes
  // precedence over `live`.
  role?: "alert" | "status" | "log" | "none"
  // Most alerts contain the full message at render time, so aria-atomic
  // defaults to true (read the whole alert, not just changed bits).
  ariaAtomic?: boolean
  id?: string
  class?: ClassValue
}>

export function Alert(props: AlertProps) {
  const {
    children,
    variant,
    live = "polite",
    role: roleOverride,
    ariaAtomic = true,
    id,
    class: className,
  } = props
  // Map live → role + aria-live. Both attributes communicate the same
  // thing; some older AT pays attention to one and not the other, so we
  // set both for resilience.
  const role =
    roleOverride ??
    (live === "assertive" ? "alert" : live === "polite" ? "status" : undefined)
  const ariaLive = live === "off" ? undefined : live
  return (
    <div
      id={id}
      data-slot="alert"
      data-variant={variant ?? "default"}
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic ? "true" : undefined}
      class={alertClasses({ variant, class: className })}
    >
      {children}
    </div>
  )
}

export function AlertTitle(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="alert-title"
      class={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

export function AlertDescription(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="alert-description"
      class={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}
