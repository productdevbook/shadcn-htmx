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
import { FIGURE_PROPS } from "@/app/data/api-rows"
import {
  Figure,
  FigureCaption,
  FigureContent,
  FigureCredit,
} from "@/registry/ui/figure"

export const figureRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/figure.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/figure.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/figure.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/figure.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/figure.html"), "utf8"),
])

// Inline SVG placeholder so the docs render with zero external requests.
const PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='%2306b6d4'/><stop offset='1' stop-color='%237c3aed'/>` +
      `</linearGradient></defs>` +
      `<rect width='640' height='360' fill='url(%23g)'/>` +
      `<text x='50%' y='50%' fill='white' font-family='sans-serif' font-size='28' ` +
      `text-anchor='middle' dominant-baseline='middle'>640 × 360</text></svg>`,
  )

const usageJsx = `import {
  Figure,
  FigureCaption,
  FigureContent,
  FigureCredit,
} from "@/components/ui/figure"

// Image with a caption below
<Figure>
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md" />
  <FigureCaption>An elephant at sunset</FigureCaption>
</Figure>

// Code block with a legend on top
<Figure captionSide="top">
  <FigureCaption>Detect the browser via navigator</FigureCaption>
  <FigureContent>
    <pre class="overflow-x-auto p-4"><code>navigator.userAgent</code></pre>
  </FigureContent>
</Figure>`

const usageJinja = `{% from "components/figure.html" import figure, figure_content, figure_caption, figure_credit %}

{% call figure() %}
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md">
  {% call figure_caption() %}An elephant at sunset{% endcall %}
{% endcall %}`

const usageGo = `{{template "figure" (dict
  "Body" "<img src=\\"/elephant.jpg\\" alt=\\"An elephant at sunset\\" class=\\"w-full rounded-md\\">"
  "Caption" "An elephant at sunset")}}`

const usagePhoenix = `<.figure>
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md" />
  <.figure_caption>An elephant at sunset</.figure_caption>
</.figure>`

const usageHtml = `<figure data-slot="figure" data-caption-side="bottom"
        class="flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-3 text-card-foreground">
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md">
  <figcaption data-slot="figure-caption"
              class="px-1 text-sm leading-snug text-muted-foreground">
    An elephant at sunset
  </figcaption>
</figure>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Captioned image", nested: true },
  { href: "#ex-code", label: "Code block (legend on top)", nested: true },
  { href: "#ex-quote", label: "Quotation", nested: true },
  { href: "#api", label: "API Reference" },
]

figureRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/figure.json`

  return page(
    c,
    <Layout title="Figure — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/figure" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Figure</h1>
            <p class="text-muted-foreground">
              Self-contained, referenced content — an image, diagram, code
              block, or quotation — wrapped in a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;figure&gt;</code>{" "}
              whose{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;figcaption&gt;</code>{" "}
              supplies its accessible name. Distinct from a Card's generic
              surface: a figure can be moved out of the main flow without
              breaking it. Zero JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-figure"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/figure.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/figure.html", source: jinjaSource, note: "Copy figure.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/figure.tmpl", source: goSource, note: "Add figure.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/figure.ex", source: phoenixSource, note: "Drop figure.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/figure.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Captioned image",
              description:
                "An <img> followed by a <figcaption>. The caption becomes the figure's accessible name.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;figcaption&gt;</code>{" "}
                  is the figure's caption <em>and</em> its{" "}
                  <a
                    class="underline underline-offset-4"
                    href="https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name"
                  >
                    accessible name
                  </a>
                  : a screen reader announces "An elephant at sunset, figure".
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;img&gt;</code>{" "}
                  still needs its own{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">alt</code>;
                  the two serve different jobs. A nested{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">FigureCredit</code>{" "}
                  stays inside the caption so attribution is part of that name.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<figure>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure",
                },
                {
                  source: "MDN",
                  label: "<figcaption>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption",
                },
              ],
              preview: (
                <div class="w-full max-w-sm">
                  <Figure>
                    <img
                      src={PHOTO}
                      alt="Gradient placeholder, 640 by 360"
                      class="w-full rounded-md"
                    />
                    <FigureCaption>
                      An elephant at sunset
                      <FigureCredit>Photo: J. Doe / CC BY 4.0</FigureCredit>
                    </FigureCaption>
                  </Figure>
                </div>
              ),
              jsx: `<Figure>
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md" />
  <FigureCaption>
    An elephant at sunset
    <FigureCredit>Photo: J. Doe / CC BY 4.0</FigureCredit>
  </FigureCaption>
</Figure>`,
              jinja: `{% call figure() %}
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md">
  {% call figure_caption() %}
    An elephant at sunset
    {% call figure_credit() %}Photo: J. Doe / CC BY 4.0{% endcall %}
  {% endcall %}
{% endcall %}`,
              go: `{{template "figure" (dict
  "Body" "<img src=\\"/elephant.jpg\\" alt=\\"An elephant at sunset\\" class=\\"w-full rounded-md\\">"
  "Caption" "An elephant at sunset<span data-slot=\\"figure-credit\\" class=\\"mt-1 block text-xs text-muted-foreground/80\\">Photo: J. Doe / CC BY 4.0</span>")}}`,
              phoenix: `<.figure>
  <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md" />
  <.figure_caption>
    An elephant at sunset
    <.figure_credit>Photo: J. Doe / CC BY 4.0</.figure_credit>
  </.figure_caption>
</.figure>`,
            })}

            {await Example({
              id: "ex-code",
              title: "Code block with a legend on top",
              description:
                "captionSide=\"top\" renders the <figcaption> first, as a legend introducing the snippet.",
              narrative: (
                <p>
                  The spec allows the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;figcaption&gt;</code>{" "}
                  to be the figure's <em>first or last</em> child — the first
                  one found is the caption. Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">captionSide="top"</code>{" "}
                  and place the caption before the content for a legend.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">FigureContent</code>{" "}
                  gives non-replaced content a muted backdrop.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Code snippets in <figure>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure#code_snippets",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <Figure captionSide="top">
                    <FigureCaption>
                      Read the user-agent string via <code>navigator</code>.
                    </FigureCaption>
                    <FigureContent>
                      <pre class="overflow-x-auto p-4">
                        <code>console.log(navigator.userAgent);</code>
                      </pre>
                    </FigureContent>
                  </Figure>
                </div>
              ),
              jsx: `<Figure captionSide="top">
  <FigureCaption>
    Read the user-agent string via <code>navigator</code>.
  </FigureCaption>
  <FigureContent>
    <pre class="overflow-x-auto p-4"><code>console.log(navigator.userAgent);</code></pre>
  </FigureContent>
</Figure>`,
              jinja: `{% call figure(caption_side="top") %}
  {% call figure_caption() %}Read the user-agent string via <code>navigator</code>.{% endcall %}
  {% call figure_content() %}
    <pre class="overflow-x-auto p-4"><code>console.log(navigator.userAgent);</code></pre>
  {% endcall %}
{% endcall %}`,
              go: `{{template "figure" (dict
  "CaptionSide" "top"
  "Caption" "Read the user-agent string via <code>navigator</code>."
  "Body" "<div data-slot=\\"figure-content\\" class=\\"overflow-hidden rounded-md bg-muted text-sm text-foreground\\"><pre class=\\"overflow-x-auto p-4\\"><code>console.log(navigator.userAgent);</code></pre></div>")}}`,
              phoenix: `<.figure caption_side="top">
  <.figure_caption>
    Read the user-agent string via <code>navigator</code>.
  </.figure_caption>
  <.figure_content>
    <pre class="overflow-x-auto p-4"><code>console.log(navigator.userAgent);</code></pre>
  </.figure_content>
</.figure>`,
            })}

            {await Example({
              id: "ex-quote",
              title: "Quotation with attribution",
              description:
                "A <blockquote> inside FigureContent; the <figcaption> carries the attribution.",
              narrative: (
                <p>
                  Per the MDN quotation example, the quoted text is the
                  content and the source is the caption. Keep the attribution
                  in the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;figcaption&gt;</code>{" "}
                  so it remains the figure's accessible name.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Quotations in <figure>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure#quotations",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <Figure>
                    <FigureContent>
                      <blockquote class="border-l-2 border-border px-4 py-3 italic">
                        If debugging is the process of removing software bugs,
                        then programming must be the process of putting them in.
                      </blockquote>
                    </FigureContent>
                    <FigureCaption>— Edsger W. Dijkstra</FigureCaption>
                  </Figure>
                </div>
              ),
              jsx: `<Figure>
  <FigureContent>
    <blockquote class="border-l-2 border-border px-4 py-3 italic">
      If debugging is the process of removing software bugs, then
      programming must be the process of putting them in.
    </blockquote>
  </FigureContent>
  <FigureCaption>— Edsger W. Dijkstra</FigureCaption>
</Figure>`,
              jinja: `{% call figure() %}
  {% call figure_content() %}
    <blockquote class="border-l-2 border-border px-4 py-3 italic">…</blockquote>
  {% endcall %}
  {% call figure_caption() %}— Edsger W. Dijkstra{% endcall %}
{% endcall %}`,
              go: `{{template "figure" (dict
  "Body" "<div data-slot=\\"figure-content\\" class=\\"overflow-hidden rounded-md bg-muted text-sm text-foreground\\"><blockquote class=\\"border-l-2 border-border px-4 py-3 italic\\">…</blockquote></div>"
  "Caption" "— Edsger W. Dijkstra")}}`,
              phoenix: `<.figure>
  <.figure_content>
    <blockquote class="border-l-2 border-border px-4 py-3 italic">…</blockquote>
  </.figure_content>
  <.figure_caption>— Edsger W. Dijkstra</.figure_caption>
</.figure>`,
            })}
          </section>

          <ApiTable title="<Figure>" rows={FIGURE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
