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
import { LANDMARKS_PROPS } from "@/app/data/api-rows"
import {
  Banner,
  NavLandmark,
  SearchLandmark,
  MainLandmark,
  Complementary,
  RegionLandmark,
  ContentInfo,
} from "@/registry/ui/landmarks"

export const landmarksRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  landmarksJsxSource,
  landmarksJinjaSource,
  landmarksGoSource,
  landmarksPhoenixSource,
  landmarksHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/landmarks.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/landmarks.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/landmarks.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/landmarks.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/landmarks.html"), "utf8"),
])

const usageJsx = `import {
  Banner, NavLandmark, SearchLandmark, MainLandmark,
  Complementary, RegionLandmark, ContentInfo,
} from "@/components/ui/landmarks"

<Banner>
  <h1>Acme Console</h1>
  <SearchLandmark ariaLabel="Site">
    <form action="/search"><input type="search" name="q" /></form>
  </SearchLandmark>
</Banner>
<NavLandmark ariaLabel="Primary">…</NavLandmark>
<MainLandmark>
  <h1>Overview</h1>
  <RegionLandmark ariaLabel="Usage this month">…</RegionLandmark>
</MainLandmark>
<Complementary ariaLabel="Related">…</Complementary>
<ContentInfo>© 2026 Acme</ContentInfo>`

const usageJinja = `{% from "components/landmarks.html" import
   banner_open, banner_close, nav_open, nav_close,
   search_open, search_close, main_open, main_close,
   complementary_open, complementary_close,
   region_open, region_close, contentinfo_open, contentinfo_close %}

{{ banner_open() }}<h1>Acme Console</h1>{{ banner_close() }}
{{ nav_open(aria_label="Primary") }}…{{ nav_close() }}
{{ main_open() }}
  {{ region_open(aria_label="Usage this month") }}…{{ region_close() }}
{{ main_close() }}
{{ complementary_open(aria_label="Related") }}…{{ complementary_close() }}
{{ contentinfo_open() }}© 2026 Acme{{ contentinfo_close() }}`

const usageGo = `{{template "landmark_banner" (dict
  "Body" (htmlSafe \`<h1>Acme Console</h1>\`)
)}}
{{template "landmark_nav" (dict
  "AriaLabel" "Primary" "Body" (htmlSafe \`<ul>…</ul>\`)
)}}
{{template "landmark_main" (dict
  "Body" (htmlSafe \`<h1>Overview</h1>\`)
)}}
{{template "landmark_region" (dict
  "AriaLabel" "Usage this month" "Body" (htmlSafe \`…\`)
)}}
{{template "landmark_contentinfo" (dict
  "Body" (htmlSafe \`© 2026 Acme\`)
)}}`

const usagePhoenix = `<.banner>
  <h1>Acme Console</h1>
</.banner>
<.nav_landmark aria-label="Primary">…</.nav_landmark>
<.main_landmark>
  <h1>Overview</h1>
  <.region_landmark aria-label="Usage this month">…</.region_landmark>
</.main_landmark>
<.complementary aria-label="Related">…</.complementary>
<.content_info>© 2026 Acme</.content_info>`

const usageHtml = `<header data-slot="landmark-banner">…</header>
<nav data-slot="landmark-navigation" aria-label="Primary">…</nav>
<main data-slot="landmark-main">
  <section data-slot="landmark-region" aria-labelledby="t">…</section>
</main>
<aside data-slot="landmark-complementary" aria-label="Related">…</aside>
<footer data-slot="landmark-contentinfo">…</footer>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#api", label: "API Reference" },
]

landmarksRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/landmarks.json`

  return page(
    c,
    <Layout title="Landmarks — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/landmarks" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Landmarks</h1>
            <p class="text-muted-foreground">
              An accessible page-shell built from the native HTML landmark
              elements — <code class="rounded bg-muted px-1 py-0.5 text-xs">header</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">nav</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">search</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">main</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">aside</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">section</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">footer</code>. Each
              wrapper exposes the matching ARIA landmark role for free, so
              assistive-tech users can jump between the major regions of the
              page. Pure structure — no JS. Follows the WAI-ARIA APG Landmarks
              practice.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-landmarks"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/landmarks.tsx", source: landmarksJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/landmarks.html", source: landmarksJinjaSource, note: "Copy landmarks.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/landmarks.tmpl", source: landmarksGoSource, note: "Add landmarks.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/landmarks.ex", source: landmarksPhoenixSource, note: "Drop landmarks.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: landmarksHtmlSource, note: "Native elements + Tailwind utilities only. No script." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-shell",
              title: "Labelled page shell",
              description:
                "A complete, correctly landmarked shell: banner on top, a row of [navigation | main | complementary], contentinfo at the bottom. The search landmark wraps a form inside the banner.",
              narrative: (
                <p>
                  Each landmark maps to a native element, so the roles come
                  from the platform — not from <code class="rounded bg-muted px-1 py-0.5 text-xs">role=</code>{" "}
                  attributes. Per the APG, the single <code class="rounded bg-muted px-1 py-0.5 text-xs">main</code>{" "}
                  and the body-level <code class="rounded bg-muted px-1 py-0.5 text-xs">header</code>/<code class="rounded bg-muted px-1 py-0.5 text-xs">footer</code>{" "}
                  need no label, but every <code class="rounded bg-muted px-1 py-0.5 text-xs">nav</code>{" "}
                  and the <code class="rounded bg-muted px-1 py-0.5 text-xs">search</code>{" "}
                  and <code class="rounded bg-muted px-1 py-0.5 text-xs">aside</code>{" "}
                  carry a unique <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>{" "}
                  so they are distinguishable. The native <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;search&gt;</code>{" "}
                  element is the search landmark, so the inner form needs no{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="search"</code>.
                </p>
              ),
              references: [
                { source: "APG", label: "Landmarks pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/" },
                { source: "MDN", label: "<search> element (defines a search landmark)", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search" },
              ],
              preview: (
                <div data-slot="landmark-shell" class="flex w-full flex-col overflow-hidden rounded-lg border">
                  <Banner class="flex items-center justify-between gap-4">
                    <span class="font-semibold tracking-tight">Acme Console</span>
                    <SearchLandmark ariaLabel="Site">
                      <form action="/search" class="flex items-center gap-2">
                        <label for="ex-lm-q" class="sr-only">Search the site</label>
                        <input id="ex-lm-q" type="search" name="q" placeholder="Search…" class="h-8 w-40 rounded-md border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none" />
                        <button type="submit" class="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go</button>
                      </form>
                    </SearchLandmark>
                  </Banner>
                  <div class="flex flex-col gap-4 bg-background p-4 md:flex-row">
                    <NavLandmark ariaLabel="Primary" class="shrink-0 md:w-40">
                      <ul class="space-y-1">
                        <li><a href="#" aria-current="page" class="block rounded-md bg-accent px-2 py-1.5 font-medium text-accent-foreground">Overview</a></li>
                        <li><a href="#" class="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground">Reports</a></li>
                        <li><a href="#" class="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground">Settings</a></li>
                      </ul>
                    </NavLandmark>
                    <MainLandmark class="space-y-4">
                      <h1 class="text-lg font-semibold tracking-tight">Overview</h1>
                      <p class="text-sm text-muted-foreground">The primary content of the page. Exactly one main landmark per document.</p>
                      <RegionLandmark ariaLabelledby="ex-lm-usage">
                        <h2 id="ex-lm-usage" class="text-sm font-semibold">Usage this month</h2>
                        <p class="mt-1 text-sm text-muted-foreground">42,318 requests · 7.1 GB transferred</p>
                      </RegionLandmark>
                    </MainLandmark>
                    <Complementary ariaLabel="Related" class="shrink-0 md:w-48">
                      <h2 class="font-semibold">Related</h2>
                      <ul class="mt-2 space-y-1 text-muted-foreground">
                        <li><a href="#" class="underline-offset-4 hover:underline">Billing history</a></li>
                        <li><a href="#" class="underline-offset-4 hover:underline">API keys</a></li>
                      </ul>
                    </Complementary>
                  </div>
                  <ContentInfo>
                    © 2026 Acme, Inc. · <a href="#" class="underline-offset-4 hover:underline">Privacy</a> · <a href="#" class="underline-offset-4 hover:underline">Accessibility</a>
                  </ContentInfo>
                </div>
              ),
              jsx: `<Banner>
  <h1>Acme Console</h1>
  <SearchLandmark ariaLabel="Site">
    <form action="/search">
      <label class="sr-only" for="q">Search the site</label>
      <input id="q" type="search" name="q" />
      <button type="submit">Go</button>
    </form>
  </SearchLandmark>
</Banner>
<NavLandmark ariaLabel="Primary">
  <ul>
    <li><a href="#" aria-current="page">Overview</a></li>
    <li><a href="#">Reports</a></li>
  </ul>
</NavLandmark>
<MainLandmark>
  <h1>Overview</h1>
  <RegionLandmark ariaLabelledby="usage">
    <h2 id="usage">Usage this month</h2>
    <p>42,318 requests</p>
  </RegionLandmark>
</MainLandmark>
<Complementary ariaLabel="Related">…</Complementary>
<ContentInfo>© 2026 Acme, Inc.</ContentInfo>`,
              jinja: `{{ banner_open() }}
  <h1>Acme Console</h1>
  {{ search_open(aria_label="Site") }}
    <form action="/search">
      <label class="sr-only" for="q">Search the site</label>
      <input id="q" type="search" name="q" />
      <button type="submit">Go</button>
    </form>
  {{ search_close() }}
{{ banner_close() }}
{{ nav_open(aria_label="Primary") }}
  <ul><li><a href="#" aria-current="page">Overview</a></li></ul>
{{ nav_close() }}
{{ main_open() }}
  <h1>Overview</h1>
  {{ region_open(aria_labelledby="usage") }}
    <h2 id="usage">Usage this month</h2>
  {{ region_close() }}
{{ main_close() }}
{{ complementary_open(aria_label="Related") }}…{{ complementary_close() }}
{{ contentinfo_open() }}© 2026 Acme, Inc.{{ contentinfo_close() }}`,
              go: `{{template "landmark_banner" (dict "Body" (htmlSafe \`
  <h1>Acme Console</h1>
  {{template "landmark_search" (dict "AriaLabel" "Site" "Body" (htmlSafe \\\`<form action="/search">…</form>\\\`))}}
\`))}}
{{template "landmark_nav" (dict "AriaLabel" "Primary" "Body" (htmlSafe \`<ul>…</ul>\`))}}
{{template "landmark_main" (dict "Body" (htmlSafe \`
  <h1>Overview</h1>
  {{template "landmark_region" (dict "AriaLabelledby" "usage" "Body" (htmlSafe \\\`<h2 id="usage">Usage this month</h2>\\\`))}}
\`))}}
{{template "landmark_complementary" (dict "AriaLabel" "Related" "Body" (htmlSafe \`…\`))}}
{{template "landmark_contentinfo" (dict "Body" (htmlSafe \`© 2026 Acme, Inc.\`))}}`,
              phoenix: `<.banner>
  <h1>Acme Console</h1>
  <.search_landmark aria-label="Site">
    <form action="/search">
      <label class="sr-only" for="q">Search the site</label>
      <input id="q" type="search" name="q" />
      <button type="submit">Go</button>
    </form>
  </.search_landmark>
</.banner>
<.nav_landmark aria-label="Primary">
  <ul><li><a href="#" aria-current="page">Overview</a></li></ul>
</.nav_landmark>
<.main_landmark>
  <h1>Overview</h1>
  <.region_landmark aria-labelledby="usage">
    <h2 id="usage">Usage this month</h2>
  </.region_landmark>
</.main_landmark>
<.complementary aria-label="Related">…</.complementary>
<.content_info>© 2026 Acme, Inc.</.content_info>`,
            })}
          </section>

          <ApiTable title="Landmarks" rows={LANDMARKS_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
