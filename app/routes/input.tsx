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
import { INPUT_PROPS } from "@/app/data/api-rows"
import { Input } from "@/registry/ui/input"

export const inputRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  inputJsxSource,
  inputJinjaSource,
  inputGoSource,
  inputPhoenixSource,
  inputHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/input.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/input.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/input.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/input.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/input.html"), "utf8"),
])

const usageJsx = `import { Input } from "@/components/ui/input"

<Input type="email" name="email" placeholder="you@example.com" required />`

const usageJinja = `{% from "components/input.html" import input %}

{{ input(type="email", name="email", placeholder="you@example.com", required=true) }}`

const usageGo = `tpl.ExecuteTemplate(w, "input", map[string]any{
    "Type": "email",
    "Name": "email",
    "Placeholder": "you@example.com",
    "Required": true,
})`

const usagePhoenix = `<.input type="email" name="email" placeholder="you@example.com" required />`

const usageHtml = `<input type="email" name="email" placeholder="you@example.com" required
       class="flex h-9 w-full min-w-0 rounded-md border border-input
              bg-transparent px-3 py-1 text-base shadow-xs … " />`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-types", label: "Types", nested: true },
  { href: "#ex-invalid", label: "Invalid + error", nested: true },
  { href: "#ex-states", label: "Disabled / readonly", nested: true },
  { href: "#ex-htmx-search", label: "htmx live search", nested: true },
  { href: "#ex-htmx-validate", label: "htmx live validate", nested: true },
  { href: "#api", label: "API Reference" },
]

inputRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/input.json`

  return page(
    c,
    <Layout title="Input — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/input" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Input</h1>
            <p class="text-muted-foreground">
              A real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input&gt;</code>{" "}
              with shadcn polish. All native constraint validation, mobile
              keyboard hints, and autofill keep working — we only restyle.
              htmx attributes ride along, so live search and live validation
              are a few attributes away.
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
              id="install-input"
              panels={[
                {
                  lang: "jsx",
                  node: (
                    <div class="space-y-5">
                      <div class="space-y-2">
                        <p class="text-sm font-medium">1. Install via the shadcn CLI</p>
                        {await CodeBlock({ code: cliCmd, lang: "bash" })}
                      </div>
                      <div class="space-y-2">
                        <p class="text-sm font-medium">2. Use it</p>
                        {await CodeBlock({ code: usageJsx, lang: "tsx", filename: "app/some-page.tsx" })}
                      </div>
                      <details class="group rounded-lg border bg-muted/20">
                        <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                          <span class="inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            Or copy the source manually
                          </span>
                        </summary>
                        <div class="border-t bg-background p-4">
                          {await CodeBlock({ code: inputJsxSource, lang: "tsx", filename: "components/ui/input.tsx" })}
                        </div>
                      </details>
                    </div>
                  ),
                },
                {
                  lang: "jinja",
                  node: (
                    <div class="space-y-5">
                      <div class="space-y-2">
                        <p class="text-sm font-medium">1. Save the macro</p>
                        <p class="text-xs text-muted-foreground">
                          Copy <code class="rounded bg-muted px-1 py-0.5">input.html</code> into{" "}
                          <code class="rounded bg-muted px-1 py-0.5">templates/components/</code>.
                        </p>
                      </div>
                      <div class="space-y-2">
                        <p class="text-sm font-medium">2. Use it</p>
                        {await CodeBlock({ code: usageJinja, lang: "html", filename: "templates/page.html" })}
                      </div>
                      <details class="group rounded-lg border bg-muted/20">
                        <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                          <span class="inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            Source — input.html
                          </span>
                        </summary>
                        <div class="border-t bg-background p-4">
                          {await CodeBlock({ code: inputJinjaSource, lang: "html", filename: "templates/components/input.html" })}
                        </div>
                      </details>
                    </div>
                  ),
                },
                {
                  lang: "go",
                  node: (
                    <div class="space-y-5">
                      <div class="space-y-2">
                        <p class="text-sm font-medium">1. Save the template</p>
                        <p class="text-xs text-muted-foreground">
                          Copy <code class="rounded bg-muted px-1 py-0.5">input.tmpl</code> into your{" "}
                          <code class="rounded bg-muted px-1 py-0.5">templates/</code> tree.
                        </p>
                      </div>
                      <div class="space-y-2">
                        <p class="text-sm font-medium">2. Use it</p>
                        {await CodeBlock({ code: usageGo, lang: "html", filename: "handler.go" })}
                      </div>
                      <details class="group rounded-lg border bg-muted/20">
                        <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                          <span class="inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            Source — input.tmpl
                          </span>
                        </summary>
                        <div class="border-t bg-background p-4">
                          {await CodeBlock({ code: inputGoSource, lang: "html", filename: "templates/components/input.tmpl" })}
                        </div>
                      </details>
                    </div>
                  ),
                },
                {
                  lang: "phoenix",
                  node: (
                    <div class="space-y-5">
                      <div class="space-y-2">
                        <p class="text-sm font-medium">1. Save the component module</p>
                        <p class="text-xs text-muted-foreground">
                          Copy <code class="rounded bg-muted px-1 py-0.5">input.ex</code> into{" "}
                          <code class="rounded bg-muted px-1 py-0.5">lib/my_app_web/components/</code>.
                        </p>
                      </div>
                      <div class="space-y-2">
                        <p class="text-sm font-medium">2. Use it</p>
                        {await CodeBlock({ code: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/live/page.html.heex" })}
                      </div>
                      <details class="group rounded-lg border bg-muted/20">
                        <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                          <span class="inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            Source — input.ex
                          </span>
                        </summary>
                        <div class="border-t bg-background p-4">
                          {await CodeBlock({ code: inputPhoenixSource, lang: "elixir", filename: "lib/my_app_web/components/input.ex" })}
                        </div>
                      </details>
                    </div>
                  ),
                },
                {
                  lang: "html",
                  node: (
                    <div class="space-y-5">
                      <div class="space-y-2">
                        <p class="text-sm font-medium">1. Load Tailwind</p>
                        <p class="text-xs text-muted-foreground">
                          See the Button page for the Tailwind + htmx CDN setup.
                        </p>
                      </div>
                      <div class="space-y-2">
                        <p class="text-sm font-medium">2. Paste the input markup</p>
                        {await CodeBlock({ code: usageHtml, lang: "html", filename: "index.html" })}
                      </div>
                      <details class="group rounded-lg border bg-muted/20">
                        <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                          <span class="inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            Snippets — types, states, htmx wiring
                          </span>
                        </summary>
                        <div class="border-t bg-background p-4">
                          {await CodeBlock({ code: inputHtmlSource, lang: "html", filename: "snippets/input.html" })}
                        </div>
                      </details>
                    </div>
                  ),
                },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-types",
              title: "Types — the browser already knows",
              description:
                "type changes validation, keyboard, autofill, and screen-reader announcements all at once.",
              narrative: (
                <p>
                  Every HTML5 input type is a contract with the platform:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">email</code>{" "}
                  brings constraint validation + an @ key,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tel</code>{" "}
                  swaps the keyboard to digits,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">date</code>{" "}
                  opens a native picker,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">search</code>{" "}
                  draws the clear-text affordance and announces itself as a
                  search box. Reach for the right type before reaching for
                  JavaScript.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<input> element — all types",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input",
                },
                {
                  source: "MDN",
                  label: "inputmode (mobile keyboard hint)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <Input type="email" name="email" placeholder="you@example.com" autocomplete="email" ariaLabel="Email" />
                  <Input type="tel" name="phone" placeholder="+90 555 …" autocomplete="tel" inputmode="tel" ariaLabel="Phone" />
                  <Input type="number" name="amount" placeholder="0.00" inputmode="decimal" ariaLabel="Amount" />
                  <Input type="date" name="when" ariaLabel="When" />
                  <Input type="search" name="q" placeholder="Search…" autocomplete="off" ariaLabel="Search" />
                </div>
              ),
              jsx: `<Input type="email"  name="email" placeholder="you@example.com" />
<Input type="tel"    name="phone" inputmode="tel"  placeholder="+90 555 …" />
<Input type="number" name="amount" inputmode="decimal" placeholder="0.00" />
<Input type="date"   name="when" />
<Input type="search" name="q" placeholder="Search…" />`,
              jinja: `{{ input(type="email",  name="email", placeholder="you@example.com") }}
{{ input(type="tel",    name="phone", inputmode="tel",  placeholder="+90 555 …") }}
{{ input(type="number", name="amount", inputmode="decimal", placeholder="0.00") }}
{{ input(type="date",   name="when") }}
{{ input(type="search", name="q", placeholder="Search…") }}`,
              go: `{{template "input" (dict "Type" "email"  "Name" "email"  "Placeholder" "you@example.com")}}
{{template "input" (dict "Type" "tel"    "Name" "phone"  "InputMode" "tel"  "Placeholder" "+90 555 …")}}
{{template "input" (dict "Type" "number" "Name" "amount" "InputMode" "decimal" "Placeholder" "0.00")}}
{{template "input" (dict "Type" "date"   "Name" "when")}}
{{template "input" (dict "Type" "search" "Name" "q"      "Placeholder" "Search…")}}`,
              phoenix: `<.input type="email"  name="email" placeholder="you@example.com" />
<.input type="tel"    name="phone" inputmode="tel"  placeholder="+90 555 …" />
<.input type="number" name="amount" inputmode="decimal" placeholder="0.00" />
<.input type="date"   name="when" />
<.input type="search" name="q" placeholder="Search…" />`,
            })}

            {await Example({
              id: "ex-invalid",
              title: "Invalid + error message",
              description:
                "aria-invalid styles the field; aria-describedby connects it to the error text.",
              narrative: (
                <p>
                  Don't rely on red alone — pair{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid="true"</code>{" "}
                  with a visible error <em>and</em>{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>{" "}
                  pointing at it. Screen readers will read the error after the
                  field's label, so the user hears both context and what to fix.
                  The browser's native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">:invalid</code>{" "}
                  pseudo only fires after a submit attempt — you usually want
                  the explicit attribute instead.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-invalid",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid",
                },
                {
                  source: "MDN",
                  label: "aria-describedby",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby",
                },
                {
                  source: "WCAG",
                  label: "3.3.1 Error Identification",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <label class="text-xs font-medium" for="ex-invalid-email">
                    Email
                  </label>
                  <Input
                    id="ex-invalid-email"
                    type="email"
                    name="email"
                    value="not-an-email"
                    ariaInvalid
                    ariaDescribedby="ex-invalid-email-error"
                  />
                  <p id="ex-invalid-email-error" class="text-sm text-destructive">
                    Enter a valid email address.
                  </p>
                </div>
              ),
              jsx: `<label htmlFor="email">Email</label>
<Input id="email" type="email" name="email"
       value={value} ariaInvalid={!valid}
       ariaDescribedby={!valid ? "email-error" : undefined} />
{!valid && <p id="email-error" class="text-sm text-destructive">
  Enter a valid email address.
</p>}`,
              jinja: `<label for="email">Email</label>
{{ input(id="email", type="email", name="email",
         value=value, aria_invalid=(not valid),
         aria_describedby=("email-error" if not valid else none)) }}
{% if not valid %}
  <p id="email-error" class="text-sm text-destructive">
    Enter a valid email address.
  </p>
{% endif %}`,
              go: `{{template "input" (dict
  "ID" "email" "Type" "email" "Name" "email"
  "Value" .Value "AriaInvalid" (ternary "true" "" (not .Valid))
  "AriaDescribedby" (ternary "email-error" "" (not .Valid))
)}}`,
              phoenix: `<label for="email">Email</label>
<.input id="email" type="email" name="email"
        value={@value}
        aria-invalid={if !@valid, do: "true"}
        aria-describedby={if !@valid, do: "email-error"} />`,
            })}

            {await Example({
              id: "ex-states",
              title: "Disabled vs. readonly",
              description:
                "Two different contracts. Disabled removes the field entirely; readonly keeps it focusable + selectable.",
              narrative: (
                <p>
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  is total: no focus, no events, value not submitted with the
                  form.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">readonly</code>{" "}
                  is gentler: the user can focus, select, and copy the value;
                  it just can't be edited, and it{" "}
                  <em>does</em> submit with the form. Use readonly for
                  pre-filled IDs and computed values; reach for disabled when
                  the field literally doesn't apply yet.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "input disabled",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled",
                },
                {
                  source: "MDN",
                  label: "input readonly",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-muted-foreground" for="ex-disabled-1">
                      Disabled
                    </label>
                    <Input id="ex-disabled-1" disabled value="Cannot focus or edit" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-muted-foreground" for="ex-readonly-1">
                      Readonly
                    </label>
                    <Input id="ex-readonly-1" readonly value="https://example.com/abc-123" />
                  </div>
                </div>
              ),
              jsx: `<Input disabled value="Cannot focus or edit" />
<Input readonly value="https://example.com/abc-123" />`,
              jinja: `{{ input(disabled=true, value="Cannot focus or edit") }}
{{ input(readonly=true, value="https://example.com/abc-123") }}`,
              go: `{{template "input" (dict "Disabled" true "Value" "Cannot focus or edit")}}
{{template "input" (dict "Readonly" true "Value" "https://example.com/abc-123")}}`,
              phoenix: `<.input disabled value="Cannot focus or edit" />
<.input readonly value="https://example.com/abc-123" />`,
            })}

            {await Example({
              id: "ex-htmx-search",
              title: "htmx — live search",
              description:
                "Type into the box. htmx debounces by 300ms then GETs /input/search, the server returns a tiny HTML list, which replaces the results node.",
              narrative: (
                <p>
                  The whole pattern is one element + four attributes — no
                  state, no client logic, no JSON.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">input changed delay:300ms</code>{" "}
                  fires after the user pauses typing.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  picks the destination,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="innerHTML"</code>{" "}
                  replaces its contents. While in flight, htmx adds{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.htmx-request</code>{" "}
                  to the input so the field dims itself.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (changed, delay)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
                {
                  source: "htmx",
                  label: "hx-target",
                  href: "https://htmx.org/attributes/hx-target/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <label class="text-xs font-medium" for="ex-search">
                    Search
                  </label>
                  <Input
                    id="ex-search"
                    type="search"
                    name="q"
                    placeholder="Type to search…"
                    autocomplete="off"
                    hx-get="/input/search"
                    hx-target="#ex-search-results"
                    hx-trigger="input changed delay:300ms, search"
                  />
                  <ul id="ex-search-results" class="space-y-1 text-sm text-muted-foreground" aria-live="polite">
                    <li>Results appear here.</li>
                  </ul>
                </div>
              ),
              jsx: `<Input type="search" name="q" placeholder="Type to search…"
       hx-get="/api/search" hx-target="#results"
       hx-trigger="input changed delay:300ms, search" />
<ul id="results" aria-live="polite"></ul>`,
              jinja: `{{ input(type="search", name="q",
         hx_get="/api/search", hx_target="#results",
         hx_trigger="input changed delay:300ms, search") }}
<ul id="results" aria-live="polite"></ul>`,
              go: `{{template "input" (dict
  "Type" "search" "Name" "q"
  "Attrs" (dict
    "hx-get" "/api/search"
    "hx-target" "#results"
    "hx-trigger" "input changed delay:300ms, search"
  )
)}}`,
              phoenix: `<.input type="search" name="q"
        hx-get="/api/search" hx-target="#results"
        hx-trigger="input changed delay:300ms, search" />
<ul id="results" aria-live="polite"></ul>`,
            })}

            {await Example({
              id: "ex-htmx-validate",
              title: "htmx — live server validation",
              description:
                "On blur, the server checks the value and returns either the field as valid or as aria-invalid with an error message attached.",
              narrative: (
                <p>
                  Server-side validation belongs on the server. With htmx you
                  let the server own the truth and just swap its HTML back in.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="blur"</code>{" "}
                  checks only after the user leaves the field;{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="outerHTML"</code>{" "}
                  replaces the whole field, so the server can flip{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code>{" "}
                  and inject the error message in one shot.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (blur)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
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
                <div class="grid w-full max-w-md gap-2">
                  <label class="text-xs font-medium" for="ex-validate-email">
                    Email (validated on blur)
                  </label>
                  <div id="ex-validate-email-field" class="grid gap-2">
                    <Input
                      id="ex-validate-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      hx-post="/input/validate-email"
                      hx-trigger="blur"
                      hx-target="#ex-validate-email-field"
                      hx-swap="outerHTML"
                    />
                  </div>
                </div>
              ),
              jsx: `<Input id="email" type="email" name="email"
       hx-post="/api/validate-email"
       hx-trigger="blur" hx-swap="outerHTML" />`,
              jinja: `{{ input(id="email", type="email", name="email",
         hx_post="/api/validate-email",
         hx_trigger="blur", hx_swap="outerHTML") }}`,
              go: `{{template "input" (dict
  "ID" "email" "Type" "email" "Name" "email"
  "Attrs" (dict
    "hx-post" "/api/validate-email"
    "hx-trigger" "blur"
    "hx-swap" "outerHTML"
  )
)}}`,
              phoenix: `<.input id="email" type="email" name="email"
        hx-post="/api/validate-email"
        hx-trigger="blur" hx-swap="outerHTML" />`,
            })}
          </section>
          <ApiTable
            title="<Input>"
            rows={INPUT_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ─── htmx endpoints for the live demos ──────────────────────────────

const SEARCH_CORPUS = [
  "Button",
  "Input",
  "Label",
  "Checkbox",
  "Dialog",
  "Tabs",
  "Select",
  "Switch",
  "Radio Group",
  "Tooltip",
]

inputRoutes.post("/search", async (c) => {
  const body = await c.req.parseBody()
  return searchResponse(c, String(body.q ?? ""))
})

inputRoutes.get("/search", (c) => {
  return searchResponse(c, c.req.query("q") ?? "")
})

function searchResponse(c: any, q: string) {
  const query = q.trim().toLowerCase()
  if (!query) {
    return c.html(<li>Type something above to see matches.</li>)
  }
  const hits = SEARCH_CORPUS.filter((s) => s.toLowerCase().includes(query))
  if (hits.length === 0) {
    return c.html(<li>No matches for "{q}".</li>)
  }
  return c.html(
    <>
      {hits.map((h) => (
        <li class="text-foreground">— {h}</li>
      ))}
    </>,
  )
}

inputRoutes.post("/validate-email", async (c) => {
  const body = await c.req.parseBody()
  const value = String(body.email ?? "")
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  if (valid) {
    return c.html(
      <div id="ex-validate-email-field" class="grid gap-2">
        <Input
          id="ex-validate-email"
          type="email"
          name="email"
          value={value}
          placeholder="you@example.com"
          hx-post="/input/validate-email"
          hx-trigger="blur"
          hx-target="#ex-validate-email-field"
          hx-swap="outerHTML"
        />
      </div>,
    )
  }
  return c.html(
    <div id="ex-validate-email-field" class="grid gap-2">
      <Input
        id="ex-validate-email"
        type="email"
        name="email"
        value={value}
        ariaInvalid
        ariaDescribedby="ex-validate-email-error"
        placeholder="you@example.com"
        hx-post="/input/validate-email"
        hx-trigger="blur"
        hx-target="#ex-validate-email-field"
        hx-swap="outerHTML"
      />
      <p id="ex-validate-email-error" class="text-sm text-destructive">
        That doesn't look like a valid email.
      </p>
    </div>,
  )
})
