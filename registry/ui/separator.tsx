/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Separator — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth (visual styles):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/separator.tsx
//
// Semantics (spec-first):
//   - decorative=true  (default): the line is purely visual. We render a
//                       <div> with no role so assistive tech skips it.
//   - decorative=false (semantic): the line marks a thematic break between
//                       content groups. We render <hr> (implicit
//                       role="separator") for horizontal, and a div with
//                       role="separator" + aria-orientation for vertical
//                       (there's no native vertical hr).
//
// MDN:
//   repos/mdn/files/en-us/web/html/reference/elements/hr/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/separator_role/
// APG:
//   repos/aria-practices/content/patterns/none/ (separator role)

export type SeparatorOrientation = "horizontal" | "vertical"

const base =
  "shrink-0 bg-border " +
  "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full " +
  "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"

export function separatorClasses(opts?: {
  orientation?: SeparatorOrientation
  class?: ClassValue
}): string {
  return cn(base, opts?.class)
}

type SeparatorProps = {
  orientation?: SeparatorOrientation
  decorative?: boolean
  class?: ClassValue
  id?: string
}

export function Separator(props: SeparatorProps) {
  const { orientation = "horizontal", decorative = true, class: className, id } = props
  const classes = separatorClasses({ orientation, class: className })
  // Horizontal + semantic → native <hr> (has implicit role="separator" so
  // AT announces; we strip the default margin via Tailwind classes).
  if (!decorative && orientation === "horizontal") {
    return (
      <hr
        id={id}
        data-slot="separator"
        data-orientation="horizontal"
        // <hr> already carries role=separator. We set aria-orientation
        // explicitly to be defensive against older AT that read the
        // implicit role but want explicit attribute.
        aria-orientation="horizontal"
        class={cn(classes, "border-0")}
      />
    )
  }
  return (
    <div
      id={id}
      data-slot="separator"
      data-orientation={orientation}
      // decorative: drop the implicit role. Browser default for <div> is
      // generic. Setting role="none" is redundant but signals intent.
      role={decorative ? undefined : "separator"}
      aria-orientation={!decorative ? orientation : undefined}
      class={classes}
    />
  )
}
