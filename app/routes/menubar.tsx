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
import { MENUBAR_PROPS } from "@/app/data/api-rows"
import {
  Menubar,
  MenubarMenu,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
} from "@/registry/ui/menubar"

export const menubarRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/menubar.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/menubar.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/menubar.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/menubar.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/menubar.html"), "utf8"),
])

const usageJsx = `import { Menubar, MenubarMenu, MenubarItem,
  MenubarSeparator, MenubarLabel } from "@/components/ui/menubar"

<Menubar ariaLabel="Application">
  <MenubarMenu label="File" id="mb-file">
    <MenubarItem>New File</MenubarItem>
    <MenubarItem>Open…</MenubarItem>
    <MenubarSeparator />
    <MenubarItem variant="destructive">Delete project</MenubarItem>
  </MenubarMenu>
  <MenubarMenu label="Edit" id="mb-edit">
    <MenubarItem>Undo</MenubarItem>
    <MenubarItem>Redo</MenubarItem>
  </MenubarMenu>
</Menubar>`

const usageJinja = `{% from "components/menubar.html" import
   menubar_open, menubar_close, menu_open, menu_close,
   menubar_item, menubar_separator, menubar_label %}

{{ menubar_open(aria_label="Application") }}
  {{ menu_open("File", id="mb-file") }}
    {{ menubar_item("New File") }}
    {{ menubar_item("Open…") }}
    {{ menubar_separator() }}
    {{ menubar_item("Delete project", variant="destructive") }}
  {{ menu_close() }}
  {{ menu_open("Edit", id="mb-edit") }}
    {{ menubar_item("Undo") }}
    {{ menubar_item("Redo") }}
  {{ menu_close() }}
{{ menubar_close() }}`

const usageGo = `{{template "menubar" (dict "AriaLabel" "Application" "Body" (htmlSafe (printf "%s%s"
  (template "menubar_menu" (dict "Label" "File" "ID" "mb-file" "Body" (htmlSafe \`
    …items…\`)))
  (template "menubar_menu" (dict "Label" "Edit" "ID" "mb-edit" "Body" (htmlSafe \`
    …items…\`))))))}}`

const usagePhoenix = `<.menubar aria_label="Application">
  <.menubar_menu label="File" id="mb-file">
    <.menubar_item>New File</.menubar_item>
    <.menubar_item>Open…</.menubar_item>
    <.menubar_separator />
    <.menubar_item variant="destructive">Delete project</.menubar_item>
  </.menubar_menu>
  <.menubar_menu label="Edit" id="mb-edit">
    <.menubar_item>Undo</.menubar_item>
    <.menubar_item>Redo</.menubar_item>
  </.menubar_menu>
</.menubar>`

const usageHtml = `<div role="menubar" data-slot="menubar" aria-label="Application" class="…">
  <div data-slot="menubar-menu" class="contents">
    <button role="menuitem" tabindex="-1" popovertarget="mb-file"
            popovertargetaction="toggle" aria-haspopup="menu"
            aria-expanded="false" data-slot="menubar-trigger"
            data-menu-for="mb-file" class="…">File</button>
    <div id="mb-file" popover="auto" role="menu" aria-label="File"
         data-slot="menubar-content" data-side="bottom" class="…">
      <button role="menuitem" tabindex="-1" data-slot="menubar-item">New File</button>
    </div>
  </div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "App menubar + keyboard", nested: true },
  { href: "#ex-nav", label: "Navigation links", nested: true },
  { href: "#api", label: "API Reference" },
]

menubarRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/menubar.json`

  return page(
    c,
    <Layout title="Menubar — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/menubar" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Menubar</h1>
            <p class="text-muted-foreground">
              A visually-persistent, app-style horizontal bar of menus.
              Built on the native Popover API + the APG menu/menubar
              keyboard contract — arrows along the bar, ArrowDown opens a
              menu, type-to-find, ESC closes.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-menubar"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/menubar.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/menubar.html", source: jinjaSource, note: "Copy menubar.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/menubar.tmpl", source: goSource, note: "Add menubar.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/menubar.ex", source: phoenixSource, note: "Drop menubar.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/menubar.html", source: htmlSource, note: "Includes the keyboard contract script. Copy once per page; it relies only on the theme tokens in styles.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "App menubar — open a menu, then keyboard takes over",
              description:
                "Tab onto the bar, ←/→ move between menus, ↓ opens a menu and focuses its first item, ↑/↓ cycle inside it, ESC closes, Enter activates. Type a letter to jump.",
              narrative: (
                <p>
                  The menubar is a composite widget: the whole bar is a
                  single tab stop with a roving{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex</code>,
                  so{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">Tab</code>{" "}
                  enters/leaves it rather than walking each menu. Each
                  trigger is a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="menuitem"</code>{" "}
                  that opens a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">popover</code>{" "}
                  submenu, so the browser handles light-dismiss, ESC, and
                  focus restoration; site.js adds the arrow-key contract.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Menu and Menubar pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/",
                },
                {
                  source: "MDN",
                  label: "role=\"menubar\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role",
                },
                {
                  source: "MDN",
                  label: "Popover API",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <Menubar ariaLabel="Application">
                    <MenubarMenu label="File" id="ex-mb-file">
                      <MenubarLabel>File</MenubarLabel>
                      <MenubarItem>New File</MenubarItem>
                      <MenubarItem>Open…</MenubarItem>
                      <MenubarItem>Save</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem variant="destructive">Delete project</MenubarItem>
                    </MenubarMenu>
                    <MenubarMenu label="Edit" id="ex-mb-edit">
                      <MenubarItem>Undo</MenubarItem>
                      <MenubarItem>Redo</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>Cut</MenubarItem>
                      <MenubarItem>Copy</MenubarItem>
                      <MenubarItem>Paste</MenubarItem>
                    </MenubarMenu>
                    <MenubarMenu label="View" id="ex-mb-view">
                      <MenubarItem>Zoom In</MenubarItem>
                      <MenubarItem>Zoom Out</MenubarItem>
                      <MenubarItem>Reset Zoom</MenubarItem>
                    </MenubarMenu>
                  </Menubar>
                </div>
              ),
              jsx: `<Menubar ariaLabel="Application">
  <MenubarMenu label="File" id="mb-file">
    <MenubarLabel>File</MenubarLabel>
    <MenubarItem>New File</MenubarItem>
    <MenubarItem>Open…</MenubarItem>
    <MenubarSeparator />
    <MenubarItem variant="destructive">Delete project</MenubarItem>
  </MenubarMenu>
  <MenubarMenu label="Edit" id="mb-edit">
    <MenubarItem>Undo</MenubarItem>
    <MenubarItem>Redo</MenubarItem>
  </MenubarMenu>
</Menubar>`,
              jinja: `{{ menubar_open(aria_label="Application") }}
  {{ menu_open("File", id="mb-file") }}
    {{ menubar_item("New File") }}
    {{ menubar_item("Open…") }}
    {{ menubar_separator() }}
    {{ menubar_item("Delete project", variant="destructive") }}
  {{ menu_close() }}
{{ menubar_close() }}`,
              go: `{{template "menubar" (dict "AriaLabel" "Application" "Body" (htmlSafe \`…menus…\`))}}`,
              phoenix: `<.menubar aria_label="Application">
  <.menubar_menu label="File" id="mb-file">
    <.menubar_item>New File</.menubar_item>
    <.menubar_item variant="destructive">Delete project</.menubar_item>
  </.menubar_menu>
</.menubar>`,
            })}

            {await Example({
              id: "ex-nav",
              title: "Navigation menubar — link items",
              description:
                "Menu items can be links (href). Each section opens a submenu of in-app links. ESC closes; clicking a link navigates.",
              narrative: (
                <p>
                  APG notes the menubar pattern is heavier than most site
                  navigation needs — a{" "}
                  <a
                    class="underline underline-offset-4"
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
                  >
                    disclosure
                  </a>{" "}
                  is usually a better fit. Reach for menubar when you are
                  building an actual application chrome (an editor, a
                  desktop-style app) where the persistent command bar
                  matches user expectations.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Navigation Menubar example",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <Menubar ariaLabel="Mythical University">
                    <MenubarMenu label="About" id="ex-mb-about">
                      <MenubarItem href="#overview">Overview</MenubarItem>
                      <MenubarItem href="#administration">Administration</MenubarItem>
                      <MenubarItem href="#facts">Facts</MenubarItem>
                    </MenubarMenu>
                    <MenubarMenu label="Admissions" id="ex-mb-admissions">
                      <MenubarItem href="#apply">Apply</MenubarItem>
                      <MenubarItem href="#visit">Visit</MenubarItem>
                      <MenubarItem href="#tuition">Tuition &amp; Aid</MenubarItem>
                    </MenubarMenu>
                  </Menubar>
                </div>
              ),
              jsx: `<Menubar ariaLabel="Mythical University">
  <MenubarMenu label="About" id="mb-about">
    <MenubarItem href="/overview">Overview</MenubarItem>
    <MenubarItem href="/facts">Facts</MenubarItem>
  </MenubarMenu>
</Menubar>`,
              jinja: `{{ menu_open("About", id="mb-about") }}
  {{ menubar_item("Overview", href="/overview") }}
  {{ menubar_item("Facts", href="/facts") }}
{{ menu_close() }}`,
              go: `{{template "menubar_item" (dict "Label" "Overview" "Href" "/overview")}}`,
              phoenix: `<.menubar_menu label="About" id="mb-about">
  <.menubar_item href="/overview">Overview</.menubar_item>
</.menubar_menu>`,
            })}
          </section>
          <ApiTable title="<Menubar>" rows={MENUBAR_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
