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
import { STATUS_PROPS } from "@/app/data/api-rows"
import { Status, StatusItem } from "@/registry/ui/status"
import { Button } from "@/registry/ui/button"

export const statusRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/status.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/status.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/status.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/status.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/status.html"), "utf8"),
  ])

const usageJsx = `import { Status, StatusItem } from "@/components/ui/status"

{/* Single advisory message — render once, swap text in */}
<Status ariaLabel="Save status">Saved</Status>

{/* Append-only ordered sequence */}
<Status as="log" ariaLabel="Activity">
  <StatusItem>Connected</StatusItem>
  <StatusItem>Synced 3 files</StatusItem>
</Status>`

const usageJinja = `{% from "components/status.html" import status, status_item %}

{% call status(aria_label="Save status") %}Saved{% endcall %}

{% call status(as="log", aria_label="Activity") %}
  {{ status_item("Connected") }}
  {{ status_item("Synced 3 files") }}
{% endcall %}`

const usageGo = `{{template "status" (dict "AriaLabel" "Save status" "Body" (htmlSafe "Saved"))}}

{{template "status" (dict "As" "log" "AriaLabel" "Activity" "Body" (htmlSafe "
  ...status_item rows..."))}}`

const usagePhoenix = `<.status aria_label="Save status">Saved</.status>

<.status as="log" aria_label="Activity">
  <.status_item>Connected</.status_item>
  <.status_item>Synced 3 files</.status_item>
</.status>`

const usageHtml = `<div data-slot="status" data-role="status"
     role="status" aria-live="polite" aria-atomic="true"
     aria-label="Save status"
     class="block min-h-5 text-sm text-muted-foreground">
  Saved
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Save status", nested: true },
  { href: "#ex-log", label: "Activity log", nested: true },
  { href: "#ex-htmx", label: "htmx live count", nested: true },
  { href: "#api", label: "API Reference" },
]

statusRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/status.json`

  return page(
    c,
    <Layout title="Status — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/status" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Status</h1>
            <p class="text-muted-foreground">
              A persistent <em>polite</em> live region for non-urgent
              updates — <code class="rounded bg-muted px-1 py-0.5 text-sm">Saved</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">3 results</code>,
              autosave timestamps. Render it once and swap text in; assistive
              tech announces the change when the user is idle, without
              interrupting them. The non-interruptive counterpart to{" "}
              <a class="underline underline-offset-4" href="/docs/alert">Alert</a>{" "}
              and <a class="underline underline-offset-4" href="/docs/toast">Toast</a>.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-status"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/status.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/status.html", source: jinjaSource, note: "Copy status.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/status.tmpl", source: goSource, note: "Add status.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/status.ex", source: phoenixSource, note: "Drop status.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/status.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Save status — single advisory message",
              description:
                "role=status is implicitly aria-live=polite + aria-atomic=true. Render it once; replace its text to announce.",
              narrative: (
                <p>
                  Per MDN, an element with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="status"</code>{" "}
                  has an implicit{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-live="polite"</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-atomic="true"</code>,
                  so the whole region is re-read when its content changes.
                  Do <strong>not</strong> move focus to it — that would
                  interrupt the user, which is exactly what status is meant to
                  avoid. Give it an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>{" "}
                  so AT can announce "Save status: Saved".
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "ARIA: status role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role",
                },
                {
                  source: "APG",
                  label: "Structural Roles practice",
                  href: "https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/",
                },
              ],
              preview: (
                <Status ariaLabel="Save status" tone="success">
                  Saved just now
                </Status>
              ),
              jsx: `<Status ariaLabel="Save status" tone="success">
  Saved just now
</Status>`,
              jinja: `{% call status(aria_label="Save status", tone="success") %}Saved just now{% endcall %}`,
              go: `{{template "status" (dict "AriaLabel" "Save status" "Tone" "success" "Body" (htmlSafe "Saved just now"))}}`,
              phoenix: `<.status aria_label="Save status" tone="success">Saved just now</.status>`,
            })}

            {await Example({
              id: "ex-log",
              title: "Activity log — append-only ordered sequence",
              description:
                "as=\"log\" is aria-live=polite + aria-atomic=false, so only the newly-appended entry is announced — not the whole list.",
              narrative: (
                <p>
                  MDN's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="log"</code>{" "}
                  is for content "added in a meaningful order" where "old
                  information may disappear" — chat history, sync activity, an
                  event feed. Its implicit{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-atomic="false"</code>{" "}
                  means each appended{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">StatusItem</code>{" "}
                  is announced on its own. A{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">log</code>{" "}
                  is <em>required</em> to have an accessible name, hence the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "ARIA: log role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role",
                },
                {
                  source: "MDN",
                  label: "aria-atomic",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-atomic",
                },
              ],
              preview: (
                <Status as="log" ariaLabel="Sync activity" tone="muted" class="space-y-0.5">
                  <StatusItem>Connected to server</StatusItem>
                  <StatusItem>Uploaded report.pdf</StatusItem>
                  <StatusItem>Synced 3 files</StatusItem>
                </Status>
              ),
              jsx: `<Status as="log" ariaLabel="Sync activity">
  <StatusItem>Connected to server</StatusItem>
  <StatusItem>Uploaded report.pdf</StatusItem>
  <StatusItem>Synced 3 files</StatusItem>
</Status>`,
              jinja: `{% call status(as="log", aria_label="Sync activity") %}
  {{ status_item("Connected to server") }}
  {{ status_item("Uploaded report.pdf") }}
  {{ status_item("Synced 3 files") }}
{% endcall %}`,
              go: `{{template "status" (dict "As" "log" "AriaLabel" "Sync activity" "Body" (htmlSafe "
  ...status_item rows..."))}}`,
              phoenix: `<.status as="log" aria_label="Sync activity">
  <.status_item>Connected to server</.status_item>
  <.status_item>Uploaded report.pdf</.status_item>
  <.status_item>Synced 3 files</.status_item>
</.status>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx live count — swap text into the region",
              description:
                "The status region is on the page from first paint. htmx swaps fresh text into it on each click; AT announces the new count politely.",
              narrative: (
                <p>
                  This is the canonical htmx pattern: the live region exists
                  before the request, and you target it with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="innerHTML"</code>.
                  Swapping into a persistent region (rather than swapping the
                  region itself) keeps the live-region semantics intact so the
                  change is actually announced.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-swap",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
                {
                  source: "MDN",
                  label: "ARIA live regions",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
                },
              ],
              preview: (
                <div class="flex w-full max-w-md flex-col items-start gap-3">
                  <Button
                    type="button"
                    hx-post="/docs/status/announce"
                    hx-target="#ex-status-live"
                    hx-swap="innerHTML"
                  >
                    Add result
                  </Button>
                  <Status id="ex-status-live" ariaLabel="Results" tone="default">
                    0 results
                  </Status>
                </div>
              ),
              jsx: `<button
  hx-post="/api/results"
  hx-target="#live"
  hx-swap="innerHTML"
>Add result</button>

<Status id="live" ariaLabel="Results">0 results</Status>`,
              jinja: `<button hx-post="/api/results" hx-target="#live" hx-swap="innerHTML">Add result</button>

{% call status(id="live", aria_label="Results") %}0 results{% endcall %}`,
              go: `<button hx-post="/api/results" hx-target="#live" hx-swap="innerHTML">Add result</button>

{{template "status" (dict "ID" "live" "AriaLabel" "Results" "Body" (htmlSafe "0 results"))}}`,
              phoenix: `<button hx-post={~p"/api/results"} hx-target="#live" hx-swap="innerHTML">Add result</button>

<.status id="live" aria_label="Results">0 results</.status>`,
            })}
          </section>

          <ApiTable title="<Status>" rows={STATUS_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx demo endpoint for #ex-htmx. Mounted under /docs/status, so the full
// path matching the markup's hx-post is /docs/status/announce. Returns plain
// text that htmx swaps into the persistent live region (innerHTML).
let liveCount = 0
statusRoutes.post("/announce", (c) => {
  liveCount += 1
  return c.text(`${liveCount} result${liveCount === 1 ? "" : "s"}`)
})
