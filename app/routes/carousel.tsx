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
import { CAROUSEL_PROPS } from "@/app/data/api-rows"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/registry/ui/carousel"

export const carouselRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/carousel.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/carousel.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/carousel.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/carousel.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/carousel.html"), "utf8"),
])

const usageJsx = `import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel"

<Carousel id="gallery" ariaLabel="Featured photos">
  <CarouselContent>
    <CarouselItem><img src="/1.jpg" alt="…" /></CarouselItem>
    <CarouselItem><img src="/2.jpg" alt="…" /></CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

const usageJinja = `{% from "components/carousel.html" import carousel, carousel_content_open, carousel_content_close, carousel_item, carousel_previous, carousel_next %}

{% call carousel(id="gallery", aria_label="Featured photos") %}
  {{ carousel_content_open() }}
    {% call(_) carousel_item() %}<img src="/1.jpg" alt="…">{% endcall %}
    {% call(_) carousel_item() %}<img src="/2.jpg" alt="…">{% endcall %}
  {{ carousel_content_close() }}
  {{ carousel_previous() }}
  {{ carousel_next() }}
{% endcall %}`

const usageGo = `{{template "carousel" (dict
  "ID" "gallery" "AriaLabel" "Featured photos"
  "Body" (htmlSafe \`
    {{template "carousel_content" (dict "Body" (htmlSafe \`
      {{template "carousel_item" (dict "Body" (htmlSafe "<img src=\\"/1.jpg\\" alt=\\"…\\">"))}}
      {{template "carousel_item" (dict "Body" (htmlSafe "<img src=\\"/2.jpg\\" alt=\\"…\\">"))}}
    \`))}}
    {{template "carousel_previous" (dict)}}
    {{template "carousel_next" (dict)}}
  \`))}}`

const usagePhoenix = `<.carousel id="gallery" aria-label="Featured photos">
  <.carousel_content>
    <.carousel_item><img src="/1.jpg" alt="…" /></.carousel_item>
    <.carousel_item><img src="/2.jpg" alt="…" /></.carousel_item>
  </.carousel_content>
  <.carousel_previous />
  <.carousel_next />
</.carousel>`

const usageHtml = `<section id="gallery" data-slot="carousel" data-carousel role="group"
         aria-roledescription="carousel" aria-label="Featured photos"
         class="group/carousel relative">
  <div data-slot="carousel-content" aria-live="polite" tabindex="0"
       class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scrollbar-none …">
    <div data-slot="carousel-item" role="group" aria-roledescription="slide"
         class="min-w-0 shrink-0 basis-full snap-center">…</div>
  </div>
  <button data-carousel-prev aria-label="Previous slide" class="…">‹</button>
  <button data-carousel-next aria-label="Next slide" class="…">›</button>
</section>
<script>/* see snippets/carousel.html for the boot + scroll wiring */</script>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-multi", label: "Multiple per view", nested: true },
  { href: "#api", label: "API Reference" },
]

// Reusable demo tiles so the previews don't repeat the same markup.
function Tile(props: { n: number }) {
  return (
    <div class="flex aspect-video items-center justify-center rounded-lg border bg-muted text-4xl font-semibold text-muted-foreground">
      {props.n}
    </div>
  )
}

carouselRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/carousel.json`

  return page(
    c,
    <Layout title="Carousel — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/carousel" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Carousel</h1>
            <p class="text-muted-foreground">
              A slideshow built on native CSS{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">scroll-snap</code>. Touch,
              trackpad, and keyboard scrolling are the platform's; Prev/Next
              buttons advance one slide via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">scrollBy()</code>. WAI-ARIA
              carousel roles throughout.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-carousel"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/carousel.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/carousel.html", source: jinjaSource, note: "Copy carousel.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/carousel.tmpl", source: goSource, note: "Add carousel.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/carousel.ex", source: phoenixSource, note: "Drop carousel.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/carousel.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css and inlines the scroll wiring." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — one slide at a time",
              description:
                "Swipe / scroll horizontally, or use the Prev/Next buttons. The buttons disable at each end of the track. Slides snap to centre.",
              narrative: (
                <p>
                  The scroller is a plain overflow region with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">snap-x snap-mandatory</code>{" "}
                  and each slide{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">snap-center</code>, so
                  touch, trackpad and the browser's own keyboard scrolling all
                  work with zero JS. The container is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="group"</code> with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-roledescription="carousel"</code>;
                  each slide is a labelled{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="group"</code> announced
                  as "N of M". The Prev/Next buttons are the only scripted part —
                  they call <code class="rounded bg-muted px-1 py-0.5 text-xs">scrollBy()</code>.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Carousel pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/",
                },
                {
                  source: "MDN",
                  label: "Element.scrollBy()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy",
                },
                {
                  source: "MDN",
                  label: "aria-roledescription",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-roledescription",
                },
              ],
              preview: (
                <Carousel id="ex-basic-carousel" ariaLabel="Demo photos" class="w-full max-w-md">
                  <CarouselContent>
                    <CarouselItem><Tile n={1} /></CarouselItem>
                    <CarouselItem><Tile n={2} /></CarouselItem>
                    <CarouselItem><Tile n={3} /></CarouselItem>
                    <CarouselItem><Tile n={4} /></CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ),
              jsx: `<Carousel id="gallery" ariaLabel="Demo photos">
  <CarouselContent>
    <CarouselItem><Tile n={1} /></CarouselItem>
    <CarouselItem><Tile n={2} /></CarouselItem>
    <CarouselItem><Tile n={3} /></CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
              jinja: `{% call carousel(id="gallery", aria_label="Demo photos") %}
  {{ carousel_content_open() }}
    {% call(_) carousel_item() %}…slide 1…{% endcall %}
    {% call(_) carousel_item() %}…slide 2…{% endcall %}
    {% call(_) carousel_item() %}…slide 3…{% endcall %}
  {{ carousel_content_close() }}
  {{ carousel_previous() }}
  {{ carousel_next() }}
{% endcall %}`,
              go: `{{template "carousel" (dict "ID" "gallery" "AriaLabel" "Demo photos"
  "Body" (htmlSafe \`
    {{template "carousel_content" (dict "Body" (htmlSafe \`…slides…\`))}}
    {{template "carousel_previous" (dict)}}
    {{template "carousel_next" (dict)}}
  \`))}}`,
              phoenix: `<.carousel id="gallery" aria-label="Demo photos">
  <.carousel_content>
    <.carousel_item>…slide 1…</.carousel_item>
    <.carousel_item>…slide 2…</.carousel_item>
    <.carousel_item>…slide 3…</.carousel_item>
  </.carousel_content>
  <.carousel_previous />
  <.carousel_next />
</.carousel>`,
            })}

            {await Example({
              id: "ex-multi",
              title: "Multiple slides per view",
              description:
                "Override each item's basis so several slides show at once. The snap points still keep them aligned as you scroll.",
              narrative: (
                <p>
                  Carousels aren't only one-at-a-time. Because every slide is a
                  flex child, you control how many are visible by changing the
                  item's basis (e.g.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">basis-1/2</code> for two,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">basis-1/3</code> for three).
                  Everything else — snapping, the Prev/Next scrollBy step, the
                  ARIA labels — is unchanged.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Carousel — roles, states & properties",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/#wai-ariaroles,states,andproperties",
                },
              ],
              preview: (
                <Carousel id="ex-multi-carousel" ariaLabel="Product thumbnails" class="w-full max-w-md">
                  <CarouselContent>
                    <CarouselItem class="basis-1/2"><Tile n={1} /></CarouselItem>
                    <CarouselItem class="basis-1/2"><Tile n={2} /></CarouselItem>
                    <CarouselItem class="basis-1/2"><Tile n={3} /></CarouselItem>
                    <CarouselItem class="basis-1/2"><Tile n={4} /></CarouselItem>
                    <CarouselItem class="basis-1/2"><Tile n={5} /></CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ),
              jsx: `<Carousel id="thumbs" ariaLabel="Product thumbnails">
  <CarouselContent>
    <CarouselItem class="basis-1/2">…</CarouselItem>
    <CarouselItem class="basis-1/2">…</CarouselItem>
    <CarouselItem class="basis-1/2">…</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
              jinja: `{% call carousel(id="thumbs", aria_label="Product thumbnails") %}
  {{ carousel_content_open() }}
    {% call(_) carousel_item(extra_class="basis-1/2") %}…{% endcall %}
    {% call(_) carousel_item(extra_class="basis-1/2") %}…{% endcall %}
  {{ carousel_content_close() }}
  {{ carousel_previous() }}
  {{ carousel_next() }}
{% endcall %}`,
              go: `{{template "carousel_item" (dict "Body" (htmlSafe \`…\`))}}
{{/* add class="basis-1/2" by composing your own item div, or extend the template */}}`,
              phoenix: `<.carousel id="thumbs" aria-label="Product thumbnails">
  <.carousel_content>
    <.carousel_item class="basis-1/2">…</.carousel_item>
    <.carousel_item class="basis-1/2">…</.carousel_item>
  </.carousel_content>
  <.carousel_previous />
  <.carousel_next />
</.carousel>`,
            })}
          </section>

          <ApiTable title="<Carousel>" rows={CAROUSEL_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
