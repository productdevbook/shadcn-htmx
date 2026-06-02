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
import { SKELETON_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Skeleton } from "@/registry/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"

export const skeletonRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [skJsx, skJinja, skGo, skPhoenix, skHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/skeleton.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/skeleton.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/skeleton.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/skeleton.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/skeleton.html"), "utf8"),
])

const usageJsx = `import { Skeleton } from "@/components/ui/skeleton"

<Skeleton class="h-4 w-64" ariaLabel="Loading user name" />
<Skeleton class="h-4 w-48" ariaLabel="Loading user email" />`

const usageJinja = `{% from "components/skeleton.html" import skeleton %}

{{ skeleton(extra_class="h-4 w-64", aria_label="Loading user name") }}
{{ skeleton(extra_class="h-4 w-48", aria_label="Loading user email") }}`

const usageGo = `{{template "skeleton" (dict "Class" "h-4 w-64" "AriaLabel" "Loading user name")}}`

const usagePhoenix = `<.skeleton class="h-4 w-64" aria-label="Loading user name" />`

const usageHtml = `<div role="status" aria-busy="true" aria-label="Loading user name"
     class="animate-pulse rounded-md bg-muted h-4 w-64"></div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-row", label: "Row placeholder", nested: true },
  { href: "#ex-card", label: "Card placeholder", nested: true },
  { href: "#ex-htmx", label: "htmx — placeholder → real content", nested: true },
  { href: "#api", label: "API Reference" },
]

skeletonRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/skeleton.json`

  return page(
    c,
    <Layout title="Skeleton — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/skeleton" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Skeleton</h1>
            <p class="text-muted-foreground">
              A pulsing placeholder for content that hasn't loaded yet.
              Carries{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="status"</code>{" "}
              +{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-busy="true"</code>{" "}
              so assistive tech announces "Loading …" while the user waits.
              Replaced wholesale when the real content arrives.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-skeleton"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/skeleton.tsx", source: skJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/skeleton.html", source: skJinja, note: "Copy skeleton.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/skeleton.tmpl", source: skGo, note: "Add skeleton.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/skeleton.ex", source: skPhoenix, note: "Drop skeleton.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: skHtml, note: "Tailwind utilities only; pulse animation is built-in." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-row",
              title: "Row — text placeholder",
              description:
                "Match the rough shape of the eventual content (one or two pulsing bars at the line height you expect).",
              narrative: (
                <p>
                  Each Skeleton needs an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel</code>{" "}
                  describing what's loading. Don't ship anonymous "Loading"
                  skeletons — when several are on the page they all
                  announce the same generic word and confuse AT users.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "role=\"status\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role",
                },
                {
                  source: "MDN",
                  label: "aria-busy",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Skeleton class="h-4 w-64" data-test="row-1" ariaLabel="Loading user name" />
                  <Skeleton class="h-4 w-48" ariaLabel="Loading user email" />
                </div>
              ),
              jsx: `<Skeleton class="h-4 w-64" ariaLabel="Loading user name" />
<Skeleton class="h-4 w-48" ariaLabel="Loading user email" />`,
              jinja: `{{ skeleton(extra_class="h-4 w-64", aria_label="Loading user name") }}
{{ skeleton(extra_class="h-4 w-48", aria_label="Loading user email") }}`,
              go: `{{template "skeleton" (dict "Class" "h-4 w-64" "AriaLabel" "Loading user name")}}
{{template "skeleton" (dict "Class" "h-4 w-48" "AriaLabel" "Loading user email")}}`,
              phoenix: `<.skeleton class="h-4 w-64" aria-label="Loading user name" />
<.skeleton class="h-4 w-48" aria-label="Loading user email" />`,
            })}

            {await Example({
              id: "ex-card",
              title: "Card — composed skeleton",
              description:
                "Compose skeletons to approximate the real card's silhouette — avatar circle, title bar, paragraph stripes.",
              narrative: (
                <p>
                  The closer the skeleton matches the final layout, the
                  less the page reflows when content arrives. Match the
                  real card's gap, padding and rounding so the swap is
                  visually quiet.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Skeleton screens (UX)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions",
                },
              ],
              preview: (
                <Card class="w-full max-w-md">
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
                    <Skeleton class="h-3 w-4/6" ariaLabel="Loading bio line 3" />
                  </CardContent>
                </Card>
              ),
              jsx: `<Card>
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
    <Skeleton class="h-3 w-4/6"  ariaLabel="Loading bio line 3" />
  </CardContent>
</Card>`,
              jinja: `{# Compose the card placeholder by stacking skeleton macros #}`,
              go: `{{/* Compose by nesting skeleton templates inside card */}}`,
              phoenix: `<.card>
  <:header>
    <.skeleton class="size-10 rounded-full" aria-label="Loading avatar" />
  </:header>
  …
</.card>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — placeholder swaps in real content",
              description:
                "The wrapper has hx-get; the response replaces it. Skeletons render until the server responds (you can simulate latency with hx-trigger delay).",
              narrative: (
                <p>
                  This is the htmx flash pattern flipped — instead of
                  appending, the swap replaces the host. Hit "Refresh" to
                  see the skeleton phase again. In production, pair with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-indicator</code>{" "}
                  if you want skeleton + spinner overlays.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-swap (outerHTML)",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
              ],
              preview: (
                <div
                  hx-get="/skeleton/profile?delay=900"
                  hx-trigger="load"
                  hx-swap="outerHTML"
                  class="w-full max-w-md"
                >
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
                      <Skeleton class="h-3 w-full" ariaLabel="Loading bio 1" />
                      <Skeleton class="h-3 w-5/6" ariaLabel="Loading bio 2" />
                    </CardContent>
                  </Card>
                </div>
              ),
              jsx: `<div hx-get="/api/profile" hx-trigger="load" hx-swap="outerHTML">
  <Card>
    <CardHeader>
      …skeletons matching the real layout…
    </CardHeader>
    <CardContent>
      <Skeleton class="h-3 w-full" />
    </CardContent>
  </Card>
</div>

// Server returns the real <Card>…</Card> when ready.`,
              jinja: `<div hx-get="/api/profile" hx-trigger="load" hx-swap="outerHTML">
  {{ card_open() }} … {{ skeleton(extra_class="h-3 w-full") }} … {{ card_close() }}
</div>`,
              go: `<div hx-get="/api/profile" hx-trigger="load" hx-swap="outerHTML">
  …skeletons matching the real layout…
</div>`,
              phoenix: `<div hx-get={~p"/api/profile"} hx-trigger="load" hx-swap="outerHTML">
  <.card>
    …<.skeleton class="h-3 w-full" />…
  </.card>
</div>`,
            })}
          </section>
          <ApiTable
            title="<Skeleton>"
            rows={SKELETON_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// Mock endpoint: return a real profile card after a delay.
skeletonRoutes.get("/profile", async (c) => {
  const delay = Number(c.req.query("delay") ?? 700)
  await new Promise((r) => setTimeout(r, delay))
  return c.html(
    <div class="w-full max-w-md">
      <Card>
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
      </Card>
    </div>,
  )
})
