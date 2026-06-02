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
import { LINK_PROPS } from "@/app/data/api-rows"
import { Link } from "@/registry/ui/link"

export const linkRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/link.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/link.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/link.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/link.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/link.html"), "utf8"),
  ])

const usageJsx = `import { Link } from "@/components/ui/link"

<Link href="/docs">Documentation</Link>
<Link href="https://htmx.org" external>htmx.org</Link>`

const usageJinja = `{% from "components/link.html" import link %}

{{ link("Documentation", href="/docs") }}
{{ link("htmx.org", href="https://htmx.org", external=true) }}`

const usageGo = `{{template "link" (dict "Text" "Documentation" "Href" "/docs")}}
{{template "link" (dict "Text" "htmx.org" "Href" "https://htmx.org" "External" true)}}`

const usagePhoenix = `alias ShadcnHtmx.Components.Link

<Link.link_ href="/docs">Documentation</Link.link_>
<Link.link_ href="https://htmx.org" external>htmx.org</Link.link_>`

const usageHtml = `<a href="/docs" data-slot="link" data-variant="default"
   class="inline-flex items-center gap-1 rounded-sm font-medium
          text-primary underline-offset-4 underline decoration-primary/40 …">
  Documentation
</a>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-variants", label: "Variants", nested: true },
  { href: "#ex-external", label: "External", nested: true },
  { href: "#ex-inline", label: "In prose", nested: true },
  { href: "#ex-fallback", label: "role=link fallback", nested: true },
  { href: "#api", label: "API Reference" },
]

linkRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/link.json`

  return page(
    c,
    <Layout title="link — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/link" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">link</h1>
            <p class="text-muted-foreground">
              A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;a href&gt;</code>{" "}
              with shadcn styling. Underlined, muted, and hover-underline
              variants, plus an external treatment that opens a new tab and
              says so. The WAI-ARIA APG Link pattern's keyboard contract —
              Enter activates — comes from the platform, not JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-link"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/link.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/link.html", source: jinjaSource, note: "Copy link.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/link.tmpl", source: goSource, note: "Add link.tmpl alongside your other templates. The template uses sprig's dict + a htmlSafe helper for the optional rich body." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/link.ex", source: phoenixSource, note: "Drop link.ex into lib/my_app_web/components/. The function is link_/1 to avoid clashing with Phoenix's built-in link/1." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/link.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css. The trailing <script> only boots the role=link fallback — native <a> needs none of it." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-variants",
              title: "Variants",
              description:
                "Three emphasis levels — all the same native <a href>, only the underline / colour treatment changes.",
              narrative: (
                <p>
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">default</code>{" "}
                  is the prose link: primary colour, always underlined so it's
                  distinguishable without relying on colour alone (WCAG 1.4.1).{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">muted</code>{" "}
                  steps back for footers and metadata.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hover</code>{" "}
                  drops the underline until hover/focus — reserve it for
                  navigation and menus where the surrounding context already
                  signals "this is a link", never for links buried in body
                  text.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Link pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/link/",
                },
                {
                  source: "MDN",
                  label: "<a> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a",
                },
                {
                  source: "WCAG",
                  label: "1.4.1 Use of Color",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-6">
                  <Link href="/docs/link">Default link</Link>
                  <Link href="/docs/link" variant="muted">
                    Muted link
                  </Link>
                  <Link href="/docs/link" variant="hover">
                    Hover-underline link
                  </Link>
                </div>
              ),
              jsx: `<Link href="/docs/link">Default link</Link>
<Link href="/docs/link" variant="muted">Muted link</Link>
<Link href="/docs/link" variant="hover">Hover-underline link</Link>`,
              jinja: `{{ link("Default link", href="/docs/link") }}
{{ link("Muted link", href="/docs/link", variant="muted") }}
{{ link("Hover-underline link", href="/docs/link", variant="hover") }}`,
              go: `{{template "link" (dict "Text" "Default link" "Href" "/docs/link")}}
{{template "link" (dict "Text" "Muted link" "Href" "/docs/link" "Variant" "muted")}}
{{template "link" (dict "Text" "Hover-underline link" "Href" "/docs/link" "Variant" "hover")}}`,
              phoenix: `<Link.link_ href="/docs/link">Default link</Link.link_>
<Link.link_ href="/docs/link" variant="muted">Muted link</Link.link_>
<Link.link_ href="/docs/link" variant="hover">Hover-underline link</Link.link_>`,
            })}

            {await Example({
              id: "ex-external",
              title: "External — opens in a new tab, and says so",
              description:
                "external sets target=_blank rel=\"noopener noreferrer\" and appends an icon plus visually-hidden \"(opens in new tab)\" text.",
              narrative: (
                <p>
                  MDN's guidance on external links is explicit: a link that
                  opens a new tab "should indicate what will happen when the
                  link is followed", because an unexpected new window confuses
                  people with low vision, screen-reader users, and people with
                  cognitive concerns. So{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">external</code>{" "}
                  renders a visible glyph plus a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">sr-only</code>{" "}
                  span. It also writes{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">rel="noopener noreferrer"</code>
                  : modern browsers imply{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">noopener</code>{" "}
                  for{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">_blank</code>,
                  but writing it keeps the protection explicit and severs the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">window.opener</code>{" "}
                  reference and the referrer.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "External links and new tabs",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#external_links_and_linking_to_non-html_resources",
                },
                {
                  source: "MDN",
                  label: "rel=noopener",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener",
                },
                {
                  source: "WCAG",
                  label: "3.2.5 Change on Request",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/change-on-request.html",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-6">
                  <Link href="https://htmx.org" external>
                    htmx.org
                  </Link>
                  <Link href="https://tailwindcss.com" external variant="muted">
                    Tailwind CSS
                  </Link>
                </div>
              ),
              jsx: `<Link href="https://htmx.org" external>htmx.org</Link>
<Link href="https://tailwindcss.com" external variant="muted">
  Tailwind CSS
</Link>`,
              jinja: `{{ link("htmx.org", href="https://htmx.org", external=true) }}
{{ link("Tailwind CSS", href="https://tailwindcss.com", external=true, variant="muted") }}`,
              go: `{{template "link" (dict "Text" "htmx.org" "Href" "https://htmx.org" "External" true)}}
{{template "link" (dict "Text" "Tailwind CSS" "Href" "https://tailwindcss.com" "External" true "Variant" "muted")}}`,
              phoenix: `<Link.link_ href="https://htmx.org" external>htmx.org</Link.link_>
<Link.link_ href="https://tailwindcss.com" external variant="muted">
  Tailwind CSS
</Link.link_>`,
            })}

            {await Example({
              id: "ex-inline",
              title: "In prose",
              description:
                "Links flow inline with text. The default variant keeps a visible underline so it stands out from surrounding prose.",
              narrative: (
                <p>
                  Link text should make sense out of context — assistive tech
                  can list every link on a page, so "click here" reads as a
                  wall of "click here". MDN's own example fixes weak link text
                  by moving the anchor onto the meaningful words. Write{" "}
                  <em>learn about our components</em>, not <em>learn more here</em>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Strong link text",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#strong_link_text",
                },
                {
                  source: "WCAG",
                  label: "2.4.4 Link Purpose (In Context)",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",
                },
              ],
              preview: (
                <p class="max-w-prose px-6 py-4 text-sm leading-relaxed text-foreground">
                  This component renders a real anchor, so you keep every
                  browser affordance. Read the{" "}
                  <Link href="https://www.w3.org/WAI/ARIA/apg/patterns/link/" external>
                    APG Link pattern
                  </Link>{" "}
                  for the full contract, or jump straight to the{" "}
                  <Link href="#api">API reference</Link> below.
                </p>
              ),
              jsx: `<p>
  Read the{" "}
  <Link href="https://www.w3.org/WAI/ARIA/apg/patterns/link/" external>
    APG Link pattern
  </Link>{" "}
  for the full contract, or jump to the{" "}
  <Link href="#api">API reference</Link>.
</p>`,
              jinja: `<p>
  Read the {{ link("APG Link pattern", href="https://www.w3.org/WAI/ARIA/apg/patterns/link/", external=true) }}
  for the full contract, or jump to the {{ link("API reference", href="#api") }}.
</p>`,
              go: `<p>
  Read the {{template "link" (dict "Text" "APG Link pattern" "Href" "https://www.w3.org/WAI/ARIA/apg/patterns/link/" "External" true)}}
  for the full contract, or jump to the {{template "link" (dict "Text" "API reference" "Href" "#api")}}.
</p>`,
              phoenix: `<p>
  Read the
  <Link.link_ href="https://www.w3.org/WAI/ARIA/apg/patterns/link/" external>APG Link pattern</Link.link_>
  for the full contract, or jump to the
  <Link.link_ href="#api">API reference</Link.link_>.
</p>`,
            })}

            {await Example({
              id: "ex-fallback",
              title: "role=link fallback (last resort)",
              description:
                "When the markup genuinely cannot be an <a> — e.g. a <span> inside content you don't control — render role=link + tabindex=0 and wire navigation yourself.",
              narrative: (
                <p>
                  The APG Link <em>examples</em> build links out of{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;span&gt;</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;img&gt;</code>{" "}
                  with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="link"</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="0"</code>{" "}
                  +{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">onkeydown</code>
                  , but the pattern's own note warns that applying{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="link"</code>{" "}
                  does <em>not</em> give you navigation, the context menu, or
                  copy-link — those become your job. Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">as="span"</code>{" "}
                  to opt in. The shared keyboard handler (Enter activates) lives
                  in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>,
                  keyed on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">[data-slot="link"][role="link"]</code>.
                  This is the exception — reach for a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a&gt;</code>{" "}
                  every other time.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Link examples (span / img)",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/link/examples/link/",
                },
                {
                  source: "MDN",
                  label: "link role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/link_role",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-6">
                  <Link as="span" href="/docs/link" data-href="/docs/link">
                    Span as link
                  </Link>
                </div>
              ),
              jsx: `// Last resort — the platform won't navigate for you.
// site.js reads data-href on [data-slot="link"][role="link"].
<Link as="span" data-href="/docs/link">Span as link</Link>`,
              jinja: `{{ link("Span as link", as="span", data_href="/docs/link") }}`,
              go: `{{template "link" (dict "Text" "Span as link" "As" "span" "Attrs" (dict "data-href" "/docs/link"))}}`,
              phoenix: `<Link.link_ as="span" data-href="/docs/link">Span as link</Link.link_>`,
            })}
          </section>

          <ApiTable title="<Link>" rows={LINK_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
