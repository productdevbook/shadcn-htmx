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
import { SEGMENTED_CONTROL_PROPS } from "@/app/data/api-rows"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"

export const segmentedControlRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/segmented-control.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/segmented-control.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/segmented-control.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/segmented_control.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/segmented-control.html"), "utf8"),
  ])

const usageJsx = `import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"

<SegmentedControl name="view" ariaLabel="View" defaultValue="list">
  <SegmentedControlItem value="list" name="view" id="view-list" checked>List</SegmentedControlItem>
  <SegmentedControlItem value="grid" name="view" id="view-grid">Grid</SegmentedControlItem>
</SegmentedControl>`

const usageJinja = `{% from "components/segmented-control.html" import segmented_control_open, segmented_control_close, segmented_control_item %}

{{ segmented_control_open(name="view", aria_label="View", default_value="list") }}
  {{ segmented_control_item("List", value="list", name="view", id="view-list", checked=true) }}
  {{ segmented_control_item("Grid", value="grid", name="view", id="view-grid") }}
{{ segmented_control_close() }}`

const usageGo = `{{template "segmented_control" (dict
  "Name" "view" "AriaLabel" "View" "DefaultValue" "list"
  "Body" (htmlSafe \`
    {{template "segmented_control_item" (dict "Text" "List" "Value" "list" "Name" "view" "ID" "view-list" "Checked" true)}}
    {{template "segmented_control_item" (dict "Text" "Grid" "Value" "grid" "Name" "view" "ID" "view-grid")}}\`)
)}}`

const usagePhoenix = `<.segmented_control name="view" aria-label="View" default_value="list">
  <.segmented_control_item value="list" name="view" id="view-list" checked>List</.segmented_control_item>
  <.segmented_control_item value="grid" name="view" id="view-grid">Grid</.segmented_control_item>
</.segmented_control>`

const usageHtml = `<fieldset data-slot="segmented-control" data-name="view" aria-label="View"
  class="group/segmented inline-flex h-9 w-fit items-center gap-1 rounded-lg bg-muted p-[3px] …">
  <legend class="sr-only">View</legend>
  <label data-slot="segmented-control-item"
    class="… has-[:checked]:bg-background has-[:checked]:text-foreground has-[:checked]:shadow-sm">
    <input type="radio" class="peer sr-only" name="view" value="list" checked>
    <span>List</span>
  </label>
  <!-- one <label> per segment -->
</fieldset>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-size", label: "Small + disabled", nested: true },
  { href: "#ex-htmx", label: "htmx — switch view", nested: true },
  { href: "#api", label: "API Reference" },
]

segmentedControlRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/segmented-control.json`

  return page(
    c,
    <Layout title="Segmented Control — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/segmented-control" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Segmented Control</h1>
            <p class="text-muted-foreground">
              A compact, horizontally-joined set of mutually exclusive options
              — List / Grid, Day / Week / Month. It is a native radio group in
              disguise: a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;fieldset&gt;</code>{" "}
              wraps{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="radio"&gt;</code>{" "}
              options that share a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">name</code>, so
              arrow-key navigation and one-selected-at-a-time come for free. It
              selects a <em>value</em>, not a panel — that is what separates it
              from tabs.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-segmented-control"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/segmented-control.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/segmented-control.html", source: jinjaSource, note: "Copy segmented-control.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/segmented-control.tmpl", source: goSource, note: "Add segmented-control.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/segmented_control.ex", source: phoenixSource, note: "Drop segmented_control.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/segmented-control.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — pick a view",
              description:
                "Tab into the control (focus lands on the checked segment), then press ←/→ to move + select. The browser groups the radios by their shared name.",
              narrative: (
                <p>
                  This is a native radio group styled as a joined bar. The
                  visible pill is the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;label&gt;</code>;
                  the radio inside it is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">sr-only</code>{" "}
                  and drives the active look via the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">has-[:checked]</code>{" "}
                  variant. Because the radios share a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>,
                  the platform supplies roving focus, arrow-key selection, and
                  the one-at-a-time invariant. No JavaScript.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: '<input type="radio">',
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio",
                },
                {
                  source: "APG",
                  label: "Radio group pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
                },
              ],
              preview: (
                <SegmentedControl name="ex-sc-view" ariaLabel="View" defaultValue="list">
                  <SegmentedControlItem value="list" name="ex-sc-view" id="ex-sc-list" checked>
                    List
                  </SegmentedControlItem>
                  <SegmentedControlItem value="grid" name="ex-sc-view" id="ex-sc-grid">
                    Grid
                  </SegmentedControlItem>
                  <SegmentedControlItem value="board" name="ex-sc-view" id="ex-sc-board">
                    Board
                  </SegmentedControlItem>
                </SegmentedControl>
              ),
              jsx: `<SegmentedControl name="view" ariaLabel="View" defaultValue="list">
  <SegmentedControlItem value="list" name="view" id="list" checked>List</SegmentedControlItem>
  <SegmentedControlItem value="grid" name="view" id="grid">Grid</SegmentedControlItem>
  <SegmentedControlItem value="board" name="view" id="board">Board</SegmentedControlItem>
</SegmentedControl>`,
              jinja: `{{ segmented_control_open(name="view", aria_label="View", default_value="list") }}
  {{ segmented_control_item("List",  value="list",  name="view", id="list", checked=true) }}
  {{ segmented_control_item("Grid",  value="grid",  name="view", id="grid") }}
  {{ segmented_control_item("Board", value="board", name="view", id="board") }}
{{ segmented_control_close() }}`,
              go: `{{template "segmented_control" (dict "Name" "view" "AriaLabel" "View" "DefaultValue" "list"
  "Body" (htmlSafe \`
    {{template "segmented_control_item" (dict "Text" "List"  "Value" "list"  "Name" "view" "ID" "list" "Checked" true)}}
    {{template "segmented_control_item" (dict "Text" "Grid"  "Value" "grid"  "Name" "view" "ID" "grid")}}
    {{template "segmented_control_item" (dict "Text" "Board" "Value" "board" "Name" "view" "ID" "board")}}\`))}}`,
              phoenix: `<.segmented_control name="view" aria-label="View" default_value="list">
  <.segmented_control_item value="list" name="view" id="list" checked>List</.segmented_control_item>
  <.segmented_control_item value="grid" name="view" id="grid">Grid</.segmented_control_item>
  <.segmented_control_item value="board" name="view" id="board">Board</.segmented_control_item>
</.segmented_control>`,
            })}

            {await Example({
              id: "ex-size",
              title: "Small size + disabled option",
              description:
                "Use size=\"sm\" for toolbars. Disable a single segment with the disabled attribute — arrow keys skip over it automatically.",
              narrative: (
                <p>
                  A disabled segment carries the native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  attribute on its radio, so the browser removes it from the
                  group's roving sequence — pressing the arrow keys jumps past
                  it. To disable the whole control, set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  on the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;SegmentedControl&gt;</code>{" "}
                  — it renders a disabled{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;fieldset&gt;</code>,
                  which natively disables every control inside it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<fieldset disabled>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset#disabled",
                },
              ],
              preview: (
                <SegmentedControl name="ex-sc-range" ariaLabel="Date range" size="sm" defaultValue="week">
                  <SegmentedControlItem value="day" name="ex-sc-range" id="ex-sc-day">
                    Day
                  </SegmentedControlItem>
                  <SegmentedControlItem value="week" name="ex-sc-range" id="ex-sc-week" checked>
                    Week
                  </SegmentedControlItem>
                  <SegmentedControlItem value="month" name="ex-sc-range" id="ex-sc-month">
                    Month
                  </SegmentedControlItem>
                  <SegmentedControlItem value="year" name="ex-sc-range" id="ex-sc-year" disabled>
                    Year
                  </SegmentedControlItem>
                </SegmentedControl>
              ),
              jsx: `<SegmentedControl name="range" ariaLabel="Date range" size="sm" defaultValue="week">
  <SegmentedControlItem value="day"   name="range" id="day">Day</SegmentedControlItem>
  <SegmentedControlItem value="week"  name="range" id="week" checked>Week</SegmentedControlItem>
  <SegmentedControlItem value="month" name="range" id="month">Month</SegmentedControlItem>
  <SegmentedControlItem value="year"  name="range" id="year" disabled>Year</SegmentedControlItem>
</SegmentedControl>`,
              jinja: `{{ segmented_control_open(name="range", aria_label="Date range", size="sm", default_value="week") }}
  {{ segmented_control_item("Day",   value="day",   name="range", id="day") }}
  {{ segmented_control_item("Week",  value="week",  name="range", id="week", checked=true) }}
  {{ segmented_control_item("Month", value="month", name="range", id="month") }}
  {{ segmented_control_item("Year",  value="year",  name="range", id="year", disabled=true) }}
{{ segmented_control_close() }}`,
              go: `{{template "segmented_control" (dict "Name" "range" "AriaLabel" "Date range" "Size" "sm" "DefaultValue" "week"
  "Body" (htmlSafe \`
    {{template "segmented_control_item" (dict "Text" "Day"   "Value" "day"   "Name" "range" "ID" "day")}}
    {{template "segmented_control_item" (dict "Text" "Week"  "Value" "week"  "Name" "range" "ID" "week" "Checked" true)}}
    {{template "segmented_control_item" (dict "Text" "Month" "Value" "month" "Name" "range" "ID" "month")}}
    {{template "segmented_control_item" (dict "Text" "Year"  "Value" "year"  "Name" "range" "ID" "year" "Disabled" true)}}\`))}}`,
              phoenix: `<.segmented_control name="range" aria-label="Date range" size="sm" default_value="week">
  <.segmented_control_item value="day" name="range" id="day">Day</.segmented_control_item>
  <.segmented_control_item value="week" name="range" id="week" checked>Week</.segmented_control_item>
  <.segmented_control_item value="month" name="range" id="month">Month</.segmented_control_item>
  <.segmented_control_item value="year" name="range" id="year" disabled>Year</.segmented_control_item>
</.segmented_control>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — switch view server-side",
              description:
                "Wrap the control in a form. change is the default htmx trigger for inputs, so every pick posts the new value and swaps the rendered view in.",
              narrative: (
                <p>
                  Segmented controls shine for view switchers. Put the control
                  in a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-post</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="change"</code>{" "}
                  — selecting a segment submits the radio's value and the
                  server renders the matching view into the target. (htmx v4's
                  default trigger for form inputs is already{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change</code>.)
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (change default)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <form
                  hx-post="/segmented-control/view"
                  hx-trigger="change"
                  hx-target="#ex-sc-result"
                  hx-swap="innerHTML"
                  class="space-y-4"
                >
                  <SegmentedControl name="layout" ariaLabel="Layout" defaultValue="list">
                    <SegmentedControlItem value="list" name="layout" id="ex-sc-h-list" checked>
                      List
                    </SegmentedControlItem>
                    <SegmentedControlItem value="grid" name="layout" id="ex-sc-h-grid">
                      Grid
                    </SegmentedControlItem>
                  </SegmentedControl>
                  <div
                    id="ex-sc-result"
                    class="rounded-md border bg-card p-4 text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    Showing the <strong>list</strong> layout.
                  </div>
                </form>
              ),
              jsx: `<form hx-post="/api/layout" hx-trigger="change"
      hx-target="#result" hx-swap="innerHTML">
  <SegmentedControl name="layout" ariaLabel="Layout" defaultValue="list">
    <SegmentedControlItem value="list" name="layout" id="list" checked>List</SegmentedControlItem>
    <SegmentedControlItem value="grid" name="layout" id="grid">Grid</SegmentedControlItem>
  </SegmentedControl>
  <div id="result" aria-live="polite" />
</form>`,
              jinja: `<form hx-post="/api/layout" hx-trigger="change"
      hx-target="#result" hx-swap="innerHTML">
  {{ segmented_control_open(name="layout", aria_label="Layout", default_value="list") }}
    {{ segmented_control_item("List", value="list", name="layout", id="list", checked=true) }}
    {{ segmented_control_item("Grid", value="grid", name="layout", id="grid") }}
  {{ segmented_control_close() }}
  <div id="result" aria-live="polite"></div>
</form>`,
              go: `<form hx-post="/api/layout" hx-trigger="change"
      hx-target="#result" hx-swap="innerHTML">
  {{template "segmented_control" (dict "Name" "layout" "AriaLabel" "Layout" "DefaultValue" "list"
    "Body" (htmlSafe \`
      {{template "segmented_control_item" (dict "Text" "List" "Value" "list" "Name" "layout" "ID" "list" "Checked" true)}}
      {{template "segmented_control_item" (dict "Text" "Grid" "Value" "grid" "Name" "layout" "ID" "grid")}}\`))}}
  <div id="result" aria-live="polite"></div>
</form>`,
              phoenix: `<form hx-post={~p"/api/layout"} hx-trigger="change"
      hx-target="#result" hx-swap="innerHTML">
  <.segmented_control name="layout" aria-label="Layout" default_value="list">
    <.segmented_control_item value="list" name="layout" id="list" checked>List</.segmented_control_item>
    <.segmented_control_item value="grid" name="layout" id="grid">Grid</.segmented_control_item>
  </.segmented_control>
  <div id="result" aria-live="polite"></div>
</form>`,
            })}
          </section>

          <ApiTable title="<SegmentedControl>" rows={SEGMENTED_CONTROL_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

segmentedControlRoutes.post("/view", async (c) => {
  const body = await c.req.parseBody()
  const layout = String(body.layout ?? "list")
  return c.html(
    <>
      Showing the <strong>{layout}</strong> layout.
    </>,
  )
})
