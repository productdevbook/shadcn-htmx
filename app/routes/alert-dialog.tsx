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
import { ALERT_DIALOG_PROPS } from "@/app/data/api-rows"
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/registry/ui/alert-dialog"
import { Button } from "@/registry/ui/button"

export const alertDialogRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/alert-dialog.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/alert-dialog.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/alert-dialog.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/alert_dialog.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/alert-dialog.html"), "utf8"),
  ])

const usageJsx = `import { AlertDialog, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
  AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

<AlertDialogTrigger dialogFor="confirm">
  <Button variant="destructive">Delete</Button>
</AlertDialogTrigger>

<AlertDialog id="confirm">
  <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel><Button variant="outline" autofocus>Cancel</Button></AlertDialogCancel>
    <AlertDialogAction><Button variant="destructive">Delete</Button></AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>`

const usageJinja = `{% from "components/alert-dialog.html" import alert_dialog, alert_dialog_trigger %}

{{ alert_dialog_trigger("Delete", dialog_for="confirm",
                        class_="…destructive button classes…") }}

{% call alert_dialog(id="confirm", title="Are you absolutely sure?",
                     description="This action cannot be undone.") %}
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Cancel</button>
    <button type="button" data-dialog-close="true" hx-post="/items/42">Delete</button>
  </div>
{% endcall %}`

const usageGo = `{{template "alert_dialog_trigger" (dict
  "Label" "Delete" "DialogFor" "confirm" "Class" "…button classes…")}}

{{template "alert_dialog" (dict
  "ID" "confirm" "Title" "Are you absolutely sure?"
  "Description" "This action cannot be undone."
  "Body" (htmlSafe \`<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Cancel</button>
    <button type="button" data-dialog-close="true" hx-post="/items/42">Delete</button>
  </div>\`)
)}}`

const usagePhoenix = `<.alert_dialog_trigger dialog_for="confirm" class="…destructive-btn…">
  Delete
</.alert_dialog_trigger>

<.alert_dialog id="confirm" title="Are you absolutely sure?"
               description="This action cannot be undone.">
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Cancel</button>
    <button type="button" data-dialog-close="true"
            hx-post={~p"/items/\#{@item.id}"}>Delete</button>
  </div>
</.alert_dialog>`

const usageHtml = `<button data-dialog-trigger="true" data-dialog-target="confirm"
        aria-haspopup="dialog">Delete</button>

<dialog id="confirm" closedby="closerequest" role="alertdialog"
        aria-labelledby="confirm-title" aria-describedby="confirm-description"
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 …">
  <h2 id="confirm-title">Are you absolutely sure?</h2>
  <p id="confirm-description">This action cannot be undone.</p>
  <button data-dialog-close="true" autofocus>Cancel</button>
  <button data-dialog-close="true">Delete</button>
</dialog>

<script>/* open/close wiring — see snippets/alert-dialog.html */</script>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-confirm", label: "Confirm a destructive action", nested: true },
  { href: "#ex-htmx", label: "htmx — confirm then mutate", nested: true },
  { href: "#api", label: "API Reference" },
]

alertDialogRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/alert-dialog.json`

  return page(
    c,
    <Layout title="alert-dialog — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/alert-dialog" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">alert-dialog</h1>
            <p class="text-muted-foreground">
              A modal that interrupts the user to confirm a consequential
              action. Built on the native HTML{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;dialog&gt;</code>{" "}
              with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="alertdialog"</code>.
              Unlike Dialog it is not light-dismissible — clicking the backdrop
              does nothing; the user must pick Cancel or the confirming action.
            </p>
          </header>

          <section class="space-y-4">
            <h2
              id="installation"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              Reuses the Dialog open/close wiring in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">public/site.js</code>{" "}
              (the delegated{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">data-dialog-trigger</code>{" "}/{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">data-dialog-close</code>{" "}
              handler). No backdrop-click closer is attached.
            </p>
            <LangTabs
              id="install-alert-dialog"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/alert-dialog.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/alert-dialog.html", source: jinjaSource, note: "Copy alert-dialog.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/alert-dialog.tmpl", source: goSource, note: "Add alert-dialog.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/alert_dialog.ex", source: phoenixSource, note: "Drop alert_dialog.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/alert-dialog.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2
              id="examples"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Examples
            </h2>

            {await Example({
              id: "ex-confirm",
              title: "Confirm a destructive action",
              description:
                "Click the trigger. The alert dialog traps focus and dims the background. ESC and Cancel close it — a backdrop click does NOT.",
              narrative: (
                <p>
                  An{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">alertdialog</code>{" "}
                  is a modal dialog that demands a response. The browser's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">showModal()</code>{" "}
                  gives us the focus trap, ESC handling and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-modal</code>;
                  we set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="alertdialog"</code>{" "}
                  plus the required{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>.
                  We pin{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">closedby="closerequest"</code>{" "}
                  so the backdrop is inert — the user must choose Cancel or
                  Delete. APG recommends focusing the least-destructive action,
                  so Cancel carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">autofocus</code>.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Alert and Message Dialogs pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/",
                },
                {
                  source: "MDN",
                  label: "<dialog closedby>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby",
                },
                {
                  source: "MDN",
                  label: "HTMLDialogElement.showModal()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <AlertDialogTrigger dialogFor="ex-confirm-dlg">
                    <Button variant="destructive">Delete account…</Button>
                  </AlertDialogTrigger>
                  <p class="text-xs text-muted-foreground">
                    ESC or Cancel close it. The backdrop does nothing.
                  </p>
                </div>
              ),
              jsx: `<AlertDialogTrigger dialogFor="confirm">
  <Button variant="destructive">Delete account…</Button>
</AlertDialogTrigger>

<AlertDialog id="confirm">
  <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This permanently deletes your account and removes your data.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel><Button variant="outline" autofocus>Cancel</Button></AlertDialogCancel>
    <AlertDialogAction><Button variant="destructive">Delete</Button></AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>`,
              jinja: `{{ alert_dialog_trigger("Delete account…", dialog_for="confirm",
                        class_="…destructive button classes…") }}

{% call alert_dialog(id="confirm", title="Are you absolutely sure?",
                     description="This permanently deletes your account.") %}
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus class="…">Cancel</button>
    <button type="button" data-dialog-close="true" class="…">Delete</button>
  </div>
{% endcall %}`,
              go: `{{template "alert_dialog_trigger" (dict
  "Label" "Delete account…" "DialogFor" "confirm" "Class" "…btn classes…")}}

{{template "alert_dialog" (dict
  "ID" "confirm" "Title" "Are you absolutely sure?"
  "Description" "This permanently deletes your account."
  "Body" (htmlSafe \`<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Cancel</button>
    <button type="button" data-dialog-close="true">Delete</button>
  </div>\`)
)}}`,
              phoenix: `<.alert_dialog_trigger dialog_for="confirm" class="…destructive-button…">
  Delete account…
</.alert_dialog_trigger>

<.alert_dialog id="confirm" title="Are you absolutely sure?"
               description="This permanently deletes your account.">
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Cancel</button>
    <button type="button" data-dialog-close="true">Delete</button>
  </div>
</.alert_dialog>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — confirm, then mutate",
              description:
                "The confirming action fires an htmx request and closes the dialog. Cancel just closes; no request is sent.",
              narrative: (
                <p>
                  The confirming button is a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;button&gt;</code>{" "}
                  carrying both{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-post</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-dialog-close</code>:
                  htmx sends the request and the shared site.js handler calls{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.close()</code>{" "}
                  on the dialog. Because there is no backdrop dismissal, a user
                  can't accidentally miss the prompt by clicking away.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-post",
                  href: "https://htmx.org/attributes/hx-post/",
                },
                {
                  source: "APG",
                  label: "Alert and Message Dialogs pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <AlertDialogTrigger dialogFor="ex-htmx-dlg">
                    <Button variant="destructive">Discard draft…</Button>
                  </AlertDialogTrigger>
                  <div id="ad-htmx-status" class="text-xs text-muted-foreground">
                    No action taken yet.
                  </div>
                </div>
              ),
              jsx: `<AlertDialogTrigger dialogFor="discard">
  <Button variant="destructive">Discard draft…</Button>
</AlertDialogTrigger>

<AlertDialog id="discard">
  <AlertDialogHeader>
    <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
    <AlertDialogDescription>
      Your unsaved changes will be lost. This cannot be undone.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel><Button variant="outline" autofocus>Keep editing</Button></AlertDialogCancel>
    <AlertDialogAction>
      <Button variant="destructive"
              hx-post="/drafts/42/discard" hx-target="#status" hx-swap="innerHTML">
        Discard
      </Button>
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>`,
              jinja: `{% call alert_dialog(id="discard", title="Discard this draft?",
                     description="Your unsaved changes will be lost.") %}
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Keep editing</button>
    <button type="button" data-dialog-close="true"
            hx-post="/drafts/42/discard" hx-target="#status" hx-swap="innerHTML">
      Discard
    </button>
  </div>
{% endcall %}`,
              go: `{{template "alert_dialog" (dict
  "ID" "discard" "Title" "Discard this draft?"
  "Description" "Your unsaved changes will be lost."
  "Body" (htmlSafe \`<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Keep editing</button>
    <button type="button" data-dialog-close="true"
            hx-post="/drafts/42/discard" hx-target="#status" hx-swap="innerHTML">Discard</button>
  </div>\`)
)}}`,
              phoenix: `<.alert_dialog id="discard" title="Discard this draft?"
               description="Your unsaved changes will be lost.">
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" data-dialog-close="true" autofocus>Keep editing</button>
    <button type="button" data-dialog-close="true"
            hx-post={~p"/drafts/\#{@id}/discard"} hx-target="#status" hx-swap="innerHTML">
      Discard
    </button>
  </div>
</.alert_dialog>`,
            })}
          </section>

          {/* Demo alert dialogs rendered once at the page bottom so triggers
              above can target them by id. */}
          <AlertDialog id="ex-confirm-dlg">
            <AlertDialogHeader>
              <AlertDialogTitle id="ex-confirm-dlg-title">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription id="ex-confirm-dlg-description">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button variant="outline" autofocus>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Button variant="destructive">Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialog>

          <AlertDialog id="ex-htmx-dlg">
            <AlertDialogHeader>
              <AlertDialogTitle id="ex-htmx-dlg-title">
                Discard this draft?
              </AlertDialogTitle>
              <AlertDialogDescription id="ex-htmx-dlg-description">
                Your unsaved changes will be lost. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button variant="outline" autofocus>
                  Keep editing
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Button
                  variant="destructive"
                  hx-post="/docs/alert-dialog/discard"
                  hx-target="#ad-htmx-status"
                  hx-swap="innerHTML"
                >
                  Discard
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialog>

          <ApiTable title="<AlertDialog>" rows={ALERT_DIALOG_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx endpoint the "confirm then mutate" demo posts to.
alertDialogRoutes.post("/discard", (c) =>
  c.html(
    <span class="text-emerald-700 dark:text-emerald-300">
      Draft discarded.
    </span>,
  ),
)
