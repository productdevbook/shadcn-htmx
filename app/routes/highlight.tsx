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
import { HIGHLIGHT_PROPS } from "@/app/data/api-rows"
import { Highlight } from "@/registry/ui/highlight"
import { ActiveSearch } from "@/registry/ui/active-search"
import { Label } from "@/registry/ui/label"

export const highlightRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/highlight.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/highlight.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/highlight.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/highlight.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/highlight.html"), "utf8"),
  ])

const usageJsx = `import { Highlight } from "@/components/ui/highlight"

// Scan mode — wrap each match of the query inside the text:
<Highlight text="Several species of salamander" query="salamander" />

// Single-term mode — the server already sliced the exact run:
<p>Evading the dreaded <Highlight>Imperial</Highlight> Starfleet.</p>`

const usageJinja = `{% from "components/highlight.html" import highlight, mark %}

{{ highlight("Several species of salamander", query="salamander") }}

<p>Evading the dreaded {% call mark() %}Imperial{% endcall %} Starfleet.</p>`

const usageGo = `{{/* Scan in Go, pass ordered segments: */}}
{{template "highlight" (dict "Segments" $segs)}}

{{/* Single-term mode: */}}
<p>Evading the dreaded {{template "mark" (dict "Body" "Imperial")}} Starfleet.</p>`

const usagePhoenix = `<.highlight text="Several species of salamander" query="salamander" />

<p>Evading the dreaded <.mark>Imperial</.mark> Starfleet.</p>`

const usageHtml = `<span data-slot="highlight">Several species of
  <mark class="rounded-sm bg-primary/15 px-0.5 font-medium text-foreground …">salamander</mark>
  inhabit the temperate rainforest.</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Mark search matches", nested: true },
  { href: "#ex-live", label: "Live search results", nested: true },
  { href: "#ex-words", label: "Multi-term query", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- Demo data + helpers ---------------------------------------------------
// A tiny corpus the htmx demo searches. Each match is wrapped in <mark> by the
// server before the fragment is swapped into the results list.

type Article = { title: string; body: string }

const ARTICLES: Article[] = [
  {
    title: "Pacific Northwest salamanders",
    body: "Several species of salamander inhabit the temperate rainforest of the Pacific Northwest.",
  },
  {
    title: "Nocturnal hunters",
    body: "Most salamanders are nocturnal, and hunt for insects, worms, and other small creatures.",
  },
  {
    title: "Imperial Starfleet",
    body: "Evading the dreaded Imperial Starfleet, a group of freedom fighters established a new base.",
  },
  {
    title: "Ice world of Hoth",
    body: "Imperial troops drove the Rebel forces from their hidden base and pursued them across the galaxy.",
  },
]

function findArticles(query: string): Article[] {
  const s = query.trim().toLowerCase()
  if (s.length === 0) return ARTICLES
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(s) || a.body.toLowerCase().includes(s),
  )
}

// The <li> rows an htmx endpoint returns — also used to render the initial
// list inline so the docs preview isn't empty before the first request. Each
// row highlights the matched query terms in its title + body.
function ResultRows(props: { articles: Article[]; query: string }) {
  if (props.articles.length === 0) {
    return (
      <li class="px-3 py-2 text-sm text-muted-foreground">
        No results found.
      </li>
    )
  }
  return (
    <>
      {props.articles.map((a) => (
        <li class="border-b px-3 py-2 last:border-0">
          <p class="text-sm font-medium">
            <Highlight text={a.title} query={props.query} words />
          </p>
          <p class="text-sm text-muted-foreground">
            <Highlight text={a.body} query={props.query} words />
          </p>
        </li>
      ))}
    </>
  )
}

function ResultsList(props: { listId: string; articles: Article[]; query: string }) {
  return (
    <ul
      id={props.listId}
      class="w-full overflow-hidden rounded-md border bg-card"
    >
      <ResultRows articles={props.articles} query={props.query} />
    </ul>
  )
}

highlightRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/highlight.json`

  return page(
    c,
    <Layout title="Highlight — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/highlight" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Highlight</h1>
            <p class="text-muted-foreground">
              Wraps the words that matched a search query in a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;mark&gt;</code>
              , the semantic element for text relevant to the user's current
              activity. Rendered entirely on the server, styled with theme
              tokens, zero client JS — drop it inside the fragment htmx swaps
              into your results list.
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
              id="install-highlight"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/highlight.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/highlight.html", source: jinjaSource, note: "Copy highlight.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/highlight.tmpl", source: goSource, note: "Add highlight.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/highlight.ex", source: phoenixSource, note: "Drop highlight.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/highlight.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
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
              title: "Mark the matched query inside a passage",
              description:
                "Pass the source text and the query; the server scans the text and wraps each match in <mark>. The original casing of the source is preserved.",
              narrative: (
                <p>
                  This is MDN's canonical use for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;mark&gt;</code>
                  : marking "a portion of the document's content which is likely
                  to be relevant to the user's current activity … the words that
                  matched a search operation." The browser's default yellow
                  background is reset to{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">bg-primary/15</code>{" "}
                  so it reads on brand, and the bold weight plus rounded chip are
                  a non-colour cue (WCAG 1.4.1) that survives a forced-colours
                  theme.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<mark> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/mark",
                },
                {
                  source: "WCAG",
                  label: "1.4.1 Use of Color",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
                },
              ],
              preview: (
                <div class="w-full max-w-md space-y-2 text-sm">
                  <p>
                    <Highlight
                      text="Several species of salamander inhabit the temperate rainforest of the Pacific Northwest."
                      query="salamander"
                    />
                  </p>
                  <p>
                    <Highlight
                      text="Most salamanders are nocturnal, and hunt for insects, worms, and other small creatures."
                      query="salamander"
                    />
                  </p>
                </div>
              ),
              jsx: `<Highlight
  text="Several species of salamander inhabit the temperate rainforest."
  query="salamander"
/>`,
              jinja: `{{ highlight("Several species of salamander inhabit the temperate rainforest.",
            query="salamander") }}`,
              go: `{{template "highlight" (dict "Segments" $segs)}}`,
              phoenix: `<.highlight
  text="Several species of salamander inhabit the temperate rainforest."
  query="salamander"
/>`,
            })}

            {await Example({
              id: "ex-live",
              title: "Live search results — htmx swaps marked rows in",
              description:
                "An Active Search box fetches matching articles as you type; the server marks the matched query in each returned row before swapping it into the list. The highlighting is pure SSR — it just rides along in the htmx fragment.",
              narrative: (
                <p>
                  Highlight has no htmx attributes of its own — it produces the
                  marked HTML, and htmx swaps that fragment into the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>
                  . The server echoes the query into each{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;Highlight&gt;</code>{" "}
                  so the marks always reflect what the user typed. Try{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">salamander</code>{" "}
                  or{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">imperial</code>
                  .
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<mark> for search results",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/mark#identifying_context-sensitive_passages",
                },
                {
                  source: "htmx",
                  label: "hx-get / hx-target / hx-swap",
                  href: "https://htmx.org/reference/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <Label htmlFor="ex-hl-q">Search articles</Label>
                  <ActiveSearch
                    id="ex-hl-q"
                    name="q"
                    action="/docs/highlight/search"
                    placeholder={`Try "salamander" or "imperial"…`}
                    hx-target="#ex-hl-results"
                    hx-swap="innerHTML"
                  />
                  <ResultsList
                    listId="ex-hl-results"
                    articles={ARTICLES}
                    query=""
                  />
                </div>
              ),
              jsx: `<ActiveSearch id="q" action="/search"
  hx-target="#results" hx-swap="innerHTML" />
<ul id="results"></ul>

// On the server, for each result row:
<Highlight text={article.title} query={q} words />`,
              jinja: `{{ active_search(id="q", action="/search",
                 hx_target="#results", hx_swap="innerHTML") }}
<ul id="results"></ul>

{# server-side, per row: #}
{{ highlight(article.title, query=q, words=true) }}`,
              go: `{{template "active-search" (dict "ID" "q" "Action" "/search"
  "HxTarget" "#results" "HxSwap" "innerHTML")}}
<ul id="results"></ul>

{{/* server-side, per row: */}}
{{template "highlight" (dict "Segments" $segs)}}`,
              phoenix: `<.active_search id="q" action={~p"/search"}
  hx-target="#results" hx-swap="innerHTML" />
<ul id="results"></ul>

<%# server-side, per row: %>
<.highlight text={article.title} query={@q} words />`,
            })}

            {await Example({
              id: "ex-words",
              title: "Multi-term query — mark each word independently",
              description:
                "With words, each whitespace-separated term in the query is marked on its own. Useful for multi-word searches where a single phrase match would highlight nothing.",
              narrative: (
                <p>
                  Without{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">words</code>{" "}
                  the whole query is treated as one phrase; with it, the query
                  is split on whitespace and each term is matched separately.
                  Matching is case-insensitive by default — pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">caseSensitive</code>{" "}
                  to require an exact-case match.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<mark> usage notes",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/mark#usage_notes",
                },
              ],
              preview: (
                <div class="w-full max-w-md space-y-2 text-sm">
                  <p>
                    <Highlight
                      text="Imperial troops drove the Rebel forces from their hidden base across the galaxy."
                      query="rebel imperial"
                      words
                    />
                  </p>
                </div>
              ),
              jsx: `<Highlight
  text="Imperial troops drove the Rebel forces from their hidden base."
  query="rebel imperial"
  words
/>`,
              jinja: `{{ highlight("Imperial troops drove the Rebel forces from their hidden base.",
            query="rebel imperial", words=true) }}`,
              go: `{{/* split on each term in Go, then: */}}
{{template "highlight" (dict "Segments" $segs)}}`,
              phoenix: `<.highlight
  text="Imperial troops drove the Rebel forces from their hidden base."
  query="rebel imperial"
  words
/>`,
            })}
          </section>

          <ApiTable title="Highlight" rows={HIGHLIGHT_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// --- htmx demo endpoint ----------------------------------------------------
// Returns <li> rows that htmx swaps into the results list. The query is echoed
// into each <Highlight> so the server-rendered marks match what was typed.
highlightRoutes.get("/search", (c) => {
  const q = c.req.query("q") ?? ""
  return c.html(<ResultRows articles={findArticles(q)} query={q} />)
})
