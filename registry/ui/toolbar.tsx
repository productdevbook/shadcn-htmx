/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Toolbar — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui ships a Toolbar built on Radix Toolbar. We don't copy that React
// code; we mirror its anatomy (Toolbar / Button / ToggleItem / Separator /
// Group) and translate to SSR + tiny-JS. Source of truth for the API shape:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/toolbar.tsx (anatomy only)
//
// Accessibility contract follows the WAI-ARIA APG toolbar pattern:
//   repos/aria-practices/content/patterns/toolbar/toolbar-pattern.html
//   repos/aria-practices/content/patterns/toolbar/examples/js/FormatToolbar.js
//     (the roving-tabindex implementation we model setFocusItem/Next/Prev on)
// Role + orientation semantics from MDN:
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/toolbar_role/index.md
//
// The contract:
//   - The toolbar container has role="toolbar" and is a SINGLE tab stop.
//   - Exactly one control inside carries tabindex="0"; the rest tabindex="-1"
//     (a "roving tabindex"). ArrowLeft/ArrowRight (or Up/Down when vertical)
//     plus Home/End move that 0 between controls. See APG keyboard table.
//   - aria-orientation reflects the layout; default is horizontal (the role's
//     implicit value, set explicitly to be defensive for older AT).
//   - A separator inside a toolbar uses role="separator" with the orientation
//     PERPENDICULAR to the toolbar, is not focusable, and is skipped by the
//     arrow navigation.
//
// We render real <button> elements so Space/Enter activation, the button
// role, and disabled semantics come from the platform for free. An inline
// boot <script> sets the initial roving tabindex before paint (no flicker);
// public/site.js (keyed on data-slot="toolbar") owns the live keyboard
// contract, mirroring how Tabs is wired.
//
// Composition (matches shadcn's API):
//   <Toolbar ariaLabel="Text formatting">
//     <ToolbarToggle pressed>Bold</ToolbarToggle>
//     <ToolbarToggle>Italic</ToolbarToggle>
//     <ToolbarSeparator />
//     <ToolbarGroup ariaLabel="Alignment">
//       <ToolbarButton>Left</ToolbarButton>
//       <ToolbarButton>Center</ToolbarButton>
//     </ToolbarGroup>
//     <ToolbarSeparator />
//     <ToolbarButton asChild><a href="/docs">Docs</a></ToolbarButton>
//   </Toolbar>

import { cloneElement, isValidElement } from "hono/jsx"

export type ToolbarOrientation = "horizontal" | "vertical"

const containerBase =
  "group/toolbar flex w-fit items-center gap-1 rounded-md border bg-card p-1 shadow-xs " +
  "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch"

// Toolbar controls share the ghost/sm Button look so a row of them reads as a
// cohesive set. Kept as a const so every control (button + toggle) is visually
// identical and only their state styling differs.
const itemBase =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2.5 text-sm font-medium whitespace-nowrap text-foreground transition-all outline-none " +
  "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  // aria-disabled mirrors the disabled affordance for cases where a control
  // must stay focusable (so AT lands on it and announces it's unavailable).
  // See repos/mdn/files/en-us/web/accessibility/aria/attributes/aria-disabled/.
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  // Toggle state (aria-pressed) gets the accent fill, matching shadcn's Toggle.
  "aria-pressed:bg-accent aria-pressed:text-accent-foreground dark:aria-pressed:bg-accent/50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
  // htmx v4: mirror disabled affordance while a triggered request is in flight.
  "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

export function toolbarItemClasses(opts?: { class?: ClassValue }): string {
  return cn(itemBase, opts?.class)
}

type ToolbarProps = PropsWithChildren<{
  // Required when there's no visible label so AT can name the toolbar.
  // APG: a toolbar must be labelled via aria-label or aria-labelledby.
  ariaLabel?: string
  ariaLabelledby?: string
  orientation?: ToolbarOrientation
  class?: ClassValue
  id?: string
  // htmx and arbitrary attributes ride onto the toolbar container.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Toolbar(props: ToolbarProps) {
  const {
    ariaLabel,
    ariaLabelledby,
    orientation = "horizontal",
    class: className,
    children,
    ...rest
  } = props as any
  // Boot script: set the roving tabindex before paint so the toolbar is a
  // single tab stop immediately — the first non-disabled control gets
  // tabindex="0", every other focusable control gets tabindex="-1". This
  // runs synchronously after the element is parsed, so there's no flash of
  // all-tabbable controls before site.js loads. We model the "first
  // non-disabled control is focusable" rule on the APG example:
  //   repos/aria-practices/content/patterns/toolbar/examples/js/FormatToolbar.js
  const boot = `(function(el){
    var items = el.querySelectorAll('[data-toolbar-item]');
    var set = false;
    items.forEach(function(it){
      var off = it.hasAttribute('disabled') || it.getAttribute('aria-disabled') === 'true';
      if (!set && !off) { it.setAttribute('tabindex','0'); set = true; }
      else { it.setAttribute('tabindex','-1'); }
    });
    if (!set && items.length) items[0].setAttribute('tabindex','0');
    el.setAttribute('data-toolbar-ready','true');
  })(document.currentScript.previousElementSibling);`
  return (
    <>
      <div
        role="toolbar"
        data-slot="toolbar"
        data-orientation={orientation}
        // The role's implicit orientation is horizontal; we set it explicitly
        // so older AT reads it and so the value drives our arrow-key axis.
        aria-orientation={orientation}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        class={cn(containerBase, className)}
        {...rest}
      >
        {children}
      </div>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </>
  )
}

type ToolbarButtonProps = PropsWithChildren<{
  disabled?: boolean
  // Keep a disabled control focusable so AT announces it (APG note 2).
  ariaDisabled?: boolean
  ariaLabel?: string
  class?: ClassValue
  // Render as the single JSX child element (e.g. <a href>) with the toolbar
  // item classes merged on — SSR equivalent of shadcn/Radix `asChild`.
  asChild?: boolean
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function ToolbarButton(props: ToolbarButtonProps) {
  const {
    disabled,
    ariaDisabled,
    ariaLabel,
    class: className,
    asChild,
    children,
    ...rest
  } = props as any
  const classes = toolbarItemClasses({ class: className })
  // asChild path: clone the child (anchor, label, …) and brand it as a
  // toolbar item so the roving tabindex + arrow nav still find it. tabindex
  // is set by the boot script / site.js, not here.
  if (asChild && isValidElement(children)) {
    const child = children as any
    return cloneElement(child, {
      ...rest,
      class: cn(classes, child?.props?.class),
      "data-slot": "toolbar-button",
      "data-toolbar-item": "",
      "aria-label": ariaLabel,
      "aria-disabled": ariaDisabled ? "true" : undefined,
    })
  }
  return (
    <button
      type="button"
      data-slot="toolbar-button"
      data-toolbar-item=""
      disabled={disabled}
      aria-disabled={ariaDisabled ? "true" : undefined}
      aria-label={ariaLabel}
      class={classes}
      {...rest}
    >
      {children}
    </button>
  )
}

type ToolbarToggleProps = PropsWithChildren<{
  // APG/MDN toggle button: aria-pressed reflects the on/off state and the
  // label must stay constant across states.
  pressed?: boolean
  disabled?: boolean
  ariaDisabled?: boolean
  ariaLabel?: string
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function ToolbarToggle(props: ToolbarToggleProps) {
  const {
    pressed = false,
    disabled,
    ariaDisabled,
    ariaLabel,
    class: className,
    children,
    ...rest
  } = props as any
  return (
    <button
      type="button"
      data-slot="toolbar-toggle"
      data-toolbar-item=""
      aria-pressed={pressed ? "true" : "false"}
      disabled={disabled}
      aria-disabled={ariaDisabled ? "true" : undefined}
      aria-label={ariaLabel}
      class={toolbarItemClasses({ class: className })}
      {...rest}
    >
      {children}
    </button>
  )
}

type ToolbarSeparatorProps = {
  // The toolbar's orientation; the separator draws PERPENDICULAR to it.
  orientation?: ToolbarOrientation
  class?: ClassValue
}

export function ToolbarSeparator(props: ToolbarSeparatorProps) {
  const { orientation = "horizontal", class: className } = props
  // A separator inside a horizontal toolbar is a vertical rule, and vice
  // versa. role="separator" with aria-orientation set to the perpendicular
  // axis; NOT focusable, so the arrow navigation skips it (no
  // data-toolbar-item). See the toolbar_role MDN page + APG example markup.
  const sepOrientation = orientation === "horizontal" ? "vertical" : "horizontal"
  return (
    <div
      role="separator"
      data-slot="toolbar-separator"
      aria-orientation={sepOrientation}
      class={cn(
        "shrink-0 bg-border",
        sepOrientation === "vertical" ? "mx-0.5 h-5 w-px" : "my-0.5 h-px w-full",
        className,
      )}
    />
  )
}

type ToolbarGroupProps = PropsWithChildren<{
  // A visible label for the sub-group; rendered as aria-label on role="group".
  ariaLabel?: string
  class?: ClassValue
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function ToolbarGroup(props: ToolbarGroupProps) {
  const { ariaLabel, class: className, children, ...rest } = props as any
  // role="group" with a label lets AT announce the cluster (e.g. "Alignment")
  // without adding a tab stop — the controls inside still participate in the
  // toolbar's single roving tabindex.
  return (
    <div
      role="group"
      data-slot="toolbar-group"
      aria-label={ariaLabel}
      class={cn(
        "flex items-center gap-1 group-data-[orientation=vertical]/toolbar:flex-col group-data-[orientation=vertical]/toolbar:items-stretch",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
