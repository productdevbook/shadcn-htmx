/** @jsxImportSource hono/jsx */
import type { PropsWithChildren } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Carousel — shadcn-htmx, htmx v4 + Tailwind v4.
//
// shadcn/ui ships a Carousel built on the Embla JS engine. We don't copy that
// React code; we mirror its anatomy (Carousel / CarouselContent / CarouselItem
// / CarouselPrevious / CarouselNext) and translate it to a NATIVE, no-engine
// implementation. Source of truth for the API shape:
//   repos/shadcn-ui/apps/v4/registry/new-york-v4/ui/carousel.tsx (anatomy only)
//
// Accessibility contract follows the WAI-ARIA APG carousel pattern (Basic
// carousel: previous/next controls, no auto-rotation):
//   repos/aria-practices/content/patterns/carousel/carousel-pattern.html
//   repos/aria-practices/content/patterns/carousel/examples/carousel-1-prev-next.html
//
// How this differs from Embla / shadcn:
//   - The scroller is a plain horizontally-overflowing element using CSS
//     scroll-snap (`snap-x snap-mandatory`, each slide `snap-center`). Scrolling
//     itself is therefore native: mouse wheel, trackpad, touch swipe, and the
//     browser's own keyboard scrolling all work with zero JS, and the snap
//     points keep slides aligned. Tailwind v4 ships these utilities natively
//     (repos/tailwindcss/.../src/utilities.ts: snap-x, snap-mandatory,
//     snap-center, scroll-smooth).
//   - The only thing the platform does NOT give us is "advance by exactly one
//     slide when the Prev/Next buttons are pressed" + the buttons' disabled
//     state at the ends. public/site.js (keyed on data-slot="carousel") owns
//     that: it calls Element.scrollBy() with the slide width
//     (repos/mdn/files/en-us/web/api/element/scrollby/index.md).
//
// APG roles/states/properties (Basic carousel):
//   - Root container: role="group" + aria-roledescription="carousel" + an
//     accessible name via aria-label / aria-labelledby. Because the
//     roledescription is "carousel", the label must NOT contain the word
//     "carousel". (carousel-pattern.html, "Basic carousel elements")
//   - Each slide: role="group" + aria-roledescription="slide" + an accessible
//     name. When slides have no unique name, "N of M" is the sanctioned
//     fallback because group elements don't support aria-setsize/aria-posinset.
//   - The element wrapping the slides has aria-atomic="false" + aria-live.
//     For a non-auto-rotating carousel APG specifies aria-live="polite".
//   - Prev/Next are real <button>s (recommended) with aria-controls pointing
//     at the slides wrapper.
//
// Composition (matches shadcn's API):
//   <Carousel id="gallery" ariaLabel="Featured photos">
//     <CarouselContent>
//       <CarouselItem><img …/></CarouselItem>
//       <CarouselItem><img …/></CarouselItem>
//     </CarouselContent>
//     <CarouselPrevious />
//     <CarouselNext />
//   </Carousel>

const containerBase = "group/carousel relative"

// The scroller. `snap-x snap-mandatory` turns the row into a snap container;
// `scroll-smooth` makes scrollBy() animate; `overflow-x-auto` lets native
// touch/wheel scrolling work. `scrollbar-none` is the Tailwind v4 utility for
// scrollbar-width:none (Firefox/standards); app/styles/input.css adds the
// WebKit ::-webkit-scrollbar supplement so the bar is hidden in Chrome/Safari
// too. The region stays fully scrollable + keyboard-reachable.
const contentBase =
  "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scrollbar-none " +
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-lg"

// Each slide centres on the snap line and never shrinks below its basis.
const itemBase = "min-w-0 shrink-0 grow-0 basis-full snap-center"

// Prev/Next share the outline icon-button look so the pair reads as a unit.
const navBase =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-all outline-none " +
  "hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-40 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

type CarouselProps = PropsWithChildren<{
  // Required so site.js can scope its handlers per carousel and so the
  // Prev/Next buttons can aria-control the slides wrapper by id.
  id: string
  // Accessible name. APG: since aria-roledescription is "carousel", the name
  // must NOT include the word "carousel".
  ariaLabel?: string
  ariaLabelledby?: string
  class?: ClassValue
  // htmx + arbitrary attributes ride onto the root.
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function Carousel(props: CarouselProps) {
  const { id, ariaLabel, ariaLabelledby, class: className, children, ...rest } = props as any
  // Boot script: runs synchronously after the element is parsed, before paint.
  //   - Give every slide its "N of M" aria-label (the APG fallback name) and
  //     wire aria-controls on the Prev/Next buttons to the scroller id.
  //   - Set the Prev button disabled at the start (we open on slide 1).
  // The live scroll/disabled contract lives in public/site.js; this just makes
  // the initial render correct and a11y-complete with no flicker.
  const boot = `(function(el){
    var content = el.querySelector('[data-slot="carousel-content"]');
    if (content){
      if (!content.id) content.id = el.id + '-content';
      var items = content.querySelectorAll('[data-slot="carousel-item"]');
      var total = items.length;
      items.forEach(function(it, i){
        if (!it.getAttribute('aria-label')) it.setAttribute('aria-label', (i+1)+' of '+total);
      });
      el.querySelectorAll('[data-carousel-prev],[data-carousel-next]').forEach(function(b){
        b.setAttribute('aria-controls', content.id);
      });
      var prev = el.querySelector('[data-carousel-prev]');
      if (prev) prev.disabled = content.scrollLeft <= 0;
    }
    el.setAttribute('data-carousel-ready','true');
  })(document.currentScript.previousElementSibling);`
  return (
    <>
      <section
        id={id}
        data-slot="carousel"
        data-carousel
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        class={cn(containerBase, className)}
        {...rest}
      >
        {children}
      </section>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </>
  )
}

type CarouselContentProps = PropsWithChildren<{
  class?: ClassValue
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function CarouselContent(props: CarouselContentProps) {
  const { class: className, children, ...rest } = props as any
  // The slides wrapper. APG: aria-atomic="false" + aria-live="polite" for a
  // carousel that does NOT auto-rotate, so changing slides is announced.
  // tabindex="0" makes the scroll region keyboard-focusable so the browser's
  // built-in arrow/Page scrolling reaches it (a scrollable region needs a tab
  // stop to be operable by keyboard-only users).
  return (
    <div
      data-slot="carousel-content"
      aria-atomic="false"
      aria-live="polite"
      tabindex={0}
      class={cn(contentBase, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

type CarouselItemProps = PropsWithChildren<{
  class?: ClassValue
  // Optional explicit accessible name for the slide. If omitted, the boot
  // script assigns the APG "N of M" fallback.
  ariaLabel?: string
  ariaLabelledby?: string
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

export function CarouselItem(props: CarouselItemProps) {
  const { class: className, ariaLabel, ariaLabelledby, children, ...rest } = props as any
  // Each slide is role="group" + aria-roledescription="slide". The label is
  // either provided here or filled in as "N of M" by the boot script.
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      class={cn(itemBase, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

type CarouselNavProps = PropsWithChildren<{
  class?: ClassValue
  ariaLabel?: string
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}>

// Default chevron icons (inline SVG so the snippet has no icon-lib dependency).
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function CarouselPrevious(props: CarouselNavProps) {
  const { class: className, ariaLabel = "Previous slide", children, ...rest } = props as any
  // Real <button>: role + Space/Enter activation + disabled come from the
  // platform. Activating it does NOT move focus (APG note), so users can
  // repeatedly click/Enter to keep advancing.
  return (
    <button
      type="button"
      data-slot="carousel-previous"
      data-carousel-prev
      aria-label={ariaLabel}
      class={cn(navBase, "absolute top-1/2 -left-3 -translate-y-1/2", className)}
      {...rest}
    >
      {children ?? <ChevronLeft />}
    </button>
  )
}

export function CarouselNext(props: CarouselNavProps) {
  const { class: className, ariaLabel = "Next slide", children, ...rest } = props as any
  return (
    <button
      type="button"
      data-slot="carousel-next"
      data-carousel-next
      aria-label={ariaLabel}
      class={cn(navBase, "absolute top-1/2 -right-3 -translate-y-1/2", className)}
      {...rest}
    >
      {children ?? <ChevronRight />}
    </button>
  )
}
