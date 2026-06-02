/** @jsxImportSource hono/jsx */
import type { PropsWithChildren, Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Landmarks — shadcn-htmx, htmx v4 + Tailwind v4.
//
// An accessible page-shell built from the native HTML landmark elements.
// Pure structure — no JS. Each subcomponent is a thin semantic wrapper
// around the native element that implicitly exposes the matching ARIA
// landmark role, so assistive-tech users can jump between the major
// regions of the page.
//
// Native element  →  implicit landmark role
//   <header>  (in body context)  →  banner
//   <nav>                          →  navigation
//   <search>                       →  search
//   <main>                         →  main
//   <aside>                        →  complementary
//   <section>  (when labelled)     →  region
//   <footer>  (in body context)    →  contentinfo
//
// Labelling rules (when to pass an aria-label / aria-labelledby) come
// straight from the APG. Several landmark roles must (region) or should
// (navigation, complementary, search) carry a unique label so multiple
// landmarks of the same type are distinguishable.
//
// APG (read for the per-role design patterns + labelling rules):
//   repos/aria-practices/content/patterns/landmarks/examples/banner.html
//   repos/aria-practices/content/patterns/landmarks/examples/navigation.html
//   repos/aria-practices/content/patterns/landmarks/examples/main.html
//   repos/aria-practices/content/patterns/landmarks/examples/complementary.html
//   repos/aria-practices/content/patterns/landmarks/examples/region.html
//   repos/aria-practices/content/patterns/landmarks/examples/search.html
//   repos/aria-practices/content/patterns/landmarks/examples/contentinfo.html
// MDN (the native <search> element defines a search landmark — no role=search needed):
//   repos/mdn/files/en-us/web/html/reference/elements/search/index.md:20-22

type LandmarkProps = PropsWithChildren<
  {
    class?: ClassValue
    id?: string
    // The accessible name for this landmark. Where the APG calls for one
    // (navigation, complementary, search when there is more than one; and
    // always for region) pass either ariaLabel or ariaLabelledby.
    ariaLabel?: string
    ariaLabelledby?: string
  } & Record<string, any>
>

// <header> in body context = banner landmark. Top-level only: a <header>
// nested inside article/aside/main/nav/section is just a sectioning header,
// not a banner. There should be one banner per page.
//   APG: repos/aria-practices/content/patterns/landmarks/examples/banner.html:52-57,67-76
export function Banner(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <header
      data-slot="landmark-banner"
      class={cn("border-b bg-card px-4 py-3 text-card-foreground", className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </header>
  )
}

// <nav> = navigation landmark. If a page has more than one navigation
// landmark, each should have a unique label; with only one, a label is
// optional (but recommended once there are multiple navs in a shell).
//   APG: repos/aria-practices/content/patterns/landmarks/examples/navigation.html:51-52,61
export function NavLandmark(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <nav
      data-slot="landmark-navigation"
      class={cn("text-sm", className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </nav>
  )
}

// <search> = search landmark (native element). Removes the need for
// role="search" on the inner <form>. Use the search landmark instead of
// the form landmark when the form performs a search/filter. If there is
// more than one search landmark, each should have a unique label.
//   MDN: repos/mdn/files/en-us/web/html/reference/elements/search/index.md:20-22,32-43
//   APG: repos/aria-practices/content/patterns/landmarks/examples/search.html:54-55,64-66
export function SearchLandmark(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <search
      data-slot="landmark-search"
      class={cn("", className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </search>
  )
}

// <main> = main landmark. Exactly one per page, and it should be a
// top-level landmark (not nested in another landmark).
//   APG: repos/aria-practices/content/patterns/landmarks/examples/main.html:51-52
export function MainLandmark(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <main
      data-slot="landmark-main"
      class={cn("min-w-0 flex-1", className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </main>
  )
}

// <aside> = complementary landmark. Supporting content at a similar level
// to the main content; should be a top-level landmark. If the content
// isn't related to the main content, use a region instead. With more than
// one complementary landmark, each should have a unique label.
//   APG: repos/aria-practices/content/patterns/landmarks/examples/complementary.html:52-54
export function Complementary(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <aside
      data-slot="landmark-complementary"
      class={cn(
        "rounded-lg border bg-card p-4 text-sm text-card-foreground",
        className,
      )}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </aside>
  )
}

// <section> = region landmark, but ONLY when it has an accessible name.
// A bare <section> exposes NO landmark role; a region landmark MUST have a
// label — so always pass ariaLabel or ariaLabelledby here. Used to name
// content that no other (named) landmark appropriately describes.
//   APG: repos/aria-practices/content/patterns/landmarks/examples/region.html:52-54,64,101-121
export function RegionLandmark(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <section
      data-slot="landmark-region"
      class={cn("rounded-lg border bg-card p-4 text-card-foreground", className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </section>
  )
}

// <footer> in body context = contentinfo landmark. Top-level only: a
// <footer> nested inside article/aside/main/nav/section is just a
// sectioning footer. One contentinfo per page.
//   APG: repos/aria-practices/content/patterns/landmarks/examples/contentinfo.html:51-56,66-74
export function ContentInfo(props: LandmarkProps) {
  const { class: className, children, ariaLabel, ariaLabelledby, ...rest } = props
  return (
    <footer
      data-slot="landmark-contentinfo"
      class={cn(
        "border-t bg-card px-4 py-3 text-sm text-muted-foreground",
        className,
      )}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...rest}
    >
      {children}
    </footer>
  )
}

// Convenience shell — a tasteful demo skeleton wiring the landmarks into a
// holy-grail layout (banner on top, a row of [navigation | main |
// complementary], contentinfo at the bottom). Compose the subcomponents
// directly when you need a different arrangement.
export function PageShell(
  props: PropsWithChildren<{ class?: ClassValue; children?: Child }>,
) {
  return (
    <div
      data-slot="landmark-shell"
      class={cn("flex min-h-0 flex-col overflow-hidden rounded-lg border", props.class)}
    >
      {props.children}
    </div>
  )
}
