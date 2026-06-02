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
import { SPLIT_BUTTON_PROPS } from "@/app/data/api-rows"
import {
  SplitButton,
  SplitButtonMenu,
  SplitButtonItem,
} from "@/registry/ui/split-button"

export const splitButtonRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/split-button.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/split-button.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/split-button.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/split_button.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/split-button.html"), "utf8"),
  ])

const usageJsx = `import { SplitButton, SplitButtonMenu, SplitButtonItem }
  from "@/components/ui/split-button"

<SplitButton label="Save" menuId="save-actions" hx-post="/save" />
<SplitButtonMenu id="save-actions">
  <SplitButtonItem hx-post="/save-draft">Save draft</SplitButtonItem>
  <SplitButtonItem hx-post="/save-template">Save as template</SplitButtonItem>
</SplitButtonMenu>`

const usageJinja = `{% from "components/split-button.html" import
   split_button, split_button_menu_open, split_button_menu_close,
   split_button_item %}

{{ split_button("Save", menu_id="save-actions", hx_post="/save") }}
{{ split_button_menu_open(id="save-actions") }}
  {{ split_button_item("Save draft", hx_post="/save-draft") }}
  {{ split_button_item("Save as template", hx_post="/save-template") }}
{{ split_button_menu_close() }}`

const usageGo = `{{template "split_button" (dict "Label" "Save" "MenuID" "save-actions")}}
{{template "split_button_menu" (dict "ID" "save-actions" "Body" (htmlSafe \`
  {{template "split_button_item" (dict "Label" "Save draft")}}
  {{template "split_button_item" (dict "Label" "Save as template")}}\`))}}`

const usagePhoenix = `<.split_button label="Save" menu_id="save-actions" hx-post="/save">
  <:menu>
    <.split_button_item hx-post="/save-draft">Save draft</.split_button_item>
    <.split_button_item hx-post="/save-template">Save as template</.split_button_item>
  </:menu>
</.split_button>`

const usageHtml = `<div data-slot="split-button" class="inline-flex items-stretch rounded-md …">
  <button data-slot="split-button-action" class="… rounded-l-md rounded-r-none">Save</button>
  <button popovertarget="save-actions" aria-haspopup="menu" aria-expanded="false"
          data-slot="split-button-toggle" class="… rounded-r-md rounded-l-none">▾</button>
</div>
<ul id="save-actions" popover="auto" role="menu" data-slot="dropdown-menu" class="…">
  <li role="none" class="contents"><button role="menuitem" tabindex="-1"
      data-slot="split-button-item">Save draft</button></li>
</ul>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Default + menu", nested: true },
  { href: "#ex-variants", label: "Variants & sizes", nested: true },
  { href: "#api", label: "API Reference" },
]

splitButtonRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/split-button.json`

  return page(
    c,
    <Layout title="Split Button — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/split-button" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Split Button</h1>
            <p class="text-muted-foreground">
              A primary action joined to a disclosure toggle that reveals
              related secondary actions. Unlike a dropdown menu, the main
              button does something on its own — the menu is just the
              alternatives. Native Popover API + the APG menu keyboard
              contract.
            </p>
          </header>

          <section class="space-y-4">
            <h2
              id="installation"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Installation
            </h2>
            <LangTabs
              id="install-split-button"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/split-button.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/split-button.html",
                    source: jinjaSource,
                    note: "Copy split-button.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/split-button.tmpl",
                    source: goSource,
                    note: "Add split-button.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/split_button.ex",
                    source: phoenixSource,
                    note: "Drop split_button.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/split-button.html",
                    source: htmlSource,
                    note: "Paste the markup; relies only on theme tokens.",
                  }),
                },
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
              id: "ex-basic",
              title: "Default action + secondary menu",
              description:
                "Click 'Save' to run the default action. Click the ▾ toggle to open related actions — ↑/↓ cycle, Home/End jump, ESC closes, Enter activates, type a letter to jump.",
              narrative: (
                <p>
                  A split button is a default action welded to a disclosure.
                  The primary{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    &lt;button&gt;
                  </code>{" "}
                  carries your htmx attributes and fires on its own click; the
                  toggle carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    aria-haspopup="menu"
                  </code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    popovertarget
                  </code>{" "}
                  and opens a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    role="menu"
                  </code>{" "}
                  popup. The popup reuses the dropdown-menu keyboard contract
                  from site.js, and a small split-button block mirrors its open
                  state onto the toggle's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    aria-expanded
                  </code>
                  .
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Menu button pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/",
                },
                {
                  source: "MDN",
                  label: "Popover API",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",
                },
                {
                  source: "MDN",
                  label: "aria-haspopup",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <SplitButton label="Save" menuId="ex-sb-1" />
                  <SplitButtonMenu id="ex-sb-1">
                    <SplitButtonItem>Save draft</SplitButtonItem>
                    <SplitButtonItem>Save as template</SplitButtonItem>
                    <SplitButtonItem>Save and close</SplitButtonItem>
                  </SplitButtonMenu>
                </div>
              ),
              jsx: `<SplitButton label="Save" menuId="save-actions" hx-post="/save" />
<SplitButtonMenu id="save-actions">
  <SplitButtonItem hx-post="/save-draft">Save draft</SplitButtonItem>
  <SplitButtonItem hx-post="/save-template">Save as template</SplitButtonItem>
  <SplitButtonItem hx-post="/save-close">Save and close</SplitButtonItem>
</SplitButtonMenu>`,
              jinja: `{{ split_button("Save", menu_id="save-actions", hx_post="/save") }}
{{ split_button_menu_open(id="save-actions") }}
  {{ split_button_item("Save draft", hx_post="/save-draft") }}
  {{ split_button_item("Save as template", hx_post="/save-template") }}
{{ split_button_menu_close() }}`,
              go: `{{template "split_button" (dict "Label" "Save" "MenuID" "save-actions")}}
{{template "split_button_menu" (dict "ID" "save-actions" "Body" (htmlSafe \`
  {{template "split_button_item" (dict "Label" "Save draft")}}\`))}}`,
              phoenix: `<.split_button label="Save" menu_id="save-actions" hx-post="/save">
  <:menu>
    <.split_button_item hx-post="/save-draft">Save draft</.split_button_item>
    <.split_button_item hx-post="/save-template">Save as template</.split_button_item>
  </:menu>
</.split_button>`,
            })}

            {await Example({
              id: "ex-variants",
              title: "Variants & sizes",
              description:
                "Secondary and outline skins, plus the small / default / large sizes. The toggle stays square and tracks the action's height.",
              narrative: (
                <p>
                  Every segment shares one visual skin, so the joined control
                  reads as a single unit. The hairline divider tints the
                  foreground on filled variants and falls back to the shared{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    border
                  </code>{" "}
                  on the outline variant. A destructive secondary action still
                  needs its own confirmation (a Dialog or htmx{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    hx-confirm
                  </code>
                  ).
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
                <div class="flex flex-wrap items-center justify-center gap-4">
                  <SplitButton
                    label="Publish"
                    menuId="ex-sb-2"
                    variant="secondary"
                    size="sm"
                  />
                  <SplitButtonMenu id="ex-sb-2">
                    <SplitButtonItem>Schedule…</SplitButtonItem>
                    <SplitButtonItem variant="destructive">
                      Discard…
                    </SplitButtonItem>
                  </SplitButtonMenu>

                  <SplitButton
                    label="Export"
                    menuId="ex-sb-3"
                    variant="outline"
                    size="lg"
                  />
                  <SplitButtonMenu id="ex-sb-3">
                    <SplitButtonItem>Export as CSV</SplitButtonItem>
                    <SplitButtonItem>Export as JSON</SplitButtonItem>
                  </SplitButtonMenu>
                </div>
              ),
              jsx: `<SplitButton label="Publish" menuId="m1" variant="secondary" size="sm" />
<SplitButtonMenu id="m1">
  <SplitButtonItem>Schedule…</SplitButtonItem>
  <SplitButtonItem variant="destructive" hx-delete="/post/1"
    hx-confirm="Discard this draft?">Discard…</SplitButtonItem>
</SplitButtonMenu>

<SplitButton label="Export" menuId="m2" variant="outline" size="lg" />`,
              jinja: `{{ split_button("Publish", menu_id="m1", variant="secondary", size="sm") }}
{{ split_button_menu_open(id="m1") }}
  {{ split_button_item("Schedule…") }}
  {{ split_button_item("Discard…", variant="destructive") }}
{{ split_button_menu_close() }}`,
              go: `{{template "split_button" (dict "Label" "Publish" "MenuID" "m1" "Variant" "secondary" "Size" "sm")}}`,
              phoenix: `<.split_button label="Publish" menu_id="m1" variant="secondary" size="sm">
  <:menu>
    <.split_button_item>Schedule…</.split_button_item>
    <.split_button_item variant="destructive">Discard…</.split_button_item>
  </:menu>
</.split_button>`,
            })}
          </section>

          <ApiTable title="<SplitButton>" rows={SPLIT_BUTTON_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
