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
import { DELETE_ROW_PROPS } from "@/app/data/api-rows"
import { DeleteRowList, DeleteRowItem, DeleteRow } from "@/registry/ui/delete-row"
import { Table, TableHeader, TableHead, TableCell } from "@/registry/ui/table"

export const deleteRowRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/delete-row.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/delete-row.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/delete-row.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/delete_row.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/delete-row.html"), "utf8"),
])

const usageJsx = `import { DeleteRowList, DeleteRowItem, DeleteRow } from "@/components/ui/delete-row"

// The <tbody> host hoists confirm / target / swap to every Delete button.
<table class="w-full text-sm">
  <DeleteRowList>
    {contacts.map((c) => (
      <DeleteRowItem>
        <td class="p-2">{c.name}</td>
        <td class="p-2 text-right">
          <DeleteRow href={\`/contacts/\${c.id}\`} />
        </td>
      </DeleteRowItem>
    ))}
  </DeleteRowList>
</table>`

const usageJinja = `{% from "components/delete-row.html" import delete_row_list, delete_row_item, delete_row %}

<table class="w-full text-sm">
  {% call delete_row_list() %}
    {% for c in contacts %}
      {% call delete_row_item() %}
        <td class="p-2">{{ c.name }}</td>
        <td class="p-2 text-right">{{ delete_row(href="/contacts/" ~ c.id) }}</td>
      {% endcall %}
    {% endfor %}
  {% endcall %}
</table>`

const usageGo = `{{define "rows"}}
  {{range .Contacts}}
    {{template "delete_row_item" (dict "Body" (htmlSafe (printf
      "<td class=\\"p-2\\">%s</td><td class=\\"p-2 text-right\\">%s</td>"
      .Name (delete_row_btn .ID)))}}
  {{end}}
{{end}}

<table class="w-full text-sm">
  {{template "delete_row_list" (dict "Body" (htmlSafe (renderRows .Contacts)))}}
</table>`

const usagePhoenix = `<table class="w-full text-sm">
  <.delete_row_list>
    <.delete_row_item :for={c <- @contacts}>
      <td class="p-2">{c.name}</td>
      <td class="p-2 text-right"><.delete_row href={~p"/contacts/#{c.id}"} /></td>
    </.delete_row_item>
  </.delete_row_list>
</table>`

const usageHtml = `<table class="w-full text-sm">
  <tbody data-slot="delete-row"
         hx-confirm:inherited="Are you sure you want to delete this?"
         hx-target:inherited="closest tr"
         hx-swap:inherited="outerHTML swap:300ms">
    <tr data-slot="delete-row-item" style="transition-duration:300ms"
        class="transition-opacity ease-out [&.htmx-swapping]:opacity-0">
      <td class="p-2">Joe Smith</td>
      <td class="p-2 text-right">
        <button type="button" data-slot="delete-row-trigger" hx-delete="/contacts/1"
                class="…">Delete</button>
      </td>
    </tr>
  </tbody>
</table>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Delete in place", nested: true },
  { href: "#ex-list", label: "Non-table list", nested: true },
  { href: "#api", label: "API Reference" },
]

// ── Demo state ──────────────────────────────────────────────────────────
// In-memory contact list, re-seeded on every GET of the live demo region so
// the destructive DELETE round-trip is repeatable across page loads / test
// runs (single-process docs server). Each Delete removes the matching id;
// the server answers 200 + empty body, so htmx swaps the row with nothing.
type Contact = { id: number; name: string; email: string }
const SEED: Contact[] = [
  { id: 1, name: "Joe Smith", email: "joe@smith.org" },
  { id: 2, name: "Angie MacDowell", email: "angie@macdowell.org" },
  { id: 3, name: "Fuqua Tarkenton", email: "fuqua@tarkenton.org" },
  { id: 4, name: "Kim Yee", email: "kim@yee.org" },
]
let demoContacts: Contact[] = structuredClone(SEED)

function DemoTable() {
  // Re-seed so the demo is always full on (re)load.
  demoContacts = structuredClone(SEED)
  return (
    <Table class="text-sm">
      <TableHeader>
        <tr>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>
            <span class="sr-only">Actions</span>
          </TableHead>
        </tr>
      </TableHeader>
      <DeleteRowList class="[&_tr:last-child]:border-0">
        {demoContacts.map((c) => (
          <DeleteRowItem class="border-b hover:bg-muted/50" data-test={`row-${c.id}`}>
            <TableCell>{c.name}</TableCell>
            <TableCell class="text-muted-foreground">{c.email}</TableCell>
            <TableCell class="text-right">
              <DeleteRow href={`/delete-row/contacts/${c.id}`} ariaLabel={`Delete ${c.name}`} />
            </TableCell>
          </DeleteRowItem>
        ))}
      </DeleteRowList>
    </Table>
  )
}

deleteRowRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/delete-row.json`

  return page(
    c,
    <Layout title="Delete Row — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/delete-row" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Delete Row</h1>
            <p class="text-muted-foreground">
              A row delete affordance that confirms, sends{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">DELETE</code>,
              then fades out in place. One{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">:inherited</code>{" "}
              declaration on the list host covers every row — no per-row
              wiring and no client-side list state. The server replies with an
              empty body and the row simply disappears.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-delete-row"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/delete-row.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/delete-row.html", source: jinjaSource, note: "Copy delete-row.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/delete-row.tmpl", source: goSource, note: "Add delete-row.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/delete_row.ex", source: phoenixSource, note: "Drop delete_row.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/delete-row.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Delete in place",
              description:
                "Each Delete confirms, sends DELETE to the row's resource, then fades the row out before htmx detaches it. Reload the page to restore the list.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;tbody&gt;</code>{" "}
                  hoists{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-confirm:inherited</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target:inherited="closest tr"</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap:inherited="outerHTML swap:300ms"</code>{" "}
                  with htmx v4's explicit{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">:inherited</code>{" "}
                  modifier, so each Delete button only needs{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-delete</code>.
                  During the 300ms swap delay htmx adds{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx-swapping</code>{" "}
                  to the row, which drives the opacity fade — no JavaScript of
                  our own.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Delete in Place pattern",
                  href: "https://htmx.org/examples/delete-row/",
                },
                {
                  source: "htmx",
                  label: "Attribute inheritance (:inherited)",
                  href: "https://htmx.org/docs/#inheritance",
                },
                {
                  source: "htmx",
                  label: "hx-delete (200 + empty body removes the row)",
                  href: "https://htmx.org/attributes/hx-delete/",
                },
                {
                  source: "MDN",
                  label: "<tbody> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody",
                },
              ],
              preview: (
                <div id="ex-dr-host" class="w-full">
                  <DemoTable />
                </div>
              ),
              jsx: `<table class="w-full text-sm">
  <DeleteRowList>
    {contacts.map((c) => (
      <DeleteRowItem>
        <td class="p-2">{c.name}</td>
        <td class="p-2 text-right">
          <DeleteRow href={\`/contacts/\${c.id}\`} ariaLabel={\`Delete \${c.name}\`} />
        </td>
      </DeleteRowItem>
    ))}
  </DeleteRowList>
</table>`,
              jinja: `{% call delete_row_list() %}
  {% for c in contacts %}
    {% call delete_row_item() %}
      <td class="p-2">{{ c.name }}</td>
      <td class="p-2 text-right">{{ delete_row(href="/contacts/" ~ c.id) }}</td>
    {% endcall %}
  {% endfor %}
{% endcall %}`,
              go: `{{template "delete_row_list" (dict "Body" (htmlSafe $rows))}}`,
              phoenix: `<.delete_row_list>
  <.delete_row_item :for={c <- @contacts}>
    <td class="p-2">{c.name}</td>
    <td class="p-2 text-right"><.delete_row href={~p"/contacts/#{c.id}"} /></td>
  </.delete_row_item>
</.delete_row_list>`,
            })}

            {await Example({
              id: "ex-list",
              title: "Non-table list",
              description:
                "The host isn't tied to tables. Render it as a <ul> and set the matching target so the same one-declaration behaviour removes <li> items.",
              narrative: (
                <p>
                  Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">as="ul"</code>{" "}
                  on the host and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">target="closest li"</code>{" "}
                  so the inherited{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  resolves to the list item. Each{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">DeleteRowItem</code>{" "}
                  renders as an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;li&gt;</code>{" "}
                  carrying the same fade. Everything else is identical — the
                  affordance, the confirm, the empty-body DELETE.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: 'hx-target="closest <selector>"',
                  href: "https://htmx.org/attributes/hx-target/",
                },
                {
                  source: "MDN",
                  label: "<ul> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul",
                },
              ],
              preview: (
                <DeleteRowList as="ul" target="closest li" class="w-full max-w-sm divide-y rounded-md border">
                  <DeleteRowItem as="li" class="flex items-center justify-between gap-2 px-3 py-2">
                    <span class="text-sm">design-spec.pdf</span>
                    <DeleteRow href="/delete-row/files/1" ariaLabel="Delete design-spec.pdf" />
                  </DeleteRowItem>
                  <DeleteRowItem as="li" class="flex items-center justify-between gap-2 px-3 py-2">
                    <span class="text-sm">budget-q3.xlsx</span>
                    <DeleteRow href="/delete-row/files/2" ariaLabel="Delete budget-q3.xlsx" />
                  </DeleteRowItem>
                </DeleteRowList>
              ),
              jsx: `<DeleteRowList as="ul" target="closest li">
  <DeleteRowItem as="li">
    <span>design-spec.pdf</span>
    <DeleteRow href="/files/1" ariaLabel="Delete design-spec.pdf" />
  </DeleteRowItem>
</DeleteRowList>`,
              jinja: `{% call delete_row_list(as="ul", target="closest li") %}
  {% call delete_row_item(as="li") %}
    <span>design-spec.pdf</span>
    {{ delete_row(href="/files/1", aria_label="Delete design-spec.pdf") }}
  {% endcall %}
{% endcall %}`,
              go: `{{template "delete_row_list" (dict "As" "ul" "Target" "closest li" "Body" (htmlSafe $items))}}`,
              phoenix: `<.delete_row_list as="ul" target="closest li">
  <.delete_row_item as="li">
    <span>design-spec.pdf</span>
    <.delete_row href={~p"/files/1"} aria_label="Delete design-spec.pdf" />
  </.delete_row_item>
</.delete_row_list>`,
            })}
          </section>

          <ApiTable title="Delete Row" rows={DELETE_ROW_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ── htmx demo endpoints ───────────────────────────────────────────────────
// DELETE the row's resource. The canonical contract: respond 200 with an
// EMPTY body so htmx swaps the targeted row with nothing and it disappears
// after the fade. (A 204 would perform no swap.) State is best-effort; the
// demo region re-seeds itself on every page load.

deleteRowRoutes.delete("/contacts/:id", (c) => {
  const id = Number(c.req.param("id"))
  demoContacts = demoContacts.filter((x) => x.id !== id)
  return c.body("", 200)
})

deleteRowRoutes.delete("/files/:id", (c) => c.body("", 200))
