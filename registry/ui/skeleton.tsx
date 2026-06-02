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
//   - Once the real content swaps in, the role/aria-busy goes with it
//     — no manual cleanup needed.

type SkeletonProps = {
  // Required so AT users hear something meaningful while content loads.
  ariaLabel?: string
  class?: ClassValue
  id?: string
  // Pass-through for tests / debugging.
  [key: `data-${string}`]: any
}

export function Skeleton(props: SkeletonProps) {
  const { ariaLabel = "Loading", class: className, id, ...rest } = props
  return (
    <div
      id={id}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      data-slot="skeleton"
      class={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
      {...rest}
    />
  )
}
