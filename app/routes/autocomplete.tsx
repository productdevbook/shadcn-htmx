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
import { AUTOCOMPLETE_PROPS } from "@/app/data/api-rows"
import { Autocomplete, AutocompleteOption } from "@/registry/ui/autocomplete"
import { Label } from "@/registry/ui/label"

export const autocompleteRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/autocomplete.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/autocomplete.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/autocomplete.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/autocomplete.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/autocomplete.html"), "utf8"),
  ])

const usageJsx = `import { Autocomplete } from "@/components/ui/autocomplete"

// Static suggestions — the browser filters as the user types.
<Autocomplete
  id="fruit"
  name="fruit"
  placeholder="Search fruit…"
  options={[{ value: "Apple" }, { value: "Apricot" }, { value: "Banana" }]}
/>

// Server-streamed — set endpoint and the component wires the htmx defaults
// (hx-get / hx-trigger / hx-target / hx-swap / hx-sync). The server returns
// <option> tags swapped into the bound <datalist>.
<Autocomplete id="city" name="city" placeholder="Search cities…"
  endpoint="/api/cities" />`

const usageJinja = `{% from "components/autocomplete.html" import autocomplete %}

{{ autocomplete(id="fruit", name="fruit", placeholder="Search fruit…",
                options=[{"value": "Apple"}, {"value": "Apricot"}]) }}

{# Server-streamed #}
{{ autocomplete(id="city", name="city", endpoint="/api/cities") }}`

const usageGo = `{{template "autocomplete" (dict
  "ID" "fruit" "Name" "fruit" "Placeholder" "Search fruit…"
  "Options" (list (dict "Value" "Apple") (dict "Value" "Apricot")))}}

{{/* Server-streamed */}}
{{template "autocomplete" (dict "ID" "city" "Name" "city" "Endpoint" "/api/cities")}}`

const usagePhoenix = `<.autocomplete id="fruit" name="fruit" placeholder="Search fruit…"
  options={[%{value: "Apple"}, %{value: "Apricot"}]} />

<%# Server-streamed %>
<.autocomplete id="city" name="city" endpoint={~p"/api/cities"} />`

const usageHtml = `<span data-slot="autocomplete" class="inline-block w-full">
  <input type="text" id="fruit" name="fruit" list="fruit-list"
         placeholder="Search fruit…" autocomplete="off"
         data-slot="autocomplete-input" class="…">
  <datalist id="fruit-list" data-slot="autocomplete-list">
    <option value="Apple">
    <option value="Apricot">
  </datalist>
</span>

<!-- Server-streamed: empty datalist filled by htmx on input -->
<span data-slot="autocomplete" class="inline-block w-full">
  <input type="text" id="city" name="city" list="city-list"
         hx-get="/api/cities" hx-trigger="input changed delay:200ms"
         hx-target="#city-list" hx-swap="innerHTML" hx-sync="this:replace"
         autocomplete="off" data-slot="autocomplete-input" class="…">
  <datalist id="city-list" data-slot="autocomplete-list"></datalist>
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Static suggestions", nested: true },
  { href: "#ex-server", label: "Server-streamed", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- Demo data + helpers -------------------------------------------------

const CITIES = [
  "Amsterdam",
  "Athens",
  "Auckland",
  "Bangkok",
  "Barcelona",
  "Beijing",
  "Berlin",
  "Bern",
  "Boston",
  "Brussels",
  "Cairo",
  "Cape Town",
  "Chicago",
  "Copenhagen",
  "Dublin",
  "Helsinki",
  "Istanbul",
  "Lisbon",
  "London",
  "Madrid",
  "Melbourne",
  "Montreal",
  "Oslo",
  "Paris",
  "Prague",
  "Rome",
  "Seattle",
  "Stockholm",
  "Sydney",
  "Tokyo",
  "Toronto",
  "Vienna",
  "Warsaw",
  "Zurich",
]

function matchCities(query: string): string[] {
  const s = query.trim().toLowerCase()
  if (s.length === 0) return []
  return CITIES.filter((c) => c.toLowerCase().startsWith(s)).slice(0, 8)
}

autocompleteRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/autocomplete.json`

  return page(
    c,
    <Layout title="Autocomplete — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/autocomplete" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Autocomplete</h1>
            <p class="text-muted-foreground">
              A free-text input with native typeahead — a real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input list&gt;</code>{" "}
              bound to a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;datalist&gt;</code>
              . The browser owns the dropdown, filtering, and selection; htmx
              can stream a fresh set of{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;option&gt;</code>{" "}
              tags in as you type. The light native sibling of the APG
              combobox — it suggests, it doesn't constrain.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-autocomplete"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/autocomplete.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/autocomplete.html", source: jinjaSource, note: "Copy autocomplete.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/autocomplete.tmpl", source: goSource, note: "Add autocomplete.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/autocomplete.ex", source: phoenixSource, note: "Drop autocomplete.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/autocomplete.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Static suggestions",
              description:
                "Fill the <datalist> at render time. The browser filters the suggestions as the user types and lets them pick one — or type something entirely different, since the value is free text.",
              narrative: (
                <p>
                  An autocomplete is just{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input list&gt;</code>{" "}
                  pointed at a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;datalist&gt;</code>{" "}
                  of{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;option&gt;</code>{" "}
                  values. The browser renders the dropdown, does the substring
                  filtering, and handles click / Up-Down / Enter selection and
                  Escape — there is no JavaScript of ours involved. Per MDN, a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;datalist&gt;</code>{" "}
                  is not a replacement for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;select&gt;</code>
                  : the control still accepts any value, so reach for this when
                  you want to <em>suggest</em>, not <em>constrain</em>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<datalist>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist",
                },
                {
                  source: "MDN",
                  label: "<input> list attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list",
                },
              ],
              preview: (
                <div class="grid w-full max-w-sm gap-2">
                  <Label htmlFor="ex-ac-fruit">Favourite fruit</Label>
                  <Autocomplete
                    id="ex-ac-fruit"
                    name="fruit"
                    placeholder="Search fruit…"
                    options={[
                      { value: "Apple" },
                      { value: "Apricot" },
                      { value: "Banana" },
                      { value: "Blackberry" },
                      { value: "Blueberry" },
                      { value: "Cherry" },
                      { value: "Mango" },
                      { value: "Peach" },
                    ]}
                  />
                </div>
              ),
              jsx: `<Autocomplete id="fruit" name="fruit" placeholder="Search fruit…"
  options={[{ value: "Apple" }, { value: "Apricot" }, { value: "Banana" }]} />`,
              jinja: `{{ autocomplete(id="fruit", name="fruit", placeholder="Search fruit…",
                options=[{"value": "Apple"}, {"value": "Apricot"}]) }}`,
              go: `{{template "autocomplete" (dict "ID" "fruit" "Name" "fruit"
  "Placeholder" "Search fruit…"
  "Options" (list (dict "Value" "Apple") (dict "Value" "Apricot")))}}`,
              phoenix: `<.autocomplete id="fruit" name="fruit" placeholder="Search fruit…"
  options={[%{value: "Apple"}, %{value: "Apricot"}]} />`,
            })}

            {await Example({
              id: "ex-server",
              title: "Server-streamed suggestions",
              description:
                'Pass an endpoint and the component wires the htmx streaming defaults: each keystroke (debounced 200ms) fetches a fresh <option> set, swapped straight into the bound <datalist>. hx-sync="this:replace" cancels the in-flight request so stale suggestions never land.',
              narrative: (
                <p>
                  For large or remote data, leave the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;datalist&gt;</code>{" "}
                  empty and set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">endpoint</code>
                  . The component applies{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="input changed delay:200ms"</code>{" "}
                  to debounce typing,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target="#&lt;id&gt;-list" hx-swap="innerHTML"</code>{" "}
                  to drop the new options into the bound list, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-sync="this:replace"</code>{" "}
                  to abort a slow request when the next keystroke fires. The
                  browser re-renders the dropdown from the fresh list with no
                  code from us. Type two letters of a city below.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (input changed delay)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
                {
                  source: "htmx",
                  label: "hx-sync",
                  href: "https://htmx.org/attributes/hx-sync/",
                },
                {
                  source: "MDN",
                  label: "<datalist> listbox role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist",
                },
              ],
              preview: (
                <div class="grid w-full max-w-sm gap-2">
                  <Label htmlFor="ex-ac-city">City</Label>
                  <Autocomplete
                    id="ex-ac-city"
                    name="city"
                    placeholder={`Try "be" or "lo"…`}
                    endpoint="/docs/autocomplete/suggest"
                  />
                </div>
              ),
              jsx: `<Autocomplete id="city" name="city" placeholder="Search cities…"
  endpoint="/api/cities" />
{/* Server returns <option> tags for the query, e.g.
    <option value="Berlin"><option value="Bern"> */}`,
              jinja: `{{ autocomplete(id="city", name="city", endpoint="/api/cities") }}
{# Endpoint returns: {{ autocomplete_option("Berlin") }} #}`,
              go: `{{template "autocomplete" (dict "ID" "city" "Name" "city"
  "Endpoint" "/api/cities")}}
{{/* Endpoint returns: {{template "autocomplete_option" (dict "Value" "Berlin")}} */}}`,
              phoenix: `<.autocomplete id="city" name="city" endpoint={~p"/api/cities"} />
<%# Endpoint returns: <.autocomplete_option value="Berlin" /> %>`,
            })}
          </section>

          <ApiTable title="Autocomplete" rows={AUTOCOMPLETE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// --- htmx demo endpoint ---------------------------------------------------
// Returns a fresh <option> set for the typed query, swapped into the bound
// <datalist> (hx-target="#ex-ac-city-list"). Empty query → no options.
autocompleteRoutes.get("/suggest", (c) => {
  const q = c.req.query("city") ?? c.req.query("q") ?? ""
  const matches = matchCities(q)
  return c.html(
    <>
      {matches.map((m) => (
        <AutocompleteOption value={m} />
      ))}
    </>,
  )
})
