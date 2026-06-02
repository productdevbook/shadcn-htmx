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
import { RANGE_SLIDER_PROPS } from "@/app/data/api-rows"
import { RangeSlider } from "@/registry/ui/range-slider"
import { Label } from "@/registry/ui/label"

export const rangeSliderRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/range-slider.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/range-slider.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/range-slider.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/range_slider.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/range-slider.html"), "utf8"),
])

const usageJsx = `import { RangeSlider } from "@/components/ui/range-slider"

<RangeSlider min={0} max={500} step={10}
  minValue={120} maxValue={380}
  minLabel="Minimum price" maxLabel="Maximum price" />`

const usageJinja = `{% from "components/range-slider.html" import range_slider %}

{{ range_slider(min=0, max=500, step=10, min_value=120, max_value=380,
                min_label="Minimum price", max_label="Maximum price") }}`

const usageGo = `{{template "range-slider" (dict "Min" (ptr 0) "Max" (ptr 500) "Step" (ptr 10) "MinValue" (ptr 120) "MaxValue" (ptr 380) "MinLabel" "Minimum price" "MaxLabel" "Maximum price")}}`

const usagePhoenix = `<.range_slider min={0} max={500} step={10}
  min_value={120} max_value={380}
  min_label="Minimum price" max_label="Maximum price" />`

const usageHtml = `<span data-slot="range-slider" style="--range-min:20%;--range-max:80%" class="…">
  <span class="… bg-muted" aria-hidden="true"></span>
  <span class="… bg-primary [left:var(--range-min)] …" aria-hidden="true"></span>
  <input type="range" data-range="min" name="min" value="20" min="0" max="100" aria-label="Minimum" class="…">
  <input type="range" data-range="max" name="max" value="80" min="0" max="100" aria-label="Maximum" class="…">
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Price range", nested: true },
  { href: "#ex-step", label: "Custom min/max/step", nested: true },
  { href: "#ex-disabled", label: "Disabled", nested: true },
  { href: "#api", label: "API Reference" },
]

rangeSliderRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/range-slider.json`

  return page(
    c,
    <Layout title="range-slider — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/range-slider" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">range-slider</h1>
            <p class="text-muted-foreground">
              Two-thumb range built from two native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="range"&gt;</code>{" "}
              on one track. Each thumb is form-submittable and gets
              role=slider plus the full keyboard contract from the
              platform; a tiny script stops them crossing and paints the
              fill between.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-range-slider"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/range-slider.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/range-slider.html", source: jinjaSource, note: "Copy range-slider.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/range-slider.tmpl", source: goSource, note: "Add range-slider.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/range_slider.ex", source: phoenixSource, note: "Drop range_slider.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/range-slider.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Price range",
              description:
                "Drag either thumb. Tab focuses each thumb in turn, then ←/→ moves it; the thumbs can't cross.",
              narrative: (
                <p>
                  Two native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input type="range"&gt;</code>{" "}
                  submit as{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max</code>.
                  The APG Multi-Thumb Slider pattern says each thumb keeps
                  its own place in the tab sequence and the lower thumb's
                  value is bounded by the upper one — a small script in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
                  enforces the clamp and paints the fill.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Slider (Multi-Thumb) Pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/",
                },
                {
                  source: "MDN",
                  label: "<input type=\"range\">",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label>Price range</Label>
                  <RangeSlider
                    id="ex-rs-price"
                    min={0}
                    max={500}
                    step={10}
                    minValue={120}
                    maxValue={380}
                    minLabel="Minimum price"
                    maxLabel="Maximum price"
                  />
                </div>
              ),
              jsx: `<Label>Price range</Label>
<RangeSlider id="price" min={0} max={500} step={10}
  minValue={120} maxValue={380}
  minLabel="Minimum price" maxLabel="Maximum price" />`,
              jinja: `{{ label("Price range") }}
{{ range_slider(id="price", min=0, max=500, step=10, min_value=120, max_value=380,
                min_label="Minimum price", max_label="Maximum price") }}`,
              go: `{{template "label" (dict "Text" "Price range")}}
{{template "range-slider" (dict "ID" "price" "Min" (ptr 0) "Max" (ptr 500) "Step" (ptr 10) "MinValue" (ptr 120) "MaxValue" (ptr 380) "MinLabel" "Minimum price" "MaxLabel" "Maximum price")}}`,
              phoenix: `<.label>Price range</.label>
<.range_slider id="price" min={0} max={500} step={10}
  min_value={120} max_value={380}
  min_label="Minimum price" max_label="Maximum price" />`,
            })}

            {await Example({
              id: "ex-step",
              title: "Custom min/max/step + value text",
              description:
                "min/max/step constrain both thumbs. aria-valuetext gives AT a human-readable value per thumb.",
              narrative: (
                <p>
                  When the raw number isn't self-explanatory, set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">minValuetext</code>{" "}
                  /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">maxValuetext</code>{" "}
                  so screen readers announce "$120" rather than "120".
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
                  <Label>Budget (USD)</Label>
                  <RangeSlider
                    id="ex-rs-budget"
                    min={0}
                    max={2000}
                    step={50}
                    minValue={400}
                    maxValue={1500}
                    minLabel="Minimum budget"
                    maxLabel="Maximum budget"
                    minValuetext="$400"
                    maxValuetext="$1500"
                  />
                </div>
              ),
              jsx: `<RangeSlider id="budget" min={0} max={2000} step={50}
  minValue={400} maxValue={1500}
  minLabel="Minimum budget" maxLabel="Maximum budget"
  minValuetext="$400" maxValuetext="$1500" />`,
              jinja: `{{ range_slider(id="budget", min=0, max=2000, step=50, min_value=400, max_value=1500,
                min_label="Minimum budget", max_label="Maximum budget",
                min_valuetext="$400", max_valuetext="$1500") }}`,
              go: `{{template "range-slider" (dict "ID" "budget" "Min" (ptr 0) "Max" (ptr 2000) "Step" (ptr 50) "MinValue" (ptr 400) "MaxValue" (ptr 1500) "MinLabel" "Minimum budget" "MaxLabel" "Maximum budget" "MinValuetext" "$400" "MaxValuetext" "$1500")}}`,
              phoenix: `<.range_slider id="budget" min={0} max={2000} step={50}
  min_value={400} max_value={1500}
  min_label="Minimum budget" max_label="Maximum budget"
  min_valuetext="$400" max_valuetext="$1500" />`,
            })}

            {await Example({
              id: "ex-disabled",
              title: "Disabled",
              description: "Both thumbs are non-focusable and not draggable.",
              narrative: (
                <p>
                  Disabled is the native attribute on each input — the
                  platform removes them from the tab order and blocks
                  keyboard + pointer. We just dim the wrapper.
                </p>
              ),
              references: [],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label>Disabled</Label>
                  <RangeSlider
                    id="ex-rs-disabled"
                    minValue={30}
                    maxValue={70}
                    disabled
                    minLabel="Minimum"
                    maxLabel="Maximum"
                    data-test="disabled"
                  />
                </div>
              ),
              jsx: `<RangeSlider minValue={30} maxValue={70} disabled
  minLabel="Minimum" maxLabel="Maximum" />`,
              jinja: `{{ range_slider(min_value=30, max_value=70, disabled=true,
                min_label="Minimum", max_label="Maximum") }}`,
              go: `{{template "range-slider" (dict "MinValue" (ptr 30) "MaxValue" (ptr 70) "Disabled" true "MinLabel" "Minimum" "MaxLabel" "Maximum")}}`,
              phoenix: `<.range_slider min_value={30} max_value={70} disabled
  min_label="Minimum" max_label="Maximum" />`,
            })}
          </section>

          <ApiTable title="<RangeSlider>" rows={RANGE_SLIDER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
