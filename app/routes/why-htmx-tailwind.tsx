/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { Layout, page } from "@/app/layout"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"

export const whyHtmxTailwindRoutes = new Hono()

const tocItems = [
  { href: "#case", label: "Server-rendered, on purpose" },
  { href: "#htmx", label: "Why htmx v4" },
  { href: "#tailwind", label: "Why Tailwind v4" },
  { href: "#standards", label: "Web standards over JS" },
  { href: "#who", label: "Who it's for" },
  { href: "#start", label: "Where to go next" },
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

whyHtmxTailwindRoutes.get("/", (c) =>
  page(
    c,
    <Layout title="Why htmx + Tailwind — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/why-htmx-tailwind" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Getting Started</p>
            <h1 class="text-3xl font-bold tracking-tight">Why htmx + Tailwind</h1>
            <p class="text-muted-foreground">
              Two bets: that HTML over the wire beats shipping a client framework, and that CSS is finally
              good enough to not need a config file. shadcn-htmx is what those two bets look like as a
              component library.
            </p>
          </header>

          <section class="space-y-4">
            <H2 id="case">Server-rendered, on purpose</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              A React component library makes sense when React renders your app. If your app renders HTML
              on a server — Flask, Django, Rails, Phoenix, Go, Hono — pulling in a client framework just to
              get a styled dropdown is a tax: a build pipeline, a hydration step, a bundle to ship, and a
              second source of truth for state.
            </p>
            <p class="text-sm leading-relaxed text-muted-foreground">
              shadcn-htmx skips all of it. The server renders the markup; the browser runs it. The only
              JavaScript is a tiny shared keyboard layer for the composite widgets the platform doesn't
              cover — measured in kilobytes, not megabytes.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="htmx">Why htmx v4</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              htmx lets any element issue an HTTP request and swap the response into the page —{" "}
              <Code>hx-get</Code>, <Code>hx-post</Code>, <Code>hx-swap</Code>. Interactivity becomes "ask
              the server for new HTML", not "mutate client state and re-render". There's no store, no
              virtual DOM, no serialization boundary between client and server.
            </p>
            <p class="text-sm leading-relaxed text-muted-foreground">
              Every component here types the htmx v4 attribute set — the renamed swap modifiers,{" "}
              <Code>hx-disable</Code>, the new request-lifecycle hooks — so live search, infinite scroll,
              inline edit, and optimistic toggles are a couple of attributes, not a framework.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="tailwind">Why Tailwind v4</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              Tailwind v4 is CSS-first: theme tokens live in <Code>@theme</Code>, custom utilities in{" "}
              <Code>@utility</Code>, and the Oxide engine compiles in milliseconds with no legacy{" "}
              <Code>tailwind.config.js</Code>. Components are styled with the same utility vocabulary you
              already use and themed through CSS variables, so dropping one into your project doesn't drag
              in a design-system runtime — just classes your build already understands.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="standards">Web standards over JavaScript</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              The rule: if the platform ships it, use it. A disclosure is <Code>&lt;details&gt;</Code>. A
              modal is <Code>&lt;dialog&gt;</Code>. A date picker is <Code>&lt;input type="date"&gt;</Code>.
              A gauge is <Code>&lt;meter&gt;</Code>. These come with built-in accessibility, keyboard
              handling, and form integration that hand-rolled JS widgets spend thousands of lines
              approximating — usually less well.
            </p>
            <p class="text-sm leading-relaxed text-muted-foreground">
              JavaScript appears only where the platform genuinely has no primitive — the composite ARIA
              widgets (menu, listbox, combobox, tree) — and even there it's one small, shared keyboard
              layer, not a per-component runtime. Every component is measured against the WAI-ARIA APG,
              MDN, the htmx v4 source, and the Tailwind v4 source before it ships.
            </p>
          </section>

          <section class="space-y-4">
            <H2 id="who">Who it's for</H2>
            <p class="text-sm leading-relaxed text-muted-foreground">
              If you render HTML on the server and want shadcn-quality components without adopting React,
              this is for you — Python (Jinja2), Go (<Code>html/template</Code>), Elixir (Phoenix), or
              anything that can emit markup (the raw-HTML flavour). There's a typed Hono JSX flavour too,
              if your server already speaks JS/TS.
            </p>
          </section>

          <section class="space-y-4 border-t pt-10">
            <H2 id="start">Where to go next</H2>
            <ul class="space-y-2 text-sm">
              <li>
                <a class="font-medium text-foreground underline underline-offset-4" href="/docs/introduction">Introduction</a>
                <span class="text-muted-foreground"> — what shadcn-htmx is, in one page.</span>
              </li>
              <li>
                <a class="font-medium text-foreground underline underline-offset-4" href="/docs/cli">The CLI</a>
                <span class="text-muted-foreground"> — pick a flavour and add your first component.</span>
              </li>
              <li>
                <a class="font-medium text-foreground underline underline-offset-4" href="/docs/button">Browse components</a>
                <span class="text-muted-foreground"> — 82 of them, every flavour.</span>
              </li>
            </ul>
          </section>
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  ),
)
