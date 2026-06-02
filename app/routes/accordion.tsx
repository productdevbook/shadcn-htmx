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
import { ACCORDION_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/registry/ui/accordion"

export const accordionRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  accJsx,
  accJinja,
  accGo,
  accPhoenix,
  accHtml,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/accordion.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/accordion.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/accordion.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/accordion.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/accordion.html"), "utf8"),
])

const usageJsx = `import { Accordion, AccordionItem, AccordionTrigger,
  AccordionContent } from "@/components/ui/accordion"

<Accordion id="faq" type="single">
  <AccordionItem value="q1" open>
    <AccordionTrigger>What's htmx?</AccordionTrigger>
    <AccordionContent>Hypermedia-driven HTML extensions.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="q2">
    <AccordionTrigger>Why Tailwind v4?</AccordionTrigger>
    <AccordionContent>Utility-first, small bundles.</AccordionContent>
  </AccordionItem>
</Accordion>`

const usageJinja = `{% from "components/accordion.html" import accordion_open, accordion_close,
   accordion_item_open, accordion_item_close, accordion_trigger,
   accordion_content_open, accordion_content_close %}

{{ accordion_open(id="faq", type="single") }}
  {{ accordion_item_open(value="q1", open=true) }}
    {{ accordion_trigger("What's htmx?") }}
    {{ accordion_content_open() }}
      Hypermedia-driven HTML extensions.
    {{ accordion_content_close() }}
  {{ accordion_item_close() }}
{{ accordion_close() }}`

const usageGo = `{{template "accordion" (dict
  "ID" "faq" "Type" "single"
  "Body" (htmlSafe \`
    {{template "accordion_item" (dict
      "Value" "q1" "Title" "What's htmx?" "Open" true
      "Body" (htmlSafe "Hypermedia-driven HTML extensions.")
    )}}\`)
)}}`

const usagePhoenix = `<.accordion id="faq" type="single">
  <.accordion_item value="q1" open>
    <.accordion_trigger>What's htmx?</.accordion_trigger>
    <.accordion_content>Hypermedia-driven HTML extensions.</.accordion_content>
  </.accordion_item>
</.accordion>`

const usageHtml = `<div id="faq" data-accordion data-type="single" class="w-full">
  <details name="faq" data-slot="accordion-item" data-value="q1" open class="border-b last:border-b-0">
    <summary data-slot="accordion-trigger" class="…">What's htmx? <svg …chevron/></summary>
    <div data-slot="accordion-content" class="…">Hypermedia-driven HTML extensions.</div>
  </details>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-single", label: "Single-expand", nested: true },
  { href: "#ex-multiple", label: "Multi-expand", nested: true },
  { href: "#ex-keyboard", label: "Keyboard nav", nested: true },
  { href: "#api", label: "API Reference" },
]

accordionRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/accordion.json`

  return page(
    c,
    <Layout title="Accordion — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/accordion" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Accordion</h1>
            <p class="text-muted-foreground">
              Stacked, collapsible sections built on native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;details&gt;</code>{" "}
              +{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;summary&gt;</code>.
              The new HTML{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">name</code>{" "}
              attribute makes single-expand mode zero-JS; arrow-key
              navigation is wired up in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">public/site.js</code>{" "}
              per APG.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-accordion"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/accordion.tsx", source: accJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/accordion.html", source: accJinja, note: "Copy accordion.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/accordion.tmpl", source: accGo, note: "Add accordion.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/accordion.ex", source: accPhoenix, note: "Drop accordion.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: accHtml, note: "Includes the arrow-key navigation script. Copy once per page." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-single",
              title: "Single-expand — only one open at a time",
              description:
                "Set type=\"single\". The boot script applies the same name attribute to every <details> in the group; the browser handles closing-others natively.",
              narrative: (
                <p>
                  The HTML Living Standard added the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>{" "}
                  attribute on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;details&gt;</code>{" "}
                  for exactly this pattern. All items sharing the same name
                  are mutually exclusive — opening one auto-closes the rest.
                  No state machine, no JS framework.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<details name> attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name",
                },
                {
                  source: "APG",
                  label: "Accordion pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
                },
              ],
              preview: (
                <Accordion id="ex-acc-single" type="single" class="max-w-md">
                  <AccordionItem value="q1" open>
                    <AccordionTrigger>What's htmx?</AccordionTrigger>
                    <AccordionContent>
                      A small library that turns any HTML attribute into an
                      AJAX trigger — no JSON, no client framework needed.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q2">
                    <AccordionTrigger>Why pair it with Tailwind v4?</AccordionTrigger>
                    <AccordionContent>
                      Utility-first CSS keeps the markup self-explanatory and
                      the bundle small.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q3">
                    <AccordionTrigger>Does it work without JavaScript?</AccordionTrigger>
                    <AccordionContent>
                      Yes — the open/close toggle is the native{" "}
                      <code class="rounded bg-muted px-1 py-0.5">&lt;details&gt;</code>{" "}
                      behaviour. Arrow-key navigation needs the boot script,
                      but the accordion still works without it.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ),
              jsx: `<Accordion id="faq" type="single">
  <AccordionItem value="q1" open>…</AccordionItem>
  <AccordionItem value="q2">…</AccordionItem>
</Accordion>`,
              jinja: `{{ accordion_open(id="faq", type="single") }}
  {{ accordion_item_open(value="q1", open=true) }}…{{ accordion_item_close() }}
  {{ accordion_item_open(value="q2") }}…{{ accordion_item_close() }}
{{ accordion_close() }}`,
              go: `{{template "accordion" (dict "ID" "faq" "Type" "single" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.accordion id="faq" type="single">
  <.accordion_item value="q1" open>…</.accordion_item>
  <.accordion_item value="q2">…</.accordion_item>
</.accordion>`,
            })}

            {await Example({
              id: "ex-multiple",
              title: "Multi-expand — any number open at once",
              description:
                "Default mode. Omit the name attribute; each <details> is independent.",
              narrative: (
                <p>
                  Use multi-expand for documents where the user is comparing
                  sections or where forced exclusivity would frustrate (FAQ
                  pages with cross-referenced answers, settings panels with
                  multiple sub-sections).
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<details> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details",
                },
              ],
              preview: (
                <Accordion id="ex-acc-multi" type="multiple" class="max-w-md">
                  <AccordionItem value="a" open>
                    <AccordionTrigger>Account</AccordionTrigger>
                    <AccordionContent>Email, password, 2FA.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b" open>
                    <AccordionTrigger>Notifications</AccordionTrigger>
                    <AccordionContent>
                      Email, push, in-app preferences.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="c">
                    <AccordionTrigger>Privacy</AccordionTrigger>
                    <AccordionContent>
                      Data retention, third-party sharing.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ),
              jsx: `<Accordion id="settings" type="multiple">
  <AccordionItem value="a" open>…</AccordionItem>
  <AccordionItem value="b" open>…</AccordionItem>
</Accordion>`,
              jinja: `{{ accordion_open(id="settings", type="multiple") }}
  {{ accordion_item_open(value="a", open=true) }}…{{ accordion_item_close() }}
{{ accordion_close() }}`,
              go: `{{template "accordion" (dict "ID" "settings" "Type" "multiple" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.accordion id="settings" type="multiple">
  <.accordion_item value="a" open>…</.accordion_item>
</.accordion>`,
            })}

            {await Example({
              id: "ex-keyboard",
              title: "Keyboard nav — arrow keys, Home, End",
              description:
                "Tab focuses one summary; then ↑/↓ cycles, Home/End jump to ends. Space/Enter toggles (native).",
              narrative: (
                <p>
                  APG's keyboard contract differs from generic Tab behaviour:
                  inside the accordion, Tab moves focus once into the group
                  (to the active or first summary), then arrows cycle within.
                  This matches what users expect from native widgets like
                  radio groups. Our handler in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
                  delegates on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-accordion</code>{" "}
                  containers, so newly htmx-swapped accordions pick it up for
                  free.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Accordion — keyboard interaction",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#keyboardinteraction",
                },
              ],
              preview: (
                <Accordion id="ex-acc-kb" type="single" class="max-w-md">
                  <AccordionItem value="x">
                    <AccordionTrigger>Tab here, then press Down</AccordionTrigger>
                    <AccordionContent>
                      Focus stays inside the group; arrows cycle, Home/End
                      jump to first/last.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="y">
                    <AccordionTrigger>Second item</AccordionTrigger>
                    <AccordionContent>
                      Press Space to toggle. ESC isn't needed — there's no
                      modal to dismiss.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="z">
                    <AccordionTrigger>Third item</AccordionTrigger>
                    <AccordionContent>
                      Home jumps back here, End comes to the last item.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ),
              jsx: `// keyboard contract is handled by site.js — no extra props.
<Accordion id="kb">…</Accordion>`,
              jinja: `{# keyboard nav is wired by site.js #}
{{ accordion_open(id="kb") }}…{{ accordion_close() }}`,
              go: `{{template "accordion" (dict "ID" "kb" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.accordion id="kb">…</.accordion>`,
            })}
          </section>
          <ApiTable
            title="<Accordion>"
            rows={ACCORDION_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
