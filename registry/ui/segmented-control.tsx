/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Segmented control — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A compact, horizontally-joined set of mutually-exclusive options
// (List / Grid, Day / Week / Month). It selects a *value*, not a panel —
// that is what makes it a radio group rather than tabs. There is no
// tablist / tabpanel relationship here; picking a segment just changes a
// form value (and, optionally, fires an htmx request).
//
// Built on the native radio group: a <fieldset> groups the options, the
// <legend> names the group, and N <input type="radio"> share a `name` so
// the browser handles arrow-key navigation, roving focus, and
// one-selected-at-a-time for free — zero JS.
//
// Sources read while building this:
//   - Settings UI pattern (grouped controls inside a <fieldset>, each
//     option = label + appearance:none input styled via :checked):
//     repos/web.dev/src/site/content/en/patterns/components/settings/index.md
//     repos/web.dev/src/site/content/en/patterns/components/settings/assets/body.html
//     repos/web.dev/src/site/content/en/patterns/components/settings/assets/style.css
//   - Why a real grouped <input>, not a styled <div> (label association,
//     keyboard + AT semantics come free):
//     repos/web.dev/src/site/content/en/learn/forms/accessibility/index.md:50-66
//   - Native radio behaviour (arrow keys move + select within a name group,
//     only one :checked):
//     repos/mdn/files/en-us/web/html/reference/elements/input/radio/index.md
//   - APG radio group contract (Tab enters on the checked item; arrows move
//     between items): repos/aria-practices/content/patterns/radio/
//   - htmx v4 — change is the default trigger for inputs; wrap in a <form>
//     to post on every pick:
//     repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md:39
//
// Style analogue: registry/ui/radio-group.tsx (same appearance-none +
// :checked approach) and registry/ui/tabs.tsx (the joined, muted-track look).
//
// Composition (mirrors shadcn's API shape):
//   <SegmentedControl name="view" ariaLabel="View" defaultValue="list">
//     <SegmentedControlItem value="list">List</SegmentedControlItem>
//     <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
//   </SegmentedControl>

export type SegmentedControlSize = "default" | "sm"

type SegmentedControlProps = PropsWithChildren<{
  // Shared radio name — every <SegmentedControlItem> inside reuses it so the
  // browser groups them. Required.
  name: string
  // Value of the segment that starts selected. Pass the same string to the
  // matching item's `value` (or just set `checked` on that item).
  defaultValue?: string
  size?: SegmentedControlSize
  disabled?: boolean
  // The whole control is a labelled group. Provide a visible label via the
  // <legend> (ariaLabel renders one, visually hidden) or point at an existing
  // element with ariaLabelledby.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  class?: ClassValue
  // htmx / data / aria attributes ride along onto the <fieldset>. Wrap the
  // control in a <form hx-post … hx-trigger="change"> to persist the pick.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

// The track: a muted, rounded, inline-flex bar — same visual language as the
// TabsList, but it holds radios instead of role="tab" buttons.
const trackBase =
  "group/segmented inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-[3px] text-muted-foreground " +
  "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 " +
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"

const trackSize: Record<SegmentedControlSize, string> = {
  default: "h-9",
  sm: "h-8 text-xs",
}

export function segmentedControlTrackClasses(opts?: {
  size?: SegmentedControlSize
  class?: ClassValue
}): string {
  return cn(trackBase, trackSize[opts?.size ?? "default"], opts?.class)
}

export function SegmentedControl(props: SegmentedControlProps) {
  const {
    name,
    defaultValue,
    size = "default",
    disabled,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    class: className,
    children,
    ...rest
  } = props
  return (
    <fieldset
      data-slot="segmented-control"
      data-name={name}
      data-size={size}
      data-default-value={defaultValue}
      data-disabled={disabled ? "true" : undefined}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      class={segmentedControlTrackClasses({ size, class: className })}
      {...rest}
    >
      {/* A <legend> names the group for assistive tech. We hide it visually
          (sr-only) by default since the segment labels usually carry the
          meaning; pass ariaLabel to populate it. */}
      {ariaLabel ? (
        <legend class="sr-only">{ariaLabel}</legend>
      ) : null}
      {children}
    </fieldset>
  )
}

// Each segment: a <label> wrapping an appearance-none radio (the .peer) and
// the visible text. The label is what we paint; peer-checked promotes it to
// the "active" look (raised card on the muted track), exactly like the
// selected TabsTrigger — but driven purely by the native :checked state.
const itemBase =
  "relative inline-flex h-[calc(100%-2px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all select-none " +
  "hover:text-foreground " +
  // The radio is visually collapsed but stays in the layout for hit-testing
  // and as the .peer that styles the label.
  "has-[:checked]:bg-background has-[:checked]:text-foreground has-[:checked]:shadow-sm " +
  "dark:has-[:checked]:border-input dark:has-[:checked]:bg-input/30 dark:has-[:checked]:text-foreground " +
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const inputBase =
  "peer sr-only"

export function segmentedControlItemClasses(opts?: { class?: ClassValue }): string {
  return cn(itemBase, opts?.class)
}

type SegmentedControlItemProps = PropsWithChildren<{
  // Value submitted (and matched against the parent defaultValue) when this
  // segment is selected.
  value: string
  // The parent SegmentedControl sets the shared name; pass it through when
  // you render items outside the <SegmentedControl> wrapper.
  name?: string
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  ariaLabel?: string
  class?: ClassValue
  // htmx / data / aria attributes ride along onto the underlying <input>.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function SegmentedControlItem(props: SegmentedControlItemProps) {
  const {
    value,
    name,
    id,
    checked,
    defaultChecked,
    disabled,
    required,
    ariaLabel,
    class: className,
    children,
    ...rest
  } = props
  return (
    <label
      data-slot="segmented-control-item"
      data-value={value}
      class={segmentedControlItemClasses({ class: className })}
    >
      <input
        type="radio"
        class={inputBase}
        value={value}
        name={name}
        id={id}
        checked={checked}
        // hono/jsx renders defaultChecked as the `checked` attribute on SSR.
        // Keep both props so callers can use either spelling.
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        data-slot="segmented-control-input"
        {...rest}
      />
      <span data-slot="segmented-control-label">{children}</span>
    </label>
  )
}
