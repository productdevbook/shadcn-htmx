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
import { PROGRESS_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Progress } from "@/registry/ui/progress"

export const progressRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [pgJsx, pgJinja, pgGo, pgPhoenix, pgHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/progress.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/progress.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/progress.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/progress.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/progress.html"), "utf8"),
])

const usageJsx = `import { Progress } from "@/components/ui/progress"

<Progress value={42} ariaLabel="Upload" />        // determinate
<Progress ariaLabel="Loading" />                   // indeterminate (no value)`

const usageJinja = `{% from "components/progress.html" import progress %}

{{ progress(value=42, aria_label="Upload") }}
{{ progress(aria_label="Loading") }}    {# indeterminate #}`

const usageGo = `// determinate
{{template "progress" (dict "Value" (ptr 42) "AriaLabel" "Upload")}}
// indeterminate
{{template "progress" (dict "AriaLabel" "Loading")}}`

const usagePhoenix = `<.progress value={42} aria-label="Upload" />
<.progress aria-label="Loading" />`

const usageHtml = `<div role="progressbar" aria-valuenow="42" aria-valuemin="0" aria-valuemax="100"
     class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
  <div class="h-full bg-primary" style="width: 42%"></div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-determinate", label: "Determinate", nested: true },
  { href: "#ex-indeterminate", label: "Indeterminate", nested: true },
  { href: "#ex-htmx", label: "htmx — live update", nested: true },
  { href: "#api", label: "API Reference" },
]

progressRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/progress.json`

  return page(
    c,
    <Layout title="Progress — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/progress" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Progress</h1>
            <p class="text-muted-foreground">
              An ARIA{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="progressbar"</code>{" "}
              with valuemin / valuemax / valuenow. Omit{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">value</code>{" "}
              to render the indeterminate state — perfect for "we don't
              know yet" operations.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-progress"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/progress.tsx", source: pgJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/progress.html", source: pgJinja, note: "Copy progress.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/progress.tmpl", source: pgGo, note: "Add progress.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/progress.ex", source: pgPhoenix, note: "Drop progress.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: pgHtml, note: "Tailwind utilities only; keyframes in input.css for indeterminate stripe." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-determinate",
              title: "Determinate — known percentage",
              description:
                "Pass value 0–100 (or scale via min/max). The bar fills from 0 to value width.",
              narrative: (
                <p>
                  Always pair with an accessible name (
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel</code>{" "}
                  or{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabelledby</code>
                  ). For exact units (MB, items), set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaValuetext="42 of 100 MB"</code>{" "}
                  so AT can announce a human-readable value alongside the
                  number.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "role=\"progressbar\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role",
                },
                {
                  source: "MDN",
                  label: "aria-valuetext",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuetext",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <Progress value={20} ariaLabel="Step 1 of 5" />
                  <Progress value={60} ariaLabel="Upload" ariaValuetext="60 of 100 MB" />
                  <Progress value={95} ariaLabel="Almost done" />
                </div>
              ),
              jsx: `<Progress value={20} ariaLabel="Step 1 of 5" />
<Progress value={60} ariaLabel="Upload"
          ariaValuetext="60 of 100 MB" />`,
              jinja: `{{ progress(value=20, aria_label="Step 1 of 5") }}
{{ progress(value=60, aria_label="Upload",
            aria_valuetext="60 of 100 MB") }}`,
              go: `{{template "progress" (dict "Value" (ptr 20) "AriaLabel" "Step 1 of 5")}}
{{template "progress" (dict "Value" (ptr 60) "AriaLabel" "Upload")}}`,
              phoenix: `<.progress value={20} aria-label="Step 1 of 5" />
<.progress value={60} aria-label="Upload" />`,
            })}

            {await Example({
              id: "ex-indeterminate",
              title: "Indeterminate — unknown duration",
              description:
                "Omit value. A stripe animates across the bar while the task is in flight.",
              narrative: (
                <p>
                  Use when you can't compute a percentage — long server
                  requests, "still thinking" states. Per ARIA spec, omitting{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-valuenow</code>{" "}
                  signals "indeterminate"; AT announces it as such. Switch
                  to determinate as soon as you have a real value.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Indeterminate state",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role#indeterminate_state",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <Progress ariaLabel="Loading…" />
                </div>
              ),
              jsx: `<Progress ariaLabel="Loading…" />`,
              jinja: `{{ progress(aria_label="Loading…") }}`,
              go: `{{template "progress" (dict "AriaLabel" "Loading…")}}`,
              phoenix: `<.progress aria-label="Loading…" />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — server-driven progress",
              description:
                "Poll the server every 800ms; the response is a fresh Progress fragment with the latest value. Stop when value=100.",
              narrative: (
                <p>
                  Pair{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="every 800ms"</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="outerHTML"</code>{" "}
                  to refresh the whole progress bar each tick. When the
                  server returns a fragment without{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>
                  , the polling stops automatically — a tidy way to end
                  the cycle when value reaches 100.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (every Xms)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <div
                    hx-get="/progress/tick?value=0"
                    hx-trigger="load"
                    hx-swap="outerHTML"
                  >
                    <Progress value={0} ariaLabel="Mock upload — click reload to restart" />
                  </div>
                </div>
              ),
              jsx: `<div hx-get="/api/progress?value=0" hx-trigger="load" hx-swap="outerHTML">
  <Progress value={0} ariaLabel="Upload" />
</div>

// Server returns a refreshed fragment, e.g.:
<Progress value={42} ariaLabel="Upload"
  hx-get="/api/progress?value=42"
  hx-trigger="every 800ms"
  hx-swap="outerHTML" />`,
              jinja: `<div hx-get="/api/progress?value=0" hx-trigger="load" hx-swap="outerHTML">
  {{ progress(value=0, aria_label="Upload") }}
</div>`,
              go: `<div hx-get="/api/progress?value=0" hx-trigger="load" hx-swap="outerHTML">
  {{template "progress" (dict "Value" (ptr 0) "AriaLabel" "Upload")}}
</div>`,
              phoenix: `<div hx-get={~p"/api/progress?value=0"} hx-trigger="load" hx-swap="outerHTML">
  <.progress value={0} aria-label="Upload" />
</div>`,
            })}
          </section>
          <ApiTable
            title="<Progress>"
            rows={PROGRESS_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx polling endpoint — returns the next tick of a mock upload.
progressRoutes.get("/tick", (c) => {
  const value = Math.min(100, Number(c.req.query("value") ?? 0))
  const next = Math.min(100, value + 8)
  const stillRunning = next < 100
  return c.html(
    <div
      {...(stillRunning
        ? {
            "hx-get": `/progress/tick?value=${next}`,
            "hx-trigger": "every 800ms",
            "hx-swap": "outerHTML",
          }
        : {})}
    >
      <Progress
        value={next}
        ariaLabel="Mock upload"
        ariaValuetext={`${next} of 100 MB`}
      />
    </div>,
  )
})
