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
import { SELECTABLE_TABLE_PROPS } from "@/app/data/api-rows"
import {
  SelectableTable,
  SelectableTableActions,
  SelectableTableBody,
  SelectableTableCell,
  SelectableTableContent,
  SelectableTableCount,
  SelectableTableHead,
  SelectableTableHeader,
  SelectableTableRow,
  SelectAllCheckbox,
  SelectRowCheckbox,
  BulkAction,
} from "@/registry/ui/selectable-table"

export const selectableTableRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/selectable-table.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/selectable-table.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/selectable-table.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/selectable_table.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/selectable-table.html"), "utf8"),
])

const usageJsx = `import {
  SelectableTable, SelectableTableActions, BulkAction,
  SelectableTableContent, SelectableTableHeader, SelectableTableBody,
  SelectableTableRow, SelectableTableHead, SelectableTableCell,
  SelectAllCheckbox, SelectRowCheckbox, SelectableTableCount,
} from "@/components/ui/selectable-table"

<SelectableTable ariaLabel="Users">
  <SelectableTableActions label="With selected:">
    <BulkAction hx-post="/users/activate">Activate</BulkAction>
    <BulkAction hx-post="/users/delete" variant="destructive" confirm="Delete selected users?">Delete</BulkAction>
  </SelectableTableActions>

  <SelectableTableContent>
    <SelectableTableHeader>
      <SelectableTableRow>
        <SelectableTableHead class="w-10"><SelectAllCheckbox /></SelectableTableHead>
        <SelectableTableHead>Name</SelectableTableHead>
        <SelectableTableHead>Email</SelectableTableHead>
      </SelectableTableRow>
    </SelectableTableHeader>
    <SelectableTableBody>
      <SelectableTableRow>
        <SelectableTableCell><SelectRowCheckbox value="ada@db.org" ariaLabel="Select Ada" /></SelectableTableCell>
        <SelectableTableCell>Ada Lovelace</SelectableTableCell>
        <SelectableTableCell>ada@db.org</SelectableTableCell>
      </SelectableTableRow>
    </SelectableTableBody>
  </SelectableTableContent>

  <SelectableTableCount />
</SelectableTable>`

const usageJinja = `{% from "components/selectable-table.html" import
   selectable_table_open, selectable_table_close, st_actions_open,
   st_actions_close, bulk_action, st_content_open, st_content_close,
   st_select_all, st_select_row, st_count with context %}

{% call selectable_table_open(aria_label="Users") %}
  {% call st_actions_open(label="With selected:") %}
    {{ bulk_action(label="Activate", hx_post="/users/activate") }}
    {{ bulk_action(label="Delete", hx_post="/users/delete", variant="destructive", confirm="Delete selected users?") }}
  {% endcall %}
  {# …table with st_select_all / st_select_row … #}
  {{ st_count() }}
{% endcall %}`

const usageGo = `{{template "selectable_table" (dict
  "AriaLabel" "Users"
  "Body" (htmlSafe "<!-- actions + table + count -->"))}}

{{template "bulk_action" (dict "Label" "Activate" "HxPost" "/users/activate")}}
{{template "st_select_row" (dict "Value" "ada@db.org" "AriaLabel" "Select Ada")}}`

const usagePhoenix = `<.selectable_table aria_label="Users">
  <:actions label="With selected:">
    <.bulk_action hx-post="/users/activate">Activate</.bulk_action>
    <.bulk_action hx-post="/users/delete" variant="destructive" confirm="Delete selected users?">Delete</.bulk_action>
  </:actions>
  <:row :for={u <- @users} value={u.email}>
    <:cell>{u.name}</:cell>
    <:cell>{u.email}</:cell>
  </:row>
</.selectable_table>`

const usageHtml = `<form data-slot="selectable-table" aria-label="Users"
      class="group/selectable-table w-full space-y-3">
  <div data-slot="selectable-table-actions"
       class="hidden items-center gap-2 rounded-md border bg-muted px-3 py-2 group-has-[input[name=selected]:checked]/selectable-table:flex">
    <span class="mr-1 text-xs font-medium text-muted-foreground">With selected:</span>
    <button type="button" data-slot="selectable-table-action" hx-post="/users/activate"
            hx-target="closest [data-slot='selectable-table']" hx-swap="outerHTML" class="…">Activate</button>
  </div>
  <!-- <table> with name="selected" row checkboxes -->
  <output data-slot="selectable-table-count" class="block text-sm text-muted-foreground"></output>
</form>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Bulk actions", nested: true },
  { href: "#ex-destructive", label: "Destructive action", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- Demo data + renderer for the live htmx example ------------------
type User = { name: string; email: string; status: "Active" | "Inactive" }

// A fresh data store per request-chain is overkill for a docs demo; a single
// module-level store is fine — the demo just needs to show the swap working.
const USERS: Record<string, User> = {
  "ada@analytical.org": { name: "Ada Lovelace", email: "ada@analytical.org", status: "Active" },
  "grace@navy.mil": { name: "Grace Hopper", email: "grace@navy.mil", status: "Active" },
  "alan@bletchley.uk": { name: "Alan Turing", email: "alan@bletchley.uk", status: "Inactive" },
  "katherine@nasa.gov": { name: "Katherine Johnson", email: "katherine@nasa.gov", status: "Active" },
}

function StatusBadge({ status }: { status: User["status"] }) {
  const active = status === "Active"
  return (
    <span
      data-test="status"
      class={
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
        (active
          ? "bg-secondary text-secondary-foreground"
          : "bg-muted text-muted-foreground")
      }
    >
      {status}
    </span>
  )
}

// The whole form — re-rendered on every bulk POST. `message` is the result
// announced in the live <output> region after an action.
function UserTable({ message }: { message?: string }) {
  return (
    <SelectableTable ariaLabel="Users" data-test="table">
      <SelectableTableActions label="With selected:">
        <BulkAction hx-post="/selectable-table/activate" data-test="activate">
          Activate
        </BulkAction>
        <BulkAction hx-post="/selectable-table/deactivate" data-test="deactivate">
          Deactivate
        </BulkAction>
        <BulkAction
          hx-post="/selectable-table/delete"
          variant="destructive"
          confirm="Delete the selected users?"
          data-test="delete"
        >
          Delete
        </BulkAction>
      </SelectableTableActions>

      <SelectableTableContent>
        <SelectableTableHeader>
          <SelectableTableRow>
            <SelectableTableHead class="w-10">
              <SelectAllCheckbox />
            </SelectableTableHead>
            <SelectableTableHead>Name</SelectableTableHead>
            <SelectableTableHead>Email</SelectableTableHead>
            <SelectableTableHead>Status</SelectableTableHead>
          </SelectableTableRow>
        </SelectableTableHeader>
        <SelectableTableBody>
          {Object.values(USERS).map((u) => (
            <SelectableTableRow value={u.email}>
              <SelectableTableCell>
                <SelectRowCheckbox value={u.email} ariaLabel={`Select ${u.name}`} />
              </SelectableTableCell>
              <SelectableTableCell class="font-medium text-foreground">
                {u.name}
              </SelectableTableCell>
              <SelectableTableCell class="text-muted-foreground">
                {u.email}
              </SelectableTableCell>
              <SelectableTableCell>
                <StatusBadge status={u.status} />
              </SelectableTableCell>
            </SelectableTableRow>
          ))}
        </SelectableTableBody>
      </SelectableTableContent>

      <SelectableTableCount>{message}</SelectableTableCount>
    </SelectableTable>
  )
}

selectableTableRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/selectable-table.json`
  return page(
    c,
    <Layout title="Selectable Table — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/selectable-table" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Selectable Table</h1>
            <p class="text-muted-foreground">
              A data table with row checkboxes, a header select-all, a live
              selection count, and a contextual bulk-action bar. The bar is
              revealed purely in CSS via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">:has(:checked)</code>{" "}
              — no JavaScript decides visibility. Each row checkbox is a real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">name="selected"</code>{" "}
              field, so bulk-action buttons{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-post</code>{" "}
              the checked values and re-render the table.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-selectable-table"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/selectable-table.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/selectable-table.html", source: jinjaSource, note: "Copy selectable-table.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/selectable-table.tmpl", source: goSource, note: "Add selectable-table.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/selectable_table.ex", source: phoenixSource, note: "Drop selectable_table.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/selectable-table.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Bulk actions",
              description:
                "Check rows (or the header box to select all). The action bar slides in via CSS :has(:checked) — no JS toggles it. Each action button hx-posts the checked name=\"selected\" values (htmx serialises the enclosing form) and the server replaces the whole form with the re-rendered table and a result message in the live <output>.",
              narrative: (
                <p>
                  The action bar visibility is{" "}
                  <em>entirely</em> CSS:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    form:has(input[name=selected]:checked) .actions {"{"} display: flex {"}"}
                  </code>
                  . The bulk buttons live inside the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>,
                  so htmx submits every checked value with no{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-include</code>{" "}
                  plumbing. The select-all toggle and the running count are the
                  only behaviour JavaScript handles, and they degrade
                  gracefully — every checkbox still toggles and submits without
                  it.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Bulk actions pattern",
                  href: "https://htmx.org/examples/bulk-update/",
                },
                {
                  source: "MDN",
                  label: ":has() pseudo-class",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/:has",
                },
                {
                  source: "MDN",
                  label: "<output> (implicit aria-live)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output",
                },
              ],
              preview: (
                <div class="w-full max-w-xl">
                  <UserTable />
                </div>
              ),
              jsx: `<SelectableTable ariaLabel="Users">
  <SelectableTableActions label="With selected:">
    <BulkAction hx-post="/users/activate">Activate</BulkAction>
    <BulkAction hx-post="/users/deactivate">Deactivate</BulkAction>
  </SelectableTableActions>

  <SelectableTableContent>
    <SelectableTableHeader>
      <SelectableTableRow>
        <SelectableTableHead class="w-10"><SelectAllCheckbox /></SelectableTableHead>
        <SelectableTableHead>Name</SelectableTableHead>
        <SelectableTableHead>Email</SelectableTableHead>
      </SelectableTableRow>
    </SelectableTableHeader>
    <SelectableTableBody>
      {users.map((u) => (
        <SelectableTableRow value={u.email}>
          <SelectableTableCell><SelectRowCheckbox value={u.email} ariaLabel={\`Select \${u.name}\`} /></SelectableTableCell>
          <SelectableTableCell>{u.name}</SelectableTableCell>
          <SelectableTableCell>{u.email}</SelectableTableCell>
        </SelectableTableRow>
      ))}
    </SelectableTableBody>
  </SelectableTableContent>

  <SelectableTableCount />
</SelectableTable>

// Server POST /users/activate reads the repeated "selected" field,
// applies the action, and returns the whole <SelectableTable> again
// with a result message in <SelectableTableCount>.`,
              jinja: `{% call selectable_table_open(aria_label="Users") %}
  {% call st_actions_open(label="With selected:") %}
    {{ bulk_action(label="Activate", hx_post="/users/activate") }}
    {{ bulk_action(label="Deactivate", hx_post="/users/deactivate") }}
  {% endcall %}

  {% call st_content_open() %}
    <thead data-slot="selectable-table-header" class="[&_tr]:border-b">
      <tr data-slot="selectable-table-row" class="border-b">
        <th class="w-10 …">{{ st_select_all() }}</th>
        <th class="…">Name</th><th class="…">Email</th>
      </tr>
    </thead>
    <tbody data-slot="selectable-table-body">
      {% for u in users %}
      <tr data-slot="selectable-table-row" class="border-b … has-[input[name=selected]:checked]:bg-muted">
        <td class="…">{{ st_select_row(value=u.email, aria_label="Select " ~ u.name) }}</td>
        <td class="…">{{ u.name }}</td><td class="…">{{ u.email }}</td>
      </tr>
      {% endfor %}
    </tbody>
  {% endcall %}

  {{ st_count(message) }}
{% endcall %}`,
              go: `{{define "user_table"}}
{{template "selectable_table" (dict "AriaLabel" "Users" "Body" (htmlSafe (printf "%s%s%s"
  (renderActions) (renderTable .Users) (renderCount .Message))))}}
{{end}}

{{/* Each row checkbox: */}}
{{template "st_select_row" (dict "Value" .Email "AriaLabel" (printf "Select %s" .Name))}}`,
              phoenix: `<.selectable_table aria_label="Users" message={@message}>
  <:actions label="With selected:">
    <.bulk_action hx-post="/users/activate">Activate</.bulk_action>
    <.bulk_action hx-post="/users/deactivate">Deactivate</.bulk_action>
  </:actions>
  <:column label="Name" /><:column label="Email" />
  <:row :for={u <- @users} value={u.email} aria_label={"Select #{u.name}"}>
    <:cell>{u.name}</:cell>
    <:cell>{u.email}</:cell>
  </:row>
</.selectable_table>`,
            })}

            {await Example({
              id: "ex-destructive",
              title: "Destructive action",
              description:
                "Mark a bulk action variant=\"destructive\" for the muted-danger styling, and add confirm=\"…\" to gate it behind the browser's native window.confirm (htmx hx-confirm) so an accidental click can't wipe rows.",
              narrative: (
                <p>
                  A destructive bulk button uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">variant="destructive"</code>{" "}
                  for the danger styling and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">confirm="…"</code>,
                  which sets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-confirm</code>.
                  htmx pops the browser's native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">window.confirm</code>{" "}
                  before issuing the POST — zero custom JS.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-confirm",
                  href: "https://htmx.org/attributes/hx-confirm/",
                },
              ],
              preview: (
                <div class="w-full max-w-xl">
                  <UserTable />
                </div>
              ),
              jsx: `<SelectableTableActions label="With selected:">
  <BulkAction hx-post="/users/activate">Activate</BulkAction>
  <BulkAction
    hx-post="/users/delete"
    variant="destructive"
    confirm="Delete the selected users?"
  >
    Delete
  </BulkAction>
</SelectableTableActions>`,
              jinja: `{% call st_actions_open(label="With selected:") %}
  {{ bulk_action(label="Activate", hx_post="/users/activate") }}
  {{ bulk_action(
       label="Delete", hx_post="/users/delete",
       variant="destructive", confirm="Delete the selected users?") }}
{% endcall %}`,
              go: `{{template "bulk_action" (dict "Label" "Activate" "HxPost" "/users/activate")}}
{{template "bulk_action" (dict
  "Label" "Delete" "HxPost" "/users/delete"
  "Variant" "destructive" "Confirm" "Delete the selected users?")}}`,
              phoenix: `<:actions label="With selected:">
  <.bulk_action hx-post="/users/activate">Activate</.bulk_action>
  <.bulk_action hx-post="/users/delete" variant="destructive" confirm="Delete the selected users?">
    Delete
  </.bulk_action>
</:actions>`,
            })}
          </section>

          <ApiTable title="<SelectableTable>" rows={SELECTABLE_TABLE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ---- htmx bulk-action endpoints --------------------------------------
// Each reads the repeated `selected` field (parseBody({ all: true }) gives an
// array for repeated keys), mutates the demo store, and re-renders the form.
async function selected(c: { req: { parseBody: (o: { all: true }) => Promise<Record<string, unknown>> } }) {
  const body = await c.req.parseBody({ all: true })
  const raw = body.selected
  return (Array.isArray(raw) ? raw : raw === undefined ? [] : [raw]).map(String)
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`
}

selectableTableRoutes.post("/activate", async (c) => {
  const emails = await selected(c)
  let n = 0
  for (const e of emails) {
    const u = USERS[e]
    if (u && u.status !== "Active") {
      u.status = "Active"
      n++
    }
  }
  return c.html(<UserTable message={`Activated ${plural(n, "user")}.`} />)
})

selectableTableRoutes.post("/deactivate", async (c) => {
  const emails = await selected(c)
  let n = 0
  for (const e of emails) {
    const u = USERS[e]
    if (u && u.status !== "Inactive") {
      u.status = "Inactive"
      n++
    }
  }
  return c.html(<UserTable message={`Deactivated ${plural(n, "user")}.`} />)
})

selectableTableRoutes.post("/delete", async (c) => {
  const emails = await selected(c)
  let n = 0
  for (const e of emails) {
    if (USERS[e]) {
      delete USERS[e]
      n++
    }
  }
  return c.html(<UserTable message={`Deleted ${plural(n, "user")}.`} />)
})
