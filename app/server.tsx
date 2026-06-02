/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { Layout, page } from "@/app/layout"
import { buttonRoutes } from "@/app/routes/button"
import { inputRoutes } from "@/app/routes/input"
import { labelRoutes } from "@/app/routes/label"
import { checkboxRoutes } from "@/app/routes/checkbox"
import { dialogRoutes } from "@/app/routes/dialog"
import { tabsRoutes } from "@/app/routes/tabs"
import { textareaRoutes } from "@/app/routes/textarea"
import { switchRoutes } from "@/app/routes/switch"
import { radioGroupRoutes } from "@/app/routes/radio-group"
import { selectRoutes } from "@/app/routes/select"
import { cardRoutes } from "@/app/routes/card"
import { badgeRoutes } from "@/app/routes/badge"
import { separatorRoutes } from "@/app/routes/separator"
import { alertRoutes } from "@/app/routes/alert"
import { toastRoutes } from "@/app/routes/toast"
import { tooltipRoutes } from "@/app/routes/tooltip"
import { accordionRoutes } from "@/app/routes/accordion"
import { avatarRoutes } from "@/app/routes/avatar"
import { popoverRoutes } from "@/app/routes/popover"
import { dropdownMenuRoutes } from "@/app/routes/dropdown-menu"
import { progressRoutes } from "@/app/routes/progress"
import { skeletonRoutes } from "@/app/routes/skeleton"
import { sliderRoutes } from "@/app/routes/slider"
import { paginationRoutes } from "@/app/routes/pagination"
import { tableRoutes } from "@/app/routes/table"
import { comboboxRoutes } from "@/app/routes/combobox"

const app = new Hono()

// Default 404 for /favicon.ico so it doesn't show as a noisy console error
// (Chrome requests it automatically when there's no <link rel="icon">).
app.get("/favicon.ico", (c) => c.body(null, 204))

app.use("/styles.css", serveStatic({ path: "./public/styles.css" }))
app.use("/htmx.min.js", serveStatic({ path: "./public/htmx.min.js" }))
app.use("/copy-code.js", serveStatic({ path: "./public/copy-code.js" }))
app.use("/site.js", serveStatic({ path: "./public/site.js" }))
app.use("/r/*", serveStatic({ root: "./public" }))

app.route("/docs/button", buttonRoutes)
app.route("/docs/input", inputRoutes)
app.route("/docs/label", labelRoutes)
app.route("/docs/checkbox", checkboxRoutes)
app.route("/docs/dialog", dialogRoutes)
app.route("/docs/tabs", tabsRoutes)
app.route("/docs/textarea", textareaRoutes)
app.route("/docs/switch", switchRoutes)
app.route("/docs/radio-group", radioGroupRoutes)
app.route("/docs/select", selectRoutes)
app.route("/docs/card", cardRoutes)
app.route("/docs/badge", badgeRoutes)
app.route("/docs/separator", separatorRoutes)
app.route("/docs/alert", alertRoutes)
app.route("/docs/toast", toastRoutes)
app.route("/docs/tooltip", tooltipRoutes)
app.route("/docs/accordion", accordionRoutes)
app.route("/docs/avatar", avatarRoutes)
app.route("/docs/popover", popoverRoutes)
app.route("/docs/dropdown-menu", dropdownMenuRoutes)
app.route("/docs/progress", progressRoutes)
app.route("/docs/skeleton", skeletonRoutes)
app.route("/docs/slider", sliderRoutes)
app.route("/docs/pagination", paginationRoutes)
app.route("/docs/table", tableRoutes)
app.route("/docs/combobox", comboboxRoutes)
// Aliases: each component's docs router also handles its htmx demo endpoints
// (hx-post="/input/validate-email", etc.). Mount under both so the page can
// be browsed at /docs/<name> and the form-action URLs read naturally.
app.route("/button", buttonRoutes)
app.route("/input", inputRoutes)
app.route("/label", labelRoutes)
app.route("/checkbox", checkboxRoutes)
app.route("/dialog", dialogRoutes)
app.route("/tabs", tabsRoutes)
app.route("/textarea", textareaRoutes)
app.route("/switch", switchRoutes)
app.route("/radio-group", radioGroupRoutes)
app.route("/select", selectRoutes)
app.route("/card", cardRoutes)
app.route("/badge", badgeRoutes)
app.route("/separator", separatorRoutes)
app.route("/alert", alertRoutes)
app.route("/toast", toastRoutes)
app.route("/tooltip", tooltipRoutes)
app.route("/accordion", accordionRoutes)
app.route("/avatar", avatarRoutes)
app.route("/popover", popoverRoutes)
app.route("/dropdown-menu", dropdownMenuRoutes)
app.route("/progress", progressRoutes)
app.route("/skeleton", skeletonRoutes)
app.route("/slider", sliderRoutes)
app.route("/pagination", paginationRoutes)
app.route("/table", tableRoutes)
app.route("/combobox", comboboxRoutes)

const SPONSORS_URL = "https://github.com/sponsors/productdevbook"

// Homepage component index. Mirrors the categories in app/components/docs-sidebar.tsx —
// keep the two in sync when a component is added or recategorized.
const COMPONENT_GROUPS: { title: string; items: { label: string; href: string; blurb: string }[] }[] = [
  {
    title: "Forms",
    items: [
      { label: "Button", href: "/docs/button", blurb: "Six variants, four sizes, toggle + htmx hooks." },
      { label: "Input", href: "/docs/input", blurb: "Native types, ARIA-invalid, htmx live search." },
      { label: "Textarea", href: "/docs/textarea", blurb: "Auto-resize via field-sizing, htmx autosave." },
      { label: "Label", href: "/docs/label", blurb: "Click-to-focus, peer-disabled aware." },
      { label: "Checkbox", href: "/docs/checkbox", blurb: "Indeterminate support, peer-checked indicator." },
      { label: "Combobox", href: "/docs/combobox", blurb: "Native datalist + htmx-filtered listbox." },
      { label: "Switch", href: "/docs/switch", blurb: "role=switch pill, save-on-toggle pattern." },
      { label: "Radio Group", href: "/docs/radio-group", blurb: "Arrow-key cycle straight from the platform." },
      { label: "Select", href: "/docs/select", blurb: "Native dropdown, cascading htmx demo." },
      { label: "Slider", href: "/docs/slider", blurb: "Native range, full keyboard contract." },
    ],
  },
  {
    title: "Layout",
    items: [
      { label: "Card", href: "/docs/card", blurb: "Header / Content / Footer slots." },
      { label: "Table", href: "/docs/table", blurb: "Semantic table, sortable via aria-sort." },
    ],
  },
  {
    title: "Display",
    items: [
      { label: "Avatar", href: "/docs/avatar", blurb: "Image with text/icon fallback on 404." },
      { label: "Badge", href: "/docs/badge", blurb: "Six variants; renders span or anchor." },
      { label: "Separator", href: "/docs/separator", blurb: "Decorative or semantic divider." },
    ],
  },
  {
    title: "Feedback",
    items: [
      { label: "Alert", href: "/docs/alert", blurb: "Five variants + live-region politeness." },
      { label: "Progress", href: "/docs/progress", blurb: "role=progressbar, htmx polling demo." },
      { label: "Skeleton", href: "/docs/skeleton", blurb: "role=status placeholder, outerHTML swap." },
      { label: "Toast", href: "/docs/toast", blurb: "Server-driven via htmx beforeend swap." },
    ],
  },
  {
    title: "Overlays",
    items: [
      { label: "Dialog", href: "/docs/dialog", blurb: "Native <dialog>: focus trap, ESC, backdrop." },
      { label: "Dropdown Menu", href: "/docs/dropdown-menu", blurb: "Popover API + APG menu keyboard contract." },
      { label: "Popover", href: "/docs/popover", blurb: "Native Popover API, light dismiss + ESC." },
      { label: "Tooltip", href: "/docs/tooltip", blurb: "CSS hover/focus reveal, ESC to dismiss." },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Accordion", href: "/docs/accordion", blurb: "Native details/summary, exclusive via name." },
      { label: "Pagination", href: "/docs/pagination", blurb: "nav landmark, aria-current on active page." },
      { label: "Tabs", href: "/docs/tabs", blurb: "role=tab, arrow / Home / End contract." },
    ],
  },
]

app.get("/", (c) =>
  page(
    c,
    <Layout title="shadcn-htmx — shadcn for htmx v4 + Tailwind v4">
      <main>
        {/* Hero */}
        <section class="border-b">
          <div class="mx-auto max-w-5xl px-6 pt-20 pb-24">
            <div class="mx-auto max-w-3xl space-y-6 text-center">
              <a
                href="https://github.com/productdevbook/shadcn-htmx"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
              >
                <span class="size-1.5 rounded-full bg-green-500" aria-hidden="true" />
                <span>htmx v4 — early preview</span>
                <span aria-hidden="true">→</span>
              </a>
              <h1 class="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                shadcn-style components,{" "}
                <span class="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400">
                  for the server.
                </span>
              </h1>
              <p class="mx-auto max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
                A web-standards component library for htmx v4 + Tailwind v4. One source of
                truth — five flavours: Hono JSX, Jinja2, Go templates, Phoenix, and raw
                HTML. Copy what you need, ship in any stack.
              </p>
              <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="/docs/button"
                  class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                >
                  Get started
                </a>
                <a
                  href="https://github.com/productdevbook/shadcn-htmx"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-6 text-sm font-medium shadow-xs transition-colors hover:bg-accent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-4"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.86.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" class="border-b">
          <div class="mx-auto max-w-5xl px-6 py-20">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article class="rounded-xl border bg-card p-6">
                <div class="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold">Web standards first</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">
                  Real <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;button&gt;</code>, real{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed</code>, real focus
                  management. No reinventing what the platform already ships.
                </p>
              </article>
              <article class="rounded-xl border bg-card p-6">
                <div class="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold">Five flavours, one design</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">
                  Hono JSX, Jinja2, Go templates, Phoenix function components, and a
                  raw HTML snippet — all generated from the same source of truth.
                </p>
              </article>
              <article class="rounded-xl border bg-card p-6">
                <div class="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold">Copy, CLI, or curl</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">
                  Install via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">npx shadcn add</code>,
                  curl the source file straight into your templates folder, or
                  copy-paste the snippet. Your code, your style.
                </p>
              </article>
              <article class="rounded-xl border bg-card p-6">
                <div class="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold">Tailwind v4 native</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">
                  CSS-first config with <code class="rounded bg-muted px-1 py-0.5 text-xs">@theme</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">@utility</code>, and the Oxide
                  engine. No legacy{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">tailwind.config.js</code>.
                </p>
              </article>
              <article class="rounded-xl border bg-card p-6">
                <div class="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold">APG-compliant</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">
                  Each component follows the WAI-ARIA Authoring Practices contract —
                  keyboard interaction, focus management, ARIA roles, all checked
                  against the spec source.
                </p>
              </article>
              <article class="rounded-xl border bg-card p-6">
                <div class="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                    <path d="M14 4h6v6" />
                    <path d="M10 20H4v-6" />
                    <path d="M20 4 10 14" />
                    <path d="M4 20l10-10" />
                  </svg>
                </div>
                <h3 class="text-base font-semibold">htmx v4 attribute set</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">
                  All components type the v4 attribute set —{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-disable</code>,
                  the renamed swap modifiers, the new request lifecycle hooks.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Components index */}
        <section id="components" class="border-b">
          <div class="mx-auto max-w-5xl px-6 py-20">
            <div class="mb-10 max-w-2xl space-y-2">
              <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Components
              </p>
              <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
                Twenty-six components. Every one, every flavour.
              </h2>
              <p class="text-sm text-muted-foreground">
                Each ships with the same install, live examples, and source view
                across all five frameworks — Hono JSX, Jinja2, Go templates,
                Phoenix, and raw HTML.
              </p>
            </div>
            <div class="space-y-12">
              {COMPONENT_GROUPS.map((group) => (
                <div>
                  <h3 class="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {group.title}
                  </h3>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => (
                      <a
                        href={item.href}
                        class="group flex items-start justify-between gap-3 rounded-xl border bg-card p-5 transition-colors hover:bg-accent/40"
                      >
                        <div>
                          <h4 class="font-semibold">{item.label}</h4>
                          <p class="mt-1 text-sm text-muted-foreground">{item.blurb}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section class="border-b">
          <div class="mx-auto max-w-5xl px-6 py-20">
            <div class="mb-10 max-w-2xl space-y-2">
              <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Sponsors
              </p>
              <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
                Backed by people who build with this.
              </h2>
              <p class="text-sm text-muted-foreground">
                shadcn-htmx is open source and free to use. Sponsorship pays for
                maintenance time, new components, and keeping the docs current
                with htmx and Tailwind upstream releases.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <a
                  href={SPONSORS_URL}
                  target="_blank"
                  rel="noreferrer"
                  class="flex aspect-square items-center justify-center rounded-xl border border-dashed bg-muted/10 p-4 text-center text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/30 hover:text-foreground"
                  aria-label={`Sponsor slot ${i + 1} — open sponsor page`}
                >
                  Your logo here
                </a>
              ))}
              <a
                href={SPONSORS_URL}
                target="_blank"
                rel="noreferrer"
                class="flex aspect-square flex-col items-center justify-center rounded-xl bg-foreground p-4 text-center text-xs font-semibold text-background transition-opacity hover:opacity-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mb-1.5 size-5" aria-hidden="true">
                  <path d="M12 21.35 10.55 20a132 132 0 0 1-4.95-4.6C2.8 13 1 10.7 1 8.05 1 5.42 3.03 3.4 5.66 3.4c1.49 0 2.91.69 3.84 1.79l.5.59.5-.59A5.04 5.04 0 0 1 14.34 3.4C16.97 3.4 19 5.42 19 8.05c0 2.66-1.8 4.95-4.6 7.35a132 132 0 0 1-4.95 4.6L12 21.35Z" />
                </svg>
                Become a sponsor
              </a>
            </div>
            <div class="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                Already sponsoring? Tag your logo in a PR and we'll ship it on
                the next docs build.
              </p>
              <a
                href={SPONSORS_URL}
                target="_blank"
                rel="noreferrer"
                class="font-medium text-foreground underline underline-offset-4 hover:no-underline"
              >
                github.com/sponsors/productdevbook →
              </a>
            </div>
          </div>
        </section>

        <footer class="border-t bg-background/50">
          <div class="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Built for{" "}
              <a class="underline underline-offset-4" href="https://htmx.org" target="_blank" rel="noreferrer">
                htmx v4
              </a>{" "}
              and{" "}
              <a class="underline underline-offset-4" href="https://tailwindcss.com" target="_blank" rel="noreferrer">
                Tailwind v4
              </a>
              . Open source under MIT.
            </p>
            <p>
              <a class="underline underline-offset-4" href="https://github.com/productdevbook/shadcn-htmx" target="_blank" rel="noreferrer">
                Source on GitHub
              </a>
            </p>
          </div>
        </footer>
      </main>
    </Layout>,
  ),
)

export default {
  port: Number(process.env.PORT ?? 3000),
  hostname: process.env.HOST ?? "127.0.0.1",
  fetch: app.fetch,
}
