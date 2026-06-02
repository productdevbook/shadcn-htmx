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
import { GRID_PROPS } from "@/app/data/api-rows"
import {
  Grid,
  GridBody,
  GridCell,
  GridColumnHeader,
  GridHeader,
  GridRow,
  GridRowHeader,
} from "@/registry/ui/grid"

export const gridRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/grid.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/grid.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/grid.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/grid.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/grid.html"), "utf8"),
])

const usageJsx = `import { Grid, GridHeader, GridBody, GridRow,
  GridColumnHeader, GridRowHeader, GridCell } from "@/components/ui/grid"

<Grid ariaLabel="Transactions">
  <GridHeader>
    <GridRow>
      <GridColumnHeader sort="ascending">Name</GridColumnHeader>
      <GridColumnHeader>Amount</GridColumnHeader>
    </GridRow>
  </GridHeader>
  <GridBody>
    <GridRow>
      <GridRowHeader>Ada Lovelace</GridRowHeader>
      <GridCell>$120.00</GridCell>
    </GridRow>
  </GridBody>
</Grid>`

const usageJinja = `{% from "components/grid.html" import grid_open, grid_close,
   ghead_open, ghead_close, gbody_open, gbody_close, grow_open, grow_close,
   gcolheader, growheader, gcell %}

{{ grid_open(aria_label="Transactions") }}
  {{ ghead_open() }}{{ grow_open() }}{{ gcolheader("Name", sort="ascending") }}{{ gcolheader("Amount") }}{{ grow_close() }}{{ ghead_close() }}
  {{ gbody_open() }}{{ grow_open() }}{{ growheader("Ada Lovelace") }}{{ gcell("$120.00") }}{{ grow_close() }}{{ gbody_close() }}
{{ grid_close() }}`

const usageGo = `{{template "grid" (dict "AriaLabel" "Transactions" "Body" (htmlSafe \`
  …<thead>…<tbody>…\`))}}`

const usagePhoenix = `<.grid aria-label="Transactions">
  <.grid_header>
    <.grid_row>
      <.grid_columnheader sort="ascending">Name</.grid_columnheader>
      <.grid_columnheader>Amount</.grid_columnheader>
    </.grid_row>
  </.grid_header>
  <.grid_body>
    <.grid_row>
      <.grid_rowheader>Ada Lovelace</.grid_rowheader>
      <.grid_cell>$120.00</.grid_cell>
    </.grid_row>
  </.grid_body>
</.grid>`

const usageHtml = `<table role="grid" data-slot="grid" aria-label="Transactions"
  class="w-full border-separate border-spacing-0 text-sm">
  <thead><tr>
    <th scope="col" data-slot="grid-columnheader" data-grid-cell="" aria-sort="ascending">Name</th>
    <th scope="col" data-slot="grid-columnheader" data-grid-cell="">Amount</th>
  </tr></thead>
  <tbody>
    <tr>
      <th scope="row" data-slot="grid-rowheader" data-grid-cell="">Ada</th>
      <td data-slot="grid-cell" data-grid-cell="">$120.00</td>
    </tr>
  </tbody>
</table>
<!-- inline boot <script> sets the roving tabindex; site.js owns the keys -->`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-links", label: "Cells with links", nested: true },
  { href: "#api", label: "API Reference" },
]

// Demo data for the previews.
type Txn = { name: string; amount: string; date: string }
const TXNS: Txn[] = [
  { name: "Ada Lovelace", amount: "$120.00", date: "2025-01-15" },
  { name: "Grace Hopper", amount: "$87.50", date: "2025-03-02" },
  { name: "Hedy Lamarr", amount: "$240.10", date: "2025-08-21" },
]

gridRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/grid.json`
  return page(
    c,
    <Layout title="grid — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/grid" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">grid</h1>
            <p class="text-muted-foreground">
              An interactive data grid:{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;table role="grid"&gt;</code>{" "}
              that is a single tab stop with 2-D arrow-key cell navigation
              (roving tabindex). Use it instead of{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">Table</code>{" "}
              when you want spreadsheet-style cell focus and a shorter tab
              sequence.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <LangTabs id="install-grid" panels={[
              { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/grid.tsx", source: jsxSource }) },
              { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/grid.html", source: jinjaSource, note: "Copy grid.html into templates/components/." }) },
              { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/grid.tmpl", source: goSource, note: "Add grid.tmpl alongside your other templates." }) },
              { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/grid.ex", source: phoenixSource, note: "Drop grid.ex into lib/my_app_web/components/." }) },
              { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/grid.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
            ]} />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — focusable cells",
              description:
                "Tab once to enter the grid, then arrow between cells. Home/End jump to the row ends; Ctrl+Home/End jump to the grid corners.",
              narrative: (
                <p>
                  The whole grid is a single tab stop. Exactly one cell carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="0"</code>{" "}
                  (a roving tabindex); the arrow keys roll it across the 2-D
                  cell map. A screen reader switches into application mode on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="grid"</code>{" "}
                  and announces each cell as you move. Built on a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;table&gt;</code>{" "}
                  so the row/cell semantics come from the platform.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Grid pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
                },
                {
                  source: "MDN",
                  label: "grid role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/grid_role",
                },
              ],
              preview: (
                <Grid ariaLabel="Recent transactions">
                  <GridHeader>
                    <GridRow>
                      <GridColumnHeader sort="ascending">Name</GridColumnHeader>
                      <GridColumnHeader>Amount</GridColumnHeader>
                      <GridColumnHeader>Date</GridColumnHeader>
                    </GridRow>
                  </GridHeader>
                  <GridBody>
                    {TXNS.map((t) => (
                      <GridRow>
                        <GridRowHeader>{t.name}</GridRowHeader>
                        <GridCell>{t.amount}</GridCell>
                        <GridCell>{t.date}</GridCell>
                      </GridRow>
                    ))}
                  </GridBody>
                </Grid>
              ),
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-links",
              title: "Cells with links",
              description:
                "When a cell holds a single interactive widget (a link), grid navigation focuses that widget directly — so the whole list is one tab stop instead of one per link.",
              narrative: (
                <p>
                  This is the layout-grid use case from the APG: grouping a
                  long list of links so keyboard users aren't trapped tabbing
                  through every one. Each cell wraps an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a&gt;</code>
                  ; the roving tabindex lands on the cell, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">Enter</code>{" "}
                  follows the link inside it. The arrow keys never get trapped
                  because the cell — not the page — owns them.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Layout grids for grouping widgets",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/#layoutgridsforgroupingwidgets",
                },
                {
                  source: "MDN",
                  label: "<a> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a",
                },
              ],
              preview: (
                <Grid ariaLabel="Saved reports">
                  <GridBody>
                    <GridRow>
                      <GridCell><a href="#ex-links" class="text-primary underline-offset-4 hover:underline">Q1 revenue</a></GridCell>
                      <GridCell><a href="#ex-links" class="text-primary underline-offset-4 hover:underline">Q2 revenue</a></GridCell>
                      <GridCell><a href="#ex-links" class="text-primary underline-offset-4 hover:underline">Q3 revenue</a></GridCell>
                    </GridRow>
                    <GridRow>
                      <GridCell><a href="#ex-links" class="text-primary underline-offset-4 hover:underline">Headcount</a></GridCell>
                      <GridCell><a href="#ex-links" class="text-primary underline-offset-4 hover:underline">Churn</a></GridCell>
                      <GridCell><a href="#ex-links" class="text-primary underline-offset-4 hover:underline">Pipeline</a></GridCell>
                    </GridRow>
                  </GridBody>
                </Grid>
              ),
              jsx: `<Grid ariaLabel="Saved reports">
  <GridBody>
    <GridRow>
      <GridCell><a href="/q1">Q1 revenue</a></GridCell>
      <GridCell><a href="/q2">Q2 revenue</a></GridCell>
    </GridRow>
  </GridBody>
</Grid>`,
              jinja: `{{ grid_open(aria_label="Saved reports") }}
  {{ gbody_open() }}{{ grow_open() }}
    {{ gcell('<a href="/q1">Q1 revenue</a>') }}
    {{ gcell('<a href="/q2">Q2 revenue</a>') }}
  {{ grow_close() }}{{ gbody_close() }}
{{ grid_close() }}`,
              go: `{{template "grid" (dict "AriaLabel" "Saved reports" "Body" (htmlSafe \`
  <tbody><tr>
    <td data-slot="grid-cell" data-grid-cell=""><a href="/q1">Q1 revenue</a></td>
  </tr></tbody>\`))}}`,
              phoenix: `<.grid aria-label="Saved reports">
  <.grid_body>
    <.grid_row>
      <.grid_cell><a href="/q1">Q1 revenue</a></.grid_cell>
      <.grid_cell><a href="/q2">Q2 revenue</a></.grid_cell>
    </.grid_row>
  </.grid_body>
</.grid>`,
            })}
          </section>

          <ApiTable title="<Grid>" rows={GRID_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
