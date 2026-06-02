/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Native <label> with shadcn styling. Source of truth:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/label.tsx
//
// We render a real <label> instead of wrapping Radix Label.Root — the only
// behaviour Radix adds is "click anywhere on the label focuses the linked
// input," which the platform gives us for free via the `for` (htmlFor)
// attribute. So we keep things simple and inherit native semantics.
//
// Wire-up patterns:
//   - Explicit:  <Label htmlFor="email">Email</Label> <Input id="email" />
//   - Implicit:  <Label>Email <Input /></Label>
// Both work; explicit is preferred because it survives the input being moved
// inside a wrapper later (e.g. for layout).

const base =
  "flex items-center gap-2 text-sm leading-none font-medium select-none " +
  // Dim the label when the input inside its group is disabled (data-disabled=true
  // is shadcn's convention for "this wrapper is in a disabled state").
  "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " +
  // Dim when a sibling marked .peer carries `disabled` (the input next to us).
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"

export function labelClasses(opts?: { class?: ClassValue }): string {
  return cn(base, opts?.class)
}

type LabelProps = PropsWithChildren<{
  htmlFor?: string
  class?: ClassValue
  id?: string
}>

export function Label(props: LabelProps) {
  const { children, htmlFor, class: className, id, ...rest } = props
  return (
    <label
      id={id}
      for={htmlFor}
      class={labelClasses({ class: className })}
      data-slot="label"
      {...rest}
    >
      {children}
    </label>
  )
}
