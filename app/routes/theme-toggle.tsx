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
import { THEME_TOGGLE_PROPS } from "@/app/data/api-rows"
import { ThemeToggle } from "@/registry/ui/theme-toggle"

export const themeToggleRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/theme-toggle.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/theme-toggle.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/theme-toggle.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/theme_toggle.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/theme-toggle.html"), "utf8"),
])

const usageJsx = `import { ThemeToggle } from "@/components/ui/theme-toggle"

// Read the cookie server-side so the right radio is checked with no flash.
<ThemeToggle value={cookies.theme ?? "system"} />`

const usageJinja = `{% from "components/theme-toggle.html" import theme_toggle %}

{{ theme_toggle(value=request.cookies.get("theme", "system")) }}`

const usageGo = `tpl.ExecuteTemplate(w, "theme-toggle", map[string]any{
    "Value": cookieValue(r, "theme"), // "" → renders "system"
})`

const usagePhoenix = `alias ShadcnHtmx.Components.ThemeToggle

<ThemeToggle.theme_toggle value={@conn.cookies["theme"] || "system"} />`

const usageHtml = `<!-- Paste into <head> (boot script) + body (control). Relies only on
     theme tokens + class-based .dark on <html>. No build step needed. -->
<div role="radiogroup" aria-label="Colour theme"
     data-slot="theme-toggle" data-name="theme" data-value="system"
     class="inline-flex items-center gap-0.5 rounded-md border bg-muted p-0.5 …">
  …three radios: system / light / dark…
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Light / dark / system", nested: true },
  { href: "#ex-cookie", label: "No-flash cookie boot", nested: true },
  { href: "#ex-htmx", label: "htmx — persist server-side", nested: true },
  { href: "#api", label: "API Reference" },
]

themeToggleRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/theme-toggle.json`

  return page(
    c,
    <Layout title="Theme Toggle — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/theme-toggle" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Theme Toggle</h1>
            <p class="text-muted-foreground">
              A light / dark / system colour-scheme switcher. It honours the
              operating-system preference by default via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">prefers-color-scheme</code>,
              and persists an explicit override in a cookie so the server
              re-renders the right theme with{" "}
              <strong>no flash</strong>. Rendered as a real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">radiogroup</code>{" "}
              of native radios — three real states, native keyboard handling.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. The visual control is pure server-rendered
              HTML; a tiny boot script (shipped in your site-wide{" "}
              <code class="rounded bg-muted px-1 py-0.5">site.js</code>) reads
              and writes the cookie and toggles the{" "}
              <code class="rounded bg-muted px-1 py-0.5">.dark</code> class.
            </p>
            <LangTabs
              id="install-theme-toggle"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/theme-toggle.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/theme-toggle.html",
                    source: jinjaSource,
                    note: "Copy theme-toggle.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/theme-toggle.tmpl",
                    source: goSource,
                    note: "Add theme-toggle.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/theme_toggle.ex",
                    source: phoenixSource,
                    note: "Drop theme_toggle.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/theme-toggle.html",
                    source: htmlSource,
                    note: "Paste the markup; relies only on theme tokens.",
                  }),
                },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>
            <p class="text-sm text-muted-foreground">
              The toggle below is wired to this page's boot script — pick an
              option and watch the docs theme change. "System" follows your OS
              setting live.
            </p>

            {await Example({
              id: "ex-basic",
              title: "Light / dark / system",
              description:
                "Three real states modelled as a native radio group. Arrow keys move between options; only one is selected at a time.",
              narrative: (
                <p>
                  A two-state toggle can't express "follow the system" — so we
                  use a radio group of three.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">system</code>{" "}
                  is the default and leaves the theme to the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">prefers-color-scheme</code>{" "}
                  media feature; picking{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">light</code>{" "}
                  or{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">dark</code>{" "}
                  is an explicit override. Because they're native radios sharing
                  one{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>,
                  the browser gives us roving arrow-key focus, single selection,
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-checked</code>{" "}
                  for free.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "prefers-color-scheme",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme",
                },
                {
                  source: "MDN",
                  label: "color-scheme property",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme",
                },
                {
                  source: "APG",
                  label: "Radio Group pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
                },
              ],
              preview: (
                <div class="flex justify-center">
                  <ThemeToggle value="system" />
                </div>
              ),
              jsx: `<ThemeToggle value={cookies.theme ?? "system"} />`,
              jinja: `{{ theme_toggle(value=request.cookies.get("theme", "system")) }}`,
              go: `{{template "theme-toggle" (dict "Value" (cookie .Request "theme"))}}`,
              phoenix: `<ThemeToggle.theme_toggle value={@conn.cookies["theme"] || "system"} />`,
            })}

            {await Example({
              id: "ex-cookie",
              title: "No-flash cookie boot",
              description:
                "The server reads the cookie and renders the right radio checked + the .dark class up front. A synchronous pre-paint script applies it before first paint.",
              narrative: (
                <p>
                  htmx / server-rendered apps can't read{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">localStorage</code>{" "}
                  on the server, so the web.dev theme-switch trick (which uses
                  it) would flash the wrong colours on first paint. Storing the
                  choice in a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">theme</code>{" "}
                  cookie fixes that: the server sends back the correct{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.dark</code>{" "}
                  class and the matching{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">checked</code>{" "}
                  radio, and a tiny inline boot script in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;head&gt;</code>{" "}
                  re-confirms it before the body renders. The script also sets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">color-scheme</code>{" "}
                  so native scrollbars and form controls match.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "color-scheme",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme",
                },
                {
                  source: "WHATWG",
                  label: "Cookies (Set-Cookie)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <ThemeToggle value="light" />
                  <p class="text-xs text-muted-foreground">
                    Rendered with <code class="rounded bg-muted px-1 py-0.5">value="light"</code> — the Light radio is checked server-side.
                  </p>
                </div>
              ),
              jsx: `// Boot script (in your <head>, before the stylesheet):
//   var m = document.cookie.match(/theme=(system|light|dark)/)
//   var choice = m ? m[1] : "system"
//   var dark = choice === "dark" ||
//     (choice === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
//   document.documentElement.classList.toggle("dark", dark)

<ThemeToggle value={cookies.theme ?? "system"} />`,
              jinja: `{# server reads the cookie → no flash #}
{{ theme_toggle(value=request.cookies.get("theme", "system")) }}`,
              go: `{{template "theme-toggle" (dict "Value" (cookie .Request "theme"))}}`,
              phoenix: `<ThemeToggle.theme_toggle value={@conn.cookies["theme"] || "system"} />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — persist server-side",
              description:
                "The boot script already writes the cookie and flips the theme. Add hx-post to also persist the choice to the user's profile on the server.",
              narrative: (
                <p>
                  The cookie + boot script handle the visual switch with zero
                  round-trips. When you also want the preference stored against
                  a logged-in user, hang htmx attributes off the group:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-post</code>{" "}
                  the new value on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="change"</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="none"</code>{" "}
                  — the server reads the radio value and saves it. The change
                  event bubbles from the selected radio to the group, so a
                  single set of attributes on the root covers all three options.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
                {
                  source: "htmx",
                  label: "hx-swap",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <ThemeToggle
                    value="system"
                    id="theme-toggle-htmx"
                    hx-post="/docs/theme-toggle/save"
                    hx-trigger="change"
                    hx-target="#theme-save-out"
                    hx-swap="innerHTML"
                  />
                  <span
                    id="theme-save-out"
                    class="text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    No preference saved yet.
                  </span>
                </div>
              ),
              jsx: `<ThemeToggle
  value={cookies.theme ?? "system"}
  hx-post="/prefs/theme"
  hx-trigger="change"
  hx-swap="none"
/>`,
              jinja: `{{ theme_toggle(value=request.cookies.get("theme", "system"),
    hx_post="/prefs/theme", hx_trigger="change", hx_swap="none") }}`,
              go: `{{template "theme-toggle" (dict
  "Value" (cookie .Request "theme")
  "Attrs" (dict "hx-post" "/prefs/theme" "hx-trigger" "change" "hx-swap" "none")
)}}`,
              phoenix: `<ThemeToggle.theme_toggle value={@theme}
  hx-post="/prefs/theme" hx-trigger="change" hx-swap="none" />`,
            })}
          </section>

          <ApiTable
            title="<ThemeToggle>"
            caption="The change event bubbles from the selected radio to the group, so hx-* on the root covers all three options."
            rows={THEME_TOGGLE_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

themeToggleRoutes.post("/save", async (c) => {
  const body = await c.req.parseBody()
  const theme = typeof body.theme === "string" ? body.theme : "system"
  return c.html(
    <span class="font-medium text-foreground">
      Saved preference: {theme}.
    </span>,
  )
})
