/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Progress — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth (track visual):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/progress.tsx
//
// Upstream uses Radix Progress.Root + Indicator. For SSR we render a real
// progressbar element: role="progressbar" + aria-valuemin/max/now/text.
// Pass value=undefined to render the indeterminate state (per ARIA spec).
//
// Refs:
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/progressbar_role/
//   repos/mdn/files/en-us/web/html/reference/elements/progress/  (native; we don't use this — limited styling)

type ProgressProps = {
  // 0–max (or max prop). Pass undefined for indeterminate ("we don't
  // know how long this will take").
  value?: number
  max?: number
  min?: number
  // Accessible name — required when there's no visible label.
  ariaLabel?: string
  ariaLabelledby?: string
  // Optional human-readable label, e.g. "Uploading… 42 of 100 MB".
  ariaValuetext?: string
  class?: ClassValue
  id?: string
  // Forwarded to the root <div role="progressbar">. Progress is the textbook
  // htmx polling target — re-render the bar from the server on a recurring
  // trigger (hx-get + hx-trigger="every 2s", repos/htmx htmx-guidance.md Polling).
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
}

export function Progress(props: ProgressProps) {
  const {
    value,
    max = 100,
    min = 0,
    ariaLabel,
    ariaLabelledby,
    ariaValuetext,
    class: className,
    id,
    ...rest
  } = props
  const determinate = value !== undefined
  const pct = determinate ? Math.min(100, Math.max(0, ((value! - min) / (max - min)) * 100)) : 0
  return (
    <div
      id={id}
      role="progressbar"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={determinate ? value : undefined}
      aria-valuetext={ariaValuetext}
      data-slot="progress"
      data-state={determinate ? "determinate" : "indeterminate"}
      class={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...rest}
    >
      <div
        data-slot="progress-indicator"
        class={cn(
          "h-full bg-primary transition-all",
          // Indeterminate state animates a 30%-width bar across the track.
          !determinate && "absolute inset-y-0 -left-1/3 w-1/3 animate-[scn-progress-indeterminate_1.2s_ease-in-out_infinite]",
        )}
        style={determinate ? `width: ${pct}%` : undefined}
      />
    </div>
  )
}
