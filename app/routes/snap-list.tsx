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
import { SNAP_LIST_PROPS } from "@/app/data/api-rows"
import { SnapList, SnapListItem } from "@/registry/ui/snap-list"

export const snapListRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/snap-list.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/snap-list.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/snap-list.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/snap_list.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/snap-list.html"), "utf8"),
])

const usageJsx = `import { SnapList, SnapListItem } from "@/components/ui/snap-list"

<SnapList ariaLabel="Photo strip">
  <SnapListItem><img src="/1.jpg" alt="…" /></SnapListItem>
  <SnapListItem><img src="/2.jpg" alt="…" /></SnapListItem>
</SnapList>`

const usageJinja = `{% from "components/snap-list.html" import snap_list_open, snap_list_close, snap_list_item %}

{{ snap_list_open(aria_label="Photo strip") }}
  {% call(_) snap_list_item() %}<img src="/1.jpg" alt="…">{% endcall %}
  {% call(_) snap_list_item() %}<img src="/2.jpg" alt="…">{% endcall %}
{{ snap_list_close() }}`

const usageGo = `{{template "snap_list" (dict "AriaLabel" "Photo strip"
  "Body" (htmlSafe (printf "%s%s"
    (... {{template "snap_list_item" (dict "Body" (htmlSafe "<img src=\\"/1.jpg\\" alt=\\"…\\">"))}} ...)
    (... {{template "snap_list_item" (dict "Body" (htmlSafe "<img src=\\"/2.jpg\\" alt=\\"…\\">"))}} ...))))}}`

const usagePhoenix = `<.snap_list aria-label="Photo strip">
  <.snap_list_item><img src="/1.jpg" alt="…" /></.snap_list_item>
  <.snap_list_item><img src="/2.jpg" alt="…" /></.snap_list_item>
</.snap_list>`

const usageHtml = `<ul data-slot="snap-list" data-orientation="horizontal" data-snap="mandatory"
    role="list" tabindex="0" aria-label="Photo strip"
    class="flex list-none scroll-smooth scrollbar-none snap-x flex-row overflow-x-auto snap-mandatory gap-4 …">
  <li data-slot="snap-list-item" data-align="start"
      class="min-w-0 shrink-0 grow-0 snap-start basis-3/4">…</li>
  <li data-slot="snap-list-item" data-align="start"
      class="min-w-0 shrink-0 grow-0 snap-start basis-3/4">…</li>
</ul>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-stop", label: "Snap stop + center", nested: true },
  { href: "#ex-vertical", label: "Vertical", nested: true },
  { href: "#api", label: "API Reference" },
]

// Reusable demo tiles so the previews don't repeat the same markup.
function Tile(props: { n: number }) {
  return (
    <div class="flex aspect-video w-full items-center justify-center rounded-lg border bg-muted text-3xl font-semibold text-muted-foreground">
      {props.n}
    </div>
  )
}

function Chip(props: { label: string }) {
  return (
    <span class="inline-flex items-center rounded-full border bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
      {props.label}
    </span>
  )
}

snapListRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/snap-list.json`

  return page(
    c,
    <Layout title="Snap List — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/snap-list" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Snap List</h1>
            <p class="text-muted-foreground">
              The bare scroll-snapping rail — gallery strip, chip row, media
              shelf, date rail — built entirely on native CSS{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">scroll-snap</code>{" "}
              with <strong>zero JavaScript</strong>. It's the un-opinionated
              scroller the{" "}
              <a class="underline underline-offset-4" href="/docs/carousel">Carousel</a>{" "}
              dresses up with Prev/Next controls.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-snap-list"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/snap-list.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/snap-list.html", source: jinjaSource, note: "Copy snap-list.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/snap-list.tmpl", source: goSource, note: "Add snap-list.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/snap_list.ex", source: phoenixSource, note: "Drop snap_list.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/snap-list.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — a horizontal chip row",
              description:
                "Scroll / swipe horizontally; each chip snaps to the leading edge. No buttons, no script — pure CSS scroll-snap.",
              narrative: (
                <p>
                  The rail is a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;ul role="list"&gt;</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">snap-x snap-mandatory</code>{" "}
                  and each{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;li&gt;</code> set to{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">snap-start</code>. Because
                  the platform does the scrolling, mouse wheel, trackpad, touch
                  swipe and the browser's own keyboard scrolling all work — the
                  list is a tab stop ({" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="0"</code>) with a
                  focus ring so keyboard users can reach and scroll it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "scroll-snap-type",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type",
                },
                {
                  source: "MDN",
                  label: "scroll-snap-align",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align",
                },
              ],
              preview: (
                <div class="p-6">
                  <SnapList ariaLabel="Filter tags" class="gap-3 p-1">
                    <SnapListItem><Chip label="All" /></SnapListItem>
                    <SnapListItem><Chip label="Photography" /></SnapListItem>
                    <SnapListItem><Chip label="Illustration" /></SnapListItem>
                    <SnapListItem><Chip label="3D & Motion" /></SnapListItem>
                    <SnapListItem><Chip label="Typography" /></SnapListItem>
                    <SnapListItem><Chip label="Branding" /></SnapListItem>
                    <SnapListItem><Chip label="UI / UX" /></SnapListItem>
                    <SnapListItem><Chip label="Architecture" /></SnapListItem>
                  </SnapList>
                </div>
              ),
              jsx: `<SnapList ariaLabel="Filter tags" class="gap-3">
  <SnapListItem><Chip label="All" /></SnapListItem>
  <SnapListItem><Chip label="Photography" /></SnapListItem>
  <SnapListItem><Chip label="Illustration" /></SnapListItem>
  <SnapListItem><Chip label="3D & Motion" /></SnapListItem>
</SnapList>`,
              jinja: `{{ snap_list_open(aria_label="Filter tags", extra_class="gap-3") }}
  {% call(_) snap_list_item() %}<span class="…chip…">All</span>{% endcall %}
  {% call(_) snap_list_item() %}<span class="…chip…">Photography</span>{% endcall %}
{{ snap_list_close() }}`,
              go: `{{template "snap_list" (dict "AriaLabel" "Filter tags"
  "Body" (htmlSafe (printf "%s%s"
    "{{template \\"snap_list_item\\" (dict \\"Body\\" (htmlSafe \\"…All…\\"))}}"
    "{{template \\"snap_list_item\\" (dict \\"Body\\" (htmlSafe \\"…Photography…\\"))}}")))}}`,
              phoenix: `<.snap_list aria-label="Filter tags" class="gap-3">
  <.snap_list_item><span class="…chip…">All</span></.snap_list_item>
  <.snap_list_item><span class="…chip…">Photography</span></.snap_list_item>
</.snap_list>`,
            })}

            {await Example({
              id: "ex-stop",
              title: "Media shelf — center align + snap stop",
              description:
                "A one-up media shelf: items center on the snap line and snap-always stops the scroll on each one, so a fast fling can't skip past.",
              narrative: (
                <p>
                  Set each item's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">align="center"</code> to rest
                  it in the middle of the rail, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">stop</code> to add{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scroll-snap-stop: always</code>{" "}
                  so the scroll must come to rest on each item rather than
                  flinging over several. Sizing (here{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">basis-3/4</code>) is just
                  Tailwind on the item — the snapping is unchanged.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "scroll-snap-stop",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop",
                },
                {
                  source: "MDN",
                  label: "Container scroll-state queries (snapped)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries",
                },
              ],
              preview: (
                <div class="p-6">
                  <SnapList ariaLabel="Featured shots" class="gap-4 p-1">
                    <SnapListItem align="center" stop class="basis-3/4"><Tile n={1} /></SnapListItem>
                    <SnapListItem align="center" stop class="basis-3/4"><Tile n={2} /></SnapListItem>
                    <SnapListItem align="center" stop class="basis-3/4"><Tile n={3} /></SnapListItem>
                    <SnapListItem align="center" stop class="basis-3/4"><Tile n={4} /></SnapListItem>
                  </SnapList>
                </div>
              ),
              jsx: `<SnapList ariaLabel="Featured shots" class="gap-4">
  <SnapListItem align="center" stop class="basis-3/4"><img … /></SnapListItem>
  <SnapListItem align="center" stop class="basis-3/4"><img … /></SnapListItem>
  <SnapListItem align="center" stop class="basis-3/4"><img … /></SnapListItem>
</SnapList>`,
              jinja: `{{ snap_list_open(aria_label="Featured shots", extra_class="gap-4") }}
  {% call(_) snap_list_item(align="center", stop=true, extra_class="basis-3/4") %}<img …>{% endcall %}
  {% call(_) snap_list_item(align="center", stop=true, extra_class="basis-3/4") %}<img …>{% endcall %}
{{ snap_list_close() }}`,
              go: `{{template "snap_list" (dict "AriaLabel" "Featured shots"
  "Body" (htmlSafe "{{template \\"snap_list_item\\" (dict \\"Align\\" \\"center\\" \\"Stop\\" true \\"Body\\" (htmlSafe \\"<img …>\\"))}}"))}}`,
              phoenix: `<.snap_list aria-label="Featured shots" class="gap-4">
  <.snap_list_item align="center" stop class="basis-3/4"><img … /></.snap_list_item>
  <.snap_list_item align="center" stop class="basis-3/4"><img … /></.snap_list_item>
</.snap_list>`,
            })}

            {await Example({
              id: "ex-vertical",
              title: "Vertical rail",
              description:
                "Switch the axis with orientation=\"vertical\": the rail scrolls and snaps on the y axis instead.",
              narrative: (
                <p>
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">orientation="vertical"</code>{" "}
                  swaps{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">snap-x</code> /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">overflow-x-auto</code> for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">snap-y</code> /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">overflow-y-auto</code> and
                  lays the list out as a column. The vertical scroll container
                  needs a bounded height (here{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">h-64</code>) for there to be
                  anything to scroll.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "scroll-snap-type axis values",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type#values",
                },
              ],
              preview: (
                <div class="p-6">
                  <SnapList orientation="vertical" ariaLabel="Stops" class="h-64 max-w-xs gap-3 p-1">
                    <SnapListItem class="basis-1/2"><Tile n={1} /></SnapListItem>
                    <SnapListItem class="basis-1/2"><Tile n={2} /></SnapListItem>
                    <SnapListItem class="basis-1/2"><Tile n={3} /></SnapListItem>
                    <SnapListItem class="basis-1/2"><Tile n={4} /></SnapListItem>
                  </SnapList>
                </div>
              ),
              jsx: `<SnapList orientation="vertical" ariaLabel="Stops" class="h-64 gap-3">
  <SnapListItem class="basis-1/2"><img … /></SnapListItem>
  <SnapListItem class="basis-1/2"><img … /></SnapListItem>
</SnapList>`,
              jinja: `{{ snap_list_open(orientation="vertical", aria_label="Stops", extra_class="h-64 gap-3") }}
  {% call(_) snap_list_item(extra_class="basis-1/2") %}<img …>{% endcall %}
{{ snap_list_close() }}`,
              go: `{{template "snap_list" (dict "Orientation" "vertical" "AriaLabel" "Stops"
  "Body" (htmlSafe "{{template \\"snap_list_item\\" (dict \\"Body\\" (htmlSafe \\"<img …>\\"))}}"))}}`,
              phoenix: `<.snap_list orientation="vertical" aria-label="Stops" class="h-64 gap-3">
  <.snap_list_item class="basis-1/2"><img … /></.snap_list_item>
</.snap_list>`,
            })}
          </section>

          <ApiTable title="<SnapList> / <SnapListItem>" rows={SNAP_LIST_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
