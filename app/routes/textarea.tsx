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
import { TEXTAREA_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Textarea } from "@/registry/ui/textarea"
import { Label } from "@/registry/ui/label"

export const textareaRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  textareaJsxSource,
  textareaJinjaSource,
  textareaGoSource,
  textareaPhoenixSource,
  textareaHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/textarea.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/textarea.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/textarea.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/textarea.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/textarea.html"), "utf8"),
])

const usageJsx = `import { Textarea } from "@/components/ui/textarea"

<Textarea name="bio" placeholder="Tell us about yourself…" rows={4} />`

const usageJinja = `{% from "components/textarea.html" import textarea %}

{{ textarea(name="bio", placeholder="Tell us about yourself…", rows=4) }}`

const usageGo = `tpl.ExecuteTemplate(w, "textarea", map[string]any{
    "Name": "bio",
    "Placeholder": "Tell us about yourself…",
    "Rows": 4,
})`

const usagePhoenix = `<.textarea name="bio" placeholder="Tell us about yourself…" rows="4" />`

const usageHtml = `<textarea name="bio" placeholder="Tell us about yourself…" rows="4"
          class="flex field-sizing-content min-h-16 w-full rounded-md border
                 border-input bg-transparent px-3 py-2 text-base shadow-xs …"></textarea>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-autosize", label: "Auto-resize", nested: true },
  { href: "#ex-invalid", label: "Invalid + error", nested: true },
  { href: "#ex-states", label: "Disabled / readonly", nested: true },
  { href: "#ex-htmx-autosave", label: "htmx autosave", nested: true },
  { href: "#api", label: "API Reference" },
]

textareaRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/textarea.json`

  return page(
    c,
    <Layout title="Textarea — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/textarea" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Textarea</h1>
            <p class="text-muted-foreground">
              A real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;textarea&gt;</code>{" "}
              styled to match Input. The{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">field-sizing: content</code>{" "}
              CSS rule makes it grow with what you type — no JS auto-resize
              hook required.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-textarea"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/textarea.tsx", source: textareaJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/textarea.html", source: textareaJinjaSource, note: "Copy textarea.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/textarea.tmpl", source: textareaGoSource, note: "Add textarea.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/textarea.ex", source: textareaPhoenixSource, note: "Drop textarea.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: textareaHtmlSource, note: "Tailwind v4 is enough; field-sizing-content is a single utility." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-autosize",
              title: "Auto-resize as you type",
              description:
                "The textarea starts at min-h-16 (≈4rem). field-sizing: content grows it line by line; no JS observer required.",
              narrative: (
                <p>
                  CSS{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">field-sizing: content</code>{" "}
                  is a recent platform addition that resizes form controls to
                  their contents. It works on every modern browser. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">min-h-*</code>{" "}
                  and optionally{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">max-h-*</code>{" "}
                  to set bounds — past the maximum the textarea starts to
                  scroll as usual.
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
                  <Label htmlFor="ex-bio">Bio</Label>
                  <Textarea
                    id="ex-bio"
                    name="bio"
                    placeholder="Tell us about yourself. The field grows as you type…"
                  />
                </div>
              ),
              jsx: `<Label htmlFor="bio">Bio</Label>
<Textarea id="bio" name="bio"
  placeholder="Tell us about yourself. The field grows as you type…" />`,
              jinja: `{{ label("Bio", for_="bio") }}
{{ textarea(id="bio", name="bio",
            placeholder="Tell us about yourself. The field grows as you type…") }}`,
              go: `{{template "label" (dict "For" "bio" "Text" "Bio")}}
{{template "textarea" (dict
  "ID" "bio" "Name" "bio"
  "Placeholder" "Tell us about yourself. The field grows as you type…"
)}}`,
              phoenix: `<.label for="bio">Bio</.label>
<.textarea id="bio" name="bio"
  placeholder="Tell us about yourself. The field grows as you type…" />`,
            })}

            {await Example({
              id: "ex-invalid",
              title: "Invalid + error message",
              description:
                "Same pattern as Input — aria-invalid styles the field, aria-describedby connects to the error text.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code>{" "}
                  /{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>{" "}
                  pairing is non-negotiable for non-native validations.
                  When the server (via htmx) replies with an error, swap the
                  whole textarea — flipping the attribute and inserting the
                  message in one shot.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-invalid",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid",
                },
                {
                  source: "WCAG",
                  label: "3.3.1 Error Identification",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-2">
                  <Label htmlFor="ex-comment">Comment</Label>
                  <Textarea
                    id="ex-comment"
                    name="comment"
                    placeholder="Add a comment…"
                    ariaInvalid
                    ariaDescribedby="ex-comment-error"
                  />
                  <p id="ex-comment-error" class="text-sm text-destructive">
                    Comment can't be empty.
                  </p>
                </div>
              ),
              jsx: `<Label htmlFor="comment">Comment</Label>
<Textarea id="comment" name="comment" ariaInvalid
          ariaDescribedby="comment-error" />
<p id="comment-error" class="text-sm text-destructive">
  Comment can't be empty.
</p>`,
              jinja: `{{ label("Comment", for_="comment") }}
{{ textarea(id="comment", name="comment",
            aria_invalid=true, aria_describedby="comment-error") }}
<p id="comment-error" class="text-sm text-destructive">
  Comment can't be empty.
</p>`,
              go: `{{template "textarea" (dict
  "ID" "comment" "Name" "comment"
  "AriaInvalid" "true" "AriaDescribedby" "comment-error"
)}}
<p id="comment-error" class="text-sm text-destructive">…</p>`,
              phoenix: `<.label for="comment">Comment</.label>
<.textarea id="comment" name="comment"
           aria-invalid="true" aria-describedby="comment-error" />
<p id="comment-error" class="text-sm text-destructive">…</p>`,
            })}

            {await Example({
              id: "ex-states",
              title: "Disabled vs. readonly",
              description:
                "Same contract as Input: disabled removes from form submission; readonly stays focusable + selectable.",
              narrative: (
                <p>
                  Reach for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">readonly</code>{" "}
                  when you want the user to read the text (and copy from it)
                  but not edit. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                  when the field shouldn't submit at all (e.g. it doesn't
                  apply yet for this user).
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "textarea readonly",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#readonly",
                },
                {
                  source: "MDN",
                  label: "textarea disabled",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#disabled",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <div class="space-y-1">
                    <Label htmlFor="ex-ta-disabled" class="text-xs">
                      Disabled
                    </Label>
                    <Textarea id="ex-ta-disabled" disabled value="Cannot focus or edit" />
                  </div>
                  <div class="space-y-1">
                    <Label htmlFor="ex-ta-readonly" class="text-xs">
                      Readonly
                    </Label>
                    <Textarea
                      id="ex-ta-readonly"
                      readonly
                      value="The full release notes for this version are pinned here. You can select and copy this text, but not edit it."
                    />
                  </div>
                </div>
              ),
              jsx: `<Textarea disabled value="Cannot focus or edit" />
<Textarea readonly value="Selectable but not editable." />`,
              jinja: `{{ textarea(disabled=true, value="Cannot focus or edit") }}
{{ textarea(readonly=true, value="Selectable but not editable.") }}`,
              go: `{{template "textarea" (dict "Disabled" true "Value" "Cannot focus or edit")}}
{{template "textarea" (dict "Readonly" true "Value" "Selectable but not editable.")}}`,
              phoenix: `<.textarea disabled value="Cannot focus or edit" />
<.textarea readonly value="Selectable but not editable." />`,
            })}

            {await Example({
              id: "ex-htmx-autosave",
              title: "htmx — autosave draft on pause",
              description:
                "hx-trigger=\"input changed delay:600ms\" fires after the user stops typing. The server stores the draft and returns 204.",
              narrative: (
                <p>
                  "Save as you type" feels magic when it's reliable.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">input changed delay:600ms</code>{" "}
                  fires only after the user pauses, which avoids hammering
                  your server on every keystroke. While the request is in
                  flight htmx adds{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">.htmx-request</code>{" "}
                  — our base styling dims the field at 70% so the user gets a
                  subtle hint that a save is happening.
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
                  <Textarea
                    id="ex-draft"
                    name="draft"
                    placeholder="Start writing… we'll save as you pause"
                    hx-post="/textarea/save-draft"
                    hx-trigger="input changed delay:600ms"
                    hx-swap="none"
                  />
                  <p class="text-xs text-muted-foreground">
                    The field briefly dims while the server records each pause.
                  </p>
                </div>
              ),
              jsx: `<Textarea name="draft" placeholder="Start writing…"
          hx-post="/api/drafts" hx-trigger="input changed delay:600ms"
          hx-swap="none" />`,
              jinja: `{{ textarea(name="draft", placeholder="Start writing…",
            hx_post="/api/drafts",
            hx_trigger="input changed delay:600ms",
            hx_swap="none") }}`,
              go: `{{template "textarea" (dict
  "Name" "draft" "Placeholder" "Start writing…"
  "Attrs" (dict
    "hx-post" "/api/drafts"
    "hx-trigger" "input changed delay:600ms"
    "hx-swap" "none"
  )
)}}`,
              phoenix: `<.textarea name="draft" placeholder="Start writing…"
           hx-post={~p"/api/drafts"} hx-trigger="input changed delay:600ms"
           hx-swap="none" />`,
            })}
          </section>
          <ApiTable
            title="<Textarea>"
            rows={TEXTAREA_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

textareaRoutes.post("/save-draft", (c) => c.body(null, 204))
