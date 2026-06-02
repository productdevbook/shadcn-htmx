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
import { TABS_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/ui/tabs"
import { Label } from "@/registry/ui/label"
import { Input } from "@/registry/ui/input"
import { Button } from "@/registry/ui/button"

export const tabsRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  tabsJsxSource,
  tabsJinjaSource,
  tabsGoSource,
  tabsPhoenixSource,
  tabsHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/tabs.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/tabs.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/tabs.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/tabs.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/tabs.html"), "utf8"),
])

const usageJsx = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs id="account-tabs" value="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account fields…</TabsContent>
  <TabsContent value="password">Password fields…</TabsContent>
</Tabs>`

const usageJinja = `{% from "components/tabs.html" import tabs, tabs_list_open, tabs_list_close, tab_trigger, tab_content %}

{% call tabs(id="account-tabs", value="account") %}
  {{ tabs_list_open() }}
    {{ tab_trigger("account",  "Account") }}
    {{ tab_trigger("password", "Password") }}
  {{ tabs_list_close() }}
  {% call(_) tab_content("account")  %}Account fields…{% endcall %}
  {% call(_) tab_content("password") %}Password fields…{% endcall %}
{% endcall %}`

const usageGo = `{{template "tabs" (dict
  "ID" "account-tabs" "Active" "account"
  "Body" (htmlSafe \`<div role="tablist" class="…">
    {{template "tabs_trigger" (dict "Value" "account"  "Label" "Account")}}
    {{template "tabs_trigger" (dict "Value" "password" "Label" "Password")}}
  </div>
  {{template "tabs_content" (dict "Value" "account"  "Body" (htmlSafe "Account fields…"))}}
  {{template "tabs_content" (dict "Value" "password" "Body" (htmlSafe "Password fields…"))}}\`)
)}}`

const usagePhoenix = `<.tabs id="account-tabs" value="account">
  <.tabs_list>
    <.tabs_trigger value="account">Account</.tabs_trigger>
    <.tabs_trigger value="password">Password</.tabs_trigger>
  </.tabs_list>
  <.tabs_content value="account">Account fields…</.tabs_content>
  <.tabs_content value="password">Password fields…</.tabs_content>
</.tabs>`

const usageHtml = `<div id="account-tabs" data-tabs data-active-tab="account"
     data-orientation="horizontal" class="group/tabs flex flex-col gap-2">
  <div role="tablist" class="…tabs-list classes…">
    <button role="tab" data-tab-trigger="account"  class="…">Account</button>
    <button role="tab" data-tab-trigger="password" class="…">Password</button>
  </div>
  <div role="tabpanel" data-tab-panel="account">Account fields…</div>
  <div role="tabpanel" data-tab-panel="password">Password fields…</div>
</div>
<script>/* see snippets/tabs.html for the boot + keyboard wiring */</script>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-vertical", label: "Vertical orientation", nested: true },
  { href: "#ex-htmx", label: "htmx — lazy tab content", nested: true },
  { href: "#api", label: "API Reference" },
]

tabsRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/tabs.json`

  return page(
    c,
    <Layout title="Tabs — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/tabs" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Tabs</h1>
            <p class="text-muted-foreground">
              WAI-ARIA tabs pattern over real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button role="tab"&gt;</code>{" "}
              elements. Arrow keys cycle, Home/End jump to edges, focus stays
              inside the tablist. An inline boot script sets the active tab
              before paint, so there's no flicker.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-tabs"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/tabs.tsx", source: tabsJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/tabs.html", source: tabsJinjaSource, note: "Copy tabs.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/tabs.tmpl", source: tabsGoSource, note: "Add tabs.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/tabs.ex", source: tabsPhoenixSource, note: "Drop tabs.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: tabsHtmlSource, note: "Includes the boot + keyboard script inline." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — click or arrow-keys",
              description:
                "Click a tab. Use ←/→ to move between them; Home / End jump to first / last. Tab moves focus out of the tablist into the active panel.",
              narrative: (
                <p>
                  APG's tabs pattern: focus enters the tablist on the active
                  tab. Arrow keys move focus AND switch the active tab in one
                  step (auto-activation — the alternative, manual activation,
                  is rarer in practice). The active tab gets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-selected="true"</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="0"</code>
                  ; all others get{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="-1"</code>{" "}
                  so Tab leaves the strip after one stop.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tabs pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
                },
                {
                  source: "MDN",
                  label: "role=\"tab\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role",
                },
              ],
              preview: (
                <Tabs id="ex-basic-tabs" value="account" class="w-full max-w-md">
                  <TabsList ariaLabel="Account sections">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" class="rounded-md border bg-background p-4">
                    <div class="grid gap-3">
                      <Label htmlFor="ex-basic-name">Name</Label>
                      <Input id="ex-basic-name" defaultValue="Mehmet" />
                      <Button class="justify-self-start" size="sm">Save</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="password" class="rounded-md border bg-background p-4">
                    <div class="grid gap-3">
                      <Label htmlFor="ex-basic-pw">New password</Label>
                      <Input id="ex-basic-pw" type="password" />
                      <Button class="justify-self-start" size="sm">Change</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="notifications" class="rounded-md border bg-background p-4">
                    <p class="text-sm text-muted-foreground">
                      You're subscribed to weekly digests and security alerts.
                    </p>
                  </TabsContent>
                </Tabs>
              ),
              jsx: `<Tabs id="account-tabs" value="account">
  <TabsList ariaLabel="Account sections">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
  <TabsContent value="notifications">…</TabsContent>
</Tabs>`,
              jinja: `{% call tabs(id="account-tabs", value="account") %}
  {{ tabs_list_open(aria_label="Account sections") }}
    {{ tab_trigger("account",       "Account") }}
    {{ tab_trigger("password",      "Password") }}
    {{ tab_trigger("notifications", "Notifications") }}
  {{ tabs_list_close() }}
  {% call(_) tab_content("account")       %}…{% endcall %}
  {% call(_) tab_content("password")      %}…{% endcall %}
  {% call(_) tab_content("notifications") %}…{% endcall %}
{% endcall %}`,
              go: `{{template "tabs" (dict "ID" "account-tabs" "Active" "account"
  "Body" (htmlSafe \`…tablist + triggers + panels…\`))}}`,
              phoenix: `<.tabs id="account-tabs" value="account">
  <.tabs_list aria-label="Account sections">
    <.tabs_trigger value="account">Account</.tabs_trigger>
    <.tabs_trigger value="password">Password</.tabs_trigger>
    <.tabs_trigger value="notifications">Notifications</.tabs_trigger>
  </.tabs_list>
  <.tabs_content value="account">…</.tabs_content>
  <.tabs_content value="password">…</.tabs_content>
  <.tabs_content value="notifications">…</.tabs_content>
</.tabs>`,
            })}

            {await Example({
              id: "ex-vertical",
              title: "Vertical orientation",
              description:
                "Set orientation=\"vertical\" and the tablist stacks vertically. Up/Down arrows move; everything else carries over.",
              narrative: (
                <p>
                  The orientation switch is one prop. The keyboard handler
                  picks the right axis automatically (Up/Down for vertical,
                  Left/Right for horizontal). Useful for settings sidebars and
                  email clients.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tabs — Vertical Tabs",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/",
                },
              ],
              preview: (
                <Tabs
                  id="ex-vert-tabs"
                  value="general"
                  orientation="vertical"
                  class="w-full max-w-md flex-row! gap-4!"
                >
                  <TabsList class="flex flex-col! h-auto! items-stretch!">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" class="rounded-md border bg-background p-4 text-sm">
                    General app preferences.
                  </TabsContent>
                  <TabsContent value="security" class="rounded-md border bg-background p-4 text-sm">
                    2-factor, sessions, audit log.
                  </TabsContent>
                  <TabsContent value="billing" class="rounded-md border bg-background p-4 text-sm">
                    Plan, invoices, payment method.
                  </TabsContent>
                </Tabs>
              ),
              jsx: `<Tabs id="settings" value="general" orientation="vertical">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
  …
</Tabs>`,
              jinja: `{% call tabs(id="settings", value="general", orientation="vertical") %}
  {{ tabs_list_open() }}
    {{ tab_trigger("general",  "General") }}
    {{ tab_trigger("security", "Security") }}
    {{ tab_trigger("billing",  "Billing") }}
  {{ tabs_list_close() }}
  …
{% endcall %}`,
              go: `{{template "tabs" (dict
  "ID" "settings" "Active" "general" "Orientation" "vertical"
  "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.tabs id="settings" value="general" orientation="vertical">
  <.tabs_list>
    <.tabs_trigger value="general">General</.tabs_trigger>
    …
  </.tabs_list>
  …
</.tabs>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — lazy tab content",
              description:
                "Each panel fetches its content the first time it's revealed. hx-trigger=\"intersect once\" only fires when the panel becomes visible.",
              narrative: (
                <p>
                  When tab panels carry heavy content, don't render all of
                  them on the initial page. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="intersect once"</code>{" "}
                  on the panel — htmx fires the request the first time the
                  element enters the viewport (which, with our boot script,
                  is when the tab is first activated). Subsequent visits to
                  the tab show the cached content. Combine with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="innerHTML"</code>{" "}
                  and a loading skeleton for a smooth feel.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger — intersect, once",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <Tabs id="ex-htmx-tabs" value="overview" class="w-full max-w-md">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" class="rounded-md border bg-background p-4 text-sm">
                    Static content rendered with the page.
                  </TabsContent>
                  <TabsContent
                    value="comments"
                    class="rounded-md border bg-background p-4 text-sm"
                    hx-get="/tabs/comments"
                    hx-trigger="intersect once"
                    hx-swap="innerHTML"
                  >
                    <span class="text-muted-foreground">Loading…</span>
                  </TabsContent>
                  <TabsContent
                    value="history"
                    class="rounded-md border bg-background p-4 text-sm"
                    hx-get="/tabs/history"
                    hx-trigger="intersect once"
                    hx-swap="innerHTML"
                  >
                    <span class="text-muted-foreground">Loading…</span>
                  </TabsContent>
                </Tabs>
              ),
              jsx: `<TabsContent value="comments"
  hx-get="/api/comments"
  hx-trigger="intersect once"
  hx-swap="innerHTML">
  <span class="text-muted-foreground">Loading…</span>
</TabsContent>`,
              jinja: `{# tab_content has no hx-* passthrough — hand-write the panel: #}
<div role="tabpanel" data-slot="tabs-content" data-tab-panel="comments" tabindex="0"
     class="flex-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
     hx-get="/api/comments" hx-trigger="intersect once" hx-swap="innerHTML">
  Loading…
</div>`,
              go: `<div role="tabpanel" data-tab-panel="comments"
     hx-get="/api/comments" hx-trigger="intersect once" hx-swap="innerHTML">
  Loading…
</div>`,
              phoenix: `<.tabs_content value="comments"
  hx-get={~p"/api/comments"}
  hx-trigger="intersect once"
  hx-swap="innerHTML">
  Loading…
</.tabs_content>`,
            })}
          </section>
          <ApiTable
            title="<Tabs>"
            rows={TABS_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx endpoints for the lazy tab content demo.
tabsRoutes.get("/comments", (c) =>
  c.html(
    <ul class="space-y-1.5">
      <li>
        <strong>Ayşe:</strong> Looks good — ship it.
      </li>
      <li>
        <strong>Burak:</strong> Tweak the copy on the homepage hero?
      </li>
      <li>
        <strong>Cem:</strong> +1 to shipping.
      </li>
    </ul>,
  ),
)

tabsRoutes.get("/history", (c) =>
  c.html(
    <ol class="list-decimal space-y-1.5 pl-5">
      <li>Created 3 days ago.</li>
      <li>Edited yesterday by Mehmet.</li>
      <li>Comment thread opened today.</li>
    </ol>,
  ),
)
