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
import { SPLITTER_PROPS } from "@/app/data/api-rows"
import { Splitter } from "@/registry/ui/splitter"

export const splitterRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/splitter.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/splitter.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/splitter.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/splitter.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/splitter.html"), "utf8"),
])

const usageJsx = `import { Splitter } from "@/components/ui/splitter"

<Splitter
  ariaLabel="Files"
  value={30}
  primaryId="files"
  primary={<p>Sidebar</p>}
  secondary={<p>Editor</p>}
/>`

const usageJinja = `{% from "components/splitter.html" import splitter %}

{{ splitter(aria_label="Files", value=30, primary_id="files",
            primary="Sidebar", secondary="Editor") }}`

const usageGo = `{{template "splitter" (dict "AriaLabel" "Files" "Value" 30 "PrimaryID" "files" "Primary" (htmlSafe "Sidebar") "Secondary" (htmlSafe "Editor"))}}`

const usagePhoenix = `<.splitter aria-label="Files" value={30} primary_id="files">
  <:primary>Sidebar</:primary>
  <:secondary>Editor</:secondary>
</.splitter>`

const usageHtml = `<div data-slot="splitter" data-orientation="horizontal" style="--split:30%" class="grid …">
  <div data-slot="splitter-panel" data-splitter-panel="primary" id="files" class="…">Sidebar</div>
  <div role="separator" tabindex="0" data-slot="splitter-handle" data-orientation="horizontal"
       data-min="0" data-max="100" data-step="10" data-collapsed="false"
       aria-orientation="horizontal" aria-controls="files" aria-label="Files"
       aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" class="…">
    <span aria-hidden="true" class="…"></span>
  </div>
  <div data-slot="splitter-panel" data-splitter-panel="secondary" class="…">Editor</div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Horizontal split", nested: true },
  { href: "#ex-vertical", label: "Vertical split", nested: true },
  { href: "#ex-bounds", label: "Bounds & collapse", nested: true },
  { href: "#api", label: "API Reference" },
]

splitterRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/splitter.json`

  return page(
    c,
    <Layout title="splitter — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/splitter" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">splitter</h1>
            <p class="text-muted-foreground">
              A resizable two-pane split. The divider is a focusable{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="separator"</code>{" "}
              widget — drag it, or use the arrow keys — that drives a single CSS
              variable feeding a grid track.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <LangTabs id="install-splitter" panels={[
              { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/splitter.tsx", source: jsxSource }) },
              { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/splitter.html", source: jinjaSource, note: "Copy splitter.html into templates/components/." }) },
              { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/splitter.tmpl", source: goSource, note: "Add splitter.tmpl alongside your other templates." }) },
              { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/splitter.ex", source: phoenixSource, note: "Drop splitter.ex into lib/my_app_web/components/." }) },
              { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/splitter.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
            ]} />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Horizontal split",
              description:
                "Drag the divider, or focus it and press ←/→ to resize by the step. Home collapses the primary pane, End maximises it, Enter toggles collapse.",
              narrative: (
                <p>
                  The divider is the focusable widget. Per the APG Window
                  Splitter pattern it carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="separator"</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-valuenow/min/max</code>{" "}
                  describing the size of the primary pane,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-controls</code>{" "}
                  pointing at that pane, and an accessible name. A small script
                  in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
                  handles drag + keyboard and writes the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">--split</code>{" "}
                  CSS variable that sizes the first grid track.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Window Splitter Pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/",
                },
                {
                  source: "MDN",
                  label: "separator role (focusable)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role",
                },
              ],
              preview: (
                <Splitter
                  id="ex-split-files"
                  ariaLabel="Files"
                  value={30}
                  primaryId="ex-split-files-pane"
                  class="w-full max-w-xl"
                  primary={
                    <>
                      <p class="font-medium">Files</p>
                      <p class="mt-1 text-muted-foreground">Drag the bar, or focus it and use the arrow keys.</p>
                    </>
                  }
                  secondary={
                    <>
                      <p class="font-medium">Editor</p>
                      <p class="mt-1 text-muted-foreground">The secondary pane fills the rest.</p>
                    </>
                  }
                />
              ),
              jsx: `<Splitter ariaLabel="Files" value={30} primaryId="files"
  primary={<p>Files</p>}
  secondary={<p>Editor</p>} />`,
              jinja: `{{ splitter(aria_label="Files", value=30, primary_id="files",
            primary="Files", secondary="Editor") }}`,
              go: `{{template "splitter" (dict "AriaLabel" "Files" "Value" 30 "PrimaryID" "files" "Primary" (htmlSafe "Files") "Secondary" (htmlSafe "Editor"))}}`,
              phoenix: `<.splitter aria-label="Files" value={30} primary_id="files">
  <:primary>Files</:primary>
  <:secondary>Editor</:secondary>
</.splitter>`,
            })}

            {await Example({
              id: "ex-vertical",
              title: "Vertical split",
              description:
                "orientation=\"vertical\" stacks the panes; aria-orientation flips and the arrow-key axis follows — Up/Down resize instead of Left/Right.",
              narrative: (
                <p>
                  The same grid, rotated. We size the first{" "}
                  <strong>row</strong> with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">--split</code>{" "}
                  instead of the first column, set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-orientation="vertical"</code>,
                  and the keyboard handler reads that to drive Up/Down.
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
                <Splitter
                  id="ex-split-vert"
                  orientation="vertical"
                  ariaLabel="Preview"
                  value={40}
                  primaryId="ex-split-vert-pane"
                  class="h-72 w-full max-w-xl"
                  primary={
                    <>
                      <p class="font-medium">Preview</p>
                      <p class="mt-1 text-muted-foreground">Focus the divider and press ↑/↓.</p>
                    </>
                  }
                  secondary={
                    <>
                      <p class="font-medium">Console</p>
                      <p class="mt-1 text-muted-foreground">Output goes here.</p>
                    </>
                  }
                />
              ),
              jsx: `<Splitter orientation="vertical" ariaLabel="Preview" value={40} primaryId="preview"
  primary={<p>Preview</p>}
  secondary={<p>Console</p>} />`,
              jinja: `{{ splitter(orientation="vertical", aria_label="Preview", value=40,
            primary_id="preview", primary="Preview", secondary="Console") }}`,
              go: `{{template "splitter" (dict "Orientation" "vertical" "AriaLabel" "Preview" "Value" 40 "PrimaryID" "preview" "Primary" (htmlSafe "Preview") "Secondary" (htmlSafe "Console"))}}`,
              phoenix: `<.splitter orientation="vertical" aria-label="Preview" value={40} primary_id="preview">
  <:primary>Preview</:primary>
  <:secondary>Console</:secondary>
</.splitter>`,
            })}

            {await Example({
              id: "ex-bounds",
              title: "Bounds & collapse",
              description:
                "min/max constrain how far the divider travels; step sets the arrow-key increment. Home and Enter collapse the primary pane to its minimum.",
              narrative: (
                <p>
                  Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min</code>{" "}
                  /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max</code>{" "}
                  to keep the primary pane within a usable range, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">step</code>{" "}
                  for the keyboard increment. Enter toggles collapse: it drops
                  to the minimum, then restores the previous position — the APG
                  Window Splitter Enter behaviour.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Window Splitter keyboard interaction",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/#keyboardinteraction",
                },
              ],
              preview: (
                <Splitter
                  id="ex-split-bounds"
                  ariaLabel="Sidebar"
                  value={50}
                  min={20}
                  max={80}
                  step={5}
                  primaryId="ex-split-bounds-pane"
                  class="w-full max-w-xl"
                  primary={
                    <>
                      <p class="font-medium">Sidebar</p>
                      <p class="mt-1 text-muted-foreground">Travels 20–80%. ←/→ moves by 5.</p>
                    </>
                  }
                  secondary={
                    <>
                      <p class="font-medium">Content</p>
                      <p class="mt-1 text-muted-foreground">Press Enter on the divider to collapse and restore.</p>
                    </>
                  }
                />
              ),
              jsx: `<Splitter ariaLabel="Sidebar" value={50} min={20} max={80} step={5} primaryId="sidebar"
  primary={<p>Sidebar</p>}
  secondary={<p>Content</p>} />`,
              jinja: `{{ splitter(aria_label="Sidebar", value=50, min=20, max=80, step=5,
            primary_id="sidebar", primary="Sidebar", secondary="Content") }}`,
              go: `{{template "splitter" (dict "AriaLabel" "Sidebar" "Value" 50 "Min" 20 "Max" 80 "Step" 5 "PrimaryID" "sidebar" "Primary" (htmlSafe "Sidebar") "Secondary" (htmlSafe "Content"))}}`,
              phoenix: `<.splitter aria-label="Sidebar" value={50} min={20} max={80} step={5} primary_id="sidebar">
  <:primary>Sidebar</:primary>
  <:secondary>Content</:secondary>
</.splitter>`,
            })}
          </section>

          <ApiTable title="<Splitter>" rows={SPLITTER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
