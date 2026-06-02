/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Toast — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn upstream uses sonner (third-party). We don't. The htmx-native
// pattern is:
//
//   1. Render <ToastViewport id="toast-viewport" /> ONCE in your layout.
//   2. From any htmx trigger, post to an endpoint that returns a <Toast>
//      fragment with hx-target="#toast-viewport" hx-swap="beforeend".
//   3. site.js auto-dismisses the toast after data-duration ms; the user
//      can also click the close button.
//
// Accessibility:
//   - The viewport is role="region" with aria-label so AT users can find
//     and tab into the "Notifications" landmark.
//   - Each toast carries its own role/aria-live based on `live` (polite
//     by default, assertive for urgent).
//   - Focus is NOT moved to the toast (it would interrupt the user's
//     work). Instead, the live region announces the message inline.
//
// Refs:
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-live/
//   repos/aria-practices/content/patterns/alert/ (informs the alert role)
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/status_role/

export type ToastViewportPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"

const VIEWPORT_POSITION: Record<ToastViewportPosition, string> = {
  "top-right": "top-4 right-4 flex-col items-end",
  "top-left": "top-4 left-4 flex-col items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col items-center",
  "bottom-right": "bottom-4 right-4 flex-col-reverse items-end",
  "bottom-left": "bottom-4 left-4 flex-col-reverse items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
}

type ToastViewportProps = PropsWithChildren<{
  id?: string
  position?: ToastViewportPosition
  ariaLabel?: string
  class?: ClassValue
}>

export function ToastViewport(props: ToastViewportProps) {
  const {
    id = "toast-viewport",
    position = "bottom-right",
    ariaLabel = "Notifications",
    class: className,
    children,
  } = props
  return (
    <ol
      id={id}
      role="region"
      aria-label={ariaLabel}
      data-slot="toast-viewport"
      data-position={position}
      class={cn(
        "pointer-events-none fixed z-50 flex w-full max-w-[420px] gap-2 p-2",
        VIEWPORT_POSITION[position],
        className,
      )}
    >
      {children}
    </ol>
  )
}

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"
export type ToastLive = "polite" | "assertive"

const toastBase =
  "pointer-events-auto relative grid w-full grid-cols-[0_1fr_auto] items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm text-card-foreground shadow-lg " +
  "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:gap-x-3 " +
  "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current " +
  // Entrance animation via Tailwind v4 keyframes. The viewport position
  // determines the slide direction (see CSS keyframes in input.css).
  "animate-[scn-toast-in_180ms_ease-out] " +
  "data-[state=closed]:animate-[scn-toast-out_140ms_ease-in]"

const toastVariants: Record<ToastVariant, string> = {
  default: "",
  destructive:
    "border-destructive/30 bg-destructive/5 text-destructive *:data-[slot=toast-description]:text-destructive/90",
  success:
    "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 *:data-[slot=toast-description]:text-emerald-700/90 dark:*:data-[slot=toast-description]:text-emerald-300/90",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 *:data-[slot=toast-description]:text-amber-800/90 dark:*:data-[slot=toast-description]:text-amber-200/90",
  info:
    "border-sky-500/30 bg-sky-500/5 text-sky-800 dark:text-sky-200 *:data-[slot=toast-description]:text-sky-800/90 dark:*:data-[slot=toast-description]:text-sky-200/90",
}

type ToastProps = PropsWithChildren<{
  variant?: ToastVariant
  // Auto-dismiss timeout in ms. Set 0 to keep the toast until the user
  // closes it manually (useful for important confirmations).
  duration?: number
  // Live-region politeness. "polite" (default) for normal notifications;
  // "assertive" for urgent (errors after submit, lost connection).
  live?: ToastLive
  // Show the X close button (default true).
  showClose?: boolean
  id?: string
  class?: ClassValue
}>

export function Toast(props: ToastProps) {
  const {
    children,
    variant = "default",
    duration = 5000,
    live = "polite",
    showClose = true,
    id,
    class: className,
  } = props
  const role = live === "assertive" ? "alert" : "status"
  return (
    <li
      id={id}
      data-slot="toast"
      data-variant={variant}
      data-state="open"
      data-duration={duration}
      role={role}
      aria-live={live}
      aria-atomic="true"
      class={cn(toastBase, toastVariants[variant], className)}
    >
      {children}
      {showClose && (
        <button
          type="button"
          data-toast-close="true"
          aria-label="Dismiss notification"
          class="col-start-3 row-span-2 row-start-1 inline-flex size-6 -translate-y-0.5 items-center justify-center self-start rounded-md text-current opacity-60 transition-opacity hover:bg-current/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </li>
  )
}

export function ToastTitle(props: PropsWithChildren<{ class?: ClassValue }>) {
  return (
    <div
      data-slot="toast-title"
      class={cn("col-start-2 line-clamp-1 font-medium tracking-tight", props.class)}
    >
      {props.children}
    </div>
  )
}

export function ToastDescription(
  props: PropsWithChildren<{ class?: ClassValue }>,
) {
  return (
    <div
      data-slot="toast-description"
      class={cn("col-start-2 text-sm text-muted-foreground", props.class)}
    >
      {props.children}
    </div>
  )
}
