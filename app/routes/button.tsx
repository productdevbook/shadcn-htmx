/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { CodeBlock } from "@/app/components/code-block"
import { LangTabs } from "@/app/components/lang-tabs"
import { Button } from "@/registry/ui/button"

export const buttonRoutes = new Hono()

// One-time setup snippets per language: how do you wire the Button helper
// into your project? Examples below just *call* the helper — none of them
// repeat the long class string.
const setupJsx = `// components/ui/button.tsx
// (copy from https://shadcn-htmx.example/r/button.json)
import { Button } from "@/components/ui/button"

<Button hx-post="/save">Save</Button>`

const setupJinja = `{# components/button.html
   (copy from https://shadcn-htmx.example/r/button.json -> files[].jinja) #}
{% from "components/button.html" import button %}

{{ button("Save", hx_post="/save") }}`

const setupGo = `// components/button.tmpl
// (copy from https://shadcn-htmx.example/r/button.json -> files[].go)
tpl.ExecuteTemplate(w, "button", ButtonArgs{
    Label: "Save",
    Attrs: map[string]string{"hx-post": "/save"},
})`

const setupPhoenix = `# lib/my_app_web/components/button.ex
# (copy from https://shadcn-htmx.example/r/button.json -> files[].phoenix)
alias ShadcnHtmx.Components.Button

<Button.button hx-post="/save">Save</Button.button>`

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
            element with shadcn variants, rendered server-side and ready to
            wire to htmx v4. The long Tailwind classes never appear in your
            source — your template engine renders them for you.
          </p>
        </header>

        <section class="space-y-4">
          <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
          <p class="text-sm text-muted-foreground">
            Copy the button helper for your stack into your project. One file,
            no npm package, no build step. Pick your language:
          </p>
          <LangTabs
            id="install-lang"
            panels={[
              {
                lang: "jsx",
                node: await CodeBlock({ code: setupJsx, lang: "tsx", filename: "components/ui/button.tsx" }),
              },
              {
                lang: "jinja",
                node: await CodeBlock({ code: setupJinja, lang: "html", filename: "templates/components/button.html" }),
              },
              {
                lang: "go",
                node: await CodeBlock({ code: setupGo, lang: "html", filename: "main.go + components/button.tmpl" }),
              },
              {
                lang: "phoenix",
                node: await CodeBlock({ code: setupPhoenix, lang: "elixir", filename: "lib/my_app_web/components/button.ex" }),
              },
            ]}
          />
        </section>

        <section class="space-y-6">
          <h2 class="text-xl font-semibold tracking-tight">Examples</h2>
          <p class="text-sm text-muted-foreground">
            Switch the Code tab between Hono JSX, Jinja2, Go templates, and
            Phoenix to see how each example reads in your template engine.
          </p>

          {await Example({
            id: "ex-variants",
            title: "Variants",
            preview: (
              <div class="flex flex-wrap items-center gap-3">
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
            preview: (
              <div class="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" ariaLabel="Add">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Button>
              </div>
            ),
            jsx: `<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" ariaLabel="Add">
  <PlusIcon />
</Button>`,
            jinja: `{{ button("Small", size="sm") }}
{{ button("Default") }}
{{ button("Large", size="lg") }}
{# icon variant: pass the SVG as label or use a slot version #}`,
            go: `{{template "button" (dict "Label" "Small" "Size" "sm")}}
{{template "button" (dict "Label" "Default")}}
{{template "button" (dict "Label" "Large" "Size" "lg")}}`,
            phoenix: `<Button.button size="sm">Small</Button.button>
<Button.button>Default</Button.button>
<Button.button size="lg">Large</Button.button>
<Button.button size="icon" aria-label="Add">
  <.icon name="hero-plus" />
</Button.button>`,
          })}

          {await Example({
            id: "ex-disabled",
            title: "Disabled",
            preview: (
              <div class="flex flex-wrap items-center gap-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled outline</Button>
              </div>
            ),
            jsx: `<Button disabled>Disabled</Button>
<Button variant="outline" disabled>Disabled outline</Button>`,
            jinja: `{{ button("Disabled", disabled=true) }}
{{ button("Disabled outline", variant="outline", disabled=true) }}`,
            go: `{{template "button" (dict "Label" "Disabled" "Disabled" true)}}
{{template "button" (dict "Label" "Disabled outline" "Variant" "outline" "Disabled" true)}}`,
            phoenix: `<Button.button disabled>Disabled</Button.button>
<Button.button variant="outline" disabled>Disabled outline</Button.button>`,
          })}

          {await Example({
            id: "ex-toggle",
            title: "Toggle (aria-pressed)",
            description:
              "APG: a toggle button keeps its label constant across states; aria-pressed reflects on/off.",
            preview: (
              <div class="flex flex-wrap items-center gap-3">
                <Button variant="outline" pressed={false} ariaLabel="Mute">Mute</Button>
                <Button variant="outline" pressed={true} ariaLabel="Mute">Mute</Button>
              </div>
            ),
            jsx: `<Button variant="outline" pressed={false} ariaLabel="Mute">Mute</Button>
<Button variant="outline" pressed={true} ariaLabel="Mute">Mute</Button>`,
            jinja: `{{ button("Mute", variant="outline", pressed=false, aria_label="Mute") }}
{{ button("Mute", variant="outline", pressed=true,  aria_label="Mute") }}`,
            go: `{{template "button" (dict "Label" "Mute" "Variant" "outline" "Pressed" (ptr false) "AriaLabel" "Mute")}}
{{template "button" (dict "Label" "Mute" "Variant" "outline" "Pressed" (ptr true)  "AriaLabel" "Mute")}}`,
            phoenix: `<Button.button variant="outline" pressed={false} aria-label="Mute">Mute</Button.button>
<Button.button variant="outline" pressed={true}  aria-label="Mute">Mute</Button.button>`,
          })}

          {await Example({
            id: "ex-htmx",
            title: "htmx — fragment swap",
            description:
              "Button POSTs, server returns HTML, htmx swaps it into #htmx-out. The live region announces the change to screen readers.",
            preview: (
              <div class="flex flex-wrap items-center gap-3">
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
            title: "htmx — slow endpoint with hx-disable",
            description:
              "hx-disable=\"this\" disables the button while the request is in flight. (In htmx v3 this attribute was named hx-disabled-elt.)",
            preview: (
              <div class="flex flex-wrap items-center gap-3">
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
