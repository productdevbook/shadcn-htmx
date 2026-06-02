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
import { SKIP_LINK_PROPS } from "@/app/data/api-rows"
import { SkipLink } from "@/registry/ui/skip-link"

export const skipLinkRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/skip-link.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/skip-link.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/skip-link.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/skip_link.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/skip-link.html"), "utf8"),
])

const usageJsx = `import { SkipLink } from "@/components/ui/skip-link"

// First child of <body>, before the header.
<body>
  <SkipLink />
  <header>…</header>
  <main id="main" tabindex={-1}>…</main>
</body>`

const usageJinja = `{% from "components/skip-link.html" import skip_link %}

<body>
  {{ skip_link() }}
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
</body>`

const usageGo = `// First child of <body>, before the header.
{{template "skip-link" .}}
<header>…</header>
<main id="main" tabindex="-1">…</main>`

const usagePhoenix = `alias ShadcnHtmx.Components.SkipLink

<body>
  <SkipLink.skip_link />
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
</body>`

const usageHtml = `<body>
  <a href="#main" data-slot="skip-link"
     class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
            focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2
            focus:text-primary-foreground …">
    Skip to main content
  </a>
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
</body>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#api", label: "API Reference" },
]

skipLinkRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/skip-link.json`
  return page(
    c,
    <Layout title="Skip Link — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/skip-link" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Skip Link</h1>
            <p class="text-muted-foreground">
              The first focusable element on the page — a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                Skip to main content
              </code>{" "}
              link that stays visually hidden until a keyboard user tabs to it,
              then jumps focus past the repeated banner and navigation to the{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;main&gt;</code>{" "}
              landmark. A native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;a href=&quot;#main&quot;&gt;</code>{" "}
              with a CSS focus reveal — no JavaScript at all.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack — no npm package, no build step required. Use
              the shadcn CLI for JSX projects, or copy the source straight into
              your template directory.
            </p>
            <LangTabs
              id="install-skip-link"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/skip-link.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/skip-link.html",
                    source: jinjaSource,
                    note: "Copy skip-link.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/skip-link.tmpl",
                    source: goSource,
                    note: "Add skip-link.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/skip_link.ex",
                    source: phoenixSource,
                    note: "Drop skip_link.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/skip-link.html",
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
              title: "Tab to reveal",
              description:
                "Click inside the canvas, then press Tab. The hidden link appears top-left; press Enter to jump focus to the main region.",
              narrative: (
                <p>
                  At rest the link is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">sr-only</code>{" "}
                  — a clipped 1px box no pointer can hit, so the only way it
                  gains focus is a keyboard{" "}
                  <kbd class="rounded border bg-muted px-1 text-xs">Tab</kbd>.
                  On{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">:focus</code>{" "}
                  the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">focus:not-sr-only</code>{" "}
                  utilities undo the clip and pin it to the top-left as a pill.
                  Because it's a real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;a href&gt;</code>,
                  the platform gives you the link role,{" "}
                  <kbd class="rounded border bg-muted px-1 text-xs">Enter</kbd>{" "}
                  activation and the focus-jump for free. In the demo the link
                  targets a local region; on a real page it points at{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">#main</code>.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Landmark Regions — skip links target landmarks",
                  href: "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/",
                },
                {
                  source: "MDN",
                  label: "<a> element (implicit link role + activation)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a",
                },
                {
                  source: "WCAG",
                  label: "2.4.1 Bypass Blocks",
                  href: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
                },
              ],
              preview: (
                <div class="relative w-full max-w-md rounded-md border bg-card p-4">
                  <SkipLink href="#sl-demo-main" />
                  <p class="mb-3 text-xs text-muted-foreground">
                    Repeated banner / navigation (skipped).
                  </p>
                  <div
                    id="sl-demo-main"
                    tabindex={-1}
                    class="rounded-md border border-dashed p-3 text-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    Main region — focus lands here.
                  </div>
                </div>
              ),
              jsx: `<body>
  <SkipLink />
  <header>…</header>
  <main id="main" tabindex={-1}>…</main>
</body>`,
              jinja: `<body>
  {{ skip_link() }}
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
</body>`,
              go: `{{template "skip-link" .}}
<header>…</header>
<main id="main" tabindex="-1">…</main>`,
              phoenix: `<body>
  <SkipLink.skip_link />
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
</body>`,
            })}

            {await Example({
              id: "ex-custom",
              title: "Custom target and label",
              description:
                "Point the link at any landmark id and override the visible label.",
              narrative: (
                <p>
                  The default target is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">#main</code>,
                  but a page can offer more than one bypass link (e.g. skip to
                  the search, or to a primary navigation). Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">href</code>{" "}
                  with the fragment of the destination landmark's id and a
                  custom label as children.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "main landmark role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/main_role",
                },
              ],
              preview: (
                <div class="relative w-full max-w-md rounded-md border bg-card p-4">
                  <SkipLink href="#sl-demo-content">Skip to content</SkipLink>
                  <p class="mb-3 text-xs text-muted-foreground">
                    Navigation (skipped).
                  </p>
                  <div
                    id="sl-demo-content"
                    tabindex={-1}
                    class="rounded-md border border-dashed p-3 text-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    Content region — focus lands here.
                  </div>
                </div>
              ),
              jsx: `<SkipLink href="#content">Skip to content</SkipLink>`,
              jinja: `{{ skip_link("Skip to content", href="#content") }}`,
              go: `{{template "skip-link" (dict "Label" "Skip to content" "Href" "#content")}}`,
              phoenix: `<SkipLink.skip_link href="#content">Skip to content</SkipLink.skip_link>`,
            })}
          </section>

          <ApiTable title="<SkipLink>" rows={SKIP_LINK_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
