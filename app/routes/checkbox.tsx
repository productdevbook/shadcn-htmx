/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { CodeBlock } from "@/app/components/code-block"
import { LangTabs } from "@/app/components/lang-tabs"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { ApiTable } from "@/app/components/api-table"
import { CHECKBOX_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Checkbox } from "@/registry/ui/checkbox"
import { Label } from "@/registry/ui/label"

export const checkboxRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  checkboxJsxSource,
  checkboxJinjaSource,
  checkboxGoSource,
  checkboxPhoenixSource,
  checkboxHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/checkbox.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/checkbox.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/checkbox.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/checkbox.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/checkbox.html"), "utf8"),
])

const usageJsx = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div class="flex items-center gap-2">
  <Checkbox id="terms" name="terms" required />
  <Label htmlFor="terms">I agree to the terms.</Label>
</div>`

const usageJinja = `{% from "components/checkbox.html" import checkbox %}
{% from "components/label.html" import label %}

<div class="flex items-center gap-2">
  {{ checkbox(id="terms", name="terms", required=true) }}
  {{ label("I agree to the terms.", for_="terms") }}
</div>`

const usageGo = `{{template "checkbox" (dict "ID" "terms" "Name" "terms" "Required" true)}}
{{template "label"    (dict "For" "terms" "Text" "I agree to the terms.")}}`

const usagePhoenix = `<div class="flex items-center gap-2">
  <.checkbox id="terms" name="terms" required />
  <.label for="terms">I agree to the terms.</.label>
</div>`

const usageHtml = `<label for="terms" class="flex items-center gap-2 text-sm font-medium">
  <span class="relative inline-flex size-4">
    <input id="terms" name="terms" type="checkbox" required class="peer …" />
    <svg class="… peer-checked:block">…</svg>
  </span>
  I agree to the terms.
</label>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic + Label", nested: true },
  { href: "#ex-states", label: "States", nested: true },
  { href: "#ex-indeterminate", label: "Indeterminate", nested: true },
  { href: "#ex-htmx", label: "htmx — save on toggle", nested: true },
  { href: "#api", label: "API Reference" },
]

checkboxRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/checkbox.json`

  return page(
    c,
    <Layout title="Checkbox — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/checkbox" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Checkbox</h1>
            <p class="text-muted-foreground">
              A real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="checkbox"&gt;</code>{" "}
              styled with shadcn polish. The native input keeps form
              submission and keyboard interaction; we layer the check and
              dash icons on top with Tailwind's{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">peer-*</code>{" "}
              variants.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              Pair with the Label component for the click-target / accessible-name
              binding.
            </p>
            <LangTabs
              id="install-checkbox"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/checkbox.tsx", source: checkboxJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/checkbox.html", source: checkboxJinjaSource, note: "Copy checkbox.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/checkbox.tmpl", source: checkboxGoSource, note: "Add checkbox.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/checkbox.ex", source: checkboxPhoenixSource, note: "Drop checkbox.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: checkboxHtmlSource, note: "Tailwind v4 + the SVG icons inline. No extra script for the check; indeterminate state needs a one-liner of JS." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — pair with a Label",
              description:
                "Click the label or the checkbox itself — the platform routes both to the same input.",
              narrative: (
                <p>
                  Always pair a checkbox with a visible label. The accessible
                  name comes from the linked{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;label&gt;</code>,
                  not from a placeholder or surrounding text. Without it,
                  screen readers announce just "checkbox, checked" — useless.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<input type=\"checkbox\">",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox",
                },
                {
                  source: "APG",
                  label: "Checkbox (dual-state) pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
                },
              ],
              preview: (
                <div class="flex items-center gap-2">
                  <Checkbox id="ex-basic-cb" name="terms" />
                  <Label htmlFor="ex-basic-cb">I agree to the terms.</Label>
                </div>
              ),
              jsx: `<div class="flex items-center gap-2">
  <Checkbox id="terms" name="terms" required />
  <Label htmlFor="terms">I agree to the terms.</Label>
</div>`,
              jinja: `<div class="flex items-center gap-2">
  {{ checkbox(id="terms", name="terms", required=true) }}
  {{ label("I agree to the terms.", for_="terms") }}
</div>`,
              go: `<div class="flex items-center gap-2">
  {{template "checkbox" (dict "ID" "terms" "Name" "terms" "Required" true)}}
  {{template "label"    (dict "For" "terms" "Text" "I agree to the terms.")}}
</div>`,
              phoenix: `<div class="flex items-center gap-2">
  <.checkbox id="terms" name="terms" required />
  <.label for="terms">I agree to the terms.</.label>
</div>`,
            })}

            {await Example({
              id: "ex-states",
              title: "Checked + disabled + invalid",
              description:
                "All states come from native attributes; no JavaScript needed.",
              narrative: (
                <p>
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">checked</code>{" "}
                  pre-selects the box,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  removes it from form submission,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid="true"</code>{" "}
                  flips the border to destructive. Pair invalid with an error
                  message via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>{" "}
                  — the same pattern as Input.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-invalid",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid",
                },
              ],
              preview: (
                <div class="grid gap-3">
                  <div class="flex items-center gap-2">
                    <Checkbox id="ex-state-checked" checked />
                    <Label htmlFor="ex-state-checked">Pre-checked</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="ex-state-disabled" disabled />
                    <Label htmlFor="ex-state-disabled">Disabled</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="ex-state-disabled-checked" disabled checked />
                    <Label htmlFor="ex-state-disabled-checked">Disabled + checked</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="ex-state-invalid" ariaInvalid ariaDescribedby="ex-state-invalid-err" />
                    <Label htmlFor="ex-state-invalid">Required option</Label>
                  </div>
                  <p id="ex-state-invalid-err" class="-mt-1 text-xs text-destructive">
                    You need to accept this to continue.
                  </p>
                </div>
              ),
              jsx: `<Checkbox checked />
<Checkbox disabled />
<Checkbox disabled checked />
<Checkbox ariaInvalid ariaDescribedby="my-err" />`,
              jinja: `{{ checkbox(checked=true) }}
{{ checkbox(disabled=true) }}
{{ checkbox(disabled=true, checked=true) }}
{{ checkbox(aria_invalid=true, aria_describedby="my-err") }}`,
              go: `{{template "checkbox" (dict "Checked" true)}}
{{template "checkbox" (dict "Disabled" true)}}
{{template "checkbox" (dict "Disabled" true "Checked" true)}}
{{template "checkbox" (dict "AriaInvalid" "true" "AriaDescribedby" "my-err")}}`,
              phoenix: `<.checkbox checked />
<.checkbox disabled />
<.checkbox disabled checked />
<.checkbox aria-invalid="true" aria-describedby="my-err" />`,
            })}

            {await Example({
              id: "ex-indeterminate",
              title: "Indeterminate — set from JS",
              description:
                "Indeterminate is a property, not an HTML attribute. The page sets it on mount; clicking it picks a definite state.",
              narrative: (
                <p>
                  Indeterminate doesn't exist as an HTML attribute — it's a
                  DOM property you set in JavaScript (the page below does:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">el.indeterminate = true</code>
                  ). Use it for tri-state UIs: the classic "select all" row
                  that's neither fully checked nor fully unchecked.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: ":indeterminate pseudo",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate",
                },
              ],
              preview: (
                <div class="flex flex-col gap-3">
                  <div class="flex items-center gap-2">
                    <Checkbox id="ex-ind-parent" {...({ "data-initial-indeterminate": "true" } as any)} />
                    <Label htmlFor="ex-ind-parent">Select all (3 items, 1 selected)</Label>
                  </div>
                  <div class="ml-6 flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <Checkbox id="ex-ind-child-1" checked />
                      <Label htmlFor="ex-ind-child-1">Item 1</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox id="ex-ind-child-2" />
                      <Label htmlFor="ex-ind-child-2">Item 2</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox id="ex-ind-child-3" />
                      <Label htmlFor="ex-ind-child-3">Item 3</Label>
                    </div>
                  </div>
                </div>
              ),
              jsx: `<Checkbox id="select-all" /* set indeterminate=true from JS once mounted */ />`,
              jinja: `{{ checkbox(id="select-all") }}
<script>document.getElementById('select-all').indeterminate = true</script>`,
              go: `{{template "checkbox" (dict "ID" "select-all")}}
<script>document.getElementById('select-all').indeterminate = true</script>`,
              phoenix: `<.checkbox id="select-all" phx-hook="MarkIndeterminate" />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — save on toggle",
              description:
                "hx-trigger=\"change\" posts the new state on every toggle. The endpoint records it and (here) returns 204.",
              narrative: (
                <p>
                  For "save on every click" controls (favourite, follow, mute)
                  fire on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change</code>{" "}
                  and use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="none"</code>{" "}
                  when the server doesn't need to return new UI. If you do
                  return HTML, swap the row outerHTML so a pending icon or
                  count can update in lockstep.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (change)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
                {
                  source: "htmx",
                  label: "hx-swap (none)",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
              ],
              preview: (
                <div class="flex items-center gap-2">
                  <Checkbox
                    id="ex-htmx-fav"
                    name="favorite"
                    hx-post="/checkbox/save"
                    hx-trigger="change"
                    hx-swap="none"
                  />
                  <Label htmlFor="ex-htmx-fav">Favourite (saves on every toggle)</Label>
                </div>
              ),
              jsx: `<Checkbox name="favorite"
          hx-post="/api/favorite" hx-trigger="change" hx-swap="none" />`,
              jinja: `{{ checkbox(name="favorite",
            hx_post="/api/favorite", hx_trigger="change", hx_swap="none") }}`,
              go: `{{template "checkbox" (dict
  "Name" "favorite"
  "Attrs" (dict "hx-post" "/api/favorite" "hx-trigger" "change" "hx-swap" "none")
)}}`,
              phoenix: `<.checkbox name="favorite"
            hx-post="/api/favorite" hx-trigger="change" hx-swap="none" />`,
            })}
          </section>
          <ApiTable
            title="<Checkbox>"
            rows={CHECKBOX_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
      {/* Tiny script for the indeterminate demo. Has to run on every render
          because the indeterminate property is JS-only. */}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: docs-only inline
        dangerouslySetInnerHTML={{
          __html: `document.querySelectorAll('[data-initial-indeterminate="true"]').forEach(function(el){el.indeterminate=true})`,
        }}
      />
    </Layout>,
  )
})

checkboxRoutes.post("/save", (c) => c.body(null, 204))
