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
import { OUTPUT_PROPS } from "@/app/data/api-rows"
import { Output } from "@/registry/ui/output"

export const outputRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/output.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/output.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/output.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/output.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/output.html"), "utf8"),
])

const usageJsx = `import { Output } from "@/components/ui/output"

// Tie the result to the inputs that produced it via \`for\`.
<Output id="result" htmlFor="qty price" tone="primary">$0.00</Output>

// Server-computed: target THIS output, swap innerHTML so the
// implicit role="status" live region persists and is announced.
// change/input bubble from the child inputs up to the form.
<form hx-post="/cart/total" hx-trigger="change, input delay:300ms"
      hx-target="#result" hx-swap="innerHTML">
  <input name="qty" value="1" />
  <Output id="result" htmlFor="qty" tone="primary">$0.00</Output>
</form>`

const usageJinja = `{% from "components/output.html" import output %}

{% call output(id="result", for="qty price", tone="primary") %}$0.00{% endcall %}

<form hx-post="/cart/total" hx-trigger="change, input delay:300ms"
      hx-target="#result" hx-swap="innerHTML">
  <input name="qty" value="1" />
  {% call output(id="result", for="qty", tone="primary") %}$0.00{% endcall %}
</form>`

const usageGo = `{{template "output" (dict "ID" "result" "For" "qty price" "Tone" "primary" "Body" "$0.00")}}

<form hx-post="/cart/total" hx-trigger="change, input delay:300ms"
      hx-target="#result" hx-swap="innerHTML">
  <input name="qty" value="1" />
  {{template "output" (dict "ID" "result" "For" "qty" "Tone" "primary" "Body" "$0.00")}}
</form>`

const usagePhoenix = `<.output id="result" for="qty price" tone="primary">$0.00</.output>

<form hx-post="/cart/total" hx-trigger="change, input delay:300ms"
      hx-target="#result" hx-swap="innerHTML">
  <input name="qty" value="1" />
  <.output id="result" for="qty" tone="primary">$0.00</.output>
</form>`

const usageHtml = `<output id="result" for="qty price" data-slot="output" data-tone="primary"
        class="inline-flex min-h-9 w-fit items-center gap-2 rounded-md border border-transparent bg-primary px-3 py-1.5 text-sm font-medium tabular-nums text-primary-foreground transition-colors [&.htmx-request]:opacity-60">$0.00</output>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic — tied to inputs", nested: true },
  { href: "#ex-tones", label: "Tones", nested: true },
  { href: "#ex-htmx", label: "htmx — server-computed", nested: true },
  { href: "#api", label: "API Reference" },
]

outputRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/output.json`
  return page(
    c,
    <Layout title="Output — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/output" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">Output</h1>
            <p class="text-muted-foreground">
              The native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;output&gt;</code>{" "}
              element (ARIA{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="status"</code>
              ) — a live result region for the outcome of a calculation or a
              server action. Tie it to its inputs with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">for</code>. Its
              implicit{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-live</code>{" "}
              means an htmx swap of its content is announced automatically — no
              JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <LangTabs id="install-output" panels={[
              { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/output.tsx", source: jsxSource }) },
              { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/output.html", source: jinjaSource, note: "Copy output.html into templates/components/." }) },
              { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/output.tmpl", source: goSource, note: "Add output.tmpl alongside your templates." }) },
              { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/output.ex", source: phoenixSource, note: "Drop output.ex into lib/my_app_web/components/." }) },
              { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/output.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
            ]} />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — tied to its inputs",
              description:
                "The for attribute is a space-separated list of the ids of the inputs that contributed to the result. The output's content IS the result.",
              narrative: (
                <p>
                  Native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;output&gt;</code>{" "}
                  carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="status"</code>{" "}
                  implicitly, so it is already an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-live="polite"</code>{" "}
                  region — no extra ARIA needed. Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">htmlFor</code>{" "}
                  (the native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">for</code>{" "}
                  attribute) to the ids of the controls it depends on.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<output> (for / form / name)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output",
                },
                {
                  source: "MDN",
                  label: "ARIA status role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center gap-2">
                  <label for="o-a" class="text-sm font-medium">Subtotal</label>
                  <input id="o-a" name="a" value="42.00" readonly class="h-9 w-24 rounded-md border bg-transparent px-3 text-sm tabular-nums" />
                  <span class="text-muted-foreground">+ tax =</span>
                  <Output id="o-total" htmlFor="o-a" tone="primary">$45.36</Output>
                </div>
              ),
              jsx: `<label for="o-a">Subtotal</label>
<input id="o-a" name="a" value="42.00" />
<Output id="o-total" htmlFor="o-a" tone="primary">$45.36</Output>`,
              jinja: `<label for="o-a">Subtotal</label>
<input id="o-a" name="a" value="42.00" />
{% call output(id="o-total", for="o-a", tone="primary") %}$45.36{% endcall %}`,
              go: `<label for="o-a">Subtotal</label>
<input id="o-a" name="a" value="42.00" />
{{template "output" (dict "ID" "o-total" "For" "o-a" "Tone" "primary" "Body" "$45.36")}}`,
              phoenix: `<label for="o-a">Subtotal</label>
<input id="o-a" name="a" value="42.00" />
<.output id="o-total" for="o-a" tone="primary">$45.36</.output>`,
            })}

            {await Example({
              id: "ex-tones",
              title: "Tones",
              description:
                "Four theme-token tones for the result chip: default (card), muted, primary (emphasis), and destructive (an error result).",
              narrative: (
                <p>
                  Tone is purely visual — every tone keeps the same{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="status"</code>{" "}
                  semantics. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">destructive</code>{" "}
                  for a failed calculation, not for a critical interruption —
                  for that, reach for an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">Alert</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="alert"</code>
                  .
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "status vs alert live regions",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center gap-3">
                  <Output ariaLabel="Default result">128</Output>
                  <Output tone="muted" ariaLabel="Muted result">128</Output>
                  <Output tone="primary" ariaLabel="Primary result">$1,280.00</Output>
                  <Output tone="destructive" ariaLabel="Error result">Cannot divide by zero</Output>
                </div>
              ),
              jsx: `<Output>128</Output>
<Output tone="muted">128</Output>
<Output tone="primary">$1,280.00</Output>
<Output tone="destructive">Cannot divide by zero</Output>`,
              jinja: `{% call output() %}128{% endcall %}
{% call output(tone="muted") %}128{% endcall %}
{% call output(tone="primary") %}$1,280.00{% endcall %}
{% call output(tone="destructive") %}Cannot divide by zero{% endcall %}`,
              go: `{{template "output" (dict "Body" "128")}}
{{template "output" (dict "Tone" "muted" "Body" "128")}}
{{template "output" (dict "Tone" "primary" "Body" "$1,280.00")}}
{{template "output" (dict "Tone" "destructive" "Body" "Cannot divide by zero")}}`,
              phoenix: `<.output>128</.output>
<.output tone="muted">128</.output>
<.output tone="primary">$1,280.00</.output>
<.output tone="destructive">Cannot divide by zero</.output>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — server-computed result",
              description:
                "The form posts on every input change; the server returns the new total, which htmx swaps into the output's innerHTML. Because the <output> persists as the live region, the new value is announced automatically.",
              narrative: (
                <p>
                  The form triggers on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change, input delay:300ms</code>{" "}
                  (both bubble from the child inputs up to the form),{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>s
                  the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;output&gt;</code>,
                  and uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="innerHTML"</code>{" "}
                  so the live-region element stays in place. Per the MDN live
                  regions guide, the region must exist before its content
                  changes — swapping the inner content (not the whole element)
                  is exactly what fires the announcement.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger / hx-swap",
                  href: "https://htmx.org/reference/",
                },
                {
                  source: "MDN",
                  label: "Live regions — change content in place",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
                },
              ],
              preview: (
                <form
                  class="flex flex-wrap items-end gap-3"
                  hx-post="/output/total"
                  hx-trigger="change, input delay:300ms"
                  hx-target="#o-cart"
                  hx-swap="innerHTML"
                >
                  <div class="grid gap-1.5">
                    <label for="o-qty" class="text-sm font-medium">Quantity</label>
                    <input id="o-qty" name="qty" type="number" value="2" min="0" class="h-9 w-24 rounded-md border bg-transparent px-3 text-sm tabular-nums" />
                  </div>
                  <div class="grid gap-1.5">
                    <label for="o-price" class="text-sm font-medium">Unit price</label>
                    <input id="o-price" name="price" type="number" value="19.99" min="0" step="0.01" class="h-9 w-28 rounded-md border bg-transparent px-3 text-sm tabular-nums" />
                  </div>
                  <div class="grid gap-1.5">
                    <span class="text-sm font-medium">Total</span>
                    <Output id="o-cart" htmlFor="o-qty o-price" tone="primary">$39.98</Output>
                  </div>
                </form>
              ),
              jsx: `<form hx-post="/cart/total"
      hx-trigger="change, input delay:300ms"
      hx-target="#o-cart" hx-swap="innerHTML">
  <input id="o-qty" name="qty" type="number" value="2" />
  <input id="o-price" name="price" type="number" value="19.99" />
  <Output id="o-cart" htmlFor="o-qty o-price" tone="primary">$39.98</Output>
</form>

// change/input bubble from the inputs to the form, so the form
// posts qty+price. Server returns just the new value text —
// swapped into the live region: $59.97`,
              jinja: `<form hx-post="/cart/total"
      hx-trigger="change, input delay:300ms"
      hx-target="#o-cart" hx-swap="innerHTML">
  <input id="o-qty" name="qty" type="number" value="2" />
  <input id="o-price" name="price" type="number" value="19.99" />
  {% call output(id="o-cart", for="o-qty o-price", tone="primary") %}$39.98{% endcall %}
</form>`,
              go: `<form hx-post="/cart/total"
      hx-trigger="change, input delay:300ms"
      hx-target="#o-cart" hx-swap="innerHTML">
  <input id="o-qty" name="qty" type="number" value="2" />
  <input id="o-price" name="price" type="number" value="19.99" />
  {{template "output" (dict "ID" "o-cart" "For" "o-qty o-price" "Tone" "primary" "Body" "$39.98")}}
</form>`,
              phoenix: `<form hx-post="/cart/total"
      hx-trigger="change, input delay:300ms"
      hx-target="#o-cart" hx-swap="innerHTML">
  <input id="o-qty" name="qty" type="number" value="2" />
  <input id="o-price" name="price" type="number" value="19.99" />
  <.output id="o-cart" for="o-qty o-price" tone="primary">$39.98</.output>
</form>`,
            })}
          </section>

          <ApiTable title="<Output>" rows={OUTPUT_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx endpoint — multiply qty x price and return just the formatted total,
// swapped into the <output>'s innerHTML so the live region persists.
outputRoutes.post("/total", async (c) => {
  const body = await c.req.parseBody()
  const qty = Number(body.qty)
  const price = Number(body.price)
  const total = Number.isFinite(qty) && Number.isFinite(price) ? qty * price : NaN
  const text = Number.isFinite(total)
    ? `$${total.toFixed(2)}`
    : "—"
  return c.html(<>{text}</>)
})
