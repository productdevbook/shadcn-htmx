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
import { DATE_TIME_PICKER_PROPS } from "@/app/data/api-rows"
import { DateTimePicker } from "@/registry/ui/date-time-picker"

export const dateTimePickerRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/date-time-picker.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/date-time-picker.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/date-time-picker.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/date_time_picker.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/date-time-picker.html"), "utf8"),
])

const usageJsx = `import { DateTimePicker } from "@/components/ui/date-time-picker"

<DateTimePicker name="bday" type="date" min="1900-01-01" ariaLabel="Date of birth" />`

const usageJinja = `{% from "components/date-time-picker.html" import date_time_picker %}

{{ date_time_picker(name="bday", type="date", min="1900-01-01", aria_label="Date of birth") }}`

const usageGo = `tpl.ExecuteTemplate(w, "date-time-picker", map[string]any{
    "Name": "bday", "Type": "date", "Min": "1900-01-01",
    "AriaLabel": "Date of birth",
})`

const usagePhoenix = `<.date_time_picker name="bday" type="date" min="1900-01-01" aria-label="Date of birth" />`

const usageHtml = `<input type="date" name="bday" min="1900-01-01" data-slot="date-time-picker"
       class="flex h-9 w-full min-w-0 rounded-md border border-input … focus-visible:ring-ring/50">`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Date", nested: true },
  { href: "#ex-types", label: "All five types", nested: true },
  { href: "#ex-htmx", label: "htmx available slots", nested: true },
  { href: "#api", label: "API Reference" },
]

dateTimePickerRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/date-time-picker.json`

  return page(
    c,
    <Layout title="Date Time Picker — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/date-time-picker" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">Date Time Picker</h1>
            <p class="text-muted-foreground">
              A family of native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="date | time | datetime-local | month | week"&gt;</code>{" "}
              fields with shadcn polish. The browser supplies the calendar /
              clock picker, segment editing and{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">min</code>/
              <code class="rounded bg-muted px-1 py-0.5 text-sm">max</code>/
              <code class="rounded bg-muted px-1 py-0.5 text-sm">step</code>{" "}
              validation — no JS calendar library. Whatever the user's locale,
              the submitted value is always normalised and machine-readable.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. Use the shadcn CLI for JSX, or copy the source
              for your template engine. There is no JavaScript to wire up.
            </p>
            <LangTabs
              id="install-date-time-picker"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/date-time-picker.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/date-time-picker.html", source: jinjaSource, note: "Copy date-time-picker.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/date-time-picker.tmpl", source: goSource, note: "Add date-time-picker.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/date_time_picker.ex", source: phoenixSource, note: "Drop date_time_picker.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/date-time-picker.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens. No script needed." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Date with min / max",
              description:
                "A native date field bounded to a range. The browser enforces min/max and normalises the submitted value to yyyy-mm-dd regardless of the user's locale display.",
              narrative: (
                <p>
                  The displayed format follows the user's browser locale, but
                  the value posted to the server is always{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">yyyy-mm-dd</code>.
                  Setting{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max</code>{" "}
                  greys out the out-of-range days in the picker and fails
                  constraint validation on submit — no JS required.
                </p>
              ),
              references: [
                { source: "MDN", label: "<input type=date>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date" },
                { source: "MDN", label: "Date and time formats", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats" },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-2">
                  <label class="text-xs font-medium" for="ex-basic-date">Trip start</label>
                  <DateTimePicker id="ex-basic-date" name="trip-start" type="date" value="2026-07-22" min="2026-01-01" max="2026-12-31" />
                </div>
              ),
              jsx: `<DateTimePicker name="trip-start" type="date"
            value="2026-07-22" min="2026-01-01" max="2026-12-31"
            ariaLabel="Trip start" />`,
              jinja: `{{ date_time_picker(name="trip-start", type="date",
                value="2026-07-22", min="2026-01-01", max="2026-12-31",
                aria_label="Trip start") }}`,
              go: `{{template "date-time-picker" (dict
  "Name" "trip-start" "Type" "date" "Value" "2026-07-22"
  "Min" "2026-01-01" "Max" "2026-12-31" "AriaLabel" "Trip start")}}`,
              phoenix: `<.date_time_picker name="trip-start" type="date"
              value="2026-07-22" min="2026-01-01" max="2026-12-31"
              aria-label="Trip start" />`,
            })}

            {await Example({
              id: "ex-types",
              title: "All five types",
              description:
                "One component, five native controls. Each posts a different normalised value format and offers the matching picker UI.",
              narrative: (
                <p>
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">time</code>{" "}
                  uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">step</code>{" "}
                  in seconds (so{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">step="1"</code>{" "}
                  reveals a seconds segment), its{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min</code>/
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max</code>{" "}
                  can even cross midnight (a periodic domain), while{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">week</code>{" "}
                  posts an ISO-8601 week string like{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">2026-W23</code>.
                </p>
              ),
              references: [
                { source: "MDN", label: "<input type=time> (step is seconds)", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time" },
                { source: "MDN", label: "<input type=datetime-local>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local" },
                { source: "MDN", label: "<input type=week>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/week" },
              ],
              preview: (
                <div class="grid w-full max-w-sm gap-4">
                  <div class="grid gap-2">
                    <label class="text-xs font-medium" for="ex-t-time">Time (15-min slots)</label>
                    <DateTimePicker id="ex-t-time" name="slot" type="time" min="09:00" max="18:00" step="900" value="09:30" />
                  </div>
                  <div class="grid gap-2">
                    <label class="text-xs font-medium" for="ex-t-dtl">Starts at</label>
                    <DateTimePicker id="ex-t-dtl" name="starts" type="datetime-local" value="2026-06-02T14:00" />
                  </div>
                  <div class="grid gap-2">
                    <label class="text-xs font-medium" for="ex-t-month">Billing month</label>
                    <DateTimePicker id="ex-t-month" name="period" type="month" value="2026-06" />
                  </div>
                  <div class="grid gap-2">
                    <label class="text-xs font-medium" for="ex-t-week">Reporting week</label>
                    <DateTimePicker id="ex-t-week" name="reporting-week" type="week" value="2026-W23" />
                  </div>
                </div>
              ),
              jsx: `<DateTimePicker type="time" name="slot" min="09:00" max="18:00" step="900" />
<DateTimePicker type="datetime-local" name="starts" />
<DateTimePicker type="month" name="period" />
<DateTimePicker type="week" name="reporting-week" />`,
              jinja: `{{ date_time_picker(type="time", name="slot", min="09:00", max="18:00", step=900) }}
{{ date_time_picker(type="datetime-local", name="starts") }}
{{ date_time_picker(type="month", name="period") }}
{{ date_time_picker(type="week", name="reporting-week") }}`,
              go: `{{template "date-time-picker" (dict "Type" "time" "Name" "slot" "Min" "09:00" "Max" "18:00" "Step" "900")}}
{{template "date-time-picker" (dict "Type" "datetime-local" "Name" "starts")}}
{{template "date-time-picker" (dict "Type" "month" "Name" "period")}}
{{template "date-time-picker" (dict "Type" "week" "Name" "reporting-week")}}`,
              phoenix: `<.date_time_picker type="time" name="slot" min="09:00" max="18:00" step="900" />
<.date_time_picker type="datetime-local" name="starts" />
<.date_time_picker type="month" name="period" />
<.date_time_picker type="week" name="reporting-week" />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — available slots",
              description:
                "Pick a date and htmx GETs the open time slots for that day. The native change event fires the request; the server returns the list.",
              narrative: (
                <p>
                  The date field fires htmx on its native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">change</code>{" "}
                  event — dispatched when the user commits a selection from the
                  picker.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-get</code>{" "}
                  sends the normalised{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">yyyy-mm-dd</code>{" "}
                  value and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  swaps the server's answer into the slots region. No client
                  state.
                </p>
              ),
              references: [
                { source: "htmx", label: "hx-get", href: "https://htmx.org/attributes/hx-get/" },
                { source: "htmx", label: "hx-trigger (change)", href: "https://htmx.org/attributes/hx-trigger/" },
              ],
              preview: (
                <div class="grid w-full max-w-xs gap-3">
                  <label class="text-xs font-medium" for="ex-htmx-date">Booking date</label>
                  <DateTimePicker
                    id="ex-htmx-date"
                    name="date"
                    type="date"
                    value="2026-06-02"
                    min="2026-06-01"
                    hx-get="/date-time-picker/slots"
                    hx-target="#ex-htmx-slots"
                    hx-swap="innerHTML"
                    hx-trigger="change"
                  />
                  <div id="ex-htmx-slots" class="text-sm text-muted-foreground" aria-live="polite">
                    Pick a date to see open times.
                  </div>
                </div>
              ),
              jsx: `<DateTimePicker name="date" type="date" min="2026-06-01"
            hx-get="/api/slots" hx-target="#slots"
            hx-swap="innerHTML" hx-trigger="change" />
<div id="slots" aria-live="polite"></div>`,
              jinja: `{{ date_time_picker(name="date", type="date", min="2026-06-01",
                hx_get="/api/slots", hx_target="#slots",
                hx_swap="innerHTML", hx_trigger="change") }}
<div id="slots" aria-live="polite"></div>`,
              go: `{{template "date-time-picker" (dict
  "Name" "date" "Type" "date" "Min" "2026-06-01"
  "Attrs" (dict
    "hx-get" "/api/slots" "hx-target" "#slots"
    "hx-swap" "innerHTML" "hx-trigger" "change"
  ))}}`,
              phoenix: `<.date_time_picker name="date" type="date" min="2026-06-01"
              hx-get="/api/slots" hx-target="#slots"
              hx-swap="innerHTML" hx-trigger="change" />`,
            })}
          </section>

          <ApiTable title="<DateTimePicker>" rows={DATE_TIME_PICKER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ─── htmx endpoint for the available-slots demo ─────────────────────

dateTimePickerRoutes.get("/slots", async (c) => {
  const date = c.req.query("date") ?? ""
  // Deterministic pseudo-availability so the demo is stable: derive a couple
  // of open slots from the day-of-month. Real apps would query a calendar.
  const day = Number(date.slice(-2)) || 1
  const all = ["09:00", "10:30", "13:00", "14:30", "16:00"]
  const open = all.filter((_, i) => (day + i) % 2 === 0)
  if (!date) return c.html(<>Pick a date to see open times.</>)
  if (open.length === 0) return c.html(<>No times available on {date}.</>)
  return c.html(
    <>
      Available on {date}:{" "}
      <span class="font-medium text-foreground">{open.join(", ")}</span>
    </>,
  )
})
