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
import { FEED_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Feed, FeedArticle, FeedSentinel } from "@/registry/ui/feed"

export const feedRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/feed.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/feed.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/feed.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/feed.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/feed.html"), "utf8"),
])

const usageJsx = `import { Feed, FeedArticle, FeedSentinel } from "@/components/ui/feed"

<Feed ariaLabelledby="feed-title">
  <FeedArticle posinset={1} setsize={-1} labelledby="post-1-title" describedby="post-1-body" id="post-1">
    <h3 id="post-1-title" class="font-semibold">Shipping hypermedia at scale</h3>
    <p id="post-1-body" class="mt-1 text-sm text-muted-foreground">How we moved a dashboard to htmx.</p>
  </FeedArticle>
  <FeedSentinel href="/feed/page?page=2" />
</Feed>`

const usageJinja = `{% from "components/feed.html" import feed_open, feed_close, feed_article, feed_sentinel %}

{{ feed_open(aria_labelledby="feed-title") }}
  {% call feed_article(posinset=1, setsize=-1, labelledby="post-1-title", describedby="post-1-body", id="post-1") %}
    <h3 id="post-1-title" class="font-semibold">Shipping hypermedia at scale</h3>
    <p id="post-1-body" class="mt-1 text-sm text-muted-foreground">How we moved a dashboard to htmx.</p>
  {% endcall %}
  {{ feed_sentinel(href="/feed/page?page=2") }}
{{ feed_close() }}`

const usageGo = `{{template "feed" (dict "AriaLabelledby" "feed-title" "Body" (htmlSafe \`
  {{template "feed_article" (dict "Posinset" 1 "Setsize" -1 "Labelledby" "post-1-title" "Describedby" "post-1-body" "ID" "post-1" "Body" (htmlSafe \\\`
    <h3 id="post-1-title" class="font-semibold">Shipping hypermedia at scale</h3>
    <p id="post-1-body" class="mt-1 text-sm text-muted-foreground">How we moved a dashboard to htmx.</p>\\\`))}}
  {{template "feed_sentinel" (dict "Href" "/feed/page?page=2")}}\`))}}`

const usagePhoenix = `<.feed aria-labelledby="feed-title">
  <.feed_article posinset={1} setsize={-1} labelledby="post-1-title" describedby="post-1-body" id="post-1">
    <h3 id="post-1-title" class="font-semibold">Shipping hypermedia at scale</h3>
    <p id="post-1-body" class="mt-1 text-sm text-muted-foreground">How we moved a dashboard to htmx.</p>
  </.feed_article>
  <.feed_sentinel href={~p"/feed/page?page=2"} />
</.feed>`

const usageHtml = `<div role="feed" data-slot="feed" aria-labelledby="feed-title" class="flex flex-col gap-4">
  <article role="article" data-slot="feed-article" tabindex="0"
           aria-posinset="1" aria-setsize="-1"
           aria-labelledby="post-1-title" aria-describedby="post-1-body" id="post-1"
           class="rounded-xl border bg-card p-5 text-card-foreground shadow-sm …">
    <h3 id="post-1-title" class="font-semibold">Shipping hypermedia at scale</h3>
    <p id="post-1-body" class="mt-1 text-sm text-muted-foreground">How we moved a dashboard to htmx.</p>
  </article>
  <div data-slot="feed-sentinel" hx-get="/feed/page?page=2" hx-trigger="revealed" hx-swap="outerHTML"
       class="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">Loading more…</div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-infinite", label: "htmx — infinite scroll", nested: true },
  { href: "#ex-keyboard", label: "Keyboard navigation", nested: true },
  { href: "#api", label: "API Reference" },
]

// Demo data for the infinite-scroll example. -1 setsize signals "total
// unknown" (the feed appears to scroll forever).
const POSTS = [
  ["A field guide to hx-trigger", "Every synthetic event htmx ships and when to reach for each."],
  ["Out-of-band swaps in practice", "Update three regions from one response without a SPA framework."],
  ["Server-rendered SPAs", "The hypermedia approach to rich apps — fewer moving parts, faster TTFB."],
  ["Tailwind v4 container queries", "Component-level responsiveness without media-query soup."],
  ["Accessible feeds, the APG way", "role=feed, aria-posinset and the AT reading-mode contract."],
  ["Type-safe templates", "Compile-time guarantees for your server-rendered markup."],
  ["Latency, perceived and real", "Why optimistic UI matters less when the server is fast."],
  ["Progressive enhancement in 2026", "Ship HTML that works, then layer behaviour on top."],
]
const PAGE_SIZE = 3

// Render one batch of articles (posinset is 1-based across the whole feed).
function ArticleBatch({ page: pageNum }: { page: number }) {
  const start = (pageNum - 1) * PAGE_SIZE
  const slice = POSTS.slice(start, start + PAGE_SIZE)
  const hasMore = start + PAGE_SIZE < POSTS.length
  return (
    <>
      {slice.map(([title, body], i) => {
        const pos = start + i + 1
        return (
          <FeedArticle
            posinset={pos}
            setsize={-1}
            labelledby={`feed-post-${pos}-title`}
            describedby={`feed-post-${pos}-body`}
            id={`feed-post-${pos}`}
            data-test={`feed-article-${pos}`}
          >
            <h3 id={`feed-post-${pos}-title`} class="font-semibold">{title}</h3>
            <p id={`feed-post-${pos}-body`} class="mt-1 text-sm text-muted-foreground">{body}</p>
          </FeedArticle>
        )
      })}
      {/* When there are no more pages, omit the sentinel so the chain stops. */}
      {hasMore && <FeedSentinel href={`/feed/page?page=${pageNum + 1}`} data-test="feed-sentinel" />}
    </>
  )
}

feedRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/feed.json`

  return page(
    c,
    <Layout title="Feed — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/feed" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Feed</h1>
            <p class="text-muted-foreground">
              A{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="feed"</code>{" "}
              container of{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;article&gt;</code>{" "}
              items that loads more as you scroll. A structure, not a widget —
              screen readers stay in reading mode while the page streams in
              content. The trailing sentinel uses htmx{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-trigger="revealed"</code>{" "}
              for infinite scroll.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-feed"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/feed.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/feed.html", source: jinjaSource, note: "Copy feed.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/feed.tmpl", source: goSource, note: "Add feed.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/feed.ex", source: phoenixSource, note: "Drop feed.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/feed.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — a feed of articles",
              description:
                "Each post is a real <article> with aria-posinset / aria-setsize, named by its title and described by its body so AT users can skim.",
              narrative: (
                <p>
                  The container is a non-focusable{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="feed"</code>{" "}
                  named by the heading via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-labelledby</code>.
                  Each article is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="0"</code>{" "}
                  so the screen-reader reading cursor can land on it. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-setsize="-1"</code>{" "}
                  when the total is unknown.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Feed pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/",
                },
                {
                  source: "MDN",
                  label: "<article>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article",
                },
              ],
              preview: (
                <div class="w-full max-w-2xl">
                  <h2 id="feed-basic-title" class="mb-4 text-lg font-semibold tracking-tight">
                    Latest posts
                  </h2>
                  <Feed ariaLabelledby="feed-basic-title">
                    <FeedArticle posinset={1} setsize={2} labelledby="basic-1-title" describedby="basic-1-body" id="basic-1">
                      <h3 id="basic-1-title" class="font-semibold">Shipping hypermedia at scale</h3>
                      <p id="basic-1-body" class="mt-1 text-sm text-muted-foreground">
                        How we moved a dashboard from a SPA to server-rendered htmx — and why the page got faster.
                      </p>
                    </FeedArticle>
                    <FeedArticle posinset={2} setsize={2} labelledby="basic-2-title" describedby="basic-2-body" id="basic-2">
                      <h3 id="basic-2-title" class="font-semibold">Tailwind v4: the Oxide engine</h3>
                      <p id="basic-2-body" class="mt-1 text-sm text-muted-foreground">
                        A tour of CSS-first config, container queries, and the new color system.
                      </p>
                    </FeedArticle>
                  </Feed>
                </div>
              ),
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-infinite",
              title: "htmx — infinite scroll",
              description:
                "The trailing sentinel has hx-get + hx-trigger=\"revealed\". When it scrolls into view it requests the next page; the response (more articles + a fresh sentinel) replaces it with hx-swap=\"outerHTML\".",
              narrative: (
                <p>
                  This is the htmx v4 infinite-scroll pattern: the sentinel
                  requests{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">/feed/page?page=N</code>{" "}
                  on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">revealed</code>, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">outerHTML</code>{" "}
                  swaps in the next batch plus a new sentinel — a self-extending
                  chain that stops when the server omits the sentinel. Scroll
                  the box to load more.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Infinite scroll (revealed)",
                  href: "https://htmx.org/examples/infinite-scroll/",
                },
                {
                  source: "htmx",
                  label: "hx-trigger=\"revealed\"",
                  href: "https://htmx.org/reference/#trigger-modifiers",
                },
                {
                  source: "APG",
                  label: "aria-busy during load",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/",
                },
              ],
              preview: (
                <div class="w-full max-w-2xl">
                  <h2 id="feed-inf-title" class="mb-4 text-lg font-semibold tracking-tight">
                    Stream
                  </h2>
                  {/* overflow container → APG-recommended scroll region; the
                      htmx docs say to use revealed for the page viewport, but
                      it still fires for an inner scroller in our setup. */}
                  <div class="max-h-80 overflow-y-auto rounded-lg border p-4">
                    <Feed ariaLabelledby="feed-inf-title" id="feed-inf">
                      <ArticleBatch page={1} />
                    </Feed>
                  </div>
                </div>
              ),
              jsx: `<Feed ariaLabelledby="feed-title">
  {/* first page rendered server-side */}
  <FeedArticle posinset={1} setsize={-1} labelledby="p1" describedby="b1">…</FeedArticle>
  <FeedArticle posinset={2} setsize={-1} labelledby="p2" describedby="b2">…</FeedArticle>
  <FeedArticle posinset={3} setsize={-1} labelledby="p3" describedby="b3">…</FeedArticle>
  {/* sentinel loads page 2 when revealed */}
  <FeedSentinel href="/feed/page?page=2" />
</Feed>

// Server GET /feed/page?page=N returns the next FeedArticle batch +
// a fresh <FeedSentinel href="/feed/page?page=N+1" />. Omit the
// sentinel on the last page so the chain stops.`,
              jinja: `{{ feed_open(aria_labelledby="feed-title") }}
  {% for p in posts %}
    {% call feed_article(posinset=p.pos, setsize=-1, labelledby=p.title_id, describedby=p.body_id) %}…{% endcall %}
  {% endfor %}
  {{ feed_sentinel(href="/feed/page?page=2") }}
{{ feed_close() }}`,
              go: `{{template "feed" (dict "AriaLabelledby" "feed-title" "Body" (htmlSafe \`
  {{template "feed_article" (dict "Posinset" 1 "Setsize" -1 "Labelledby" "p1" "Describedby" "b1" "Body" (htmlSafe "…"))}}
  {{template "feed_sentinel" (dict "Href" "/feed/page?page=2")}}\`))}}`,
              phoenix: `<.feed aria-labelledby="feed-title">
  <.feed_article :for={p <- @posts} posinset={p.pos} setsize={-1}
                 labelledby={p.title_id} describedby={p.body_id}>…</.feed_article>
  <.feed_sentinel href={~p"/feed/page?page=2"} />
</.feed>`,
            })}

            {await Example({
              id: "ex-keyboard",
              title: "Keyboard navigation",
              description:
                "Inside the feed, Page Down / Page Up move focus between articles; Ctrl+Home jumps to the first article and Ctrl+End leaves the feed. These keys are APG-recommended but author-optional.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">feed</code>{" "}
                  role has no native desktop equivalent, so the APG only{" "}
                  <em>recommends</em> these keys — they are author-optional. We
                  wire them in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
                  keyed on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-slot="feed"</code>.
                  Tab onto an article below, then press Page Down / Page Up.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Feed keyboard interaction",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/#keyboardinteraction",
                },
              ],
              preview: (
                <div class="w-full max-w-2xl">
                  <h2 id="feed-kbd-title" class="mb-4 text-lg font-semibold tracking-tight">
                    Try the keys
                  </h2>
                  <Feed ariaLabelledby="feed-kbd-title">
                    <FeedArticle posinset={1} setsize={3} labelledby="kbd-1-title" describedby="kbd-1-body" id="kbd-1" data-test="kbd-article-1">
                      <h3 id="kbd-1-title" class="font-semibold">First article</h3>
                      <p id="kbd-1-body" class="mt-1 text-sm text-muted-foreground">Focus me, then press Page Down.</p>
                    </FeedArticle>
                    <FeedArticle posinset={2} setsize={3} labelledby="kbd-2-title" describedby="kbd-2-body" id="kbd-2" data-test="kbd-article-2">
                      <h3 id="kbd-2-title" class="font-semibold">Second article</h3>
                      <p id="kbd-2-body" class="mt-1 text-sm text-muted-foreground">Page Up goes back, Ctrl+Home jumps here.</p>
                    </FeedArticle>
                    <FeedArticle posinset={3} setsize={3} labelledby="kbd-3-title" describedby="kbd-3-body" id="kbd-3" data-test="kbd-article-3">
                      <h3 id="kbd-3-title" class="font-semibold">Third article</h3>
                      <p id="kbd-3-body" class="mt-1 text-sm text-muted-foreground">Ctrl+End moves focus out of the feed.</p>
                    </FeedArticle>
                  </Feed>
                </div>
              ),
              jsx: `// No extra markup — the keyboard contract is wired in site.js
// keyed on data-slot="feed" / data-slot="feed-article".
// Page Down → next article, Page Up → previous,
// Ctrl+Home → first article, Ctrl+End → out of the feed.`,
              jinja: `{# Keyboard nav is provided by site.js (data-slot="feed"). #}`,
              go: `{{/* Keyboard nav is provided by site.js (data-slot="feed"). */}}`,
              phoenix: `<%# Keyboard nav is provided by site.js (data-slot="feed"). %>`,
            })}
          </section>
          <ApiTable
            title="<Feed>"
            rows={FEED_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx infinite-scroll endpoint: return the next batch of articles plus a
// fresh sentinel (or no sentinel on the last page, stopping the chain).
feedRoutes.get("/page", (c) => {
  const raw = Number(c.req.query("page") ?? 1)
  const pageNum = Math.max(1, Number.isFinite(raw) ? Math.floor(raw) : 1)
  return c.html(<ArticleBatch page={pageNum} />)
})
