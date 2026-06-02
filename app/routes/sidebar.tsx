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
import { SIDEBAR_PROPS } from "@/app/data/api-rows"
import {
  SidebarLayout,
  Sidebar,
  SidebarTrigger,
  SidebarScrim,
  SidebarClose,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarContent,
} from "@/registry/ui/sidebar"

export const sidebarRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/sidebar.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/sidebar.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/sidebar.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/sidebar.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/sidebar.html"), "utf8"),
  ])

const usageJsx = `import { SidebarLayout, Sidebar, SidebarTrigger, SidebarScrim,
  SidebarHeader, SidebarBody, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarItem, SidebarContent } from "@/components/ui/sidebar"

<SidebarLayout>
  <SidebarTrigger sidebarFor="nav" label="Menu" />
  <Sidebar id="nav" ariaLabel="Main">
    <SidebarHeader>Acme Inc.</SidebarHeader>
    <SidebarBody>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarItem href="/" current>Dashboard</SidebarItem>
        <SidebarItem href="/projects">Projects</SidebarItem>
        <SidebarItem href="/settings">Settings</SidebarItem>
      </SidebarGroup>
    </SidebarBody>
    <SidebarFooter>mehmet@example.com</SidebarFooter>
  </Sidebar>
  <SidebarScrim sidebarFor="nav" />
  <SidebarContent>…page content…</SidebarContent>
</SidebarLayout>`

const usageJinja = `{% from "components/sidebar.html" import sidebar_layout,
  sidebar_trigger, sidebar, sidebar_scrim, sidebar_group_label, sidebar_item %}

{% call sidebar_layout() %}
  {{ sidebar_trigger(sidebar_for="nav", label="Menu") }}
  {% call sidebar(id="nav", aria_label="Main") %}
    <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
      {{ sidebar_group_label("Platform") }}
      {{ sidebar_item("Dashboard", href="/", current=true) }}
      {{ sidebar_item("Settings", href="/settings") }}
    </div>
  {% endcall %}
  {{ sidebar_scrim(sidebar_for="nav") }}
  <main data-slot="sidebar-content" class="min-w-0 flex-1">…</main>
{% endcall %}`

const usageGo = `{{template "sidebar_layout" (dict "Body" (htmlSafe \`
  ...sidebar_trigger / sidebar / sidebar_scrim / sidebar-content...\`))}}

{{template "sidebar_trigger" (dict "SidebarFor" "nav" "Label" "Menu")}}
{{template "sidebar" (dict "ID" "nav" "AriaLabel" "Main" "Body" (htmlSafe \`
  <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">…</div>\`))}}
{{template "sidebar_scrim" (dict "SidebarFor" "nav")}}`

const usagePhoenix = `<.sidebar_layout>
  <.sidebar_trigger sidebar_for="nav" label="Menu" />
  <.sidebar id="nav" aria_label="Main">
    <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
      <.sidebar_group_label>Platform</.sidebar_group_label>
      <.sidebar_item href={~p"/"} current>Dashboard</.sidebar_item>
      <.sidebar_item href={~p"/settings"}>Settings</.sidebar_item>
    </div>
  </.sidebar>
  <.sidebar_scrim sidebar_for="nav" />
  <main data-slot="sidebar-content" class="min-w-0 flex-1">…</main>
</.sidebar_layout>`

const usageHtml = `<div data-slot="sidebar-layout" class="relative grid grid-cols-1 sm:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
  <a href="#nav" data-slot="sidebar-trigger" class="sm:hidden">Menu</a>
  <nav id="nav" data-slot="sidebar" tabindex="-1" aria-label="Main">…links…</nav>
  <a href="#" data-slot="sidebar-scrim" class="absolute inset-0 sm:hidden"></a>
  <main data-slot="sidebar-content">…</main>
</div>

<!-- Responsive :target drawer CSS + a tiny Esc-to-close script ship inline
     in snippets/sidebar.html. Open/close works without the script. -->`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Rail + content", nested: true },
  { href: "#ex-drawer", label: "Off-canvas drawer", nested: true },
  { href: "#api", label: "API Reference" },
]

sidebarRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/sidebar.json`

  return page(
    c,
    <Layout title="Sidebar — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/sidebar" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Sidebar</h1>
            <p class="text-muted-foreground">
              A responsive app-navigation sidebar: a fixed rail on wide screens
              that collapses to an off-canvas drawer behind a labelled hamburger
              on narrow screens. The nav links are real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;a href&gt;</code>{" "}
              anchors and the open/close works <strong>without JavaScript</strong>{" "}
              — layout is CSS grid (
              <code class="rounded bg-muted px-1 py-0.5 text-sm">grid-template-columns: minmax() 1fr</code>
              ) and the drawer toggles on the CSS{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">:target</code>{" "}
              pseudo-class.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              The responsive{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">:target</code>{" "}
              drawer transition ships in your stylesheet (keyed off{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">data-slot="sidebar"</code>),
              and a tiny script in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">public/site.js</code>{" "}
              adds Escape-to-close + focus as an enhancement — the drawer opens
              and closes without it.
            </p>
            <LangTabs
              id="install-sidebar"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/sidebar.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/sidebar.html", source: jinjaSource, note: "Copy sidebar.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/sidebar.tmpl", source: goSource, note: "Add sidebar.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/sidebar.ex", source: phoenixSource, note: "Drop sidebar.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/sidebar.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Rail + content — the two-track grid",
              description:
                "The shell is a CSS grid: a minmax() rail track plus a 1fr content track. The rail is a <nav> landmark of real anchors; the active item carries aria-current=\"page\".",
              narrative: (
                <p>
                  This is the "sidebar says" one-line layout —{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">grid-template-columns: minmax(16rem, 20rem) 1fr</code>{" "}
                  gives the rail a safe min/max width while the content fills the
                  rest. No JS runs here: the links are native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a&gt;</code>{" "}
                  elements, so role=link and Enter-to-activate come from the
                  platform. The demo is height-bounded via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">--sidebar-h</code>;
                  a real shell uses the full viewport.
                </p>
              ),
              references: [
                { source: "MDN", label: "grid-template-columns", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns" },
                { source: "MDN", label: "minmax()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/minmax" },
                { source: "MDN", label: "navigation role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/navigation_role" },
                { source: "MDN", label: "aria-current", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current" },
              ],
              preview: (
                <SidebarLayout style="--sidebar-h: 20rem; --sidebar-w: 13rem">
                  <Sidebar id="ex-basic-nav" ariaLabel="Demo">
                    <SidebarHeader>Acme Inc.</SidebarHeader>
                    <SidebarBody>
                      <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarItem href="#ex-basic" current>Dashboard</SidebarItem>
                        <SidebarItem href="#ex-basic">Projects</SidebarItem>
                        <SidebarItem href="#ex-basic">Settings</SidebarItem>
                      </SidebarGroup>
                    </SidebarBody>
                    <SidebarFooter>mehmet@example.com</SidebarFooter>
                  </Sidebar>
                  <SidebarContent class="p-6 text-sm text-muted-foreground">
                    The rail holds the navigation; this column is the page.
                  </SidebarContent>
                </SidebarLayout>
              ),
              jsx: `<SidebarLayout>
  <Sidebar id="nav" ariaLabel="Main">
    <SidebarHeader>Acme Inc.</SidebarHeader>
    <SidebarBody>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarItem href="/" current>Dashboard</SidebarItem>
        <SidebarItem href="/projects">Projects</SidebarItem>
        <SidebarItem href="/settings">Settings</SidebarItem>
      </SidebarGroup>
    </SidebarBody>
    <SidebarFooter>mehmet@example.com</SidebarFooter>
  </Sidebar>
  <SidebarContent>…page content…</SidebarContent>
</SidebarLayout>`,
              jinja: `{% call sidebar_layout() %}
  {% call sidebar(id="nav", aria_label="Main") %}
    <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
      {{ sidebar_group_label("Platform") }}
      {{ sidebar_item("Dashboard", href="/", current=true) }}
      {{ sidebar_item("Projects", href="/projects") }}
    </div>
  {% endcall %}
  <main data-slot="sidebar-content" class="min-w-0 flex-1">…</main>
{% endcall %}`,
              go: `{{template "sidebar" (dict "ID" "nav" "AriaLabel" "Main" "Body" (htmlSafe \`
  <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
    {{template "sidebar_group_label" (dict "Text" "Platform")}}
    {{template "sidebar_item" (dict "Label" "Dashboard" "Href" "/" "Current" true)}}
  </div>\`))}}`,
              phoenix: `<.sidebar id="nav" aria_label="Main">
  <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
    <.sidebar_group_label>Platform</.sidebar_group_label>
    <.sidebar_item href={~p"/"} current>Dashboard</.sidebar_item>
    <.sidebar_item href={~p"/projects"}>Projects</.sidebar_item>
  </div>
</.sidebar>`,
            })}

            {await Example({
              id: "ex-drawer",
              title: "Off-canvas drawer — no-JS :target toggle",
              description:
                "Resize narrow (or open this on a phone): the rail becomes a drawer behind a labelled hamburger. Opening is a link to the drawer's #id; the dim scrim and X are links back to #.",
              narrative: (
                <p>
                  The hamburger is an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a href="#nav"&gt;</code>;
                  navigating that fragment makes the drawer match{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">:target</code>{" "}
                  and CSS slides it in — exactly the web.dev Sidenav technique.
                  Click the scrim or the X (both are{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a href="#"&gt;</code>)
                  to close. The Escape key is wired in site.js purely as an
                  enhancement. This demo is bounded; on a real page the drawer
                  covers the viewport. Use the hamburger below at any width.
                </p>
              ),
              references: [
                { source: "MDN", label: ":target pseudo-class", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/:target" },
                { source: "MDN", label: "Window: hashchange event", href: "https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event" },
                { source: "WCAG", label: "web.dev — Building a Sidenav component", href: "https://web.dev/articles/sidenav-component" },
              ],
              preview: (
                <div id="ex-drawer-demo" class="relative h-72 overflow-hidden">
                  {/* Scoped style: force the off-canvas drawer presentation at
                      ANY width inside the demo box, so the hamburger is usable
                      on the desktop docs viewport. The slide is the same
                      :target rule the component ships globally. dangerouslySet
                      so Hono doesn't &quot;-escape the attribute selectors. */}
                  <style
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: docs-only inline CSS
                    dangerouslySetInnerHTML={{
                      __html: [
                        '#ex-drawer-demo [data-slot="sidebar-layout"]{grid-template-columns:minmax(0,1fr)}',
                        '#ex-drawer-demo [data-slot="sidebar-trigger"],#ex-drawer-demo [data-slot="sidebar-close"]{display:inline-flex}',
                        '#ex-drawer-demo [data-slot="sidebar"]{position:absolute;inset-block:0;left:-110%;height:100%;width:18rem;max-width:85%;z-index:50;box-shadow:var(--shadow-lg,0 10px 15px rgba(0,0,0,.3));transform:translateX(0);visibility:hidden;transition:left .3s cubic-bezier(.16,1,.3,1),visibility 0s linear .3s;will-change:left}',
                        '#ex-drawer-demo [data-slot="sidebar"]:target{left:0;transform:translateX(0);visibility:visible;transition:left .3s cubic-bezier(.16,1,.3,1)}',
                        '#ex-drawer-demo [data-slot="sidebar-scrim"]{display:block;opacity:0;pointer-events:none;transition:opacity .3s}',
                        '#ex-drawer-demo [data-slot="sidebar"]:target ~ [data-slot="sidebar-scrim"]{opacity:1;pointer-events:auto}',
                        '@media (prefers-reduced-motion:reduce){#ex-drawer-demo [data-slot="sidebar"]{transition-duration:1ms}}',
                      ].join(""),
                    }}
                  />
                  <SidebarLayout style="--sidebar-h: 18rem">
                    <div class="flex items-center gap-2 border-b px-4 py-3">
                      <SidebarTrigger sidebarFor="ex-drawer-nav" label="Navigation" />
                      <span class="text-sm font-medium">Acme Inc.</span>
                    </div>
                    <Sidebar id="ex-drawer-nav" ariaLabel="Drawer demo">
                      <SidebarClose />
                      <SidebarHeader>Acme Inc.</SidebarHeader>
                      <SidebarBody>
                        <SidebarItem href="#ex-drawer" current>Dashboard</SidebarItem>
                        <SidebarItem href="#ex-drawer">Projects</SidebarItem>
                        <SidebarItem href="#ex-drawer">Settings</SidebarItem>
                      </SidebarBody>
                    </Sidebar>
                    <SidebarScrim sidebarFor="ex-drawer-nav" />
                    <SidebarContent class="p-6 text-sm text-muted-foreground">
                      Tap "Navigation". The drawer slides in; the dim scrim, the
                      X, or Escape close it.
                    </SidebarContent>
                  </SidebarLayout>
                </div>
              ),
              jsx: `<SidebarLayout>
  {/* Labelled hamburger — hidden from the sm breakpoint up */}
  <SidebarTrigger sidebarFor="nav" label="Navigation" />

  <Sidebar id="nav" ariaLabel="Main">
    <SidebarClose />
    <SidebarHeader>Acme Inc.</SidebarHeader>
    <SidebarBody>
      <SidebarItem href="/" current>Dashboard</SidebarItem>
      <SidebarItem href="/projects">Projects</SidebarItem>
    </SidebarBody>
  </Sidebar>

  {/* Dim scrim — render AFTER the sidebar so :target ~ scrim can light it up */}
  <SidebarScrim sidebarFor="nav" />
  <SidebarContent>…page content…</SidebarContent>
</SidebarLayout>`,
              jinja: `{% call sidebar_layout() %}
  {{ sidebar_trigger(sidebar_for="nav", label="Navigation") }}
  {% call sidebar(id="nav", aria_label="Main") %}
    {{ sidebar_close() }}
    <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
      {{ sidebar_item("Dashboard", href="/", current=true) }}
    </div>
  {% endcall %}
  {{ sidebar_scrim(sidebar_for="nav") }}
  <main data-slot="sidebar-content" class="min-w-0 flex-1">…</main>
{% endcall %}`,
              go: `{{template "sidebar_trigger" (dict "SidebarFor" "nav" "Label" "Navigation")}}
{{template "sidebar" (dict "ID" "nav" "AriaLabel" "Main" "Body" (htmlSafe \`
  ...sidebar_close + items...\`))}}
{{template "sidebar_scrim" (dict "SidebarFor" "nav")}}`,
              phoenix: `<.sidebar_trigger sidebar_for="nav" label="Navigation" />
<.sidebar id="nav" aria_label="Main">
  <.sidebar_close />
  <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
    <.sidebar_item href={~p"/"} current>Dashboard</.sidebar_item>
  </div>
</.sidebar>
<.sidebar_scrim sidebar_for="nav" />`,
            })}
          </section>

          <ApiTable title="<Sidebar>" rows={SIDEBAR_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
