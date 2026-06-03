/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { Layout, page } from "@/app/layout"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { CodeBlock } from "@/app/components/code-block"

export const introductionRoutes = new Hono()

const tocItems = [
  { href: "#overview", label: "Overview" },
  { href: "#principles", label: "What makes it different" },
  { href: "#flavours", label: "Five flavours" },
  { href: "#how", label: "How it works" },
  { href: "#a11y", label: "Accessibility" },
  { href: "#install", label: "Install" },
  { href: "#next", label: "Next steps" },
]

const FLAVOURS: { flavour: string; label: string; copy: string }[] = [
  { flavour: "jsx", label: "Hono JSX (TypeScript)", copy: "A typed component you import" },
  { flavour: "jinja", label: "Jinja2", copy: "A {% macro %} you call" },
  { flavour: "go", label: "Go html/template", copy: "A {{ define }} template" },
  { flavour: "phoenix", label: "Phoenix", copy: "A ~H function component" },
  { flavour: "html", label: "Raw HTML", copy: "A copy-paste snippet" },
]

function H2(props: { id: string; children: any }) {
  return (
    <h2 id={props.id} class="scroll-mt-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h2>
  )
}
function Code({ children }: { children: any }) {
  return <code class="rounded bg-muted px-1 py-0.5 text-xs">{children}</code>
}

introductionRoutes.get("/", async (c) => {
  const installSnippet = `# pick your stack once (jsx | jinja | go | phoenix | html)
npx shadcn-htmx init --flavour jinja

# add one or many — only your flavour's file lands in your project
npx shadcn-htmx add button dialog combobox

# browse everything available
npx shadcn-htmx list`
  const installBlock = await CodeBlock({ code: installSnippet, lang: "bash" })

  return page(
    c,
    <Layout title="Introduction — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/introduction" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Getting Started</p>
            <h1 class="text-3xl font-bold tracking-tight">Introduction</h1>
            <p class="text-muted-foreground">
              shadcn-htmx is a library of shadcn-style UI components for teams that render HTML on the
              server. One design, 82 components, five flavours — Hono JSX, Jinja2, Go templates,
              Phoenix, and raw HTML — all built on web standards and wired for{" "}
              <a class="underline underline-offset-4" href="https://htmx.org" target="_blank" rel="noreferrer">htmx v4</a>.
            </p>
          </header>

          <section class="space-y-4">
            <H2 id="overview">Overview</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              Most component libraries assume React. shadcn-htmx assumes the <em>platform</em>: a real{" "}
              <Code>&lt;button&gt;</Code>, a real <Code>&lt;dialog&gt;</Code>, real <Code>aria-*</Code>, a
              real <Code>&lt;input type="date"&gt;</Code>. Behaviour the browser already ships is never
              re-implemented in JavaScript.
            </p>
            <p class="text-sm leading-relaxed text-muted-foreground">
              There's no runtime to install. You copy a component's source into your project and own it —
              like <Code>shadcn/ui</Code>, but for server-rendered stacks. No bundler step, no hydration,
              no version lock-in.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="principles">What makes it different</H2>
            <ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground/50">
              <li>
                <strong class="font-medium text-foreground">Web standards first.</strong> Every component
                is justified against the WAI-ARIA APG, MDN, the htmx v4 source, and the Tailwind v4 source
                before it ships. No polyfills, no emulation.
              </li>
              <li>
                <strong class="font-medium text-foreground">Five flavours, one design.</strong> The same
                accessible markup as a typed Hono JSX component, a Jinja2 macro, a Go{" "}
                <Code>html/template</Code>, a Phoenix function component, or a copy-paste snippet.
              </li>
              <li>
                <strong class="font-medium text-foreground">Server-rendered &amp; htmx-native.</strong> Wired
                for the htmx v4 attribute set: live search, infinite scroll, inline edit, optimistic toggles.
              </li>
              <li>
                <strong class="font-medium text-foreground">Accessible by construction.</strong> Keyboard,
                focus, and ARIA roles checked against the spec — and against an axe-core + APG test suite.
              </li>
              <li>
                <strong class="font-medium text-foreground">Your code, your repo.</strong> Copy a component
                in and it's yours. No runtime dependency.
              </li>
            </ul>
          </section>

          <section class="space-y-4">
            <H2 id="flavours">Five flavours</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              The Hono JSX file is the canonical source; the other four mirror its semantics exactly — same
              elements, roles, ARIA, and Tailwind classes. Only the templating syntax differs.
            </p>
            <div class="relative w-full overflow-auto rounded-lg border">
              <table class="w-full caption-bottom text-sm">
                <thead class="bg-muted/50">
                  <tr class="border-b">
                    <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">Flavour</th>
                    <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">Language / engine</th>
                    <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">What you copy</th>
                  </tr>
                </thead>
                <tbody>
                  {FLAVOURS.map((f) => (
                    <tr class="border-b align-top last:border-0">
                      <td class="px-3 py-2">
                        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{f.flavour}</code>
                      </td>
                      <td class="px-3 py-2 text-xs text-muted-foreground">{f.label}</td>
                      <td class="px-3 py-2 text-xs text-muted-foreground">{f.copy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section class="space-y-4">
            <H2 id="how">How it works</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              <Code>registry.json</Code> is the manifest — one entry per component, listing its five
              flavour files. A build step emits <Code>public/r/&lt;name&gt;.json</Code> (the shadcn{" "}
              <Code>registry-item</Code> schema, with each file's contents inlined) plus an{" "}
              <Code>index.json</Code>. The docs site serves <Code>/r/*</Code>, so the CLI — or any HTTP
              client — pulls items straight over the wire. The CLI reads that same JSON and writes only the
              file for your chosen flavour.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="a11y">Accessibility</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              Interactive components implement the matching{" "}
              <a class="underline underline-offset-4" href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices</a>{" "}
              pattern — keyboard interaction, focus management, and ARIA roles checked against the spec. The
              repo ships a Playwright suite that enforces it: axe-core on every page, APG keyboard
              contracts, overlay geometry, and a console-error sweep.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="install">Install</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              The fastest path is the flavour-aware CLI. Pick your stack once, then add components — only{" "}
              <em>your</em> framework's file lands in your project.
            </p>
            {installBlock}
            <p class="text-sm leading-relaxed text-muted-foreground">
              Prefer the stock shadcn CLI, a raw <Code>curl</Code>, or plain copy-paste? See the{" "}
              <a class="font-medium text-foreground underline underline-offset-4" href="/docs/cli">CLI page</a>{" "}
              for every install path.
            </p>
          </section>

          <section class="space-y-4 border-t pt-10">
            <H2 id="next">Next steps</H2>
            <ul class="space-y-2 text-sm">
              <li>
                <a class="font-medium text-foreground underline underline-offset-4" href="/docs/why-htmx-tailwind">Why htmx + Tailwind</a>
                <span class="text-muted-foreground"> — the thinking behind the stack.</span>
              </li>
              <li>
                <a class="font-medium text-foreground underline underline-offset-4" href="/docs/cli">The CLI</a>
                <span class="text-muted-foreground"> — init, add, list, and every install path.</span>
              </li>
              <li>
                <a class="font-medium text-foreground underline underline-offset-4" href="/docs/button">Button</a>
                <span class="text-muted-foreground"> — jump into your first component.</span>
              </li>
            </ul>
          </section>
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
