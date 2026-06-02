/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Listbox — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui builds its rich Select on a Radix popover with role="listbox"
// options. We split that into two components: `Select` is the truly-native
// dropdown (<select>), and this `Listbox` is the always-visible, scrollable,
// single/multi-select widget — the APG Listbox pattern. We mirror shadcn's
// anatomy (a container + option children) but translate it to a real
// role="listbox" / role="option" tree, not a Radix portal.
//   Anatomy reference (intent only): repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/select.tsx
//
// Accessibility contract follows the WAI-ARIA APG Listbox pattern:
//   repos/aria-practices/content/patterns/listbox/listbox-pattern.html
//     (roles/states: listbox, option, aria-selected, aria-multiselectable,
//      aria-orientation; keyboard: Up/Down/Home/End, Space/Enter, type-ahead,
//      Shift/Ctrl range + Ctrl+A for multi-select)
//   repos/aria-practices/content/patterns/listbox/examples/listbox-scrollable.html
//     (the scrollable single-select example whose markup we mirror: a <ul>
//      with role="listbox" holding <li role="option"> children)
//
// Focus management — roving tabindex (NOT aria-activedescendant). The APG
// permits either; the rest of this library (Toolbar, Tabs, Menu) uses a
// roving tabindex, so we keep DOM focus on the options for consistency. The
// container <ul> is tabindex="-1"; exactly one <li role="option"> carries
// tabindex="0" (the first selected option, else the first option) and the
// rest tabindex="-1". An inline boot <script> sets that before paint (no
// flicker); public/site.js (keyed on data-slot="listbox") owns the live
// keyboard + selection contract and keeps the hidden form input in sync.
//   Roving tabindex rationale: repos/aria-practices/content/practices/keyboard-interface/keyboard-interface-practice.html
//
// Selection state uses aria-selected (APG's recommended convention for
// single-select; we keep it for multi-select too so the markup is uniform).
// The container sets aria-multiselectable="true" when multiple.
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/listbox_role/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-selected/index.md
//
// Form association: the styled listbox is a custom widget, so it does not
// submit on its own like a control. We render a sibling <input type="hidden">
// whose value mirrors the selection (a single value, or a comma-joined list
// when multiple) and keep it current from the boot script + site.js. For a
// zero-JS alternative, a native <select multiple> is the platform's listbox
// (it submits each selected <option> automatically) — use it when you don't
// need custom option rendering. See repos/mdn/files/en-us/web/html/reference/elements/select/

export type ListboxOrientation = "horizontal" | "vertical"

const containerBase =
  "max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-md border bg-background p-1 text-sm shadow-xs outline-none " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " +
  "data-[orientation=horizontal]:flex data-[orientation=horizontal]:max-h-none data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:overflow-y-hidden"

const optionBase =
  "relative flex cursor-pointer scroll-my-1 items-center gap-2 rounded-sm px-2 py-1.5 text-foreground outline-none select-none " +
  "hover:bg-accent hover:text-accent-foreground " +
  "focus-visible:bg-accent focus-visible:text-accent-foreground " +
  // Selected option gets the primary fill; matches how shadcn marks a chosen item.
  "aria-selected:bg-primary aria-selected:text-primary-foreground " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export function listboxClasses(opts?: { class?: ClassValue }): string {
  return cn(containerBase, opts?.class)
}

export function listboxOptionClasses(opts?: { class?: ClassValue }): string {
  return cn(optionBase, opts?.class)
}

type ListboxProps = PropsWithChildren<{
  // Required when there's no visible label so AT can name the listbox.
  // APG: a standalone listbox must be labelled via aria-label or aria-labelledby.
  ariaLabel?: string
  ariaLabelledby?: string
  // Allow choosing more than one option. Sets aria-multiselectable="true".
  multiple?: boolean
  // Disable the whole widget (sets aria-disabled; options become inert).
  disabled?: boolean
  // Group-level requirement: "one option must be chosen". Sets aria-required
  // on the container. The styled listbox submits via a hidden input, so the
  // native `required` attribute cannot apply — aria-required is the only way
  // to convey it. Mirrors RadioGroup's `required` -> aria-required.
  //   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/listbox_role/index.md (aria-required under States and Properties)
  required?: boolean
  // Mark the widget invalid for the WCAG error-identification pattern (e.g. a
  // required listbox submitted empty, or server validation over htmx). Pair
  // with ariaErrormessage pointing at a visible error element's id.
  //   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-invalid/index.md (listbox in Associated roles)
  ariaInvalid?: boolean
  // Id of a visible element holding the error message. Pair with ariaInvalid.
  //   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-errormessage/index.md (listbox in Associated roles)
  ariaErrormessage?: string
  // Locked-but-operable: the user cannot change the selection but the listbox
  // stays focusable/navigable. Distinct from `disabled` (which makes options
  // inert). Sets aria-readonly; mirrors Checkbox's `ariaReadonly`.
  //   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-readonly/index.md (listbox in Associated roles)
  ariaReadonly?: boolean
  // Layout axis. Default vertical; "horizontal" sets aria-orientation and
  // flips the arrow-key axis (Left/Right) in site.js.
  orientation?: ListboxOrientation
  // Name of the hidden form input that mirrors the selection. Omit to skip
  // the hidden input entirely (e.g. when you drive selection over htmx).
  name?: string
  id?: string
  class?: ClassValue
  // htmx + arbitrary attributes ride onto the listbox container. Typical:
  //   hx-post="/save" hx-trigger="listbox:change" (fired by site.js).
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Listbox(props: ListboxProps) {
  const {
    ariaLabel,
    ariaLabelledby,
    multiple,
    disabled,
    required,
    ariaInvalid,
    ariaErrormessage,
    ariaReadonly,
    orientation = "vertical",
    name,
    class: className,
    children,
    ...rest
  } = props as any
  // Boot script: establish the roving tabindex before paint (single tab stop),
  // and seed the hidden form input from the initial aria-selected options.
  // The first selected option (else the first option) gets tabindex="0".
  const boot = `(function(el){
    var opts = el.querySelectorAll('[role="option"]');
    var sel = el.querySelector('[role="option"][aria-selected="true"]:not([aria-disabled="true"])');
    var active = sel || el.querySelector('[role="option"]:not([aria-disabled="true"])');
    opts.forEach(function(o){ o.setAttribute('tabindex', o === active ? '0' : '-1'); });
    var hidden = el.parentNode && el.parentNode.querySelector('[data-listbox-value]');
    if (hidden) {
      var vals = [];
      el.querySelectorAll('[role="option"][aria-selected="true"]').forEach(function(o){
        vals.push(o.getAttribute('data-value') || (o.textContent || '').trim());
      });
      hidden.value = vals.join(',');
    }
    el.setAttribute('data-listbox-ready','true');
  })(document.currentScript.parentNode.querySelector('[data-slot="listbox"]'));`
  return (
    <span class="relative inline-flex w-full flex-col">
      <ul
        role="listbox"
        data-slot="listbox"
        data-orientation={orientation}
        aria-orientation={orientation}
        aria-multiselectable={multiple ? "true" : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-disabled={disabled ? "true" : undefined}
        // Group-level "one must be chosen" requirement (listbox supports aria-required).
        aria-required={required ? "true" : undefined}
        aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
        aria-errormessage={ariaErrormessage}
        // Locked-but-operable, distinct from aria-disabled.
        aria-readonly={ariaReadonly ? "true" : undefined}
        // The container is not in the tab order; focus lands on the options
        // (roving tabindex). tabindex="-1" lets us still programmatically
        // focus the list itself if needed without adding a tab stop.
        tabindex={-1}
        class={listboxClasses({ class: className })}
        {...rest}
      >
        {children}
      </ul>
      {/* Hidden form value — mirrors the selection so the listbox submits
          like a normal field. site.js keeps it in sync on every change. */}
      {name ? (
        <input type="hidden" name={name} data-listbox-value="" />
      ) : null}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </span>
  )
}

type ListboxOptionProps = PropsWithChildren<{
  // The value submitted via the hidden input when selected. Defaults to the
  // option's text content when omitted.
  value?: string
  // Pre-select this option. In a single-select listbox only one should be set.
  selected?: boolean
  // Keep the option in the list (and announced by AT) but unselectable.
  disabled?: boolean
  id?: string
  class?: ClassValue
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function ListboxOption(props: ListboxOptionProps) {
  const {
    value,
    selected,
    disabled,
    class: className,
    children,
    ...rest
  } = props as any
  return (
    <li
      role="option"
      data-slot="listbox-option"
      data-value={value}
      // Every selectable option carries aria-selected (true/false) per APG;
      // disabled options stay in the tree but are aria-disabled.
      aria-selected={disabled ? undefined : selected ? "true" : "false"}
      aria-disabled={disabled ? "true" : undefined}
      // tabindex is assigned by the boot script / site.js (roving tabindex).
      class={listboxOptionClasses({ class: className })}
      {...rest}
    >
      {children}
    </li>
  )
}

// A labelled cluster of options. role="group" lets AT announce the group
// name without adding a tab stop; the options inside still participate in
// the listbox's single roving tabindex.
//   repos/aria-practices/content/patterns/listbox/examples/listbox-grouped.html
type ListboxGroupProps = PropsWithChildren<{
  // Visible/accessible name for the group. APG requires grouped options to
  // have an accessible name via aria-label or aria-labelledby.
  label: string
  class?: ClassValue
}>

export function ListboxGroup(props: ListboxGroupProps) {
  const { label, class: className, children } = props
  return (
    <li role="presentation" data-slot="listbox-group-wrapper" class={cn("py-1", className)}>
      <span
        aria-hidden="true"
        class="px-2 py-1 text-xs font-medium text-muted-foreground"
      >
        {label}
      </span>
      <ul role="group" data-slot="listbox-group" aria-label={label} class="contents">
        {children}
      </ul>
    </li>
  )
}
