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
import { AUTO_GRID_PROPS } from "@/app/data/api-rows"
import { AutoGrid } from "@/registry/ui/auto-grid"

export const autoGridRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/auto-grid.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/auto-grid.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/auto-grid.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/auto_grid.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/auto-grid.html"), "utf8"),
])

const usageJsx = `import { AutoGrid } from "@/components/ui/auto-grid"

// Card grid — as many 16rem columns as fit, no breakpoints.
<AutoGrid>
  <div>…</div>
  <div>…</div>
</AutoGrid>

// Wider items, larger gap, semantic list.
<AutoGrid as="ul" min="20rem" gap={6}>
  <li>…</li>
</AutoGrid>

// Keep empty trailing tracks (auto-fill) instead of stretching.
<AutoGrid fill min="12rem">
  <div>…</div>
</AutoGrid>`

const usageJinja = `{% from "components/auto-grid.html" import auto_grid %}

{% call auto_grid() %}
  <div>…</div>
{% endcall %}

{% call auto_grid(min="20rem", gap="gap-6", tag="ul") %}
  <li>…</li>
{% endcall %}`

const usageGo = `{{template "auto-grid" (dict "Body" (htmlSafe $cards))}}
{{template "auto-grid" (dict "Min" "20rem" "Gap" "gap-6" "Tag" "ul" "Body" (htmlSafe $items))}}
{{template "auto-grid" (dict "Fill" true "Min" "12rem" "Body" (htmlSafe $cells))}}`

const usagePhoenix = `<.auto_grid>
  <div :for={item <- @items}>…</div>
</.auto_grid>

<.auto_grid min="20rem" gap="gap-6" tag="ul">
  <li :for={item <- @items}>…</li>
</.auto_grid>

<.auto_grid fill min="12rem">
  <div :for={item <- @items}>…</div>
</.auto_grid>`

const usageHtml = `<div data-slot="auto-grid"
     style="--auto-grid-min:16rem"
     class="grid [grid-template-columns:repeat(auto-fit,minmax(min(var(--auto-grid-min,16rem),100%),1fr))] gap-4">
  <div>…</div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Card grid", nested: true },
  { href: "#ex-fill", label: "auto-fill vs auto-fit", nested: true },
  { href: "#ex-density", label: "Density (min width)", nested: true },
  { href: "#api", label: "API Reference" },
]

const CELL =
  "flex min-h-20 items-center justify-center rounded-lg border bg-card p-4 text-sm font-medium text-card-foreground"

autoGridRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/auto-grid.json`

  return page(
    c,
    <Layout title="Auto Grid — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/auto-grid" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Auto Grid</h1>
            <p class="text-muted-foreground">
              A responsive, intrinsically-wrapping grid of equal cells with{" "}
              <strong>no breakpoints</strong>. Children flow into as many
              columns as fit at a configurable minimum item width, then grow to
              share the leftover space — the card-grid recipe, built on CSS
              Grid's{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                repeat(auto-fit, minmax())
              </code>{" "}
              (the "RAM" pattern). Pure CSS, zero JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-auto-grid"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/auto-grid.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/auto-grid.html", source: jinjaSource, note: "Copy auto-grid.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/auto-grid.tmpl", source: goSource, note: "Add auto-grid.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/auto_grid.ex", source: phoenixSource, note: "Drop auto_grid.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/auto-grid.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Card grid — no media queries",
              description:
                "Children flow into as many columns as fit at the min item width, then stretch to fill the row. Resize the window and watch the column count change with zero breakpoints.",
              narrative: (
                <p>
                  The whole layout is one line of CSS:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))
                  </code>
                  . web.dev calls this the RAM pattern — <em>Repeat</em>,{" "}
                  <em>Auto-fit</em>, <em>Minmax</em>. Each track is at least
                  16rem and at most 1fr, so on a narrow screen items take the
                  full width and as the container grows they snap onto the same
                  row. We wrap the lower bound in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    min(16rem, 100%)
                  </code>{" "}
                  so a single item can never overflow a container narrower than
                  the minimum.
                </p>
              ),
              references: [
                { source: "Tailwind", label: "RAM pattern (repeat / auto-minmax)", href: "https://web.dev/patterns/layout/repeat-auto-minmax/" },
                { source: "MDN", label: "minmax()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/minmax" },
              ],
              preview: (
                <AutoGrid class="w-full" data-test="basic">
                  <div class={CELL}>One</div>
                  <div class={CELL}>Two</div>
                  <div class={CELL}>Three</div>
                  <div class={CELL}>Four</div>
                  <div class={CELL}>Five</div>
                  <div class={CELL}>Six</div>
                </AutoGrid>
              ),
              jsx: `<AutoGrid>
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
  <div>Five</div>
  <div>Six</div>
</AutoGrid>`,
              jinja: `{% call auto_grid() %}
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
{% endcall %}`,
              go: `{{template "auto-grid" (dict "Body" (htmlSafe $cards))}}`,
              phoenix: `<.auto_grid>
  <div :for={item <- @items}>{item}</div>
</.auto_grid>`,
            })}

            {await Example({
              id: "ex-fill",
              title: "auto-fill vs auto-fit",
              description:
                "With only two items: auto-fit (default) collapses empty tracks so the two cells stretch across the row; auto-fill keeps the empty tracks so the cells stay at their minimum width, aligned to the column rhythm.",
              narrative: (
                <p>
                  The only difference is what happens to <em>empty</em> tracks.
                  Per the web.dev "Learn CSS — Grid" course:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">auto-fit</code>{" "}
                  collapses unused tracks to 0 so the filled tracks grow to
                  consume the space;{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">auto-fill</code>{" "}
                  leaves the empty tracks at their reserved width. Reach for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">fill</code>{" "}
                  when a half-empty last row should keep the same item size as
                  the full rows above it.
                </p>
              ),
              references: [
                { source: "Tailwind", label: "auto-fill and auto-fit (Learn CSS)", href: "https://web.dev/learn/css/grid/" },
              ],
              preview: (
                <div class="w-full space-y-4">
                  <div class="space-y-1.5">
                    <p class="text-xs font-medium text-muted-foreground">auto-fit (default) — items stretch</p>
                    <AutoGrid min="10rem" data-test="fit">
                      <div class={CELL}>A</div>
                      <div class={CELL}>B</div>
                    </AutoGrid>
                  </div>
                  <div class="space-y-1.5">
                    <p class="text-xs font-medium text-muted-foreground">auto-fill — empty tracks kept</p>
                    <AutoGrid fill min="10rem" data-test="fill">
                      <div class={CELL}>A</div>
                      <div class={CELL}>B</div>
                    </AutoGrid>
                  </div>
                </div>
              ),
              jsx: `// auto-fit (default): the two items stretch to fill the row
<AutoGrid min="10rem">
  <div>A</div>
  <div>B</div>
</AutoGrid>

// auto-fill: empty tracks are reserved, items stay at min width
<AutoGrid fill min="10rem">
  <div>A</div>
  <div>B</div>
</AutoGrid>`,
              jinja: `{% call auto_grid(min="10rem") %}…{% endcall %}
{% call auto_grid(min="10rem", fill=true) %}…{% endcall %}`,
              go: `{{template "auto-grid" (dict "Min" "10rem" "Body" (htmlSafe $b))}}
{{template "auto-grid" (dict "Min" "10rem" "Fill" true "Body" (htmlSafe $b))}}`,
              phoenix: `<.auto_grid min="10rem">…</.auto_grid>
<.auto_grid min="10rem" fill>…</.auto_grid>`,
            })}

            {await Example({
              id: "ex-density",
              title: "Density — the min width drives the column count",
              description:
                "A smaller min item width packs more columns into the same container; a larger one yields fewer, wider columns. Set it with the min prop (any CSS length).",
              narrative: (
                <p>
                  There are no per-breakpoint column counts to maintain — you
                  describe the <em>smallest acceptable item</em> and the browser
                  derives the columns. Use a list element (
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">as="ul"</code>
                  ) when the cells are a genuine list so assistive tech
                  announces the count.
                </p>
              ),
              references: [
                { source: "MDN", label: "grid-template-columns", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns" },
              ],
              preview: (
                <AutoGrid as="ul" min="7rem" gap={3} class="w-full" data-test="density" aria-label="Swatches">
                  <li class={CELL}>1</li>
                  <li class={CELL}>2</li>
                  <li class={CELL}>3</li>
                  <li class={CELL}>4</li>
                  <li class={CELL}>5</li>
                  <li class={CELL}>6</li>
                  <li class={CELL}>7</li>
                  <li class={CELL}>8</li>
                </AutoGrid>
              ),
              jsx: `<AutoGrid as="ul" min="7rem" gap={3} aria-label="Swatches">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  {/* … */}
</AutoGrid>`,
              jinja: `{% call auto_grid(min="7rem", gap="gap-3", tag="ul", aria_label="Swatches") %}
  <li>1</li>
{% endcall %}`,
              go: `{{template "auto-grid" (dict "Min" "7rem" "Gap" "gap-3" "Tag" "ul" "AriaLabel" "Swatches" "Body" (htmlSafe $items))}}`,
              phoenix: `<.auto_grid tag="ul" min="7rem" gap="gap-3" aria-label="Swatches">
  <li :for={n <- 1..8}>{n}</li>
</.auto_grid>`,
            })}
          </section>

          <ApiTable title="<AutoGrid>" rows={AUTO_GRID_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
