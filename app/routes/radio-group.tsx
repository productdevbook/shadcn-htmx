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
import { RADIO_GROUP_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"
import { Label } from "@/registry/ui/label"

export const radioGroupRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  rgJsxSource,
  rgJinjaSource,
  rgGoSource,
  rgPhoenixSource,
  rgHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/radio-group.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/radio-group.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/radio-group.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/radio-group.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/radio-group.html"), "utf8"),
])

const usageJsx = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

<RadioGroup name="plan" ariaLabel="Plan">
  <div class="flex items-center gap-2">
    <RadioGroupItem value="free" name="plan" id="plan-free" checked />
    <Label htmlFor="plan-free">Free</Label>
  </div>
  <div class="flex items-center gap-2">
    <RadioGroupItem value="pro" name="plan" id="plan-pro" />
    <Label htmlFor="plan-pro">Pro</Label>
  </div>
</RadioGroup>`

const usageJinja = `{% from "components/radio-group.html" import radio_group_open, radio_group_close, radio_group_item %}
{% from "components/label.html" import label %}

{{ radio_group_open(aria_label="Plan") }}
  <div class="flex items-center gap-2">
    {{ radio_group_item(value="free", name="plan", id="plan-free", checked=true) }}
    {{ label("Free", for_="plan-free") }}
  </div>
  <div class="flex items-center gap-2">
    {{ radio_group_item(value="pro", name="plan", id="plan-pro") }}
    {{ label("Pro", for_="plan-pro") }}
  </div>
{{ radio_group_close() }}`

const usageGo = `{{template "radio_group" (dict
  "AriaLabel" "Plan"
  "Body" (htmlSafe \`
    <div class="flex items-center gap-2">
      {{template "radio_group_item" (dict "Value" "free" "Name" "plan" "ID" "plan-free" "Checked" true)}}
      {{template "label" (dict "For" "plan-free" "Text" "Free")}}
    </div>
    <div class="flex items-center gap-2">
      {{template "radio_group_item" (dict "Value" "pro"  "Name" "plan" "ID" "plan-pro")}}
      {{template "label" (dict "For" "plan-pro" "Text" "Pro")}}
    </div>\`)
)}}`

const usagePhoenix = `<.radio_group aria-label="Plan">
  <div class="flex items-center gap-2">
    <.radio_group_item value="free" name="plan" id="plan-free" checked />
    <.label for="plan-free">Free</.label>
  </div>
  <div class="flex items-center gap-2">
    <.radio_group_item value="pro" name="plan" id="plan-pro" />
    <.label for="plan-pro">Pro</.label>
  </div>
</.radio_group>`

const usageHtml = `<fieldset>
  <legend class="text-sm font-medium">Choose a plan</legend>
  <div role="radiogroup" class="grid gap-3">
    <!-- one item -->
    <div class="flex items-center gap-2">
      <span class="relative inline-flex size-4">
        <input id="plan-free" type="radio" name="plan" value="free" checked
               class="peer aspect-square size-4 …">
        <span class="… peer-checked:block"></span>
      </span>
      <label for="plan-free">Free</label>
    </div>
  </div>
</fieldset>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-disabled", label: "Disabled / invalid", nested: true },
  { href: "#ex-htmx", label: "htmx — save on change", nested: true },
  { href: "#api", label: "API Reference" },
]

radioGroupRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/radio-group.json`

  return page(
    c,
    <Layout title="Radio Group — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/radio-group" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Radio Group</h1>
            <p class="text-muted-foreground">
              A set of mutually exclusive options. Native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="radio"&gt;</code>{" "}
              elements share a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">name</code>{" "}
              attribute — the browser handles arrow-key navigation and
              one-selected-at-a-time for free.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-radio"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/radio-group.tsx", source: rgJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/radio-group.html", source: rgJinjaSource, note: "Copy radio-group.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/radio-group.tmpl", source: rgGoSource, note: "Add radio-group.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/radio_group.ex", source: rgPhoenixSource, note: "Drop radio_group.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: rgHtmlSource, note: "Tailwind utilities only; no JS required." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — arrow keys cycle",
              description:
                "Focus a radio (Tab) and press ↑/↓/←/→. The browser moves focus AND selects the next radio in the same name group.",
              narrative: (
                <p>
                  APG's radio group pattern is "Tab enters the group on the
                  selected item; arrows move between items in the group." The
                  native HTML radio behaviour already does this — we just need
                  to share a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>{" "}
                  attribute. Auto-activation (selecting on focus) is the
                  default; if you need manual activation, that's a custom
                  ARIA radio group widget, not native radios.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Radio group pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
                },
                {
                  source: "MDN",
                  label: "<input type=\"radio\">",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio",
                },
              ],
              preview: (
                <RadioGroup name="plan" ariaLabel="Plan">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="free" name="plan" id="ex-rg-free" checked />
                    <Label htmlFor="ex-rg-free">Free — $0/mo</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="pro" name="plan" id="ex-rg-pro" />
                    <Label htmlFor="ex-rg-pro">Pro — $9/mo</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="team" name="plan" id="ex-rg-team" />
                    <Label htmlFor="ex-rg-team">Team — $29/mo</Label>
                  </div>
                </RadioGroup>
              ),
              jsx: `<RadioGroup name="plan" ariaLabel="Plan">
  <RadioGroupItem value="free" name="plan" id="free" checked />
  <Label htmlFor="free">Free</Label>
  <RadioGroupItem value="pro" name="plan" id="pro" />
  <Label htmlFor="pro">Pro</Label>
</RadioGroup>`,
              jinja: `{{ radio_group_open(aria_label="Plan") }}
  {{ radio_group_item(value="free", name="plan", id="free", checked=true) }}
  {{ label("Free", for_="free") }}
  {{ radio_group_item(value="pro",  name="plan", id="pro") }}
  {{ label("Pro",  for_="pro") }}
{{ radio_group_close() }}`,
              go: `{{template "radio_group" (dict "AriaLabel" "Plan"
  "Body" (htmlSafe \`
    {{template "radio_group_item" (dict "Value" "free" "Name" "plan" "ID" "free" "Checked" true)}}
    {{template "radio_group_item" (dict "Value" "pro"  "Name" "plan" "ID" "pro")}}
\`))}}`,
              phoenix: `<.radio_group aria-label="Plan">
  <.radio_group_item value="free" name="plan" id="free" checked />
  <.label for="free">Free</.label>
  <.radio_group_item value="pro" name="plan" id="pro" />
  <.label for="pro">Pro</.label>
</.radio_group>`,
            })}

            {await Example({
              id: "ex-disabled",
              title: "Disabled item + invalid group",
              description:
                "Disable a single radio with the disabled attribute. Mark the whole group invalid with aria-invalid + describedby.",
              narrative: (
                <p>
                  When one option in a group isn't available yet, disable just
                  that radio — arrow keys skip it automatically. When the
                  whole group has a validation problem (e.g. the user must
                  pick one), apply{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid="true"</code>{" "}
                  to each item and pair them with a single error message via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "input disabled",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled",
                },
                {
                  source: "WCAG",
                  label: "3.3.1 Error Identification",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html",
                },
              ],
              preview: (
                <RadioGroup name="ex-rg-d" ariaLabel="Notification frequency">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="daily" name="ex-rg-d" id="ex-rg-d-daily" />
                    <Label htmlFor="ex-rg-d-daily">Daily digest</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="weekly" name="ex-rg-d" id="ex-rg-d-weekly" />
                    <Label htmlFor="ex-rg-d-weekly">Weekly digest</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem
                      value="instant"
                      name="ex-rg-d"
                      id="ex-rg-d-instant"
                      disabled
                    />
                    <Label htmlFor="ex-rg-d-instant">Instant (Pro plan)</Label>
                  </div>
                </RadioGroup>
              ),
              jsx: `<RadioGroupItem value="instant" name="freq" id="instant" disabled />
<Label htmlFor="instant">Instant (Pro plan)</Label>`,
              jinja: `{{ radio_group_item(value="instant", name="freq", id="instant", disabled=true) }}
{{ label("Instant (Pro plan)", for_="instant") }}`,
              go: `{{template "radio_group_item" (dict "Value" "instant" "Name" "freq" "ID" "instant" "Disabled" true)}}`,
              phoenix: `<.radio_group_item value="instant" name="freq" id="instant" disabled />
<.label for="instant">Instant (Pro plan)</.label>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — save on change",
              description:
                "Wrap the group in a form and post on every change. The server records the choice; the response can swap a status row in lockstep.",
              narrative: (
                <p>
                  For settings rows (notifications, themes, default views) you
                  often want to persist the user's pick the moment they make
                  it.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="change"</code>{" "}
                  on the wrapping{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form&gt;</code>{" "}
                  fires on every radio toggle and submits the full form
                  payload (including the radio name + value) to the endpoint.
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
                <form
                  hx-post="/radio-group/save"
                  hx-trigger="change"
                  hx-target="#ex-rg-status"
                  hx-swap="innerHTML"
                  class="grid gap-3"
                >
                  <RadioGroup name="theme" ariaLabel="Theme">
                    <div class="flex items-center gap-2">
                      <RadioGroupItem value="light" name="theme" id="ex-rg-theme-light" checked />
                      <Label htmlFor="ex-rg-theme-light">Light</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioGroupItem value="dark" name="theme" id="ex-rg-theme-dark" />
                      <Label htmlFor="ex-rg-theme-dark">Dark</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioGroupItem value="system" name="theme" id="ex-rg-theme-system" />
                      <Label htmlFor="ex-rg-theme-system">System</Label>
                    </div>
                  </RadioGroup>
                  <p id="ex-rg-status" class="text-xs text-muted-foreground" aria-live="polite">
                    Pick a theme to save it.
                  </p>
                </form>
              ),
              jsx: `<form hx-post="/api/theme" hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  <RadioGroup name="theme">…</RadioGroup>
  <p id="status" aria-live="polite" />
</form>`,
              jinja: `<form hx-post="/api/theme" hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  {{ radio_group_open() }}…{{ radio_group_close() }}
  <p id="status" aria-live="polite"></p>
</form>`,
              go: `<form hx-post="/api/theme" hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  {{template "radio_group" (dict "Body" (htmlSafe \`…\`))}}
  <p id="status" aria-live="polite"></p>
</form>`,
              phoenix: `<form hx-post={~p"/api/theme"} hx-trigger="change"
      hx-target="#status" hx-swap="innerHTML">
  <.radio_group>…</.radio_group>
  <p id="status" aria-live="polite"></p>
</form>`,
            })}
          </section>
          <ApiTable
            title="<RadioGroup>"
            rows={RADIO_GROUP_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

radioGroupRoutes.post("/save", async (c) => {
  const body = await c.req.parseBody()
  const theme = String(body.theme ?? "")
  return c.html(
    <>Saved <strong>{theme}</strong> theme at {new Date().toLocaleTimeString()}.</>,
  )
})
