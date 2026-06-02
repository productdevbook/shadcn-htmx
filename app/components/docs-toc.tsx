/** @jsxImportSource hono/jsx */

// "On this page" navigation. Items list anchor IDs that exist on the page;
// active highlighting is wired up at runtime in public/site.js via an
// IntersectionObserver. Sticky on desktop, hidden under lg.

export type TocItem = {
  href: string
  label: string
  // If set, indents the item — used for sub-sections (examples under "Examples").
  nested?: boolean
}

export function DocsToc(props: { items: TocItem[] }) {
  return (
    <aside
      data-toc
      class="hidden xl:sticky xl:top-14 xl:block xl:h-[calc(100svh-3.5rem)] xl:overflow-y-auto xl:py-10 xl:pl-6"
    >
      <p class="px-3 text-xs font-semibold tracking-wider text-foreground uppercase">
        On this page
      </p>
      <ul class="mt-3 space-y-1 text-sm">
        {props.items.map((item) => (
          <li>
            <a
              data-toc-link
              href={item.href}
              class={
                "block rounded-md py-1.5 transition-colors text-muted-foreground hover:text-foreground " +
                (item.nested ? "pl-6 pr-3" : "px-3")
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
