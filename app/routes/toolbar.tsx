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
import { TOOLBAR_PROPS } from "@/app/data/api-rows"
import {
  Toolbar,
  ToolbarButton,
  ToolbarToggle,
  ToolbarSeparator,
  ToolbarGroup,
} from "@/registry/ui/toolbar"

export const toolbarRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/toolbar.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/toolbar.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/toolbar.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/toolbar.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/toolbar.html"), "utf8"),
  ])

const usageJsx = `import {
  Toolbar, ToolbarButton, ToolbarToggle,
  ToolbarSeparator, ToolbarGroup,
} from "@/components/ui/toolbar"

<Toolbar ariaLabel="Text formatting">
  <ToolbarToggle pressed>Bold</ToolbarToggle>
  <ToolbarToggle>Italic</ToolbarToggle>
  <ToolbarSeparator />
  <ToolbarGroup ariaLabel="Alignment">
    <ToolbarButton>Left</ToolbarButton>
    <ToolbarButton>Center</ToolbarButton>
    <ToolbarButton>Right</ToolbarButton>
  </ToolbarGroup>
</Toolbar>`

const usageJinja = `{% from "components/toolbar.html" import
     toolbar_open, toolbar_close, toolbar_button, toolbar_toggle,
     toolbar_separator, toolbar_group_open, toolbar_group_close %}

{{ toolbar_open(aria_label="Text formatting") }}
  {{ toolbar_toggle("Bold", pressed=true) }}
  {{ toolbar_toggle("Italic") }}
  {{ toolbar_separator() }}
  {{ toolbar_group_open(aria_label="Alignment") }}
    {{ toolbar_button("Left") }}
    {{ toolbar_button("Center") }}
  {{ toolbar_group_close() }}
{{ toolbar_close() }}`

const usageGo = `{{template "toolbar" (dict
  "AriaLabel" "Text formatting"
  "Body" (htmlSafe "…buttons / toggles / separators…"))}}`

const usagePhoenix = `<.toolbar aria-label="Text formatting">
  <.toolbar_toggle pressed>Bold</.toolbar_toggle>
  <.toolbar_toggle>Italic</.toolbar_toggle>
  <.toolbar_separator />
  <.toolbar_group aria-label="Alignment">
    <.toolbar_button>Left</.toolbar_button>
    <.toolbar_button>Center</.toolbar_button>
  </.toolbar_group>
</.toolbar>`

const usageHtml = `<div role="toolbar" data-slot="toolbar"
     data-orientation="horizontal" aria-orientation="horizontal"
     aria-label="Text formatting" class="group/toolbar flex w-fit …">
  <button type="button" data-slot="toolbar-toggle" data-toolbar-item=""
          aria-pressed="true">Bold</button>
  …
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-groups", label: "Toggles, groups & separators", nested: true },
  { href: "#ex-vertical", label: "Vertical orientation", nested: true },
  { href: "#api", label: "API Reference" },
]

toolbarRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/toolbar.json`

  return page(
    c,
    <Layout title="Toolbar — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/toolbar" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Toolbar</h1>
            <p class="text-muted-foreground">
              A{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="toolbar"</code>{" "}
              container that groups related controls into a single tab stop.
              Arrow keys move a roving tabindex between buttons; Tab moves into
              and out of the whole group.
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
              id="install-toolbar"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/toolbar.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/toolbar.html", source: jinjaSource, note: "Copy toolbar.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/toolbar.tmpl", source: goSource, note: "Add toolbar.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/toolbar.ex", source: phoenixSource, note: "Drop toolbar.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/toolbar.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
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
              title: "Basic — a single tab stop",
              description:
                "Three or more related buttons grouped under one role=\"toolbar\". Tab lands once on the toolbar; ArrowLeft/ArrowRight (and Home/End) move focus between buttons.",
              narrative: (
                <p>
                  The APG toolbar pattern reduces the number of tab stops: the
                  whole group is one stop, and a{" "}
                  <a
                    class="underline underline-offset-4"
                    href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex"
                  >
                    roving tabindex
                  </a>{" "}
                  decides which control inside is focusable. We render real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    &lt;button&gt;
                  </code>{" "}
                  elements, so Space/Enter activation comes from the platform.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Toolbar Pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/",
                },
                {
                  source: "MDN",
                  label: "toolbar role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/toolbar_role",
                },
              ],
              preview: (
                <Toolbar ariaLabel="History and view">
                  <ToolbarButton>Undo</ToolbarButton>
                  <ToolbarButton>Redo</ToolbarButton>
                  <ToolbarSeparator />
                  <ToolbarButton>Zoom in</ToolbarButton>
                  <ToolbarButton>Zoom out</ToolbarButton>
                </Toolbar>
              ),
              jsx: `<Toolbar ariaLabel="History and view">
  <ToolbarButton>Undo</ToolbarButton>
  <ToolbarButton>Redo</ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Zoom in</ToolbarButton>
  <ToolbarButton>Zoom out</ToolbarButton>
</Toolbar>`,
              jinja: `{{ toolbar_open(aria_label="History and view") }}
  {{ toolbar_button("Undo") }}
  {{ toolbar_button("Redo") }}
  {{ toolbar_separator() }}
  {{ toolbar_button("Zoom in") }}
  {{ toolbar_button("Zoom out") }}
{{ toolbar_close() }}`,
              go: `{{template "toolbar" (dict "AriaLabel" "History and view" "Body" (htmlSafe "
  {{template \\"toolbar_button\\" (dict \\"Label\\" \\"Undo\\")}}
  {{template \\"toolbar_button\\" (dict \\"Label\\" \\"Redo\\")}}
  {{template \\"toolbar_separator\\" (dict)}}
  {{template \\"toolbar_button\\" (dict \\"Label\\" \\"Zoom in\\")}}
  {{template \\"toolbar_button\\" (dict \\"Label\\" \\"Zoom out\\")}}"))}}`,
              phoenix: `<.toolbar aria-label="History and view">
  <.toolbar_button>Undo</.toolbar_button>
  <.toolbar_button>Redo</.toolbar_button>
  <.toolbar_separator />
  <.toolbar_button>Zoom in</.toolbar_button>
  <.toolbar_button>Zoom out</.toolbar_button>
</.toolbar>`,
            })}

            {await Example({
              id: "ex-groups",
              title: "Toggles, groups & separators",
              description:
                "Toggle buttons carry aria-pressed; ToolbarGroup adds a labelled role=\"group\" cluster (announced by AT) without adding a tab stop; separators mark visual divisions and are skipped by arrow nav.",
              narrative: (
                <p>
                  A separator inside a horizontal toolbar draws as a vertical
                  rule with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    role="separator"
                  </code>{" "}
                  and an orientation perpendicular to the bar. It is{" "}
                  <strong>not</strong> focusable, so the arrow navigation steps
                  straight over it.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Toolbar keyboard interaction",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/#keyboardinteraction",
                },
                {
                  source: "MDN",
                  label: "aria-pressed",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed",
                },
              ],
              preview: (
                <Toolbar ariaLabel="Text formatting">
                  <ToolbarToggle pressed ariaLabel="Bold">
                    Bold
                  </ToolbarToggle>
                  <ToolbarToggle ariaLabel="Italic">Italic</ToolbarToggle>
                  <ToolbarToggle ariaLabel="Underline">Underline</ToolbarToggle>
                  <ToolbarSeparator />
                  <ToolbarGroup ariaLabel="Alignment">
                    <ToolbarButton>Left</ToolbarButton>
                    <ToolbarButton>Center</ToolbarButton>
                    <ToolbarButton>Right</ToolbarButton>
                  </ToolbarGroup>
                  <ToolbarSeparator />
                  <ToolbarButton disabled>Clear</ToolbarButton>
                </Toolbar>
              ),
              jsx: `<Toolbar ariaLabel="Text formatting">
  <ToolbarToggle pressed ariaLabel="Bold">Bold</ToolbarToggle>
  <ToolbarToggle ariaLabel="Italic">Italic</ToolbarToggle>
  <ToolbarToggle ariaLabel="Underline">Underline</ToolbarToggle>
  <ToolbarSeparator />
  <ToolbarGroup ariaLabel="Alignment">
    <ToolbarButton>Left</ToolbarButton>
    <ToolbarButton>Center</ToolbarButton>
    <ToolbarButton>Right</ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarButton disabled>Clear</ToolbarButton>
</Toolbar>`,
              jinja: `{{ toolbar_open(aria_label="Text formatting") }}
  {{ toolbar_toggle("Bold", pressed=true, aria_label="Bold") }}
  {{ toolbar_toggle("Italic", aria_label="Italic") }}
  {{ toolbar_toggle("Underline", aria_label="Underline") }}
  {{ toolbar_separator() }}
  {{ toolbar_group_open(aria_label="Alignment") }}
    {{ toolbar_button("Left") }}
    {{ toolbar_button("Center") }}
    {{ toolbar_button("Right") }}
  {{ toolbar_group_close() }}
  {{ toolbar_separator() }}
  {{ toolbar_button("Clear", disabled=true) }}
{{ toolbar_close() }}`,
              go: `{{template "toolbar" (dict "AriaLabel" "Text formatting" "Body" (htmlSafe "
  {{template \\"toolbar_toggle\\" (dict \\"Label\\" \\"Bold\\" \\"Pressed\\" true)}}
  {{template \\"toolbar_toggle\\" (dict \\"Label\\" \\"Italic\\")}}
  {{template \\"toolbar_separator\\" (dict)}}
  {{template \\"toolbar_group\\" (dict \\"AriaLabel\\" \\"Alignment\\" \\"Body\\" (htmlSafe \\"…\\"))}}"))}}`,
              phoenix: `<.toolbar aria-label="Text formatting">
  <.toolbar_toggle pressed aria-label="Bold">Bold</.toolbar_toggle>
  <.toolbar_toggle aria-label="Italic">Italic</.toolbar_toggle>
  <.toolbar_toggle aria-label="Underline">Underline</.toolbar_toggle>
  <.toolbar_separator />
  <.toolbar_group aria-label="Alignment">
    <.toolbar_button>Left</.toolbar_button>
    <.toolbar_button>Center</.toolbar_button>
    <.toolbar_button>Right</.toolbar_button>
  </.toolbar_group>
  <.toolbar_separator />
  <.toolbar_button disabled>Clear</.toolbar_button>
</.toolbar>`,
            })}

            {await Example({
              id: "ex-vertical",
              title: "Vertical orientation",
              description:
                "Set orientation=\"vertical\" and the bar stacks; aria-orientation flips so AT announces it, and Up/Down arrows drive navigation instead of Left/Right.",
              narrative: (
                <p>
                  The toolbar role's implicit orientation is horizontal. When
                  the controls are stacked we set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    aria-orientation="vertical"
                  </code>
                  , per the APG roles/states/properties section, and the
                  arrow-key axis follows.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Toolbar roles, states & properties",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/#wai-ariaroles,states,andproperties",
                },
                {
                  source: "MDN",
                  label: "aria-orientation",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-orientation",
                },
              ],
              preview: (
                <Toolbar orientation="vertical" ariaLabel="Tools">
                  <ToolbarButton>Move</ToolbarButton>
                  <ToolbarButton>Draw</ToolbarButton>
                  <ToolbarSeparator orientation="vertical" />
                  <ToolbarButton>Erase</ToolbarButton>
                  <ToolbarButton>Fill</ToolbarButton>
                </Toolbar>
              ),
              jsx: `<Toolbar orientation="vertical" ariaLabel="Tools">
  <ToolbarButton>Move</ToolbarButton>
  <ToolbarButton>Draw</ToolbarButton>
  <ToolbarSeparator orientation="vertical" />
  <ToolbarButton>Erase</ToolbarButton>
  <ToolbarButton>Fill</ToolbarButton>
</Toolbar>`,
              jinja: `{{ toolbar_open(aria_label="Tools", orientation="vertical") }}
  {{ toolbar_button("Move") }}
  {{ toolbar_button("Draw") }}
  {{ toolbar_separator(orientation="vertical") }}
  {{ toolbar_button("Erase") }}
  {{ toolbar_button("Fill") }}
{{ toolbar_close() }}`,
              go: `{{template "toolbar" (dict "AriaLabel" "Tools" "Orientation" "vertical" "Body" (htmlSafe "
  {{template \\"toolbar_button\\" (dict \\"Label\\" \\"Move\\")}}
  {{template \\"toolbar_separator\\" (dict \\"Orientation\\" \\"vertical\\")}}
  {{template \\"toolbar_button\\" (dict \\"Label\\" \\"Fill\\")}}"))}}`,
              phoenix: `<.toolbar orientation="vertical" aria-label="Tools">
  <.toolbar_button>Move</.toolbar_button>
  <.toolbar_button>Draw</.toolbar_button>
  <.toolbar_separator orientation="vertical" />
  <.toolbar_button>Erase</.toolbar_button>
  <.toolbar_button>Fill</.toolbar_button>
</.toolbar>`,
            })}
          </section>

          <ApiTable title="<Toolbar>" rows={TOOLBAR_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
