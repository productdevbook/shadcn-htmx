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
import { SELECT_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Select, SelectOption, SelectGroup } from "@/registry/ui/select"
import { Label } from "@/registry/ui/label"

export const selectRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  selJsxSource,
  selJinjaSource,
  selGoSource,
  selPhoenixSource,
  selHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/select.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/select.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/select.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/select.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/select.html"), "utf8"),
])

const usageJsx = `import { Select, SelectOption } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

<Label htmlFor="role">Role</Label>
<Select id="role" name="role">
  <SelectOption value="admin"  selected>Administrator</SelectOption>
  <SelectOption value="editor">Editor</SelectOption>
  <SelectOption value="viewer">Viewer</SelectOption>
</Select>`

const usageJinja = `{% from "components/select.html" import select_open, select_close, option %}
{% from "components/label.html" import label %}

{{ label("Role", for_="role") }}
{{ select_open(id="role", name="role") }}
  {{ option("admin",  "Administrator", selected=true) }}
  {{ option("editor", "Editor") }}
  {{ option("viewer", "Viewer") }}
{{ select_close() }}`

const usageGo = `{{template "label" (dict "For" "role" "Text" "Role")}}
{{template "select" (dict
  "ID" "role" "Name" "role"
  "Body" (htmlSafe \`
    <option value="admin"  selected>Administrator</option>
    <option value="editor">Editor</option>
    <option value="viewer">Viewer</option>
\`)
)}}`

const usagePhoenix = `<.label for="role">Role</.label>
<.select id="role" name="role">
  <option value="admin"  selected>Administrator</option>
  <option value="editor">Editor</option>
  <option value="viewer">Viewer</option>
</.select>`

const usageHtml = `<span class="relative inline-flex w-full">
  <select id="role" name="role" class="peer flex h-9 w-full appearance-none …">
    <option value="admin" selected>Administrator</option>
    <option value="editor">Editor</option>
    <option value="viewer">Viewer</option>
  </select>
  <svg class="absolute right-3 top-1/2 size-4 -translate-y-1/2 …">…chevron…</svg>
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-groups", label: "Groups + disabled", nested: true },
  { href: "#ex-htmx", label: "htmx — dependent select", nested: true },
  { href: "#api", label: "API Reference" },
]

selectRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/select.json`

  return page(
    c,
    <Layout title="Select — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/select" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Select</h1>
            <p class="text-muted-foreground">
              The native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;select&gt;</code>{" "}
              with a chevron icon. The browser handles the popover, type-to-search,
              keyboard navigation, and the mobile-native picker. Our styles
              are just the rounded border + ring; the rest is the platform.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-select"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/select.tsx", source: selJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/select.html", source: selJinjaSource, note: "Copy select.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/select.tmpl", source: selGoSource, note: "Add select.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/select.ex", source: selPhoenixSource, note: "Drop select.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: selHtmlSource, note: "Tailwind utilities only; no JS." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — type-to-search comes free",
              description:
                "Open the dropdown and start typing — the browser jumps to the first matching option. ↑/↓ moves between options, Enter confirms.",
              narrative: (
                <p>
                  Native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;select&gt;</code>{" "}
                  is the workhorse — desktop keyboards, mobile pickers, screen
                  reader announcement of "combobox … listbox … 3 of 5" all
                  work without code. We restyle with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">appearance-none</code>{" "}
                  and overlay a chevron; the browser still renders its own
                  dropdown when the user clicks.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<select> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select",
                },
                {
                  source: "APG",
                  label: "Combobox patterns (incl. select)",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-sel-role">Role</Label>
                  <Select id="ex-sel-role" name="role">
                    <SelectOption value="admin" selected>
                      Administrator
                    </SelectOption>
                    <SelectOption value="editor">Editor</SelectOption>
                    <SelectOption value="viewer">Viewer</SelectOption>
                  </Select>
                </div>
              ),
              jsx: `<Select id="role" name="role">
  <SelectOption value="admin"  selected>Administrator</SelectOption>
  <SelectOption value="editor">Editor</SelectOption>
  <SelectOption value="viewer">Viewer</SelectOption>
</Select>`,
              jinja: `{{ select_open(id="role", name="role") }}
  {{ option("admin",  "Administrator", selected=true) }}
  {{ option("editor", "Editor") }}
  {{ option("viewer", "Viewer") }}
{{ select_close() }}`,
              go: `{{template "select" (dict "ID" "role" "Name" "role" "Body" (htmlSafe \`
  <option value="admin"  selected>Administrator</option>
  <option value="editor">Editor</option>
  <option value="viewer">Viewer</option>
\`))}}`,
              phoenix: `<.select id="role" name="role">
  <option value="admin"  selected>Administrator</option>
  <option value="editor">Editor</option>
  <option value="viewer">Viewer</option>
</.select>`,
            })}

            {await Example({
              id: "ex-groups",
              title: "Groups + disabled items",
              description:
                "<optgroup> renders a section header (non-selectable). Disabled <option>s are skipped by keyboard navigation.",
              narrative: (
                <p>
                  Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;optgroup&gt;</code>{" "}
                  to group related options. The browser renders the group
                  label in bold and indents the children — works on every
                  platform. Disabled options stay visible but the browser
                  prevents selection and screen readers announce "dimmed".
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<optgroup> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-sel-tz">Timezone</Label>
                  <Select id="ex-sel-tz" name="timezone">
                    <SelectGroup label="Europe">
                      <SelectOption value="Europe/Istanbul" selected>
                        Istanbul (GMT+3)
                      </SelectOption>
                      <SelectOption value="Europe/Berlin">Berlin (GMT+1)</SelectOption>
                      <SelectOption value="Europe/London">London (GMT+0)</SelectOption>
                    </SelectGroup>
                    <SelectGroup label="Americas">
                      <SelectOption value="America/New_York">New York (GMT-5)</SelectOption>
                      <SelectOption value="America/Sao_Paulo" disabled>
                        São Paulo (coming soon)
                      </SelectOption>
                    </SelectGroup>
                  </Select>
                </div>
              ),
              jsx: `<Select id="tz" name="timezone">
  <SelectGroup label="Europe">
    <SelectOption value="Europe/Istanbul" selected>Istanbul</SelectOption>
    <SelectOption value="Europe/Berlin">Berlin</SelectOption>
  </SelectGroup>
  <SelectGroup label="Americas">
    <SelectOption value="America/New_York">New York</SelectOption>
    <SelectOption value="America/Sao_Paulo" disabled>São Paulo</SelectOption>
  </SelectGroup>
</Select>`,
              jinja: `{{ select_open(id="tz", name="timezone") }}
  {{ optgroup_open("Europe") }}
    {{ option("Europe/Istanbul", "Istanbul", selected=true) }}
    {{ option("Europe/Berlin",   "Berlin") }}
  {{ optgroup_close() }}
{{ select_close() }}`,
              go: `{{template "select" (dict "ID" "tz" "Name" "timezone" "Body" (htmlSafe \`
  <optgroup label="Europe">…</optgroup>
  <optgroup label="Americas">…</optgroup>
\`))}}`,
              phoenix: `<.select id="tz" name="timezone">
  <optgroup label="Europe">
    <option value="Europe/Istanbul" selected>Istanbul</option>
    <option value="Europe/Berlin">Berlin</option>
  </optgroup>
  <optgroup label="Americas">
    <option value="America/New_York">New York</option>
    <option value="America/Sao_Paulo" disabled>São Paulo</option>
  </optgroup>
</.select>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — dependent selects",
              description:
                "Pick a country; htmx GETs /select/cities, the second <select> swaps its options to match. Classic cascading dropdown without a single line of JS.",
              narrative: (
                <p>
                  Pair{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  to refresh the dependent select on every change. The server
                  returns the inner HTML of the new{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;option&gt;</code>{" "}
                  list, htmx swaps it in,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-include</code>{" "}
                  ensures the country value rides along with the request.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-include",
                  href: "https://htmx.org/attributes/hx-include/",
                },
                {
                  source: "htmx",
                  label: "hx-trigger (change)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <div class="grid gap-2">
                    <Label htmlFor="ex-sel-country">Country</Label>
                    <Select
                      id="ex-sel-country"
                      name="country"
                      hx-get="/select/cities"
                      hx-target="#ex-sel-city"
                      hx-trigger="change"
                      hx-swap="innerHTML"
                    >
                      <SelectOption value="">Pick a country…</SelectOption>
                      <SelectOption value="tr">Türkiye</SelectOption>
                      <SelectOption value="de">Deutschland</SelectOption>
                      <SelectOption value="us">United States</SelectOption>
                    </Select>
                  </div>
                  <div class="grid gap-2">
                    <Label htmlFor="ex-sel-city">City</Label>
                    <Select id="ex-sel-city" name="city">
                      <SelectOption value="">Pick a country first…</SelectOption>
                    </Select>
                  </div>
                </div>
              ),
              jsx: `<Select name="country"
        hx-get="/api/cities" hx-target="#city"
        hx-trigger="change" hx-swap="innerHTML">…</Select>

<Select id="city" name="city">
  <SelectOption value="">Pick a country first…</SelectOption>
</Select>`,
              jinja: `{{ select_open(name="country",
            hx_get="/api/cities", hx_target="#city",
            hx_trigger="change", hx_swap="innerHTML") }}
  …
{{ select_close() }}

{{ select_open(id="city", name="city") }}
  {{ option("", "Pick a country first…") }}
{{ select_close() }}`,
              go: `{{template "select" (dict "Name" "country"
  "Attrs" (dict
    "hx-get" "/api/cities"
    "hx-target" "#city"
    "hx-trigger" "change"
    "hx-swap" "innerHTML"
  )
  "Body" (htmlSafe \`…\`)
)}}`,
              phoenix: `<.select name="country"
         hx-get={~p"/api/cities"} hx-target="#city"
         hx-trigger="change" hx-swap="innerHTML">
  …
</.select>

<.select id="city" name="city">
  <option value="">Pick a country first…</option>
</.select>`,
            })}
          </section>
          <ApiTable
            title="<Select>"
            rows={SELECT_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// Cascading dropdown demo data
const CITIES: Record<string, string[]> = {
  tr: ["Istanbul", "Ankara", "İzmir", "Bursa"],
  de: ["Berlin", "Hamburg", "München", "Köln"],
  us: ["New York", "San Francisco", "Austin", "Chicago"],
}

selectRoutes.get("/cities", (c) => {
  const country = c.req.query("country") ?? ""
  const list = CITIES[country] ?? []
  if (list.length === 0) {
    return c.html(<option value="">Pick a country first…</option>)
  }
  return c.html(
    <>
      <option value="">Pick a city…</option>
      {list.map((city) => (
        <option value={city.toLowerCase()}>{city}</option>
      ))}
    </>,
  )
})
