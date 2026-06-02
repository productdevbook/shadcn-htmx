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
import { ASPECT_RATIO_PROPS } from "@/app/data/api-rows"
import { AspectRatio } from "@/registry/ui/aspect-ratio"

export const aspectRatioRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/aspect-ratio.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/aspect-ratio.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/aspect-ratio.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/aspect_ratio.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/aspect-ratio.html"), "utf8"),
])

// A small inline SVG used as a placeholder "image" so the docs render with
// zero external network requests (and no broken-image flashes).
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

const usageJsx = `import { AspectRatio } from "@/components/ui/aspect-ratio"

// 16:9 photo, cropped to fill (default fit="cover")
<AspectRatio ratio="16/9">
  <img src="/photo.jpg" alt="Mountain lake at dawn" />
</AspectRatio>

// Square, letterboxed so nothing is cropped
<AspectRatio ratio="1/1" fit="contain">
  <img src="/logo.png" alt="Brand logo" />
</AspectRatio>

// Responsive video embed
<AspectRatio ratio="16/9">
  <iframe src="https://www.youtube-nocookie.com/embed/ID" title="Talk" allowfullscreen />
</AspectRatio>`

const usageJinja = `{% from "components/aspect-ratio.html" import aspect_ratio %}

{% call aspect_ratio(ratio="16/9") %}
  <img src="/photo.jpg" alt="Mountain lake at dawn" class="size-full object-cover">
{% endcall %}`

const usageGo = `{{template "aspect-ratio" (dict
  "Ratio" "16/9"
  "Body" "<img src=\\"/photo.jpg\\" alt=\\"Mountain lake\\" class=\\"size-full object-cover\\">")}}`

const usagePhoenix = `<.aspect_ratio ratio="16/9">
  <img src="/photo.jpg" alt="Mountain lake at dawn" class="size-full object-cover" />
</.aspect_ratio>`

const usageHtml = `<div data-slot="aspect-ratio" data-ratio="16/9"
     class="relative block w-full overflow-hidden aspect-video">
  <img src="/photo.jpg" alt="Mountain lake at dawn"
       data-slot="aspect-ratio-content" class="size-full object-cover">
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "16:9 image", nested: true },
  { href: "#ex-fit", label: "Cover vs contain", nested: true },
  { href: "#ex-embed", label: "Video embed", nested: true },
  { href: "#api", label: "API Reference" },
]

aspectRatioRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/aspect-ratio.json`

  return page(
    c,
    <Layout title="Aspect Ratio — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/aspect-ratio" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Aspect Ratio</h1>
            <p class="text-muted-foreground">
              A ratio-box wrapper that locks a child — image, video,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;iframe&gt;</code>,
              embed, or chart slot — to a fixed width-to-height ratio while it
              resizes fluidly, killing layout shift. One CSS declaration
              (native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aspect-ratio</code>),
              zero JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-aspect-ratio"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/aspect-ratio.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/aspect-ratio.html", source: jinjaSource, note: "Copy aspect-ratio.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/aspect-ratio.tmpl", source: goSource, note: "Add aspect-ratio.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/aspect_ratio.ex", source: phoenixSource, note: "Drop aspect_ratio.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/aspect-ratio.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "16:9 — fluid image with no layout shift",
              description:
                "The wrapper carries the ratio; the <img> stretches to fill it and is cropped with object-cover.",
              narrative: (
                <p>
                  The wrapper reserves the right amount of space before the
                  image loads, so there is no reflow when it arrives — the
                  classic cause of Cumulative Layout Shift. The ratio is the
                  native CSS{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aspect-ratio</code>{" "}
                  property (Tailwind's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aspect-video</code>{" "}
                  = 16/9); no padding-top hack, no JavaScript.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aspect-ratio",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
                },
                {
                  source: "Tailwind",
                  label: "aspect-ratio utilities",
                  href: "https://tailwindcss.com/docs/aspect-ratio",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <AspectRatio ratio="16/9" class="rounded-lg border">
                    <img src={PHOTO} alt="Gradient placeholder, 640 by 360" />
                  </AspectRatio>
                </div>
              ),
              jsx: `<AspectRatio ratio="16/9" class="rounded-lg border">
  <img src="/photo.jpg" alt="Mountain lake at dawn" />
</AspectRatio>`,
              jinja: `{% call aspect_ratio(ratio="16/9", extra_class="rounded-lg border") %}
  <img src="/photo.jpg" alt="Mountain lake at dawn" class="size-full object-cover">
{% endcall %}`,
              go: `{{template "aspect-ratio" (dict "Ratio" "16/9" "Class" "rounded-lg border"
  "Body" "<img src=\\"/photo.jpg\\" alt=\\"Mountain lake\\" class=\\"size-full object-cover\\">")}}`,
              phoenix: `<.aspect_ratio ratio="16/9" class="rounded-lg border">
  <img src="/photo.jpg" alt="Mountain lake at dawn" class="size-full object-cover" />
</.aspect_ratio>`,
            })}

            {await Example({
              id: "ex-fit",
              title: "Cover vs contain — how the child fills the box",
              description:
                "fit=\"cover\" (default) crops to fill; fit=\"contain\" letterboxes so nothing is cut off.",
              narrative: (
                <p>
                  Both boxes are the same 1:1 square. The left uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">object-cover</code>{" "}
                  — the image is scaled up and cropped to fill. The right uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">object-contain</code>{" "}
                  — the whole image is shown, with empty space around it. Use{" "}
                  cover for photos, contain for logos or diagrams you must not
                  crop. (object-fit has no effect on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;iframe&gt;</code>{" "}
                  or{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;embed&gt;</code>.)
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "object-fit",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md grid-cols-2 gap-4">
                  <AspectRatio ratio="1/1" fit="cover" class="rounded-lg border bg-muted">
                    <img src={PHOTO} alt="Cover fit, cropped to fill" />
                  </AspectRatio>
                  <AspectRatio ratio="1/1" fit="contain" class="rounded-lg border bg-muted">
                    <img src={PHOTO} alt="Contain fit, letterboxed" />
                  </AspectRatio>
                </div>
              ),
              jsx: `<AspectRatio ratio="1/1" fit="cover">
  <img src="/photo.jpg" alt="…" />
</AspectRatio>

<AspectRatio ratio="1/1" fit="contain">
  <img src="/logo.png" alt="…" />
</AspectRatio>`,
              jinja: `{% call aspect_ratio(ratio="1/1") %}
  <img src="/photo.jpg" alt="…" class="size-full object-cover">
{% endcall %}

{% call aspect_ratio(ratio="1/1") %}
  <img src="/logo.png" alt="…" class="size-full object-contain">
{% endcall %}`,
              go: `{{template "aspect-ratio" (dict "Ratio" "1/1"
  "Body" "<img src=\\"/photo.jpg\\" class=\\"size-full object-cover\\">")}}

{{template "aspect-ratio" (dict "Ratio" "1/1"
  "Body" "<img src=\\"/logo.png\\" class=\\"size-full object-contain\\">")}}`,
              phoenix: `<.aspect_ratio ratio="1/1">
  <img src="/photo.jpg" alt="…" class="size-full object-cover" />
</.aspect_ratio>

<.aspect_ratio ratio="1/1">
  <img src="/logo.png" alt="…" class="size-full object-contain" />
</.aspect_ratio>`,
            })}

            {await Example({
              id: "ex-embed",
              title: "Responsive video embed",
              description:
                "Wrap an <iframe> so a video embed stays 16:9 at every width — the most common reason to reach for this component.",
              narrative: (
                <p>
                  Drop an{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;iframe&gt;</code>{" "}
                  inside and it stretches to the ratio box at every viewport
                  width. Always give the iframe a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">title</code>{" "}
                  so its content has an accessible name. The placeholder below
                  stands in for the embed.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<iframe> title",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#title",
                },
                {
                  source: "WHATWG",
                  label: "The iframe element",
                  href: "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <AspectRatio ratio="16/9" class="rounded-lg border">
                    <div class="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
                      iframe embed (16 : 9)
                    </div>
                  </AspectRatio>
                </div>
              ),
              jsx: `<AspectRatio ratio="16/9" class="rounded-lg border">
  <iframe
    src="https://www.youtube-nocookie.com/embed/ID"
    title="Conference talk"
    allowfullscreen
  />
</AspectRatio>`,
              jinja: `{% call aspect_ratio(ratio="16/9", extra_class="rounded-lg border") %}
  <iframe src="https://www.youtube-nocookie.com/embed/ID"
          title="Conference talk" class="size-full" allowfullscreen></iframe>
{% endcall %}`,
              go: `{{template "aspect-ratio" (dict "Ratio" "16/9" "Class" "rounded-lg border"
  "Body" "<iframe src=\\"…/embed/ID\\" title=\\"Conference talk\\" class=\\"size-full\\" allowfullscreen></iframe>")}}`,
              phoenix: `<.aspect_ratio ratio="16/9" class="rounded-lg border">
  <iframe src="https://www.youtube-nocookie.com/embed/ID"
          title="Conference talk" class="size-full" allowfullscreen></iframe>
</.aspect_ratio>`,
            })}
          </section>

          <ApiTable title="<AspectRatio>" rows={ASPECT_RATIO_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
