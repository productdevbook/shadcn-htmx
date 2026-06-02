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
import { RELATIVE_TIME_PROPS } from "@/app/data/api-rows"
import { RelativeTime } from "@/registry/ui/relative-time"

export const relativeTimeRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/relative-time.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/relative-time.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/relative-time.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/relative_time.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/relative-time.html"), "utf8"),
  ])

const usageJsx = `import { RelativeTime } from "@/components/ui/relative-time"

<RelativeTime datetime="2024-05-12T09:00:00Z">3 days ago</RelativeTime>
<RelativeTime datetime="2024-05-12T09:00:00Z" format="datetime" tone="default">
  May 12, 2024
</RelativeTime>`

const usageJinja = `{% from "components/relative-time.html" import relative_time %}

{% call relative_time("2024-05-12T09:00:00Z") %}3 days ago{% endcall %}
{% call relative_time("2024-05-12T09:00:00Z", format="datetime") %}May 12, 2024{% endcall %}`

const usageGo = `{{template "relative-time" (dict "Datetime" "2024-05-12T09:00:00Z" "Label" "3 days ago")}}
{{template "relative-time" (dict "Datetime" "2024-05-12T09:00:00Z" "Label" "May 12, 2024" "Format" "datetime")}}`

const usagePhoenix = `<.relative_time datetime="2024-05-12T09:00:00Z">3 days ago</.relative_time>
<.relative_time datetime="2024-05-12T09:00:00Z" format="datetime" tone="default">
  May 12, 2024
</.relative_time>`

const usageHtml = `<time datetime="2024-05-12T09:00:00Z"
      data-slot="relative-time" data-relative-time="" data-format="relative"
      class="tabular-nums text-muted-foreground">3 days ago</time>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Relative label", nested: true },
  { href: "#ex-datetime", label: "Absolute date", nested: true },
  { href: "#ex-degrade", label: "Progressive enhancement", nested: true },
  { href: "#api", label: "API Reference" },
]

relativeTimeRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/relative-time.json`

  return page(
    c,
    <Layout title="Relative Time — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/relative-time" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Relative Time</h1>
            <p class="text-muted-foreground">
              A semantic timestamp built on the native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                &lt;time&gt;
              </code>{" "}
              element. The server renders a machine-readable instant in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">datetime</code>{" "}
              and a human label as the text. A tiny optional script re-localises
              the label to the visitor's locale and timezone and degrades to the
              server value with no JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2
              id="installation"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Installation
            </h2>
            <LangTabs
              id="install-relative-time"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/relative-time.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/relative-time.html",
                    source: jinjaSource,
                    note: "Copy relative-time.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/relative-time.tmpl",
                    source: goSource,
                    note: "Add relative-time.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/relative_time.ex",
                    source: phoenixSource,
                    note: "Drop relative_time.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/relative-time.html",
                    source: htmlSource,
                    note: "Paste the markup; relies only on theme tokens.",
                  }),
                },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2
              id="examples"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Relative label — localised on the client",
              description:
                "The server renders 'a while ago' as a safe fallback; the script swaps in a fresh, locale-aware relative label like '3 days ago'.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    datetime
                  </code>{" "}
                  attribute is the machine-readable source of truth — search
                  engines and calendars read it. The text node is the human
                  label. When the script runs it rewrites the text with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    Intl.RelativeTimeFormat
                  </code>{" "}
                  in the visitor's own language, and adds a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">title</code>{" "}
                  with the absolute instant on hover.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<time> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time",
                },
                {
                  source: "MDN",
                  label: "Intl.RelativeTimeFormat",
                  href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat",
                },
              ],
              preview: (
                <p class="text-sm">
                  Last edited{" "}
                  <RelativeTime datetime="2024-05-12T09:00:00Z">
                    a while ago
                  </RelativeTime>
                  .
                </p>
              ),
              jsx: `<RelativeTime datetime="2024-05-12T09:00:00Z">a while ago</RelativeTime>`,
              jinja: `{% call relative_time("2024-05-12T09:00:00Z") %}a while ago{% endcall %}`,
              go: `{{template "relative-time" (dict "Datetime" "2024-05-12T09:00:00Z" "Label" "a while ago")}}`,
              phoenix: `<.relative_time datetime="2024-05-12T09:00:00Z">a while ago</.relative_time>`,
            })}

            {await Example({
              id: "ex-datetime",
              title: "Absolute date — locale + timezone aware",
              description:
                "Pass format=\"datetime\" to render an absolute date/time formatted for the visitor's locale and timezone via Intl.DateTimeFormat.",
              narrative: (
                <p>
                  Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    format="datetime"
                  </code>{" "}
                  when the exact moment matters more than its distance from now
                  (published dates, due dates). The server still ships a fixed
                  fallback string; the script reformats it into the reader's
                  locale so a visitor in Tokyo and one in Berlin each see a
                  familiar format from the same{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    datetime
                  </code>
                  .
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Intl.DateTimeFormat",
                  href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
                },
              ],
              preview: (
                <p class="text-sm">
                  Published{" "}
                  <RelativeTime
                    datetime="2024-05-12T09:00:00Z"
                    format="datetime"
                    tone="default"
                  >
                    May 12, 2024
                  </RelativeTime>
                  .
                </p>
              ),
              jsx: `<RelativeTime datetime="2024-05-12T09:00:00Z" format="datetime" tone="default">
  May 12, 2024
</RelativeTime>`,
              jinja: `{% call relative_time("2024-05-12T09:00:00Z", format="datetime", tone="default") %}May 12, 2024{% endcall %}`,
              go: `{{template "relative-time" (dict "Datetime" "2024-05-12T09:00:00Z" "Label" "May 12, 2024" "Format" "datetime" "Tone" "default")}}`,
              phoenix: `<.relative_time datetime="2024-05-12T09:00:00Z" format="datetime" tone="default">
  May 12, 2024
</.relative_time>`,
            })}

            {await Example({
              id: "ex-degrade",
              title: "Progressive enhancement — server label is the floor",
              description:
                "With JavaScript disabled the server-rendered text is shown verbatim. There is no spinner, no layout shift, no broken state — the element is meaningful before the script ever runs.",
              narrative: (
                <p>
                  This is the whole point of building on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    &lt;time&gt;
                  </code>
                  : the markup is complete and accessible on first paint. The
                  script is an enhancement layered on top, not a dependency.
                  Render whatever absolute or relative label your server
                  computes; the client only refines it when{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">Intl</code>{" "}
                  is available.
                </p>
              ),
              references: [
                {
                  source: "WCAG",
                  label: "1.3.1 Info and Relationships",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",
                },
              ],
              preview: (
                <ul class="space-y-1 text-sm">
                  <li>
                    Commit{" "}
                    <RelativeTime datetime="2023-11-02T14:30:00Z">
                      Nov 2, 2023
                    </RelativeTime>
                  </li>
                  <li>
                    Comment{" "}
                    <RelativeTime datetime="2024-04-30T18:05:00Z">
                      recently
                    </RelativeTime>
                  </li>
                </ul>
              ),
              jsx: `<RelativeTime datetime="2023-11-02T14:30:00Z">Nov 2, 2023</RelativeTime>
<RelativeTime datetime="2024-04-30T18:05:00Z">recently</RelativeTime>`,
              jinja: `{% call relative_time("2023-11-02T14:30:00Z") %}Nov 2, 2023{% endcall %}
{% call relative_time("2024-04-30T18:05:00Z") %}recently{% endcall %}`,
              go: `{{template "relative-time" (dict "Datetime" "2023-11-02T14:30:00Z" "Label" "Nov 2, 2023")}}
{{template "relative-time" (dict "Datetime" "2024-04-30T18:05:00Z" "Label" "recently")}}`,
              phoenix: `<.relative_time datetime="2023-11-02T14:30:00Z">Nov 2, 2023</.relative_time>
<.relative_time datetime="2024-04-30T18:05:00Z">recently</.relative_time>`,
            })}
          </section>

          <ApiTable title="<RelativeTime>" rows={RELATIVE_TIME_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
