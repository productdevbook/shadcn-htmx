/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// AlertDialog — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn source of truth: repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/
// alert-dialog.tsx (Radix AlertDialog). We mirror its anatomy
// (Trigger / Content / Header / Title / Description / Footer / Action /
// Cancel) but ship a native HTML <dialog> instead of a Radix portal.
//
// APG pattern: repos/aria-practices/content/patterns/alertdialog/
// alertdialog-pattern.html. An alert dialog is a *modal* dialog that
// interrupts the workflow to acquire a response, so APG requires:
//   - role="alertdialog"        (announced with higher urgency than dialog)
//   - aria-modal="true"         (set automatically by .showModal())
//   - aria-labelledby -> title  (visible label)
//   - aria-describedby -> body  (the alert message — REQUIRED, unlike dialog)
// See alertdialog-pattern.html:44-61.
//
// Why native <dialog> + showModal():
//   - Focus trap, ESC-to-close, focus restoration, the inert backdrop and
//     aria-modal all come from the platform — no JS focus management.
//     (repos/mdn/files/en-us/web/api/htmldialogelement/showmodal/.)
//
// HOW IT DIFFERS FROM Dialog (registry/ui/dialog.tsx):
//   - NOT light-dismissible. A modal opened with showModal() defaults to
//     closedby="closerequest" (ESC + code only, NO backdrop click) per the
//     HTML Living Standard — repos/mdn/files/en-us/web/html/reference/
//     elements/dialog/index.md:33-35. We pin closedby="closerequest" to make
//     that explicit and we do NOT emit the data-close-on-backdrop hook that
//     site.js uses for Dialog, so a click on the backdrop never dismisses.
//   - No X close button: APG requires an explicit Cancel / Confirm response.
//   - Reuses Dialog's open/close wiring in public/site.js
//     (data-dialog-trigger / data-dialog-close).
//
// Composition mirrors shadcn's React API:
//   <AlertDialogTrigger dialogFor="confirm">
//     <Button variant="destructive">Delete</Button>
//   </AlertDialogTrigger>
//
//   <AlertDialog id="confirm">
//     <AlertDialogHeader>
//       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//       <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
//     </AlertDialogHeader>
//     <AlertDialogFooter>
//       <AlertDialogCancel><Button variant="outline">Cancel</Button></AlertDialogCancel>
//       <AlertDialogAction><Button variant="destructive">Delete</Button></AlertDialogAction>
//     </AlertDialogFooter>
//   </AlertDialog>

const alertDialogBase =
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-lg " +
  "grid gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg outline-none " +
  // Native <dialog> sits in the top layer; hide it when not open so layout
  // doesn't shift.
  "hidden open:grid " +
  // ::backdrop styling — same token palette as Dialog.
  "backdrop:bg-black/60 backdrop:backdrop-blur-sm"

export function alertDialogClasses(opts?: { class?: ClassValue }): string {
  return cn(alertDialogBase, opts?.class)
}

type AlertDialogProps = PropsWithChildren<{
  id: string
  // Pre-open on initial render (useful for htmx swaps that return an
  // already-open alert dialog; site.js promotes <dialog open> to .showModal()).
  open?: boolean
  class?: ClassValue
  // APG: name the alertdialog with EITHER aria-labelledby -> a visible title OR
  // aria-label when there is no visible AlertDialogTitle (e.g. a short error
  // alert). See alertdialog-pattern.html:47-57. When ariaLabel is set we omit
  // the auto aria-labelledby fallback so the two naming mechanisms don't collide.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
}>

export function AlertDialog(props: AlertDialogProps) {
  const {
    id,
    children,
    open,
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
  } = props
  return (
    <dialog
      id={id}
      open={open}
      class={alertDialogClasses({ class: className })}
      data-slot="alert-dialog"
      // No data-close-on-backdrop: an alert dialog must require an explicit
      // Cancel / Confirm response, so a backdrop click never dismisses it.
      // Pin the native closedby so light dismiss stays off even if a future
      // browser changes showModal() defaults.
      // See repos/mdn/.../html/reference/elements/dialog/index.md:33-35.
      closedby="closerequest"
      // APG: the container carries role="alertdialog"; .showModal() adds
      // aria-modal="true". See alertdialog-pattern.html:44-46.
      role="alertdialog"
      // APG (alertdialog-pattern.html:47-57): aria-label OR aria-labelledby.
      // An explicit ariaLabel wins and suppresses the id-title fallback so the
      // dialog isn't named twice (and doesn't reference a missing title id).
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : (ariaLabelledby ?? `${id}-title`)}
      // REQUIRED by APG (alertdialog-pattern.html:58-60): the description
      // refers to the element containing the alert message.
      aria-describedby={ariaDescribedby ?? `${id}-description`}
    >
      {children}
    </dialog>
  )
}

export function AlertDialogHeader(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="alert-dialog-header"
      class={cn("flex flex-col gap-1.5 text-left", props.class)}
    >
      {props.children}
    </div>
  )
}

export function AlertDialogTitle(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <h2
      id={props.id}
      data-slot="alert-dialog-title"
      class={cn("text-lg leading-none font-semibold", props.class)}
    >
      {props.children}
    </h2>
  )
}

export function AlertDialogDescription(
  props: PropsWithChildren<{ id?: string; class?: ClassValue }>,
) {
  return (
    <p
      id={props.id}
      data-slot="alert-dialog-description"
      class={cn("text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </p>
  )
}

export function AlertDialogFooter(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="alert-dialog-footer"
      class={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

// Cancel — the non-destructive response. Wraps any single child (a Button
// works) and attaches data-dialog-close so site.js calls .close() on the
// nearest <dialog>. APG recommends focusing the least-destructive action;
// authors should add `autofocus` to this button (see docs).
export function AlertDialogCancel(props: PropsWithChildren<{}>) {
  return (
    <span data-dialog-close="true" class="contents">
      {props.children}
    </span>
  )
}

// Action — the confirming response. Also closes the dialog after its action
// runs (e.g. an hx-* request fires on click; data-dialog-close dismisses).
// Wrap a destructive Button for delete-style confirmations.
export function AlertDialogAction(props: PropsWithChildren<{}>) {
  return (
    <span data-dialog-close="true" class="contents">
      {props.children}
    </span>
  )
}

// Trigger — clicks open the alert dialog whose id matches dialogFor. Shares
// Dialog's site.js handler (data-dialog-trigger / data-dialog-target).
type AlertDialogTriggerProps = PropsWithChildren<{
  dialogFor: string
  class?: ClassValue
  // "wrapper" (default — wraps the child so the parent can pass a styled
  // Button) or "button" (render a native <button> with the provided class).
  render?: "wrapper" | "button"
  type?: "button" | "submit"
  id?: string
}>
export function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  const {
    dialogFor,
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
        data-dialog-target={dialogFor}
        aria-haspopup="dialog"
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
