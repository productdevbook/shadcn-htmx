/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { LangTabs } from "@/app/components/lang-tabs"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { ApiTable } from "@/app/components/api-table"
import { InstallPanel } from "@/app/components/install-panel"
import { STICKY_HEADER_PROPS } from "@/app/data/api-rows"
import { StickyHeader, StickyHeaderBar } from "@/registry/ui/sticky-header"

export const stickyHeaderRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/sticky-header.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/sticky-header.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/sticky-header.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/sticky_header.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/sticky-header.html"), "utf8"),
  ])

const usageJsx = `import { StickyHeader, StickyHeaderBar }
  from "@/components/ui/sticky-header"

// Needs a scroll-container ancestor (the page, or an overflow box).
<StickyHeader>
  <StickyHeaderBar class="flex h-14 items-center px-4">
    <span class="font-semibold">Inbox</span>
  </StickyHeaderBar>
</StickyHeader>`

const usageJinja = `{% from "components/sticky-header.html" import
   sticky_header_open, sticky_header_close,
   sticky_header_bar_open, sticky_header_bar_close %}

{{ sticky_header_open() }}
  {{ sticky_header_bar_open(extra_class="flex h-14 items-center px-4") }}
    <span class="font-semibold">Inbox</span>
  {{ sticky_header_bar_close() }}
{{ sticky_header_close() }}`

const usageGo = `{{template "sticky_header" (dict "Body" (htmlSafe \`
  {{template "sticky_header_bar" (dict
     "Class" "flex h-14 items-center px-4"
     "Body" (htmlSafe \\\`<span class="font-semibold">Inbox</span>\\\`))}}\`))}}`

const usagePhoenix = `<.sticky_header>
  <.sticky_header_bar class="flex h-14 items-center px-4">
    <span class="font-semibold">Inbox</span>
  </.sticky_header_bar>
</.sticky_header>`

const usageHtml = `<header data-slot="sticky-header"
  class="sticky z-30 bg-background/95 [container-type:scroll-state]" style="top:0">
  <div data-slot="sticky-header-bar" data-sticky-revealed=""
       class="flex h-14 items-center px-4 transition-shadow duration-200">
    <span class="font-semibold">Inbox</span>
  </div>
</header>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic (stuck shadow)", nested: true },
  { href: "#ex-section", label: "Section headers", nested: true },
  { href: "#api", label: "API Reference" },
]

// A scroll panel for the live previews — gives the sticky header a scroll
// container ancestor without scrolling the whole docs page.
//
// A focusable, labelled scroll region: an overflow:auto box whose content has
// no other focus target can't be scrolled by keyboard, so axe flags it
// (scrollable-region-focusable). tabindex="0" makes the region itself a tab
// stop the user can scroll with arrow keys, and role="region" + aria-label
// give that stop a meaningful name instead of an anonymous focus trap.
function ScrollPanel(props: { children?: any; label: string }) {
  return (
    <div
      role="region"
      aria-label={props.label}
      tabindex={0}
      class="relative h-72 w-full overflow-auto rounded-lg border focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {props.children}
    </div>
  )
}

function FillerRows(props: { n: number; from?: number }) {
  const from = props.from ?? 1
  return (
    <div class="space-y-2 p-4 text-sm text-muted-foreground">
      {Array.from({ length: props.n }, (_, i) => (
        <p>Row {from + i}</p>
      ))}
    </div>
  )
}

stickyHeaderRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/sticky-header.json`

  return page(
    c,
    <Layout title="Sticky Header — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/sticky-header" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Sticky Header</h1>
            <p class="text-muted-foreground">
              A header that pins to the top on scroll and visually reacts —
              gaining a shadow and a solid background — the moment it becomes{" "}
              <em>stuck</em>. Built on{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                position: sticky
              </code>{" "}
              plus a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                @container scroll-state(stuck: top)
              </code>{" "}
              query, so there is no IntersectionObserver sentinel and zero
              JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2
              id="installation"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Installation
            </h2>
            <LangTabs
              id="install-sticky-header"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/sticky-header.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/sticky-header.html",
                    source: jinjaSource,
                    note: "Copy sticky-header.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/sticky-header.tmpl",
                    source: goSource,
                    note: "Add sticky-header.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/sticky_header.ex",
                    source: phoenixSource,
                    note: "Drop sticky_header.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/sticky-header.html",
                    source: htmlSource,
                    note: "Paste the markup; relies only on theme tokens. Needs a scroll-container ancestor.",
                  }),
                },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2
              id="examples"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — shadow on stuck",
              description:
                "Scroll the panel: the header pins, and the bar gains a shadow + solid background the moment it sticks to the top.",
              narrative: (
                <p>
                  The root is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    position: sticky
                  </code>{" "}
                  AND a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    container-type: scroll-state
                  </code>{" "}
                  container, so a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    @container scroll-state(stuck: top)
                  </code>{" "}
                  rule can style its descendants only while it's stuck — no
                  sentinel element, no observer. Where the query isn't
                  supported the header still pins; it just skips the extra
                  shadow.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Using container scroll-state queries (stuck)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries",
                },
                {
                  source: "MDN",
                  label: "position: sticky",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position",
                },
                {
                  source: "MDN",
                  label: "@container at-rule",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container",
                },
              ],
              preview: (
                <ScrollPanel label="Documents list — scrollable preview">
                  <StickyHeader>
                    <StickyHeaderBar class="flex h-14 items-center justify-between px-4">
                      <span class="font-semibold">Documents</span>
                      <span class="text-sm text-muted-foreground">
                        128 files
                      </span>
                    </StickyHeaderBar>
                  </StickyHeader>
                  <FillerRows n={16} />
                </ScrollPanel>
              ),
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-section",
              title: "Section headers — multiple sticky titles",
              description:
                "Each section title pins in turn. Whichever is stuck shows the shadow; the others sit flush above their content.",
              narrative: (
                <p>
                  Because each header is its own scroll-state container, the
                  query is evaluated per element — exactly the MDN “sticky
                  reader” recipe. No coordination code is needed between
                  sections.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "container-type: scroll-state",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type",
                },
              ],
              preview: (
                <ScrollPanel label="Grouped sections — scrollable preview">
                  <section>
                    <StickyHeader>
                      <StickyHeaderBar class="bg-muted/60 px-4 py-2 text-sm font-medium">
                        Yesterday
                      </StickyHeaderBar>
                    </StickyHeader>
                    <FillerRows n={6} from={1} />
                  </section>
                  <section>
                    <StickyHeader>
                      <StickyHeaderBar class="bg-muted/60 px-4 py-2 text-sm font-medium">
                        Last week
                      </StickyHeaderBar>
                    </StickyHeader>
                    <FillerRows n={8} from={7} />
                  </section>
                </ScrollPanel>
              ),
              jsx: `<section>
  <StickyHeader>
    <StickyHeaderBar class="bg-muted/60 px-4 py-2 text-sm font-medium">
      Yesterday
    </StickyHeaderBar>
  </StickyHeader>
  {/* section rows… */}
</section>`,
              jinja: `{{ sticky_header_open() }}
  {{ sticky_header_bar_open(extra_class="bg-muted/60 px-4 py-2 text-sm font-medium") }}
    Yesterday
  {{ sticky_header_bar_close() }}
{{ sticky_header_close() }}`,
              go: `{{template "sticky_header" (dict "Body" (htmlSafe \`
  {{template "sticky_header_bar" (dict
     "Class" "bg-muted/60 px-4 py-2 text-sm font-medium"
     "Body" "Yesterday")}}\`))}}`,
              phoenix: `<.sticky_header>
  <.sticky_header_bar class="bg-muted/60 px-4 py-2 text-sm font-medium">
    Yesterday
  </.sticky_header_bar>
</.sticky_header>`,
            })}
          </section>

          <ApiTable title="Sticky Header" rows={STICKY_HEADER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
