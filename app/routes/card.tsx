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
import { CARD_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/registry/ui/card"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { Label } from "@/registry/ui/label"

export const cardRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [
  cardJsxSource,
  cardJinjaSource,
  cardGoSource,
  cardPhoenixSource,
  cardHtmlSource,
] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/card.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/card.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/card.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/card.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/card.html"), "utf8"),
])

const usageJsx = `import { Card, CardHeader, CardTitle, CardDescription,
                  CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Account</CardTitle>
    <CardDescription>Update your settings here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Body content…</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>`

const usageJinja = `{% from "components/card.html" import card_open, card_close,
   card_header_open, card_header_close, card_title, card_description,
   card_content_open, card_content_close,
   card_footer_open, card_footer_close %}

{{ card_open() }}
  {{ card_header_open() }}
    {{ card_title("Account") }}
    {{ card_description("Update your settings here.") }}
  {{ card_header_close() }}
  {{ card_content_open() }}
    <p>Body content…</p>
  {{ card_content_close() }}
  {{ card_footer_open() }}
    <button class="…">Save</button>
  {{ card_footer_close() }}
{{ card_close() }}`

const usageGo = `{{template "card" (dict
  "Title" "Account"
  "Description" "Update your settings here."
  "Content" (htmlSafe \`<p>Body content…</p>\`)
  "Footer"  (htmlSafe \`<button class="…">Save</button>\`)
)}}`

const usagePhoenix = `<.card>
  <.card_header>
    <.card_title>Account</.card_title>
    <.card_description>Update your settings here.</.card_description>
  </.card_header>
  <.card_content>
    <p>Body content…</p>
  </.card_content>
  <.card_footer>
    <button class="…">Save</button>
  </.card_footer>
</.card>`

const usageHtml = `<div data-slot="card" class="flex flex-col gap-6 rounded-xl border
                          bg-card py-6 text-card-foreground shadow-sm">
  <div data-slot="card-header" class="grid gap-2 px-6">
    <div data-slot="card-title" class="leading-none font-semibold">Account</div>
    <div data-slot="card-description" class="text-sm text-muted-foreground">
      Update your settings here.
    </div>
  </div>
  <div data-slot="card-content" class="px-6">…</div>
  <div data-slot="card-footer" class="flex items-center px-6">…</div>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-with-action", label: "Header + action", nested: true },
  { href: "#ex-form", label: "Card-as-form", nested: true },
  { href: "#ex-htmx", label: "htmx — refresh content", nested: true },
  { href: "#api", label: "API Reference" },
]

cardRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/card.json`

  return page(
    c,
    <Layout title="Card — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/card" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Card</h1>
            <p class="text-muted-foreground">
              A rounded container with Header / Title / Description / Action /
              Content / Footer slots. Pure structure — no JS, no interactivity.
              Pair with htmx attributes on the surrounding element when you
              need to refresh the contents server-side.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-card"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/card.tsx", source: cardJsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/card.html", source: cardJinjaSource, note: "Copy card.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/card.tmpl", source: cardGoSource, note: "Add card.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/card.ex", source: cardPhoenixSource, note: "Drop card.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: cardHtmlSource, note: "Tailwind utilities only. No script." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — header + content + footer",
              description:
                "The default Card layout: a stacked column of header (title + description), content body, and footer.",
              narrative: (
                <p>
                  Cards are the workhorse layout primitive — every shadcn
                  surface (settings panel, dashboard tile, login form,
                  product row) is built on top of this primitive. Compose by
                  picking which slots you need; CardHeader / CardContent /
                  CardFooter are all optional siblings of Card.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "Section vs. article semantics",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article",
                },
              ],
              preview: (
                <Card class="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                      Update your account preferences and notification settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-sm text-muted-foreground">
                      Currently subscribed to weekly digests and security
                      alerts.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              ),
              jsx: `<Card>
  <CardHeader>
    <CardTitle>Account</CardTitle>
    <CardDescription>Update your account preferences.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Body content…</p>
  </CardContent>
  <CardFooter>
    <Button>Save changes</Button>
  </CardFooter>
</Card>`,
              jinja: `{{ card_open() }}
  {{ card_header_open() }}
    {{ card_title("Account") }}
    {{ card_description("Update your account preferences.") }}
  {{ card_header_close() }}
  {{ card_content_open() }}…{{ card_content_close() }}
  {{ card_footer_open() }}
    {{ button("Save changes") }}
  {{ card_footer_close() }}
{{ card_close() }}`,
              go: `{{template "card" (dict
  "Title" "Account"
  "Description" "Update your account preferences."
  "Content" (htmlSafe \`…\`)
  "Footer"  (htmlSafe \`{{template "button" (dict "Label" "Save changes")}}\`)
)}}`,
              phoenix: `<.card>
  <.card_header>
    <.card_title>Account</.card_title>
    <.card_description>Update your account preferences.</.card_description>
  </.card_header>
  <.card_content>…</.card_content>
  <.card_footer>
    <.button>Save changes</.button>
  </.card_footer>
</.card>`,
            })}

            {await Example({
              id: "ex-with-action",
              title: "Header + action",
              description:
                "Drop a CardAction inside the CardHeader and the header switches to a two-column grid: title/description on the left, action button on the right.",
              narrative: (
                <p>
                  The CardHeader uses Tailwind's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">has-*</code>{" "}
                  variant — if a CardAction is present anywhere inside, the
                  grid template automatically becomes two columns. No prop
                  toggling required; the layout reacts to its children.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: ":has() pseudo-class",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/:has",
                },
              ],
              preview: (
                <Card class="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Untitled draft</CardTitle>
                    <CardDescription>Last edited 12 minutes ago.</CardDescription>
                    <CardAction>
                      <Button variant="ghost" size="icon-sm" ariaLabel="More">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p class="text-sm text-muted-foreground">3 unread comments.</p>
                  </CardContent>
                </Card>
              ),
              jsx: `<Card>
  <CardHeader>
    <CardTitle>Untitled draft</CardTitle>
    <CardDescription>Last edited 12 minutes ago.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm" ariaLabel="More">
        <MoreIcon />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`,
              jinja: `{{ card_open() }}
  {{ card_header_open() }}
    {{ card_title("Untitled draft") }}
    {{ card_description("Last edited 12 minutes ago.") }}
    {{ card_action_open() }}
      {{ button("⋯", variant="ghost", size="icon-sm", aria_label="More") }}
    {{ card_action_close() }}
  {{ card_header_close() }}
  {{ card_content_open() }}…{{ card_content_close() }}
{{ card_close() }}`,
              go: `{{template "card" (dict
  "Title" "Untitled draft" "Description" "Last edited 12 minutes ago."
  "Action" (htmlSafe \`<button class="…">⋯</button>\`)
  "Content" (htmlSafe \`<p>3 unread comments.</p>\`)
)}}`,
              phoenix: `<.card>
  <.card_header>
    <.card_title>Untitled draft</.card_title>
    <.card_description>Last edited 12 minutes ago.</.card_description>
    <.card_action>
      <.button variant="ghost" size="icon-sm" aria-label="More">⋯</.button>
    </.card_action>
  </.card_header>
  <.card_content>…</.card_content>
</.card>`,
            })}

            {await Example({
              id: "ex-form",
              title: "Card-as-form",
              description:
                "Wrap a real <form> inside the card. The Submit button in the footer triggers the form via the form attribute, so it stays semantically tied even though it lives outside the form element.",
              narrative: (
                <p>
                  Login / signup screens almost always look like a card. The
                  trick:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form id="…"&gt;</code>{" "}
                  for the inputs, then a submit button in the footer with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">form="…"</code>{" "}
                  pointing back. The button can sit outside the form element
                  and still submit it — the platform handles it.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "button form attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form",
                },
              ],
              preview: (
                <Card class="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                      Enter your email below to receive a magic link.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form id="ex-card-form" class="grid gap-3">
                      <div class="grid gap-2">
                        <Label htmlFor="ex-card-email">Email</Label>
                        <Input id="ex-card-email" type="email" name="email" placeholder="you@example.com" />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter class="flex justify-end">
                    <Button type="submit" form="ex-card-form">
                      Send magic link
                    </Button>
                  </CardFooter>
                </Card>
              ),
              jsx: `<Card>
  <CardHeader>
    <CardTitle>Sign in</CardTitle>
    <CardDescription>Enter your email to receive a magic link.</CardDescription>
  </CardHeader>
  <CardContent>
    <form id="signin" class="grid gap-3">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" name="email" />
    </form>
  </CardContent>
  <CardFooter class="flex justify-end">
    <Button type="submit" form="signin">Send magic link</Button>
  </CardFooter>
</Card>`,
              jinja: `{{ card_open() }}
  {{ card_header_open() }}
    {{ card_title("Sign in") }}
    {{ card_description("Enter your email to receive a magic link.") }}
  {{ card_header_close() }}
  {{ card_content_open() }}
    <form id="signin" class="grid gap-3">
      {{ label("Email", for_="email") }}
      {{ input(id="email", type="email", name="email") }}
    </form>
  {{ card_content_close() }}
  {{ card_footer_open(extra_class="flex justify-end") }}
    {{ button("Send magic link", type="submit", form="signin") }}
  {{ card_footer_close() }}
{{ card_close() }}`,
              go: `{{template "card" (dict
  "Title" "Sign in" "Description" "Enter your email to receive a magic link."
  "Content" (htmlSafe \`<form id="signin">…</form>\`)
  "Footer"  (htmlSafe \`{{template "button" (dict "Label" "Send" "Type" "submit" "Form" "signin")}}\`)
)}}`,
              phoenix: `<.card>
  <.card_header>
    <.card_title>Sign in</.card_title>
    <.card_description>Enter your email to receive a magic link.</.card_description>
  </.card_header>
  <.card_content>
    <form id="signin">
      <.label for="email">Email</.label>
      <.input id="email" type="email" name="email" />
    </form>
  </.card_content>
  <.card_footer class="flex justify-end">
    <.button type="submit" form="signin">Send magic link</.button>
  </.card_footer>
</.card>`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — refresh card content",
              description:
                "Click Refresh — htmx GETs /card/recent-activity and swaps the CardContent in place.",
              narrative: (
                <p>
                  Cards are perfect htmx targets because they describe a single
                  unit of UI: refresh the inner content, leave the chrome
                  (header, footer) alone. Use{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-target</code>{" "}
                  pointing at a specific CardContent element to swap just that.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-target",
                  href: "https://htmx.org/attributes/hx-target/",
                },
              ],
              preview: (
                <Card class="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Recent activity</CardTitle>
                    <CardDescription>Latest events in the last 24 h.</CardDescription>
                    <CardAction>
                      <Button
                        variant="outline"
                        size="sm"
                        hx-get="/card/recent-activity"
                        hx-target="#ex-card-activity"
                        hx-swap="innerHTML"
                      >
                        Refresh
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <ul id="ex-card-activity" class="space-y-1 text-sm">
                      <li>Click Refresh to load the latest activity.</li>
                    </ul>
                  </CardContent>
                </Card>
              ),
              jsx: `<Card>
  <CardHeader>
    <CardTitle>Recent activity</CardTitle>
    <CardAction>
      <Button hx-get="/api/activity" hx-target="#activity" hx-swap="innerHTML">
        Refresh
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <ul id="activity">…</ul>
  </CardContent>
</Card>`,
              jinja: `{{ card_open() }}
  {{ card_header_open() }}
    {{ card_title("Recent activity") }}
    {{ card_action_open() }}
      {{ button("Refresh",
                hx_get="/api/activity",
                hx_target="#activity",
                hx_swap="innerHTML") }}
    {{ card_action_close() }}
  {{ card_header_close() }}
  {{ card_content_open() }}
    <ul id="activity">…</ul>
  {{ card_content_close() }}
{{ card_close() }}`,
              go: `{{template "card" (dict
  "Title" "Recent activity"
  "Action" (htmlSafe \`{{template "button" (dict "Label" "Refresh" "Attrs" (dict
    "hx-get" "/api/activity"
    "hx-target" "#activity"
    "hx-swap" "innerHTML"
  ))}}\`)
  "Content" (htmlSafe \`<ul id="activity">…</ul>\`)
)}}`,
              phoenix: `<.card>
  <.card_header>
    <.card_title>Recent activity</.card_title>
    <.card_action>
      <.button hx-get={~p"/api/activity"} hx-target="#activity" hx-swap="innerHTML">
        Refresh
      </.button>
    </.card_action>
  </.card_header>
  <.card_content>
    <ul id="activity">…</ul>
  </.card_content>
</.card>`,
            })}
          </section>
          <ApiTable
            title="<Card>"
            rows={CARD_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

cardRoutes.get("/recent-activity", (c) => {
  const events = [
    "Login from new device",
    "Profile updated",
    "Password changed",
    "Two-factor enabled",
  ]
  return c.html(
    <>
      {events.map((e) => (
        <li>
          • {e} <span class="text-xs text-muted-foreground">at {new Date().toLocaleTimeString()}</span>
        </li>
      ))}
    </>,
  )
})
