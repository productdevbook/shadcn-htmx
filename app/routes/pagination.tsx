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
import { PAGINATION_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/registry/ui/pagination"

export const paginationRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [pJsx, pJinja, pGo, pPhoenix, pHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/pagination.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/pagination.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/pagination.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/pagination.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/pagination.html"), "utf8"),
])

const usageJsx = `import { Pagination, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"

<Pagination ariaLabel="Articles">
  <PaginationItem><PaginationPrevious href="/articles?page=1" /></PaginationItem>
  <PaginationItem><PaginationLink href="/articles?page=1">1</PaginationLink></PaginationItem>
  <PaginationItem><PaginationLink active>2</PaginationLink></PaginationItem>
  <PaginationItem><PaginationLink href="/articles?page=3">3</PaginationLink></PaginationItem>
  <PaginationItem><PaginationEllipsis /></PaginationItem>
  <PaginationItem><PaginationNext href="/articles?page=3" /></PaginationItem>
</Pagination>`

const usageJinja = `{% from "components/pagination.html" import pagination_open, pagination_close,
   pagination_prev, pagination_next, pagination_page, pagination_ellipsis %}

{{ pagination_open(aria_label="Articles") }}
  {{ pagination_prev(href="/articles?page=1") }}
  {{ pagination_page(1, href="/articles?page=1") }}
  {{ pagination_page(2, active=true) }}
  {{ pagination_page(3, href="/articles?page=3") }}
  {{ pagination_ellipsis() }}
  {{ pagination_next(href="/articles?page=3") }}
{{ pagination_close() }}`

const usageGo = `{{template "pagination" (dict "AriaLabel" "Articles" "Body" (htmlSafe \`
  {{template "pagination_prev" (dict "Href" "/articles?page=1")}}
  {{template "pagination_page" (dict "N" 1 "Href" "/articles?page=1")}}
  {{template "pagination_page" (dict "N" 2 "Active" true)}}
  {{template "pagination_ellipsis" (dict)}}
  {{template "pagination_next" (dict "Href" "/articles?page=3")}}\`))}}`

const usagePhoenix = `<.pagination aria-label="Articles">
  <.pagination_prev href={~p"/articles?page=1"} />
  <.pagination_page n={1} href={~p"/articles?page=1"} />
  <.pagination_page n={2} active />
  <.pagination_page n={3} href={~p"/articles?page=3"} />
  <.pagination_ellipsis />
  <.pagination_next href={~p"/articles?page=3"} />
</.pagination>`

const usageHtml = `<nav aria-label="Articles" class="mx-auto flex w-full justify-center">
  <ul class="flex flex-row items-center gap-1">
    <li><a href="/articles?page=1" aria-label="Previous page" class="…">‹ Previous</a></li>
    <li><a href="/articles?page=1" class="…">1</a></li>
    <li><a aria-current="page" class="… bg-primary text-primary-foreground">2</a></li>
    <li><a href="/articles?page=3" aria-label="Next page" class="…">Next ›</a></li>
  </ul>
</nav>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-htmx", label: "htmx — live swap", nested: true },
  { href: "#api", label: "API Reference" },
]

// Build a single page worth of pagination markup.
function PaginationBlock({ active }: { active: number }) {
  const totalPages = 5
  return (
    <Pagination ariaLabel="Demo articles">
      <PaginationItem>
        <PaginationPrevious
          disabled={active === 1}
          hx-get={`/pagination/page?page=${Math.max(1, active - 1)}`}
          hx-target="#ex-pag-host"
          hx-swap="innerHTML"
        />
      </PaginationItem>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <PaginationItem>
          <PaginationLink
            active={n === active}
            data-test={`page-${n}`}
            hx-get={`/pagination/page?page=${n}`}
            hx-target="#ex-pag-host"
            hx-swap="innerHTML"
          >
            {n}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext
          disabled={active === totalPages}
          hx-get={`/pagination/page?page=${Math.min(totalPages, active + 1)}`}
          hx-target="#ex-pag-host"
          hx-swap="innerHTML"
        />
      </PaginationItem>
    </Pagination>
  )
}

paginationRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/pagination.json`

  return page(
    c,
    <Layout title="Pagination — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/pagination" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Pagination</h1>
            <p class="text-muted-foreground">
              A{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;nav&gt;</code>{" "}
              landmark with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-label</code>
              ; active page carries{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-current="page"</code>
              . Previous/Next pre-labelled so AT users hear the action,
              not the glyph.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-pagination"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/pagination.tsx", source: pJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/pagination.html", source: pJinja, note: "Copy pagination.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/pagination.tmpl", source: pGo, note: "Add pagination.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/pagination.ex", source: pPhoenix, note: "Drop pagination.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: pHtml, note: "Tailwind utilities only; no JS." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — static links",
              description:
                "Each page is a real <a href> so it works without JS and is bookmarkable / shareable.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;nav&gt;</code>{" "}
                  landmark + aria-label lets AT users jump straight to it
                  from the landmarks menu.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-current="page"</code>{" "}
                  is the WAI-recommended way to mark the active page —
                  styling alone isn't enough.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-current",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current",
                },
                {
                  source: "APG",
                  label: "Pagination conventions",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/",
                },
              ],
              preview: (
                <Pagination ariaLabel="Articles">
                  <PaginationItem>
                    <PaginationPrevious href="?page=1" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="?page=1">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink active>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="?page=3">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="?page=3" />
                  </PaginationItem>
                </Pagination>
              ),
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — partial swap, no full reload",
              description:
                "Each page link is hx-get + hx-target. The server returns just the content + new pagination, htmx swaps innerHTML.",
              narrative: (
                <p>
                  Click around — the URL doesn't change but the content
                  (and the highlighted page) does. For deep links pair
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-push-url</code>{" "}
                  so back/forward + bookmarking still work.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-target / hx-swap",
                  href: "https://htmx.org/attributes/hx-target/",
                },
                {
                  source: "htmx",
                  label: "hx-push-url",
                  href: "https://htmx.org/attributes/hx-push-url/",
                },
              ],
              preview: (
                // Single swap target wraps both content + pagination so
                // one innerHTML swap refreshes everything at once.
                <div id="ex-pag-host" class="w-full max-w-2xl">
                  <div
                    aria-live="polite"
                    class="mb-4 grid gap-3 rounded-lg border p-4 text-sm"
                  >
                    <p class="font-medium">Showing page 1 of 5</p>
                    <ul class="grid gap-1 text-muted-foreground">
                      <li>Article 1 — Intro to htmx</li>
                      <li>Article 2 — Hypermedia controls</li>
                      <li>Article 3 — Server-rendered SPAs</li>
                    </ul>
                  </div>
                  <PaginationBlock active={1} />
                </div>
              ),
              jsx: `<PaginationLink active={n === active}
  hx-get={\`/api/articles?page=\${n}\`}
  hx-target="#article-list"
  hx-swap="innerHTML"
>{n}</PaginationLink>`,
              jinja: `{{ pagination_page(n, active=(n == active),
  hx_get="/api/articles?page=" ~ n,
  hx_target="#article-list",
  hx_swap="innerHTML") }}`,
              go: `{{template "pagination_page" (dict "N" $n "Active" (eq $n .Active)
  "Href" "/api/articles?page=…" )}}`,
              phoenix: `<.pagination_page n={n} active={n == @active}
  hx-get={~p"/api/articles?page=\#{n}"}
  hx-target="#article-list"
  hx-swap="innerHTML" />`,
            })}
          </section>
          <ApiTable
            title="<Pagination>"
            rows={PAGINATION_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx page endpoint — returns the demo content + a fresh pagination strip.
paginationRoutes.get("/page", (c) => {
  const raw = Number(c.req.query("page") ?? 1)
  const active = Math.max(1, Math.min(5, Number.isFinite(raw) ? Math.floor(raw) : 1))
  const items: Record<number, string[]> = {
    1: ["Article 1 — Intro to htmx", "Article 2 — Hypermedia controls", "Article 3 — Server-rendered SPAs"],
    2: ["Article 4 — Inline forms", "Article 5 — htmx + Tailwind", "Article 6 — Type-safe templates"],
    3: ["Article 7 — Out-of-band swaps", "Article 8 — Session flashes", "Article 9 — Hypermedia patterns"],
    4: ["Article 10 — SSE in htmx", "Article 11 — WebSocket hooks", "Article 12 — Real-time dashboards"],
    5: ["Article 13 — Test strategies", "Article 14 — Production tips", "Article 15 — Recap"],
  }
  return c.html(
    <>
      <div
        aria-live="polite"
        class="mb-4 grid gap-3 rounded-lg border p-4 text-sm"
      >
        <p class="font-medium">Showing page {active} of 5</p>
        <ul class="grid gap-1 text-muted-foreground">
          {items[active].map((t) => (
            <li>{t}</li>
          ))}
        </ul>
      </div>
      <PaginationBlock active={active} />
    </>,
  )
})
