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
import { LABEL_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Label } from "@/registry/ui/label"
import { Input } from "@/registry/ui/input"

export const labelRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  labelJsxSource,
  labelJinjaSource,
  labelGoSource,
  labelPhoenixSource,
  labelHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/label.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/label.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/label.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/label.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/label.html"), "utf8"),
])

const usageJsx = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" name="email" />`

const usageJinja = `{% from "components/label.html" import label %}
{% from "components/input.html" import input %}

{{ label("Email", for_="email") }}
{{ input(id="email", type="email", name="email") }}`

const usageGo = `tpl.ExecuteTemplate(w, "label", map[string]any{
    "Text": "Email", "For": "email",
})
tpl.ExecuteTemplate(w, "input", map[string]any{
    "ID": "email", "Type": "email", "Name": "email",
})`

const usagePhoenix = `<.label for="email">Email</.label>
<.input id="email" type="email" name="email" />`

const usageHtml = `<label for="email" data-slot="label"
       class="flex items-center gap-2 text-sm font-medium leading-none select-none">
  Email
</label>
<input id="email" type="email" name="email" class="…" />`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-explicit", label: "Explicit (htmlFor)", nested: true },
  { href: "#ex-implicit", label: "Implicit (wrapped)", nested: true },
  { href: "#ex-required", label: "Required indicator", nested: true },
  { href: "#ex-peer-disabled", label: "Peer-disabled dim", nested: true },
  { href: "#api", label: "API Reference" },
]

labelRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/label.json`

  return page(
    c,
    <Layout title="Label — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/label" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Label</h1>
            <p class="text-muted-foreground">
              A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;label&gt;</code>{" "}
              with shadcn polish. The platform already handles
              click-to-focus and the accessible-name pairing; we only
              restyle.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. The same shadcn CLI / curl flow as every
              other component.
            </p>
            <LangTabs
              id="install-label"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/label.tsx", source: labelJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/label.html", source: labelJinjaSource, note: "Copy label.html into your templates/components/ folder." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/label.tmpl", source: labelGoSource, note: "Add label.tmpl alongside button.tmpl in your templates tree." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/label.ex", source: labelPhoenixSource, note: "Drop label.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: labelHtmlSource, note: "Tailwind v4 is enough; no extra script required for Label." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-explicit",
              title: "Explicit — for points at the input id",
              description:
                "The label's for attribute matches the input's id. Click anywhere on the label and focus jumps to the input.",
              narrative: (
                <p>
                  Explicit pairing is the safest pattern: it survives layout
                  changes (wrapping in extra <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;div&gt;</code>s,
                  moving the input into a different parent). It also lets
                  screen readers compute the accessible name even when the
                  label and input aren't DOM neighbours. Rule: every form
                  field gets a label.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<label> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label",
                },
                {
                  source: "WCAG",
                  label: "3.3.2 Labels or Instructions",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-explicit-email">Email</Label>
                  <Input id="ex-explicit-email" type="email" name="email" placeholder="you@example.com" />
                </div>
              ),
              jsx: `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" name="email" />`,
              jinja: `{{ label("Email", for_="email") }}
{{ input(id="email", type="email", name="email") }}`,
              go: `{{template "label" (dict "Text" "Email" "For" "email")}}
{{template "input" (dict "ID" "email" "Type" "email" "Name" "email")}}`,
              phoenix: `<.label for="email">Email</.label>
<.input id="email" type="email" name="email" />`,
            })}

            {await Example({
              id: "ex-implicit",
              title: "Implicit — wrap the input",
              description:
                "No for/id needed: the input is a descendant of the label, so the platform pairs them automatically.",
              narrative: (
                <p>
                  Useful when you control the layout and want fewer ids
                  floating around. The catch: assistive tech still reads the{" "}
                  <em>label text</em> as the accessible name, so put the
                  label text outside the input (before or after, doesn't
                  matter — implicit pairing works either way).
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Implicit label association",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#labelable_elements",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label>
                    Email
                    <Input type="email" name="email" placeholder="you@example.com" />
                  </Label>
                </div>
              ),
              jsx: `<Label>
  Email
  <Input type="email" name="email" />
</Label>`,
              jinja: `{% call label_block() %}
  Email {{ input(type="email", name="email") }}
{% endcall %}`,
              go: `{{/* Implicit form: render the input inside the label HTML manually,
       since Go html/template doesn't have a block syntax like Jinja's caller. */}}`,
              phoenix: `<.label>
  Email <.input type="email" name="email" />
</.label>`,
            })}

            {await Example({
              id: "ex-required",
              title: "Required — visual + ARIA",
              description:
                "Add a visible marker (asterisk) and the required attribute on the input. Optionally aria-required if you can't use the native attribute.",
              narrative: (
                <p>
                  Don't rely on the asterisk alone — set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">required</code>{" "}
                  on the input so the browser blocks submit and announces the
                  state. Hide the visual asterisk from assistive tech with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-hidden="true"</code>{" "}
                  so it isn't read as "Email asterisk Email".
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "input required",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required",
                },
                {
                  source: "WCAG",
                  label: "3.3.2 Labels or Instructions",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-required-email">
                    Email <span class="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input id="ex-required-email" type="email" name="email" required placeholder="you@example.com" />
                </div>
              ),
              jsx: `<Label htmlFor="email">
  Email <span class="text-destructive" aria-hidden="true">*</span>
</Label>
<Input id="email" type="email" name="email" required />`,
              jinja: `{% call label_block(for_="email") %}
  Email <span class="text-destructive" aria-hidden="true">*</span>
{% endcall %}
{{ input(id="email", type="email", name="email", required=true) }}`,
              go: `{{/* Compose the label text in your Go code: */}}
{{template "label" (dict "For" "email" "Text" "Email *")}}
{{template "input" (dict "ID" "email" "Type" "email" "Name" "email" "Required" true)}}`,
              phoenix: `<.label for="email">
  Email <span class="text-destructive" aria-hidden="true">*</span>
</.label>
<.input id="email" type="email" name="email" required />`,
            })}

            {await Example({
              id: "ex-peer-disabled",
              title: "Peer-disabled — label dims with the input",
              description:
                "Render the input first with class=\"peer …\", then the label after it. Tailwind's peer-* variant lets the label react to the input's disabled state.",
              narrative: (
                <p>
                  No JS, no toggling classes by hand — Tailwind v4's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">peer-disabled</code>{" "}
                  variant on the label fires whenever its preceding sibling
                  (marked{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.peer</code>
                  ) carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>
                  . Visual hierarchy stays accurate even when the field's
                  state changes server-side via htmx.
                </p>
              ),
              references: [
                {
                  source: "Tailwind",
                  label: "peer-* variant",
                  href: "https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state",
                },
              ],
              preview: (
                // DOM order matters: the input must come first so the label
                // (which carries peer-disabled:) sees it as a preceding peer.
                // flex-col-reverse only flips the visual layout.
                <div class="flex w-full max-w-md flex-col-reverse gap-2">
                  <Input id="ex-peer-disabled-input" class="peer" name="locked" value="locked" disabled />
                  <Label htmlFor="ex-peer-disabled-input">
                    Locked field (label dims with the input)
                  </Label>
                </div>
              ),
              jsx: `<div class="flex flex-col-reverse gap-2">
  <Label htmlFor="locked">Locked field</Label>
  <Input id="locked" class="peer" name="locked" disabled />
</div>`,
              jinja: `<div class="flex flex-col-reverse gap-2">
  {{ label("Locked field", for_="locked") }}
  {{ input(id="locked", name="locked", extra_class="peer", disabled=true) }}
</div>`,
              go: `<div class="flex flex-col-reverse gap-2">
  {{template "label" (dict "Text" "Locked field" "For" "locked")}}
  {{template "input" (dict
    "ID" "locked" "Name" "locked" "Disabled" true
    "Attrs" (dict "class" "peer")
  )}}
</div>`,
              phoenix: `<div class="flex flex-col-reverse gap-2">
  <.label for="locked">Locked field</.label>
  <.input id="locked" name="locked" class="peer" disabled />
</div>`,
            })}
          </section>
          <ApiTable
            title="<Label>"
            rows={LABEL_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

