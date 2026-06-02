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
import { TOOLTIP_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Tooltip } from "@/registry/ui/tooltip"
import { Button } from "@/registry/ui/button"

export const tooltipRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  ttJsxSource,
  ttJinjaSource,
  ttGoSource,
  ttPhoenixSource,
  ttHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/tooltip.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/tooltip.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/tooltip.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/tooltip.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/tooltip.html"), "utf8"),
])

const usageJsx = `import { Tooltip } from "@/components/ui/tooltip"

<Tooltip id="save-tt" content="Saves your draft (⌘ + S)" side="top">
  <Button>Save</Button>
</Tooltip>`

const usageJinja = `{% from "components/tooltip.html" import tooltip_open %}

{% call tooltip_open(id="save-tt", content="Saves your draft (⌘ + S)") %}
  <button class="…">Save</button>
{% endcall %}`

const usageGo = `{{template "tooltip" (dict
  "ID" "save-tt" "Content" "Saves your draft (⌘ + S)"
  "Body" (htmlSafe \`<button class="…">Save</button>\`)
)}}`

const usagePhoenix = `<.tooltip id="save-tt" content="Saves your draft (⌘ + S)">
  <button class="…">Save</button>
</.tooltip>`

const usageHtml = `<span data-slot="tooltip" data-side="top" data-tooltip-trigger
      class="relative inline-block w-fit group/tooltip align-middle [&:hover>[data-slot=tooltip-content]]:opacity-100 …"
      aria-describedby="save-tt">
  <button>Save</button>
  <span id="save-tt" role="tooltip" class="…">Saves your draft (⌘ + S)</span>
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-sides", label: "Sides", nested: true },
  { href: "#ex-keyboard", label: "Focus + ESC", nested: true },
  { href: "#api", label: "API Reference" },
]

tooltipRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/tooltip.json`

  return page(
    c,
    <Layout title="Tooltip — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/tooltip" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Tooltip</h1>
            <p class="text-muted-foreground">
              A short label attached to a control. Pure CSS show on hover +
              focus; ESC dismisses. APG-compliant — must contain text only
              (no buttons, no links). For interactive overlays use Dialog or
              the upcoming Popover.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-tooltip"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/tooltip.tsx", source: ttJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/tooltip.html", source: ttJinjaSource, note: "Copy tooltip.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/tooltip.tmpl", source: ttGoSource, note: "Add tooltip.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/tooltip.ex", source: ttPhoenixSource, note: "Drop tooltip.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: ttHtmlSource, note: "Includes the ESC dismissal script. Copy once per page." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — hover or focus to reveal",
              description:
                "Hover the button or tab to it; the tooltip slides in. The trigger has aria-describedby pointing at the tooltip text so AT announces it after the trigger's own name.",
              narrative: (
                <p>
                  APG says a tooltip is "a popup that displays information
                  related to an element when the element receives keyboard
                  focus or the mouse hovers over it." Both reveal triggers
                  matter: keyboard users can't hover, so focus-reveal is
                  non-negotiable. The text must be passive — no buttons, no
                  links inside.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tooltip pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/",
                },
                {
                  source: "MDN",
                  label: "role=\"tooltip\"",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role",
                },
                {
                  source: "MDN",
                  label: "aria-describedby",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <Tooltip id="ex-tt-save" content="Saves your draft to the server (⌘ + S)">
                    <Button>Save</Button>
                  </Tooltip>
                </div>
              ),
              jsx: `<Tooltip id="save-tt" content="Saves your draft (⌘ + S)">
  <Button>Save</Button>
</Tooltip>`,
              jinja: `{% call tooltip_open(id="save-tt", content="Saves your draft (⌘ + S)") %}
  {{ button("Save") }}
{% endcall %}`,
              go: `{{template "tooltip" (dict
  "ID" "save-tt" "Content" "Saves your draft (⌘ + S)"
  "Body" (htmlSafe \`{{template "button" (dict "Label" "Save")}}\`)
)}}`,
              phoenix: `<.tooltip id="save-tt" content="Saves your draft (⌘ + S)">
  <.button>Save</.button>
</.tooltip>`,
            })}

            {await Example({
              id: "ex-sides",
              title: "Sides — top, right, bottom, left",
              description:
                "Pick the side that won't clip against the viewport edge. Default is top.",
              narrative: (
                <p>
                  For a smarter "auto-flip" behaviour you'd need the CSS
                  Anchor Positioning API (still experimental) or a JS
                  positioner like Floating UI. For most uses, picking the
                  right side at author time covers it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "CSS anchor-name (experimental)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name",
                },
              ],
              preview: (
                // Wide horizontal spacing so each tooltip has room to
                // appear without colliding with its neighbour. In real
                // usage only one tooltip is visible at a time (the
                // hovered/focused one) — this demo only collides
                // because we let the user pre-hover each cell.
                <div class="flex flex-wrap items-center justify-around gap-x-24 gap-y-16 py-16">
                  <Tooltip id="ex-tt-t" content="On top" side="top">
                    <Button variant="outline" size="sm">top</Button>
                  </Tooltip>
                  <Tooltip id="ex-tt-r" content="On the right" side="right">
                    <Button variant="outline" size="sm">right</Button>
                  </Tooltip>
                  <Tooltip id="ex-tt-b" content="On the bottom" side="bottom">
                    <Button variant="outline" size="sm">bottom</Button>
                  </Tooltip>
                  <Tooltip id="ex-tt-l" content="On the left" side="left">
                    <Button variant="outline" size="sm">left</Button>
                  </Tooltip>
                </div>
              ),
              jsx: `<Tooltip side="top"    content="On top">…</Tooltip>
<Tooltip side="right"  content="…">…</Tooltip>
<Tooltip side="bottom" content="…">…</Tooltip>
<Tooltip side="left"   content="…">…</Tooltip>`,
              jinja: `{% call tooltip_open(id="…", content="On top", side="top") %}…{% endcall %}
{% call tooltip_open(id="…", content="…",     side="right") %}…{% endcall %}`,
              go: `{{template "tooltip" (dict "ID" "…" "Content" "On top"    "Side" "top"    "Body" (htmlSafe \`…\`))}}
{{template "tooltip" (dict "ID" "…" "Content" "…"         "Side" "right"  "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.tooltip id="…" content="On top"    side="top">…</.tooltip>
<.tooltip id="…" content="…"         side="right">…</.tooltip>`,
            })}

            {await Example({
              id: "ex-keyboard",
              title: "Focus + ESC dismissal",
              description:
                "Tab to the trigger — tooltip appears. Press ESC — tooltip hides until you move pointer/focus elsewhere (the APG dismissal contract).",
              narrative: (
                <p>
                  The ESC contract matters: users who have a tooltip
                  blocking what they want to read need a way to dismiss it.
                  Our handler sets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-suppress="true"</code>{" "}
                  on the trigger which a CSS rule honours; the suppression
                  clears the next time the user mouseleaves the trigger.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tooltip — keyboard interaction",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/#keyboardinteraction",
                },
              ],
              preview: (
                <div class="flex items-center justify-center gap-4">
                  <Tooltip id="ex-tt-kb-1" content="Press Tab to focus me; ESC to dismiss">
                    <Button variant="outline">Tab here</Button>
                  </Tooltip>
                  <Tooltip id="ex-tt-kb-2" content="Same — try keyboard alone">
                    <Button variant="outline">Then here</Button>
                  </Tooltip>
                </div>
              ),
              jsx: `// Hover OR focus reveals; ESC dismisses (handled by site.js).
<Tooltip id="kb" content="Press Tab to focus me; ESC to dismiss">
  <Button>Tab here</Button>
</Tooltip>`,
              jinja: `{% call tooltip_open(id="kb", content="Press Tab to focus me; ESC to dismiss") %}
  {{ button("Tab here") }}
{% endcall %}`,
              go: `{{template "tooltip" (dict "ID" "kb" "Content" "Press Tab to focus me; ESC to dismiss"
  "Body" (htmlSafe \`{{template "button" (dict "Label" "Tab here")}}\`))}}`,
              phoenix: `<.tooltip id="kb" content="Press Tab to focus me; ESC to dismiss">
  <.button>Tab here</.button>
</.tooltip>`,
            })}
          </section>
          <ApiTable
            title="<Tooltip>"
            rows={TOOLTIP_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
