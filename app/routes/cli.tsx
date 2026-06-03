/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { Layout, page } from "@/app/layout"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { CodeBlock } from "@/app/components/code-block"

export const cliRoutes = new Hono()

const FLAVOURS: { flavour: string; label: string; file: string; target: string }[] = [
  { flavour: "jsx", label: "Hono JSX", file: "registry/ui/<name>.tsx", target: "components/ui/<name>.tsx" },
  { flavour: "jinja", label: "Jinja2", file: "registry/jinja2/<name>.html", target: "templates/components/<name>.html" },
  { flavour: "go", label: "Go template", file: "registry/go-templates/<name>.tmpl", target: "components/<name>.tmpl" },
  { flavour: "phoenix", label: "Phoenix", file: "registry/phoenix/<name>.ex", target: "lib/my_app_web/components/<name>.ex" },
  { flavour: "html", label: "Raw HTML", file: "registry/html/<name>.html", target: "snippets/<name>.html" },
]

const tocItems = [
  { href: "#overview", label: "Overview" },
  { href: "#init", label: "Set up" },
  { href: "#add", label: "Add components" },
  { href: "#flavours", label: "Flavours & targets", nested: true },
  { href: "#config", label: "Config file" },
  { href: "#vs-shadcn", label: "vs. the shadcn CLI" },
]

function H2(props: { id: string; children: any }) {
  return (
    <h2 id={props.id} class="scroll-mt-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h2>
  )
}

cliRoutes.get("/", async (c) => {
  const initSnippet = `# pick your stack once (jsx | jinja | go | phoenix | html)
npx shadcn-htmx init --flavour jinja --registry https://shadcn-htmx.productdevbook.com/r`
  const addSnippet = `# add one or many — only the Jinja2 files land in your project
npx shadcn-htmx add button input dialog

# override the flavour / destination per call
npx shadcn-htmx add table --flavour go --out ./internal/templates

# preview without writing
npx shadcn-htmx add accordion --dry`
  const listSnippet = `npx shadcn-htmx list
#   button             Button
#   input              Input
#   dialog             Dialog
#   …`
  const configSnippet = `{
  "$schema": "https://github.com/productdevbook/shadcn-htmx",
  "flavour": "jinja",
  "registry": "https://shadcn-htmx.productdevbook.com/r",
  "out": "."
}`
  const initBlock = await CodeBlock({ code: initSnippet, lang: "bash" })
  const addBlock = await CodeBlock({ code: addSnippet, lang: "bash" })
  const listBlock = await CodeBlock({ code: listSnippet, lang: "bash" })
  const configBlock = await CodeBlock({ code: configSnippet, lang: "json", filename: "shadcn-htmx.json" })

  return page(
    c,
    <Layout title="CLI — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/cli" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Getting Started
            </p>
            <h1 class="text-3xl font-bold tracking-tight">The shadcn-htmx CLI</h1>
            <p class="text-muted-foreground">
              A tiny, dependency-free installer. Unlike the stock shadcn CLI —
              which copies every flavour's file for a component — <code class="rounded bg-muted px-1 py-0.5 text-xs">shadcn-htmx</code> copies
              <em> only the file for the framework you chose</em>, to the path that
              framework expects. It reads the very same registry the site publishes.
            </p>
          </header>

          <section class="space-y-4">
            <H2 id="overview">Overview</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              Run it with <code class="rounded bg-muted px-1 py-0.5 text-xs">npx</code> —
              no install, no runtime dependency, works wherever Node runs (so your
              Python, Go, or Elixir project doesn't need a JS toolchain). Three
              commands: <code class="rounded bg-muted px-1 py-0.5 text-xs">init</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">add</code>, and{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">list</code>.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="init">Set up</H2>
            <p class="text-sm text-muted-foreground">
              Pick your flavour and point the CLI at a registry once.{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">init</code> writes a{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">shadcn-htmx.json</code> so
              later commands need no flags.
            </p>
            {initBlock}
          </section>

          <section class="space-y-4">
            <H2 id="add">Add components</H2>
            <p class="text-sm text-muted-foreground">
              Each name resolves to one file for your flavour, written to its
              conventional target. For the JSX flavour, registry dependencies
              (the <code class="rounded bg-muted px-1 py-0.5 text-xs">cn()</code> util)
              are pulled in automatically; the template flavours pull just their
              one file. Existing files are skipped unless you pass{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">--overwrite</code>.
            </p>
            {addBlock}

            <h3 id="flavours" class="scroll-mt-20 pt-2 text-base font-semibold">
              Flavours &amp; targets
            </h3>
            <div class="relative w-full overflow-auto rounded-lg border">
              <table class="w-full caption-bottom text-sm">
                <thead class="bg-muted/50">
                  <tr class="border-b">
                    <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">Flavour</th>
                    <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">Registry file</th>
                    <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">Written to</th>
                  </tr>
                </thead>
                <tbody>
                  {FLAVOURS.map((f) => (
                    <tr class="border-b last:border-0 align-top">
                      <td class="px-3 py-2">
                        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{f.flavour}</code>
                        <span class="ml-2 text-xs text-muted-foreground">{f.label}</span>
                      </td>
                      <td class="px-3 py-2"><code class="text-xs">{f.file}</code></td>
                      <td class="px-3 py-2"><code class="text-xs text-muted-foreground">{f.target}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section class="space-y-4">
            <H2 id="add-list">List what's available</H2>
            {listBlock}
          </section>

          <section class="space-y-4">
            <H2 id="config">Config file</H2>
            <p class="text-sm text-muted-foreground">
              <code class="rounded bg-muted px-1 py-0.5 text-xs">shadcn-htmx.json</code> in
              your project root sets the defaults for every command. Flags
              (<code class="rounded bg-muted px-1 py-0.5 text-xs">--flavour</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">--registry</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">--out</code>) override it.
            </p>
            {configBlock}
            <p class="text-sm text-muted-foreground">
              <code class="rounded bg-muted px-1 py-0.5 text-xs">registry</code> is your
              docs host's <code class="rounded bg-muted px-1 py-0.5 text-xs">/r</code> endpoint
              (or a local directory). All flags:{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">-f/--flavour</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">-r/--registry</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">-o/--out</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">--cwd</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">--dry</code>,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">--overwrite</code>.
            </p>
          </section>

          <section class="space-y-4 border-t pt-10">
            <H2 id="vs-shadcn">vs. the shadcn CLI</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              The registry items follow the shadcn{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">registry-item</code> schema,
              so <code class="rounded bg-muted px-1 py-0.5 text-xs">npx shadcn@latest add https://shadcn-htmx.productdevbook.com/r/button.json</code>{" "}
              works too — but it copies <em>all five</em> flavours' files into your
              project, leaving you to delete the four you don't use. The{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">shadcn-htmx</code> CLI is
              flavour-aware: it copies exactly one. Use whichever you prefer; both
              read the same registry.
            </p>
          </section>
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
