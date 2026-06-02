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
import { COLOR_PICKER_PROPS } from "@/app/data/api-rows"
import { ColorPicker } from "@/registry/ui/color-picker"

export const colorPickerRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/color-picker.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/color-picker.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/color-picker.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/color_picker.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/color-picker.html"), "utf8"),
])

const usageJsx = `import { ColorPicker } from "@/components/ui/color-picker"

<ColorPicker name="brand" value="#e66465" ariaLabel="Brand color" />`

const usageJinja = `{% from "components/color-picker.html" import color_picker %}

{{ color_picker(name="brand", value="#e66465", aria_label="Brand color") }}`

const usageGo = `tpl.ExecuteTemplate(w, "color-picker", map[string]any{
    "Name": "brand", "Value": "#e66465", "AriaLabel": "Brand color",
})`

const usagePhoenix = `<.color_picker name="brand" value="#e66465" aria-label="Brand color" />`

const usageHtml = `<span data-slot="color-picker" class="inline-flex items-center gap-2">
  <input type="color" name="brand" value="#e66465" aria-label="Brand color"
         data-slot="color-picker-swatch" class="size-9 … rounded-md border …">
  <output data-slot="color-picker-value" aria-hidden="true" class="font-mono …">#e66465</output>
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Hex readout", nested: true },
  { href: "#ex-bare", label: "Bare swatch (zero JS)", nested: true },
  { href: "#ex-htmx", label: "htmx live preview", nested: true },
  { href: "#api", label: "API Reference" },
]

colorPickerRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/color-picker.json`

  return page(
    c,
    <Layout title="Color Picker — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/color-picker" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">Color Picker</h1>
            <p class="text-muted-foreground">
              A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="color"&gt;</code>{" "}
              styled as a shadcn swatch, with an optional live hex readout. The
              browser supplies the entire picker UI and guarantees the value is a
              valid CSS color — we only restyle the swatch and never parse colors
              ourselves.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. Use the shadcn CLI for JSX, or copy the
              source for your template engine.
            </p>
            <LangTabs
              id="install-color-picker"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/color-picker.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/color-picker.html", source: jinjaSource, note: "Copy color-picker.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/color-picker.tmpl", source: goSource, note: "Add color-picker.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/color_picker.ex", source: phoenixSource, note: "Drop color_picker.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/color-picker.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens. The inline <script> mirrors the hex readout standalone." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Hex readout",
              description:
                "The native swatch plus a live <output> that mirrors the selected hex. Clicking it opens the platform color picker.",
              narrative: (
                <p>
                  The control is a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input type="color"&gt;</code>,
                  so the browser renders its own picker and coerces any invalid
                  entry to a valid CSS color (applying{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">:invalid</code>{" "}
                  when it can't). Since this input type has{" "}
                  <em>no implicit ARIA role</em>, a visible{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;label for&gt;</code>{" "}
                  or{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel</code>{" "}
                  is required for an accessible name. The hex{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;output&gt;</code>{" "}
                  is decorative (<code class="rounded bg-muted px-1 py-0.5 text-xs">aria-hidden</code>);
                  the input remains the labelled source of truth.
                </p>
              ),
              references: [
                { source: "MDN", label: '<input type="color">', href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color" },
                { source: "MDN", label: "input type=color — no ARIA role", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color#technical_summary" },
              ],
              preview: (
                <div class="grid w-full max-w-3xs gap-2">
                  <label class="text-xs font-medium" for="ex-basic-brand">Brand color</label>
                  <ColorPicker id="ex-basic-brand" name="brand" value="#e66465" />
                </div>
              ),
              jsx: `<ColorPicker name="brand" value="#e66465" ariaLabel="Brand color" />`,
              jinja: `{{ color_picker(name="brand", value="#e66465", aria_label="Brand color") }}`,
              go: `{{template "color-picker" (dict "Name" "brand" "Value" "#e66465" "AriaLabel" "Brand color")}}`,
              phoenix: `<.color_picker name="brand" value="#e66465" aria-label="Brand color" />`,
            })}

            {await Example({
              id: "ex-bare",
              title: "Bare swatch — zero JavaScript",
              description:
                "showValue={false} drops the hex readout, leaving just the native swatch. No wrapper, no script.",
              narrative: (
                <p>
                  When you don't need the text readout, the component renders the
                  plain native input. Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">alpha</code>{" "}
                  to let users edit transparency, or{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">list</code>{" "}
                  pointing at a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;datalist&gt;</code>{" "}
                  to offer preset swatches — both are native features of the color
                  input, no JS required.
                </p>
              ),
              references: [
                { source: "MDN", label: "alpha / colorspace attributes", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color#additional_attributes" },
                { source: "MDN", label: "<datalist> presets (list)", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist" },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-2">
                  <label class="text-xs font-medium" for="ex-bare-bg">Background color</label>
                  <ColorPicker id="ex-bare-bg" name="bg" value="#1d4ed8" alpha showValue={false} />
                </div>
              ),
              jsx: `<ColorPicker name="bg" value="#1d4ed8" alpha showValue={false} />`,
              jinja: `{{ color_picker(name="bg", value="#1d4ed8", alpha=true, show_value=false) }}`,
              go: `{{template "color-picker" (dict
  "Name" "bg" "Value" "#1d4ed8" "Alpha" true "NoValue" true)}}`,
              phoenix: `<.color_picker name="bg" value="#1d4ed8" alpha show_value={false} />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — live preview",
              description:
                "On the change event (fired when the picker is dismissed), htmx POSTs the chosen color and the server swaps in a styled preview chip.",
              narrative: (
                <p>
                  htmx listens on the input's native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change</code>{" "}
                  event, which fires when the platform picker is dismissed (use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="input"</code>{" "}
                  to react to every adjustment instead).{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  points at the preview node and the server returns the new chip —
                  no client state.
                </p>
              ),
              references: [
                { source: "htmx", label: "hx-post", href: "https://htmx.org/attributes/hx-post/" },
                { source: "MDN", label: "color input events (input / change)", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color#tracking_color_changes" },
              ],
              preview: (
                <div class="grid w-full max-w-3xs gap-3">
                  <label class="text-xs font-medium" for="ex-htmx-color">Theme color</label>
                  <ColorPicker
                    id="ex-htmx-color"
                    name="color"
                    value="#7c3aed"
                    hx-post="/color-picker/preview"
                    hx-target="#ex-htmx-preview"
                    hx-swap="innerHTML"
                    hx-trigger="change"
                  />
                  <p class="text-sm text-muted-foreground" aria-live="polite">
                    <span id="ex-htmx-preview">
                      <span class="inline-flex items-center gap-2">
                        <span class="inline-block size-4 rounded-sm border" style="background:#7c3aed"></span>
                        <span class="font-mono text-foreground">#7c3aed</span>
                      </span>
                    </span>
                  </p>
                </div>
              ),
              jsx: `<ColorPicker name="color" value="#7c3aed"
            hx-post="/api/preview" hx-target="#preview"
            hx-swap="innerHTML" hx-trigger="change" />
<span id="preview" aria-live="polite"></span>`,
              jinja: `{{ color_picker(name="color", value="#7c3aed",
                hx_post="/api/preview", hx_target="#preview",
                hx_swap="innerHTML", hx_trigger="change") }}
<span id="preview" aria-live="polite"></span>`,
              go: `{{template "color-picker" (dict
  "Name" "color" "Value" "#7c3aed"
  "Attrs" (dict
    "hx-post" "/api/preview" "hx-target" "#preview"
    "hx-swap" "innerHTML" "hx-trigger" "change"
  ))}}`,
              phoenix: `<.color_picker name="color" value="#7c3aed"
              hx-post="/api/preview" hx-target="#preview"
              hx-swap="innerHTML" hx-trigger="change" />`,
            })}
          </section>

          <ApiTable title="<ColorPicker>" rows={COLOR_PICKER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ─── htmx endpoints for the live demos ──────────────────────────────

colorPickerRoutes.post("/preview", async (c) => {
  const body = await c.req.parseBody()
  // Only accept a hex color (#rgb / #rrggbb / #rrggbbaa); fall back to black.
  const raw = String(body.color ?? "")
  const color = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(raw) ? raw : "#000000"
  return c.html(
    <span class="inline-flex items-center gap-2">
      <span class="inline-block size-4 rounded-sm border" style={`background:${color}`}></span>
      <span class="font-mono text-foreground">{color}</span>
    </span>,
  )
})
