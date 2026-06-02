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
import { TABLE_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

export const tableRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [tJsx, tJinja, tGo, tPhoenix, tHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/table.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/table.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/table.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/table.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/table.html"), "utf8"),
])

const usageJsx = `import { Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead sort="ascending">Name</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>Ada</TableCell><TableCell>Owner</TableCell></TableRow>
    <TableRow><TableCell>Grace</TableCell><TableCell>Admin</TableCell></TableRow>
  </TableBody>
</Table>`

const usageJinja = `{% from "components/table.html" import table_open, table_close,
   thead_open, thead_close, tbody_open, tbody_close, tr_open, tr_close, th, td %}

{{ table_open() }}
  {{ thead_open() }}{{ tr_open() }}{{ th("Name", sort="ascending") }}{{ th("Role") }}{{ tr_close() }}{{ thead_close() }}
  {{ tbody_open() }}{{ tr_open() }}{{ td("Ada") }}{{ td("Owner") }}{{ tr_close() }}{{ tbody_close() }}
{{ table_close() }}`

const usageGo = `{{template "table" (dict "Body" (htmlSafe \`
  …<thead>…<tbody>…\`))}}`

const usagePhoenix = `<.table>
  <.table_header>
    <.table_row>
      <.table_head sort="ascending">Name</.table_head>
      <.table_head>Role</.table_head>
    </.table_row>
  </.table_header>
  <.table_body>
    <.table_row><.table_cell>Ada</.table_cell><.table_cell>Owner</.table_cell></.table_row>
  </.table_body>
</.table>`

const usageHtml = `<table data-slot="table" class="w-full text-sm">
  <thead><tr>
    <th scope="col" data-sortable="true" aria-sort="ascending"><button>Name ↑</button></th>
    <th scope="col">Role</th>
  </tr></thead>
  <tbody>
    <tr><td>Ada</td><td>Owner</td></tr>
  </tbody>
</table>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-sortable", label: "Sortable (htmx)", nested: true },
  { href: "#api", label: "API Reference" },
]

// Server-side sort state for the htmx demo.
type Row = { name: string; role: string; joined: string }
const DATA: Row[] = [
  { name: "Ada Lovelace", role: "Owner", joined: "2024-01-15" },
  { name: "Grace Hopper", role: "Admin", joined: "2024-03-02" },
  { name: "Hedy Lamarr", role: "Editor", joined: "2024-08-21" },
  { name: "Margaret Hamilton", role: "Editor", joined: "2024-11-08" },
  { name: "Katherine Johnson", role: "Viewer", joined: "2025-02-19" },
]

type SortDir = "ascending" | "descending"
type SortField = "name" | "role" | "joined"

function nextDir(current: SortDir | "none"): SortDir {
  return current === "ascending" ? "descending" : "ascending"
}

function sortRows(rows: Row[], field: SortField, dir: SortDir): Row[] {
  const sorted = [...rows].sort((a, b) =>
    a[field].localeCompare(b[field]),
  )
  return dir === "ascending" ? sorted : sorted.reverse()
}

function SortableTableContent(props: { sort?: SortField; dir?: SortDir }) {
  const sort = props.sort ?? "name"
  const dir = props.dir ?? "ascending"
  const rows = sortRows(DATA, sort, dir)
  // For htmx: each header button POSTs the *next* sort state.
  const headerSort = (field: SortField) =>
    field === sort ? dir : "none"
  const nextFor = (field: SortField): SortDir =>
    field === sort ? nextDir(dir) : "ascending"
  return (
    <>
      <TableHeader>
        <TableRow>
          {(["name", "role", "joined"] as SortField[]).map((field) => (
            <TableHead
              sort={headerSort(field)}
              hx-get={`/table/sort?field=${field}&dir=${nextFor(field)}`}
              hx-target="closest table"
              hx-swap="outerHTML"
            >
              {field === "name" ? "Name" : field === "role" ? "Role" : "Joined"}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.role}</TableCell>
            <TableCell>{r.joined}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

// Initial render (preview): full <Table> keeps the .overflow-auto scroll wrapper.
function SortableTable(props: { sort?: SortField; dir?: SortDir }) {
  return (
    <Table>
      <SortableTableContent sort={props.sort} dir={props.dir} />
    </Table>
  )
}

// htmx swap target: a BARE <table> mirroring registry Table's table element
// (same data-slot + classes) so hx-swap="outerHTML" on `closest table`
// replaces table-with-table idempotently — no nested wrapper accumulation.
function SortableTableSwap(props: { sort?: SortField; dir?: SortDir }) {
  return (
    <table data-slot="table" class="w-full caption-bottom text-sm">
      <SortableTableContent sort={props.sort} dir={props.dir} />
    </table>
  )
}

tableRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/table.json`

  return page(
    c,
    <Layout title="Table — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/table" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Table</h1>
            <p class="text-muted-foreground">
              Semantic{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;table&gt;</code>{" "}
              with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;thead&gt;</code>
              {" / "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;tbody&gt;</code>{" "}
              and column headers carrying{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">scope="col"</code>
              . Sortable columns advertise their state via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-sort</code>{" "}
              and route sort actions through htmx.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-table"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/table.tsx", source: tJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/table.html", source: tJinja, note: "Copy table.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/table.tmpl", source: tGo, note: "Add table.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/table.ex", source: tPhoenix, note: "Drop table.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: tHtml, note: "Tailwind utilities only; sort button uses htmx." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — semantic table",
              description:
                "<thead>, <tbody>, <th scope=\"col\">. AT users get native column/row navigation.",
              narrative: (
                <p>
                  Don't reach for ARIA{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="grid"</code>{" "}
                  unless you actually need spreadsheet-style cell focus. For
                  read-only tabular data, the native model is correct and
                  cheaper.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scope="col"</code>{" "}
                  on each{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;th&gt;</code>{" "}
                  is enough.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<table> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table",
                },
                {
                  source: "MDN",
                  label: "<th scope=…>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#scope",
                },
              ],
              preview: (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DATA.slice(0, 3).map((r) => (
                      <TableRow>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.role}</TableCell>
                        <TableCell>{r.joined}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ),
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-sortable",
              title: "Sortable — htmx round-trip",
              description:
                "Click a header to sort. Each click POSTs the next sort state; server returns the re-sorted table; htmx swaps outerHTML.",
              narrative: (
                <p>
                  No client state machine — the server is the source of
                  truth. Each header's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>{" "}
                  carries the{" "}
                  <em>next</em> sort direction in the query string. After
                  swap,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-sort</code>{" "}
                  reflects the new state automatically because the server
                  renders it. AT users hear the announcement on the next
                  focus.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-sort",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-sort",
                },
                {
                  source: "htmx",
                  label: "hx-target (closest)",
                  href: "https://htmx.org/attributes/hx-target/",
                },
              ],
              preview: <SortableTable sort="name" dir="ascending" />,
              jsx: `<TableHead
  sort={field === activeSort ? dir : "none"}
  hx-get={\`/api/users?sort=\${field}&dir=\${nextDir}\`}
  hx-target="closest table"
  hx-swap="outerHTML"
>
  Name
</TableHead>`,
              jinja: `{{ th("Name", sort="ascending",
        hx_get="/api/users?sort=name&dir=descending",
        hx_target="closest table", hx_swap="outerHTML") }}`,
              go: `{{template "table_head" (dict "Label" "Name" "Sort" "ascending"
  "HxGet" "/api/users?sort=name&dir=descending" "HxTarget" "closest table")}}`,
              phoenix: `<.table_head sort="ascending"
  hx-get={~p"/api/users?sort=name&dir=descending"}
  hx-target="closest table" hx-swap="outerHTML">
  Name
</.table_head>`,
            })}
          </section>
          <ApiTable
            title="<Table>"
            rows={TABLE_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

tableRoutes.get("/sort", (c) => {
  const field = (c.req.query("field") ?? "name") as SortField
  const dir = (c.req.query("dir") ?? "ascending") as SortDir
  return c.html(<SortableTableSwap sort={field} dir={dir} />)
})
