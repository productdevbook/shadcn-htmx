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
import { COLLAPSIBLE_PROPS } from "@/app/data/api-rows"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/registry/ui/collapsible"

export const collapsibleRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/collapsible.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/collapsible.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/collapsible.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/collapsible.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/collapsible.html"), "utf8"),
  ])

const usageJsx = `import { Collapsible, CollapsibleTrigger,
  CollapsibleContent } from "@/components/ui/collapsible"

<Collapsible open>
  <CollapsibleTrigger>Can I use this without JS?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes — it's native &lt;details&gt;/&lt;summary&gt;.
  </CollapsibleContent>
</Collapsible>`

const usageJinja = `{% from "components/collapsible.html" import collapsible_open,
   collapsible_close, collapsible_trigger,
   collapsible_content_open, collapsible_content_close %}

{{ collapsible_open(open=true) }}
  {{ collapsible_trigger("Can I use this without JS?") }}
  {{ collapsible_content_open() }}
    Yes — it's native <details>/<summary>.
  {{ collapsible_content_close() }}
{{ collapsible_close() }}`

const usageGo = `{{template "collapsible" (dict
  "Title" "Can I use this without JS?" "Open" true
  "Body" (htmlSafe "Yes — it's native <details>/<summary>.")
)}}`

const usagePhoenix = `<.collapsible open>
  <.collapsible_trigger>Can I use this without JS?</.collapsible_trigger>
  <.collapsible_content>Yes — it's native &lt;details&gt;/&lt;summary&gt;.</.collapsible_content>
</.collapsible>`

const usageHtml = `<details data-slot="collapsible" open class="w-full">
  <summary data-slot="collapsible-trigger" class="…">Can I use this without JS? <svg …chevron/></summary>
  <div data-slot="collapsible-content" class="…">Yes — it's native &lt;details&gt;/&lt;summary&gt;.</div>
</details>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-open", label: "Open by default", nested: true },
  { href: "#ex-card", label: "Inside a card", nested: true },
  { href: "#api", label: "API Reference" },
]

collapsibleRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/collapsible.json`

  return page(
    c,
    <Layout title="Collapsible — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/collapsible" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Collapsible</h1>
            <p class="text-muted-foreground">
              A single show/hide disclosure built on native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;details&gt;</code>{" "}
              +{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;summary&gt;</code>.
              Click / Space / Enter toggle, the trigger is focusable, and the
              browser mirrors{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-expanded</code>{" "}
              — zero JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-collapsible"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/collapsible.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/collapsible.html", source: jinjaSource, note: "Copy collapsible.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/collapsible.tmpl", source: goSource, note: "Add collapsible.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/collapsible.ex", source: phoenixSource, note: "Drop collapsible.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/collapsible.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — click the trigger to reveal",
              description:
                "A standalone disclosure. The summary toggles the content; nothing else on the page is affected.",
              narrative: (
                <p>
                  This is the WAI-ARIA Disclosure pattern: one button that
                  shows or hides a single section of content. Because it is
                  native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;details&gt;</code>,
                  the toggle, focus, and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-expanded</code>{" "}
                  are handled by the browser — no group, no JS, no state
                  machine. Reach for an Accordion instead when you have several
                  related sections that should expand together or exclusively.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Disclosure (Show/Hide) pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/",
                },
                {
                  source: "MDN",
                  label: "<details> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details",
                },
              ],
              preview: (
                <Collapsible class="max-w-md">
                  <CollapsibleTrigger>What is a disclosure widget?</CollapsibleTrigger>
                  <CollapsibleContent>
                    A control that shows or hides a single region of content.
                    Native{" "}
                    <code class="rounded bg-muted px-1 py-0.5">&lt;details&gt;</code>{" "}
                    is exactly this — no JavaScript required.
                  </CollapsibleContent>
                </Collapsible>
              ),
              jsx: `<Collapsible>
  <CollapsibleTrigger>What is a disclosure widget?</CollapsibleTrigger>
  <CollapsibleContent>A control that shows or hides one region.</CollapsibleContent>
</Collapsible>`,
              jinja: `{{ collapsible_open() }}
  {{ collapsible_trigger("What is a disclosure widget?") }}
  {{ collapsible_content_open() }}A control that shows or hides one region.{{ collapsible_content_close() }}
{{ collapsible_close() }}`,
              go: `{{template "collapsible" (dict "Title" "What is a disclosure widget?" "Body" (htmlSafe "A control that shows or hides one region."))}}`,
              phoenix: `<.collapsible>
  <.collapsible_trigger>What is a disclosure widget?</.collapsible_trigger>
  <.collapsible_content>A control that shows or hides one region.</.collapsible_content>
</.collapsible>`,
            })}

            {await Example({
              id: "ex-open",
              title: "Open by default",
              description:
                "Add the open prop (the native <details open> boolean attribute) to render expanded.",
              narrative: (
                <p>
                  The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">open</code>{" "}
                  prop maps straight to the boolean{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">open</code>{" "}
                  attribute on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;details&gt;</code>.
                  Remove it (don't set it to{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">false</code>{" "}
                  as a string) to start collapsed.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<details open> attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#open",
                },
              ],
              preview: (
                <Collapsible open class="max-w-md">
                  <CollapsibleTrigger>Release notes — v4.0</CollapsibleTrigger>
                  <CollapsibleContent>
                    New native attributes, smaller core, and a faster swap
                    pipeline. Collapse me with Space or Enter.
                  </CollapsibleContent>
                </Collapsible>
              ),
              jsx: `<Collapsible open>
  <CollapsibleTrigger>Release notes — v4.0</CollapsibleTrigger>
  <CollapsibleContent>New native attributes, smaller core…</CollapsibleContent>
</Collapsible>`,
              jinja: `{{ collapsible_open(open=true) }}
  {{ collapsible_trigger("Release notes — v4.0") }}
  {{ collapsible_content_open() }}New native attributes, smaller core…{{ collapsible_content_close() }}
{{ collapsible_close() }}`,
              go: `{{template "collapsible" (dict "Title" "Release notes — v4.0" "Open" true "Body" (htmlSafe "New native attributes, smaller core…"))}}`,
              phoenix: `<.collapsible open>
  <.collapsible_trigger>Release notes — v4.0</.collapsible_trigger>
  <.collapsible_content>New native attributes, smaller core…</.collapsible_content>
</.collapsible>`,
            })}

            {await Example({
              id: "ex-card",
              title: "Inside a card — progressive disclosure",
              description:
                "Tuck supplementary detail behind a trigger so the primary content stays scannable.",
              narrative: (
                <p>
                  A common use: keep a panel compact, then let the reader
                  expand the extra detail on demand. The chevron rotates via
                  the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">details[open]</code>{" "}
                  attribute selector — pure CSS, in step with the native open
                  state.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Disclosure — roles, states, properties",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/#wai-ariaroles,states,andproperties",
                },
              ],
              preview: (
                <div class="max-w-md rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                  <p class="mb-1 text-sm font-medium">Standard plan</p>
                  <p class="mb-3 text-sm text-muted-foreground">
                    $12 / month, billed annually.
                  </p>
                  <Collapsible>
                    <CollapsibleTrigger>What's included?</CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul class="list-disc space-y-1 pl-5 text-muted-foreground">
                        <li>Unlimited projects</li>
                        <li>Priority email support</li>
                        <li>Custom domains</li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ),
              jsx: `<div class="rounded-lg border bg-card p-4">
  <p class="font-medium">Standard plan</p>
  <Collapsible>
    <CollapsibleTrigger>What's included?</CollapsibleTrigger>
    <CollapsibleContent>…feature list…</CollapsibleContent>
  </Collapsible>
</div>`,
              jinja: `<div class="rounded-lg border bg-card p-4">
  <p class="font-medium">Standard plan</p>
  {{ collapsible_open() }}
    {{ collapsible_trigger("What's included?") }}
    {{ collapsible_content_open() }}…feature list…{{ collapsible_content_close() }}
  {{ collapsible_close() }}
</div>`,
              go: `<div class="rounded-lg border bg-card p-4">
  <p class="font-medium">Standard plan</p>
  {{template "collapsible" (dict "Title" "What's included?" "Body" (htmlSafe "…feature list…"))}}
</div>`,
              phoenix: `<div class="rounded-lg border bg-card p-4">
  <p class="font-medium">Standard plan</p>
  <.collapsible>
    <.collapsible_trigger>What's included?</.collapsible_trigger>
    <.collapsible_content>…feature list…</.collapsible_content>
  </.collapsible>
</div>`,
            })}
          </section>
          <ApiTable
            title="<Collapsible>"
            rows={COLLAPSIBLE_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
