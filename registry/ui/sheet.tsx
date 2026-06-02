/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Sheet — shadcn-htmx, htmx v4 + Tailwind v4.
//
// An edge-anchored slide-in drawer (left / right / top / bottom) that reuses
// the native HTML <dialog> element + .showModal(). It is the SAME machinery as
// registry/ui/dialog.tsx — we just pin the box to a viewport edge and let it
// fill that edge instead of centring it.
//
// Why native <dialog> + showModal():
//   - Focus trap, ESC-to-close, focus restoration, the inert ::backdrop and
//     aria-modal="true" all come from the platform — no JS focus management.
//     See repos/mdn/files/en-us/web/api/htmldialogelement/showmodal/index.md
//     and repos/mdn/files/en-us/web/api/htmldialogelement/index.md.
//   - The trigger/close wiring is shared with Dialog: site.js listens for
//     [data-dialog-trigger]/[data-dialog-target] (→ .showModal()) and
//     [data-dialog-close] (→ .requestClose()/.close()). We add NOTHING new to
//     site.js — a Sheet is a <dialog> with data-slot="sheet".
//
// Light dismiss (click the backdrop / dim area to close) is the native
// `closedby="any"` attribute from the HTML Living Standard, NOT a JS hack:
//   - "any"          — ESC, light dismiss (backdrop click), and code
//   - "closerequest" — ESC + code only  (the showModal() default)
//   - "none"         — code only
// See repos/mdn/files/en-us/web/api/htmldialogelement/closedby/index.md and
// repos/mdn/files/en-us/web/html/reference/elements/dialog/index.md (the
// `closedby` attribute). When closedby="any", site.js leaves backdrop handling
// to the browser; otherwise we fall back to the data-close-on-backdrop hook.
//
// Anatomy mirrors shadcn's React Sheet
// (repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/sheet.tsx):
//   Sheet / SheetTrigger / SheetClose / SheetHeader / SheetTitle /
//   SheetDescription / SheetBody / SheetFooter. shadcn portals an overlay +
//   content; we don't need a portal — <dialog> already lives in the top layer.
//
//   <SheetTrigger sheetFor="nav">
//     <Button variant="outline">Open menu</Button>
//   </SheetTrigger>
//
//   <Sheet id="nav" side="left">
//     <SheetHeader>
//       <SheetTitle>Navigation</SheetTitle>
//       <SheetDescription>Jump to a section.</SheetDescription>
//     </SheetHeader>
//     <SheetBody>…links…</SheetBody>
//     <SheetFooter>
//       <SheetClose><Button variant="outline">Close</Button></SheetClose>
//     </SheetFooter>
//   </Sheet>

type Side = "top" | "right" | "bottom" | "left"

// Base: a flex column pinned to a viewport edge. The native <dialog> sits in
// the top layer; `hidden open:flex` keeps it out of layout until opened.
// outline-none because focus management is the browser's job (showModal()).
const sheetBase =
  "fixed z-50 m-0 flex flex-col gap-4 bg-background p-6 text-foreground shadow-lg outline-none " +
  // The slide-in keyframes + reduced-motion guard live in input.css, keyed off
  // data-slot="sheet" + data-side. They animate transform from off-screen.
  "hidden open:flex " +
  // ::backdrop dim — same token palette as Dialog (registry/ui/dialog.tsx).
  "backdrop:bg-black/60 backdrop:backdrop-blur-sm"

// Per-edge anchoring + sizing. Side drawers fill the cross-axis (h-full /
// w-full) and cap their main-axis size; top/bottom sheets size to content.
//
// The cross-axis inset is reset to `auto` (left-auto / right-auto / top-auto /
// bottom-auto) because a modal <dialog> inherits the UA rule `inset: 0`. Left
// unchecked, a right-anchored sheet would get BOTH left:0 AND right:0 — over-
// constrained, the browser keeps left:0 and the box hugs the WRONG edge, so it
// covers the dim area and a backdrop click lands on the dialog (no light
// dismiss). Pinning only the anchored edge (and clearing the opposite one)
// keeps the box on its edge and leaves the backdrop clickable.
const sideMap: Record<Side, string> = {
  right: "inset-y-0 right-0 left-auto h-full w-3/4 max-w-sm border-l",
  left: "inset-y-0 left-0 right-auto h-full w-3/4 max-w-sm border-r",
  top: "inset-x-0 top-0 bottom-auto w-full border-b",
  bottom: "inset-x-0 bottom-0 top-auto w-full border-t",
}

export function sheetClasses(opts?: { side?: Side; class?: ClassValue }): string {
  return cn(sheetBase, sideMap[opts?.side ?? "right"], opts?.class)
}

type SheetProps = PropsWithChildren<{
  id: string
  // Which viewport edge the sheet slides in from.
  side?: Side
  // Pre-open on initial render (for htmx swaps that return an already-open
  // sheet; site.js promotes <dialog open> to .showModal()).
  open?: boolean
  // Native `closedby` (HTML Living Standard). Defaults to "any" so a click on
  // the dim backdrop dismisses the sheet — the expected drawer behaviour.
  // See repos/mdn/.../api/htmldialogelement/closedby/index.md.
  closedby?: "any" | "closerequest" | "none"
  // Render the X close button in the top-right corner (default true).
  showCloseButton?: boolean
  class?: ClassValue
  ariaLabelledby?: string
  ariaDescribedby?: string
}>

export function Sheet(props: SheetProps) {
  const {
    id,
    children,
    side = "right",
    open,
    closedby = "any",
    showCloseButton = true,
    class: className,
    ariaLabelledby,
    ariaDescribedby,
  } = props
  return (
    <dialog
      id={id}
      open={open}
      class={sheetClasses({ side, class: className })}
      data-slot="sheet"
      data-side={side}
      // closedby="any" → browser handles ESC + light dismiss natively, so we
      // do NOT emit data-close-on-backdrop (site.js skips backdrop handling
      // when closedby="any"). For "closerequest"/"none" we add the JS hook so
      // a backdrop click still closes when the consumer opted into it.
      closedby={closedby}
      {...(closedby !== "any" ? { "data-close-on-backdrop": "true" } : {})}
      // <dialog> has the implicit role="dialog"; showModal() adds
      // aria-modal="true". A labelled/described sheet announces correctly.
      aria-labelledby={ariaLabelledby ?? `${id}-title`}
      aria-describedby={ariaDescribedby ?? `${id}-description`}
    >
      {children}
      {showCloseButton && (
        <button
          type="button"
          data-dialog-close="true"
          aria-label="Close"
          class="absolute top-4 right-4 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </dialog>
  )
}

export function SheetHeader(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="sheet-header"
      class={cn("flex flex-col gap-1.5 text-left", props.class)}
    >
      {props.children}
    </div>
  )
}

export function SheetTitle(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <h2
      id={props.id}
      data-slot="sheet-title"
      class={cn("text-lg leading-none font-semibold", props.class)}
    >
      {props.children}
    </h2>
  )
}

export function SheetDescription(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <p
      id={props.id}
      data-slot="sheet-description"
      class={cn("text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </p>
  )
}

// Body — the scrollable middle region. flex-1 + overflow-y-auto so a long body
// (a nav list, a form) scrolls inside the drawer while header/footer stay put.
export function SheetBody(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="sheet-body"
      class={cn("flex-1 overflow-y-auto text-sm text-foreground", props.class)}
    >
      {props.children}
    </div>
  )
}

// Footer — pinned to the bottom of the drawer (mt-auto) with stacked actions.
export function SheetFooter(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="sheet-footer"
      class={cn("mt-auto flex flex-col gap-2", props.class)}
    >
      {props.children}
    </div>
  )
}

// Close — wraps any single child (a Button works) and attaches
// data-dialog-close so site.js calls .requestClose()/.close() on the nearest
// <dialog>. Shares Dialog's close handler — no new site.js.
export function SheetClose(props: PropsWithChildren<{}>) {
  return (
    <span data-dialog-close="true" class="contents">
      {props.children}
    </span>
  )
}

// Trigger — clicks open the sheet whose id matches sheetFor. Shares Dialog's
// site.js handler (data-dialog-trigger / data-dialog-target → .showModal()).
type SheetTriggerProps = PropsWithChildren<{
  sheetFor: string
  class?: ClassValue
  // "wrapper" (default — wraps the child so the parent can pass a styled
  // Button) or "button" (render a native <button> with the provided class).
  render?: "wrapper" | "button"
  type?: "button" | "submit"
  id?: string
}>
export function SheetTrigger(props: SheetTriggerProps) {
  const {
    sheetFor,
    render = "wrapper",
    children,
    class: className,
    id,
    type = "button",
  } = props
  if (render === "button") {
    return (
      <button
        id={id}
        type={type}
        class={cn(className)}
        data-dialog-trigger="true"
        data-dialog-target={sheetFor}
        aria-haspopup="dialog"
      >
        {children}
      </button>
    )
  }
  return (
    <span
      data-dialog-trigger="true"
      data-dialog-target={sheetFor}
      class="contents"
    >
      {children}
    </span>
  )
}
