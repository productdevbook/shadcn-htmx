/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Dialog — shadcn-htmx, htmx v4 + Tailwind v4.
//
// We use the native HTML <dialog> element + .showModal() so the platform
// gives us:
//   - Focus trap                       (no JS focus management required)
//   - ESC to close                     (browser default)
//   - aria-modal / role=dialog         (set by showModal())
//   - Focus restoration to the opener  (browser default)
//   - ::backdrop pseudo-element        (we colour it via CSS in input.css)
//
// We add on top:
//   - shadcn box styles (rounded border, shadow, centered).
//   - DialogTrigger / DialogClose data attributes wired up in public/site.js.
//   - Click-on-backdrop closes (also in site.js).
//
// Composition mirrors shadcn's React API:
//   <Dialog id="my-dialog">
//     <DialogHeader>
//       <DialogTitle>...</DialogTitle>
//       <DialogDescription>...</DialogDescription>
//     </DialogHeader>
//     <DialogBody>...form fields...</DialogBody>
//     <DialogFooter>
//       <DialogClose><Button variant="outline">Cancel</Button></DialogClose>
//       <Button>Save</Button>
//     </DialogFooter>
//   </Dialog>
//
//   <DialogTrigger dialogFor="my-dialog">Open</DialogTrigger>

const dialogBase =
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-lg " +
  "grid gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg outline-none " +
  // Native <dialog> sits at the top layer; hide it when not open so layout
  // doesn't shift.
  "hidden open:grid " +
  // ::backdrop styling.
  "backdrop:bg-black/60 backdrop:backdrop-blur-sm"

export function dialogClasses(opts?: { class?: ClassValue }): string {
  return cn(dialogBase, opts?.class)
}

type DialogProps = PropsWithChildren<{
  id: string
  // Set to false to disable the click-on-backdrop-closes behaviour. The
  // browser-native `closedby` attribute (below) is a stronger signal — if
  // you set it to "any" the browser handles backdrop dismissal natively.
  closeOnBackdrop?: boolean
  // Pre-open the dialog on initial render (useful for htmx swaps that return
  // an already-open dialog).
  open?: boolean
  // Native `closedby` attribute (HTML Living Standard / WHATWG). Controls
  // how the user can dismiss the dialog:
  //   - "any"          — ESC, light dismiss (backdrop click), and code
  //   - "closerequest" — ESC and code only  (default for showModal())
  //   - "none"         — only code can close (e.g. terms acceptance)
  // See repos/mdn/files/en-us/web/html/reference/elements/dialog/index.md:19-35
  closedby?: "any" | "closerequest" | "none"
  // role variant. "alertdialog" demands a synchronous user response and is
  // announced by assistive tech with higher urgency. APG requires it to
  // carry a description (aria-describedby).
  // See repos/aria-practices/content/patterns/alertdialog/.
  role?: "dialog" | "alertdialog"
  // Render the X close button in the top-right corner (default true).
  showCloseButton?: boolean
  class?: ClassValue
  ariaLabelledby?: string
  ariaDescribedby?: string
}>

export function Dialog(props: DialogProps) {
  const {
    id,
    children,
    closeOnBackdrop = true,
    open,
    closedby,
    role = "dialog",
    showCloseButton = true,
    class: className,
    ariaLabelledby,
    ariaDescribedby,
  } = props
  return (
    <dialog
      id={id}
      open={open}
      class={dialogClasses({ class: className })}
      data-slot="dialog"
      data-close-on-backdrop={closeOnBackdrop ? "true" : undefined}
      // Native closedby attribute (only emitted when set so we don't override
      // the browser's default of "closerequest" for showModal()).
      {...(closedby ? { closedby } : {})}
      // role override — Hono JSX renders the dialog with implicit role="dialog";
      // we set it explicitly so consumers can switch to alertdialog.
      role={role}
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

export function DialogHeader(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="dialog-header"
      class={cn("flex flex-col gap-1.5 text-left", props.class)}
    >
      {props.children}
    </div>
  )
}

export function DialogTitle(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <h2
      id={props.id}
      data-slot="dialog-title"
      class={cn("text-lg leading-none font-semibold", props.class)}
    >
      {props.children}
    </h2>
  )
}

export function DialogDescription(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <p
      id={props.id}
      data-slot="dialog-description"
      class={cn("text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </p>
  )
}

export function DialogBody(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="dialog-body"
      class={cn("text-sm text-foreground", props.class)}
    >
      {props.children}
    </div>
  )
}

export function DialogFooter(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="dialog-footer"
      class={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

// Close button wrapper — clones any single child (a Button works), attaches
// data-dialog-close so site.js can intercept the click and call .close() on
// the nearest <dialog> ancestor.
type DialogCloseProps = PropsWithChildren<{
  // If true (default), the wrapped child gets data-dialog-close attached.
  // Set false to attach to a non-child (e.g. when you render your own button
  // here and add data-dialog-close yourself).
  attachToChild?: boolean
}>
export function DialogClose(props: DialogCloseProps) {
  const { children, attachToChild = true } = props
  if (!attachToChild) return <>{children}</>
  // The simpler pattern: render a span with data-dialog-close="true"; the JS
  // event listener walks up to find the closest <dialog>. This way we don't
  // need cloneElement and the consumer can pass anything as the child.
  return (
    <span data-dialog-close="true" class="contents">
      {children}
    </span>
  )
}

// Trigger button — clicks open the dialog whose id matches dialogFor.
type DialogTriggerProps = PropsWithChildren<{
  dialogFor: string
  class?: ClassValue
  // Render mode: "wrapper" (default — wraps the child in a span so the parent
  // can pass any element like a styled Button) or "button" (render a native
  // <button> with the provided class).
  render?: "wrapper" | "button"
  type?: "button" | "submit"
  id?: string
  ariaHaspopup?: string
}>
export function DialogTrigger(props: DialogTriggerProps) {
  const { dialogFor, render = "wrapper", children, class: className, id, type = "button", ariaHaspopup = "dialog" } = props
  if (render === "button") {
    return (
      <button
        id={id}
        type={type}
        class={cn(className)}
        data-dialog-trigger="true"
        data-dialog-target={dialogFor}
        aria-haspopup={ariaHaspopup}
      >
        {children}
      </button>
    )
  }
  return (
    <span
      data-dialog-trigger="true"
      data-dialog-target={dialogFor}
      class="contents"
    >
      {children}
    </span>
  )
}
