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
import { METER_PROPS } from "@/app/data/api-rows"
import { Meter } from "@/registry/ui/meter"

export const meterRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/meter.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/meter.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/meter.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/meter.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/meter.html"), "utf8"),
])

const usageJsx = `import { Meter } from "@/components/ui/meter"

<label for="battery">Battery</label>
<Meter id="battery" value={0.75} ariaLabel="Battery" />

// zoned gauge — low/high/optimum color the fill
<Meter value={0.62} low={0.25} high={0.85} optimum={0.1}
       valuetext="12.4 GB of 16 GB" ariaLabel="Disk usage" />`

const usageJinja = `{% from "components/meter.html" import meter %}

<label for="battery">Battery</label>
{{ meter(id="battery", value=0.75, aria_label="Battery") }}

{# zoned gauge #}
{{ meter(value=0.62, low=0.25, high=0.85, optimum=0.1,
         value_text="12.4 GB of 16 GB", aria_label="Disk usage") }}`

const usageGo = `{{template "meter" (dict "ID" "battery" "Value" 0.75 "AriaLabel" "Battery")}}

// zoned gauge
{{template "meter" (dict
  "Value" 0.62 "Low" 0.25 "High" 0.85 "Optimum" 0.1
  "ValueText" "12.4 GB of 16 GB" "AriaLabel" "Disk usage")}}`

const usagePhoenix = `<label for="battery">Battery</label>
<.meter id="battery" value={0.75} aria-label="Battery" />

<.meter value={0.62} low={0.25} high={0.85} optimum={0.1}
  value_text="12.4 GB of 16 GB" aria-label="Disk usage" />`

const usageHtml = `<label for="battery" class="text-sm font-medium">Battery</label>
<meter id="battery" data-slot="meter" value="0.75"
       class="block h-2 w-full overflow-hidden rounded-full bg-primary/20 align-middle">75%</meter>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-zoned", label: "Zoned (low / high / optimum)", nested: true },
  { href: "#ex-htmx", label: "htmx — live gauge", nested: true },
  { href: "#api", label: "API Reference" },
]

meterRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/meter.json`
  return page(
    c,
    <Layout title="Meter — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/meter" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">Meter</h1>
            <p class="text-muted-foreground">
              The native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;meter&gt;</code>{" "}
              element (ARIA{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="meter"</code>
              ) — a gauge of a value within a known range like battery, disk
              usage, or a score. Set{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">low</code>/
              <code class="rounded bg-muted px-1 py-0.5 text-sm">high</code>/
              <code class="rounded bg-muted px-1 py-0.5 text-sm">optimum</code>{" "}
              to color the fill. For task completion use Progress instead.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <LangTabs id="install-meter" panels={[
              { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/meter.tsx", source: jsxSource }) },
              { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/meter.html", source: jinjaSource, note: "Copy meter.html into templates/components/." }) },
              { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/meter.tmpl", source: goSource, note: "Add meter.tmpl alongside your other templates." }) },
              { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/meter.ex", source: phoenixSource, note: "Drop meter.ex into lib/my_app_web/components/." }) },
              { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/meter.html", source: htmlSource, note: "Paste the markup; fill/track theming lives in the [data-slot=\"meter\"] rules in input.css." }) },
            ]} />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — a labelled gauge",
              description:
                "A value within a known range. Pair every meter with an accessible name — a linked <label for> is best.",
              narrative: (
                <p>
                  The native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;meter&gt;</code>{" "}
                  carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="meter"</code>{" "}
                  implicitly and maps{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">value</code>/
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min</code>/
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max</code>{" "}
                  onto{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-valuenow/min/max</code>
                  . Default range is 0–1, so{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">value=0.75</code>{" "}
                  reads as 75%.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Meter Pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/meter/",
                },
                {
                  source: "MDN",
                  label: "<meter>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-4">
                  <div class="grid gap-1.5">
                    <label for="m-battery" class="text-sm font-medium">Battery</label>
                    <Meter id="m-battery" value={0.75} ariaLabel="Battery">75%</Meter>
                  </div>
                  <div class="grid gap-1.5">
                    <label for="m-score" class="text-sm font-medium">Exam score</label>
                    <Meter id="m-score" value={6} min={0} max={10} ariaLabel="Exam score">6 / 10</Meter>
                  </div>
                </div>
              ),
              jsx: `<label for="m-battery">Battery</label>
<Meter id="m-battery" value={0.75} ariaLabel="Battery" />

<label for="m-score">Exam score</label>
<Meter id="m-score" value={6} min={0} max={10}
       ariaLabel="Exam score" />`,
              jinja: `<label for="m-battery">Battery</label>
{{ meter(id="m-battery", value=0.75, aria_label="Battery") }}

<label for="m-score">Exam score</label>
{{ meter(id="m-score", value=6, min=0, max=10,
         aria_label="Exam score") }}`,
              go: `{{template "meter" (dict "ID" "m-battery" "Value" 0.75 "AriaLabel" "Battery")}}
{{template "meter" (dict "ID" "m-score" "Value" 6 "Min" 0 "Max" 10 "AriaLabel" "Exam score")}}`,
              phoenix: `<.meter id="m-battery" value={0.75} aria-label="Battery" />
<.meter id="m-score" value={6} min={0} max={10} aria-label="Exam score" />`,
            })}

            {await Example({
              id: "ex-zoned",
              title: "Zoned — low / high / optimum",
              description:
                "low and high split the range into thirds; optimum tells the browser which end is preferable. The fill is green in the optimal zone, amber when suboptimal, red when far from optimum.",
              narrative: (
                <p>
                  Here{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">optimum=0.1</code>{" "}
                  marks the low end as best (less disk used is better), so a
                  value in the high zone renders red. Move{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">optimum</code>{" "}
                  to flip which direction is "good". Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">valuetext</code>{" "}
                  so AT announces a human-readable value, e.g.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">"12.4 GB of 16 GB"</code>
                  .
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "optimum / low / high",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#optimum",
                },
                {
                  source: "APG",
                  label: "aria-valuetext on a meter",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/meter/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-4">
                  <div class="grid gap-1.5">
                    <label for="m-low" class="text-sm font-medium">CPU — idle (optimal)</label>
                    <Meter id="m-low" value={0.18} low={0.25} high={0.85} optimum={0.1} valuetext="18% load" ariaLabel="CPU idle">18%</Meter>
                  </div>
                  <div class="grid gap-1.5">
                    <label for="m-mid" class="text-sm font-medium">Disk — getting full (suboptimal)</label>
                    <Meter id="m-mid" value={0.62} low={0.25} high={0.85} optimum={0.1} valuetext="12.4 GB of 16 GB" ariaLabel="Disk usage">12.4 GB of 16 GB</Meter>
                  </div>
                  <div class="grid gap-1.5">
                    <label for="m-high" class="text-sm font-medium">Disk — nearly full (danger)</label>
                    <Meter id="m-high" value={0.94} low={0.25} high={0.85} optimum={0.1} valuetext="15.0 GB of 16 GB" ariaLabel="Disk nearly full">15.0 GB of 16 GB</Meter>
                  </div>
                </div>
              ),
              jsx: `<Meter value={0.18} low={0.25} high={0.85} optimum={0.1}
       valuetext="18% load" ariaLabel="CPU idle" />     // green
<Meter value={0.62} low={0.25} high={0.85} optimum={0.1}
       valuetext="12.4 GB of 16 GB" ariaLabel="Disk" /> // amber
<Meter value={0.94} low={0.25} high={0.85} optimum={0.1}
       valuetext="15.0 GB of 16 GB" ariaLabel="Disk" /> // red`,
              jinja: `{{ meter(value=0.18, low=0.25, high=0.85, optimum=0.1,
         value_text="18% load", aria_label="CPU idle") }}
{{ meter(value=0.62, low=0.25, high=0.85, optimum=0.1,
         value_text="12.4 GB of 16 GB", aria_label="Disk") }}
{{ meter(value=0.94, low=0.25, high=0.85, optimum=0.1,
         value_text="15.0 GB of 16 GB", aria_label="Disk") }}`,
              go: `{{template "meter" (dict "Value" 0.18 "Low" 0.25 "High" 0.85 "Optimum" 0.1 "ValueText" "18% load" "AriaLabel" "CPU idle")}}
{{template "meter" (dict "Value" 0.62 "Low" 0.25 "High" 0.85 "Optimum" 0.1 "ValueText" "12.4 GB of 16 GB" "AriaLabel" "Disk")}}`,
              phoenix: `<.meter value={0.18} low={0.25} high={0.85} optimum={0.1} value_text="18% load" aria-label="CPU idle" />
<.meter value={0.62} low={0.25} high={0.85} optimum={0.1} value_text="12.4 GB of 16 GB" aria-label="Disk" />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — server-driven live gauge",
              description:
                "Poll the server every second; the response is a fresh Meter fragment with the latest reading. A meter (unlike progress) keeps polling — it tracks an ongoing measurement.",
              narrative: (
                <p>
                  Wrap the meter in a container that{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>s
                  a fragment on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="load, every 1s"</code>{" "}
                  and swaps{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">outerHTML</code>
                  . Because a gauge measures a live quantity, polling never
                  has to stop — here we just jitter a mock memory reading.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger (every Xs)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-1.5">
                  <label for="m-mem" class="text-sm font-medium">Memory (live)</label>
                  <div hx-get="/meter/tick" hx-trigger="load, every 1s" hx-swap="outerHTML">
                    <Meter id="m-mem" value={0.4} low={0.5} high={0.85} optimum={0.1} ariaLabel="Memory usage">loading…</Meter>
                  </div>
                </div>
              ),
              jsx: `<div hx-get="/api/memory" hx-trigger="load, every 1s" hx-swap="outerHTML">
  <Meter value={0.4} low={0.5} high={0.85} optimum={0.1}
         ariaLabel="Memory usage" />
</div>

// Server returns a refreshed fragment each tick:
<Meter value={0.63} low={0.5} high={0.85} optimum={0.1}
       valuetext="10.1 GB of 16 GB" ariaLabel="Memory usage" />`,
              jinja: `<div hx-get="/api/memory" hx-trigger="load, every 1s" hx-swap="outerHTML">
  {{ meter(value=0.4, low=0.5, high=0.85, optimum=0.1, aria_label="Memory usage") }}
</div>`,
              go: `<div hx-get="/api/memory" hx-trigger="load, every 1s" hx-swap="outerHTML">
  {{template "meter" (dict "Value" 0.4 "Low" 0.5 "High" 0.85 "Optimum" 0.1 "AriaLabel" "Memory usage")}}
</div>`,
              phoenix: `<div hx-get={~p"/api/memory"} hx-trigger="load, every 1s" hx-swap="outerHTML">
  <.meter value={0.4} low={0.5} high={0.85} optimum={0.1} aria-label="Memory usage" />
</div>`,
            })}
          </section>

          <ApiTable title="<Meter>" rows={METER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// htmx polling endpoint — returns the next reading of a mock memory gauge.
meterRoutes.get("/tick", (c) => {
  // Drift a value around 0.55–0.75 so the gauge visibly moves each tick.
  const v = 0.55 + Math.random() * 0.2
  const gb = (v * 16).toFixed(1)
  return c.html(
    <div hx-get="/meter/tick" hx-trigger="every 1s" hx-swap="outerHTML">
      <Meter
        id="m-mem"
        value={Number(v.toFixed(3))}
        low={0.5}
        high={0.85}
        optimum={0.1}
        valuetext={`${gb} GB of 16 GB`}
        ariaLabel="Memory usage"
      >{gb} GB of 16 GB</Meter>
    </div>,
  )
})
