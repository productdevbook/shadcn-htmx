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
import { DROPDOWN_MENU_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/registry/ui/dropdown-menu"

export const dropdownMenuRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [ddJsx, ddJinja, ddGo, ddPhoenix, ddHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/dropdown-menu.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/dropdown-menu.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/dropdown-menu.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/dropdown_menu.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/dropdown-menu.html"), "utf8"),
])

const usageJsx = `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"

<DropdownMenuTrigger menuFor="user-menu" class="…btn classes…">Account</DropdownMenuTrigger>

<DropdownMenu id="user-menu">
  <DropdownMenuLabel>My account</DropdownMenuLabel>
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Settings</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
</DropdownMenu>`

const usageJinja = `{% from "components/dropdown-menu.html" import
   dropdown_trigger, dropdown_open, dropdown_close, dropdown_item,
   dropdown_separator, dropdown_label %}

{{ dropdown_trigger("Account", menu_for="user-menu", class_="…btn…") }}

{% call dropdown_open(id="user-menu") %}
  {{ dropdown_label("My account") }}
  {{ dropdown_item("Profile") }}
  {{ dropdown_item("Settings") }}
  {{ dropdown_separator() }}
  {{ dropdown_item("Log out", variant="destructive") }}
{% endcall %}`

const usageGo = `{{template "dropdown_trigger" (dict "Label" "Account" "MenuFor" "user-menu" "Class" "…btn…")}}

{{template "dropdown_menu" (dict "ID" "user-menu" "Body" (htmlSafe \`
  …label, items, separator…\`))}}`

const usagePhoenix = `<.dropdown_trigger menu_for="user-menu" class="…btn…">Account</.dropdown_trigger>

<.dropdown_menu id="user-menu">
  <.dropdown_label>My account</.dropdown_label>
  <.dropdown_item>Profile</.dropdown_item>
  <.dropdown_item>Settings</.dropdown_item>
  <.dropdown_separator />
  <.dropdown_item variant="destructive">Log out</.dropdown_item>
</.dropdown_menu>`

const usageHtml = `<button popovertarget="user-menu" popovertargetaction="toggle"
        aria-haspopup="menu" class="…">Account</button>
<div id="user-menu" popover="auto" role="menu" data-slot="dropdown-menu" class="…">
  <button role="menuitem" tabindex="-1">Profile</button>
  <button role="menuitem" tabindex="-1">Settings</button>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic + keyboard", nested: true },
  { href: "#ex-destructive", label: "Destructive item", nested: true },
  { href: "#api", label: "API Reference" },
]

dropdownMenuRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/dropdown-menu.json`

  return page(
    c,
    <Layout title="Dropdown Menu — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/dropdown-menu" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Dropdown Menu</h1>
            <p class="text-muted-foreground">
              A menu of actions opened from a button. Built on the native
              Popover API + APG menu keyboard contract — arrows, Home/End,
              type-to-find, Enter/Space activate.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-ddm"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/dropdown-menu.tsx", source: ddJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/dropdown-menu.html", source: ddJinja, note: "Copy dropdown-menu.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/dropdown-menu.tmpl", source: ddGo, note: "Add dropdown-menu.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/dropdown_menu.ex", source: ddPhoenix, note: "Drop dropdown_menu.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: ddHtml, note: "Includes the keyboard contract script. Copy once per page." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — click trigger, then keyboard takes over",
              description:
                "Open the menu. ↑/↓ cycles, Home/End jump, ESC closes, Enter activates. Type a letter to jump to the next matching item.",
              narrative: (
                <p>
                  APG's menu-button pattern is dense — but most of it falls
                  out for free when you start from{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">popovertarget</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="menu"</code>{" "}
                  /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="menuitem"</code>
                  . The site.js handler adds arrow keys, Home/End, and
                  type-to-find. The browser's Popover API gives us
                  light-dismiss + ESC + focus restoration.
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
                  label: "role=\"menu\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role",
                },
                {
                  source: "MDN",
                  label: "Popover API",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <DropdownMenuTrigger
                    menuFor="ex-ddm-1"
                    class="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent"
                  >
                    Account ▾
                  </DropdownMenuTrigger>
                  <DropdownMenu id="ex-ddm-1">
                    <DropdownMenuLabel>My account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
                  </DropdownMenu>
                </div>
              ),
              jsx: `<DropdownMenuTrigger menuFor="user-menu">Account ▾</DropdownMenuTrigger>
<DropdownMenu id="user-menu">
  <DropdownMenuLabel>My account</DropdownMenuLabel>
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Settings</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
</DropdownMenu>`,
              jinja: `{{ dropdown_trigger("Account ▾", menu_for="user-menu", class_="…") }}
{% call dropdown_open(id="user-menu") %}
  {{ dropdown_label("My account") }}
  {{ dropdown_item("Profile") }}
  {{ dropdown_item("Settings") }}
  {{ dropdown_separator() }}
  {{ dropdown_item("Log out", variant="destructive") }}
{% endcall %}`,
              go: `{{template "dropdown_trigger" (dict "Label" "Account ▾" "MenuFor" "user-menu" "Class" "…")}}
{{template "dropdown_menu" (dict "ID" "user-menu" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.dropdown_trigger menu_for="user-menu" class="…">Account ▾</.dropdown_trigger>
<.dropdown_menu id="user-menu">
  <.dropdown_label>My account</.dropdown_label>
  <.dropdown_item>Profile</.dropdown_item>
  <.dropdown_item variant="destructive">Log out</.dropdown_item>
</.dropdown_menu>`,
            })}

            {await Example({
              id: "ex-destructive",
              title: "Destructive item — red, last-position by convention",
              description:
                "Destructive items get red colour and live below a separator at the bottom.",
              narrative: (
                <p>
                  Convention places destructive actions at the bottom of a
                  menu, separated by a divider, with a colour cue. The
                  variant only changes the visual — the activation
                  behaviour is identical, so confirm-before-destruction
                  must happen separately (via a Dialog or htmx{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-confirm</code>
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
                <div class="flex items-center justify-center">
                  <DropdownMenuTrigger
                    menuFor="ex-ddm-2"
                    class="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent"
                  >
                    More ▾
                  </DropdownMenuTrigger>
                  <DropdownMenu id="ex-ddm-2">
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      {...({ "hx-delete": "/items/42", "hx-confirm": "Delete this item?" } as any)}
                    >
                      Delete…
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
              ),
              jsx: `<DropdownMenuItem variant="destructive"
  hx-delete="/items/42" hx-confirm="Delete this item?">
  Delete…
</DropdownMenuItem>`,
              jinja: `{{ dropdown_item("Delete…", variant="destructive",
                  hx_delete="/items/42", hx_confirm="Delete this item?") }}`,
              go: `{{template "dropdown_item" (dict "Label" "Delete…" "Variant" "destructive")}}`,
              phoenix: `<.dropdown_item variant="destructive"
  hx-delete={~p"/items/42"} hx-confirm="Delete this item?">
  Delete…
</.dropdown_item>`,
            })}
          </section>
          <ApiTable
            title="<DropdownMenu>"
            rows={DROPDOWN_MENU_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
