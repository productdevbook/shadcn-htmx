/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { Layout, page } from "@/app/layout"
import { Button } from "@/registry/ui/button"

export const buttonRoutes = new Hono()

function Demo(props: { title: string; children: any }) {
  return (
    <section class="space-y-3">
      <h2 class="text-sm font-semibold text-muted-foreground">{props.title}</h2>
      <div class="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-6">
        {props.children}
      </div>
    </section>
  )
}

buttonRoutes.get("/", (c) => {
  return page(
    c,
    <Layout title="Button — shadcn-htmx">
      <main class="mx-auto max-w-3xl space-y-10 p-8">
        <header class="space-y-2">
          <h1 class="text-3xl font-bold tracking-tight">Button</h1>
          <p class="text-muted-foreground">
            A native <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button&gt;</code>{" "}
            element styled with Tailwind v4 tokens and wired for htmx v4
            requests. Variants and sizes mirror shadcn/ui's new-york-v4 Button.
          </p>
        </header>

        <Demo title="Variants">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </Demo>

        <Demo title="Sizes">
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
        </Demo>

        <Demo title="Disabled">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled outline
          </Button>
        </Demo>

        <Demo title="Toggle button (aria-pressed)">
          <Button variant="outline" pressed={false} ariaLabel="Mute">
            Mute
          </Button>
          <Button variant="outline" pressed={true} ariaLabel="Mute">
            Mute
          </Button>
        </Demo>

        <Demo title="htmx request — fragment swap">
          <Button hx-post="/button/clicked" hx-target="#htmx-out" hx-swap="innerHTML">
            Click me
          </Button>
          <span
            id="htmx-out"
            class="text-sm text-muted-foreground"
            aria-live="polite"
          >
            Result will appear here.
          </span>
        </Demo>

        <Demo title="htmx request — slow endpoint (loading affordance)">
          <Button
            hx-post="/button/slow"
            hx-target="#slow-out"
            hx-swap="innerHTML"
            hx-disable="this"
          >
            Save
          </Button>
          <span id="slow-out" class="text-sm text-muted-foreground" aria-live="polite">
            Idle.
          </span>
        </Demo>
      </main>
    </Layout>,
  )
})

// Endpoints used by the htmx demos above.
buttonRoutes.post("/clicked", (c) =>
  c.html(<span class="font-medium text-foreground">Clicked at {new Date().toLocaleTimeString()}</span>)
)

buttonRoutes.post("/slow", async (c) => {
  await new Promise((r) => setTimeout(r, 1200))
  return c.html(<span class="font-medium text-foreground">Saved.</span>)
})
