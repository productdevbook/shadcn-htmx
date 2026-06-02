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
import { EXCLUSIVE_ACCORDION_PROPS } from "@/app/data/api-rows"
import {
  ExclusiveAccordion,
  ExclusiveAccordionItem,
  ExclusiveAccordionTrigger,
  ExclusiveAccordionContent,
} from "@/registry/ui/exclusive-accordion"

export const exclusiveAccordionRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/exclusive-accordion.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/exclusive-accordion.html"), "utf8"),
    readFile(
      resolve(REGISTRY_ROOT, "go-templates/exclusive-accordion.tmpl"),
      "utf8",
    ),
    readFile(
      resolve(REGISTRY_ROOT, "phoenix/exclusive_accordion.ex"),
      "utf8",
    ),
    readFile(resolve(REGISTRY_ROOT, "html/exclusive-accordion.html"), "utf8"),
  ])

const usageJsx = `import { ExclusiveAccordion, ExclusiveAccordionItem,
  ExclusiveAccordionTrigger, ExclusiveAccordionContent
} from "@/components/ui/exclusive-accordion"

<ExclusiveAccordion name="faq">
  <ExclusiveAccordionItem name="faq" value="q1" open>
    <ExclusiveAccordionTrigger>What's htmx?</ExclusiveAccordionTrigger>
    <ExclusiveAccordionContent>Hypermedia-driven HTML.</ExclusiveAccordionContent>
  </ExclusiveAccordionItem>
  <ExclusiveAccordionItem name="faq" value="q2">
    <ExclusiveAccordionTrigger>Why Tailwind v4?</ExclusiveAccordionTrigger>
    <ExclusiveAccordionContent>Utility-first, small bundles.</ExclusiveAccordionContent>
  </ExclusiveAccordionItem>
</ExclusiveAccordion>`

const usageJinja = `{% from "components/exclusive-accordion.html" import
   exclusive_accordion_open, exclusive_accordion_close,
   exclusive_accordion_item_open, exclusive_accordion_item_close,
   exclusive_accordion_trigger,
   exclusive_accordion_content_open, exclusive_accordion_content_close %}

{{ exclusive_accordion_open(name="faq") }}
  {{ exclusive_accordion_item_open(name="faq", value="q1", open=true) }}
    {{ exclusive_accordion_trigger("What's htmx?") }}
    {{ exclusive_accordion_content_open() }}
      Hypermedia-driven HTML.
    {{ exclusive_accordion_content_close() }}
  {{ exclusive_accordion_item_close() }}
{{ exclusive_accordion_close() }}`

const usageGo = `{{template "exclusive_accordion" (dict
  "Name" "faq"
  "Body" (htmlSafe \`
    {{template "exclusive_accordion_item" (dict
      "Name" "faq" "Value" "q1" "Title" "What's htmx?" "Open" true
      "Body" (htmlSafe "Hypermedia-driven HTML.")
    )}}\`)
)}}`

const usagePhoenix = `<.exclusive_accordion name="faq">
  <.exclusive_accordion_item name="faq" value="q1" open>
    <.exclusive_accordion_trigger>What's htmx?</.exclusive_accordion_trigger>
    <.exclusive_accordion_content>Hypermedia-driven HTML.</.exclusive_accordion_content>
  </.exclusive_accordion_item>
</.exclusive_accordion>`

const usageHtml = `<div data-slot="exclusive-accordion" data-name="faq" class="w-full">
  <details name="faq" data-slot="exclusive-accordion-item" data-value="q1" open class="border-b last:border-b-0">
    <summary data-slot="exclusive-accordion-trigger" class="…">What's htmx? <svg …chevron/></summary>
    <div data-slot="exclusive-accordion-content" class="…">Hypermedia-driven HTML.</div>
  </details>
  <details name="faq" data-slot="exclusive-accordion-item" data-value="q2" class="border-b last:border-b-0">…</details>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Single-open", nested: true },
  { href: "#ex-faq", label: "FAQ", nested: true },
  { href: "#api", label: "API Reference" },
]

exclusiveAccordionRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/exclusive-accordion.json`

  return page(
    c,
    <Layout title="Exclusive Accordion — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/exclusive-accordion" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Exclusive Accordion</h1>
            <p class="text-muted-foreground">
              The scriptless single-open accordion. Several{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;details&gt;</code>{" "}
              share one{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">name</code>{" "}
              attribute, so opening one auto-closes the others — the pure-HTML
              exclusive variant of the APG-scripted accordion. Zero
              JavaScript: the exclusivity survives with JS disabled.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-exclusive-accordion"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/exclusive-accordion.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/exclusive-accordion.html", source: jinjaSource, note: "Copy exclusive-accordion.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/exclusive-accordion.tmpl", source: goSource, note: "Add exclusive-accordion.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/exclusive_accordion.ex", source: phoenixSource, note: "Drop exclusive_accordion.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/exclusive-accordion.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens. No script." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Single-open — only one item expands at a time",
              description:
                "Every item shares the same name. Opening one auto-closes the rest. No JavaScript runs.",
              narrative: (
                <p>
                  The HTML Living Standard added the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>{" "}
                  attribute on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;details&gt;</code>{" "}
                  for exactly this pattern: give several items the same name and
                  they become mutually exclusive — opening one closes the
                  others, with no state machine and no client framework. Unlike
                  the scripted{" "}
                  <a href="/docs/accordion" class="underline">Accordion</a>{" "}
                  this carries no APG arrow-key contract; the only keyboard
                  interaction is what{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;summary&gt;</code>{" "}
                  ships natively (Tab to focus, Enter / Space to toggle).
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
                  label: "Accordion pattern (the scripted variant)",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
                },
              ],
              preview: (
                <ExclusiveAccordion name="ex-xacc-basic" class="max-w-md">
                  <ExclusiveAccordionItem name="ex-xacc-basic" value="q1" open>
                    <ExclusiveAccordionTrigger>What's htmx?</ExclusiveAccordionTrigger>
                    <ExclusiveAccordionContent>
                      A small library that turns any HTML attribute into an
                      AJAX trigger — no JSON, no client framework needed.
                    </ExclusiveAccordionContent>
                  </ExclusiveAccordionItem>
                  <ExclusiveAccordionItem name="ex-xacc-basic" value="q2">
                    <ExclusiveAccordionTrigger>Why pair it with Tailwind v4?</ExclusiveAccordionTrigger>
                    <ExclusiveAccordionContent>
                      Utility-first CSS keeps the markup self-explanatory and
                      the bundle small.
                    </ExclusiveAccordionContent>
                  </ExclusiveAccordionItem>
                  <ExclusiveAccordionItem name="ex-xacc-basic" value="q3">
                    <ExclusiveAccordionTrigger>Does it work without JavaScript?</ExclusiveAccordionTrigger>
                    <ExclusiveAccordionContent>
                      Yes — the exclusivity is native{" "}
                      <code class="rounded bg-muted px-1 py-0.5">&lt;details name&gt;</code>{" "}
                      grouping. Disable JS and it still keeps one open.
                    </ExclusiveAccordionContent>
                  </ExclusiveAccordionItem>
                </ExclusiveAccordion>
              ),
              jsx: `<ExclusiveAccordion name="faq">
  <ExclusiveAccordionItem name="faq" value="q1" open>…</ExclusiveAccordionItem>
  <ExclusiveAccordionItem name="faq" value="q2">…</ExclusiveAccordionItem>
</ExclusiveAccordion>`,
              jinja: `{{ exclusive_accordion_open(name="faq") }}
  {{ exclusive_accordion_item_open(name="faq", value="q1", open=true) }}…{{ exclusive_accordion_item_close() }}
  {{ exclusive_accordion_item_open(name="faq", value="q2") }}…{{ exclusive_accordion_item_close() }}
{{ exclusive_accordion_close() }}`,
              go: `{{template "exclusive_accordion" (dict "Name" "faq" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.exclusive_accordion name="faq">
  <.exclusive_accordion_item name="faq" value="q1" open>…</.exclusive_accordion_item>
  <.exclusive_accordion_item name="faq" value="q2">…</.exclusive_accordion_item>
</.exclusive_accordion>`,
            })}

            {await Example({
              id: "ex-faq",
              title: "FAQ — start fully collapsed",
              description:
                "Omit open on every item to start with nothing expanded. The first click opens one; the next swaps the open item.",
              narrative: (
                <p>
                  A frequently-asked-questions list is the canonical use: the
                  reader opens one answer at a time and the previous answer
                  tucks away on its own. Because exclusivity is enforced by the
                  browser, you never have to reconcile open state on the server
                  after an htmx swap — newly inserted items that share the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">name</code>{" "}
                  join the group automatically.
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
                <ExclusiveAccordion name="ex-xacc-faq" class="max-w-md">
                  <ExclusiveAccordionItem name="ex-xacc-faq" value="ship">
                    <ExclusiveAccordionTrigger>How fast do you ship?</ExclusiveAccordionTrigger>
                    <ExclusiveAccordionContent>
                      Orders placed before 2pm ship same day.
                    </ExclusiveAccordionContent>
                  </ExclusiveAccordionItem>
                  <ExclusiveAccordionItem name="ex-xacc-faq" value="return">
                    <ExclusiveAccordionTrigger>What's the return window?</ExclusiveAccordionTrigger>
                    <ExclusiveAccordionContent>
                      30 days, no questions asked.
                    </ExclusiveAccordionContent>
                  </ExclusiveAccordionItem>
                  <ExclusiveAccordionItem name="ex-xacc-faq" value="intl">
                    <ExclusiveAccordionTrigger>Do you ship internationally?</ExclusiveAccordionTrigger>
                    <ExclusiveAccordionContent>
                      Yes, to 40+ countries. Duties calculated at checkout.
                    </ExclusiveAccordionContent>
                  </ExclusiveAccordionItem>
                </ExclusiveAccordion>
              ),
              jsx: `<ExclusiveAccordion name="faq">
  <ExclusiveAccordionItem name="faq" value="ship">…</ExclusiveAccordionItem>
  <ExclusiveAccordionItem name="faq" value="return">…</ExclusiveAccordionItem>
</ExclusiveAccordion>`,
              jinja: `{{ exclusive_accordion_open(name="faq") }}
  {{ exclusive_accordion_item_open(name="faq", value="ship") }}…{{ exclusive_accordion_item_close() }}
{{ exclusive_accordion_close() }}`,
              go: `{{template "exclusive_accordion" (dict "Name" "faq" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.exclusive_accordion name="faq">
  <.exclusive_accordion_item name="faq" value="ship">…</.exclusive_accordion_item>
</.exclusive_accordion>`,
            })}
          </section>

          <ApiTable
            title="<ExclusiveAccordion>"
            rows={EXCLUSIVE_ACCORDION_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
