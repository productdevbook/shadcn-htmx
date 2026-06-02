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
import { KBD_PROPS } from "@/app/data/api-rows"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export const kbdRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/kbd.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/kbd.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/kbd.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/kbd.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/kbd.html"), "utf8"),
  ])

const usageJsx = `import { Kbd, KbdGroup } from "@/components/ui/kbd"

<Kbd>Esc</Kbd>
<KbdGroup keys={["Ctrl", "Shift", "R"]} />
<KbdGroup>
  <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
</KbdGroup>`

const usageJinja = `{% from "components/kbd.html" import kbd, kbd_group %}

{{ kbd("Esc") }}
{{ kbd_group(["Ctrl", "Shift", "R"]) }}`

const usageGo = `{{template "kbd" (dict "Text" "Esc")}}
{{template "kbd-group" (dict "Keys" (list "Ctrl" "Shift" "R"))}}`

const usagePhoenix = `<.kbd>Esc</.kbd>
<.kbd_group keys={["Ctrl", "Shift", "R"]} />`

const usageHtml = `<kbd data-slot="kbd"
     class="pointer-events-none inline-flex h-5 …">Esc</kbd>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Single key", nested: true },
  { href: "#ex-shortcut", label: "Shortcut", nested: true },
  { href: "#ex-inline", label: "Inline in prose", nested: true },
  { href: "#api", label: "API Reference" },
]

kbdRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/kbd.json`

  return page(
    c,
    <Layout title="Kbd — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/kbd" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Kbd</h1>
            <p class="text-muted-foreground">
              An inline keyboard-key badge. Renders a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;kbd&gt;</code>{" "}
              for a single key, or nests one{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;kbd&gt;</code>{" "}
              per key inside an outer one to render a shortcut like Ctrl + Shift
              + R. Zero JavaScript — it's a label, not a control.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-kbd"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/kbd.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/kbd.html", source: jinjaSource, note: "Copy kbd.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/kbd.tmpl", source: goSource, note: "Add kbd.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/kbd.ex", source: phoenixSource, note: "Drop kbd.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/kbd.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Single key",
              description:
                "A lone <Kbd> renders one native <kbd>. Symbol-only keys take an ariaLabel so screen readers announce a word, not a glyph.",
              narrative: (
                <p>
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;kbd&gt;</code>{" "}
                  is phrasing content with no implicit ARIA role — it's read as
                  plain text. For a symbol cap such as{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">⌘</code> pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel="Command"</code>{" "}
                  so assistive tech doesn't announce the raw glyph.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<kbd> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-3">
                  <Kbd>Esc</Kbd>
                  <Kbd>Enter</Kbd>
                  <Kbd>Tab</Kbd>
                  <Kbd ariaLabel="Command">⌘</Kbd>
                  <Kbd ariaLabel="Up arrow">↑</Kbd>
                </div>
              ),
              jsx: `<Kbd>Esc</Kbd>
<Kbd>Enter</Kbd>
<Kbd>Tab</Kbd>
<Kbd ariaLabel="Command">⌘</Kbd>
<Kbd ariaLabel="Up arrow">↑</Kbd>`,
              jinja: `{{ kbd("Esc") }}
{{ kbd("Enter") }}
{{ kbd("Tab") }}
{{ kbd("⌘", aria_label="Command") }}
{{ kbd("↑", aria_label="Up arrow") }}`,
              go: `{{template "kbd" (dict "Text" "Esc")}}
{{template "kbd" (dict "Text" "Enter")}}
{{template "kbd" (dict "Text" "Tab")}}
{{template "kbd" (dict "Text" "⌘" "AriaLabel" "Command")}}
{{template "kbd" (dict "Text" "↑" "AriaLabel" "Up arrow")}}`,
              phoenix: `<.kbd>Esc</.kbd>
<.kbd>Enter</.kbd>
<.kbd>Tab</.kbd>
<.kbd aria_label="Command">⌘</.kbd>
<.kbd aria_label="Up arrow">↑</.kbd>`,
            })}

            {await Example({
              id: "ex-shortcut",
              title: "Shortcut — nested keys",
              description:
                "A shortcut is one outer <kbd> wrapping a <kbd> per key, with a \"+\" separator between them (MDN's keystroke pattern). Pass keys to build it, or compose by hand.",
              narrative: (
                <p>
                  Per MDN, a multi-keystroke input nests each key in its own{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;kbd&gt;</code>{" "}
                  inside an outer{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;kbd&gt;</code>{" "}
                  that represents the whole input. The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">+</code>{" "}
                  separators are{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-hidden</code>{" "}
                  so the reading isn't cluttered with "plus".
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Representing keystrokes within an input",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd#representing_keystrokes_within_an_input",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-4">
                  <KbdGroup keys={["Ctrl", "Shift", "R"]} />
                  <KbdGroup keys={["⌘", "K"]} ariaLabel="Command K" />
                  <KbdGroup keys={["Alt", "F4"]} />
                </div>
              ),
              jsx: `<KbdGroup keys={["Ctrl", "Shift", "R"]} />
<KbdGroup keys={["⌘", "K"]} ariaLabel="Command K" />
<KbdGroup keys={["Alt", "F4"]} />`,
              jinja: `{{ kbd_group(["Ctrl", "Shift", "R"]) }}
{{ kbd_group(["⌘", "K"], aria_label="Command K") }}
{{ kbd_group(["Alt", "F4"]) }}`,
              go: `{{template "kbd-group" (dict "Keys" (list "Ctrl" "Shift" "R"))}}
{{template "kbd-group" (dict "Keys" (list "⌘" "K") "AriaLabel" "Command K")}}
{{template "kbd-group" (dict "Keys" (list "Alt" "F4"))}}`,
              phoenix: `<.kbd_group keys={["Ctrl", "Shift", "R"]} />
<.kbd_group keys={["⌘", "K"]} aria_label="Command K" />
<.kbd_group keys={["Alt", "F4"]} />`,
            })}

            {await Example({
              id: "ex-inline",
              title: "Inline in prose",
              description:
                "Kbd is phrasing content, so it sits inside running text, menu rows, and tooltips without breaking the line box.",
              narrative: (
                <p>
                  Because{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;kbd&gt;</code>{" "}
                  is inline phrasing content it flows with the surrounding
                  sentence. The cap is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">select-none</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">pointer-events-none</code>{" "}
                  so copying the paragraph skips the glyphs and clicks fall
                  through to whatever wraps it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<kbd> — basic example",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd#basic_example",
                },
              ],
              preview: (
                <div class="max-w-md text-sm text-muted-foreground">
                  <p>
                    Press <Kbd>/</Kbd> to focus search, or{" "}
                    <KbdGroup keys={["Ctrl", "K"]} /> to open the command menu.
                    Save with <KbdGroup keys={["⌘", "S"]} ariaLabel="Command S" />.
                  </p>
                </div>
              ),
              jsx: `<p>
  Press <Kbd>/</Kbd> to focus search, or{" "}
  <KbdGroup keys={["Ctrl", "K"]} /> to open the command menu.
  Save with <KbdGroup keys={["⌘", "S"]} ariaLabel="Command S" />.
</p>`,
              jinja: `<p>
  Press {{ kbd("/") }} to focus search, or
  {{ kbd_group(["Ctrl", "K"]) }} to open the command menu.
  Save with {{ kbd_group(["⌘", "S"], aria_label="Command S") }}.
</p>`,
              go: `<p>
  Press {{template "kbd" (dict "Text" "/")}} to focus search, or
  {{template "kbd-group" (dict "Keys" (list "Ctrl" "K"))}} to open the command menu.
  Save with {{template "kbd-group" (dict "Keys" (list "⌘" "S") "AriaLabel" "Command S")}}.
</p>`,
              phoenix: `<p>
  Press <.kbd>/</.kbd> to focus search, or
  <.kbd_group keys={["Ctrl", "K"]} /> to open the command menu.
  Save with <.kbd_group keys={["⌘", "S"]} aria_label="Command S" />.
</p>`,
            })}
          </section>

          <ApiTable title="<Kbd>" rows={KBD_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
