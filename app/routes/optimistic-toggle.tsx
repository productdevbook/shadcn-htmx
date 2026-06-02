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
import { OPTIMISTIC_TOGGLE_PROPS } from "@/app/data/api-rows"
import { OptimisticToggle } from "@/registry/ui/optimistic-toggle"

export const optimisticToggleRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/optimistic-toggle.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/optimistic-toggle.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/optimistic-toggle.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/optimistic_toggle.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/optimistic-toggle.html"), "utf8"),
  ])

// --- Inline icons (heart / user-plus + check) -----------------------------

function HeartIcon(props: { filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={props.filled ? "currentColor" : "none"}
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  )
}

function FollowIcon(props: { following?: boolean }) {
  return props.following ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  )
}

// The fresh, server-authoritative toggle returned after a POST. Reusing the
// component server-side means the response is identical markup in the new
// state — exactly what hx-swap="outerHTML" expects.
function LikeToggle(props: { id: string; liked: boolean; action: string }) {
  return (
    <OptimisticToggle
      id={props.id}
      variant="default"
      pressed={props.liked}
      ariaLabel="Like"
      hx-post={props.action}
      optimistic={
        <>
          <HeartIcon filled />
          {props.liked ? "Like" : "Liked"}
        </>
      }
    >
      <HeartIcon filled={props.liked} />
      {props.liked ? "Liked" : "Like"}
    </OptimisticToggle>
  )
}

function FollowToggle(props: { id: string; following: boolean; action: string }) {
  return (
    <OptimisticToggle
      id={props.id}
      variant="outline"
      pressed={props.following}
      ariaLabel="Follow"
      hx-post={props.action}
      optimistic={
        <>
          <FollowIcon following={!props.following} />
          {props.following ? "Follow" : "Following"}
        </>
      }
    >
      <FollowIcon following={props.following} />
      {props.following ? "Following" : "Follow"}
    </OptimisticToggle>
  )
}

const usageJsx = `import { OptimisticToggle } from "@/components/ui/optimistic-toggle"

// children = resting state, optimistic = the just-toggled flash.
// The server POST should reply with a fresh <OptimisticToggle> in the new
// state (hx-swap="outerHTML" is the component default).
<OptimisticToggle
  id="like-42"
  pressed={post.likedByMe}
  ariaLabel="Like"
  hx-post="/posts/42/like"
  optimistic={<><HeartIcon filled /> Liked</>}
>
  <HeartIcon filled={post.likedByMe} /> {post.likedByMe ? "Liked" : "Like"}
</OptimisticToggle>`

const usageJinja = `{% from "components/optimistic-toggle.html" import optimistic_toggle %}

{% call(state) optimistic_toggle(id="like-42", pressed=liked,
        hx_post="/posts/42/like", aria_label="Like") %}
  {% if state == "current" %}{{ "Liked" if liked else "Like" }}
  {% else %}Liked{% endif %}
{% endcall %}`

const usageGo = `tpl.ExecuteTemplate(w, "optimistic-toggle", map[string]any{
    "ID": "like-42", "Pressed": liked, "AriaLabel": "Like",
    "Current":    template.HTML(currentLabel),
    "Optimistic": template.HTML("Liked"),
    "Attrs":      map[string]string{"hx-post": "/posts/42/like"},
})`

const usagePhoenix = `<.optimistic_toggle id="like-42" pressed={@liked}
  hx-post="/posts/42/like" aria-label="Like">
  <:current>{if @liked, do: "Liked", else: "Like"}</:current>
  <:optimistic>Liked</:optimistic>
</.optimistic_toggle>`

const usageHtml = `<!-- No extension. The component's behaviour script (copy it once into
     site.js) flips on htmx:before:request and rolls back on a 4xx/5xx. -->
<span data-slot="optimistic-toggle" class="contents">
  <button type="button" id="like-42" aria-pressed="false" aria-label="Like"
          hx-post="/posts/42/like" hx-target="this" hx-swap="outerHTML"
          data-optimistic="#like-42-optimistic" class="…">Like</button>
  <template id="like-42-optimistic">
    <span data-slot="optimistic-toggle-state" aria-pressed="true" class="…">Liked</span>
  </template>
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Like a post", nested: true },
  { href: "#ex-follow", label: "Follow toggle", nested: true },
  { href: "#ex-rollback", label: "Rollback on error", nested: true },
  { href: "#api", label: "API Reference" },
]

optimisticToggleRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/optimistic-toggle.json`

  return page(
    c,
    <Layout title="Optimistic Toggle — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/optimistic-toggle" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Optimistic Toggle</h1>
            <p class="text-muted-foreground">
              A server-backed action toggle — like, star, follow, pin. Clicking
              flips the appearance{" "}
              <em>instantly</em> via a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;template&gt;</code>{" "}
              of the toggled state, then reconciles with the server's HTML
              response — rolling back automatically if the request fails. Built
              on a real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button&gt;</code>{" "}
              with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-pressed</code>{" "}
              and a few lines of htmx-event JS — no extension required.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              No htmx extension needed. The component ships a tiny behaviour
              script that listens for{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx:before:request</code>{" "}
              (flip) and{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx:before:swap</code>{" "}
              (cancel the swap and roll back on a 4xx/5xx). It attaches once,
              page-wide — drop it in your{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
              (the docs render it inline).
            </p>
            <LangTabs
              id="install-optimistic-toggle"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/optimistic-toggle.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/optimistic-toggle.html", source: jinjaSource, note: "Copy optimistic-toggle.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/optimistic-toggle.tmpl", source: goSource, note: "Add optimistic-toggle.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/optimistic_toggle.ex", source: phoenixSource, note: "Drop optimistic_toggle.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/optimistic-toggle.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens. The behaviour <script> is included — copy it once into your site.js." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Like a post",
              description:
                "Click the heart. The button flips to the liked state instantly, the server POST confirms it, and the authoritative <button> swaps in. The likes count below is part of the server response.",
              narrative: (
                <p>
                  The button carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-optimistic="#like-optimistic"</code>{" "}
                  pointing at the sibling{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;template&gt;</code>.
                  On{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx:before:request</code>{" "}
                  the behaviour script paints the template's markup into the
                  button and flips{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed</code>,
                  so the liked look appears before any network round-trip. When
                  the response lands,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="outerHTML"</code>{" "}
                  replaces the button with the server's version. The accessible
                  name stays{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">"Like"</code>{" "}
                  in both states — only{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed</code>{" "}
                  flips, per the APG toggle-button pattern.
                </p>
              ),
              references: [
                { source: "htmx", label: "htmx:before:swap event", href: "https://htmx.org/reference/#events" },
                { source: "MDN", label: "<template> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template" },
                { source: "APG", label: "Button (toggle) pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/examples/button/" },
                { source: "MDN", label: "aria-pressed", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed" },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <LikeToggle id="ex-like" liked={false} action="/docs/optimistic-toggle/like" />
                </div>
              ),
              jsx: `<OptimisticToggle id="like-42" pressed={liked} ariaLabel="Like"
  hx-post="/posts/42/like"
  optimistic={<><HeartIcon filled /> Liked</>}>
  <HeartIcon filled={liked} /> {liked ? "Liked" : "Like"}
</OptimisticToggle>`,
              jinja: `{% call(state) optimistic_toggle(id="like-42", pressed=liked,
        hx_post="/posts/42/like", aria_label="Like") %}
  {% if state == "current" %}{{ "Liked" if liked else "Like" }}
  {% else %}Liked{% endif %}
{% endcall %}`,
              go: `{{template "optimistic-toggle" (dict
  "ID" "like-42" "Pressed" .Liked "AriaLabel" "Like"
  "Current" (htmlSafe .CurrentLabel) "Optimistic" (htmlSafe "Liked")
  "Attrs" (dict "hx-post" "/posts/42/like"))}}`,
              phoenix: `<.optimistic_toggle id="like-42" pressed={@liked}
  hx-post="/posts/42/like" aria-label="Like">
  <:current>{if @liked, do: "Liked", else: "Like"}</:current>
  <:optimistic>Liked</:optimistic>
</.optimistic_toggle>`,
            })}

            {await Example({
              id: "ex-follow",
              title: "Follow toggle (outline variant)",
              description:
                "A Follow / Following toggle. The outline variant tints when pressed instead of filling. Same instant-flip-then-reconcile flow.",
              narrative: (
                <p>
                  Variants differ only in the pressed treatment:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">default</code>{" "}
                  fills with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">bg-primary</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">outline</code>{" "}
                  keeps the border and tints with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">bg-primary/10</code>,
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ghost</code>{" "}
                  uses the secondary surface. All three drive the pressed look
                  from the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed:</code>{" "}
                  variant so it tracks the real state, not a separate class.
                </p>
              ),
              references: [
                { source: "htmx", label: "hx-swap (outerHTML)", href: "https://htmx.org/attributes/hx-swap/" },
                { source: "MDN", label: "aria-pressed CSS selector", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors" },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <FollowToggle id="ex-follow-toggle" following={false} action="/docs/optimistic-toggle/follow" />
                </div>
              ),
              jsx: `<OptimisticToggle id="follow-7" variant="outline"
  pressed={following} ariaLabel="Follow"
  hx-post="/users/7/follow"
  optimistic={<><FollowIcon following /> Following</>}>
  <FollowIcon following={following} /> {following ? "Following" : "Follow"}
</OptimisticToggle>`,
              jinja: `{% call(state) optimistic_toggle(id="follow-7", variant="outline",
        pressed=following, hx_post="/users/7/follow", aria_label="Follow") %}
  {% if state == "current" %}{{ "Following" if following else "Follow" }}
  {% else %}Following{% endif %}
{% endcall %}`,
              go: `{{template "optimistic-toggle" (dict
  "ID" "follow-7" "Variant" "outline" "Pressed" .Following "AriaLabel" "Follow"
  "Current" (htmlSafe .CurrentLabel) "Optimistic" (htmlSafe "Following")
  "Attrs" (dict "hx-post" "/users/7/follow"))}}`,
              phoenix: `<.optimistic_toggle id="follow-7" variant="outline"
  pressed={@following} hx-post="/users/7/follow" aria-label="Follow">
  <:current>{if @following, do: "Following", else: "Follow"}</:current>
  <:optimistic>Following</:optimistic>
</.optimistic_toggle>`,
            })}

            {await Example({
              id: "ex-rollback",
              title: "Rollback on error",
              description:
                "This endpoint always replies 500. The button flips optimistically, then the behaviour script cancels the swap and restores the original pre-click button — no rollback code of your own.",
              narrative: (
                <p>
                  Optimistic UI is a promise to the user that you keep — or
                  walk back. The script saves the original markup before it
                  paints the template in; on a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">4xx/5xx</code>{" "}
                  it calls{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">preventDefault()</code>{" "}
                  in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx:before:swap</code>{" "}
                  (htmx v4 swaps error bodies by default) and restores the
                  original, so a failed request leaves the toggle exactly as it
                  was. Pair it with an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-live</code>{" "}
                  region if you want to announce the failure.
                </p>
              ),
              references: [
                { source: "htmx", label: "htmx:before:swap event", href: "https://htmx.org/reference/#events" },
                { source: "htmx", label: "htmx:response:error event", href: "https://htmx.org/reference/#events" },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <OptimisticToggle
                    id="ex-fail"
                    variant="ghost"
                    pressed={false}
                    ariaLabel="Like"
                    hx-post="/docs/optimistic-toggle/fail"
                    optimistic={<><HeartIcon filled /> Liked</>}
                  >
                    <HeartIcon filled={false} /> Like
                  </OptimisticToggle>
                  <p class="text-xs text-muted-foreground">
                    The flip is reverted when the 500 comes back.
                  </p>
                </div>
              ),
              jsx: `// No rollback code needed — the extension restores the original
// button on htmx:error.
<OptimisticToggle id="like-42" variant="ghost" ariaLabel="Like"
  hx-post="/posts/42/like"
  optimistic={<><HeartIcon filled /> Liked</>}>
  <HeartIcon /> Like
</OptimisticToggle>`,
              jinja: `{# Rollback is automatic on htmx:error — nothing extra to write. #}
{% call(state) optimistic_toggle(id="like-42", variant="ghost",
        hx_post="/posts/42/like", aria_label="Like") %}
  {% if state == "current" %}Like{% else %}Liked{% endif %}
{% endcall %}`,
              go: `{{/* Rollback is automatic on htmx:error. */}}
{{template "optimistic-toggle" (dict
  "ID" "like-42" "Variant" "ghost" "AriaLabel" "Like"
  "Current" (htmlSafe "Like") "Optimistic" (htmlSafe "Liked")
  "Attrs" (dict "hx-post" "/posts/42/like"))}}`,
              phoenix: `<%# Rollback is automatic on htmx:error. %>
<.optimistic_toggle id="like-42" variant="ghost"
  hx-post="/posts/42/like" aria-label="Like">
  <:current>Like</:current>
  <:optimistic>Liked</:optimistic>
</.optimistic_toggle>`,
            })}
          </section>

          <ApiTable title="Optimistic Toggle" rows={OPTIMISTIC_TOGGLE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// --- htmx demo endpoints ---------------------------------------------------
// Each returns a fresh <OptimisticToggle> in the FLIPPED state, so
// hx-swap="outerHTML" replaces the clicked control with the server's
// authoritative version.

optimisticToggleRoutes.post("/like", (c) =>
  c.html(<LikeToggle id="ex-like" liked={true} action="/docs/optimistic-toggle/unlike" />),
)

optimisticToggleRoutes.post("/unlike", (c) =>
  c.html(<LikeToggle id="ex-like" liked={false} action="/docs/optimistic-toggle/like" />),
)

optimisticToggleRoutes.post("/follow", (c) =>
  c.html(<FollowToggle id="ex-follow-toggle" following={true} action="/docs/optimistic-toggle/unfollow" />),
)

optimisticToggleRoutes.post("/unfollow", (c) =>
  c.html(<FollowToggle id="ex-follow-toggle" following={false} action="/docs/optimistic-toggle/follow" />),
)

// Always fails — demonstrates automatic rollback of the optimistic flip.
optimisticToggleRoutes.post("/fail", (c) =>
  c.text("Service unavailable", 500),
)
