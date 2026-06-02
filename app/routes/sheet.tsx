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
import { SHEET_PROPS } from "@/app/data/api-rows"
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/registry/ui/sheet"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { Label } from "@/registry/ui/label"

export const sheetRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/sheet.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/sheet.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/sheet.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/sheet.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/sheet.html"), "utf8"),
  ])

const usageJsx = `import { Sheet, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter, SheetClose, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<SheetTrigger sheetFor="nav">
  <Button variant="outline">Open menu</Button>
</SheetTrigger>

<Sheet id="nav" side="left">
  <SheetHeader>
    <SheetTitle>Navigation</SheetTitle>
    <SheetDescription>Jump to a section.</SheetDescription>
  </SheetHeader>
  <SheetBody>…links…</SheetBody>
  <SheetFooter>
    <SheetClose><Button variant="outline">Close</Button></SheetClose>
  </SheetFooter>
</Sheet>`

const usageJinja = `{% from "components/sheet.html" import sheet, sheet_trigger %}

{{ sheet_trigger("Open menu", sheet_for="nav",
                 class_="…outline button classes…") }}

{% call sheet(id="nav", side="left", title="Navigation",
              description="Jump to a section.") %}
  <div data-slot="sheet-body" class="flex-1 overflow-y-auto text-sm text-foreground">
    …links…
  </div>
  <div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2">
    <button type="button" data-dialog-close="true">Close</button>
  </div>
{% endcall %}`

const usageGo = `{{template "sheet_trigger" (dict
  "Label" "Open menu" "SheetFor" "nav" "Class" "…button classes…")}}

{{template "sheet" (dict
  "ID" "nav" "Side" "left" "Title" "Navigation"
  "Description" "Jump to a section."
  "Body" (htmlSafe \`<div data-slot="sheet-body" class="flex-1 overflow-y-auto text-sm text-foreground">…</div>
    <div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2">
      <button type="button" data-dialog-close="true">Close</button>
    </div>\`)
)}}`

const usagePhoenix = `<.sheet_trigger sheet_for="nav" class="…outline-button…">
  Open menu
</.sheet_trigger>

<.sheet id="nav" side="left" title="Navigation"
        description="Jump to a section.">
  <div data-slot="sheet-body" class="flex-1 overflow-y-auto text-sm text-foreground">
    …links…
  </div>
  <div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2">
    <button type="button" data-dialog-close="true">Close</button>
  </div>
</.sheet>`

const usageHtml = `<button data-dialog-trigger="true" data-dialog-target="nav">Open menu</button>

<dialog id="nav" data-slot="sheet" data-side="left" closedby="any"
        class="fixed z-50 m-0 flex flex-col gap-4 … inset-y-0 left-0 right-auto h-full w-3/4 max-w-sm border-r">
  <h2>Navigation</h2>
  <p>Jump to a section.</p>
  <button data-dialog-close="true">Close</button>
</dialog>

<script>/* see snippets/sheet.html for the open/close wiring */</script>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Side drawer", nested: true },
  { href: "#ex-sides", label: "Four edges", nested: true },
  { href: "#ex-htmx", label: "htmx — stream the body", nested: true },
  { href: "#api", label: "API Reference" },
]

sheetRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/sheet.json`

  return page(
    c,
    <Layout title="Sheet — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/sheet" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Sheet</h1>
            <p class="text-muted-foreground">
              An edge-anchored slide-in drawer built on the native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;dialog&gt;</code>{" "}
              element. Same{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">showModal()</code>{" "}
              top-layer, focus trap, ESC and{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">::backdrop</code>{" "}
              as Dialog — just pinned to the left, right, top or bottom edge.
              Light dismiss is the native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">closedby="any"</code>{" "}
              attribute, no extra JS.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              A Sheet is a <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;dialog data-slot="sheet"&gt;</code>;
              it reuses Dialog's trigger / close wiring in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">public/site.js</code>{" "}
              — no new script. The slide-in animation lives in your stylesheet.
            </p>
            <LangTabs
              id="install-sheet"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/sheet.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/sheet.html", source: jinjaSource, note: "Copy sheet.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/sheet.tmpl", source: goSource, note: "Add sheet.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/sheet.ex", source: phoenixSource, note: "Drop sheet.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/sheet.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Side drawer — slides in from the right",
              description:
                "Click the trigger. The drawer slides in from the edge, traps focus and dims the page. ESC, the backdrop, the X, or Close all dismiss it.",
              narrative: (
                <p>
                  A Sheet is the same native modal as Dialog —{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">showModal()</code>{" "}
                  gives us the focus trap, ESC handling, focus restoration and a
                  real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">::backdrop</code>{" "}
                  — but anchored to a viewport edge instead of centred. Clicking
                  the dim area closes it through the native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">closedby="any"</code>{" "}
                  attribute, so we don't ship any backdrop-click JS for it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "HTMLDialogElement.showModal()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal",
                },
                {
                  source: "MDN",
                  label: "HTMLDialogElement.closedBy",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy",
                },
                {
                  source: "APG",
                  label: "Dialog (Modal) pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <SheetTrigger sheetFor="ex-basic-sheet">
                    <Button variant="outline">Open settings…</Button>
                  </SheetTrigger>
                  <p class="text-xs text-muted-foreground">
                    Try ESC, the X, the dim backdrop, or Close — all dismiss it.
                  </p>
                </div>
              ),
              jsx: `<SheetTrigger sheetFor="settings">
  <Button variant="outline">Open settings…</Button>
</SheetTrigger>

<Sheet id="settings" side="right">
  <SheetHeader>
    <SheetTitle>Settings</SheetTitle>
    <SheetDescription>Manage your preferences.</SheetDescription>
  </SheetHeader>
  <SheetBody class="grid gap-3 py-4">
    <Label htmlFor="name">Display name</Label>
    <Input id="name" name="name" value="Mehmet" />
  </SheetBody>
  <SheetFooter>
    <SheetClose><Button variant="outline">Close</Button></SheetClose>
    <Button>Save</Button>
  </SheetFooter>
</Sheet>`,
              jinja: `{{ sheet_trigger("Open settings…", sheet_for="settings",
                 class_="…outline button classes…") }}

{% call sheet(id="settings", side="right", title="Settings",
              description="Manage your preferences.") %}
  <div data-slot="sheet-body" class="flex-1 overflow-y-auto py-4 text-sm text-foreground">
    {{ label("Display name", for_="name") }}
    {{ input(id="name", name="name", value="Mehmet") }}
  </div>
  <div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2">
    <button type="button" data-dialog-close="true">Close</button>
    <button type="submit">Save</button>
  </div>
{% endcall %}`,
              go: `{{template "sheet_trigger" (dict
  "Label" "Open settings…" "SheetFor" "settings" "Class" "…btn classes…")}}

{{template "sheet" (dict
  "ID" "settings" "Side" "right" "Title" "Settings"
  "Description" "Manage your preferences."
  "Body" (htmlSafe \`<div data-slot="sheet-body" class="flex-1 overflow-y-auto py-4 text-sm text-foreground">…</div>
    <div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2">
      <button type="button" data-dialog-close="true">Close</button>
      <button type="submit">Save</button>
    </div>\`)
)}}`,
              phoenix: `<.sheet_trigger sheet_for="settings" class="…outline-button…">
  Open settings…
</.sheet_trigger>

<.sheet id="settings" side="right" title="Settings"
        description="Manage your preferences.">
  <div data-slot="sheet-body" class="flex-1 overflow-y-auto py-4 text-sm text-foreground">
    <.label for="name">Display name</.label>
    <.input id="name" name="name" value={@name} />
  </div>
  <div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2">
    <button type="button" data-dialog-close="true">Close</button>
    <button type="submit">Save</button>
  </div>
</.sheet>`,
            })}

            {await Example({
              id: "ex-sides",
              title: "Four edges — left, right, top, bottom",
              description:
                "The same component slides in from any edge. side picks the anchor; side drawers fill the cross-axis, top/bottom sheets size to content.",
              narrative: (
                <p>
                  Only the anchoring classes change between sides — the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">side</code>{" "}
                  prop swaps{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">inset-y-0 right-0</code>{" "}
                  for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">inset-x-0 bottom-0</code>{" "}
                  and so on. The slide direction is driven by{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-side</code>{" "}
                  in CSS, so a left sheet enters from the left and a bottom sheet
                  rises from below.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<dialog> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog",
                },
                {
                  source: "Tailwind",
                  label: "inset / inset-x / inset-y",
                  href: "https://tailwindcss.com/docs/top-right-bottom-left",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <SheetTrigger sheetFor="ex-side-left">
                    <Button variant="outline" size="sm">Left</Button>
                  </SheetTrigger>
                  <SheetTrigger sheetFor="ex-side-top">
                    <Button variant="outline" size="sm">Top</Button>
                  </SheetTrigger>
                  <SheetTrigger sheetFor="ex-side-bottom">
                    <Button variant="outline" size="sm">Bottom</Button>
                  </SheetTrigger>
                </div>
              ),
              jsx: `<SheetTrigger sheetFor="left"><Button>Left</Button></SheetTrigger>
<Sheet id="left" side="left">…</Sheet>

<SheetTrigger sheetFor="top"><Button>Top</Button></SheetTrigger>
<Sheet id="top" side="top">…</Sheet>

<SheetTrigger sheetFor="bottom"><Button>Bottom</Button></SheetTrigger>
<Sheet id="bottom" side="bottom">…</Sheet>`,
              jinja: `{{ sheet_trigger("Left", sheet_for="left") }}
{% call sheet(id="left", side="left", title="Left") %}…{% endcall %}

{{ sheet_trigger("Bottom", sheet_for="bottom") }}
{% call sheet(id="bottom", side="bottom", title="Bottom") %}…{% endcall %}`,
              go: `{{template "sheet_trigger" (dict "Label" "Left" "SheetFor" "left")}}
{{template "sheet" (dict "ID" "left" "Side" "left" "Title" "Left" "Body" …)}}

{{template "sheet_trigger" (dict "Label" "Bottom" "SheetFor" "bottom")}}
{{template "sheet" (dict "ID" "bottom" "Side" "bottom" "Title" "Bottom" "Body" …)}}`,
              phoenix: `<.sheet_trigger sheet_for="left">Left</.sheet_trigger>
<.sheet id="left" side="left" title="Left">…</.sheet>

<.sheet_trigger sheet_for="bottom">Bottom</.sheet_trigger>
<.sheet id="bottom" side="bottom" title="Bottom">…</.sheet>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — stream the sheet body from the server",
              description:
                "The trigger doesn't pre-render the drawer. It GETs HTML, htmx swaps it into a host slot, then site.js promotes the inserted <dialog open> to a modal.",
              narrative: (
                <p>
                  Useful when the drawer needs server data (a cart, a filter
                  panel, an editable record).{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>{" "}
                  fetches the markup,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target="#sheet-host"</code>{" "}
                  drops it into a slot, and the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmx:after:swap</code>{" "}
                  listener in site.js strips the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">open</code>{" "}
                  attribute and calls{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.showModal()</code>{" "}
                  so the focus trap and backdrop kick in — identical to Dialog.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-get",
                  href: "https://htmx.org/attributes/hx-get/",
                },
                {
                  source: "htmx",
                  label: "htmx:afterSwap event",
                  href: "https://htmx.org/events/#htmx:afterSwap",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <Button
                    variant="outline"
                    hx-get="/sheet/server-rendered"
                    hx-target="#sheet-host"
                    hx-swap="innerHTML"
                  >
                    Fetch &amp; open drawer
                  </Button>
                  <div id="sheet-host" />
                </div>
              ),
              jsx: `<Button hx-get="/api/cart" hx-target="#sheet-host" hx-swap="innerHTML">
  Open cart
</Button>
<div id="sheet-host" />

{/* The server returns <dialog data-slot="sheet" side="right" open>…</dialog>.
    site.js's htmx:after:swap listener promotes it to .showModal(). */}`,
              jinja: `<button hx-get="/api/cart" hx-target="#sheet-host" hx-swap="innerHTML">
  Open cart
</button>
<div id="sheet-host"></div>`,
              go: `<button hx-get="/api/cart" hx-target="#sheet-host" hx-swap="innerHTML">
  Open cart
</button>
<div id="sheet-host"></div>`,
              phoenix: `<button hx-get={~p"/api/cart"} hx-target="#sheet-host" hx-swap="innerHTML">
  Open cart
</button>
<div id="sheet-host"></div>`,
            })}
          </section>

          {/* Demo sheets rendered once at the page bottom so triggers above
              can target them by id. */}
          <Sheet id="ex-basic-sheet" side="right">
            <SheetHeader>
              <SheetTitle id="ex-basic-sheet-title">Settings</SheetTitle>
              <SheetDescription id="ex-basic-sheet-description">
                Manage your preferences. Changes apply immediately.
              </SheetDescription>
            </SheetHeader>
            <SheetBody class="grid gap-3 py-4">
              <div class="grid gap-2">
                <Label htmlFor="ex-basic-name">Display name</Label>
                <Input id="ex-basic-name" name="name" value="Mehmet" />
              </div>
            </SheetBody>
            <SheetFooter>
              <Button variant="outline" {...({ "data-dialog-close": "true" } as any)}>Close</Button>
              <Button {...({ "data-dialog-close": "true" } as any)}>Save</Button>
            </SheetFooter>
          </Sheet>

          <Sheet id="ex-side-left" side="left">
            <SheetHeader>
              <SheetTitle id="ex-side-left-title">Navigation</SheetTitle>
              <SheetDescription id="ex-side-left-description">
                A left drawer — handy for mobile site navigation.
              </SheetDescription>
            </SheetHeader>
            <SheetBody class="py-4">
              <nav class="grid gap-1">
                <a href="#installation" data-dialog-close="true" class="rounded-md px-2 py-1.5 hover:bg-accent">Installation</a>
                <a href="#examples" data-dialog-close="true" class="rounded-md px-2 py-1.5 hover:bg-accent">Examples</a>
                <a href="#api" data-dialog-close="true" class="rounded-md px-2 py-1.5 hover:bg-accent">API Reference</a>
              </nav>
            </SheetBody>
          </Sheet>

          <Sheet id="ex-side-top" side="top">
            <SheetHeader>
              <SheetTitle id="ex-side-top-title">Announcement</SheetTitle>
              <SheetDescription id="ex-side-top-description">
                A top sheet sizes to its content and drops in from above.
              </SheetDescription>
            </SheetHeader>
          </Sheet>

          <Sheet id="ex-side-bottom" side="bottom">
            <SheetHeader>
              <SheetTitle id="ex-side-bottom-title">Share</SheetTitle>
              <SheetDescription id="ex-side-bottom-description">
                A bottom sheet rises from the edge — common on touch devices.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter class="pt-4">
              <Button variant="outline" {...({ "data-dialog-close": "true" } as any)}>Done</Button>
            </SheetFooter>
          </Sheet>

          <ApiTable title="<Sheet>" rows={SHEET_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx endpoint that returns a fully-rendered sheet. site.js's after:swap
// listener promotes any inserted <dialog open> into a modal.
sheetRoutes.get("/server-rendered", (c) => {
  return c.html(
    <Sheet id="ex-server-sheet" side="right" open>
      <SheetHeader>
        <SheetTitle id="ex-server-sheet-title">Fetched from the server</SheetTitle>
        <SheetDescription id="ex-server-sheet-description">
          The whole drawer came back over the wire; the page now uses the modal
          focus trap automatically.
        </SheetDescription>
      </SheetHeader>
      <SheetBody class="py-4">
        Server time: <strong>{new Date().toLocaleTimeString()}</strong>
      </SheetBody>
      <SheetFooter>
        <Button variant="outline" {...({ "data-dialog-close": "true" } as any)}>Close</Button>
      </SheetFooter>
    </Sheet>,
  )
})
