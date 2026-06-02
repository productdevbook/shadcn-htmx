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
import { LISTBOX_PROPS } from "@/app/data/api-rows"
import { Listbox, ListboxOption } from "@/registry/ui/listbox"
import { Label } from "@/registry/ui/label"

export const listboxRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/listbox.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/listbox.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/listbox.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/listbox.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/listbox.html"), "utf8"),
])

const usageJsx = `import { Listbox, ListboxOption } from "@/components/ui/listbox"

<Listbox ariaLabel="Favourite element" name="element">
  <ListboxOption value="H" selected>Hydrogen</ListboxOption>
  <ListboxOption value="He">Helium</ListboxOption>
  <ListboxOption value="Li">Lithium</ListboxOption>
</Listbox>

// Multi-select — Space toggles, Shift/Ctrl extend the range.
<Listbox ariaLabel="Toppings" name="toppings" multiple>
  <ListboxOption value="cheese">Cheese</ListboxOption>
  <ListboxOption value="olives" selected>Olives</ListboxOption>
</Listbox>`

const usageJinja = `{% from "components/listbox.html" import listbox_open, listbox_close, listbox_option %}

{{ listbox_open(aria_label="Favourite element", name="element") }}
  {{ listbox_option("Hydrogen", value="H", selected=true) }}
  {{ listbox_option("Helium",   value="He") }}
  {{ listbox_option("Lithium",  value="Li") }}
{{ listbox_close(name="element") }}`

const usageGo = `{{- $opts := htmlSafe (printf "%s%s%s"
  (renderOption "Hydrogen" "H" true)
  (renderOption "Helium" "He" false)
  (renderOption "Lithium" "Li" false)) -}}
{{template "listbox" (dict "AriaLabel" "Favourite element" "Name" "element" "Body" $opts)}}

{{/* Compose options with the "listbox_option" template, then pass as .Body. */}}`

const usagePhoenix = `<.listbox aria-label="Favourite element" name="element">
  <.listbox_option value="H" selected>Hydrogen</.listbox_option>
  <.listbox_option value="He">Helium</.listbox_option>
  <.listbox_option value="Li">Lithium</.listbox_option>
</.listbox>`

const usageHtml = `<ul role="listbox" data-slot="listbox" aria-label="Favourite element"
    data-orientation="vertical" tabindex="-1" class="…">
  <li role="option" data-slot="listbox-option" data-value="H" aria-selected="true" class="…">Hydrogen</li>
  <li role="option" data-slot="listbox-option" data-value="He" aria-selected="false" class="…">Helium</li>
</ul>
<input type="hidden" name="element" data-listbox-value="">
<!-- inline boot <script> sets the roving tabindex + seeds the hidden value -->`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Single-select", nested: true },
  { href: "#ex-multi", label: "Multi-select", nested: true },
  { href: "#ex-native", label: "Native fallback", nested: true },
  { href: "#api", label: "API Reference" },
]

const ELEMENTS = [
  { value: "H", label: "Hydrogen" },
  { value: "He", label: "Helium" },
  { value: "Li", label: "Lithium" },
  { value: "Be", label: "Beryllium" },
  { value: "B", label: "Boron" },
  { value: "C", label: "Carbon" },
  { value: "N", label: "Nitrogen" },
  { value: "O", label: "Oxygen" },
  { value: "F", label: "Fluorine" },
  { value: "Ne", label: "Neon" },
]

listboxRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/listbox.json`

  return page(
    c,
    <Layout title="listbox — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/listbox" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">listbox</h1>
            <p class="text-muted-foreground">
              A scrollable, always-visible single- or multi-select list built on{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="listbox"</code>{" "}
              with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="option"</code>{" "}
              children. Full APG keyboard contract; a hidden input mirrors the
              selection so it submits like a normal field.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-listbox"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/listbox.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/listbox.html", source: jinjaSource, note: "Copy listbox.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/listbox.tmpl", source: goSource, note: "Add listbox.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/listbox.ex", source: phoenixSource, note: "Drop listbox.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/listbox.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css. The shared keyboard contract lives in public/site.js." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Single-select",
              description:
                "One option at a time. Up/Down move and select the focused option; Home/End jump to the ends; type-ahead matches by first letter.",
              narrative: (
                <p>
                  A vertical{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="listbox"</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="option"</code>{" "}
                  children. Focus moves with a roving tabindex — exactly one
                  option is in the tab order at a time — and the selected
                  option carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-selected="true"</code>
                  . The hidden{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input&gt;</code>{" "}
                  mirrors the value so the widget submits like a normal field.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Listbox pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",
                },
                {
                  source: "APG",
                  label: "Scrollable listbox example",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-scrollable/",
                },
                {
                  source: "MDN",
                  label: "listbox role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role",
                },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-2">
                  <Label id="lb-elem-label">Favourite element</Label>
                  <Listbox ariaLabelledby="lb-elem-label" name="element">
                    {ELEMENTS.map((e) => (
                      <ListboxOption value={e.value} selected={e.value === "C"}>
                        {e.label}
                      </ListboxOption>
                    ))}
                  </Listbox>
                </div>
              ),
              jsx: `<Listbox ariaLabel="Favourite element" name="element">
  <ListboxOption value="H" selected>Hydrogen</ListboxOption>
  <ListboxOption value="He">Helium</ListboxOption>
  <ListboxOption value="Li">Lithium</ListboxOption>
</Listbox>`,
              jinja: `{{ listbox_open(aria_label="Favourite element", name="element") }}
  {{ listbox_option("Hydrogen", value="H", selected=true) }}
  {{ listbox_option("Helium",   value="He") }}
{{ listbox_close(name="element") }}`,
              go: `{{template "listbox" (dict "AriaLabel" "Favourite element" "Name" "element" "Body" $opts)}}`,
              phoenix: `<.listbox aria-label="Favourite element" name="element">
  <.listbox_option value="H" selected>Hydrogen</.listbox_option>
  <.listbox_option value="He">Helium</.listbox_option>
</.listbox>`,
            })}

            {await Example({
              id: "ex-multi",
              title: "Multi-select",
              description:
                "Set multiple, and the container gets aria-multiselectable. Space toggles the focused option; Shift+Arrow / Shift+Click extend a range; Ctrl/Cmd+A selects all.",
              narrative: (
                <p>
                  With{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">multiple</code>
                  , the listbox sets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-multiselectable="true"</code>{" "}
                  and follows the APG recommended model — no modifier needed to
                  toggle. The hidden input collects every selected value as a
                  comma-joined string. Disabled options stay announced by AT
                  but can't be toggled.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Listbox keyboard (multiple selection)",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboardinteraction",
                },
                {
                  source: "MDN",
                  label: "aria-multiselectable",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-multiselectable",
                },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-2">
                  <Label id="lb-top-label">Pizza toppings</Label>
                  <Listbox ariaLabelledby="lb-top-label" name="toppings" multiple>
                    <ListboxOption value="cheese" selected>Cheese</ListboxOption>
                    <ListboxOption value="mushroom">Mushroom</ListboxOption>
                    <ListboxOption value="olives" selected>Olives</ListboxOption>
                    <ListboxOption value="pineapple" disabled>Pineapple (out of stock)</ListboxOption>
                    <ListboxOption value="onion">Onion</ListboxOption>
                  </Listbox>
                </div>
              ),
              jsx: `<Listbox ariaLabel="Toppings" name="toppings" multiple>
  <ListboxOption value="cheese" selected>Cheese</ListboxOption>
  <ListboxOption value="mushroom">Mushroom</ListboxOption>
  <ListboxOption value="pineapple" disabled>Pineapple</ListboxOption>
</Listbox>`,
              jinja: `{{ listbox_open(aria_label="Toppings", name="toppings", multiple=true) }}
  {{ listbox_option("Cheese", value="cheese", selected=true) }}
  {{ listbox_option("Pineapple", value="pineapple", disabled=true) }}
{{ listbox_close(name="toppings") }}`,
              go: `{{template "listbox" (dict "AriaLabel" "Toppings" "Name" "toppings" "Multiple" true "Body" $opts)}}`,
              phoenix: `<.listbox aria-label="Toppings" name="toppings" multiple>
  <.listbox_option value="cheese" selected>Cheese</.listbox_option>
  <.listbox_option value="pineapple" disabled>Pineapple</.listbox_option>
</.listbox>`,
            })}

            {await Example({
              id: "ex-native",
              title: "Native fallback — <select multiple>",
              description:
                "When you don't need custom option rendering, the platform already ships a listbox: <select multiple> (or size > 1). Zero JS, submits each selected option on its own.",
              narrative: (
                <p>
                  The styled widget above is the APG{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">listbox</code>{" "}
                  for when you need custom rendering. But the truly-native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;select multiple&gt;</code>{" "}
                  is a real listbox too — full keyboard control, accessible name
                  handling, and form submission come from the browser with no
                  JS at all. Reach for it first; reach for the styled listbox
                  when the browser's option chrome isn't enough.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<select multiple>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#multiple",
                },
                {
                  source: "WHATWG",
                  label: "The select element",
                  href: "https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element",
                },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-2">
                  <Label htmlFor="lb-native">Languages (native)</Label>
                  <select
                    id="lb-native"
                    name="langs"
                    multiple
                    size={5}
                    class="w-full rounded-md border bg-background p-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="js">JavaScript</option>
                    <option value="py" selected>Python</option>
                    <option value="go">Go</option>
                    <option value="rs">Rust</option>
                    <option value="ts" selected>TypeScript</option>
                  </select>
                </div>
              ),
              jsx: `// Reuses the native <Select multiple size={5}> component.
<Select name="langs" multiple size={5}>
  <SelectOption value="js">JavaScript</SelectOption>
  <SelectOption value="py" selected>Python</SelectOption>
</Select>`,
              jinja: `<select name="langs" multiple size="5" class="…">
  <option value="js">JavaScript</option>
  <option value="py" selected>Python</option>
</select>`,
              go: `<select name="langs" multiple size="5" class="…">
  <option value="js">JavaScript</option>
</select>`,
              phoenix: `<select name="langs" multiple size="5" class="…">
  <option value="js">JavaScript</option>
</select>`,
            })}
          </section>

          <ApiTable
            title="<Listbox> — role=listbox / role=option"
            caption={
              <>
                Props for the JSX{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;Listbox&gt;</code>{" "}
                container; pass{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;ListboxOption&gt;</code>{" "}
                children for the options. Anything matching{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-*</code>{" "}
                or{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">data-*</code>{" "}
                is forwarded onto the{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;ul role="listbox"&gt;</code>
                .
              </>
            }
            rows={LISTBOX_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
