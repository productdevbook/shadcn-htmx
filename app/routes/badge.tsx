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
import { BADGE_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Badge } from "@/registry/ui/badge"

export const badgeRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  badgeJsxSource,
  badgeJinjaSource,
  badgeGoSource,
  badgePhoenixSource,
  badgeHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/badge.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/badge.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/badge.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/badge.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/badge.html"), "utf8"),
])

const usageJsx = `import { Badge } from "@/components/ui/badge"

<Badge>New</Badge>
<Badge variant="destructive">Unstable</Badge>
<Badge as="a" href="/docs">Docs</Badge>`

const usageJinja = `{% from "components/badge.html" import badge %}

{{ badge("New") }}
{{ badge("Unstable", variant="destructive") }}
{{ badge("Docs", tag="a", href="/docs") }}`

const usageGo = `{{template "badge" (dict "Text" "New")}}
{{template "badge" (dict "Text" "Unstable" "Variant" "destructive")}}
{{template "badge" (dict "Text" "Docs" "Tag" "a" "Href" "/docs")}}`

const usagePhoenix = `<.badge>New</.badge>
<.badge variant="destructive">Unstable</.badge>
<.badge as="a" href={~p"/docs"}>Docs</.badge>`

const usageHtml = `<span data-slot="badge" data-variant="default"
      class="inline-flex w-fit shrink-0 items-center …">
  New
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-variants", label: "Variants", nested: true },
  { href: "#ex-link", label: "Link badge", nested: true },
  { href: "#ex-icon", label: "Icon-only (counter)", nested: true },
  { href: "#ex-icon-text", label: "With icon", nested: true },
  { href: "#api", label: "API Reference" },
]

badgeRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/badge.json`

  return page(
    c,
    <Layout title="Badge — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/badge" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Badge</h1>
            <p class="text-muted-foreground">
              A small visual marker — status pill, counter, label.
              Non-interactive by default; renders as{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;span&gt;</code>,
              switches to{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;a&gt;</code>{" "}
              when an{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">href</code>{" "}
              is supplied.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-badge"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/badge.tsx", source: badgeJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/badge.html", source: badgeJinjaSource, note: "Copy badge.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/badge.tmpl", source: badgeGoSource, note: "Add badge.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/badge.ex", source: badgePhoenixSource, note: "Drop badge.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: badgeHtmlSource, note: "Tailwind v4 utilities only; no script." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-variants",
              title: "Variants — six on-brand colours",
              description:
                "Same six variants as Button, mapped to the badge's pill shape.",
              narrative: (
                <p>
                  Variant choice carries meaning:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">destructive</code>{" "}
                  for errors / removal,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">outline</code>{" "}
                  for low-emphasis tags,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">secondary</code>{" "}
                  for neutral counts. Don't over-decorate — a single accent
                  per row reads cleanly, three competes for attention.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<span> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span",
                },
                {
                  source: "WCAG",
                  label: "1.4.1 Use of Color",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="ghost">Ghost</Badge>
                </div>
              ),
              jsx: `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>`,
              jinja: `{{ badge("Default") }}
{{ badge("Secondary", variant="secondary") }}
{{ badge("Destructive", variant="destructive") }}
{{ badge("Outline", variant="outline") }}
{{ badge("Ghost", variant="ghost") }}`,
              go: `{{template "badge" (dict "Text" "Default")}}
{{template "badge" (dict "Text" "Secondary"   "Variant" "secondary")}}
{{template "badge" (dict "Text" "Destructive" "Variant" "destructive")}}
{{template "badge" (dict "Text" "Outline"     "Variant" "outline")}}
{{template "badge" (dict "Text" "Ghost"       "Variant" "ghost")}}`,
              phoenix: `<.badge>Default</.badge>
<.badge variant="secondary">Secondary</.badge>
<.badge variant="destructive">Destructive</.badge>
<.badge variant="outline">Outline</.badge>
<.badge variant="ghost">Ghost</.badge>`,
            })}

            {await Example({
              id: "ex-link",
              title: "Link badge — anchor with badge styling",
              description:
                "Pass href to render as <a> with hover state. Use variant=\"link\" for an underlined text-only style.",
              narrative: (
                <p>
                  When the badge is clickable, render a real link
                  (
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a&gt;</code>
                  ) so the platform handles cursor, focus ring, middle-click,
                  and assistive-tech link role. The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">[a&amp;]:</code>{" "}
                  Tailwind selector only applies hover styles when the badge
                  is rendered as an anchor — non-link badges stay static.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<a> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <Badge as="a" href="/docs/badge">
                    Read the docs
                  </Badge>
                  <Badge as="a" href="https://htmx.org" variant="link">
                    htmx.org
                  </Badge>
                </div>
              ),
              jsx: `<Badge as="a" href="/docs/badge">Read the docs</Badge>
<Badge as="a" href="https://htmx.org" variant="link">htmx.org</Badge>`,
              jinja: `{{ badge("Read the docs", tag="a", href="/docs/badge") }}
{{ badge("htmx.org",     tag="a", href="https://htmx.org", variant="link") }}`,
              go: `{{template "badge" (dict "Text" "Read the docs" "Tag" "a" "Href" "/docs/badge")}}
{{template "badge" (dict "Text" "htmx.org" "Tag" "a" "Href" "https://htmx.org" "Variant" "link")}}`,
              phoenix: `<.badge as="a" href={~p"/docs/badge"}>Read the docs</.badge>
<.badge as="a" href="https://htmx.org" variant="link">htmx.org</.badge>`,
            })}

            {await Example({
              id: "ex-icon",
              title: "Icon-only — counter with accessible name",
              description:
                "Number-only badges (notification counters) need ariaLabel so screen readers announce \"3 unread notifications\" instead of just \"3\".",
              narrative: (
                <p>
                  WCAG 1.3.1 (Info and Relationships) says programmatic
                  meaning must match visual meaning. A "3" by itself is
                  ambiguous — pair it with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel="3 unread notifications"</code>{" "}
                  so the count's context comes through. Counters that update
                  on the client (htmx swap, push) should also live in a
                  live-region (see Alert) so changes are announced.
                </p>
              ),
              references: [
                {
                  source: "WCAG",
                  label: "1.3.1 Info and Relationships",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",
                },
                {
                  source: "MDN",
                  label: "aria-label",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-3">
                  <Badge variant="destructive" ariaLabel="3 unread notifications">
                    3
                  </Badge>
                  <Badge variant="secondary" ariaLabel="12 items">
                    12
                  </Badge>
                  <Badge variant="default" ariaLabel="99 plus messages">
                    99+
                  </Badge>
                </div>
              ),
              jsx: `<Badge variant="destructive" ariaLabel="3 unread notifications">3</Badge>
<Badge variant="secondary"   ariaLabel="12 items">12</Badge>
<Badge variant="default"     ariaLabel="99 plus messages">99+</Badge>`,
              jinja: `{{ badge("3",   variant="destructive", aria_label="3 unread notifications") }}
{{ badge("12",  variant="secondary",   aria_label="12 items") }}
{{ badge("99+", variant="default",     aria_label="99 plus messages") }}`,
              go: `{{template "badge" (dict "Text" "3"   "Variant" "destructive" "AriaLabel" "3 unread notifications")}}
{{template "badge" (dict "Text" "12"  "Variant" "secondary"   "AriaLabel" "12 items")}}
{{template "badge" (dict "Text" "99+" "Variant" "default"     "AriaLabel" "99 plus messages")}}`,
              phoenix: `<.badge variant="destructive" aria-label="3 unread notifications">3</.badge>
<.badge variant="secondary"   aria-label="12 items">12</.badge>
<.badge variant="default"     aria-label="99 plus messages">99+</.badge>`,
            })}

            {await Example({
              id: "ex-icon-text",
              title: "With icon — SVG + label",
              description:
                "An inline SVG plus a short label. The SVG sits inside the badge as a child; the [&>svg]:size-3 utility sizes it automatically.",
              narrative: (
                <p>
                  Decorative SVGs should carry{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-hidden="true"</code>{" "}
                  so AT doesn't double-announce. If the icon is the entire
                  badge content (no text), drop aria-hidden and add{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="img"</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>{" "}
                  to the badge itself instead.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Accessible SVGs",
                  href: "https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_accessibility",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <Badge>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Saved
                  </Badge>
                  <Badge variant="destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Failed
                  </Badge>
                  <Badge variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Pending
                  </Badge>
                </div>
              ),
              jsx: `<Badge>
  <CheckIcon aria-hidden="true" /> Saved
</Badge>
<Badge variant="destructive">
  <XCircleIcon aria-hidden="true" /> Failed
</Badge>`,
              jinja: `{{ badge("Saved",  variant="default") }}    {# wrap an <svg> inside the macro call if your macro accepts a body #}
{{ badge("Failed", variant="destructive") }}`,
              go: `{{template "badge" (dict "Text" "Saved")}}
{{template "badge" (dict "Text" "Failed" "Variant" "destructive")}}`,
              phoenix: `<.badge>
  <.icon name="hero-check" aria-hidden="true" /> Saved
</.badge>`,
            })}
          </section>
          <ApiTable
            title="<Badge>"
            rows={BADGE_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
