/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Output — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A live result region: the outcome of a calculation or a server action,
// tied to the inputs that produced it via the `for` attribute.
//
// Source of truth — we render the real native <output> element:
//   repos/mdn/files/en-us/web/html/reference/elements/output/index.md
//     - `for`  — space-separated list of the ids of elements that
//       contributed input values to the calculation (lines 16-17).
//     - `form` — associate the output with a <form> elsewhere in the
//       document by its id; overrides an ancestor <form> (lines 18-21).
//     - `name` — the element's name in the form.elements API (lines 23-24).
//     - "Implicit ARIA role: status" (lines 119-120). shadcn/ui ships no
//       Output component — this is a native-platform addition.
//
// Why no JS: <output>'s implicit role="status" IS a live region with an
// implicit aria-live="polite" and aria-atomic="true":
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/status_role/index.md:18
//   repos/mdn/files/en-us/web/accessibility/aria/guides/live_regions/index.md:12
//     "Including ... role='status' ... works as long as you add the
//      attribute before the changes occur ... Start with an empty live
//      region, then change the content inside the region."
// So an htmx swap of the output's CONTENT (hx-swap="innerHTML", with the
// <output> itself as the persistent target) is announced automatically —
// no aria-live wiring, no site.js. Native semantics do the work.
//
// htmx note: target the <output> and swap innerHTML so the live region
// element persists across requests (a fresh outerHTML swap would replace
// the region each time and defeat the announcement contract above).
//   repos/htmx/www/reference.md — hx-target, hx-swap (innerHTML).

export type OutputTone = "default" | "muted" | "primary" | "destructive"

const base =
  "inline-flex min-h-9 w-fit items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium tabular-nums transition-colors " +
  // htmx v4 adds .htmx-request to the swap target while a request that
  // targets it is in flight — dim the stale value so the update reads as
  // a refresh. See repos/htmx/www/reference.md (htmx-request class).
  "[&.htmx-request]:opacity-60"

const tones: Record<OutputTone, string> = {
  default: "border-border bg-card text-card-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
  primary: "border-transparent bg-primary text-primary-foreground",
  destructive:
    "border-destructive/30 bg-destructive/5 text-destructive dark:bg-destructive/10",
}

export function outputClasses(opts?: {
  tone?: OutputTone
  class?: ClassValue
}): string {
  const tone = opts?.tone ?? "default"
  return cn(base, tones[tone], opts?.class)
}

type OutputProps = {
  // Space-separated list of the ids of the inputs that feed this result.
  // Ties the output to its sources (MDN <output for>). React calls this
  // `htmlFor`; on the native element it's the `for` attribute.
  htmlFor?: string
  // Associate with a <form> elsewhere in the document by its id. Without
  // it, the output belongs to its nearest ancestor <form>, if any.
  form?: string
  // The element's name in the form.elements API.
  name?: string
  id?: string
  tone?: OutputTone
  class?: ClassValue
  // The result value / content. With an htmx swap, this is the initial
  // (often placeholder) content that gets replaced in place.
  children?: Child

  // Accessible name. <output> already announces via its implicit
  // role="status"; a name lets AT preface the value (e.g. "Total: 42").
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  // Override the implicit aria-atomic="true" if you only want the changed
  // bits announced (rare — leave the implicit value in most cases).
  ariaAtomic?: boolean

  // htmx — point at this <output> as the persistent target and swap its
  // innerHTML so the live region stays put and announcements fire.
  "hx-get"?: string
  "hx-post"?: string
  "hx-put"?: string
  "hx-patch"?: string
  "hx-delete"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-include"?: string
  "hx-vals"?: string
  "hx-indicator"?: string
}

export function Output(props: OutputProps) {
  const {
    htmlFor,
    form,
    name,
    id,
    tone,
    class: className,
    children,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaAtomic,
    ...rest
  } = props
  return (
    <output
      id={id}
      for={htmlFor}
      form={form}
      name={name}
      data-slot="output"
      data-tone={tone ?? "default"}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-atomic={ariaAtomic === undefined ? undefined : ariaAtomic}
      class={outputClasses({ tone, class: className })}
      {...rest}
    >
      {children}
    </output>
  )
}
