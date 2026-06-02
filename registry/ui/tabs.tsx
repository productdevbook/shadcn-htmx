/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Tabs — shadcn-htmx, htmx v4 + Tailwind v4.
//
// We follow the WAI-ARIA APG tabs pattern:
//   repos/aria-practices/content/patterns/tabs/tabs-pattern.html
//
// shadcn's React Tabs uses Radix. For our SSR + tiny-JS setup, we render
// real <button role="tab"> elements and <div role="tabpanel"> siblings, then
// public/site.js wires up the keyboard contract (Arrow keys + Home/End +
// Enter/Space) and click handling. The whole component degrades gracefully:
// without JS, the initial active tab is still visible.
//
// Composition (matches shadcn's API):
//   <Tabs id="my-tabs" value="account">
//     <TabsList>
//       <TabsTrigger value="account">Account</TabsTrigger>
//       <TabsTrigger value="password">Password</TabsTrigger>
//     </TabsList>
//     <TabsContent value="account">…</TabsContent>
//     <TabsContent value="password">…</TabsContent>
//   </Tabs>

export type TabsOrientation = "horizontal" | "vertical"
export type TabsActivation = "automatic" | "manual"

type TabsProps = PropsWithChildren<{
  // The id is required so site.js can scope its keyboard handlers per group
  // and so panels can be aria-labelledby their trigger.
  id: string
  // Initial active value. Each TabsTrigger / TabsContent passes a matching
  // `value` and the one matching this prop is shown.
  value: string
  orientation?: TabsOrientation
  // APG tabs pattern allows two activation modes:
  //   - "automatic" (default): arrow keys move focus AND activate the tab.
  //     Best when revealing a panel is cheap.
  //   - "manual": arrow keys only move focus; the user must press Space or
  //     Enter to activate. Best when activating a tab is expensive (network
  //     request, large render, side effects).
  // See repos/aria-practices/content/patterns/tabs/tabs-pattern.html:49,104-107.
  activation?: TabsActivation
  class?: ClassValue
}>

export function Tabs(props: TabsProps) {
  const {
    id,
    value,
    orientation = "horizontal",
    activation = "automatic",
    class: className,
    children,
  } = props
  // Inline script runs immediately after this element is parsed, so the
  // active trigger / panel get their state set before paint — no flicker.
  // It also leaves data-tabs-ready on the container so site.js knows the
  // group is already bootstrapped and only needs interaction handlers.
  //
  // aria-controls on each trigger references the panel id, per APG:
  //   repos/aria-practices/content/patterns/tabs/tabs-pattern.html:132
  const boot = `(function(el){
    var active = el.getAttribute('data-active-tab');
    el.querySelectorAll('[data-tab-panel]').forEach(function(p){
      var value = p.getAttribute('data-tab-panel');
      p.id = el.id + '-panel-' + value;
    });
    el.querySelectorAll('[data-tab-trigger]').forEach(function(t){
      var value = t.getAttribute('data-tab-trigger');
      var on = value === active;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      t.setAttribute('aria-controls', el.id + '-panel-' + value);
      t.id = el.id + '-trigger-' + value;
    });
    el.querySelectorAll('[data-tab-panel]').forEach(function(p){
      var value = p.getAttribute('data-tab-panel');
      var on = value === active;
      if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      p.setAttribute('aria-labelledby', el.id + '-trigger-' + value);
    });
    var list = el.querySelector('[role="tablist"]');
    if (list) list.setAttribute('aria-orientation', el.getAttribute('data-orientation') === 'vertical' ? 'vertical' : 'horizontal');
    el.setAttribute('data-tabs-ready','true');
  })(document.currentScript.previousElementSibling);`
  return (
    <>
      <div
        id={id}
        data-slot="tabs"
        data-tabs
        data-orientation={orientation}
        data-activation={activation}
        data-active-tab={value}
        class={cn(
          "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
          className,
        )}
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

type TabsListProps = PropsWithChildren<{
  class?: ClassValue
  ariaLabel?: string
}>

export function TabsList(props: TabsListProps) {
  const { class: className, ariaLabel, children } = props
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      data-slot="tabs-list"
      class={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
        className,
      )}
    >
      {children}
    </div>
  )
}

type TabsTriggerProps = PropsWithChildren<{
  value: string
  disabled?: boolean
  class?: ClassValue
}>

export function TabsTrigger(props: TabsTriggerProps) {
  const { value, disabled, class: className, children } = props
  // aria-selected and tabindex are set at render time based on the parent
  // Tabs' active value. site.js maintains them on switch. Both renderings
  // (server + client) use the same source of truth.
  return (
    <button
      type="button"
      role="tab"
      data-slot="tabs-trigger"
      data-tab-trigger={value}
      disabled={disabled}
      class={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all",
        "hover:text-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm",
        "dark:aria-selected:border-input dark:aria-selected:bg-input/30 dark:aria-selected:text-foreground",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      {children}
    </button>
  )
}

type TabsContentProps = PropsWithChildren<{
  value: string
  class?: ClassValue
  // htmx and arbitrary attributes ride along onto the underlying panel div.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function TabsContent(props: TabsContentProps) {
  const { value, class: className, children, ...rest } = props as any
  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      data-tab-panel={value}
      tabindex={0}
      class={cn(
        "flex-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
