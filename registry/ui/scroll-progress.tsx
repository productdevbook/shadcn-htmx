/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Scroll Progress — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A reading-position indicator: a thin bar whose fill tracks how far the user
// has scrolled the page (or a named scroller). This is DISTINCT from Progress
// (registry/ui/progress.tsx), which is value-driven via aria-valuenow — here
// there is no value, just scroll position the user already controls.
//
// Built entirely on CSS scroll-driven animations — ZERO JavaScript, no scroll
// listeners. The platform progresses a keyframe animation along a scroll
// progress timeline instead of the document's time-based timeline:
//   - animation-timeline: scroll(root block) ties the fill's animation to the
//     root scroller's block axis (i.e. the page's vertical scrollbar):
//       repos/mdn/files/en-us/web/css/reference/properties/animation-timeline/scroll/index.md
//       repos/mdn/files/en-us/web/css/reference/properties/animation-timeline/index.md
//   - a named timeline (scroll-timeline-name on the scroller, referenced as a
//     <dashed-ident> in animation-timeline) drives progress from any scroll
//     container, not just the page:
//       repos/mdn/files/en-us/web/css/reference/properties/scroll-timeline-name/index.md
//   - overview of the module:
//       repos/mdn/files/en-us/web/css/guides/scroll-driven_animations/index.md
//
// The fill animation (scn-scroll-progress: scaleX(0) -> scaleX(1)) lives in
// app/styles/input.css alongside the other scn-* keyframes. animation-timeline
// is a reset-only part of the `animation` shorthand, so the keyframe + timeline
// are applied from CSS keyed on data-slot rather than a Tailwind animate-[…]
// utility (which would reset the timeline back to auto). The CSS also pins a
// prefers-reduced-motion fallback (full bar, no animation) per:
//   repos/mdn/files/en-us/web/css/reference/at-rules/@media/prefers-reduced-motion/index.md
//
// Accessibility: this is a decorative affordance that mirrors the scroll
// position the user already commands — there is no value to announce and we
// can't update aria-valuenow without scroll listeners (which we don't ship).
// So the bar is aria-hidden; it adds no noise to the accessibility tree.
//   repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-hidden/

export type ScrollProgressPosition = "top" | "bottom"

// The track is fixed to the viewport edge and spans the full inline size. It
// sits above page content (z-50) and never intercepts pointer events.
const trackBase =
  "pointer-events-none fixed inset-x-0 z-50 h-1 w-full overflow-hidden bg-primary/15"

const positions: Record<ScrollProgressPosition, string> = {
  top: "top-0",
  bottom: "bottom-0",
}

// The fill grows from the inline-start edge. transform-origin + the scaleX
// keyframe is set in input.css (keyed on data-slot="scroll-progress-indicator").
const fillBase = "h-full w-full origin-left bg-primary"

type ScrollProgressProps = {
  // Which viewport edge the bar pins to. top (default) is the classic reading
  // bar under a sticky header; bottom hugs the foot of the page.
  position?: ScrollProgressPosition
  // Drive the bar from a named scroller instead of the page. Set the matching
  // scroll-timeline-name (a --dashed-ident) on that scroll container's CSS;
  // the bar then references it via animation-timeline. Omit to track the page
  // root (scroll(root block)).
  timeline?: string
  class?: ClassValue
  id?: string
  // htmx + arbitrary attributes ride onto the root track element.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}

export function ScrollProgress(props: ScrollProgressProps) {
  const {
    position = "top",
    timeline,
    class: className,
    id,
    ...rest
  } = props as ScrollProgressProps & Record<string, any>
  return (
    <div
      id={id}
      data-slot="scroll-progress"
      data-position={position}
      aria-hidden="true"
      class={cn(trackBase, positions[position as ScrollProgressPosition], className)}
      {...rest}
    >
      <div
        data-slot="scroll-progress-indicator"
        // A named timeline overrides the default page-root timeline. Set as an
        // inline property so it cascades after the keyframe (which is reset-only
        // inside the `animation` shorthand).
        style={timeline ? `animation-timeline: ${timeline}` : undefined}
        class={fillBase}
      />
    </div>
  )
}
