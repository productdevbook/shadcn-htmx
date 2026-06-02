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
import { TOAST_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Toast, ToastTitle, ToastDescription, ToastViewport, type ToastVariant } from "@/registry/ui/toast"
import { Button } from "@/registry/ui/button"

export const toastRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  toastJsxSource,
  toastJinjaSource,
  toastGoSource,
  toastPhoenixSource,
  toastHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/toast.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/toast.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/toast.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/toast.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/toast.html"), "utf8"),
])

const usageJsx = `// Render the viewport ONCE in your layout:
import { ToastViewport, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

<ToastViewport position="bottom-right" />

// From an htmx endpoint, return a single Toast:
//   hx-target="#toast-viewport"  hx-swap="beforeend"
<Toast variant="success">
  <ToastTitle>Saved</ToastTitle>
  <ToastDescription>Your changes have been recorded.</ToastDescription>
</Toast>`

const usageJinja = `{% from "components/toast.html" import toast_viewport, toast %}

{# In your base layout, once: #}
{{ toast_viewport() }}

{# From an htmx endpoint (hx-target="#toast-viewport" hx-swap="beforeend"): #}
{{ toast(title="Saved", description="Your changes have been recorded.",
         variant="success") }}`

const usageGo = `{{/* In your base layout: */}}
{{template "toast_viewport" (dict)}}

{{/* From an htmx endpoint: */}}
{{template "toast" (dict
  "Title" "Saved"
  "Description" "Your changes have been recorded."
  "Variant" "success"
  "ShowClose" true
)}}`

const usagePhoenix = `# In your root layout:
<.toast_viewport />

# From an endpoint (hx-target="#toast-viewport" hx-swap="beforeend"):
<.toast title="Saved" description="Your changes have been recorded."
        variant="success" />`

const usageHtml = `<!-- Once in layout -->
<ol id="toast-viewport" role="region" aria-label="Notifications" …></ol>

<!-- Server-returned fragment (appended to viewport) -->
<li data-slot="toast" data-variant="success" data-state="open" data-duration="5000"
    role="status" aria-live="polite" aria-atomic="true" class="…">
  …title, description, close button…
</li>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-trigger", label: "Trigger from htmx", nested: true },
  { href: "#ex-variants", label: "Variants", nested: true },
  { href: "#ex-sticky", label: "Sticky (duration=0)", nested: true },
  { href: "#api", label: "API Reference" },
]

toastRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/toast.json`

  return page(
    c,
    <Layout title="Toast — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/toast" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Toast</h1>
            <p class="text-muted-foreground">
              Transient notifications that appear in a fixed-position viewport.
              The htmx-native pattern: render the viewport once, return one
              toast fragment per request, htmx appends, the boot script
              auto-dismisses after a timeout.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-toast"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/toast.tsx", source: toastJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/toast.html", source: toastJinjaSource, note: "Copy toast.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/toast.tmpl", source: toastGoSource, note: "Add toast.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/toast.ex", source: toastPhoenixSource, note: "Drop toast.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: toastHtmlSource, note: "Includes the inline auto-dismiss script — copy once per page." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-trigger",
              title: "Trigger via htmx — server-driven flash",
              description:
                "Click a button — htmx posts, the server returns a Toast fragment, htmx appends it to the viewport, the boot script auto-dismisses after 5 s.",
              narrative: (
                <p>
                  This is the htmx flash pattern. No client-side queue
                  management, no observer; the viewport is just a list and
                  htmx appends to it.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="beforeend"</code>{" "}
                  is the secret sauce — items stack at the end of the list,
                  and the viewport's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">flex-col-reverse</code>{" "}
                  visual order means new toasts appear on top.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-swap (beforeend)",
                  href: "https://htmx.org/attributes/hx-swap/",
                },
                {
                  source: "MDN",
                  label: "MutationObserver",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver",
                },
              ],
              preview: (
                <div class="flex flex-col items-center gap-3">
                  <div class="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      hx-post="/toast/flash?variant=success"
                      hx-target="#ex-toast-viewport"
                      hx-swap="beforeend"
                    >
                      Flash success
                    </Button>
                    <Button
                      variant="outline"
                      hx-post="/toast/flash?variant=info"
                      hx-target="#ex-toast-viewport"
                      hx-swap="beforeend"
                    >
                      Flash info
                    </Button>
                    <Button
                      variant="destructive"
                      hx-post="/toast/flash?variant=destructive&live=assertive"
                      hx-target="#ex-toast-viewport"
                      hx-swap="beforeend"
                    >
                      Flash error
                    </Button>
                  </div>
                  <p class="text-xs text-muted-foreground">
                    Toasts appear in the bottom-right of this docs page.
                  </p>
                </div>
              ),
              jsx: `<Button hx-post="/api/save" hx-target="#toast-viewport" hx-swap="beforeend">
  Save
</Button>

// Server endpoint returns:
<Toast variant="success">
  <ToastTitle>Saved</ToastTitle>
  <ToastDescription>Your changes are stored.</ToastDescription>
</Toast>`,
              jinja: `{{ button("Save",
            hx_post="/api/save",
            hx_target="#toast-viewport",
            hx_swap="beforeend") }}

{# Server endpoint returns: #}
{{ toast(title="Saved", description="Your changes are stored.", variant="success") }}`,
              go: `{{template "button" (dict "Label" "Save" "Attrs" (dict
  "hx-post" "/api/save"
  "hx-target" "#toast-viewport"
  "hx-swap" "beforeend"
))}}

{{/* Server endpoint returns: */}}
{{template "toast" (dict "Title" "Saved" "Description" "Your changes are stored." "Variant" "success")}}`,
              phoenix: `<.button hx-post={~p"/api/save"} hx-target="#toast-viewport" hx-swap="beforeend">
  Save
</.button>

# Server endpoint returns:
<.toast title="Saved" description="Your changes are stored." variant="success" />`,
            })}

            {await Example({
              id: "ex-variants",
              title: "Variants — match the visual to the urgency",
              description:
                "Five visual variants. Pair each with the right live politeness — success/info/default should be polite, destructive often warrants assertive.",
              narrative: (
                <p>
                  Don't make every toast assertive — screen-reader users will
                  hate you. Reserve{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">live="assertive"</code>{" "}
                  for actual errors that the user must hear immediately
                  (save failed, connection lost). Success and info are
                  polite; the AT announces them after the current speech
                  finishes.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aria-live politeness",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live",
                },
              ],
              preview: (
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    hx-post="/toast/flash?variant=default"
                    hx-target="#ex-toast-viewport"
                    hx-swap="beforeend"
                  >
                    default
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    hx-post="/toast/flash?variant=success"
                    hx-target="#ex-toast-viewport"
                    hx-swap="beforeend"
                  >
                    success
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    hx-post="/toast/flash?variant=warning"
                    hx-target="#ex-toast-viewport"
                    hx-swap="beforeend"
                  >
                    warning
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    hx-post="/toast/flash?variant=info"
                    hx-target="#ex-toast-viewport"
                    hx-swap="beforeend"
                  >
                    info
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    hx-post="/toast/flash?variant=destructive&live=assertive"
                    hx-target="#ex-toast-viewport"
                    hx-swap="beforeend"
                  >
                    destructive
                  </Button>
                </div>
              ),
              jsx: `<Toast variant="default">…</Toast>
<Toast variant="success">…</Toast>
<Toast variant="warning">…</Toast>
<Toast variant="info">…</Toast>
<Toast variant="destructive" live="assertive">…</Toast>`,
              jinja: `{{ toast(title="…", variant="default") }}
{{ toast(title="…", variant="success") }}
{{ toast(title="…", variant="warning") }}
{{ toast(title="…", variant="info") }}
{{ toast(title="…", variant="destructive", live="assertive") }}`,
              go: `{{template "toast" (dict "Title" "…" "Variant" "default")}}
{{template "toast" (dict "Title" "…" "Variant" "success")}}
{{template "toast" (dict "Title" "…" "Variant" "warning")}}
{{template "toast" (dict "Title" "…" "Variant" "info")}}
{{template "toast" (dict "Title" "…" "Variant" "destructive" "Live" "assertive")}}`,
              phoenix: `<.toast title="…" variant="default" />
<.toast title="…" variant="success" />
<.toast title="…" variant="warning" />
<.toast title="…" variant="info" />
<.toast title="…" variant="destructive" live="assertive" />`,
            })}

            {await Example({
              id: "ex-sticky",
              title: "Sticky toast — duration=0",
              description:
                "Set duration to 0 and the toast stays put until the user clicks the X. Useful for important confirmations or actionable notices.",
              narrative: (
                <p>
                  Default is 5 s. Set{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">duration={"{"}0{"}"}</code>{" "}
                  when the message is too important to vanish (a server
                  validation summary, a "review your draft" reminder) — the
                  user must dismiss it manually. Pair with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">showClose={"{"}true{"}"}</code>{" "}
                  (the default) so the dismissal action is obvious.
                </p>
              ),
              references: [
                {
                  source: "WCAG",
                  label: "2.2.1 Timing Adjustable",
                  href: "https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html",
                },
              ],
              preview: (
                <div class="flex items-center justify-center">
                  <Button
                    variant="outline"
                    hx-post="/toast/flash?variant=warning&duration=0"
                    hx-target="#ex-toast-viewport"
                    hx-swap="beforeend"
                  >
                    Flash sticky warning
                  </Button>
                </div>
              ),
              jsx: `<Toast variant="warning" duration={0}>
  <ToastTitle>Review draft</ToastTitle>
  <ToastDescription>Has unsaved changes from another tab.</ToastDescription>
</Toast>`,
              jinja: `{{ toast(title="Review draft",
          description="Has unsaved changes from another tab.",
          variant="warning", duration=0) }}`,
              go: `{{template "toast" (dict
  "Title" "Review draft" "Description" "Has unsaved changes from another tab."
  "Variant" "warning" "Duration" 0
)}}`,
              phoenix: `<.toast title="Review draft"
        description="Has unsaved changes from another tab."
        variant="warning" duration={0} />`,
            })}
          </section>

          {/* Demo viewport — sits in the bottom-right corner of this page. */}
          <ToastViewport id="ex-toast-viewport" position="bottom-right" />
          <ApiTable
            title="<Toast>"
            rows={TOAST_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

const MESSAGES: Record<ToastVariant, [string, string]> = {
  default: ["Heads up", "Just so you know."],
  success: ["Saved", "Your changes have been recorded."],
  warning: ["Heads up", "Your trial expires in 3 days."],
  info: ["New feature", "Cmd-K opens the new palette."],
  destructive: ["Save failed", "Couldn't reach the server. Try again."],
}

toastRoutes.post("/flash", async (c) => {
  const variant = (c.req.query("variant") ?? "default") as keyof typeof MESSAGES
  const live = (c.req.query("live") ?? "polite") as "polite" | "assertive"
  const duration = Number(c.req.query("duration") ?? 5000)
  const [title, description] = MESSAGES[variant] ?? MESSAGES.default
  return c.html(
    <Toast variant={variant} live={live} duration={duration}>
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription>{description}</ToastDescription>
    </Toast>,
  )
})
