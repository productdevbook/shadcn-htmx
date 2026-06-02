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
import { POPOVER_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Popover, PopoverTrigger } from "@/registry/ui/popover"
import { Button } from "@/registry/ui/button"
import { Label } from "@/registry/ui/label"
import { Input } from "@/registry/ui/input"

export const popoverRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [popJsx, popJinja, popGo, popPhoenix, popHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/popover.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/popover.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/popover.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/popover.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/popover.html"), "utf8"),
])

const usageJsx = `import { Popover, PopoverTrigger } from "@/components/ui/popover"

<PopoverTrigger popoverTarget="my-popover" class="…btn classes…">Open</PopoverTrigger>

<Popover id="my-popover">
  <p>Body content.</p>
</Popover>`

const usageJinja = `{% from "components/popover.html" import popover_trigger, popover_open, popover_close %}

{{ popover_trigger("Open", popover_target="my-popover", class_="…btn…") }}

{% call popover_open(id="my-popover") %}
  <p>Body content.</p>
{% endcall %}`

const usageGo = `{{template "popover_trigger" (dict "Label" "Open" "PopoverTarget" "my-popover" "Class" "…btn…")}}

{{template "popover" (dict "ID" "my-popover" "Body" (htmlSafe \`<p>Body content.</p>\`))}}`

const usagePhoenix = `<.popover_trigger popover_target="my-popover" class="…btn…">Open</.popover_trigger>

<.popover id="my-popover">
  <p>Body content.</p>
</.popover>`

const usageHtml = `<button popovertarget="my-popover" popovertargetaction="toggle" class="…">Open</button>

<div id="my-popover" popover class="z-50 m-0 w-72 rounded-md border …">
  Body content.
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-form", label: "Mini form", nested: true },
  { href: "#api", label: "API Reference" },
]

popoverRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/popover.json`

  return page(
    c,
    <Layout title="Popover — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/popover" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Popover</h1>
            <p class="text-muted-foreground">
              Native HTML Popover API. Trigger with{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">popovertarget</code>
              ; the browser handles light dismiss, ESC close, top-layer
              rendering, focus restoration.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-popover"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/popover.tsx", source: popJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/popover.html", source: popJinja, note: "Copy popover.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/popover.tmpl", source: popGo, note: "Add popover.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/popover.ex", source: popPhoenix, note: "Drop popover.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: popHtml, note: "Pure HTML — no JS required." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — click outside or ESC to close",
              description:
                "Click the trigger; the browser opens the popover in the top layer. Click outside, press ESC, or click the trigger again to close.",
              narrative: (
                <p>
                  The native Popover API was added to all major browsers in
                  2024. It gives us "auto-popover" behaviour (light dismiss
                  + ESC) for free, without any state machine. Use it for
                  contextual surfaces — settings, mini forms, info panels.
                  Note: tooltip is a separate role, don't use Popover for
                  hover-revealed labels.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Popover API",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",
                },
                {
                  source: "MDN",
                  label: "popover global attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover",
                },
                {
                  source: "MDN",
                  label: "popovertarget on <button>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/popovertarget",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <Button {...({ popovertarget: "ex-pop-1", popovertargetaction: "toggle" } as any)}>
                    Open popover
                  </Button>
                  <Popover id="ex-pop-1">
                    <h4 class="text-sm font-semibold">Quick info</h4>
                    <p class="mt-1 text-sm text-muted-foreground">
                      This panel sits in the browser's top layer. Click
                      outside or press ESC to close.
                    </p>
                  </Popover>
                </div>
              ),
              jsx: `<Button popovertarget="my-popover">Open</Button>

<Popover id="my-popover">
  <h4>Quick info</h4>
  <p>Click outside or press ESC.</p>
</Popover>`,
              jinja: `{{ popover_trigger("Open", popover_target="my-popover", class_="…btn…") }}

{% call popover_open(id="my-popover") %}
  <h4>Quick info</h4>
  <p>Click outside or press ESC.</p>
{% endcall %}`,
              go: `{{template "popover_trigger" (dict "Label" "Open" "PopoverTarget" "my-popover" "Class" "…btn…")}}
{{template "popover" (dict "ID" "my-popover" "Body" (htmlSafe \`<h4>Quick info</h4><p>…</p>\`))}}`,
              phoenix: `<.popover_trigger popover_target="my-popover" class="…btn…">Open</.popover_trigger>
<.popover id="my-popover">
  <h4>Quick info</h4><p>Click outside or press ESC.</p>
</.popover>`,
            })}

            {await Example({
              id: "ex-form",
              title: "Mini form — interactive content",
              description:
                "Inputs inside a popover work as expected. Unlike Tooltip, Popover MAY contain interactive content.",
              narrative: (
                <p>
                  Filters, quick-edit panels, share dialogs — anything that
                  needs an input plus a confirm. Tooltip is forbidden from
                  hosting buttons or links (APG); Popover is the right
                  primitive when you need interactive content in a hovering
                  surface.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Popover focus & accessibility",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <Button
                    variant="outline"
                    {...({ popovertarget: "ex-pop-form", popovertargetaction: "toggle" } as any)}
                  >
                    Edit display name…
                  </Button>
                  <Popover id="ex-pop-form" class="w-80">
                    <form class="grid gap-3">
                      <div class="grid gap-1.5">
                        <Label htmlFor="ex-pop-name">Display name</Label>
                        <Input id="ex-pop-name" name="name" defaultValue="Mehmet" />
                      </div>
                      <div class="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          {...({ popovertarget: "ex-pop-form", popovertargetaction: "hide" } as any)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" type="submit">Save</Button>
                      </div>
                    </form>
                  </Popover>
                </div>
              ),
              jsx: `<Button popovertarget="edit">Edit…</Button>
<Popover id="edit">
  <form class="grid gap-3">
    <Label htmlFor="name">Display name</Label>
    <Input id="name" name="name" />
    <Button size="sm" type="submit">Save</Button>
  </form>
</Popover>`,
              jinja: `{{ popover_trigger("Edit…", popover_target="edit", class_="…") }}
{% call popover_open(id="edit") %}
  <form>{{ label("Display name", for_="name") }}{{ input(id="name", name="name") }}{{ button("Save", type="submit") }}</form>
{% endcall %}`,
              go: `{{template "popover_trigger" (dict "Label" "Edit…" "PopoverTarget" "edit" "Class" "…")}}
{{template "popover" (dict "ID" "edit" "Body" (htmlSafe \`<form>…</form>\`))}}`,
              phoenix: `<.popover_trigger popover_target="edit">Edit…</.popover_trigger>
<.popover id="edit">
  <form>
    <.label for="name">Display name</.label>
    <.input id="name" name="name" />
    <.button size="sm" type="submit">Save</.button>
  </form>
</.popover>`,
            })}
          </section>
          <ApiTable
            title="<Popover>"
            rows={POPOVER_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
