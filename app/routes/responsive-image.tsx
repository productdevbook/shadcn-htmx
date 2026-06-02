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
import { RESPONSIVE_IMAGE_PROPS } from "@/app/data/api-rows"
import { ResponsiveImage } from "@/registry/ui/responsive-image"

export const responsiveImageRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/responsive-image.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/responsive-image.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/responsive-image.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/responsive_image.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/responsive-image.html"), "utf8"),
])

// Inline SVG data URIs so the live previews render real, loadable images with
// no extra asset files or network calls. encodeURIComponent escapes commas so
// each URI stays valid as a single srcset candidate.
const svg = (bg: string, label: string, w = 600, h = 338) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="${bg}"/>` +
      `<text x="${w / 2}" y="${h / 2}" font-family="sans-serif" font-size="30" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`,
  )

const WIDE = svg("#1e293b", "Wide 600x338")
const SQUARE = svg("#0f766e", "Square 400x400", 400, 400)
const DARK_ASSET = svg("#020617", "Dark asset")
const LIGHT_ASSET = svg("#e2e8f0", "Light asset")
const JPEG_FALLBACK = svg("#7c2d12", "JPEG fallback")

const usageJsx = `import { ResponsiveImage } from "@/components/ui/responsive-image"

<ResponsiveImage
  src="/img/hero.jpg"
  alt="A surfer at golden hour"
  sources={[
    { srcset: "/img/hero.avif", type: "image/avif" },
    { srcset: "/img/hero.webp", type: "image/webp" },
  ]}
/>`

const usageJinja = `{% from "components/responsive-image.html" import responsive_image %}

{{ responsive_image(
     src="/img/hero.jpg", alt="A surfer at golden hour",
     sources=[
       {"srcset": "/img/hero.avif", "type": "image/avif"},
       {"srcset": "/img/hero.webp", "type": "image/webp"},
     ]) }}`

const usageGo = `{{template "responsive-image" (dict
    "Src" "/img/hero.jpg" "Alt" "A surfer at golden hour"
    "Sources" (list
        (dict "Srcset" "/img/hero.avif" "Type" "image/avif")
        (dict "Srcset" "/img/hero.webp" "Type" "image/webp")))}}`

const usagePhoenix = `<.responsive_image src={~p"/img/hero.jpg"} alt="A surfer at golden hour">
  <:source srcset={~p"/img/hero.avif"} type="image/avif" />
  <:source srcset={~p"/img/hero.webp"} type="image/webp" />
</.responsive_image>`

const usageHtml = `<picture data-slot="responsive-image"
  class="block overflow-hidden rounded-lg border bg-muted">
  <source srcset="/img/hero.avif" type="image/avif">
  <source srcset="/img/hero.webp" type="image/webp">
  <img src="/img/hero.jpg" alt="A surfer at golden hour"
       data-slot="responsive-image-img" class="block size-full object-cover">
</picture>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-formats", label: "Format negotiation", nested: true },
  { href: "#ex-theme", label: "Light / dark swap", nested: true },
  { href: "#ex-art", label: "Art direction", nested: true },
  { href: "#api", label: "API Reference" },
]

responsiveImageRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/responsive-image.json`

  return page(
    c,
    <Layout title="Responsive Image — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/responsive-image" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Responsive Image</h1>
            <p class="text-muted-foreground">
              Art-directed, format-switching image built on native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;picture&gt;</code>{" "}
              +{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;source&gt;</code>.
              The browser walks the sources by{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">media</code> and{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">type</code>,
              picks the first match, and falls back to the{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;img&gt;</code>{" "}
              — all natively, with zero JS.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-responsive-image"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/responsive-image.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/responsive-image.html", source: jinjaSource, note: "Copy responsive-image.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/responsive-image.tmpl", source: goSource, note: "Add responsive-image.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/responsive_image.ex", source: phoenixSource, note: "Drop responsive_image.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/responsive-image.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-formats",
              title: "Format negotiation — AVIF → WebP → JPEG",
              description:
                "Offer modern formats first; the browser skips any type it can't decode and lands on the <img> fallback.",
              narrative: (
                <p>
                  Each{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;source&gt;</code>{" "}
                  declares a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">type</code>;
                  per MDN the browser compares it against the formats it can
                  display and skips unsupported ones{" "}
                  <em>without a network request</em>. The trailing{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;img&gt;</code>{" "}
                  is mandatory — it sizes the box and is the universal fallback.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<picture>: offering alternative image formats",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture#the_type_attribute",
                },
                {
                  source: "MDN",
                  label: "<source srcset> required inside <picture>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source#srcset",
                },
              ],
              preview: (
                <ResponsiveImage
                  class="mx-auto max-w-md"
                  src={JPEG_FALLBACK}
                  alt="Surfer at golden hour"
                  sources={[
                    { srcset: WIDE, type: "image/svg+xml" },
                  ]}
                />
              ),
              jsx: `<ResponsiveImage
  src="/img/hero.jpg"
  alt="Surfer at golden hour"
  sources={[
    { srcset: "/img/hero.avif", type: "image/avif" },
    { srcset: "/img/hero.webp", type: "image/webp" },
  ]}
/>`,
              jinja: `{{ responsive_image(
     src="/img/hero.jpg", alt="Surfer at golden hour",
     sources=[
       {"srcset": "/img/hero.avif", "type": "image/avif"},
       {"srcset": "/img/hero.webp", "type": "image/webp"},
     ]) }}`,
              go: `{{template "responsive-image" (dict
    "Src" "/img/hero.jpg" "Alt" "Surfer at golden hour"
    "Sources" (list
        (dict "Srcset" "/img/hero.avif" "Type" "image/avif")
        (dict "Srcset" "/img/hero.webp" "Type" "image/webp")))}}`,
              phoenix: `<.responsive_image src={~p"/img/hero.jpg"} alt="Surfer at golden hour">
  <:source srcset={~p"/img/hero.avif"} type="image/avif" />
  <:source srcset={~p"/img/hero.webp"} type="image/webp" />
</.responsive_image>`,
            })}

            {await Example({
              id: "ex-theme",
              title: "Light / dark swap — prefers-color-scheme",
              description:
                "Serve a different asset per OS theme. The media query is evaluated natively by the <picture>; no JS, no theme class.",
              narrative: (
                <p>
                  Change your OS / browser colour scheme to see the asset swap.
                  This responds to the platform{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    (prefers-color-scheme)
                  </code>{" "}
                  media feature — the real web-standard mechanism the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;picture&gt;</code>{" "}
                  element supports — not a userland theme toggle. Ideal for
                  diagrams or screenshots that need a matching background.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<picture>: light/dark with prefers-color-scheme",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture#the_media_attribute",
                },
              ],
              preview: (
                <ResponsiveImage
                  class="mx-auto max-w-md"
                  imgClass="object-contain"
                  src={LIGHT_ASSET}
                  alt="System architecture diagram"
                  sources={[
                    { srcset: DARK_ASSET, media: "(prefers-color-scheme: dark)" },
                    { srcset: LIGHT_ASSET, media: "(prefers-color-scheme: light)" },
                  ]}
                />
              ),
              jsx: `<ResponsiveImage
  src="/img/diagram-light.png"
  alt="System architecture diagram"
  imgClass="object-contain"
  sources={[
    { srcset: "/img/diagram-dark.png",  media: "(prefers-color-scheme: dark)" },
    { srcset: "/img/diagram-light.png", media: "(prefers-color-scheme: light)" },
  ]}
/>`,
              jinja: `{{ responsive_image(
     src="/img/diagram-light.png", alt="System architecture diagram",
     img_class="object-contain",
     sources=[
       {"srcset": "/img/diagram-dark.png",  "media": "(prefers-color-scheme: dark)"},
       {"srcset": "/img/diagram-light.png", "media": "(prefers-color-scheme: light)"},
     ]) }}`,
              go: `{{template "responsive-image" (dict
    "Src" "/img/diagram-light.png" "Alt" "System architecture diagram"
    "ImgClass" "object-contain"
    "Sources" (list
        (dict "Srcset" "/img/diagram-dark.png"  "Media" "(prefers-color-scheme: dark)")
        (dict "Srcset" "/img/diagram-light.png" "Media" "(prefers-color-scheme: light)")))}}`,
              phoenix: `<.responsive_image src={~p"/img/diagram-light.png"} alt="System architecture diagram" img_class="object-contain">
  <:source srcset={~p"/img/diagram-dark.png"}  media="(prefers-color-scheme: dark)" />
  <:source srcset={~p"/img/diagram-light.png"} media="(prefers-color-scheme: light)" />
</.responsive_image>`,
            })}

            {await Example({
              id: "ex-art",
              title: "Art direction — crop per viewport + lazy",
              description:
                "A wide crop on large screens, a square crop on small ones, plus loading=\"lazy\" and decoding=\"async\" on the fallback.",
              narrative: (
                <p>
                  Resize the window past{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">800px</code>{" "}
                  to switch crops. Art direction is the canonical{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;picture&gt;</code>{" "}
                  use case — a different composition, not just a different size.
                  Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">width</code>/<code class="rounded bg-muted px-1 py-0.5 text-xs">height</code>{" "}
                  to reserve layout space and avoid CLS.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<source media> for art direction in <picture>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source#media",
                },
                {
                  source: "MDN",
                  label: "<img> loading=lazy",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#loading",
                },
              ],
              preview: (
                <ResponsiveImage
                  class="mx-auto max-w-md"
                  src={SQUARE}
                  alt="Conference keynote stage"
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  sources={[
                    { srcset: WIDE, media: "(min-width: 800px)", width: 600, height: 338 },
                  ]}
                />
              ),
              jsx: `<ResponsiveImage
  src="/img/banner-square.jpg"
  alt="Conference keynote stage"
  width={600} height={600}
  loading="lazy" decoding="async"
  sources={[
    { srcset: "/img/banner-wide.jpg", media: "(min-width: 800px)", width: 1200, height: 400 },
  ]}
/>`,
              jinja: `{{ responsive_image(
     src="/img/banner-square.jpg", alt="Conference keynote stage",
     width=600, height=600, loading="lazy", decoding="async",
     sources=[
       {"srcset": "/img/banner-wide.jpg", "media": "(min-width: 800px)", "width": 1200, "height": 400},
     ]) }}`,
              go: `{{template "responsive-image" (dict
    "Src" "/img/banner-square.jpg" "Alt" "Conference keynote stage"
    "Width" 600 "Height" 600 "Loading" "lazy" "Decoding" "async"
    "Sources" (list
        (dict "Srcset" "/img/banner-wide.jpg" "Media" "(min-width: 800px)" "Width" 1200 "Height" 400)))}}`,
              phoenix: `<.responsive_image src={~p"/img/banner-square.jpg"} alt="Conference keynote stage"
  width={600} height={600} loading="lazy" decoding="async">
  <:source srcset={~p"/img/banner-wide.jpg"} media="(min-width: 800px)" width={1200} height={400} />
</.responsive_image>`,
            })}
          </section>

          <ApiTable title="<ResponsiveImage>" rows={RESPONSIVE_IMAGE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
