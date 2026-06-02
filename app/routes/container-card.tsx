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
import { CONTAINER_CARD_PROPS } from "@/app/data/api-rows"
import {
  ContainerCard,
  ContainerCardTitle,
  ContainerCardDescription,
  ContainerCardFooter,
} from "@/registry/ui/container-card"

export const containerCardRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/container-card.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/container-card.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/container-card.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/container_card.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/container-card.html"), "utf8"),
])

const usageJsx = `import {
  ContainerCard,
  ContainerCardTitle,
  ContainerCardDescription,
  ContainerCardFooter,
} from "@/components/ui/container-card"

// Same markup adapts to whatever column it lands in — no per-call breakpoints.
<ContainerCard
  ariaLabelledby="cc-1"
  media={<img src="/cover.jpg" alt="" class="size-full object-cover" />}
>
  <ContainerCardTitle id="cc-1">Card title</ContainerCardTitle>
  <ContainerCardDescription>Supporting copy.</ContainerCardDescription>
  <ContainerCardFooter>
    <a href="/more">Read more</a>
  </ContainerCardFooter>
</ContainerCard>

// Text-only card, custom flip threshold, semantic <section>.
<ContainerCard as="section" break="20rem">
  <ContainerCardTitle>No media</ContainerCardTitle>
</ContainerCard>`

const usageJinja = `{% from "components/container-card.html" import container_card %}

{% call container_card(
     title="Card title",
     description="Supporting copy",
     media='<img src="/cover.jpg" alt="" class="size-full object-cover">'
   ) %}
  <a href="/more">Read more</a>
{% endcall %}`

const usageGo = `{{template "container-card" (dict
    "Title" "Card title"
    "Description" "Supporting copy"
    "Media" (htmlSafe ` + "`" + `<img src="/cover.jpg" alt="" class="size-full object-cover">` + "`" + `)
    "Body" (htmlSafe ` + "`" + `<a href="/more">Read more</a>` + "`" + `))}}`

const usagePhoenix = `<.container_card>
  <:media>
    <img src="/cover.jpg" alt="" class="size-full object-cover" />
  </:media>
  <.container_card_title>Card title</.container_card_title>
  <.container_card_description>Supporting copy.</.container_card_description>
  <.container_card_footer>
    <a href="/more">Read more</a>
  </.container_card_footer>
</.container_card>`

const usageHtml = `<article data-slot="container-card"
         style="--container-card-break:28rem"
         class="@container/container-card overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
  <div data-slot="container-card-layout"
       class="flex flex-col @min-[28rem]/container-card:grid @min-[28rem]/container-card:grid-cols-[40%_1fr]">
    <div data-slot="container-card-media" class="bg-muted aspect-video w-full">…</div>
    <div data-slot="container-card-body" class="flex flex-col gap-2 p-6 text-center @min-[28rem]/container-card:text-left">…</div>
  </div>
</article>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Same card, two columns", nested: true },
  { href: "#ex-grid", label: "In a grid", nested: true },
  { href: "#ex-text", label: "Text-only & threshold", nested: true },
  { href: "#api", label: "API Reference" },
]

const LINK = "text-sm font-medium text-primary underline-offset-4 hover:underline"
const CODE = "rounded bg-muted px-1 py-0.5 text-xs"

containerCardRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/container-card.json`

  return page(
    c,
    <Layout title="Container Card — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/container-card" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Container Card</h1>
            <p class="text-muted-foreground">
              A self-adapting card that restyles based on its{" "}
              <strong>own inline width</strong>, not the viewport. The same
              markup stacks media above text in a narrow sidebar and lays them
              side-by-side in a wide column — built on CSS{" "}
              <code class={CODE}>container-type: inline-size</code> and{" "}
              <code class={CODE}>@container</code> queries. Pure CSS, zero
              JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-container-card"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/container-card.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/container-card.html", source: jinjaSource, note: "Copy container-card.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/container-card.tmpl", source: goSource, note: "Add container-card.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/container_card.ex", source: phoenixSource, note: "Drop container_card.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/container-card.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "One card, two layouts",
              description:
                "The exact same ContainerCard is rendered in a narrow 18rem column and a wide column. It stacks in the narrow one and goes side-by-side in the wide one — no viewport breakpoints involved.",
              narrative: (
                <p>
                  The card carries{" "}
                  <code class={CODE}>@container/container-card</code> (which sets{" "}
                  <code class={CODE}>container-type: inline-size</code> and names
                  the container), so its children query the{" "}
                  <em>card's</em> width with{" "}
                  <code class={CODE}>@min-[28rem]/container-card:</code> — exactly
                  the web.dev "container query card" pattern, where base styles
                  are single-column and an{" "}
                  <code class={CODE}>@container (min-width)</code> rule flips to a
                  two-column grid. Drop the same markup anywhere; it adapts to the
                  slot it lands in.
                </p>
              ),
              references: [
                { source: "MDN", label: "container-type", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/container-type" },
                { source: "Tailwind", label: "web.dev — Container query card", href: "https://web.dev/patterns/layout/container-query-card/" },
              ],
              preview: (
                <div class="grid w-full gap-6 sm:grid-cols-[14rem_minmax(30rem,1fr)]" data-test="basic">
                  <div class="space-y-1.5">
                    <p class="text-xs font-medium text-muted-foreground">Narrow column (14rem)</p>
                    <ContainerCard ariaLabelledby="cc-b-narrow" media={<div class="size-full" />}>
                      <ContainerCardTitle id="cc-b-narrow">Trailhead</ContainerCardTitle>
                      <ContainerCardDescription>
                        A loop with big views and an easy grade.
                      </ContainerCardDescription>
                      <ContainerCardFooter>
                        <a href="#" class={LINK}>View route</a>
                      </ContainerCardFooter>
                    </ContainerCard>
                  </div>
                  <div class="space-y-1.5">
                    <p class="text-xs font-medium text-muted-foreground">Wide column</p>
                    <ContainerCard ariaLabelledby="cc-b-wide" media={<div class="size-full" />}>
                      <ContainerCardTitle id="cc-b-wide">Trailhead</ContainerCardTitle>
                      <ContainerCardDescription>
                        A loop with big views and an easy grade.
                      </ContainerCardDescription>
                      <ContainerCardFooter>
                        <a href="#" class={LINK}>View route</a>
                      </ContainerCardFooter>
                    </ContainerCard>
                  </div>
                </div>
              ),
              jsx: `<ContainerCard
  ariaLabelledby="cc-1"
  media={<img src="/cover.jpg" alt="" class="size-full object-cover" />}
>
  <ContainerCardTitle id="cc-1">Trailhead</ContainerCardTitle>
  <ContainerCardDescription>A loop with big views and an easy grade.</ContainerCardDescription>
  <ContainerCardFooter>
    <a href="#">View route</a>
  </ContainerCardFooter>
</ContainerCard>`,
              jinja: `{% call container_card(
     title="Trailhead",
     description="A loop with big views and an easy grade.",
     media='<img src="/cover.jpg" alt="" class="size-full object-cover">'
   ) %}
  <a href="#">View route</a>
{% endcall %}`,
              go: `{{template "container-card" (dict
    "Title" "Trailhead"
    "Description" "A loop with big views and an easy grade."
    "Media" (htmlSafe \`<img src="/cover.jpg" alt="" class="size-full object-cover">\`)
    "Body" (htmlSafe \`<a href="#">View route</a>\`))}}`,
              phoenix: `<.container_card>
  <:media><img src="/cover.jpg" alt="" class="size-full object-cover" /></:media>
  <.container_card_title>Trailhead</.container_card_title>
  <.container_card_description>A loop with big views and an easy grade.</.container_card_description>
  <.container_card_footer><a href="#">View route</a></.container_card_footer>
</.container_card>`,
            })}

            {await Example({
              id: "ex-grid",
              title: "In a grid — each cell decides for itself",
              description:
                "Place the same card in grid cells of different widths. Each instance queries its own cell, so the wide cells go side-by-side while the narrow ones stay stacked — the property container queries give you over a viewport-only approach.",
              narrative: (
                <p>
                  Because the query container is the card itself, a single column
                  count for the page no longer dictates each card's layout. This
                  is the headline benefit web.dev calls out: components own their
                  responsive logic and "best fit" whatever container they're
                  given.
                </p>
              ),
              references: [
                { source: "MDN", label: "@container at-rule", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@container" },
              ],
              preview: (
                <div class="grid w-full gap-4 sm:grid-cols-[1fr_2fr]" data-test="grid">
                  <ContainerCard ariaLabel="Compact card" media={<div class="size-full" />}>
                    <ContainerCardTitle>Compact</ContainerCardTitle>
                    <ContainerCardDescription>Narrow cell stays stacked.</ContainerCardDescription>
                  </ContainerCard>
                  <ContainerCard ariaLabel="Roomy card" media={<div class="size-full" />}>
                    <ContainerCardTitle>Roomy</ContainerCardTitle>
                    <ContainerCardDescription>
                      Wider cell flips to media-beside-text automatically.
                    </ContainerCardDescription>
                  </ContainerCard>
                </div>
              ),
              jsx: `<div class="grid grid-cols-[1fr_2fr] gap-4">
  <ContainerCard media={<img … />}>
    <ContainerCardTitle>Compact</ContainerCardTitle>
  </ContainerCard>
  <ContainerCard media={<img … />}>
    <ContainerCardTitle>Roomy</ContainerCardTitle>
  </ContainerCard>
</div>`,
              jinja: `<div class="grid grid-cols-[1fr_2fr] gap-4">
  {% call container_card(title="Compact", media='<img … />') %}{% endcall %}
  {% call container_card(title="Roomy", media='<img … />') %}{% endcall %}
</div>`,
              go: `<div class="grid grid-cols-[1fr_2fr] gap-4">
  {{template "container-card" (dict "Title" "Compact" "Media" (htmlSafe $img))}}
  {{template "container-card" (dict "Title" "Roomy" "Media" (htmlSafe $img))}}
</div>`,
              phoenix: `<div class="grid grid-cols-[1fr_2fr] gap-4">
  <.container_card><:media><img … /></:media><.container_card_title>Compact</.container_card_title></.container_card>
  <.container_card><:media><img … /></:media><.container_card_title>Roomy</.container_card_title></.container_card>
</div>`,
            })}

            {await Example({
              id: "ex-text",
              title: "Text-only & a tighter threshold",
              description:
                "Omit the media slot for a text-only card. The flip threshold is configurable via the break prop (published as the --container-card-break custom property); the left card flips earlier at 20rem.",
              narrative: (
                <p>
                  The threshold is exposed as{" "}
                  <code class={CODE}>--container-card-break</code> for inspection,
                  but the active query lives in the{" "}
                  <code class={CODE}>@min-[…]</code> variant: a container query's
                  condition cannot read a custom property, so the numeric value
                  must match in both places (a platform limitation, not a hack).
                </p>
              ),
              references: [
                { source: "MDN", label: "Container size queries", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries" },
              ],
              preview: (
                <div class="grid w-full gap-4 sm:grid-cols-2" data-test="text">
                  <ContainerCard as="section" break="20rem" ariaLabel="Early flip">
                    <ContainerCardTitle>Flips at 20rem</ContainerCardTitle>
                    <ContainerCardDescription>No media, earlier threshold.</ContainerCardDescription>
                  </ContainerCard>
                  <ContainerCard as="section" ariaLabel="Default flip">
                    <ContainerCardTitle>Flips at 28rem</ContainerCardTitle>
                    <ContainerCardDescription>No media, default threshold.</ContainerCardDescription>
                  </ContainerCard>
                </div>
              ),
              jsx: `// Text-only, flips at a tighter threshold.
<ContainerCard as="section" break="20rem">
  <ContainerCardTitle>Flips at 20rem</ContainerCardTitle>
  <ContainerCardDescription>No media, earlier threshold.</ContainerCardDescription>
</ContainerCard>`,
              jinja: `{% call container_card(tag="section", break_at="20rem", title="Flips at 20rem", description="No media, earlier threshold.") %}{% endcall %}`,
              go: `{{template "container-card" (dict "Tag" "section" "Break" "20rem" "Title" "Flips at 20rem" "Description" "No media, earlier threshold.")}}`,
              phoenix: `<.container_card tag="section" break="20rem">
  <.container_card_title>Flips at 20rem</.container_card_title>
  <.container_card_description>No media, earlier threshold.</.container_card_description>
</.container_card>`,
            })}
          </section>

          <ApiTable title="<ContainerCard>" rows={CONTAINER_CARD_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
