/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { LangTabs } from "@/app/components/lang-tabs"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { InstallPanel } from "@/app/components/install-panel"
import { ApiTable, type ApiRow } from "@/app/components/api-table"
import { Combobox, ComboboxOption } from "@/registry/ui/combobox"
import { Label } from "@/registry/ui/label"

export const comboboxRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [cJsx, cJinja, cGo, cPhoenix, cHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/combobox.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/combobox.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/combobox.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/combobox.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/combobox.html"), "utf8"),
])

const usageJsx = `import { Combobox } from "@/components/ui/combobox"

// Static — zero JS, browser handles dropdown + filter.
<Combobox id="lang" name="lang" placeholder="Pick a language…"
  options={[{ value: "JavaScript" }, { value: "Python" }, { value: "Go" }]} />

// Server-filtered — htmx targets the <datalist>; server returns <option> tags.
<Combobox id="user" name="user" placeholder="Search users…"
  hx-get="/api/users/search"
  hx-trigger="input changed delay:200ms"
  hx-target="#user-list"
  hx-swap="innerHTML"
/>`

const usageJinja = `{% from "components/combobox.html" import combobox %}

{# Static options #}
{{ combobox(id="lang", name="lang", placeholder="Pick a language…",
            options=[{"value": "JavaScript"}, {"value": "Python"}, {"value": "Go"}]) }}

{# Server-filter — htmx populates the <datalist> #}
{{ combobox(id="user", name="user", placeholder="Search users…",
            hx_get="/api/users/search",
            hx_trigger="input changed delay:200ms",
            hx_target="#user-list",
            hx_swap="innerHTML") }}`

const usageGo = `{{/* Static options */}}
{{template "combobox" (dict "ID" "lang" "Name" "lang" "Options" $opts)}}

{{/* Server-filter — htmx populates the <datalist> */}}
{{template "combobox" (dict "ID" "user" "Name" "user"
  "HxGet" "/api/users/search" "HxTrigger" "input changed delay:200ms"
  "HxTarget" "#user-list" "HxSwap" "innerHTML")}}`

const usagePhoenix = `<%# Static options %>
<.combobox id="lang" name="lang" placeholder="Pick a language…"
  options={[%{value: "JavaScript"}, %{value: "Python"}, %{value: "Go"}]} />

<%# Server-filter — htmx populates the <datalist> %>
<.combobox id="user" name="user" placeholder="Search users…"
  hx-get={~p"/api/users/search"}
  hx-trigger="input changed delay:200ms"
  hx-target="#user-list"
  hx-swap="innerHTML" />`

const usageHtml = `<!-- Static options -->
<input type="text" id="lang" list="lang-list" autocomplete="off" class="…">
<datalist id="lang-list">
  <option value="JavaScript">
  <option value="Python">
</datalist>

<!-- Server-filter via htmx -->
<input type="text" id="user" list="user-list" autocomplete="off"
       hx-get="/api/users/search"
       hx-trigger="input changed delay:200ms"
       hx-target="#user-list"
       hx-swap="innerHTML" class="…">
<datalist id="user-list"></datalist>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-native", label: "Native (datalist)", nested: true },
  { href: "#ex-server", label: "Server (htmx)", nested: true },
  { href: "#api", label: "API Reference" },
]

const COMBOBOX_NATIVE_PROPS: ApiRow[] = [
  {
    prop: "id",
    type: "string",
    required: true,
    description: "Pairs the input with the <datalist> via list=\"{id}-list\".",
  },
  {
    prop: "options",
    type: "Array<{ value: string; label?: string }>",
    required: true,
    description: "Choices the browser will render in the native dropdown.",
    source: { badge: "MDN", label: "<datalist>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist" },
  },
  { prop: "name", type: "string", description: "Form field name." },
  {
    prop: "placeholder",
    type: "string",
    description: "Placeholder text shown when empty.",
  },
  {
    prop: "value",
    type: "string",
    description: "Initial value.",
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Native HTML required.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the input.",
  },
  { prop: "ariaLabel", type: "string", description: "Accessible name when no visible <label>." },
  { prop: "ariaLabelledby", type: "string", description: "Id of a visible label." },
  { prop: "class", type: "string", description: "Tailwind classes appended to the wrapper." },
]

const LANGUAGES = [
  "Bash", "C", "C++", "C#", "Clojure", "CoffeeScript", "Crystal", "Dart",
  "Elixir", "Elm", "Erlang", "F#", "Fortran", "Go", "Groovy",
  "Haskell", "HTML", "Java", "JavaScript", "Julia", "Kotlin",
  "Lua", "Nim", "Objective-C", "OCaml", "Perl", "PHP", "Python",
  "R", "Ruby", "Rust", "Scala", "Shell", "SQL", "Swift",
  "TypeScript", "V", "VimScript", "Zig",
]

comboboxRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/combobox.json`

  return page(
    c,
    <Layout title="Combobox — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/combobox" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Combobox</h1>
            <p class="text-muted-foreground">
              Native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input list&gt;</code>{" "}
              +{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;datalist&gt;</code>
              . The browser handles dropdown UI, filtering, click +
              keyboard selection, focus management — zero custom JS. For
              server-driven options, point{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-target</code>{" "}
              at the{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;datalist&gt;</code>
              .
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-combobox"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/combobox.tsx", source: cJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/combobox.html", source: cJinja, note: "Copy combobox.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/combobox.tmpl", source: cGo, note: "Add combobox.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/combobox.ex", source: cPhoenix, note: "Drop combobox.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: cHtml, note: "Static variant: zero JS. Server-filter variant: htmx populates the <datalist>." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-native",
              title: "Native — <input list> + <datalist>",
              description:
                "Browser handles the dropdown + filter. Best for static, known lists where you don't need custom item rendering.",
              narrative: (
                <p>
                  Native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;datalist&gt;</code>{" "}
                  is the simplest combobox: zero JS, full keyboard contract
                  comes from the platform, and AT support is solid. The
                  trade-off: option rendering is the browser's chrome, not
                  your CSS. If you need rich items (avatar + name + label),
                  use the htmx variant below.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<datalist> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist",
                },
                {
                  source: "MDN",
                  label: "<input list>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-combo-lang">Favourite language</Label>
                  <Combobox
                    id="ex-combo-lang"
                    name="lang"
                    placeholder="Type to filter…"
                    options={LANGUAGES.slice(0, 12).map((v) => ({ value: v }))}
                  />
                </div>
              ),
              jsx: `<Combobox id="lang" name="lang" placeholder="Pick a language…"
  options={[{ value: "JavaScript" }, { value: "Python" }, { value: "Go" }]} />`,
              jinja: `{{ combobox(id="lang", placeholder="Pick a language…",
            options=[{"value":"JavaScript"},{"value":"Python"},{"value":"Go"}]) }}`,
              go: `{{template "combobox" (dict "ID" "lang" "Placeholder" "Pick a language…" "Options" $opts)}}`,
              phoenix: `<.combobox id="lang" placeholder="Pick a language…"
  options={[%{value: "JavaScript"}, %{value: "Python"}, %{value: "Go"}]} />`,
            })}

            {await Example({
              id: "ex-server",
              title: "Server — htmx filter into the datalist",
              description:
                "Each keystroke (debounced 200ms) fetches /search?lang=…; the server returns <option> tags swapped into the <datalist>.",
              narrative: (
                <p>
                  Same native primitive — the htmx-driven version just
                  points{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  at the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;datalist&gt;</code>{" "}
                  instead of populating it server-side at render time. The
                  server returns{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;option value="…"&gt;</code>{" "}
                  tags. Browser handles the dropdown, filter, click, and
                  keyboard selection. **No custom JS, no race conditions.**
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Combobox pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
                },
                {
                  source: "MDN",
                  label: "role=\"combobox\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role",
                },
                {
                  source: "htmx",
                  label: "hx-trigger (delay)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-combo-server">Language</Label>
                  <Combobox
                    id="ex-combo-server"
                    name="lang"
                    placeholder={`Start typing… (try "ja")`}
                    hx-get="/combobox/search"
                    hx-trigger="input changed delay:200ms"
                    hx-target="#ex-combo-server-list"
                    hx-swap="innerHTML"
                  />
                </div>
              ),
              jsx: `<Combobox id="user" name="user"
  placeholder="Search users…"
  hx-get="/api/users/search"
  hx-trigger="input changed delay:200ms"
  hx-target="#user-list"
  hx-swap="innerHTML"
/>
{/* Server returns: <option value="Ada Lovelace"> ... */}`,
              jinja: `{{ combobox(id="user", placeholder="Search users…",
            hx_get="/api/search",
            hx_trigger="input changed delay:200ms",
            hx_target="#user-list", hx_swap="innerHTML") }}`,
              go: `{{template "combobox" (dict "ID" "user" "Placeholder" "Search users…"
  "HxGet" "/api/search" "HxTrigger" "input changed delay:200ms"
  "HxTarget" "#user-list" "HxSwap" "innerHTML")}}`,
              phoenix: `<.combobox id="user" placeholder="Search users…"
  hx-get={~p"/api/search"} hx-trigger="input changed delay:200ms"
  hx-target="#user-list" hx-swap="innerHTML" />`,
            })}
          </section>

          <ApiTable
            title="<Combobox> — native <input list> + <datalist>"
            caption={
              <>
                Props you pass to the JSX component. Anything matching{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-*</code>{" "}
                is forwarded onto the underlying{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input&gt;</code>.
                The browser handles dropdown UI, filter, click + keyboard
                selection, focus management. No custom JS.
              </>
            }
            rows={COMBOBOX_NATIVE_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// Server filter endpoint — returns role=option fragments.
// Server-filter endpoint for the docs demo. Returns <option> tags that
// htmx swaps into the <datalist> — the browser handles the rest.
comboboxRoutes.get("/search", (c) => {
  const q = (c.req.query("lang") ?? c.req.query("q") ?? "").trim().toLowerCase()
  if (q.length === 0) return c.html("")
  const matches = LANGUAGES.filter((l) => l.toLowerCase().startsWith(q)).slice(
    0,
    8,
  )
  return c.html(
    <>
      {matches.map((m) => (
        <ComboboxOption value={m} />
      ))}
    </>,
  )
})
