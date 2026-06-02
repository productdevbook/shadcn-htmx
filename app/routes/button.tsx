/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { CodeBlock } from "@/app/components/code-block"
import { LangTabs } from "@/app/components/lang-tabs"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { ApiTable } from "@/app/components/api-table"
import { BUTTON_PROPS } from "@/app/data/api-rows"
import { Button } from "@/registry/ui/button"

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-variants", label: "Variants", nested: true },
  { href: "#ex-sizes", label: "Sizes", nested: true },
  { href: "#ex-disabled", label: "Disabled", nested: true },
  { href: "#ex-toggle", label: "Toggle", nested: true },
  { href: "#ex-htmx", label: "htmx — swap", nested: true },
  { href: "#ex-htmx-slow", label: "htmx — hx-disable", nested: true },
  { href: "#api", label: "API Reference" },
]

export const buttonRoutes = new Hono()

// Source files shown verbatim in the "Manual install" sections below.
// Read once at startup; the registry/ tree is the single source of truth.
const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  cnSource,
  buttonJsxSource,
  buttonJinjaSource,
  buttonGoSource,
  buttonPhoenixSource,
  buttonHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "lib/cn.ts"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "ui/button.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/button.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/button.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/button.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/button.html"), "utf8"),
])

// Usage snippets — what calling the helper looks like in each stack.
const usageJsx = `import { Button } from "@/components/ui/button"

<Button hx-post="/save">Save</Button>`

const usageJinja = `{% from "components/button.html" import button %}

{{ button("Save", hx_post="/save") }}`

const usageGo = `tpl.ExecuteTemplate(w, "button", map[string]any{
    "Label": "Save",
    "Attrs": map[string]string{"hx-post": "/save"},
})`

const usagePhoenix = `alias ShadcnHtmxWeb.Components.Button

<Button.button hx-post="/save">Save</Button.button>`

const usageHtml = `<!-- Paste straight into your page. No template engine needed. -->
<button type="button"
        class="inline-flex items-center justify-center rounded-md bg-primary
               text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 …"
        hx-post="/save" hx-target="#result">
  Save
</button>
<span id="result" aria-live="polite"></span>`

buttonRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/button.json`

  return page(
    c,
    <Layout title="Button — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/button" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
          <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Components
          </p>
          <h1 class="text-3xl font-bold tracking-tight">Button</h1>
          <p class="text-muted-foreground">
            A native{" "}
            <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;button&gt;</code>{" "}
            element with shadcn variants, rendered server-side and ready to
            wire to htmx v4. The long Tailwind classes never appear in your
            source — your template engine renders them for you.
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
            id="install-lang"
            panels={[
              {
                lang: "jsx",
                node: (
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">1. Install via the shadcn CLI</p>
                      <p class="text-xs text-muted-foreground">
                        Installs <code class="rounded bg-muted px-1 py-0.5">components/ui/button.tsx</code>{" "}
                        and <code class="rounded bg-muted px-1 py-0.5">lib/cn.ts</code> into your project.
                      </p>
                      {await CodeBlock({ code: cliCmd, lang: "bash" })}
                    </div>
                    <div class="space-y-2">
                      <p class="text-sm font-medium">2. Use it</p>
                      {await CodeBlock({ code: usageJsx, lang: "tsx", filename: "app/some-page.tsx" })}
                    </div>
                    <details class="group rounded-lg border bg-muted/20">
                      <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                        <span class="inline-flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          Or copy the source manually
                        </span>
                      </summary>
                      <div class="space-y-4 border-t bg-background p-4">
                        {await CodeBlock({ code: buttonJsxSource, lang: "tsx", filename: "components/ui/button.tsx" })}
                        {await CodeBlock({ code: cnSource, lang: "ts", filename: "lib/cn.ts" })}
                      </div>
                    </details>
                  </div>
                ),
              },
              {
                lang: "jinja",
                node: (
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">1. Save the macro</p>
                      <p class="text-xs text-muted-foreground">
                        Copy <code class="rounded bg-muted px-1 py-0.5">button.html</code>{" "}
                        below into your Jinja templates directory (commonly{" "}
                        <code class="rounded bg-muted px-1 py-0.5">templates/components/</code>).
                      </p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-sm font-medium">2. Use it</p>
                      {await CodeBlock({ code: usageJinja, lang: "html", filename: "templates/page.html" })}
                    </div>
                    <details class="group rounded-lg border bg-muted/20">
                      <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                        <span class="inline-flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          Source — button.html
                        </span>
                      </summary>
                      <div class="border-t bg-background p-4">
                        {await CodeBlock({ code: buttonJinjaSource, lang: "html", filename: "templates/components/button.html" })}
                      </div>
                    </details>
                  </div>
                ),
              },
              {
                lang: "go",
                node: (
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">1. Save the template</p>
                      <p class="text-xs text-muted-foreground">
                        Copy <code class="rounded bg-muted px-1 py-0.5">button.tmpl</code>{" "}
                        below into your{" "}
                        <code class="rounded bg-muted px-1 py-0.5">templates/</code> tree and{" "}
                        <code class="rounded bg-muted px-1 py-0.5">ParseFiles</code> it like
                        any other Go template.
                      </p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-sm font-medium">2. Use it</p>
                      {await CodeBlock({ code: usageGo, lang: "html", filename: "handler.go" })}
                    </div>
                    <details class="group rounded-lg border bg-muted/20">
                      <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                        <span class="inline-flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          Source — button.tmpl
                        </span>
                      </summary>
                      <div class="border-t bg-background p-4">
                        {await CodeBlock({ code: buttonGoSource, lang: "html", filename: "templates/components/button.tmpl" })}
                      </div>
                    </details>
                  </div>
                ),
              },
              {
                lang: "phoenix",
                node: (
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">1. Save the component module</p>
                      <p class="text-xs text-muted-foreground">
                        Copy <code class="rounded bg-muted px-1 py-0.5">button.ex</code>{" "}
                        below into{" "}
                        <code class="rounded bg-muted px-1 py-0.5">lib/my_app_web/components/</code>{" "}
                        — it defines a Phoenix function component.
                      </p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-sm font-medium">2. Use it</p>
                      {await CodeBlock({ code: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/live/some_live.html.heex" })}
                    </div>
                    <details class="group rounded-lg border bg-muted/20">
                      <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                        <span class="inline-flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          Source — button.ex
                        </span>
                      </summary>
                      <div class="border-t bg-background p-4">
                        {await CodeBlock({ code: buttonPhoenixSource, lang: "elixir", filename: "lib/my_app_web/components/button.ex" })}
                      </div>
                    </details>
                  </div>
                ),
              },
              {
                lang: "html",
                node: (
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">1. Load Tailwind + htmx</p>
                      <p class="text-xs text-muted-foreground">
                        Drop these into your <code class="rounded bg-muted px-1 py-0.5">&lt;head&gt;</code>{" "}
                        if you don't already have a build pipeline. Tailwind's
                        Play CDN compiles utility classes at runtime — fine for
                        prototypes, swap to a real build for production.
                      </p>
                      {await CodeBlock({
                        code: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<script src="https://unpkg.com/htmx.org@4.0.0/dist/htmx.min.js" defer></script>`,
                        lang: "html",
                        filename: "index.html",
                      })}
                    </div>
                    <div class="space-y-2">
                      <p class="text-sm font-medium">2. Paste the button markup</p>
                      {await CodeBlock({ code: usageHtml, lang: "html", filename: "index.html" })}
                    </div>
                    <details class="group rounded-lg border bg-muted/20">
                      <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
                        <span class="inline-flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform group-open:rotate-90">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          Snippets — variants, sizes, htmx wiring
                        </span>
                      </summary>
                      <div class="border-t bg-background p-4">
                        {await CodeBlock({ code: buttonHtmlSource, lang: "html", filename: "snippets/button.html" })}
                      </div>
                    </details>
                  </div>
                ),
              },
            ]}
          />
        </section>

        <section class="space-y-6">
          <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
            Examples
          </h2>
          <p class="text-sm text-muted-foreground">
            Switch the Code tab between Hono JSX, Jinja2, Go templates, and
            Phoenix to see how each example reads in your template engine.
          </p>

          {await Example({
            id: "ex-variants",
            title: "Variants",
            description:
              "Six built-in variants — same base layout, the colour and emphasis change.",
            narrative: (
              <p>
                Variants encode visual hierarchy.{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">default</code>{" "}
                marks the primary action on the screen;{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">secondary</code>{" "}
                is the polite alternative;{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">destructive</code>{" "}
                signals irreversible work;{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">outline</code>{" "}
                and{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">ghost</code>{" "}
                step back when paired with a stronger sibling;{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">link</code>{" "}
                reads as inline prose. Rule of thumb — one default per screen.
              </p>
            ),
            references: [
              {
                source: "MDN",
                label: "<button> element",
                href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button",
              },
              {
                source: "APG",
                label: "Button pattern",
                href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
              },
            ],
            preview: (
              <div class="flex flex-wrap items-center justify-center gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            ),
            jsx: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`,
            jinja: `{{ button("Default") }}
{{ button("Secondary", variant="secondary") }}
{{ button("Destructive", variant="destructive") }}
{{ button("Outline", variant="outline") }}
{{ button("Ghost", variant="ghost") }}
{{ button("Link", variant="link") }}`,
            go: `{{template "button" (dict "Label" "Default")}}
{{template "button" (dict "Label" "Secondary" "Variant" "secondary")}}
{{template "button" (dict "Label" "Destructive" "Variant" "destructive")}}
{{template "button" (dict "Label" "Outline" "Variant" "outline")}}
{{template "button" (dict "Label" "Ghost" "Variant" "ghost")}}
{{template "button" (dict "Label" "Link" "Variant" "link")}}`,
            phoenix: `<Button.button>Default</Button.button>
<Button.button variant="secondary">Secondary</Button.button>
<Button.button variant="destructive">Destructive</Button.button>
<Button.button variant="outline">Outline</Button.button>
<Button.button variant="ghost">Ghost</Button.button>
<Button.button variant="link">Link</Button.button>`,
          })}

          {await Example({
            id: "ex-sizes",
            title: "Sizes",
            description:
              "Four sizes: sm (32px), default (36px), lg (40px), icon (square 36px).",
            narrative: (
              <p>
                Touch targets matter. WCAG 2.5.5 (AAA) wants 44×44 CSS pixels;
                iOS HIG also says 44pt; Material says 48dp. The 36px default
                is fine in pointer-rich UI (tables, dashboards). On
                touch-first surfaces reach for{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">size="lg"</code>.
                Pair{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">size="icon"</code>{" "}
                with an{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel</code>{" "}
                — the icon alone is invisible to screen readers.
              </p>
            ),
            references: [
              {
                source: "WCAG",
                label: "2.5.5 Target Size (AAA)",
                href: "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html",
              },
              {
                source: "MDN",
                label: "aria-label on <button>",
                href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label",
              },
            ],
            preview: (
              <div class="flex flex-col items-center gap-5">
                <div class="flex flex-wrap items-end justify-center gap-3">
                  <Button size="xs">XS</Button>
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div class="flex flex-wrap items-end justify-center gap-3">
                  <Button size="icon-xs" ariaLabel="Add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Button>
                  <Button size="icon-sm" ariaLabel="Add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Button>
                  <Button size="icon" ariaLabel="Add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Button>
                  <Button size="icon-lg" ariaLabel="Add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Button>
                </div>
              </div>
            ),
            jsx: `// Text sizes
<Button size="xs">XS</Button>
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>

// Icon-only — always pair with ariaLabel
<Button size="icon-xs" ariaLabel="Add"><PlusIcon /></Button>
<Button size="icon-sm" ariaLabel="Add"><PlusIcon /></Button>
<Button size="icon"    ariaLabel="Add"><PlusIcon /></Button>
<Button size="icon-lg" ariaLabel="Add"><PlusIcon /></Button>`,
            jinja: `{{ button("XS",      size="xs") }}
{{ button("Small",   size="sm") }}
{{ button("Default") }}
{{ button("Large",   size="lg") }}`,
            go: `{{template "button" (dict "Label" "XS"      "Size" "xs")}}
{{template "button" (dict "Label" "Small"   "Size" "sm")}}
{{template "button" (dict "Label" "Default")}}
{{template "button" (dict "Label" "Large"   "Size" "lg")}}`,
            phoenix: `<Button.button size="xs">XS</Button.button>
<Button.button size="sm">Small</Button.button>
<Button.button>Default</Button.button>
<Button.button size="lg">Large</Button.button>
<Button.button size="icon" aria-label="Add">
  <.icon name="hero-plus" />
</Button.button>`,
          })}

          {await Example({
            id: "ex-disabled",
            title: "Disabled",
            description:
              "Type a name to enable the Save button. The native disabled attribute removes the button from tab order, blocks clicks, and skips form submission.",
            narrative: (
              <p>
                Reach for the native{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>{" "}
                attribute when the action genuinely cannot proceed (form
                invalid, server unreachable). When you want the button to{" "}
                <em>look</em> disabled but stay reachable — so a screen reader
                user can land on it and hear <em>why</em> it's unavailable —
                use{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-disabled="true"</code>{" "}
                and intercept the click instead.
              </p>
            ),
            references: [
              {
                source: "MDN",
                label: "disabled attribute",
                href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled",
              },
              {
                source: "MDN",
                label: "aria-disabled",
                href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled",
              },
              {
                source: "APG",
                label: "Disabled controls (APG)",
                href: "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols",
              },
            ],
            preview: (
              <form
                data-disable-when-empty
                class="flex w-full max-w-sm flex-col items-stretch gap-3"
                onsubmit="event.preventDefault()"
              >
                <label class="text-xs font-medium" for="ex-disabled-name">
                  Display name
                </label>
                <input
                  id="ex-disabled-name"
                  name="name"
                  type="text"
                  placeholder="Type to enable Save…"
                  class="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <Button disabled type="submit">Save</Button>
              </form>
            ),
            jsx: `// pseudo-React; pressed/disabled come from your state
<Button disabled={name.length === 0} type="submit">
  Save
</Button>`,
            jinja: `{{ button("Save", type="submit", disabled=(name|length == 0)) }}`,
            go: `{{template "button" (dict
  "Label" "Save" "Type" "submit"
  "Disabled" (eq (len .Name) 0)
)}}`,
            phoenix: `<Button.button type="submit" disabled={String.length(@name) == 0}>
  Save
</Button.button>`,
          })}

          {await Example({
            id: "ex-toggle",
            title: "Toggle (aria-pressed)",
            description:
              "Click the button. The label stays \"Mute\"; only aria-pressed flips.",
            narrative: (
              <p>
                A real toggle is one button with a stable label and an
                attribute that carries the state. APG{" "}
                <em>requires</em> the label stay constant — "Mute" / "Mute",
                not "Mute" / "Unmute" — because a screen reader announces the
                label and the state separately. Pair{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed</code>{" "}
                with a visible affordance (icon fill, border, background) so
                sighted users see the state too. Don't put{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-pressed</code>{" "}
                on a non-toggle button — it'll confuse assistive tech.
              </p>
            ),
            references: [
              {
                source: "APG",
                label: "Button (Toggle) pattern",
                href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/examples/button-toggle/",
              },
              {
                source: "MDN",
                label: "aria-pressed",
                href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed",
              },
            ],
            preview: (
              <div
                data-toggle-button
                class="flex flex-col items-center gap-4 text-center"
              >
                <Button variant="outline" pressed={false} ariaLabel="Mute">
                  Mute
                </Button>
                <code
                  data-toggle-state
                  class="rounded-md border bg-background/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  aria-pressed="false"
                </code>
              </div>
            ),
            jsx: `// Reactive in your framework — pass the latest value of \`pressed\`.
<Button variant="outline" pressed={isMuted} ariaLabel="Mute">
  Mute
</Button>`,
            jinja: `{# pressed comes from your view context #}
{{ button("Mute", variant="outline", pressed=is_muted, aria_label="Mute") }}`,
            go: `{{template "button" (dict
  "Label" "Mute" "Variant" "outline"
  "Pressed" (ptr .IsMuted) "AriaLabel" "Mute"
)}}`,
            phoenix: `<Button.button variant="outline" pressed={@is_muted} aria-label="Mute">
  Mute
</Button.button>`,
          })}

          {await Example({
            id: "ex-htmx",
            title: "htmx — fragment swap",
            description:
              "Click. The browser sends a POST, the server replies with HTML, htmx swaps it into the span.",
            narrative: (
              <p>
                The server returns HTML, not JSON.{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-post</code>{" "}
                sends the request,{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                picks the receiver,{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap</code>{" "}
                picks the strategy (
                <code class="rounded bg-muted px-1 py-0.5 text-xs">innerHTML</code>
                ,{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">outerHTML</code>
                ,{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">beforebegin</code>
                , …). The receiver carries{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-live="polite"</code>{" "}
                so screen readers announce the new text automatically — you
                don't have to manually call any focus or announce API.
              </p>
            ),
            references: [
              {
                source: "htmx",
                label: "hx-post",
                href: "https://htmx.org/attributes/hx-post/",
              },
              {
                source: "htmx",
                label: "hx-target",
                href: "https://htmx.org/attributes/hx-target/",
              },
              {
                source: "htmx",
                label: "hx-swap",
                href: "https://htmx.org/attributes/hx-swap/",
              },
              {
                source: "MDN",
                label: "aria-live",
                href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live",
              },
            ],
            preview: (
              <div class="flex flex-wrap items-center justify-center gap-3">
                <Button hx-post="/button/clicked" hx-target="#htmx-out" hx-swap="innerHTML">
                  Click me
                </Button>
                <span id="htmx-out" class="text-sm text-muted-foreground" aria-live="polite">
                  Result will appear here.
                </span>
              </div>
            ),
            jsx: `<Button hx-post="/clicked" hx-target="#out" hx-swap="innerHTML">
  Click me
</Button>
<span id="out" aria-live="polite">Result will appear here.</span>`,
            jinja: `{{ button("Click me",
    hx_post="/clicked", hx_target="#out", hx_swap="innerHTML") }}
<span id="out" aria-live="polite">Result will appear here.</span>`,
            go: `{{template "button" (dict
  "Label" "Click me"
  "Attrs" (dict "hx-post" "/clicked" "hx-target" "#out" "hx-swap" "innerHTML")
)}}
<span id="out" aria-live="polite">Result will appear here.</span>`,
            phoenix: `<Button.button hx-post="/clicked" hx-target="#out" hx-swap="innerHTML">
  Click me
</Button.button>
<span id="out" aria-live="polite">Result will appear here.</span>`,
          })}

          {await Example({
            id: "ex-htmx-slow",
            title: "htmx — slow endpoint (hx-disable)",
            description:
              "The endpoint sleeps for 1.2 s. Click — the button is blocked from repeat submits, the .htmx-request class dims it, then the result lands.",
            narrative: (
              <p>
                Slow endpoints invite double-submits.{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-disable="this"</code>{" "}
                (v4 — the v3 name was{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-disabled-elt</code>
                ) blocks repeats while the request is in flight. htmx also
                adds the{" "}
                <code class="rounded bg-muted px-1 py-0.5 text-xs">.htmx-request</code>{" "}
                class to the trigger for the full lifecycle — our base
                classes pick that up to dim and freeze the button, no extra
                styling needed in your project.
              </p>
            ),
            references: [
              {
                source: "htmx",
                label: "hx-disable",
                href: "https://htmx.org/attributes/hx-disable/",
              },
              {
                source: "htmx",
                label: "Request lifecycle classes",
                href: "https://htmx.org/docs/#request-operations",
              },
            ],
            preview: (
              <div class="flex flex-wrap items-center justify-center gap-3">
                <Button hx-post="/button/slow" hx-target="#slow-out" hx-swap="innerHTML" hx-disable="this">
                  Save
                </Button>
                <span id="slow-out" class="text-sm text-muted-foreground" aria-live="polite">
                  Idle.
                </span>
              </div>
            ),
            jsx: `<Button hx-post="/save" hx-target="#out" hx-disable="this">
  Save
</Button>`,
            jinja: `{{ button("Save",
    hx_post="/save", hx_target="#out", hx_disable="this") }}`,
            go: `{{template "button" (dict
  "Label" "Save"
  "Attrs" (dict "hx-post" "/save" "hx-target" "#out" "hx-disable" "this")
)}}`,
            phoenix: `<Button.button hx-post="/save" hx-target="#out" hx-disable="this">
  Save
</Button.button>`,
          })}
        </section>

          <ApiTable
            title="<Button>"
            caption="All native <button> attributes are forwarded onto the element via ...rest."
            rows={BUTTON_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
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
