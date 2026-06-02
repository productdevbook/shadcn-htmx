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
import { LOAD_MORE_PROPS } from "@/app/data/api-rows"
import { LoadMore } from "@/registry/ui/load-more"

export const loadMoreRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/load-more.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/load-more.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/load-more.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/load_more.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/load-more.html"), "utf8"),
])

const usageJsx = `import { LoadMore } from "@/components/ui/load-more"

{/* Click trigger — appends the next page, then replaces itself. */}
<LoadMore href="/comments?page=2" label="Show more comments" />

{/* Scroll sentinel — fires when it enters the viewport. */}
<LoadMore href="/contacts?page=2" trigger="intersect" />`

const usageJinja = `{% from "components/load-more.html" import load_more %}

{{ load_more(href="/comments?page=2", label="Show more comments") }}

{{ load_more(href="/contacts?page=2", trigger="intersect") }}`

const usageGo = `{{template "load_more" (dict "Href" "/comments?page=2" "Label" "Show more comments")}}

{{template "load_more" (dict "Href" "/contacts?page=2" "Trigger" "intersect")}}`

const usagePhoenix = `<.load_more href={~p"/comments?page=2"} label="Show more comments" />

<.load_more href={~p"/contacts?page=2"} trigger="intersect" />`

const usageHtml = `<button type="button" data-slot="load-more" data-trigger="click"
        hx-get="/comments?page=2" hx-trigger="click" hx-target="this" hx-swap="outerHTML"
        class="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-accent …">
  <span class="htmx-indicator size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" aria-hidden="true"></span>
  Show more comments
</button>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Click to load", nested: true },
  { href: "#ex-scroll", label: "Infinite scroll", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- Demo data + batch renderer for the live htmx examples ------------
const COMMENTS: [string, string][] = [
  ["1cg", "daily reminder that the browser is the framework"],
  ["S4RF", "In 1997 I would have shipped this with a Perl script and a cronjob"],
  ["uncle k2", "I am begging a front end dev to open the DOM inspector one (1) time."],
  ["gnut", "pretty cool experiment. A lot of IDEs hate it though."],
  ["wyrmisis", "Sir, another React dev tool has hit the browser."],
  ["M379KL", "Build step for CSS was nuts to realize. JavaScript required for CSS also nuts."],
  ["fizzy", "made this for a different convo but here ya go"],
  ["Reiss", "this was everybody in europe 23 years ago"],
  ["pavlos", "Real"],
]
const PAGE_SIZE = 3

// One batch of comment rows + (when more remain) a fresh trigger of the given
// mode pointing at the next page. Omitting the trigger ends the chain — that
// is the whole self-replacing contract.
function CommentBatch({
  page: pageNum,
  mode,
}: {
  page: number
  mode: "click" | "intersect"
}) {
  const start = (pageNum - 1) * PAGE_SIZE
  const slice = COMMENTS.slice(start, start + PAGE_SIZE)
  const hasMore = start + PAGE_SIZE < COMMENTS.length
  const path = mode === "click" ? "/load-more/comments" : "/load-more/scroll"
  return (
    <>
      {slice.map(([author, text], i) => {
        const n = start + i + 1
        return (
          <div class="flex gap-3" data-test={`comment-${n}`}>
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {author.split(" ").map((w) => w[0]).join("")}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-foreground">{author}</p>
              <p class="text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        )
      })}
      {hasMore && (
        <LoadMore
          href={`${path}?page=${pageNum + 1}`}
          trigger={mode}
          label="Show more comments"
          data-test="load-more-trigger"
        />
      )}
    </>
  )
}

loadMoreRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/load-more.json`

  return page(
    c,
    <Layout title="Load More — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/load-more" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Load More</h1>
            <p class="text-muted-foreground">
              A self-replacing pagination trigger. Click a button or scroll a
              sentinel into view; htmx appends the next page and swaps in a
              fresh trigger via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-swap="outerHTML"</code>.
              When the server omits the trigger, the chain ends. The click mode
              is a real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button&gt;</code>{" "}
              so it works without JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-load-more"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/load-more.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/load-more.html", source: jinjaSource, note: "Copy load-more.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/load-more.tmpl", source: goSource, note: "Add load-more.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/load_more.ex", source: phoenixSource, note: "Drop load_more.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/load-more.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Click to load",
              description:
                "A real <button> with hx-target=\"this\" + hx-swap=\"outerHTML\". On click it requests the next page; the response (more items + a fresh button) replaces it. Omit the button on the last page and the chain stops.",
              narrative: (
                <p>
                  This is the htmx click-to-load pattern. Because the trigger is
                  a plain{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;button&gt;</code>,
                  it works with no JavaScript at all — htmx only{" "}
                  <em>upgrades</em> the click into a request and replaces the
                  button in place. The inline spinner carries the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx-indicator</code>{" "}
                  class, so it appears only while the request is in flight. Keep
                  clicking until the button disappears.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Click to load",
                  href: "https://htmx.org/examples/click-to-load/",
                },
                {
                  source: "htmx",
                  label: "hx-swap=\"outerHTML\"",
                  href: "https://htmx.org/reference/#swapping",
                },
              ],
              preview: (
                <div id="ex-click-host" class="w-full max-w-md space-y-4">
                  <CommentBatch page={1} mode="click" />
                </div>
              ),
              jsx: `<div id="comments" class="space-y-4">
  {/* first page rendered server-side */}
  <Comment author="1cg">…</Comment>
  {/* button loads page 2, then replaces itself */}
  <LoadMore href="/comments?page=2" label="Show more comments" />
</div>

// Server GET /comments?page=N returns the next batch +
// a fresh <LoadMore href="/comments?page=N+1" />. Omit it
// on the last page so the chain stops.`,
              jinja: `<div id="comments" class="space-y-4">
  {% for c in comments %}{{ comment(c) }}{% endfor %}
  {{ load_more(href="/comments?page=2", label="Show more comments") }}
</div>`,
              go: `<div id="comments" class="space-y-4">
  {{range .Comments}}{{template "comment" .}}{{end}}
  {{template "load_more" (dict "Href" "/comments?page=2" "Label" "Show more comments")}}
</div>`,
              phoenix: `<div id="comments" class="space-y-4">
  <.comment :for={c <- @comments} comment={c} />
  <.load_more href={~p"/comments?page=2"} label="Show more comments" />
</div>`,
            })}

            {await Example({
              id: "ex-scroll",
              title: "Infinite scroll",
              description:
                "Set trigger=\"intersect\" (or \"revealed\") to swap the button for a scroll sentinel. It fires hx-trigger=\"intersect once\" when it enters the viewport — no click needed — and self-replaces the same way. Use intersect inside an overflow container, revealed for the page viewport.",
              narrative: (
                <p>
                  Same self-replacing chain, no button: the sentinel uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="intersect once"</code>,
                  which is backed by the browser's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">IntersectionObserver</code>.
                  Scroll the box below to pull in the next page automatically.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Infinite scroll",
                  href: "https://htmx.org/examples/infinite-scroll/",
                },
                {
                  source: "MDN",
                  label: "Intersection Observer API",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <div
                    id="ex-scroll-host"
                    tabindex={0}
                    role="region"
                    aria-label="Comments"
                    class="max-h-64 space-y-4 overflow-y-auto rounded-lg border p-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <CommentBatch page={1} mode="intersect" />
                  </div>
                </div>
              ),
              jsx: `{/* A scrollable overflow container needs keyboard access:
    tabindex + role="region" + an accessible name make it a
    focusable, named scrollable region (axe scrollable-region-focusable). */}
<div
  id="comments"
  tabindex={0}
  role="region"
  aria-label="Comments"
  class="max-h-64 space-y-4 overflow-y-auto"
>
  {/* first page rendered server-side */}
  <Comment author="1cg">…</Comment>
  {/* sentinel loads page 2 when scrolled into view */}
  <LoadMore href="/comments?page=2" trigger="intersect" />
</div>`,
              jinja: `{# Scrollable box → tabindex + role="region" + aria-label
   so keyboard users can focus and scroll it. #}
<div id="comments" tabindex="0" role="region" aria-label="Comments"
     class="max-h-64 space-y-4 overflow-y-auto">
  {% for c in comments %}{{ comment(c) }}{% endfor %}
  {{ load_more(href="/comments?page=2", trigger="intersect") }}
</div>`,
              go: `{{/* Scrollable box → tabindex + role="region" + aria-label
     so keyboard users can focus and scroll it. */}}
<div id="comments" tabindex="0" role="region" aria-label="Comments"
     class="max-h-64 space-y-4 overflow-y-auto">
  {{range .Comments}}{{template "comment" .}}{{end}}
  {{template "load_more" (dict "Href" "/comments?page=2" "Trigger" "intersect")}}
</div>`,
              phoenix: `<%!-- Scrollable box → tabindex + role="region" + aria-label
     so keyboard users can focus and scroll it. --%>
<div id="comments" tabindex="0" role="region" aria-label="Comments"
     class="max-h-64 space-y-4 overflow-y-auto">
  <.comment :for={c <- @comments} comment={c} />
  <.load_more href={~p"/comments?page=2"} trigger="intersect" />
</div>`,
            })}
          </section>
          <ApiTable title="<LoadMore>" rows={LOAD_MORE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx click-to-load endpoint: return the next comment batch + a fresh click
// trigger (or nothing on the last page, ending the chain).
loadMoreRoutes.get("/comments", (c) => {
  const raw = Number(c.req.query("page") ?? 1)
  const pageNum = Math.max(1, Number.isFinite(raw) ? Math.floor(raw) : 1)
  return c.html(<CommentBatch page={pageNum} mode="click" />)
})

// htmx infinite-scroll endpoint: same batch but with a sentinel trigger.
loadMoreRoutes.get("/scroll", (c) => {
  const raw = Number(c.req.query("page") ?? 1)
  const pageNum = Math.max(1, Number.isFinite(raw) ? Math.floor(raw) : 1)
  return c.html(<CommentBatch page={pageNum} mode="intersect" />)
})
