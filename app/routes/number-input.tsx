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
import { NUMBER_INPUT_PROPS } from "@/app/data/api-rows"
import { NumberInput } from "@/registry/ui/number-input"

export const numberInputRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/number-input.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/number-input.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/number-input.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/number_input.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/number-input.html"), "utf8"),
])

const usageJsx = `import { NumberInput } from "@/components/ui/number-input"

<NumberInput name="qty" value={1} min={0} max={10} ariaLabel="Quantity" />`

const usageJinja = `{% from "components/number-input.html" import number_input %}

{{ number_input(name="qty", value=1, min=0, max=10, aria_label="Quantity") }}`

const usageGo = `tpl.ExecuteTemplate(w, "number-input", map[string]any{
    "Name": "qty", "Value": "1", "Min": "0", "Max": "10",
    "AriaLabel": "Quantity",
})`

const usagePhoenix = `<.number_input name="qty" value={1} min={0} max={10} aria-label="Quantity" />`

const usageHtml = `<div data-slot="number-input" class="flex h-9 … rounded-md border …">
  <button type="button" data-step="down" tabindex="-1" aria-label="Decrease">…</button>
  <input type="number" name="qty" value="1" min="0" max="10"
         data-slot="number-input-field" class="… text-center …">
  <button type="button" data-step="up" tabindex="-1" aria-label="Increase">…</button>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-bare", label: "Bare field (zero JS)", nested: true },
  { href: "#ex-htmx", label: "htmx live total", nested: true },
  { href: "#api", label: "API Reference" },
]

numberInputRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/number-input.json`

  return page(
    c,
    <Layout title="number-input — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/number-input" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">number-input</h1>
            <p class="text-muted-foreground">
              A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="number"&gt;</code>{" "}
              with shadcn polish and optional −/+ steppers. The browser already
              makes it a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="spinbutton"</code>{" "}
              with arrow-key stepping and value clamping — we only restyle and
              add larger buttons.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. Use the shadcn CLI for JSX, or copy the
              source for your template engine.
            </p>
            <LangTabs
              id="install-number-input"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/number-input.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/number-input.html", source: jinjaSource, note: "Copy number-input.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/number-input.tmpl", source: goSource, note: "Add number-input.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/number_input.ex", source: phoenixSource, note: "Drop number_input.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/number-input.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css. The included <script> wires the buttons standalone." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Stepper buttons",
              description:
                "−/+ buttons call the native stepUp()/stepDown(); the field stays a real spinbutton, so ArrowUp/ArrowDown still work too.",
              narrative: (
                <p>
                  The buttons are <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="-1"</code>{" "}
                  and the input keeps focus — exactly what the APG spinbutton
                  pattern prescribes: the increment/decrement controls are
                  redundant with the arrow keys, so they stay out of the tab
                  order. The browser enforces{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">step</code>{" "}
                  and reports{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-valuenow</code>{" "}
                  automatically.
                </p>
              ),
              references: [
                { source: "APG", label: "Spinbutton pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" },
                { source: "MDN", label: "<input type=number> (role=spinbutton)", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number" },
              ],
              preview: (
                <div class="grid w-full max-w-3xs gap-2">
                  <label class="text-xs font-medium" for="ex-basic-qty">Quantity</label>
                  <NumberInput id="ex-basic-qty" name="qty" value={1} min={0} max={10} />
                </div>
              ),
              jsx: `<NumberInput name="qty" value={1} min={0} max={10} ariaLabel="Quantity" />`,
              jinja: `{{ number_input(name="qty", value=1, min=0, max=10, aria_label="Quantity") }}`,
              go: `{{template "number-input" (dict "Name" "qty" "Value" "1" "Min" "0" "Max" "10" "AriaLabel" "Quantity")}}`,
              phoenix: `<.number_input name="qty" value={1} min={0} max={10} aria-label="Quantity" />`,
            })}

            {await Example({
              id: "ex-bare",
              title: "Bare field — zero JavaScript",
              description:
                "steppers={false} drops the buttons. It is still a full spinbutton: arrow keys step, the browser clamps to min/max.",
              narrative: (
                <p>
                  When you don't want the buttons, the component renders the
                  plain native input — no wrapper, no script. Pair{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">inputmode="decimal"</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">step="0.01"</code>{" "}
                  for currency, and the mobile keyboard shows the decimal point.
                </p>
              ),
              references: [
                { source: "MDN", label: "inputmode", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode" },
                { source: "MDN", label: "step", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step" },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-2">
                  <label class="text-xs font-medium" for="ex-bare-price">Price</label>
                  <NumberInput id="ex-bare-price" name="price" min={0} step="0.01" inputmode="decimal" placeholder="0.00" steppers={false} />
                </div>
              ),
              jsx: `<NumberInput name="price" min={0} step="0.01"
            inputmode="decimal" placeholder="0.00" steppers={false} />`,
              jinja: `{{ number_input(name="price", min=0, step="0.01",
                inputmode="decimal", placeholder="0.00", steppers=false) }}`,
              go: `{{template "number-input" (dict
  "Name" "price" "Min" "0" "Step" "0.01"
  "InputMode" "decimal" "Placeholder" "0.00" "NoSteppers" true)}}`,
              phoenix: `<.number_input name="price" min={0} step="0.01"
              inputmode="decimal" placeholder="0.00" steppers={false} />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — live total",
              description:
                "On every change, htmx POSTs the quantity and the server returns the running total. No client state.",
              narrative: (
                <p>
                  htmx fires on the input's native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change</code>{" "}
                  event — which the stepper buttons dispatch too — so clicking
                  −/+ or arrow-keying both trigger the request.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  points at the total node and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="innerHTML"</code>{" "}
                  drops in the server's answer.
                </p>
              ),
              references: [
                { source: "htmx", label: "hx-post", href: "https://htmx.org/attributes/hx-post/" },
                { source: "htmx", label: "hx-trigger (change)", href: "https://htmx.org/attributes/hx-trigger/" },
              ],
              preview: (
                <div class="grid w-full max-w-3xs gap-3">
                  <label class="text-xs font-medium" for="ex-htmx-qty">Tickets ($12 each)</label>
                  <NumberInput
                    id="ex-htmx-qty"
                    name="qty"
                    value={1}
                    min={0}
                    max={20}
                    hx-post="/number-input/total"
                    hx-target="#ex-htmx-total"
                    hx-swap="innerHTML"
                    hx-trigger="change"
                  />
                  <p class="text-sm text-muted-foreground" aria-live="polite">
                    Total: <span id="ex-htmx-total" class="font-medium text-foreground">$12</span>
                  </p>
                </div>
              ),
              jsx: `<NumberInput name="qty" value={1} min={0} max={20}
            hx-post="/api/total" hx-target="#total"
            hx-swap="innerHTML" hx-trigger="change" />
<span id="total" aria-live="polite"></span>`,
              jinja: `{{ number_input(name="qty", value=1, min=0, max=20,
                hx_post="/api/total", hx_target="#total",
                hx_swap="innerHTML", hx_trigger="change") }}
<span id="total" aria-live="polite"></span>`,
              go: `{{template "number-input" (dict
  "Name" "qty" "Value" "1" "Min" "0" "Max" "20"
  "Attrs" (dict
    "hx-post" "/api/total" "hx-target" "#total"
    "hx-swap" "innerHTML" "hx-trigger" "change"
  ))}}`,
              phoenix: `<.number_input name="qty" value={1} min={0} max={20}
              hx-post="/api/total" hx-target="#total"
              hx-swap="innerHTML" hx-trigger="change" />`,
            })}
          </section>

          <ApiTable title="<NumberInput>" rows={NUMBER_INPUT_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ─── htmx endpoints for the live demos ──────────────────────────────

numberInputRoutes.post("/total", async (c) => {
  const body = await c.req.parseBody()
  const qty = Math.max(0, Math.min(20, Number(body.qty) || 0))
  return c.html(<>${qty * 12}</>)
})
