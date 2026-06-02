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
import { RATING_PROPS } from "@/app/data/api-rows"
import { Rating } from "@/registry/ui/rating"

export const ratingRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/rating.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/rating.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/rating.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/rating.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/rating.html"), "utf8"),
])

const usageJsx = `import { Rating } from "@/components/ui/rating"

<form method="post" action="/review">
  <Rating name="score" value={3} required />
  <button type="submit">Submit review</button>
</form>`

const usageJinja = `{% from "components/rating.html" import rating %}

<form method="post" action="/review">
  {{ rating(name="score", value=3, required=true) }}
  <button type="submit">Submit review</button>
</form>`

const usageGo = `{{/* Stars must be passed in reverse (max..1) — plain
  text/template has no numeric range. */}}
<form method="post" action="/review">
  {{template "rating" (dict "Name" "score" "Max" 5 "Stars" .Stars "Value" 3 "Required" true)}}
  <button type="submit">Submit review</button>
</form>`

const usagePhoenix = `<form method="post" action="/review">
  <.rating name="score" value={3} required />
  <button type="submit">Submit review</button>
</form>`

const usageHtml = `<form method="post" action="/review">
  <!-- paste snippets/rating.html here -->
  <button type="submit">Submit review</button>
</form>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-states", label: "Preset, sizes, disabled", nested: true },
  { href: "#ex-htmx", label: "htmx — save on change", nested: true },
  { href: "#api", label: "API Reference" },
]

ratingRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/rating.json`

  return page(
    c,
    <Layout title="Rating — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/rating" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Rating</h1>
            <p class="text-muted-foreground">
              A star rating built as a single-select radio group. One native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="radio"&gt;</code>{" "}
              per star, all sharing a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">name</code> — the
              browser gives you arrow-key navigation, per-star labels, and a real
              submittable value. The fill and hover preview are pure CSS; zero
              JavaScript, works without it.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-rating"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/rating.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/rating.html", source: jinjaSource, note: "Copy rating.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/rating.tmpl", source: goSource, note: "Add rating.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/rating.ex", source: phoenixSource, note: "Drop rating.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/rating.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — click, hover preview, arrow keys",
              description:
                "Hover the stars to preview; click to pick. Tab into the group and press ←/→/↑/↓ to move and select. Nothing is selected until the user chooses.",
              narrative: (
                <p>
                  APG's radio-group rating example puts{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="radio"</code>{" "}
                  on SVG groups and drives everything with JavaScript. We do the
                  opposite: each star is a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input type="radio"&gt;</code>{" "}
                  sharing a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>, so
                  the browser handles arrow keys and one-at-a-time for free. The
                  cumulative fill and hover preview come from rendering the stars
                  in reverse DOM order and using sibling combinators — no script.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Radio rating example",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/",
                },
                {
                  source: "MDN",
                  label: "<input type=\"radio\">",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio",
                },
              ],
              preview: <Rating name="ex-basic-score" ariaLabel="Rate this article" />,
              jsx: `<Rating name="score" ariaLabel="Rate this article" />`,
              jinja: `{{ rating(name="score", aria_label="Rate this article") }}`,
              go: `{{template "rating" (dict "Name" "score" "Max" 5 "Stars" .Stars "AriaLabel" "Rate this article")}}`,
              phoenix: `<.rating name="score" aria-label="Rate this article" />`,
            })}

            {await Example({
              id: "ex-states",
              title: "Preset value, sizes, disabled",
              description:
                "Pre-select a value, scale the stars with size, or lock the control. A disabled rating stays readable but is skipped from the tab order.",
              narrative: (
                <p>
                  Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">value</code> to
                  render the matching radio{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">checked</code>{" "}
                  (great for "your rating" or read-back states). The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">size</code> prop
                  swaps the star dimensions, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  sets the HTML attribute on every radio so the whole group is
                  inert and unsubmitted.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "input disabled",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled",
                },
              ],
              preview: (
                <div class="flex flex-col gap-4">
                  <Rating name="ex-states-sm" size="sm" value={2} ariaLabel="Small, 2 stars" />
                  <Rating name="ex-states-md" value={3} ariaLabel="Default, 3 stars" />
                  <Rating name="ex-states-lg" size="lg" value={5} ariaLabel="Large, 5 stars" />
                  <Rating name="ex-states-off" value={4} disabled ariaLabel="Disabled, 4 stars" />
                </div>
              ),
              jsx: `<Rating name="score" size="sm" value={2} />
<Rating name="score" value={3} />
<Rating name="score" size="lg" value={5} />
<Rating name="score" value={4} disabled />`,
              jinja: `{{ rating(name="score", size="sm", value=2) }}
{{ rating(name="score", value=3) }}
{{ rating(name="score", size="lg", value=5) }}
{{ rating(name="score", value=4, disabled=true) }}`,
              go: `{{template "rating" (dict "Name" "score" "Stars" .Stars "SizeClass" "size-4" "Value" 2)}}
{{template "rating" (dict "Name" "score" "Stars" .Stars "Value" 3)}}
{{template "rating" (dict "Name" "score" "Stars" .Stars "SizeClass" "size-7" "GapClass" "gap-1" "Value" 5)}}
{{template "rating" (dict "Name" "score" "Stars" .Stars "Value" 4 "Disabled" true)}}`,
              phoenix: `<.rating name="score" size="sm" value={2} />
<.rating name="score" value={3} />
<.rating name="score" size="lg" value={5} />
<.rating name="score" value={4} disabled />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — save on change",
              description:
                "Wrap the rating in a form and POST on every change. The server records the score and swaps a confirmation in lockstep.",
              narrative: (
                <p>
                  For "rate and we'll remember it" flows, persist the pick the
                  moment it's made.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="change"</code>{" "}
                  on the wrapping{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>{" "}
                  fires whenever a star radio is selected and submits the form
                  payload (the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">score</code>{" "}
                  field) to the endpoint, which returns the new status row.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (change)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <form
                  hx-post="/docs/rating/save"
                  hx-trigger="change"
                  hx-target="#ex-rating-status"
                  hx-swap="innerHTML"
                  class="flex flex-col gap-3"
                >
                  <Rating name="score" ariaLabel="Rate your experience" />
                  <p
                    id="ex-rating-status"
                    class="text-xs text-muted-foreground"
                    aria-live="polite"
                  >
                    Pick a rating to save it.
                  </p>
                </form>
              ),
              jsx: `<form hx-post="/api/rate" hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  <Rating name="score" ariaLabel="Rate your experience" />
  <p id="status" aria-live="polite" />
</form>`,
              jinja: `<form hx-post="/api/rate" hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  {{ rating(name="score", aria_label="Rate your experience") }}
  <p id="status" aria-live="polite"></p>
</form>`,
              go: `<form hx-post="/api/rate" hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  {{template "rating" (dict "Name" "score" "Stars" .Stars "AriaLabel" "Rate your experience")}}
  <p id="status" aria-live="polite"></p>
</form>`,
              phoenix: `<form hx-post={~p"/api/rate"} hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  <.rating name="score" aria-label="Rate your experience" />
  <p id="status" aria-live="polite"></p>
</form>`,
            })}
          </section>

          <ApiTable title="<Rating>" rows={RATING_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

ratingRoutes.post("/save", async (c) => {
  const body = await c.req.parseBody()
  const score = Number(body.score ?? 0)
  if (!score) {
    return c.html(<>Pick a rating to save it.</>)
  }
  return c.html(
    <>
      Saved <strong>{score} / 5</strong> at {new Date().toLocaleTimeString()}.
    </>,
  )
})
