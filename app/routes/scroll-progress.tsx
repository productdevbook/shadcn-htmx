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
import { SCROLL_PROGRESS_PROPS } from "@/app/data/api-rows"
import { ScrollProgress } from "@/registry/ui/scroll-progress"

export const scrollProgressRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/scroll-progress.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/scroll-progress.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/scroll-progress.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/scroll_progress.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/scroll-progress.html"), "utf8"),
])

const usageJsx = `import { ScrollProgress } from "@/components/ui/scroll-progress"

// Drop it once near the top of your layout — it pins itself to the viewport.
<ScrollProgress />                       // tracks the whole page
<ScrollProgress position="bottom" />     // pinned to the bottom edge
<ScrollProgress timeline="--article" />  // driven by a named scroller`

const usageJinja = `{% from "components/scroll-progress.html" import scroll_progress %}

{{ scroll_progress() }}                       {# tracks the page #}
{{ scroll_progress(position="bottom") }}
{{ scroll_progress(timeline="--article") }}   {# named scroller #}`

const usageGo = `{{template "scroll-progress" (dict)}}
{{template "scroll-progress" (dict "Position" "bottom")}}
{{template "scroll-progress" (dict "Timeline" "--article")}}`

const usagePhoenix = `<.scroll_progress />
<.scroll_progress position="bottom" />
<.scroll_progress timeline="--article" />`

const usageHtml = `<div data-slot="scroll-progress" data-position="top" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 w-full overflow-hidden bg-primary/15">
  <div data-slot="scroll-progress-indicator" class="h-full w-full origin-left bg-primary"></div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Page reading bar", nested: true },
  { href: "#ex-scroller", label: "Named scroller", nested: true },
  { href: "#ex-position", label: "Bottom edge", nested: true },
  { href: "#api", label: "API Reference" },
]

scrollProgressRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/scroll-progress.json`

  return page(
    c,
    <Layout title="Scroll Progress — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/scroll-progress" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Scroll Progress</h1>
            <p class="text-muted-foreground">
              A reading-position bar whose fill tracks how far you've scrolled —
              a pure{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">animation-timeline: scroll()</code>{" "}
              animation with <strong>zero JavaScript</strong> and no scroll
              listeners. Unlike{" "}
              <a class="underline underline-offset-4" href="/docs/progress">Progress</a>
              , there's no value to set — the browser drives the fill from the
              scroll position itself.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-scroll-progress"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/scroll-progress.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/scroll-progress.html", source: jinjaSource, note: "Copy scroll-progress.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/scroll-progress.tmpl", source: goSource, note: "Add scroll-progress.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/scroll_progress.ex", source: phoenixSource, note: "Drop scroll_progress.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/scroll-progress.html", source: htmlSource, note: "Paste the markup; the scn-scroll-progress keyframe + animation-timeline live in input.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Page reading bar",
              description:
                "Drop one near the top of your layout. It pins itself to the viewport and fills as the page scrolls — no value, no JS, no scroll handler.",
              narrative: (
                <p>
                  The fill is a keyframe animation whose timeline is the page's
                  own scrollbar (
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">animation-timeline: scroll(root block)</code>
                  ), so the browser advances it as you scroll. Because it
                  duplicates a position the reader already controls, the bar is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-hidden</code>{" "}
                  and never intercepts pointer events. Below is a self-contained
                  scroller standing in for the page so you can see the fill move
                  in the docs.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "animation-timeline: scroll()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll",
                },
                {
                  source: "MDN",
                  label: "CSS scroll-driven animations",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations",
                },
              ],
              preview: (
                <div class="w-full">
                  <div
                    data-test="demo-scroller"
                    tabindex={0}
                    role="region"
                    aria-label="Scrollable article (progress demo)"
                    class="relative h-56 w-full transform-gpu overflow-y-auto rounded-lg border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [scroll-timeline:--scroll-progress-demo_block]"
                  >
                    <ScrollProgress timeline="--scroll-progress-demo" />
                    <div class="space-y-4 p-4 pt-6">
                      <p class="text-sm text-muted-foreground">Scroll this box — the bar at its top edge tracks your position.</p>
                      <div class="h-40 rounded bg-muted" />
                      <div class="h-40 rounded bg-muted" />
                      <div class="h-40 rounded bg-muted" />
                      <p class="text-sm text-muted-foreground">You've reached the end.</p>
                    </div>
                  </div>
                </div>
              ),
              jsx: `// In your layout, once, for the whole page:
<ScrollProgress />`,
              jinja: `{{ scroll_progress() }}`,
              go: `{{template "scroll-progress" (dict)}}`,
              phoenix: `<.scroll_progress />`,
            })}

            {await Example({
              id: "ex-scroller",
              title: "Named scroller",
              description:
                "Track a specific scroll container instead of the page. Give the scroller a scroll-timeline-name and point the bar at it via timeline.",
              narrative: (
                <p>
                  Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scroll-timeline-name: --article</code>{" "}
                  on the scroll container, then{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">{`<ScrollProgress timeline="--article" />`}</code>
                  . The bar references that named timeline, so it fills with the
                  panel's scroll rather than the window's — handy inside a modal
                  or a split reading pane.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "scroll-timeline-name",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline-name",
                },
              ],
              preview: (
                <div class="w-full">
                  <div
                    data-test="named-scroller"
                    tabindex={0}
                    role="region"
                    aria-label="Scrollable article (named timeline demo)"
                    class="relative h-56 w-full transform-gpu overflow-y-auto rounded-lg border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [scroll-timeline:--article-demo_block]"
                  >
                    <ScrollProgress timeline="--article-demo" />
                    <article class="space-y-3 p-4 pt-6 text-sm">
                      <h3 class="font-semibold">A short article</h3>
                      <div class="h-32 rounded bg-muted" />
                      <div class="h-32 rounded bg-muted" />
                      <div class="h-32 rounded bg-muted" />
                    </article>
                  </div>
                </div>
              ),
              jsx: `// CSS on the scroller:  scroll-timeline: --article block;
<ScrollProgress timeline="--article" />`,
              jinja: `{# scroll-timeline: --article block; on the scroller #}
{{ scroll_progress(timeline="--article") }}`,
              go: `{{/* scroll-timeline: --article block; on the scroller */}}
{{template "scroll-progress" (dict "Timeline" "--article")}}`,
              phoenix: `<%!-- scroll-timeline: --article block; on the scroller --%>
<.scroll_progress timeline="--article" />`,
            })}

            {await Example({
              id: "ex-position",
              title: "Bottom edge",
              description:
                "Pin the bar to the foot of the viewport instead of the top with position=\"bottom\".",
              narrative: (
                <p>
                  Same scroll-driven fill, anchored to the bottom edge — useful
                  when a sticky header already owns the top of the screen.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "position: fixed",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed",
                },
              ],
              preview: (
                <div class="w-full">
                  <div
                    data-test="bottom-scroller"
                    tabindex={0}
                    role="region"
                    aria-label="Scrollable article (bottom timeline demo)"
                    class="relative h-56 w-full transform-gpu overflow-y-auto rounded-lg border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [scroll-timeline:--bottom-demo_block]"
                  >
                    <ScrollProgress position="bottom" timeline="--bottom-demo" />
                    <div class="space-y-4 p-4">
                      <div class="h-40 rounded bg-muted" />
                      <div class="h-40 rounded bg-muted" />
                      <div class="h-40 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ),
              jsx: `<ScrollProgress position="bottom" />`,
              jinja: `{{ scroll_progress(position="bottom") }}`,
              go: `{{template "scroll-progress" (dict "Position" "bottom")}}`,
              phoenix: `<.scroll_progress position="bottom" />`,
            })}
          </section>

          <ApiTable title="<ScrollProgress>" rows={SCROLL_PROGRESS_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
