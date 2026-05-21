/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { Layout, page } from "@/app/layout"
import { buttonRoutes } from "@/app/routes/button"

const app = new Hono()

// Default 404 for /favicon.ico so it doesn't show as a noisy console error
// (Chrome requests it automatically when there's no <link rel="icon">).
app.get("/favicon.ico", (c) => c.body(null, 204))

app.use("/styles.css", serveStatic({ path: "./public/styles.css" }))
app.use("/htmx.min.js", serveStatic({ path: "./public/htmx.min.js" }))
app.use("/copy-code.js", serveStatic({ path: "./public/copy-code.js" }))
app.use("/r/*", serveStatic({ root: "./public" }))

app.route("/docs/button", buttonRoutes)
// /button/* alias for the htmx demo endpoints inside buttonRoutes (they use
// hx-post="/button/clicked"). We mount the same router under both so the
// page can be browsed at /docs/button and the form-action URLs read naturally.
app.route("/button", buttonRoutes)

app.get("/", (c) =>
  page(
    c,
    <Layout title="shadcn-htmx">
      <main class="mx-auto max-w-2xl space-y-6 p-8">
        <h1 class="text-3xl font-bold tracking-tight">shadcn-htmx</h1>
        <p class="text-muted-foreground">
          A shadcn-style component library for htmx v4 + Tailwind v4.
        </p>
        <ul class="space-y-1 text-sm">
          <li>
            <a class="underline underline-offset-4" href="/docs/button">
              Button
            </a>
          </li>
        </ul>
      </main>
    </Layout>,
  ),
)

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
}
