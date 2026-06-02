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
import { SCROLL_AREA_PROPS } from "@/app/data/api-rows"
import { ScrollArea } from "@/registry/ui/scroll-area"

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#api", label: "API Reference" },
]

export const scrollAreaRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/scroll-area.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/scroll-area.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/scroll-area.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/scroll_area.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/scroll-area.html"), "utf8"),
])

const usageJsx = `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea aria-label="Changelog" class="h-72 w-full max-w-sm border">
  <div class="p-4 text-sm">…lots of content…</div>
</ScrollArea>`

const usageJinja = `{% from "components/scroll-area.html" import scroll_area %}

{% call scroll_area(aria_label="Changelog", extra_class="h-72 w-full max-w-sm border") %}
  <div class="p-4 text-sm">…lots of content…</div>
{% endcall %}`

const usageGo = `tpl.ExecuteTemplate(w, "scroll-area", map[string]any{
    "AriaLabel": "Changelog",
    "Class":     "h-72 w-full max-w-sm border",
    "Body":      template.HTML(\`<div class="p-4 text-sm">…</div>\`),
})`

const usagePhoenix = `alias ShadcnHtmx.Components.ScrollArea

<ScrollArea.scroll_area aria-label="Changelog" class="h-72 w-full max-w-sm border">
  <div class="p-4 text-sm">…lots of content…</div>
</ScrollArea.scroll_area>`

const usageHtml = `<!-- Set a height on the ROOT so the region constrains its content. -->
<div data-slot="scroll-area" data-orientation="vertical"
     class="relative overflow-hidden rounded-md border h-72 w-full max-w-sm">
  <div data-slot="scroll-area-viewport" data-scroll-area-viewport data-fade="true"
       role="region" aria-label="Changelog" tabindex="0"
       class="size-full scroll-smooth scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent overflow-y-auto overflow-x-hidden rounded-[inherit]">
    <div class="p-4 text-sm">…lots of content…</div>
  </div>
</div>`

scrollAreaRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/scroll-area.json`
  return page(
    c,
    <Layout title="Scroll Area — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/scroll-area" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Scroll Area</h1>
            <p class="text-muted-foreground">
              A constrained-overflow region with a themed scrollbar and optional
              fade masks that appear only while more content can scroll into view.
              Scrolling is fully native — keyboard, wheel, trackpad, and touch all
              work with zero JavaScript. No Radix-style scrollbar reimplementation;
              the masks are driven by CSS{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">@container scroll-state()</code>.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack — no npm package, no build step required. Use the
              shadcn CLI for JSX projects, or copy the source straight into your
              template directory.
            </p>
            <LangTabs
              id="install-scroll-area"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/scroll-area.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/scroll-area.html", source: jinjaSource, note: "Copy scroll-area.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/scroll-area.tmpl", source: goSource, note: "Add scroll-area.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/scroll_area.ex", source: phoenixSource, note: "Drop scroll_area.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/scroll-area.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Vertical, with fade masks",
              description:
                "Scroll the panel. The bottom fade hints there is more; the top fade appears once you leave the top edge.",
              narrative: (
                <p>
                  The viewport is a native scroll container (
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">overflow-y: auto</code>
                  ), so wheel, trackpad, touch, and the browser's own arrow-key
                  scrolling all work with no JavaScript. The fade masks are pure
                  CSS: the viewport is a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scroll-state</code>{" "}
                  query container, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">@container scroll-state(scrollable: top | bottom)</code>{" "}
                  fades each mask in only while there is still content to scroll to
                  in that direction. Give the region a height on the root and an
                  accessible name so screen-reader users can reach and identify it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "@container scroll-state()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@container",
                },
                {
                  source: "MDN",
                  label: "Using container scroll-state queries",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries",
                },
              ],
              preview: (
                <ScrollArea ariaLabel="Release notes" class="h-64 w-full max-w-sm border">
                  <div class="space-y-3 p-4 text-sm">
                    <p class="font-medium text-foreground">v4.0.0</p>
                    <p>Native scrolling, themed scrollbar, CSS-only fade masks.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit.</p>
                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa.</p>
                    <p>Qui officia deserunt mollit anim id est laborum.</p>
                    <p class="text-muted-foreground">— end of changelog —</p>
                  </div>
                </ScrollArea>
              ),
              jsx: `<ScrollArea aria-label="Release notes" class="h-64 w-full max-w-sm border">
  <div class="space-y-3 p-4 text-sm">…lots of content…</div>
</ScrollArea>`,
              jinja: `{% call scroll_area(aria_label="Release notes", extra_class="h-64 w-full max-w-sm border") %}
  <div class="space-y-3 p-4 text-sm">…lots of content…</div>
{% endcall %}`,
              go: `{{template "scroll-area" (dict
  "AriaLabel" "Release notes"
  "Class" "h-64 w-full max-w-sm border"
  "Body" (htmlSafe "<div class=\\"space-y-3 p-4 text-sm\\">…</div>")
)}}`,
              phoenix: `<ScrollArea.scroll_area aria-label="Release notes" class="h-64 w-full max-w-sm border">
  <div class="space-y-3 p-4 text-sm">…lots of content…</div>
</ScrollArea.scroll_area>`,
            })}

            {await Example({
              id: "ex-horizontal",
              title: "Horizontal, no fade",
              description:
                "Switch the overflow axis to horizontal and drop the masks. The themed scrollbar stays.",
              narrative: (
                <p>
                  Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">orientation="horizontal"</code>{" "}
                  to scroll along the inline axis, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">fade={"{false}"}</code>{" "}
                  when the edge cue would be noise (a chip row reads fine without
                  it). The scrollbar is themed with the standard{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scrollbar-width</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scrollbar-color</code>{" "}
                  properties (Tailwind's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scrollbar-thin</code>{" "}
                  utilities) — no custom thumb to drag, just the OS scrollbar tinted
                  to match the theme.
                </p>
              ),
              references: [
                {
                  source: "Tailwind",
                  label: "scrollbar-* utilities",
                  href: "https://tailwindcss.com/docs/scrollbar",
                },
                {
                  source: "MDN",
                  label: "overflow",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow",
                },
              ],
              preview: (
                <ScrollArea orientation="horizontal" fade={false} ariaLabel="Categories" class="w-full max-w-md border">
                  <div class="flex w-max gap-3 p-4 text-sm">
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">design</span>
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">engineering</span>
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">marketing</span>
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">operations</span>
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">research</span>
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">support</span>
                    <span class="rounded-full border px-3 py-1 whitespace-nowrap">finance</span>
                  </div>
                </ScrollArea>
              ),
              jsx: `<ScrollArea orientation="horizontal" fade={false} aria-label="Categories" class="w-full max-w-md border">
  <div class="flex w-max gap-3 p-4 text-sm">…chips…</div>
</ScrollArea>`,
              jinja: `{% call scroll_area(orientation="horizontal", fade=false, aria_label="Categories", extra_class="w-full max-w-md border") %}
  <div class="flex w-max gap-3 p-4 text-sm">…chips…</div>
{% endcall %}`,
              go: `{{template "scroll-area" (dict
  "Orientation" "horizontal" "NoFade" true
  "AriaLabel" "Categories" "Class" "w-full max-w-md border"
  "Body" (htmlSafe "<div class=\\"flex w-max gap-3 p-4 text-sm\\">…</div>")
)}}`,
              phoenix: `<ScrollArea.scroll_area orientation="horizontal" fade={false} aria-label="Categories" class="w-full max-w-md border">
  <div class="flex w-max gap-3 p-4 text-sm">…chips…</div>
</ScrollArea.scroll_area>`,
            })}
          </section>

          <ApiTable
            title="<ScrollArea>"
            caption="hx-*, data-*, aria-*, and standard attributes are forwarded onto the root via ...rest."
            rows={SCROLL_AREA_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
