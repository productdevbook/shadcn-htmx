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
import { SEPARATOR_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Separator } from "@/registry/ui/separator"

export const separatorRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  sepJsxSource,
  sepJinjaSource,
  sepGoSource,
  sepPhoenixSource,
  sepHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/separator.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/separator.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/separator.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/separator.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/separator.html"), "utf8"),
])

const usageJsx = `import { Separator } from "@/components/ui/separator"

// Decorative horizontal (default)
<Separator />

// Vertical between flex items
<div class="flex h-5 items-center gap-3">
  <span>Profile</span>
  <Separator orientation="vertical" />
  <span>Settings</span>
</div>

// Semantic <hr>
<Separator decorative={false} />`

const usageJinja = `{% from "components/separator.html" import separator %}

{{ separator() }}                                  {# decorative horizontal #}
{{ separator(orientation="vertical") }}            {# decorative vertical #}
{{ separator(decorative=false) }}                  {# semantic <hr> #}`

const usageGo = `{{template "separator" (dict)}}                                  // decorative horizontal
{{template "separator" (dict "Orientation" "vertical")}}        // decorative vertical
{{template "separator" (dict "Decorative" (ptr false))}}        // semantic <hr>`

const usagePhoenix = `<.separator />
<.separator orientation="vertical" />
<.separator decorative={false} />`

const usageHtml = `<!-- Decorative horizontal -->
<div data-slot="separator" data-orientation="horizontal"
  class="shrink-0 bg-border h-px w-full"></div>

<!-- Semantic horizontal -->
<hr class="shrink-0 border-0 bg-border h-px w-full">`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-decorative", label: "Decorative (default)", nested: true },
  { href: "#ex-semantic", label: "Semantic (hr)", nested: true },
  { href: "#ex-vertical", label: "Vertical", nested: true },
  { href: "#api", label: "API Reference" },
]

separatorRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/separator.json`

  return page(
    c,
    <Layout title="Separator — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/separator" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Separator</h1>
            <p class="text-muted-foreground">
              A horizontal or vertical line that visually divides content. Two
              flavours: decorative (purely visual, ignored by assistive tech)
              and semantic (renders{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;hr&gt;</code>{" "}
              or{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="separator"</code>{" "}
              so AT announces a thematic break).
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-separator"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/separator.tsx", source: sepJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/separator.html", source: sepJinjaSource, note: "Copy separator.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/separator.tmpl", source: sepGoSource, note: "Add separator.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/separator.ex", source: sepPhoenixSource, note: "Drop separator.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: sepHtmlSource, note: "Tailwind utilities only; no script." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-decorative",
              title: "Decorative — visual divider that AT skips",
              description:
                "Default mode. Renders as a styled <div> with no role so screen readers don't announce it.",
              narrative: (
                <p>
                  Use decorative for pure layout — the line between two
                  paragraphs in a card, the row separators in a sidebar. The
                  visual carries the meaning; the DOM stays semantically
                  silent so AT users aren't interrupted with "separator,
                  separator, separator" as they scan.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "role=\"separator\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/separator_role",
                },
                {
                  source: "WCAG",
                  label: "1.3.1 Info and Relationships",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",
                },
              ],
              preview: (
                <div class="w-full max-w-md space-y-3 text-sm">
                  <p>Above the separator.</p>
                  <Separator />
                  <p>Below the separator.</p>
                </div>
              ),
              jsx: `<p>Above the separator.</p>
<Separator />
<p>Below the separator.</p>`,
              jinja: `<p>Above the separator.</p>
{{ separator() }}
<p>Below the separator.</p>`,
              go: `<p>Above the separator.</p>
{{template "separator" (dict)}}
<p>Below the separator.</p>`,
              phoenix: `<p>Above the separator.</p>
<.separator />
<p>Below the separator.</p>`,
            })}

            {await Example({
              id: "ex-semantic",
              title: "Semantic — thematic break",
              description:
                "Use when the line marks a genuine section change (end of a chapter, new topic). Renders as <hr>, which AT announces.",
              narrative: (
                <p>
                  HTML's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;hr&gt;</code>{" "}
                  is "a paragraph-level thematic break"; it has implicit{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="separator"</code>{" "}
                  and screen readers announce "separator" or "horizontal rule".
                  Reach for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">decorative={"{"}false{"}"}</code>{" "}
                  when the line carries meaning (between two chapters, between
                  the body and footer of a long article).
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<hr> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr",
                },
                {
                  source: "WHATWG",
                  label: "<hr> in HTML",
                  href: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-hr-element",
                },
              ],
              preview: (
                <div class="w-full max-w-md space-y-3 text-sm">
                  <p>Chapter 1 concludes.</p>
                  <Separator decorative={false} />
                  <p>Chapter 2 begins.</p>
                </div>
              ),
              jsx: `<p>Chapter 1 concludes.</p>
<Separator decorative={false} />
<p>Chapter 2 begins.</p>`,
              jinja: `<p>Chapter 1 concludes.</p>
{{ separator(decorative=false) }}
<p>Chapter 2 begins.</p>`,
              go: `<p>Chapter 1 concludes.</p>
{{template "separator" (dict "Decorative" (ptr false))}}
<p>Chapter 2 begins.</p>`,
              phoenix: `<p>Chapter 1 concludes.</p>
<.separator decorative={false} />
<p>Chapter 2 begins.</p>`,
            })}

            {await Example({
              id: "ex-vertical",
              title: "Vertical — inside a flex row",
              description:
                "Set orientation=\"vertical\". The parent needs a defined height (flex with items-center, or explicit h-*).",
              narrative: (
                <p>
                  Vertical separators don't have a native HTML equivalent.
                  When decorative we render a div; when semantic we add{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="separator"</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-orientation="vertical"</code>
                  . APG notes that vertical orientation must be set
                  explicitly — assistive tech can't infer it from CSS.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-orientation",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-orientation",
                },
              ],
              preview: (
                <div class="flex h-6 items-center gap-3 text-sm">
                  <span>Profile</span>
                  <Separator orientation="vertical" />
                  <span>Settings</span>
                  <Separator orientation="vertical" />
                  <span>Log out</span>
                </div>
              ),
              jsx: `<div class="flex h-6 items-center gap-3 text-sm">
  <span>Profile</span>
  <Separator orientation="vertical" />
  <span>Settings</span>
  <Separator orientation="vertical" />
  <span>Log out</span>
</div>`,
              jinja: `<div class="flex h-6 items-center gap-3 text-sm">
  <span>Profile</span>  {{ separator(orientation="vertical") }}
  <span>Settings</span> {{ separator(orientation="vertical") }}
  <span>Log out</span>
</div>`,
              go: `<div class="flex h-6 items-center gap-3 text-sm">
  <span>Profile</span>  {{template "separator" (dict "Orientation" "vertical")}}
  <span>Settings</span> {{template "separator" (dict "Orientation" "vertical")}}
  <span>Log out</span>
</div>`,
              phoenix: `<div class="flex h-6 items-center gap-3 text-sm">
  <span>Profile</span>  <.separator orientation="vertical" />
  <span>Settings</span> <.separator orientation="vertical" />
  <span>Log out</span>
</div>`,
            })}
          </section>
          <ApiTable
            title="<Separator>"
            rows={SEPARATOR_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
