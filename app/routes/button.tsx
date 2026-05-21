/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { CodeBlock } from "@/app/components/code-block"
import { Button } from "@/registry/ui/button"

export const buttonRoutes = new Hono()

const installCli = `# Fetch the registry item and write it into your project
curl -fsSL https://shadcn-htmx.example/r/button.json \\
  | jq -r '.files[0].content' \\
  > components/ui/button.tsx

# Don't forget its dependency
curl -fsSL https://shadcn-htmx.example/r/utils.json \\
  | jq -r '.files[0].content' \\
  > lib/cn.ts`

const installManual = `# Copy these two files into your project as-is:
#   registry/ui/button.tsx  →  components/ui/button.tsx
#   registry/lib/cn.ts      →  lib/cn.ts
#
# Make sure your tsconfig has the path alias:
#   "paths": { "@/*": ["./*"] }`

const usageNote = `<!--
  The Code tabs below show the literal HTML our server renders. Paste it into
  your template engine of choice (Jinja2, Go html/template, Twig, ERB, …).
  The .tsx component file under registry/ui/ is only how we author the markup
  on our side — htmx itself doesn't care.
-->`

buttonRoutes.get("/", async (c) => {
  return page(
    c,
    <Layout title="Button — shadcn-htmx">
      <main class="mx-auto max-w-3xl space-y-12 p-8">
        <header class="space-y-3 border-b pb-8">
          <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Components
          </p>
          <h1 class="text-3xl font-bold tracking-tight">Button</h1>
          <p class="text-muted-foreground">
            A native{" "}
            <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button&gt;</code>{" "}
            element styled with Tailwind v4 tokens and wired for htmx v4
            requests. Variants and sizes mirror shadcn/ui's new-york-v4
            Button; behavior follows the WAI-ARIA APG button pattern.
          </p>
        </header>

        <section class="space-y-4">
          <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
          <p class="text-sm text-muted-foreground">
            Copy <code class="rounded bg-muted px-1 py-0.5 text-xs">button.tsx</code> into
            your project. Two paths — pick one.
          </p>
          <div class="space-y-2">
            <h3 class="text-sm font-semibold">From the registry</h3>
            {await CodeBlock({ code: installCli, lang: "bash", filename: "terminal" })}
          </div>
          <div class="space-y-2">
            <h3 class="text-sm font-semibold">Manual copy</h3>
            {await CodeBlock({ code: installManual, lang: "bash", filename: "terminal" })}
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="text-xl font-semibold tracking-tight">Examples</h2>
          {await CodeBlock({ code: usageNote, lang: "html" })}

          {await Example({
            id: "ex-variants",
            title: "Variants",
            children: (
              <div class="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            ),
          })}

          {await Example({
            id: "ex-sizes",
            title: "Sizes",
            children: (
              <div class="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" ariaLabel="Add">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Button>
              </div>
            ),
          })}

          {await Example({
            id: "ex-disabled",
            title: "Disabled",
            children: (
              <div class="flex flex-wrap items-center gap-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled outline
                </Button>
              </div>
            ),
          })}

          {await Example({
            id: "ex-toggle",
            title: "Toggle (aria-pressed)",
            description:
              "APG: a toggle button keeps its label constant across states; aria-pressed reflects on/off.",
            children: (
              <div class="flex flex-wrap items-center gap-3">
                <Button variant="outline" pressed={false} ariaLabel="Mute">
                  Mute
                </Button>
                <Button variant="outline" pressed={true} ariaLabel="Mute">
                  Mute
                </Button>
              </div>
            ),
          })}

          {await Example({
            id: "ex-htmx",
            title: "htmx — fragment swap",
            description:
              "Button POSTs, server returns an HTML fragment, htmx swaps it into #htmx-out. The live region announces the change to screen readers.",
            children: (
              <div class="flex flex-wrap items-center gap-3">
                <Button
                  hx-post="/button/clicked"
                  hx-target="#htmx-out"
                  hx-swap="innerHTML"
                >
                  Click me
                </Button>
                <span
                  id="htmx-out"
                  class="text-sm text-muted-foreground"
                  aria-live="polite"
                >
                  Result will appear here.
                </span>
              </div>
            ),
          })}

          {await Example({
            id: "ex-htmx-slow",
            title: "htmx — slow endpoint with hx-disable",
            description:
              "hx-disable=\"this\" disables the button while the request is in flight. In htmx v3 this was hx-disabled-elt.",
            children: (
              <div class="flex flex-wrap items-center gap-3">
                <Button
                  hx-post="/button/slow"
                  hx-target="#slow-out"
                  hx-swap="innerHTML"
                  hx-disable="this"
                >
                  Save
                </Button>
                <span
                  id="slow-out"
                  class="text-sm text-muted-foreground"
                  aria-live="polite"
                >
                  Idle.
                </span>
              </div>
            ),
          })}
        </section>
      </main>
    </Layout>,
  )
})

buttonRoutes.post("/clicked", (c) =>
  c.html(
    <span class="font-medium text-foreground">
      Clicked at {new Date().toLocaleTimeString()}
    </span>,
  ),
)

buttonRoutes.post("/slow", async (c) => {
  await new Promise((r) => setTimeout(r, 1200))
  return c.html(<span class="font-medium text-foreground">Saved.</span>)
})
