/** @jsxImportSource hono/jsx */

// Left sidebar for /docs/* pages. Sticky on desktop, hidden on mobile (mobile
// uses the in-flow content + header). When a second component lands, add an
// entry to the `components` array — no other wiring needed.

type Item = { label: string; href?: string; soon?: boolean }
type Section = { title: string; items: Item[] }

const sections: Section[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/" },
      { label: "Why htmx + Tailwind", href: "/#features" },
    ],
  },
  {
    title: "Forms",
    items: [
      { label: "Button", href: "/docs/button" },
      { label: "Input", href: "/docs/input" },
      { label: "Textarea", href: "/docs/textarea" },
      { label: "Label", href: "/docs/label" },
      { label: "Checkbox", href: "/docs/checkbox" },
      { label: "Combobox", href: "/docs/combobox" },
      { label: "Switch", href: "/docs/switch" },
      { label: "Radio Group", href: "/docs/radio-group" },
      { label: "Select", href: "/docs/select" },
      { label: "Slider", href: "/docs/slider" },
    ],
  },
  {
    title: "Layout",
    items: [
      { label: "Card", href: "/docs/card" },
      { label: "Table", href: "/docs/table" },
    ],
  },
  {
    title: "Display",
    items: [
      { label: "Avatar", href: "/docs/avatar" },
      { label: "Badge", href: "/docs/badge" },
      { label: "Separator", href: "/docs/separator" },
    ],
  },
  {
    title: "Feedback",
    items: [
      { label: "Alert", href: "/docs/alert" },
      { label: "Progress", href: "/docs/progress" },
      { label: "Skeleton", href: "/docs/skeleton" },
      { label: "Toast", href: "/docs/toast" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { label: "Dialog", href: "/docs/dialog" },
      { label: "Dropdown Menu", href: "/docs/dropdown-menu" },
      { label: "Popover", href: "/docs/popover" },
      { label: "Tooltip", href: "/docs/tooltip" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Accordion", href: "/docs/accordion" },
      { label: "Pagination", href: "/docs/pagination" },
      { label: "Tabs", href: "/docs/tabs" },
    ],
  },
]

export function DocsSidebar(props: { current?: string }) {
  return (
    <aside class="hidden lg:sticky lg:top-14 lg:block lg:h-[calc(100svh-3.5rem)] lg:overflow-y-auto lg:py-10 lg:pr-6">
      <nav class="space-y-7 text-sm">
        {sections.map((section) => (
          <div class="space-y-2">
            <p class="px-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              {section.title}
            </p>
            <ul class="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.href && item.href === props.current
                if (item.soon) {
                  return (
                    <li>
                      <span class="flex items-center justify-between rounded-md px-3 py-1.5 text-muted-foreground/60">
                        <span>{item.label}</span>
                        <span class="rounded-full border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                          Soon
                        </span>
                      </span>
                    </li>
                  )
                }
                return (
                  <li>
                    <a
                      href={item.href}
                      class={
                        "block rounded-md px-3 py-1.5 transition-colors " +
                        (isActive
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")
                      }
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
