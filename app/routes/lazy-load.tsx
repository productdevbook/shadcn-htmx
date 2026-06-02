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
import { LAZY_LOAD_PROPS } from "@/app/data/api-rows"
import { LazyLoad } from "@/registry/ui/lazy-load"
import { Skeleton } from "@/registry/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"

export const lazyLoadRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/lazy-load.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/lazy-load.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/lazy-load.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/lazy_load.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/lazy-load.html"), "utf8"),
])

const usageJsx = `import { LazyLoad } from "@/components/ui/lazy-load"

{/* Fetches its contents after first paint; reserve holds the box steady. */}
<LazyLoad src="/dashboard/sales" reserve="12rem" ariaLabel="Loading sales report" />

{/* Defer until scrolled into view. */}
<LazyLoad src="/comments" trigger="revealed" reserve="8rem" ariaLabel="Loading comments" />`

const usageJinja = `{% from "components/lazy-load.html" import lazy_load %}

{{ lazy_load(src="/dashboard/sales", reserve="12rem", aria_label="Loading sales report") }}

{{ lazy_load(src="/comments", trigger="revealed", reserve="8rem", aria_label="Loading comments") }}`

const usageGo = `{{template "lazy_load" (dict "Src" "/dashboard/sales" "Reserve" "12rem" "AriaLabel" "Loading sales report")}}

{{template "lazy_load" (dict "Src" "/comments" "Trigger" "revealed" "Reserve" "8rem" "AriaLabel" "Loading comments")}}`

const usagePhoenix = `<.lazy_load src={~p"/dashboard/sales"} reserve="12rem" aria-label="Loading sales report" />

<.lazy_load src={~p"/comments"} trigger="revealed" reserve="8rem" aria-label="Loading comments" />`

const usageHtml = `<div data-slot="lazy-load" data-trigger="load"
     role="status" aria-busy="true" aria-label="Loading sales report"
     hx-get="/dashboard/sales" hx-trigger="load" hx-swap="innerHTML"
     style="min-height:12rem"
     class="flex w-full items-center justify-center text-sm text-muted-foreground">
  <span class="flex items-center gap-2">
    <span class="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" aria-hidden="true"></span>
    Loading…
  </span>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Deferred panel", nested: true },
  { href: "#ex-skeleton", label: "Skeleton placeholder", nested: true },
  { href: "#ex-revealed", label: "Defer until scrolled into view", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- The real content the demo endpoints swap in ---------------------
// Returned by GET /lazy-load/* after a small simulated latency. Because the
// examples use the default hx-swap="innerHTML", these fragments are the
// *contents* of the lazy-load wrapper and must NOT carry hx-trigger="load"
// (that would loop). They are plain panels.

function SalesPanel() {
  return (
    <div class="w-full space-y-3 text-left">
      <div class="flex items-baseline justify-between">
        <p class="text-sm font-semibold text-foreground">Sales — last 7 days</p>
        <span class="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          +12.4%
        </span>
      </div>
      <p class="text-3xl font-bold tracking-tight text-foreground">$48,210</p>
      <div class="grid grid-cols-7 items-end gap-1.5" aria-hidden="true">
        {[40, 65, 52, 80, 58, 92, 74].map((h) => (
          <div class="rounded-sm bg-primary" style={`height:${h}px`} />
        ))}
      </div>
      <p class="text-xs text-muted-foreground">Updated just now</p>
    </div>
  )
}

function CommentsPanel() {
  const rows: [string, string][] = [
    ["Reiss", "Lazy-loaded the panel and the CLS score finally went green."],
    ["pavlos", "Real. Reserved height is the whole trick."],
    ["gnut", "Per-tab content that doesn't block first paint — chef's kiss."],
  ]
  return (
    <div class="w-full space-y-4 text-left">
      {rows.map(([author, text]) => (
        <div class="flex gap-3">
          <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {author.slice(0, 2)}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-foreground">{author}</p>
            <p class="text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

lazyLoadRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/lazy-load.json`

  return page(
    c,
    <Layout title="Lazy Load — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/lazy-load" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Lazy Load</h1>
            <p class="text-muted-foreground">
              A deferred-content container. It renders a placeholder, then
              fetches its own contents after first paint via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-trigger="load"</code>{" "}
              and swaps them in. A reserved minimum height holds the box
              steady so the swap doesn't shift the page (CLS). Pair it with{" "}
              <a href="/docs/skeleton" class="font-medium underline underline-offset-4">Skeleton</a>{" "}
              for slow dashboard panels or per-tab content.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-lazy-load"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/lazy-load.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/lazy-load.html", source: jinjaSource, note: "Copy lazy-load.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/lazy-load.tmpl", source: goSource, note: "Add lazy-load.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/lazy_load.ex", source: phoenixSource, note: "Drop lazy_load.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/lazy-load.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Deferred panel",
              description:
                "The container fetches its contents the moment it enters the DOM (hx-trigger=\"load\"), and swaps the response into itself (hx-swap=\"innerHTML\"). The reserved 12rem height holds the box steady so the page doesn't jump when the panel arrives.",
              narrative: (
                <p>
                  This is the htmx lazy-load pattern: render fast, fill in the
                  slow bits afterward. The wrapper carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="status"</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-busy="true"</code>,
                  so assistive tech knows the region is still loading. Because
                  the default swap is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">innerHTML</code>,
                  the response is the panel's <em>contents</em> — it must not
                  repeat the trigger, or the request would loop forever.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Lazy loading",
                  href: "https://htmx.org/examples/lazy-load/",
                },
                {
                  source: "MDN",
                  label: "aria-busy",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",
                },
              ],
              preview: (
                <LazyLoad
                  src="/lazy-load/sales?delay=900"
                  reserve="12rem"
                  ariaLabel="Loading sales report"
                  class="rounded-lg border p-4"
                />
              ),
              jsx: `<LazyLoad
  src="/dashboard/sales"
  reserve="12rem"
  ariaLabel="Loading sales report"
/>

// Server GET /dashboard/sales returns the panel's contents.
// It must NOT include hx-trigger="load" (innerHTML swap → loop).`,
              jinja: `{{ lazy_load(src="/dashboard/sales", reserve="12rem", aria_label="Loading sales report") }}`,
              go: `{{template "lazy_load" (dict "Src" "/dashboard/sales" "Reserve" "12rem" "AriaLabel" "Loading sales report")}}`,
              phoenix: `<.lazy_load src={~p"/dashboard/sales"} reserve="12rem" aria-label="Loading sales report" />`,
            })}

            {await Example({
              id: "ex-skeleton",
              title: "Skeleton placeholder",
              description:
                "Pass a composed <Skeleton> silhouette as the placeholder instead of the default spinner. Match the real content's shape so the swap is visually quiet and the reserved space is exact.",
              narrative: (
                <p>
                  Children override the default spinner. Build the placeholder
                  out of{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;Skeleton&gt;</code>{" "}
                  bars that approximate the final layout — the closer the
                  match, the less the page reflows when the real card arrives.
                  Here the reserved height comes from the skeleton itself, so
                  no explicit{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">reserve</code>{" "}
                  is needed.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Lazy loading",
                  href: "https://htmx.org/examples/lazy-load/",
                },
                {
                  source: "MDN",
                  label: "role=\"status\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role",
                },
              ],
              preview: (
                <LazyLoad
                  src="/lazy-load/profile?delay=1100"
                  ariaLabel="Loading profile card"
                  class="block w-full max-w-md"
                >
                  <Card class="w-full">
                    <CardHeader>
                      <div class="flex items-center gap-3">
                        <Skeleton class="size-10 rounded-full" ariaLabel="Loading avatar" />
                        <div class="grid gap-2">
                          <Skeleton class="h-4 w-40" ariaLabel="Loading name" />
                          <Skeleton class="h-3 w-24" ariaLabel="Loading handle" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent class="space-y-2">
                      <Skeleton class="h-3 w-full" ariaLabel="Loading bio line 1" />
                      <Skeleton class="h-3 w-5/6" ariaLabel="Loading bio line 2" />
                    </CardContent>
                  </Card>
                </LazyLoad>
              ),
              jsx: `<LazyLoad src="/api/profile" ariaLabel="Loading profile card">
  <Card>
    <CardHeader>
      <div class="flex items-center gap-3">
        <Skeleton class="size-10 rounded-full" ariaLabel="Loading avatar" />
        <div class="grid gap-2">
          <Skeleton class="h-4 w-40" ariaLabel="Loading name" />
          <Skeleton class="h-3 w-24" ariaLabel="Loading handle" />
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-2">
      <Skeleton class="h-3 w-full" ariaLabel="Loading bio line 1" />
      <Skeleton class="h-3 w-5/6"  ariaLabel="Loading bio line 2" />
    </CardContent>
  </Card>
</LazyLoad>`,
              jinja: `{% call lazy_load(src="/api/profile", aria_label="Loading profile card") %}
  {# skeleton silhouette matching the real card #}
{% endcall %}`,
              go: `{{template "lazy_load" (dict "Src" "/api/profile" "AriaLabel" "Loading profile card" "Body" (htmlSafe "<!-- skeleton silhouette -->"))}}`,
              phoenix: `<.lazy_load src={~p"/api/profile"} aria-label="Loading profile card">
  <%!-- skeleton silhouette matching the real card --%>
</.lazy_load>`,
            })}

            {await Example({
              id: "ex-revealed",
              title: "Defer until scrolled into view",
              description:
                "Set trigger=\"revealed\" to hold the fetch until the container scrolls into the viewport — useful for below-the-fold panels. Use trigger=\"intersect\" instead when the container lives inside an overflow-y:scroll box.",
              narrative: (
                <p>
                  Same deferred swap, later trigger:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="revealed"</code>{" "}
                  is backed by the browser's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">IntersectionObserver</code>.
                  Scroll the panel below into view to pull its contents in. The
                  reserved height keeps the scroll position stable as the
                  content lands.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (revealed)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
                {
                  source: "MDN",
                  label: "Intersection Observer API",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
                },
              ],
              preview: (
                <div class="w-full max-w-md space-y-4">
                  <div class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Scroll down a touch — the panel below fetches when it
                    enters the viewport.
                  </div>
                  <LazyLoad
                    src="/lazy-load/comments?delay=700"
                    trigger="revealed"
                    reserve="10rem"
                    ariaLabel="Loading comments"
                    class="rounded-lg border p-4"
                  />
                </div>
              ),
              jsx: `<LazyLoad
  src="/comments"
  trigger="revealed"
  reserve="10rem"
  ariaLabel="Loading comments"
/>

{/* Inside an overflow-y:scroll container, use trigger="intersect". */}`,
              jinja: `{{ lazy_load(src="/comments", trigger="revealed", reserve="10rem", aria_label="Loading comments") }}`,
              go: `{{template "lazy_load" (dict "Src" "/comments" "Trigger" "revealed" "Reserve" "10rem" "AriaLabel" "Loading comments")}}`,
              phoenix: `<.lazy_load src={~p"/comments"} trigger="revealed" reserve="10rem" aria-label="Loading comments" />`,
            })}
          </section>
          <ApiTable title="<LazyLoad>" rows={LAZY_LOAD_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// Demo endpoints. Each returns the *contents* the lazy-load wrapper swaps in
// (default hx-swap="innerHTML"), after a simulated latency so the placeholder
// is visible. None of them repeat hx-trigger="load" — that would loop.
lazyLoadRoutes.get("/sales", async (c) => {
  const delay = Number(c.req.query("delay") ?? 700)
  await new Promise((r) => setTimeout(r, delay))
  return c.html(<SalesPanel />)
})

lazyLoadRoutes.get("/comments", async (c) => {
  const delay = Number(c.req.query("delay") ?? 700)
  await new Promise((r) => setTimeout(r, delay))
  return c.html(<CommentsPanel />)
})

// Profile uses outerHTML-free innerHTML too: the wrapper stays, we just fill
// it with the real card.
lazyLoadRoutes.get("/profile", async (c) => {
  const delay = Number(c.req.query("delay") ?? 900)
  await new Promise((r) => setTimeout(r, delay))
  return c.html(
    <Card class="w-full">
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            MK
          </div>
          <div class="grid gap-0.5">
            <CardTitle>Mehmet K.</CardTitle>
            <p class="text-xs text-muted-foreground">@mehmet</p>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-2 text-sm">
        <p>Hypermedia enthusiast. Currently building shadcn-htmx — copy-paste components for the htmx + Tailwind stack.</p>
        <p class="text-muted-foreground">Joined May 2026</p>
      </CardContent>
    </Card>,
  )
})
