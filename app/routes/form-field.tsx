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
import { FORM_FIELD_PROPS } from "@/app/data/api-rows"
import { FormField, FormFieldset } from "@/registry/ui/form-field"
import { Input } from "@/registry/ui/input"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export const formFieldRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/form-field.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/form-field.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/form-field.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/form_field.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/form-field.html"), "utf8"),
])

const usageJsx = `import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"

<FormField for="email" label="Email"
           description="We'll never share it."
           error={errors.email}>
  <Input id="email" type="email" name="email" />
</FormField>`

const usageJinja = `{% from "components/form-field.html" import form_field %}
{% from "components/input.html" import input %}

{% call form_field(for_="email", label="Email",
                   description="We'll never share it.",
                   error=errors.email) %}
  {{ input(id="email", name="email", type="email",
           aria_describedby="email-description email-error",
           aria_invalid=(errors.email is not none)) }}
{% endcall %}`

const usageGo = `tpl.ExecuteTemplate(w, "form-field", FormFieldArgs{
    For:         "email",
    Label:       "Email",
    Description: "We'll never share it.",
    Error:       errs["email"],
    Control: template.HTML(\`<input id="email" name="email" type="email"
        aria-describedby="email-description email-error" …>\`),
})`

const usagePhoenix = `<.form_field for="email" label="Email"
             description="We'll never share it."
             error={@errors[:email]}>
  <.input id="email" name="email" type="email"
          aria-describedby="email-description email-error"
          aria-invalid={@errors[:email] && "true"} />
</.form_field>`

const usageHtml = `<div data-slot="form-field"
     class="grid gap-2 [&:has(:user-invalid)_[data-slot=form-field-label]]:text-destructive">
  <label for="email" data-slot="form-field-label" class="…">Email</label>
  <input id="email" name="email" type="email"
         aria-describedby="email-description" class="…" />
  <p id="email-description" class="text-sm text-muted-foreground">We'll never share it.</p>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Label + description", nested: true },
  { href: "#ex-invalid", label: "Error + :user-invalid", nested: true },
  { href: "#ex-fieldset", label: "Fieldset group", nested: true },
  { href: "#ex-htmx", label: "htmx blur validation", nested: true },
  { href: "#api", label: "API Reference" },
]

formFieldRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/form-field.json`

  return page(
    c,
    <Layout title="Form Field — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/form-field" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Form Field</h1>
            <p class="text-muted-foreground">
              A field-row wrapper that composes a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;label&gt;</code>,
              a control, a description, and an error — auto-wiring{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-describedby</code>{" "}
              and a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">:user-invalid</code>{" "}
              styling hook. No client form runtime: the server owns the truth,
              the platform owns the wiring.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. Use the shadcn CLI for JSX, or copy the
              source for your template engine.
            </p>
            <LangTabs
              id="install-form-field"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/form-field.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/form-field.html",
                    source: jinjaSource,
                    note: "Copy form-field.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/form-field.tmpl",
                    source: goSource,
                    note: "Add form-field.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/form_field.ex",
                    source: phoenixSource,
                    note: "Drop form_field.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/form-field.html",
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

            {await Example({
              id: "ex-basic",
              title: "Label + description",
              description:
                "The row wires the label's `for` to the control id and the control's aria-describedby to the description — automatically.",
              narrative: (
                <p>
                  Pass the control as the child and an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">for</code>{" "}
                  id. The field links the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;label&gt;</code>{" "}
                  to the control and points{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>{" "}
                  at the description, so a screen reader reads the label then the
                  helper text. Clicking the label focuses the input — native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;label for&gt;</code>{" "}
                  behaviour, no JS.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-describedby",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
                },
                {
                  source: "WCAG",
                  label: "3.3.2 Labels or Instructions",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <FormField
                    for="ff-basic-email"
                    label="Email"
                    description="We'll only use it to send receipts."
                  >
                    <Input
                      id="ff-basic-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autocomplete="email"
                    />
                  </FormField>
                </div>
              ),
              jsx: `<FormField for="email" label="Email"
           description="We'll only use it to send receipts.">
  <Input id="email" type="email" name="email"
         placeholder="you@example.com" />
</FormField>`,
              jinja: `{% call form_field(for_="email", label="Email",
                   description="We'll only use it to send receipts.") %}
  {{ input(id="email", name="email", type="email",
           placeholder="you@example.com",
           aria_describedby="email-description") }}
{% endcall %}`,
              go: `{{template "form-field" (dict
  "For" "email" "Label" "Email"
  "Description" "We'll only use it to send receipts."
  "Control" (htmlSafe \`<input id="email" name="email" type="email"
      aria-describedby="email-description" class="…">\`)
)}}`,
              phoenix: `<.form_field for="email" label="Email"
             description="We'll only use it to send receipts.">
  <.input id="email" name="email" type="email"
          placeholder="you@example.com"
          aria-describedby="email-description" />
</.form_field>`,
            })}

            {await Example({
              id: "ex-invalid",
              title: "Error + :user-invalid",
              description:
                "When `error` is set the field flips aria-invalid, announces the message, and the label turns red. :user-invalid keeps client errors from showing too early.",
              narrative: (
                <p>
                  Two complementary mechanisms.{" "}
                  <strong>Server-known errors:</strong> pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">error</code>{" "}
                  and the field sets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code>,
                  renders a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="alert"</code>{" "}
                  message, and wires it into{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>.{" "}
                  <strong>Client constraints:</strong> the root carries a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">:has(:user-invalid)</code>{" "}
                  hook, so a native constraint failure (e.g. a bad email) turns
                  the label red <em>only</em> after the user has interacted and
                  tried to submit — never before.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: ":user-invalid",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid",
                },
                {
                  source: "WCAG",
                  label: "3.3.1 Error Identification",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <FormField
                    for="ff-invalid-name"
                    label="Full name"
                    required
                    error="Name is required."
                  >
                    <Input id="ff-invalid-name" type="text" name="name" value="" />
                  </FormField>
                </div>
              ),
              jsx: `<FormField for="name" label="Full name" required
           error={errors.name /* "Name is required." */}>
  <Input id="name" type="text" name="name" required />
</FormField>`,
              jinja: `{% call form_field(for_="name", label="Full name",
                   required=true, error=errors.name) %}
  {{ input(id="name", name="name", type="text", required=true,
           aria_describedby="name-error",
           aria_invalid=(errors.name is not none)) }}
{% endcall %}`,
              go: `{{template "form-field" (dict
  "For" "name" "Label" "Full name" "Required" true
  "Error" .Errors.Name
  "Control" (htmlSafe \`<input id="name" name="name" type="text" required
      aria-describedby="name-error" aria-invalid="true" class="…">\`)
)}}`,
              phoenix: `<.form_field for="name" label="Full name" required
             error={@errors[:name]}>
  <.input id="name" name="name" type="text" required
          aria-describedby="name-error"
          aria-invalid={@errors[:name] && "true"} />
</.form_field>`,
            })}

            {await Example({
              id: "ex-fieldset",
              title: "Fieldset group",
              description:
                "Group related controls (radios, checkboxes) under one <legend>. Disable them all at once with the fieldset's disabled attribute.",
              narrative: (
                <p>
                  When the field is a <em>set</em> of controls, the right
                  element is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;fieldset&gt;</code>{" "}
                  with a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;legend&gt;</code>:
                  the legend becomes the group's accessible name, announced
                  before each option. A single{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  attribute on the fieldset disables every descendant control —
                  no per-input bookkeeping.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<fieldset> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset",
                },
                {
                  source: "MDN",
                  label: "<legend> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <FormFieldset
                    id="ff-plan"
                    legend="Plan"
                    description="You can change this anytime."
                  >
                    <RadioGroup name="ff-plan-choice" defaultValue="pro">
                      <label class="flex items-center gap-2 text-sm font-medium">
                        <RadioGroupItem value="hobby" id="ff-plan-hobby" name="ff-plan-choice" />
                        Hobby
                      </label>
                      <label class="flex items-center gap-2 text-sm font-medium">
                        <RadioGroupItem value="pro" id="ff-plan-pro" name="ff-plan-choice" defaultChecked />
                        Pro
                      </label>
                    </RadioGroup>
                  </FormFieldset>
                </div>
              ),
              jsx: `<FormFieldset id="plan" legend="Plan"
               description="You can change this anytime.">
  <RadioGroup name="plan" defaultValue="pro">
    <label><RadioGroupItem value="hobby" name="plan" /> Hobby</label>
    <label><RadioGroupItem value="pro" name="plan" defaultChecked /> Pro</label>
  </RadioGroup>
</FormFieldset>`,
              jinja: `{% call form_fieldset(id="plan", legend="Plan",
                      description="You can change this anytime.") %}
  <label><input type="radio" name="plan" value="hobby"> Hobby</label>
  <label><input type="radio" name="plan" value="pro" checked> Pro</label>
{% endcall %}`,
              go: `{{template "form-fieldset" (dict
  "ID" "plan" "Legend" "Plan"
  "Description" "You can change this anytime."
  "Controls" (htmlSafe \`<label><input type="radio" name="plan" value="hobby"> Hobby</label>…\`)
)}}`,
              phoenix: `<.form_fieldset id="plan" legend="Plan"
                description="You can change this anytime.">
  <label><input type="radio" name="plan" value="hobby" /> Hobby</label>
  <label><input type="radio" name="plan" value="pro" checked /> Pro</label>
</.form_fieldset>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — validate on blur",
              description:
                "On blur the server checks the value and returns the whole field, flipping error + aria-invalid in a single outerHTML swap.",
              narrative: (
                <p>
                  Server validation belongs on the server. The field becomes a
                  swap target:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="blur"</code>{" "}
                  fires when the user leaves the input,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="outerHTML"</code>{" "}
                  replaces the entire field — so the server returns the same{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;FormField&gt;</code>{" "}
                  with the error message and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code>{" "}
                  set, all wired up.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-swap (outerHTML)",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
                {
                  source: "WCAG",
                  label: "3.3.3 Error Suggestion",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <FormField
                    id="ff-htmx-field"
                    for="ff-htmx-email"
                    label="Email (validated on blur)"
                  >
                    <Input
                      id="ff-htmx-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      hx-post="/docs/form-field/validate-email"
                      hx-trigger="blur"
                      hx-target="#ff-htmx-field"
                      hx-swap="outerHTML"
                    />
                  </FormField>
                </div>
              ),
              jsx: `<FormField id="email-field" for="email" label="Email">
  <Input id="email" type="email" name="email"
         hx-post="/api/validate-email" hx-trigger="blur"
         hx-target="#email-field" hx-swap="outerHTML" />
</FormField>`,
              jinja: `{% call form_field(id="email-field", for_="email", label="Email") %}
  {{ input(id="email", name="email", type="email",
           hx_post="/api/validate-email", hx_trigger="blur",
           hx_target="#email-field", hx_swap="outerHTML") }}
{% endcall %}`,
              go: `{{template "form-field" (dict
  "For" "email" "Label" "Email"
  "Control" (htmlSafe \`<input id="email" name="email" type="email"
      hx-post="/api/validate-email" hx-trigger="blur"
      hx-target="#email-field" hx-swap="outerHTML" class="…">\`)
)}}`,
              phoenix: `<.form_field id="email-field" for="email" label="Email">
  <.input id="email" name="email" type="email"
          hx-post="/api/validate-email" hx-trigger="blur"
          hx-target="#email-field" hx-swap="outerHTML" />
</.form_field>`,
            })}
          </section>

          <ApiTable title="<FormField>" rows={FORM_FIELD_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ─── htmx endpoint for the live blur-validation demo ──────────────────

function htmxField(c: any, value: string, error?: string) {
  return c.html(
    <FormField
      id="ff-htmx-field"
      for="ff-htmx-email"
      label="Email (validated on blur)"
      error={error}
    >
      <Input
        id="ff-htmx-email"
        type="email"
        name="email"
        value={value}
        placeholder="you@example.com"
        hx-post="/docs/form-field/validate-email"
        hx-trigger="blur"
        hx-target="#ff-htmx-field"
        hx-swap="outerHTML"
      />
    </FormField>,
  )
}

formFieldRoutes.post("/validate-email", async (c) => {
  const body = await c.req.parseBody()
  const value = String(body.email ?? "")
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  return htmxField(c, value, valid ? undefined : "That doesn't look like a valid email.")
})
