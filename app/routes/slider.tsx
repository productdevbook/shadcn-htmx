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
import { SLIDER_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Slider } from "@/registry/ui/slider"
import { Label } from "@/registry/ui/label"

export const sliderRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [sJsx, sJinja, sGo, sPhoenix, sHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/slider.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/slider.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/slider.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/slider.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/slider.html"), "utf8"),
])

const usageJsx = `import { Slider } from "@/components/ui/slider"

<Slider name="volume" value={50} ariaLabel="Volume" />`

const usageJinja = `{% from "components/slider.html" import slider %}

{{ slider(name="volume", value=50, aria_label="Volume") }}`

const usageGo = `{{template "slider" (dict "Name" "volume" "Value" (ptr 50) "AriaLabel" "Volume")}}`

const usagePhoenix = `<.slider name="volume" value={50} aria-label="Volume" />`

const usageHtml = `<span data-slot="slider" class="…">
  <input type="range" name="volume" min="0" max="100" value="50"
         aria-label="Volume" class="…">
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic + keyboard", nested: true },
  { href: "#ex-range", label: "Custom min/max/step", nested: true },
  { href: "#ex-disabled", label: "Disabled", nested: true },
  { href: "#api", label: "API Reference" },
]

sliderRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/slider.json`

  return page(
    c,
    <Layout title="Slider — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/slider" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Slider</h1>
            <p class="text-muted-foreground">
              Native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="range"&gt;</code>{" "}
              styled with Tailwind. ARIA role / value attributes + the full
              keyboard contract (arrows, Home/End, PageUp/Down) come from
              the platform.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-slider"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/slider.tsx", source: sJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/slider.html", source: sJinja, note: "Copy slider.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/slider.tmpl", source: sGo, note: "Add slider.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/slider.ex", source: sPhoenix, note: "Drop slider.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: sHtml, note: "Tailwind utilities only; no JS." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — keyboard works out of the box",
              description:
                "Tab to focus, then ←/→ increments by step, Home/End jump to ends, PageUp/Down move in bigger steps.",
              narrative: (
                <p>
                  Native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input type="range"&gt;</code>{" "}
                  ships with the full APG slider keyboard contract. We add
                  styling, not behaviour. If you need a vertical slider,
                  set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">orient="vertical"</code>{" "}
                  (Firefox) or rotate visually via CSS transform.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<input type=\"range\">",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range",
                },
                {
                  source: "MDN",
                  label: "role=\"slider\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role",
                },
                {
                  source: "APG",
                  label: "Slider keyboard contract",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-slider-vol">Volume</Label>
                  <Slider id="ex-slider-vol" name="volume" value={50} ariaLabel="Volume" />
                </div>
              ),
              jsx: `<Label htmlFor="vol">Volume</Label>
<Slider id="vol" name="volume" value={50} ariaLabel="Volume" />`,
              jinja: `{{ label("Volume", for_="vol") }}
{{ slider(id="vol", name="volume", value=50, aria_label="Volume") }}`,
              go: `{{template "label" (dict "Text" "Volume" "For" "vol")}}
{{template "slider" (dict "ID" "vol" "Name" "volume" "Value" (ptr 50) "AriaLabel" "Volume")}}`,
              phoenix: `<.label for="vol">Volume</.label>
<.slider id="vol" name="volume" value={50} aria-label="Volume" />`,
            })}

            {await Example({
              id: "ex-range",
              title: "Custom range + step",
              description:
                "Set min/max/step to constrain the slider. step also controls how much each Arrow press moves the value.",
              narrative: (
                <p>
                  Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-valuetext</code>{" "}
                  when the visible value isn't self-explanatory. AT users
                  hearing "24" don't know if that's dollars, months, or
                  decibels — "$24 per month" is unambiguous.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-valuetext",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuetext",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-slider-price">Monthly budget</Label>
                  <Slider
                    id="ex-slider-price"
                    name="budget"
                    min={0}
                    max={500}
                    step={25}
                    value={250}
                    ariaLabel="Monthly budget"
                    ariaValuetext="$250 per month"
                  />
                </div>
              ),
              jsx: `<Slider id="price" min={0} max={500} step={25} value={250}
        ariaLabel="Monthly budget" ariaValuetext="$250 per month" />`,
              jinja: `{{ slider(id="price", min=0, max=500, step=25, value=250,
            aria_label="Monthly budget", aria_valuetext="$250 per month") }}`,
              go: `{{template "slider" (dict "ID" "price" "Min" (ptr 0) "Max" (ptr 500) "Step" (ptr 25) "Value" (ptr 250) "AriaLabel" "Monthly budget")}}`,
              phoenix: `<.slider id="price" min={0} max={500} step={25} value={250}
         aria-label="Monthly budget" aria-valuetext="$250 per month" />`,
            })}

            {await Example({
              id: "ex-disabled",
              title: "Disabled",
              description: "Disabled sliders are non-focusable and not draggable.",
              narrative: (
                <p>
                  Disabled is the native attribute — the platform handles
                  keyboard exclusion, mouse cursor, and removes the
                  element from the tab order. We just dim the wrapper.
                </p>
              ),
              references: [],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-slider-disabled">Disabled</Label>
                  <Slider
                    id="ex-slider-disabled"
                    value={40}
                    disabled
                    ariaLabel="Disabled slider"
                    data-test="disabled"
                  />
                </div>
              ),
              jsx: `<Slider value={40} disabled ariaLabel="Disabled slider" />`,
              jinja: `{{ slider(value=40, disabled=true, aria_label="Disabled slider") }}`,
              go: `{{template "slider" (dict "Value" (ptr 40) "Disabled" true "AriaLabel" "Disabled slider")}}`,
              phoenix: `<.slider value={40} disabled aria-label="Disabled slider" />`,
            })}
          </section>
          <ApiTable
            title="<Slider>"
            rows={SLIDER_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
