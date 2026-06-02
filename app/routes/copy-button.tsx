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
import { COPY_BUTTON_PROPS } from "@/app/data/api-rows"
import { CopyButton } from "@/registry/ui/copy-button"

export const copyButtonRoutes = new Hono()

// Source files shown verbatim in the Installation sections. Read once at
// startup; the registry/ tree is the single source of truth.
const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/copy-button.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/copy-button.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/copy-button.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/copy_button.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/copy-button.html"), "utf8"),
  ])

const usageJsx = `import { CopyButton } from "@/components/ui/copy-button"

<CopyButton value="npm i shadcn-htmx" />`

const usageJinja = `{% from "components/copy-button.html" import copy_button %}

{{ copy_button("npm i shadcn-htmx") }}`

const usageGo = `tpl.ExecuteTemplate(w, "copy-button", map[string]any{
    "Value": "npm i shadcn-htmx",
})`

const usagePhoenix = `alias ShadcnHtmx.Components.CopyButton

<CopyButton.copy_button value="npm i shadcn-htmx" />`

const usageHtml = `<!-- Paste straight into your page. The inline <script> at the
     bottom of the snippet ships the copy behaviour (delete it if
     you already load site.js). -->
<button type="button" data-slot="copy-button"
        data-copy-text="npm i shadcn-htmx" data-copied-label="Copied"
        class="inline-flex items-center gap-1.5 rounded-md border bg-background
               h-8 px-2.5 text-sm font-medium …">
  <svg data-copy-icon …></svg>
  <svg data-copy-check …></svg>
  <span data-copy-label>Copy</span>
  <span class="sr-only" aria-live="polite" data-copy-status></span>
</button>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#api", label: "API Reference" },
]

copyButtonRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/copy-button.json`

  return page(
    c,
    <Layout title="Copy Button — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/copy-button" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Copy Button</h1>
            <p class="text-muted-foreground">
              A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button&gt;</code>{" "}
              that writes a string — a snippet, an API key, a URL — to the
              clipboard with the Async Clipboard API, then flips to a transient{" "}
              <em>Copied</em> state announced through an{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-live</code>{" "}
              region. Progressive-enhancement fallback for non-secure contexts.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack — no npm package, no build step required. The
              click-to-copy behaviour is shared in{" "}
              <code class="rounded bg-muted px-1 py-0.5">site.js</code>, scoped
              to <code class="rounded bg-muted px-1 py-0.5">[data-slot="copy-button"]</code>.
            </p>
            <LangTabs
              id="install-copy-button"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/copy-button.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/copy-button.html",
                    source: jinjaSource,
                    note: "Copy copy-button.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/copy-button.tmpl",
                    source: goSource,
                    note: "Add copy-button.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/copy_button.ex",
                    source: phoenixSource,
                    note: "Drop copy_button.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/copy-button.html",
                    source: htmlSource,
                    note: "Paste the markup; relies only on theme tokens.",
                  }),
                },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Copy a string",
              description:
                "Click. The string in value is written to the clipboard; the button flips to a green check + \"Copied\" for two seconds, then resets.",
              narrative: (
                <p>
                  The Async Clipboard API's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">navigator.clipboard.writeText()</code>{" "}
                  returns a Promise that resolves once the system clipboard has
                  been updated — no third-party library, no{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">execCommand</code>{" "}
                  hack in the happy path. It only works in a{" "}
                  <em>secure context</em> (HTTPS or localhost) and from a window
                  that has focus, so{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
                  falls back to a throwaway{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;textarea&gt;</code>{" "}
                  when the API is missing.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Clipboard.writeText()",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText",
                },
                {
                  source: "MDN",
                  label: "aria-live (empty live region)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-3 p-6">
                  <CopyButton value="npm i shadcn-htmx" />
                  <code class="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    npm i shadcn-htmx
                  </code>
                </div>
              ),
              jsx: `<CopyButton value="npm i shadcn-htmx" />`,
              jinja: `{{ copy_button("npm i shadcn-htmx") }}`,
              go: `{{template "copy-button" (dict "Value" "npm i shadcn-htmx")}}`,
              phoenix: `<CopyButton.copy_button value="npm i shadcn-htmx" />`,
            })}

            {await Example({
              id: "ex-variants",
              title: "Variants, sizes & icon-only",
              description:
                "Three quiet variants (outline, ghost, secondary) and an icon-only size that drops the label and takes its accessible name from ariaLabel.",
              narrative: (
                <p>
                  A copy button is auxiliary chrome, so the variants stay
                  understated. The icon-only size has no visible text — pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel</code>{" "}
                  so screen-reader users still get a name. Either way the
                  success announcement comes from the empty{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-live</code>{" "}
                  region, not from swapping the label.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Button pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
                },
                {
                  source: "MDN",
                  label: "aria-label",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-3 p-6">
                  <CopyButton value="outline" variant="outline" />
                  <CopyButton value="ghost" variant="ghost" />
                  <CopyButton value="secondary" variant="secondary" />
                  <CopyButton value="small" size="sm" />
                  <CopyButton
                    value="sk_live_51H8xExampleKeyDoNotUse"
                    size="icon"
                    variant="ghost"
                    ariaLabel="Copy API key"
                  />
                </div>
              ),
              jsx: `<CopyButton value="…" variant="outline" />
<CopyButton value="…" variant="ghost" />
<CopyButton value="…" variant="secondary" />
<CopyButton value="…" size="sm" />
<CopyButton value="sk_live_…" size="icon" variant="ghost" ariaLabel="Copy API key" />`,
              jinja: `{{ copy_button("…", variant="outline") }}
{{ copy_button("…", variant="ghost") }}
{{ copy_button("…", variant="secondary") }}
{{ copy_button("…", size="sm") }}
{{ copy_button("sk_live_…", size="icon", variant="ghost", aria_label="Copy API key") }}`,
              go: `{{template "copy-button" (dict "Value" "…" "Variant" "outline")}}
{{template "copy-button" (dict "Value" "…" "Variant" "ghost")}}
{{template "copy-button" (dict "Value" "…" "Variant" "secondary")}}
{{template "copy-button" (dict "Value" "…" "Size" "sm")}}
{{template "copy-button" (dict
  "Value" "sk_live_…" "Size" "icon" "Variant" "ghost" "AriaLabel" "Copy API key"
)}}`,
              phoenix: `<CopyButton.copy_button value="…" variant="outline" />
<CopyButton.copy_button value="…" variant="ghost" />
<CopyButton.copy_button value="…" variant="secondary" />
<CopyButton.copy_button value="…" size="sm" />
<CopyButton.copy_button value="sk_live_…" size="icon" variant="ghost" aria-label="Copy API key" />`,
            })}

            {await Example({
              id: "ex-target",
              title: "Copy from another element",
              description:
                "Instead of a literal value, point copyTarget at an element's id. The button copies that element's value (form fields) or textContent — handy next to a read-only input or a code block.",
              narrative: (
                <p>
                  Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">copyTarget</code>{" "}
                  the id of an element and the button reads its live text at
                  click time — so the source of truth stays in one place. This
                  is exactly how the docs site's own code-block wires its copy
                  affordance.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Node.textContent",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-3 p-6">
                  <label class="sr-only" for="ex-share-url">
                    Share URL
                  </label>
                  <input
                    id="ex-share-url"
                    type="text"
                    readonly
                    value="https://shadcn-htmx.dev/r/copy-button.json"
                    class="h-8 w-72 max-w-full rounded-md border bg-background px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                  <CopyButton copyTarget="ex-share-url" variant="secondary" label="Copy URL" />
                </div>
              ),
              jsx: `<input id="share-url" type="text" readonly value="https://…" />
<CopyButton copyTarget="share-url" variant="secondary" label="Copy URL" />`,
              jinja: `<input id="share-url" type="text" readonly value="https://…" />
{{ copy_button(copy_target="share-url", variant="secondary", label="Copy URL") }}`,
              go: `<input id="share-url" type="text" readonly value="https://…" />
{{template "copy-button" (dict
  "CopyTarget" "share-url" "Variant" "secondary" "Label" "Copy URL"
)}}`,
              phoenix: `<input id="share-url" type="text" readonly value="https://…" />
<CopyButton.copy_button copy_target="share-url" variant="secondary" label="Copy URL" />`,
            })}
          </section>

          <ApiTable
            title="<CopyButton>"
            caption="All hx-*, data-* and aria-* attributes are forwarded onto the underlying <button> via ...rest."
            rows={COPY_BUTTON_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
