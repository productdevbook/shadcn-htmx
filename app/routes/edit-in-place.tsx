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
import { EDIT_IN_PLACE_PROPS } from "@/app/data/api-rows"
import { EditInPlace, EditInPlaceForm, type EditInPlaceField } from "@/registry/ui/edit-in-place"

export const editInPlaceRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/edit-in-place.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/edit-in-place.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/edit-in-place.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/edit_in_place.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/edit-in-place.html"), "utf8"),
])

const usageJsx = `import { EditInPlace, EditInPlaceForm } from "@/components/ui/edit-in-place"

// View — GET /users/1 returns this. Edit fetches the form below.
<EditInPlace id="user" editHref="/users/1/edit" fields={[
  { label: "Name",  value: user.name },
  { label: "Email", value: user.email, type: "email" },
]} />

// Editor — GET /users/1/edit returns this. Save PUTs; Cancel re-GETs the view.
<EditInPlaceForm id="user" putHref="/users/1" cancelHref="/users/1" fields={[
  { label: "Name",  value: user.name },
  { label: "Email", value: user.email, type: "email" },
]} />`

const usageJinja = `{% from "components/edit-in-place.html" import edit_in_place, edit_in_place_form %}

{# View #}
{{ edit_in_place(edit_href="/users/1/edit", id="user", fields=[
     {"label": "Name",  "value": user.name},
     {"label": "Email", "value": user.email, "type": "email"},
]) }}

{# Editor #}
{{ edit_in_place_form(put_href="/users/1", cancel_href="/users/1", id="user", fields=[
     {"label": "Name",  "value": user.name},
     {"label": "Email", "value": user.email, "type": "email"},
]) }}`

const usageGo = `{{/* View */}}
{{template "edit_in_place" (dict "ID" "user" "EditHref" "/users/1/edit"
  "Fields" $fields)}}

{{/* Editor */}}
{{template "edit_in_place_form" (dict "ID" "user"
  "PutHref" "/users/1" "CancelHref" "/users/1" "Fields" $fields)}}`

const usagePhoenix = `<%# View %>
<.edit_in_place id="user" edit_href={~p"/users/1/edit"} fields={[
  %{label: "Name", value: @user.name},
  %{label: "Email", value: @user.email, type: "email"}
]} />

<%# Editor %>
<.edit_in_place_form id="user" put_href={~p"/users/1"} cancel_href={~p"/users/1"} fields={[
  %{label: "Name", value: @user.name, name: "name"},
  %{label: "Email", value: @user.email, name: "email", type: "email"}
]} />`

const usageHtml = `<!-- View: GET /users/1 returns this -->
<div data-slot="edit-in-place" id="user" hx-target="this" hx-swap="outerHTML" class="…">
  <dl>…</dl>
  <button type="button" hx-get="/users/1/edit"
          hx-target="closest [data-slot='edit-in-place']" hx-swap="outerHTML"
          class="…">Edit</button>
</div>

<!-- Editor: GET /users/1/edit returns this -->
<form data-slot="edit-in-place" hx-put="/users/1" hx-target="this" hx-swap="outerHTML" class="…">
  <label for="user-name">Name</label>
  <input id="user-name" name="name" value="Joe Smith" class="…">
  <button type="submit">Save</button>
  <button type="button" hx-get="/users/1"
          hx-target="closest [data-slot='edit-in-place']" hx-swap="outerHTML">Cancel</button>
</form>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Record view", nested: true },
  { href: "#ex-validated", label: "Required field", nested: true },
  { href: "#api", label: "API Reference" },
]

// ── Demo state ────────────────────────────────────────────────────────
// Per-demo in-memory record so the live Save round-trip actually mutates
// something between requests (single-process docs server).
const demoUser = { name: "Joe Smith", email: "joe@smith.org" }

function userFields(): EditInPlaceField[] {
  return [
    { label: "Name", value: demoUser.name, name: "name", required: true },
    { label: "Email", value: demoUser.email, name: "email", type: "email", required: true },
  ]
}

editInPlaceRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/edit-in-place.json`

  return page(
    c,
    <Layout title="Edit In Place — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/edit-in-place" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Edit In Place</h1>
            <p class="text-muted-foreground">
              A read-only record with an Edit affordance that swaps in a
              pre-filled form. Save issues a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">PUT</code>;
              Cancel re-fetches the view. The canonical htmx editable
              primitive — built entirely on{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">outerHTML</code>{" "}
              swaps over REST, no modal, no custom JS.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-edit-in-place"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/edit-in-place.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/edit-in-place.html", source: jinjaSource, note: "Copy edit-in-place.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/edit-in-place.tmpl", source: goSource, note: "Add edit-in-place.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/edit_in_place.ex", source: phoenixSource, note: "Drop edit_in_place.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/edit-in-place.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Record view ↔ editor",
              description:
                "Click Edit to swap in the form. Save PUTs the changes and the server returns the updated view; Cancel re-fetches the view, discarding edits.",
              narrative: (
                <p>
                  The view carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target="this"</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="outerHTML"</code>,
                  so the Edit button's response replaces the whole card in
                  place. The editor is a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>:
                  Enter submits, the browser validates, and Save issues the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">PUT</code>.
                  No JavaScript of our own — the platform and htmx do all the
                  work.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Edit in Place pattern",
                  href: "https://htmx.org/examples/edit-row/",
                },
                {
                  source: "htmx",
                  label: 'hx-target="this"',
                  href: "https://htmx.org/attributes/hx-target/",
                },
                {
                  source: "MDN",
                  label: "<dl> description list",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl",
                },
              ],
              preview: (
                <EditInPlace id="ex-eip-user" editHref="/edit-in-place/user/edit" fields={userFields()} />
              ),
              jsx: `<EditInPlace id="user" editHref="/users/1/edit" fields={[
  { label: "Name",  value: user.name },
  { label: "Email", value: user.email, type: "email" },
]} />`,
              jinja: `{{ edit_in_place(edit_href="/users/1/edit", id="user", fields=[
     {"label": "Name",  "value": user.name},
     {"label": "Email", "value": user.email, "type": "email"},
]) }}`,
              go: `{{template "edit_in_place" (dict "ID" "user"
  "EditHref" "/users/1/edit" "Fields" $fields)}}`,
              phoenix: `<.edit_in_place id="user" edit_href={~p"/users/1/edit"} fields={[
  %{label: "Name", value: @user.name},
  %{label: "Email", value: @user.email, type: "email"}
]} />`,
            })}

            {await Example({
              id: "ex-validated",
              title: "Editor with a required field",
              description:
                "The editor is a native form, so required + type=\"email\" are enforced by the browser before the PUT ever fires.",
              narrative: (
                <p>
                  Because Save is a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">type="submit"</code>{" "}
                  button inside a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>,
                  native constraint validation runs first: an empty required
                  field or a malformed email blocks submission with the
                  browser's own message, and htmx never sends the request.
                  Zero extra code.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Client-side form validation",
                  href: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation",
                },
                {
                  source: "htmx",
                  label: "hx-put",
                  href: "https://htmx.org/attributes/hx-put/",
                },
              ],
              preview: (
                <EditInPlaceForm
                  id="ex-eip-edit"
                  putHref="/edit-in-place/user"
                  cancelHref="/edit-in-place/user"
                  fields={userFields()}
                />
              ),
              jsx: `<EditInPlaceForm id="user" putHref="/users/1" cancelHref="/users/1" fields={[
  { label: "Name",  value: user.name, required: true },
  { label: "Email", value: user.email, type: "email", required: true },
]} />`,
              jinja: `{{ edit_in_place_form(put_href="/users/1", cancel_href="/users/1", id="user", fields=[
     {"label": "Name",  "value": user.name, "required": true},
     {"label": "Email", "value": user.email, "type": "email", "required": true},
]) }}`,
              go: `{{template "edit_in_place_form" (dict "ID" "user"
  "PutHref" "/users/1" "CancelHref" "/users/1" "Fields" $fields)}}`,
              phoenix: `<.edit_in_place_form id="user" put_href={~p"/users/1"} cancel_href={~p"/users/1"} fields={[
  %{label: "Name", value: @user.name, name: "name", required: true},
  %{label: "Email", value: @user.email, name: "email", type: "email", required: true}
]} />`,
            })}
          </section>

          <ApiTable title="Edit In Place" rows={EDIT_IN_PLACE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ── htmx demo endpoints ─────────────────────────────────────────────────
// GET view, GET edit form, PUT update — the REST trio from the htmx
// edit-in-place pattern. The page demo wires Edit → /user/edit, Save →
// PUT /user, Cancel → /user.

editInPlaceRoutes.get("/user", (c) =>
  c.html(
    <EditInPlace id="ex-eip-user" editHref="/edit-in-place/user/edit" fields={userFields()} />,
  ),
)

editInPlaceRoutes.get("/user/edit", (c) =>
  c.html(
    <EditInPlaceForm
      id="ex-eip-user"
      putHref="/edit-in-place/user"
      cancelHref="/edit-in-place/user"
      fields={userFields()}
    />,
  ),
)

editInPlaceRoutes.put("/user", async (c) => {
  const body = await c.req.parseBody()
  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  if (name) demoUser.name = name
  if (email) demoUser.email = email
  return c.html(
    <EditInPlace id="ex-eip-user" editHref="/edit-in-place/user/edit" fields={userFields()} />,
  )
})
