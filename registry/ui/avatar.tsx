/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Avatar — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Source of truth (variants):
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/avatar.tsx
//
// shadcn upstream uses Radix Avatar which manages a load/error state
// machine (show fallback while image fetches, after fetch fails, etc.).
// For SSR we render both layers — the fallback as a sibling, then the
// <img> on top via absolute positioning. If the image loads, it covers
// the fallback; if it errors, an inline onerror handler hides it,
// revealing the fallback. Zero JS framework needed.
//
// MDN <img>: repos/mdn/files/en-us/web/html/reference/elements/img/index.md
//
// Accessibility:
//   - The Avatar root carries the accessible name via the <img>'s alt
//     when src is provided; when not, pass `ariaLabel` to the root so AT
//     announces "MK avatar" or similar.
//   - For purely decorative avatars (next to a name that's already in the
//     DOM), pass alt="" so AT skips it.

export type AvatarSize = "sm" | "default" | "lg"

const rootSize: Record<AvatarSize, string> = {
  sm: "size-6 [&_[data-slot=avatar-fallback]]:text-xs",
  default: "size-8",
  lg: "size-10",
}

type AvatarProps = PropsWithChildren<{
  size?: AvatarSize
  // The image URL. When undefined, only the fallback renders.
  src?: string
  alt?: string
  // Fallback text — typically initials. Ignored when children are provided.
  fallback?: string
  // Accessible name for the avatar group when there's no img (no alt).
  ariaLabel?: string
  // Native <img loading>. Avatars are often off-screen in long lists, so
  // loading="lazy" defers fetching until near the viewport.
  // MDN <img>: .../elements/img/index.md "loading".
  loading?: "eager" | "lazy"
  // Native <img referrerpolicy>. Avatar src is often a third-party host
  // (Gravatar/OAuth/CDN); e.g. "no-referrer" avoids leaking the page URL.
  // MDN <img>: .../elements/img/index.md "referrerpolicy".
  referrerpolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url"
  // Native <img srcset>/<img sizes>. Primarily for the retina "2x" pixel
  // density descriptor on small fixed-size avatars; src is the 1x fallback.
  // MDN <img>: .../elements/img/index.md "srcset".
  srcset?: string
  sizes?: string
  class?: ClassValue
}>

export function Avatar(props: AvatarProps) {
  const { size = "default", src, alt, fallback, ariaLabel, loading, referrerpolicy, srcset, sizes, class: className, children } = props
  return (
    <span
      data-slot="avatar"
      data-size={size}
      role={!src && (fallback || children) ? "img" : undefined}
      aria-label={!src ? ariaLabel ?? fallback : undefined}
      class={cn(
        "group/avatar relative inline-flex shrink-0 overflow-hidden rounded-full select-none",
        rootSize[size],
        className,
      )}
    >
      {/* Fallback layer — visible by default; covered by the <img> if it
          loads successfully. Children win over `fallback` text. */}
      <span
        data-slot="avatar-fallback"
        class={cn(
          "flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
        )}
      >
        {children ?? fallback}
      </span>
      {src && (
        <img
          src={src}
          srcset={srcset}
          sizes={sizes}
          alt={alt ?? ""}
          loading={loading}
          referrerpolicy={referrerpolicy}
          data-slot="avatar-image"
          // When the image fails to load (404, network error), hide it and
          // let the fallback layer underneath show through.
          onerror="this.style.display='none'"
          class="absolute inset-0 aspect-square size-full object-cover"
        />
      )}
    </span>
  )
}

// Optional status badge — pin a coloured dot or icon to the corner.
type AvatarBadgeProps = PropsWithChildren<{ class?: ClassValue }>
export function AvatarBadge(props: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      class={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        props.class,
      )}
    >
      {props.children}
    </span>
  )
}

// Stack avatars with the typical -space-x overlap.
type AvatarGroupProps = PropsWithChildren<{ class?: ClassValue }>
export function AvatarGroup(props: AvatarGroupProps) {
  return (
    <div
      data-slot="avatar-group"
      class={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}

// "+N more" counter that matches AvatarGroup sizing.
type AvatarGroupCountProps = PropsWithChildren<{ class?: ClassValue }>
export function AvatarGroupCount(props: AvatarGroupCountProps) {
  return (
    <div
      data-slot="avatar-group-count"
      class={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background",
        "group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6",
        "[&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        props.class,
      )}
    >
      {props.children}
    </div>
  )
}
