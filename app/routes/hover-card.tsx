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
import { InstallPanel } from "@/app/components/install-panel"
import { HOVER_CARD_PROPS } from "@/app/data/api-rows"
import { HoverCard, HoverCardTrigger } from "@/registry/ui/hover-card"
import { Avatar } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"

export const hoverCardRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/hover-card.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/hover-card.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/hover-card.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/hover_card.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/hover-card.html"), "utf8"),
])

const usageJsx = `import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card"

<HoverCardTrigger cardFor="user-card" href="/u/productdevbook" class="font-medium underline">
  @productdevbook
</HoverCardTrigger>

<HoverCard id="user-card">
  <p>Card body — links and buttons are allowed here.</p>
</HoverCard>`

const usageJinja = `{% from "components/hover-card.html" import hover_card_trigger, hover_card_open, hover_card_close %}

{{ hover_card_trigger("@productdevbook", card_for="user-card", href="/u/productdevbook", class_="font-medium underline") }}

{% call hover_card_open(id="user-card") %}
  <p>Card body — links and buttons are allowed here.</p>
{% endcall %}`

const usageGo = `{{template "hover_card_trigger" (dict "Label" "@productdevbook" "CardFor" "user-card" "Href" "/u/productdevbook" "Class" "font-medium underline")}}

{{template "hover_card" (dict "ID" "user-card" "Body" (htmlSafe \`<p>Card body — links and buttons are allowed here.</p>\`))}}`

const usagePhoenix = `<.hover_card_trigger card_for="user-card" href="/u/productdevbook" class="font-medium underline">
  @productdevbook
</.hover_card_trigger>

<.hover_card id="user-card">
  <p>Card body — links and buttons are allowed here.</p>
</.hover_card>`

const usageHtml = `<a href="/u/productdevbook" interestfor="user-card" data-slot="hover-card-trigger"
   class="font-medium text-primary underline-offset-4 hover:underline">@productdevbook</a>

<div id="user-card" popover="hint" data-slot="hover-card" data-side="bottom"
  class="z-50 m-0 w-64 rounded-md border bg-popover p-4 … anchor-hovercard-bottom">
  Card body — links and buttons are allowed here.
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "User preview", nested: true },
  { href: "#ex-side", label: "Placement", nested: true },
  { href: "#ex-lazy", label: "Lazy-loaded", nested: true },
  { href: "#api", label: "API Reference" },
]

hoverCardRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/hover-card.json`

  return page(
    c,
    <Layout title="Hover Card — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/hover-card" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Hover Card</h1>
            <p class="text-muted-foreground">
              A rich preview surface revealed when the user shows interest in a
              trigger — hover, keyboard focus, or long-press. Built on the
              native Popover API{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">interestfor</code>{" "}
              interest invoker plus{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">popover="hint"</code>.
              Unlike Tooltip, it may hold interactive content. Zero JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-hover-card"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/hover-card.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/hover-card.html", source: jinjaSource, note: "Copy hover-card.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/hover-card.tmpl", source: goSource, note: "Add hover-card.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/hover_card.ex", source: phoenixSource, note: "Drop hover_card.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/hover-card.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "User preview — interactive content allowed",
              description:
                "Hover or keyboard-focus the username. The card reveals a profile with a real Follow button. Press ESC to dismiss.",
              narrative: (
                <p>
                  This is the primitive Tooltip explicitly defers to: a preview
                  that may contain links and buttons. The trigger carries{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">interestfor</code>{" "}
                  and the card is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">popover="hint"</code>,
                  so the browser owns the hover / focus reveal, ESC dismissal,
                  and anchor positioning — no state machine, no JavaScript. In
                  browsers without interest invokers the trigger stays a working
                  link and the card simply doesn't appear.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Using interest invokers",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers",
                },
                {
                  source: "MDN",
                  label: "interestfor on <a>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#interestfor",
                },
                {
                  source: "MDN",
                  label: 'popover="hint" state',
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",
                },
              ],
              preview: (
                <div class="flex items-center justify-center py-6 text-sm">
                  <p>
                    Built by{" "}
                    <HoverCardTrigger
                      cardFor="hc-user"
                      href="#"
                      class="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      @productdevbook
                    </HoverCardTrigger>
                    .
                  </p>
                  <HoverCard id="hc-user">
                    <div class="flex gap-3">
                      <Avatar size="lg" fallback="PD" />
                      <div class="space-y-1">
                        <p class="font-semibold">@productdevbook</p>
                        <p class="text-muted-foreground">
                          Building shadcn-htmx. Web standards first.
                        </p>
                        <Button size="xs" class="mt-1">
                          Follow
                        </Button>
                      </div>
                    </div>
                  </HoverCard>
                </div>
              ),
              jsx: `<HoverCardTrigger cardFor="user" href="/u/productdevbook" class="…">
  @productdevbook
</HoverCardTrigger>

<HoverCard id="user">
  <div class="flex gap-3">
    <Avatar size="lg" fallback="PD" />
    <div>
      <p class="font-semibold">@productdevbook</p>
      <p class="text-muted-foreground">Building shadcn-htmx.</p>
      <Button size="xs">Follow</Button>
    </div>
  </div>
</HoverCard>`,
              jinja: `{{ hover_card_trigger("@productdevbook", card_for="user", href="/u/productdevbook", class_="…") }}

{% call hover_card_open(id="user") %}
  <div class="flex gap-3">{{ avatar(size="lg", fallback="PD") }}
    <div><p class="font-semibold">@productdevbook</p>{{ button("Follow", size="xs") }}</div>
  </div>
{% endcall %}`,
              go: `{{template "hover_card_trigger" (dict "Label" "@productdevbook" "CardFor" "user" "Href" "/u/productdevbook" "Class" "…")}}
{{template "hover_card" (dict "ID" "user" "Body" (htmlSafe \`<div class="flex gap-3">…<button>Follow</button></div>\`))}}`,
              phoenix: `<.hover_card_trigger card_for="user" href="/u/productdevbook" class="…">@productdevbook</.hover_card_trigger>
<.hover_card id="user">
  <div class="flex gap-3">
    <.avatar size="lg" fallback="PD" />
    <div><p class="font-semibold">@productdevbook</p><.button size="xs">Follow</.button></div>
  </div>
</.hover_card>`,
            })}

            {await Example({
              id: "ex-side",
              title: "Placement — side hint",
              description:
                "side drives CSS position-area off the implicit anchor (the trigger). Hover the term to see the card open to its right.",
              narrative: (
                <p>
                  Associating a popover with its interest invoker creates an
                  implicit anchor reference, so the card is positioned purely in
                  CSS via{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">position-area</code>{" "}
                  — no JS positioner. Pick the side with the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">side</code>{" "}
                  prop; browsers without anchor support fall back to a centred
                  placement.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "position-area",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/position-area",
                },
              ],
              preview: (
                <div class="flex items-center justify-center py-6 text-sm">
                  <p>
                    The{" "}
                    <HoverCardTrigger
                      cardFor="hc-glossary"
                      href="#"
                      class="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      top layer
                    </HoverCardTrigger>{" "}
                    renders above everything else.
                  </p>
                  <HoverCard id="hc-glossary" side="right">
                    <p class="font-semibold">Top layer</p>
                    <p class="mt-1 text-muted-foreground">
                      A browser-managed layer above the rest of the document.
                      Popovers and modal dialogs render here, free of z-index
                      conflicts.
                    </p>
                  </HoverCard>
                </div>
              ),
              jsx: `<HoverCardTrigger cardFor="glossary" href="#" class="…">top layer</HoverCardTrigger>

<HoverCard id="glossary" side="right">
  <p class="font-semibold">Top layer</p>
  <p class="text-muted-foreground">A browser-managed layer above the document.</p>
</HoverCard>`,
              jinja: `{{ hover_card_trigger("top layer", card_for="glossary", class_="…") }}

{% call hover_card_open(id="glossary", side="right") %}
  <p class="font-semibold">Top layer</p>
{% endcall %}`,
              go: `{{template "hover_card_trigger" (dict "Label" "top layer" "CardFor" "glossary" "Class" "…")}}
{{template "hover_card" (dict "ID" "glossary" "Side" "right" "Body" (htmlSafe \`<p class="font-semibold">Top layer</p>\`))}}`,
              phoenix: `<.hover_card_trigger card_for="glossary" class="…">top layer</.hover_card_trigger>
<.hover_card id="glossary" side="right">
  <p class="font-semibold">Top layer</p>
</.hover_card>`,
            })}

            {await Example({
              id: "ex-lazy",
              title: "Lazy-loaded — fetch the preview on first interest",
              description:
                "The card fetches its body from the server the first time it is revealed, so the page ships no preview markup up front.",
              narrative: (
                <p>
                  Forward htmx attributes onto the card. With{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-trigger="interest once"</code>{" "}
                  the body is fetched from{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-get</code>{" "}
                  the first time the user shows interest — the same native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-sm">interest</code>{" "}
                  event the Popover API fires on the target. Repeat hovers reuse
                  the cached markup.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-get & hx-trigger",
                  href: "https://htmx.org/reference/#attributes",
                },
                {
                  source: "MDN",
                  label: "interest event",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/interest_event",
                },
              ],
              preview: (
                <div class="flex items-center justify-center py-6 text-sm">
                  <p>
                    See the{" "}
                    <HoverCardTrigger
                      cardFor="hc-lazy"
                      href="#"
                      class="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      release notes
                    </HoverCardTrigger>
                    .
                  </p>
                  <HoverCard
                    id="hc-lazy"
                    {...({
                      "hx-get": "/docs/hover-card/preview",
                      "hx-trigger": "interest once",
                      "hx-swap": "innerHTML",
                    } as any)}
                  >
                    <p class="text-muted-foreground">Loading…</p>
                  </HoverCard>
                </div>
              ),
              jsx: `<HoverCardTrigger cardFor="rel" href="#" class="…">release notes</HoverCardTrigger>

<HoverCard id="rel" hx-get="/preview" hx-trigger="interest once" hx-swap="innerHTML">
  <p class="text-muted-foreground">Loading…</p>
</HoverCard>`,
              jinja: `{{ hover_card_trigger("release notes", card_for="rel", class_="…") }}

{% call hover_card_open(id="rel", attrs={"hx_get": "/preview", "hx_trigger": "interest once", "hx_swap": "innerHTML"}) %}
  <p class="text-muted-foreground">Loading…</p>
{% endcall %}`,
              go: `{{template "hover_card_trigger" (dict "Label" "release notes" "CardFor" "rel" "Class" "…")}}
{{template "hover_card" (dict "ID" "rel" "Body" (htmlSafe \`<p hx-get="/preview" hx-trigger="interest once">Loading…</p>\`))}}`,
              phoenix: `<.hover_card_trigger card_for="rel" class="…">release notes</.hover_card_trigger>
<.hover_card id="rel" hx-get="/preview" hx-trigger="interest once" hx-swap="innerHTML">
  <p class="text-muted-foreground">Loading…</p>
</.hover_card>`,
            })}
          </section>

          <ApiTable title="Hover Card" rows={HOVER_CARD_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// Demo endpoint for the lazy-loaded example. Returns the preview body that the
// card swaps in the first time the user shows interest.
hoverCardRoutes.get("/preview", (c) =>
  c.html(
    <div class="space-y-1">
      <p class="font-semibold">v0.4.0 — Hover Card</p>
      <p class="text-muted-foreground">
        Fetched from the server on first interest, then cached by htmx.
      </p>
    </div>,
  ),
)
