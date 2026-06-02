/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { CodeBlock } from "@/app/components/code-block"
import { LangTabs } from "@/app/components/lang-tabs"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { ApiTable } from "@/app/components/api-table"
import { DIALOG_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogTrigger,
} from "@/registry/ui/dialog"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { Label } from "@/registry/ui/label"

export const dialogRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  dialogJsxSource,
  dialogJinjaSource,
  dialogGoSource,
  dialogPhoenixSource,
  dialogHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/dialog.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/dialog.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/dialog.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/dialog.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/dialog.html"), "utf8"),
])

const usageJsx = `import { Dialog, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<DialogTrigger dialogFor="confirm">
  <Button variant="destructive">Delete</Button>
</DialogTrigger>

<Dialog id="confirm">
  <DialogHeader>
    <DialogTitle>Delete item?</DialogTitle>
    <DialogDescription>This cannot be undone.</DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <DialogClose><Button variant="outline">Cancel</Button></DialogClose>
    <Button variant="destructive">Delete</Button>
  </DialogFooter>
</Dialog>`

const usageJinja = `{% from "components/dialog.html" import dialog, dialog_trigger %}

{{ dialog_trigger("Delete", dialog_for="confirm",
                  class_="…destructive button classes…") }}

{% call dialog(id="confirm", title="Delete item?",
               description="This cannot be undone.") %}
  <div class="flex justify-end gap-2">
    <button type="button" data-dialog-close="true">Cancel</button>
    <button type="button" hx-delete="/items/42">Delete</button>
  </div>
{% endcall %}`

const usageGo = `{{template "dialog_trigger" (dict
  "Label" "Delete" "DialogFor" "confirm" "Class" "…button classes…")}}

{{template "dialog" (dict
  "ID" "confirm" "Title" "Delete item?"
  "Description" "This cannot be undone."
  "Body" (htmlSafe \`<div class="flex justify-end gap-2">
    <button type="button" data-dialog-close="true">Cancel</button>
    <button type="button" hx-delete="/items/42">Delete</button>
  </div>\`)
)}}`

const usagePhoenix = `<.dialog_trigger dialog_for="confirm" class="…btn-classes…">
  Delete
</.dialog_trigger>

<.dialog id="confirm" title="Delete item?" description="This cannot be undone.">
  <div class="flex justify-end gap-2">
    <button type="button" data-dialog-close="true">Cancel</button>
    <button type="button" hx-delete={~p"/items/\#{@item.id}"}>Delete</button>
  </div>
</.dialog>`

const usageHtml = `<button data-dialog-trigger="true" data-dialog-target="confirm">Open</button>

<dialog id="confirm" data-close-on-backdrop="true"
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 …">
  <h2>Delete item?</h2>
  <p>This cannot be undone.</p>
  <button data-dialog-close="true">Cancel</button>
</dialog>

<script>/* see snippets/dialog.html for the open/close wiring */</script>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-confirm", label: "Confirm action", nested: true },
  { href: "#ex-form", label: "Form inside dialog", nested: true },
  { href: "#ex-htmx", label: "htmx — fetch + open", nested: true },
  { href: "#api", label: "API Reference" },
]

dialogRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/dialog.json`

  return page(
    c,
    <Layout title="Dialog — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/dialog" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Dialog</h1>
            <p class="text-muted-foreground">
              The native HTML{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;dialog&gt;</code>{" "}
              element + a 30-line script. Focus trap, ESC-to-close, accessible
              modal semantics — all from the platform. shadcn-htmx adds the box
              styles, the close X, and click-on-backdrop-to-close.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              The dialog itself is one element; the trigger / close wiring
              lives in <code class="rounded bg-muted px-1 py-0.5 text-xs">public/site.js</code>{" "}
              (delegated event handler — see the source).
            </p>
            <LangTabs
              id="install-dialog"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/dialog.tsx", source: dialogJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/dialog.html", source: dialogJinjaSource, note: "Copy dialog.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/dialog.tmpl", source: dialogGoSource, note: "Add dialog.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/dialog.ex", source: dialogPhoenixSource, note: "Drop dialog.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: dialogHtmlSource, note: "Include the open/close wiring script — see the source below." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-confirm",
              title: "Confirm action — destructive variant",
              description:
                "Click the trigger. The dialog opens, traps focus, dims the background. ESC, backdrop click, the X, or Cancel all close it.",
              narrative: (
                <p>
                  The browser provides everything that makes a modal a modal:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">showModal()</code>{" "}
                  traps focus inside the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;dialog&gt;</code>,
                  ESC dispatches a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">cancel</code>{" "}
                  event then closes, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">::backdrop</code>{" "}
                  is a real pseudo-element you style with CSS. We only add the
                  X button and the "clicking the backdrop closes" listener.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<dialog> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog",
                },
                {
                  source: "MDN",
                  label: "HTMLDialogElement.showModal()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal",
                },
                {
                  source: "APG",
                  label: "Dialog (Modal) pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <DialogTrigger dialogFor="ex-confirm-dlg">
                    <Button variant="destructive">Delete item…</Button>
                  </DialogTrigger>
                  <p class="text-xs text-muted-foreground">
                    Try ESC, the X, the backdrop, or Cancel — all close it.
                  </p>
                </div>
              ),
              jsx: `<DialogTrigger dialogFor="confirm">
  <Button variant="destructive">Delete item…</Button>
</DialogTrigger>

<Dialog id="confirm">
  <DialogHeader>
    <DialogTitle>Delete item?</DialogTitle>
    <DialogDescription>
      This action cannot be undone. The item will be permanently deleted.
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <DialogClose><Button variant="outline">Cancel</Button></DialogClose>
    <Button variant="destructive">Delete</Button>
  </DialogFooter>
</Dialog>`,
              jinja: `{{ dialog_trigger("Delete item…", dialog_for="confirm",
                  class_="…destructive button classes…") }}

{% call dialog(id="confirm", title="Delete item?",
               description="This action cannot be undone.") %}
  <div class="flex justify-end gap-2">
    <button type="button" data-dialog-close="true" class="…">Cancel</button>
    <button type="button" hx-delete="/items/42" class="…">Delete</button>
  </div>
{% endcall %}`,
              go: `{{template "dialog_trigger" (dict
  "Label" "Delete item…" "DialogFor" "confirm" "Class" "…btn classes…")}}

{{template "dialog" (dict
  "ID" "confirm" "Title" "Delete item?"
  "Description" "This action cannot be undone."
  "Body" (htmlSafe \`<div class="flex justify-end gap-2">
    <button type="button" data-dialog-close="true">Cancel</button>
    <button type="button" hx-delete="/items/42">Delete</button>
  </div>\`)
)}}`,
              phoenix: `<.dialog_trigger dialog_for="confirm" class="…destructive-button…">
  Delete item…
</.dialog_trigger>

<.dialog id="confirm" title="Delete item?"
         description="This action cannot be undone.">
  <div class="flex justify-end gap-2">
    <button type="button" data-dialog-close="true">Cancel</button>
    <button type="button" hx-delete={~p"/items/\#{@item.id}"}>Delete</button>
  </div>
</.dialog>`,
            })}

            {await Example({
              id: "ex-form",
              title: "Form inside a dialog",
              description:
                "Inputs inherit the dialog's focus trap. Submitting the form runs the action; Esc cancels.",
              narrative: (
                <p>
                  A dialog can host a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>{" "}
                  — submit it via htmx and either close the dialog
                  (server returns 204, you close manually) or swap content
                  inside the dialog (server returns the updated body).
                  When the user hits Tab inside a modal dialog, focus cycles
                  within it; when they hit Esc, the browser fires{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">cancel</code>{" "}
                  and closes.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<form method=\"dialog\">",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#method",
                },
                {
                  source: "WCAG",
                  label: "2.4.3 Focus Order",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <DialogTrigger dialogFor="ex-form-dlg">
                    <Button variant="outline">Edit profile…</Button>
                  </DialogTrigger>
                </div>
              ),
              jsx: `<DialogTrigger dialogFor="edit-profile">
  <Button variant="outline">Edit profile…</Button>
</DialogTrigger>

<Dialog id="edit-profile">
  <DialogHeader>
    <DialogTitle>Edit profile</DialogTitle>
    <DialogDescription>Update your display name.</DialogDescription>
  </DialogHeader>
  <form hx-post="/profile" hx-target="closest dialog" hx-swap="none"
        class="grid gap-3">
    <Label htmlFor="name">Display name</Label>
    <Input id="name" name="name" defaultValue="Mehmet" autofocus />
    <DialogFooter>
      <DialogClose><Button variant="outline">Cancel</Button></DialogClose>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </form>
</Dialog>`,
              jinja: `{% call dialog(id="edit-profile", title="Edit profile",
               description="Update your display name.") %}
  <form hx-post="/profile" hx-target="closest dialog" hx-swap="none"
        class="grid gap-3">
    {{ label("Display name", for_="name") }}
    {{ input(id="name", name="name", value="Mehmet", autofocus=true) }}
    <div class="flex justify-end gap-2">
      <button type="button" data-dialog-close="true">Cancel</button>
      <button type="submit">Save</button>
    </div>
  </form>
{% endcall %}`,
              go: `{{template "dialog" (dict
  "ID" "edit-profile" "Title" "Edit profile"
  "Description" "Update your display name."
  "Body" (htmlSafe \`<form hx-post="/profile" hx-target="closest dialog" hx-swap="none">…</form>\`)
)}}`,
              phoenix: `<.dialog id="edit-profile" title="Edit profile"
         description="Update your display name.">
  <form hx-post={~p"/profile"} hx-target="closest dialog" hx-swap="none"
        class="grid gap-3">
    <.label for="name">Display name</.label>
    <.input id="name" name="name" value={@name} autofocus />
    <div class="flex justify-end gap-2">
      <button type="button" data-dialog-close="true">Cancel</button>
      <button type="submit">Save</button>
    </div>
  </form>
</.dialog>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — fetch dialog from the server",
              description:
                "The trigger does not pre-render the dialog. It GETs HTML from the server, htmx swaps the markup into a host slot, then site.js promotes it to a modal.",
              narrative: (
                <p>
                  Useful when the dialog needs server-side data (the editable
                  fields, a list to pick from, a long article).{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>{" "}
                  fetches the HTML,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target="#dlg-host"</code>{" "}
                  drops it into a slot, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx:afterSwap</code>{" "}
                  fires our promote-to-modal handler in site.js. The dialog
                  arrives with the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">open</code>{" "}
                  attribute, gets that stripped, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.showModal()</code>{" "}
                  takes over.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "htmx:afterSwap event",
                  href: "https://htmx.org/events/#htmx:afterSwap",
                },
                {
                  source: "MDN",
                  label: "HTMLDialogElement.close()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <Button
                    variant="outline"
                    hx-get="/dialog/server-rendered"
                    hx-target="#dlg-host"
                    hx-swap="innerHTML"
                  >
                    Fetch &amp; open dialog
                  </Button>
                  <div id="dlg-host" />
                </div>
              ),
              jsx: `<Button hx-get="/api/dialog" hx-target="#dlg-host" hx-swap="innerHTML">
  Fetch & open
</Button>
<div id="dlg-host" />

{/* The server returns <dialog id="…" open>…</dialog>. site.js's
    htmx:afterSwap listener promotes it to .showModal(). */}`,
              jinja: `<button hx-get="/api/dialog" hx-target="#dlg-host" hx-swap="innerHTML">
  Fetch &amp; open
</button>
<div id="dlg-host"></div>`,
              go: `<button hx-get="/api/dialog" hx-target="#dlg-host" hx-swap="innerHTML">
  Fetch &amp; open
</button>
<div id="dlg-host"></div>`,
              phoenix: `<button hx-get={~p"/api/dialog"} hx-target="#dlg-host" hx-swap="innerHTML">
  Fetch &amp; open
</button>
<div id="dlg-host"></div>`,
            })}
          </section>

          {/* Demo dialogs rendered once at the page bottom so triggers above
              can target them by id. */}
          <Dialog id="ex-confirm-dlg">
            <DialogHeader>
              <DialogTitle id="ex-confirm-dlg-title">Delete item?</DialogTitle>
              <DialogDescription id="ex-confirm-dlg-description">
                This action cannot be undone. The item will be permanently
                removed from your library.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              You're about to delete <strong>Untitled draft</strong>.
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" {...({ "data-dialog-close": "true" } as any)}>Cancel</Button>
              <Button variant="destructive" {...({ "data-dialog-close": "true" } as any)}>Delete</Button>
            </DialogFooter>
          </Dialog>

          <Dialog id="ex-form-dlg">
            <DialogHeader>
              <DialogTitle id="ex-form-dlg-title">Edit profile</DialogTitle>
              <DialogDescription id="ex-form-dlg-description">
                Update your display name. Changes are saved immediately.
              </DialogDescription>
            </DialogHeader>
            <form
              class="grid gap-3"
              hx-post="/dialog/save-profile"
              hx-target="this"
              hx-swap="outerHTML"
            >
              <div class="grid gap-2">
                <Label htmlFor="ex-form-name">Display name</Label>
                <Input id="ex-form-name" name="name" value="Mehmet" />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" {...({ "data-dialog-close": "true" } as any)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Dialog>
          <ApiTable
            title="<Dialog>"
            rows={DIALOG_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx endpoint that returns a fully-rendered dialog. site.js's afterSwap
// listener promotes any inserted <dialog open> into a modal.
dialogRoutes.get("/server-rendered", (c) => {
  return c.html(
    <Dialog id="ex-server-dlg" open>
      <DialogHeader>
        <DialogTitle id="ex-server-dlg-title">Fetched from the server</DialogTitle>
        <DialogDescription id="ex-server-dlg-description">
          The whole markup came back over the wire; the page now uses the
          modal focus trap automatically.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        Current time on the server: <strong>{new Date().toLocaleTimeString()}</strong>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" {...({ "data-dialog-close": "true" } as any)}>Close</Button>
      </DialogFooter>
    </Dialog>,
  )
})

dialogRoutes.post("/save-profile", (c) =>
  c.html(
    <p class="rounded-md border bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
      Saved.
    </p>,
  ),
)
