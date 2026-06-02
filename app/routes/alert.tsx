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
import { ALERT_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Alert, AlertTitle, AlertDescription } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

export const alertRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  alertJsxSource,
  alertJinjaSource,
  alertGoSource,
  alertPhoenixSource,
  alertHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/alert.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/alert.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/alert.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/alert.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/alert.html"), "utf8"),
])

const usageJsx = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert variant="success">
  <CheckIcon />
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes have been recorded.</AlertDescription>
</Alert>`

const usageJinja = `{% from "components/alert.html" import alert_open, alert_close, alert_title, alert_description %}

{{ alert_open(variant="success") }}
  <svg …>…</svg>
  {{ alert_title("Saved") }}
  {{ alert_description("Your changes have been recorded.") }}
{{ alert_close() }}`

const usageGo = `{{template "alert" (dict
  "Variant" "success"
  "Title" "Saved"
  "Body"  (htmlSafe "Your changes have been recorded.")
)}}`

const usagePhoenix = `<.alert variant="success">
  <.alert_title>Saved</.alert_title>
  <.alert_description>Your changes have been recorded.</.alert_description>
</.alert>`

const usageHtml = `<div data-slot="alert" role="status" aria-live="polite" aria-atomic="true"
  class="relative grid w-full grid-cols-[0_1fr] items-start … rounded-lg border …">
  <svg …>…</svg>
  <div data-slot="alert-title">Saved</div>
  <div data-slot="alert-description">Your changes have been recorded.</div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-variants", label: "Variants", nested: true },
  { href: "#ex-live", label: "Live-region politeness", nested: true },
  { href: "#ex-htmx", label: "htmx — server-sent alert", nested: true },
  { href: "#api", label: "API Reference" },
]

alertRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/alert.json`

  // Reusable icon helpers (keeps the JSX terser below).
  const Icon = (props: { d: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      {props.d.split("|").map((p) => (
        <path d={p} />
      ))}
    </svg>
  )

  return page(
    c,
    <Layout title="Alert — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/alert" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Alert</h1>
            <p class="text-muted-foreground">
              A boxed informational, success, warning, or error message. Five
              variants; the{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">live</code>{" "}
              prop maps to the right ARIA live-region politeness so assistive
              tech announces (or doesn't) at the right urgency.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-alert"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/alert.tsx", source: alertJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/alert.html", source: alertJinjaSource, note: "Copy alert.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/alert.tmpl", source: alertGoSource, note: "Add alert.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/alert.ex", source: alertPhoenixSource, note: "Drop alert.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: alertHtmlSource, note: "Tailwind v4 utilities only; no script." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-variants",
              title: "Variants — pick the right colour for the message",
              description:
                "Five visual variants for five common situations. Pair the visual with the right live-region politeness (next example).",
              narrative: (
                <p>
                  Don't lean on colour alone — every alert keeps a textual
                  title and description so colour-blind users get the same
                  information. Icons reinforce the meaning further. WCAG
                  1.4.1 (Use of Colour) forbids using colour as the sole
                  signal.
                </p>
              ),
              references: [
                {
                  source: "WCAG",
                  label: "1.4.1 Use of Color",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
                },
                {
                  source: "MDN",
                  label: "role=\"alert\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role",
                },
              ],
              preview: (
                <div class="flex w-full max-w-lg flex-col gap-3">
                  <Alert variant="default">
                    <Icon d="M12 16v-4|M12 8h.01|M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    <AlertTitle>Heads up</AlertTitle>
                    <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
                  </Alert>
                  <Alert variant="success">
                    <Icon d="M20 6L9 17l-5-5" />
                    <AlertTitle>Saved</AlertTitle>
                    <AlertDescription>Your changes have been recorded.</AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <Icon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z|M12 9v4|M12 17h.01" />
                    <AlertTitle>Action needed</AlertTitle>
                    <AlertDescription>Your trial ends in 3 days.</AlertDescription>
                  </Alert>
                  <Alert variant="info">
                    <Icon d="M12 16v-4|M12 8h.01|M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    <AlertTitle>New feature</AlertTitle>
                    <AlertDescription>Try the new keyboard-driven palette: Cmd-K.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <Icon d="M15 9l-6 6|M9 9l6 6|M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>We couldn't save your changes. Try again in a moment.</AlertDescription>
                  </Alert>
                </div>
              ),
              jsx: `<Alert variant="success">
  <CheckIcon />
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes have been recorded.</AlertDescription>
</Alert>`,
              jinja: `{{ alert_open(variant="success") }}
  <svg …>…</svg>
  {{ alert_title("Saved") }}
  {{ alert_description("Your changes have been recorded.") }}
{{ alert_close() }}`,
              go: `{{template "alert" (dict
  "Variant" "success"
  "Title" "Saved"
  "Body"  (htmlSafe "Your changes have been recorded.")
)}}`,
              phoenix: `<.alert variant="success">
  <.alert_title>Saved</.alert_title>
  <.alert_description>Your changes have been recorded.</.alert_description>
</.alert>`,
            })}

            {await Example({
              id: "ex-live",
              title: "Live-region politeness — when to interrupt",
              description:
                "Three modes — off (static), polite (status), assertive (alert). The default is polite. Reach for assertive only when the user MUST hear it immediately.",
              narrative: (
                <p>
                  shadcn's upstream Alert hardcodes{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="alert"</code>
                  , which interrupts screen-reader output. We default to{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="status"</code>{" "}
                  (polite) because most alerts in real apps are
                  informational. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">live="assertive"</code>{" "}
                  only for the rare urgent cases: connection lost, unsaved
                  data warning before navigation, server errors after submit.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-live",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live",
                },
                {
                  source: "APG",
                  label: "Alert pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/",
                },
                {
                  source: "MDN",
                  label: "role=\"status\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role",
                },
              ],
              preview: (
                <div class="flex w-full max-w-lg flex-col gap-3 text-xs">
                  <code class="text-muted-foreground">live="off" — static, no announcement</code>
                  <Alert variant="info" live="off">
                    <AlertTitle>Page-load tip</AlertTitle>
                    <AlertDescription>Cards stack vertically on mobile.</AlertDescription>
                  </Alert>
                  <code class="text-muted-foreground">live="polite" (default) — role="status"</code>
                  <Alert variant="success" live="polite">
                    <AlertTitle>Saved</AlertTitle>
                    <AlertDescription>Filter applied. Showing 12 results.</AlertDescription>
                  </Alert>
                  <code class="text-muted-foreground">live="assertive" — role="alert", interrupts</code>
                  <Alert variant="destructive" live="assertive">
                    <AlertTitle>Connection lost</AlertTitle>
                    <AlertDescription>Trying to reconnect…</AlertDescription>
                  </Alert>
                </div>
              ),
              jsx: `<Alert live="off">…</Alert>           // static
<Alert live="polite">…</Alert>        // default (role=status)
<Alert live="assertive">…</Alert>     // role=alert; AT interrupts`,
              jinja: `{{ alert_open(live="off") }}…{{ alert_close() }}
{{ alert_open(live="polite") }}…{{ alert_close() }}
{{ alert_open(live="assertive") }}…{{ alert_close() }}`,
              go: `{{template "alert" (dict "Live" "off"        "Body" (htmlSafe …))}}
{{template "alert" (dict "Live" "polite"     "Body" (htmlSafe …))}}
{{template "alert" (dict "Live" "assertive"  "Body" (htmlSafe …))}}`,
              phoenix: `<.alert live="off">…</.alert>
<.alert live="polite">…</.alert>
<.alert live="assertive">…</.alert>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — server-sent alert into a live region",
              description:
                "The page has an empty polite live-region; the server returns an <Alert> fragment on submit which htmx swaps in. AT announces the message as soon as it appears.",
              narrative: (
                <p>
                  This is the canonical htmx pattern for flash messages. The
                  host element is rendered once at page load with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-live="polite"</code>
                  ; the server returns an Alert fragment whose own role +
                  aria-live get inherited by the host because they're
                  children of the live region. (Polite-on-polite is fine.)
                  Returning nothing on the empty case keeps the live region
                  silent.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-swap (innerHTML)",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
                {
                  source: "MDN",
                  label: "aria-live regions",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions",
                },
              ],
              preview: (
                <div class="flex w-full max-w-md flex-col gap-3">
                  <form
                    hx-post="/alert/save"
                    hx-target="#ex-alert-flash"
                    hx-swap="innerHTML"
                    class="flex items-center gap-2"
                  >
                    <Button type="submit">Submit</Button>
                    <Button type="submit" variant="outline" name="fail" value="1">
                      Submit (fails)
                    </Button>
                  </form>
                  <div id="ex-alert-flash" aria-live="polite" aria-atomic="true" />
                </div>
              ),
              jsx: `<form hx-post="/api/save" hx-target="#flash" hx-swap="innerHTML">
  <Button type="submit">Save</Button>
</form>
<div id="flash" aria-live="polite" aria-atomic="true" />

// Server returns either an <Alert variant="success"> or
// <Alert variant="destructive" live="assertive"> fragment.`,
              jinja: `<form hx-post="/api/save" hx-target="#flash" hx-swap="innerHTML">
  {{ button("Save", type="submit") }}
</form>
<div id="flash" aria-live="polite" aria-atomic="true"></div>`,
              go: `<form hx-post="/api/save" hx-target="#flash" hx-swap="innerHTML">
  {{template "button" (dict "Label" "Save" "Type" "submit")}}
</form>
<div id="flash" aria-live="polite" aria-atomic="true"></div>`,
              phoenix: `<form hx-post={~p"/api/save"} hx-target="#flash" hx-swap="innerHTML">
  <.button type="submit">Save</.button>
</form>
<div id="flash" aria-live="polite" aria-atomic="true"></div>`,
            })}
          </section>
          <ApiTable
            title="<Alert>"
            rows={ALERT_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

alertRoutes.post("/save", async (c) => {
  const body = await c.req.parseBody()
  if (body.fail) {
    return c.html(
      <Alert variant="destructive" live="assertive">
        <AlertTitle>Save failed</AlertTitle>
        <AlertDescription>
          The server rejected the change at {new Date().toLocaleTimeString()}.
        </AlertDescription>
      </Alert>,
    )
  }
  return c.html(
    <Alert variant="success">
      <AlertTitle>Saved</AlertTitle>
      <AlertDescription>
        Recorded at {new Date().toLocaleTimeString()}.
      </AlertDescription>
    </Alert>,
  )
})
