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
import { SWITCH_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Switch } from "@/registry/ui/switch"
import { Label } from "@/registry/ui/label"

export const switchRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  switchJsxSource,
  switchJinjaSource,
  switchGoSource,
  switchPhoenixSource,
  switchHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/switch.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/switch.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/switch.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/switch.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/switch.html"), "utf8"),
])

const usageJsx = `import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

<div class="flex items-center gap-2">
  <Switch id="notifications" name="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>`

const usageJinja = `{% from "components/switch.html" import switch %}
{% from "components/label.html" import label %}

<div class="flex items-center gap-2">
  {{ switch(id="notifications", name="notifications") }}
  {{ label("Enable notifications", for_="notifications") }}
</div>`

const usageGo = `{{template "switch" (dict "ID" "notifications" "Name" "notifications")}}
{{template "label"  (dict "For" "notifications" "Text" "Enable notifications")}}`

const usagePhoenix = `<div class="flex items-center gap-2">
  <.switch id="notifications" name="notifications" />
  <.label for="notifications">Enable notifications</.label>
</div>`

const usageHtml = `<label for="notifications" class="flex items-center gap-2">
  <span class="relative inline-flex h-[1.15rem] w-8 …">
    <input type="checkbox" role="switch" id="notifications" class="peer …">
    <span class="… peer-checked:translate-x-[calc(100%-2px)]"></span>
  </span>
  Enable notifications
</label>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic + Label", nested: true },
  { href: "#ex-sizes", label: "Sizes", nested: true },
  { href: "#ex-states", label: "States", nested: true },
  { href: "#ex-htmx", label: "htmx — save on toggle", nested: true },
  { href: "#api", label: "API Reference" },
]

switchRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/switch.json`

  return page(
    c,
    <Layout title="Switch — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/switch" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Switch</h1>
            <p class="text-muted-foreground">
              A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="checkbox" role="switch"&gt;</code>{" "}
              styled as a sliding pill. Form-submittable, keyboard-toggleable
              (Space), accessible name from a paired{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;label&gt;</code>.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-switch"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/switch.tsx", source: switchJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/switch.html", source: switchJinjaSource, note: "Copy switch.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/switch.tmpl", source: switchGoSource, note: "Add switch.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/switch.ex", source: switchPhoenixSource, note: "Drop switch.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: switchHtmlSource, note: "Tailwind utilities only — no extra script." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — Switch + Label",
              description:
                "Pair with a Label exactly like Checkbox. Click anywhere on the label or tap Space when focused to flip the state.",
              narrative: (
                <p>
                  APG's switch pattern is "a two-state button" — but unlike a
                  toggle <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed</code>{" "}
                  button, the switch has an explicit on/off label baked into
                  the role. Use it for settings ("Enable notifications") where
                  the label describes the <em>setting</em>, not the action.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Switch pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/",
                },
                {
                  source: "MDN",
                  label: "role=\"switch\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/switch_role",
                },
              ],
              preview: (
                <div class="flex items-center gap-2">
                  <Switch id="ex-switch-basic" name="notifications" />
                  <Label htmlFor="ex-switch-basic">Enable notifications</Label>
                </div>
              ),
              jsx: `<Switch id="notifications" name="notifications" />
<Label htmlFor="notifications">Enable notifications</Label>`,
              jinja: `{{ switch(id="notifications", name="notifications") }}
{{ label("Enable notifications", for_="notifications") }}`,
              go: `{{template "switch" (dict "ID" "notifications" "Name" "notifications")}}
{{template "label"  (dict "For" "notifications" "Text" "Enable notifications")}}`,
              phoenix: `<.switch id="notifications" name="notifications" />
<.label for="notifications">Enable notifications</.label>`,
            })}

            {await Example({
              id: "ex-sizes",
              title: "Sizes — default and sm",
              description:
                "Two sizes: default (h-[1.15rem] w-8) and sm (h-3.5 w-6). Tighter rows in dense lists call for sm.",
              narrative: (
                <p>
                  Touch targets matter — even when the visual is small, the
                  hit area should be 24px+. Tailwind's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">size-3.5</code>{" "}
                  height stays comfortable because the input fills the parent's
                  full 24×16 region; you can tap anywhere on the pill.
                </p>
              ),
              references: [
                {
                  source: "WCAG",
                  label: "2.5.5 Target Size (AAA)",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html",
                },
              ],
              preview: (
                <div class="flex flex-col items-start gap-3">
                  <div class="flex items-center gap-2">
                    <Switch id="ex-switch-default" />
                    <Label htmlFor="ex-switch-default">Default size</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Switch id="ex-switch-sm" size="sm" />
                    <Label htmlFor="ex-switch-sm" class="text-xs">
                      Small size
                    </Label>
                  </div>
                </div>
              ),
              jsx: `<Switch />               // default
<Switch size="sm" />     // small`,
              jinja: `{{ switch() }}
{{ switch(size="sm") }}`,
              go: `{{template "switch" (dict)}}
{{template "switch" (dict "Size" "sm")}}`,
              phoenix: `<.switch />
<.switch size="sm" />`,
            })}

            {await Example({
              id: "ex-states",
              title: "States — checked, disabled, invalid",
              description:
                "Native attributes drive every state — same contract as Checkbox.",
              narrative: (
                <p>
                  Pre-select with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">checked</code>
                  , block submission with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>
                  , surface a failure with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid="true"</code>
                  . The thumb dims and the focus ring picks up{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled:opacity-50</code>{" "}
                  automatically.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "checkbox attributes",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox",
                },
              ],
              preview: (
                <div class="grid gap-3">
                  <div class="flex items-center gap-2">
                    <Switch id="ex-switch-pre" checked />
                    <Label htmlFor="ex-switch-pre">Pre-checked</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Switch id="ex-switch-disabled" disabled />
                    <Label htmlFor="ex-switch-disabled">Disabled</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Switch id="ex-switch-disabled-on" disabled checked />
                    <Label htmlFor="ex-switch-disabled-on">Disabled + checked</Label>
                  </div>
                </div>
              ),
              jsx: `<Switch checked />
<Switch disabled />
<Switch disabled checked />`,
              jinja: `{{ switch(checked=true) }}
{{ switch(disabled=true) }}
{{ switch(disabled=true, checked=true) }}`,
              go: `{{template "switch" (dict "Checked" true)}}
{{template "switch" (dict "Disabled" true)}}
{{template "switch" (dict "Disabled" true "Checked" true)}}`,
              phoenix: `<.switch checked />
<.switch disabled />
<.switch disabled checked />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — save on toggle",
              description:
                "Same recipe as Checkbox — hx-trigger=\"change\" + hx-swap=\"none\" persists the state without UI churn.",
              narrative: (
                <p>
                  Switches almost always represent a setting the server tracks.
                  Fire on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change</code>{" "}
                  to record the new value, and use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="none"</code>{" "}
                  if the server only needs to record (no UI to swap). Return a
                  fragment to update a status row in sync if you do need
                  visual confirmation.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (change)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="flex items-center gap-2">
                  <Switch
                    id="ex-switch-htmx"
                    name="newsletter"
                    hx-post="/switch/save"
                    hx-trigger="change"
                    hx-swap="none"
                  />
                  <Label htmlFor="ex-switch-htmx">Newsletter (saves on toggle)</Label>
                </div>
              ),
              jsx: `<Switch name="newsletter"
        hx-post="/preferences/newsletter"
        hx-trigger="change" hx-swap="none" />`,
              jinja: `{{ switch(name="newsletter",
          hx_post="/preferences/newsletter",
          hx_trigger="change", hx_swap="none") }}`,
              go: `{{template "switch" (dict
  "Name" "newsletter"
  "Attrs" (dict
    "hx-post" "/preferences/newsletter"
    "hx-trigger" "change"
    "hx-swap" "none"
  )
)}}`,
              phoenix: `<.switch name="newsletter"
         hx-post={~p"/preferences/newsletter"}
         hx-trigger="change" hx-swap="none" />`,
            })}
          </section>
          <ApiTable
            title="<Switch>"
            rows={SWITCH_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

switchRoutes.post("/save", (c) => c.body(null, 204))
