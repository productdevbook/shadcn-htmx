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
import { AUTOSIZE_TEXTAREA_PROPS } from "@/app/data/api-rows"
import { AutosizeTextarea } from "@/registry/ui/autosize-textarea"
import { Label } from "@/registry/ui/label"

export const autosizeTextareaRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/autosize-textarea.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/autosize-textarea.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/autosize-textarea.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/autosize_textarea.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/autosize-textarea.html"), "utf8"),
])

const usageJsx = `import { AutosizeTextarea } from "@/components/ui/autosize-textarea"

<AutosizeTextarea name="reply" placeholder="Write a reply…" />`

const usageJinja = `{% from "components/autosize-textarea.html" import autosize_textarea %}

{{ autosize_textarea(name="reply", placeholder="Write a reply…") }}`

const usageGo = `tpl.ExecuteTemplate(w, "autosize-textarea", map[string]any{
    "Name": "reply",
    "Placeholder": "Write a reply…",
})`

const usagePhoenix = `<.autosize_textarea name="reply" placeholder="Write a reply…" />`

const usageHtml = `<textarea name="reply" placeholder="Write a reply…" data-slot="autosize-textarea"
          class="flex w-full rounded-md border border-input bg-transparent px-3 py-2
                 text-base … field-sizing-content resize-none min-h-16 max-h-80 overflow-auto"></textarea>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Grow as you type", nested: true },
  { href: "#ex-bounds", label: "Min / max bounds", nested: true },
  { href: "#ex-fixed", label: "Opt out + fallback", nested: true },
  { href: "#ex-htmx", label: "htmx autosave", nested: true },
  { href: "#api", label: "API Reference" },
]

autosizeTextareaRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/autosize-textarea.json`

  return page(
    c,
    <Layout title="Autosize Textarea — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/autosize-textarea" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Autosize Textarea</h1>
            <p class="text-muted-foreground">
              A real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;textarea&gt;</code>{" "}
              that grows and shrinks to fit its content between min/max bounds —
              delivered by the single CSS line{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">field-sizing: content</code>{" "}
              instead of the classic{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">scrollHeight</code>{" "}
              JavaScript hack. Where unsupported it degrades to a plain fixed
              field. Zero JS.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-autosize-textarea"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/autosize-textarea.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/autosize-textarea.html", source: jinjaSource, note: "Copy autosize-textarea.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/autosize-textarea.tmpl", source: goSource, note: "Add autosize-textarea.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/autosize_textarea.ex", source: phoenixSource, note: "Drop autosize_textarea.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/autosize-textarea.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens. field-sizing-content is one Tailwind v4 utility." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Grow as you type",
              description:
                "field-sizing: content shrinkwraps the textarea to its value and grows it line by line — no resize observer, no scrollHeight measuring.",
              narrative: (
                <p>
                  The old way to autosize a textarea was to listen for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">input</code>{" "}
                  events, write the value into a hidden mirror, read its{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">scrollHeight</code>{" "}
                  and assign it back as a pixel height on every keystroke. The
                  platform now does this itself: one declaration,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">field-sizing: content</code>,
                  and the control resizes to its contents. Per MDN, once it is
                  set the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">rows</code>{" "}
                  /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">cols</code>{" "}
                  attributes have no effect — sizing is driven by the text.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "field-sizing CSS property",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing",
                },
                {
                  source: "MDN",
                  label: "<textarea> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-reply">Reply</Label>
                  <AutosizeTextarea
                    id="ex-reply"
                    name="reply"
                    placeholder="Write a reply. The field grows as you type…"
                  />
                </div>
              ),
              jsx: `<Label htmlFor="reply">Reply</Label>
<AutosizeTextarea id="reply" name="reply"
  placeholder="Write a reply. The field grows as you type…" />`,
              jinja: `{{ label("Reply", for_="reply") }}
{{ autosize_textarea(id="reply", name="reply",
            placeholder="Write a reply. The field grows as you type…") }}`,
              go: `{{template "label" (dict "For" "reply" "Text" "Reply")}}
{{template "autosize-textarea" (dict
  "ID" "reply" "Name" "reply"
  "Placeholder" "Write a reply. The field grows as you type…"
)}}`,
              phoenix: `<.label for="reply">Reply</.label>
<.autosize_textarea id="reply" name="reply"
  placeholder="Write a reply. The field grows as you type…" />`,
            })}

            {await Example({
              id: "ex-bounds",
              title: "Min / max bounds",
              description:
                "Pass minHeight / maxHeight (Tailwind height utilities). The field grows freely between them, then scrolls past the max.",
              narrative: (
                <p>
                  MDN is explicit that you should pair{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">field-sizing: content</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min-height</code>{" "}
                  /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max-height</code>,
                  not a fixed{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">height</code>{" "}
                  (a fixed height would reimpose a static size and defeat the
                  feature). Once the value reaches the maximum, the browser
                  shows a scrollbar as usual. Defaults here are{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min-h-16</code>{" "}
                  to{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max-h-80</code>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "field-sizing — interaction with size settings",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing#field-sizing_interaction_with_other_size_settings",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-bounded">Short note (caps at ~3 lines)</Label>
                  <AutosizeTextarea
                    id="ex-bounded"
                    name="note"
                    minHeight="min-h-10"
                    maxHeight="max-h-24"
                    value="This field starts small, grows a couple of lines, then scrolls once it hits its max height. Try adding several more lines to see the scrollbar appear."
                  />
                </div>
              ),
              jsx: `<AutosizeTextarea name="note"
  minHeight="min-h-10" maxHeight="max-h-24" />`,
              jinja: `{{ autosize_textarea(name="note",
            minheight="min-h-10", maxheight="max-h-24") }}`,
              go: `{{template "autosize-textarea" (dict
  "Name" "note" "MinHeight" "min-h-10" "MaxHeight" "max-h-24"
)}}`,
              phoenix: `<.autosize_textarea name="note"
  min_height="min-h-10" max_height="max-h-24" />`,
            })}

            {await Example({
              id: "ex-fixed",
              title: "Opt out + graceful fallback",
              description:
                "autosize={false} renders a plain bounded textarea (field-sizing: fixed) with a drag handle. The same fallback is what older browsers see automatically.",
              narrative: (
                <p>
                  This is progressive enhancement, not emulation. Browsers that
                  don't understand{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">field-sizing</code>{" "}
                  simply ignore the rule and render an ordinary fixed-height
                  textarea sized by{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min-height</code>{" "}
                  — no broken layout, no JS shim. Passing{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">autosize=&#123;false&#125;</code>{" "}
                  makes that the explicit behaviour everywhere via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">field-sizing: fixed</code>,
                  restoring the native resize handle.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "field-sizing values (content / fixed)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing#values",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-fixed-ta">Notes (fixed, drag to resize)</Label>
                  <AutosizeTextarea
                    id="ex-fixed-ta"
                    name="notes"
                    autosize={false}
                    value="A plain bounded textarea — field-sizing: fixed. Drag the corner handle."
                  />
                </div>
              ),
              jsx: `<AutosizeTextarea name="notes" autosize={false}
  value="A plain bounded textarea." />`,
              jinja: `{{ autosize_textarea(name="notes", autosize=false,
            value="A plain bounded textarea.") }}`,
              go: `{{template "autosize-textarea" (dict
  "Name" "notes" "Autosize" false "Value" "A plain bounded textarea."
)}}`,
              phoenix: `<.autosize_textarea name="notes" autosize={false}
  value="A plain bounded textarea." />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — autosave draft on pause",
              description:
                "hx-trigger=\"input changed delay:600ms\" fires after the user stops typing. The server stores the draft and returns 204.",
              narrative: (
                <p>
                  Autosize and autosave compose cleanly: the field grows with
                  the draft while{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">input changed delay:600ms</code>{" "}
                  fires only after a pause, so you don't hammer the server on
                  every keystroke. While the request is in flight htmx adds{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.htmx-request</code>{" "}
                  — the base style dims the field to 70% as a subtle "saving"
                  hint.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-trigger — changed, delay",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
                {
                  source: "htmx",
                  label: "Request lifecycle classes",
                  href: "https://htmx.org/docs/#request-operations",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-draft">Draft</Label>
                  <AutosizeTextarea
                    id="ex-draft"
                    name="draft"
                    placeholder="Start writing… we'll save as you pause"
                    hx-post="/docs/autosize-textarea/save-draft"
                    hx-trigger="input changed delay:600ms"
                    hx-swap="none"
                  />
                  <p class="text-xs text-muted-foreground">
                    The field briefly dims while the server records each pause.
                  </p>
                </div>
              ),
              jsx: `<AutosizeTextarea name="draft" placeholder="Start writing…"
  hx-post="/api/drafts" hx-trigger="input changed delay:600ms"
  hx-swap="none" />`,
              jinja: `{{ autosize_textarea(name="draft", placeholder="Start writing…",
            hx_post="/api/drafts",
            hx_trigger="input changed delay:600ms",
            hx_swap="none") }}`,
              go: `{{template "autosize-textarea" (dict
  "Name" "draft" "Placeholder" "Start writing…"
  "Attrs" (dict
    "hx-post" "/api/drafts"
    "hx-trigger" "input changed delay:600ms"
    "hx-swap" "none"
  )
)}}`,
              phoenix: `<.autosize_textarea name="draft" placeholder="Start writing…"
  hx-post={~p"/api/drafts"} hx-trigger="input changed delay:600ms"
  hx-swap="none" />`,
            })}
          </section>

          <ApiTable title="<AutosizeTextarea>" rows={AUTOSIZE_TEXTAREA_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

autosizeTextareaRoutes.post("/save-draft", (c) => c.body(null, 204))
