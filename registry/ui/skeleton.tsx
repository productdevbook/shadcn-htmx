/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Skeleton — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Visual loading placeholder. Renders as a styled div with a subtle
// pulse animation. Pair with htmx so the real content swaps in when
// the server responds — the placeholder DOM is replaced wholesale.
//
// Accessibility:
//   - role="status" + aria-busy="true" so AT announces "Loading".
//   - aria-label gives the announcement substance ("Loading user list").
//   - aria-labelledby points the name at an existing visible label
//     (e.g. a section heading) instead of duplicating the string. Per the
//     status role spec: "If a name is visible, reference it using
//     aria-labelledby." When supplied it supersedes the default label.
//     repos/mdn/files/en-us/web/accessibility/aria/reference/roles/status_role/index.md
//   - Once the real content swaps in, the role/aria-busy goes with it
//     — no manual cleanup needed.

type SkeletonProps = {
  // Required so AT users hear something meaningful while content loads.
  ariaLabel?: string
  // Reference a visible label (e.g. a heading) to name the status region.
  ariaLabelledby?: string
  class?: ClassValue
  id?: string
  // Pass-through for tests / debugging.
  [key: `data-${string}`]: any
}

export function Skeleton(props: SkeletonProps) {
  const { ariaLabel = "Loading", ariaLabelledby, class: className, id, ...rest } = props
  return (
    <div
      id={id}
      role="status"
      aria-busy="true"
      // A referenced visible label supersedes the hardcoded "Loading" string.
      aria-label={ariaLabelledby ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-slot="skeleton"
      class={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
      {...rest}
    />
  )
}
