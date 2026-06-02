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
import { BREADCRUMB_PROPS } from "@/app/data/api-rows"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/registry/ui/breadcrumb"

export const breadcrumbRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/breadcrumb.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/breadcrumb.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/breadcrumb.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/breadcrumb.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/breadcrumb.html"), "utf8"),
])

const usageJsx = `import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/components">Components</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`

const usageJinja = `{% from "components/breadcrumb.html" import breadcrumb_open, breadcrumb_close,
   breadcrumb_list_open, breadcrumb_list_close, breadcrumb_item,
   breadcrumb_link, breadcrumb_page, breadcrumb_separator %}

{{ breadcrumb_open(aria_label="Breadcrumb") }}{{ breadcrumb_list_open() }}
  {{ breadcrumb_item(breadcrumb_link("Home", href="/")) }}
  {{ breadcrumb_separator() }}
  {{ breadcrumb_item(breadcrumb_link("Components", href="/components")) }}
  {{ breadcrumb_separator() }}
  {{ breadcrumb_item(breadcrumb_page("Breadcrumb")) }}
{{ breadcrumb_list_close() }}{{ breadcrumb_close() }}`

const usageGo = `{{template "breadcrumb" (dict "Body" (htmlSafe \`
  {{template "breadcrumb_list" (dict "Body" (htmlSafe \\\`
    {{template "breadcrumb_item" (dict "Body" (htmlSafe "<a href=\\"/\\" data-slot=breadcrumb-link>Home</a>"))}}
    {{template "breadcrumb_separator" (dict)}}
    {{template "breadcrumb_item" (dict "Body" (htmlSafe "..."))}}
    {{template "breadcrumb_separator" (dict)}}
    {{template "breadcrumb_item" (dict "Body" (htmlSafe "<span data-slot=breadcrumb-page aria-current=page>Breadcrumb</span>"))}}
  \\\`))}}\`))}}`

const usagePhoenix = `<.breadcrumb aria-label="Breadcrumb">
  <.breadcrumb_list>
    <.breadcrumb_item><.breadcrumb_link href={~p"/"}>Home</.breadcrumb_link></.breadcrumb_item>
    <.breadcrumb_separator />
    <.breadcrumb_item><.breadcrumb_link href={~p"/components"}>Components</.breadcrumb_link></.breadcrumb_item>
    <.breadcrumb_separator />
    <.breadcrumb_item><.breadcrumb_page>Breadcrumb</.breadcrumb_page></.breadcrumb_item>
  </.breadcrumb_list>
</.breadcrumb>`

const usageHtml = `<nav data-slot="breadcrumb" aria-label="Breadcrumb">
  <ol data-slot="breadcrumb-list" class="flex flex-wrap items-center gap-1.5 text-sm …">
    <li data-slot="breadcrumb-item" class="inline-flex items-center gap-1.5">
      <a href="/" data-slot="breadcrumb-link" class="hover:text-foreground …">Home</a>
    </li>
    <li data-slot="breadcrumb-separator" aria-hidden="true">›</li>
    <li data-slot="breadcrumb-item">
      <span data-slot="breadcrumb-page" aria-current="page" class="text-foreground">Breadcrumb</span>
    </li>
  </ol>
</nav>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-custom-separator", label: "Custom separator", nested: true },
  { href: "#ex-ellipsis", label: "Collapsed", nested: true },
  { href: "#api", label: "API Reference" },
]

breadcrumbRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/breadcrumb.json`

  return page(
    c,
    <Layout title="Breadcrumb — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/breadcrumb" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Breadcrumb</h1>
            <p class="text-muted-foreground">
              A{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;nav&gt;</code>{" "}
              landmark wrapping an{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;ol&gt;</code>{" "}
              of links. The current page is a plain{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;span aria-current="page"&gt;</code>
              {" "}— not a link. Zero JS; separators are decorative.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-breadcrumb"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/breadcrumb.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/breadcrumb.html", source: jinjaSource, note: "Copy breadcrumb.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/breadcrumb.tmpl", source: goSource, note: "Add breadcrumb.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/breadcrumb.ex", source: phoenixSource, note: "Drop breadcrumb.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/breadcrumb.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — real links + current page",
              description:
                "Parent pages are real <a href> links; the current page is a non-interactive <span aria-current=\"page\">.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;nav aria-label="Breadcrumb"&gt;</code>{" "}
                  landmark lets AT users jump straight to the trail. Per the
                  APG, the current page carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-current="page"</code>{" "}
                  and is rendered as a plain span — not a faked link — so the
                  semantics match what the element actually is.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Breadcrumb pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
                },
                {
                  source: "MDN",
                  label: "aria-current",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current",
                },
              ],
              preview: (
                <div class="p-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              ),
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-custom-separator",
              title: "Custom separator",
              description:
                "Pass children to <BreadcrumbSeparator> to override the default chevron — e.g. a slash.",
              narrative: (
                <p>
                  The separator is a decorative{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;li aria-hidden="true"&gt;</code>
                  , so changing the glyph never affects what AT announces — the
                  links alone carry the meaning.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-hidden",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden",
                },
              ],
              preview: (
                <div class="p-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Docs</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>/</BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Guides</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>/</BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbPage>Routing</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              ),
              jsx: `<BreadcrumbSeparator>/</BreadcrumbSeparator>`,
              jinja: `{{ breadcrumb_separator("/") }}`,
              go: `{{template "breadcrumb_separator" (dict "Body" (htmlSafe "/"))}}`,
              phoenix: `<.breadcrumb_separator>/</.breadcrumb_separator>`,
            })}

            {await Example({
              id: "ex-ellipsis",
              title: "Collapsed — ellipsis for long trails",
              description:
                "Use <BreadcrumbEllipsis> to collapse middle items. The glyph is aria-hidden but ships an sr-only \"More\" label.",
              narrative: (
                <p>
                  When a trail is too deep, collapse the middle. The ellipsis is
                  decorative but includes a visually-hidden{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">More</code>{" "}
                  so AT users still hear that items were omitted.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Breadcrumb pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
                },
              ],
              preview: (
                <div class="p-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbEllipsis />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              ),
              jsx: `<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>`,
              jinja: `{{ breadcrumb_item(breadcrumb_ellipsis()) }}`,
              go: `{{template "breadcrumb_item" (dict "Body" (htmlSafe (printf "%s" "<span ...ellipsis...>")))}}`,
              phoenix: `<.breadcrumb_item><.breadcrumb_ellipsis /></.breadcrumb_item>`,
            })}
          </section>

          <ApiTable title="<Breadcrumb>" rows={BREADCRUMB_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
