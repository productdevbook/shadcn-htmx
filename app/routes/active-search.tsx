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
import { ACTIVE_SEARCH_PROPS } from "@/app/data/api-rows"
import { ActiveSearch } from "@/registry/ui/active-search"
import { Label } from "@/registry/ui/label"
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

export const activeSearchRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/active-search.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/active-search.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/active-search.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/active_search.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/active-search.html"), "utf8"),
  ])

const usageJsx = `import { ActiveSearch } from "@/components/ui/active-search"

// Debounced live filter → results table. Enter submits a normal GET search
// with no JS; htmx upgrades each keystroke into a debounced fetch and the
// in-flight request is cancelled when the next one fires (hx-sync).
<ActiveSearch
  id="contacts"
  name="q"
  action="/contacts/search"     // no-JS fallback + the htmx GET URL
  placeholder="Search contacts…"
  hx-target="#contact-rows"
  hx-swap="innerHTML"
/>
<table>
  <tbody id="contact-rows"></tbody>
</table>`

const usageJinja = `{% from "components/active-search.html" import active_search %}

{{ active_search(id="contacts", name="q", action="/contacts/search",
                 placeholder="Search contacts…",
                 hx_target="#contact-rows", hx_swap="innerHTML") }}
<table><tbody id="contact-rows"></tbody></table>`

const usageGo = `{{template "active-search" (dict
  "ID" "contacts" "Name" "q" "Action" "/contacts/search"
  "Placeholder" "Search contacts…"
  "HxTarget" "#contact-rows" "HxSwap" "innerHTML")}}
<table><tbody id="contact-rows"></tbody></table>`

const usagePhoenix = `<.active_search id="contacts" name="q" action={~p"/contacts/search"}
  placeholder="Search contacts…"
  hx-target="#contact-rows" hx-swap="innerHTML" />
<table><tbody id="contact-rows"></tbody></table>`

const usageHtml = `<form role="search" action="/contacts/search" method="get" class="relative w-full">
  <input type="search" id="contacts" name="q" placeholder="Search contacts…"
         hx-get="/contacts/search"
         hx-trigger="input changed delay:300ms, search"
         hx-sync="this:replace"
         hx-indicator="#contacts-indicator"
         hx-target="#contact-rows" hx-swap="innerHTML" class="…">
  <span id="contacts-indicator" class="htmx-indicator …" role="status">…</span>
</form>
<table><tbody id="contact-rows"></tbody></table>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Filter a table", nested: true },
  { href: "#ex-cancel", label: "Request cancellation", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- Demo data + helpers ---------------------------------------------------

type Contact = { first: string; last: string; email: string }

const CONTACTS: Contact[] = [
  { first: "Venus", last: "Grimes", email: "venus.grimes@example.com" },
  { first: "Fletcher", last: "Owen", email: "fletcher.owen@example.com" },
  { first: "William", last: "Hale", email: "william.hale@example.com" },
  { first: "TaShya", last: "Cash", email: "tashya.cash@example.com" },
  { first: "Jakeem", last: "Walker", email: "jakeem.walker@example.com" },
  { first: "Malcolm", last: "Trujillo", email: "malcolm.trujillo@example.com" },
  { first: "Wynne", last: "Rice", email: "wynne.rice@example.com" },
  { first: "Evangeline", last: "Mcclain", email: "evangeline.mcclain@example.com" },
  { first: "Bruce", last: "Emerson", email: "bruce.emerson@example.com" },
  { first: "Mufutau", last: "Berg", email: "mufutau.berg@example.com" },
]

function findContacts(query: string): Contact[] {
  const s = query.trim().toLowerCase()
  if (s.length === 0) return CONTACTS
  return CONTACTS.filter(
    (c) =>
      c.first.toLowerCase().includes(s) ||
      c.last.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s),
  )
}

// The <tr> rows an htmx endpoint returns — also used to render the initial
// table body inline so the docs preview isn't empty before the first request.
function ContactRows(props: { contacts: Contact[] }) {
  if (props.contacts.length === 0) {
    return (
      <TableRow>
        <TableCell colspan={3} class="text-center text-muted-foreground">
          No contacts found.
        </TableCell>
      </TableRow>
    )
  }
  return (
    <>
      {props.contacts.map((c) => (
        <TableRow>
          <TableCell class="font-medium">{c.first}</TableCell>
          <TableCell>{c.last}</TableCell>
          <TableCell class="text-muted-foreground">{c.email}</TableCell>
        </TableRow>
      ))}
    </>
  )
}

function ResultsTable(props: { rowsId: string; contacts: Contact[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First name</TableHead>
          <TableHead>Last name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      {/* Raw <tbody> so htmx can target it by id; mirrors TableBody's
          data-slot + last-row border reset. */}
      <tbody
        id={props.rowsId}
        data-slot="table-body"
        class="[&_tr:last-child]:border-0"
      >
        <ContactRows contacts={props.contacts} />
      </tbody>
    </Table>
  )
}

activeSearchRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/active-search.json`

  return page(
    c,
    <Layout title="Active Search — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/active-search" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Active Search</h1>
            <p class="text-muted-foreground">
              A debounced{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;input type="search"&gt;</code>{" "}
              that filters an external results list as you type, with an inline
              loading indicator and stale-request cancellation. It's a real{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;form&gt;</code>
              , so Enter submits a normal search even with JavaScript off.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-active-search"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/active-search.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/active-search.html", source: jinjaSource, note: "Copy active-search.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/active-search.tmpl", source: goSource, note: "Add active-search.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/active_search.ex", source: phoenixSource, note: "Drop active_search.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/active-search.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Filter a table as you type",
              description:
                "Each keystroke (debounced 300ms) fetches matching contacts; the server returns <tr> rows swapped into the table body. The spinner fades in while the request is in flight.",
              narrative: (
                <p>
                  The whole control is a native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;form role="search"&gt;</code>{" "}
                  wrapping{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;input type="search"&gt;</code>
                  . With JS off, Enter submits a plain GET to{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">action</code>{" "}
                  — a shareable, bookmarkable search URL. With htmx on,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-trigger="input changed delay:300ms, search"</code>{" "}
                  debounces typing and the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">search</code>{" "}
                  event re-runs the filter on Enter and when the field is
                  cleared. No custom JS of our own.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: '<input type="search">',
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search",
                },
                {
                  source: "MDN",
                  label: "search event",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/search_event",
                },
                {
                  source: "htmx",
                  label: "hx-trigger (input changed delay)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <Label htmlFor="ex-as-contacts">Search contacts</Label>
                  <ActiveSearch
                    id="ex-as-contacts"
                    name="q"
                    action="/docs/active-search/search"
                    placeholder={`Try "wa" or "example.com"…`}
                    hx-target="#ex-as-rows"
                    hx-swap="innerHTML"
                  />
                  <ResultsTable rowsId="ex-as-rows" contacts={CONTACTS} />
                </div>
              ),
              jsx: `<ActiveSearch id="contacts" name="q"
  action="/contacts/search"
  placeholder="Search contacts…"
  hx-target="#contact-rows" hx-swap="innerHTML" />
<table><tbody id="contact-rows">…</tbody></table>
{/* Server returns <tr> rows for the query. */}`,
              jinja: `{{ active_search(id="contacts", action="/contacts/search",
            placeholder="Search contacts…",
            hx_target="#contact-rows", hx_swap="innerHTML") }}
<table><tbody id="contact-rows"></tbody></table>`,
              go: `{{template "active-search" (dict "ID" "contacts" "Action" "/contacts/search"
  "Placeholder" "Search contacts…"
  "HxTarget" "#contact-rows" "HxSwap" "innerHTML")}}
<table><tbody id="contact-rows"></tbody></table>`,
              phoenix: `<.active_search id="contacts" action={~p"/contacts/search"}
  placeholder="Search contacts…"
  hx-target="#contact-rows" hx-swap="innerHTML" />
<table><tbody id="contact-rows"></tbody></table>`,
            })}

            {await Example({
              id: "ex-cancel",
              title: "Request cancellation (hx-sync)",
              description:
                "When you type faster than the server responds, in-flight requests would otherwise race. hx-sync=\"this:replace\" aborts the previous request so only the latest response lands.",
              narrative: (
                <p>
                  The debounce reduces requests, but once one is in flight a
                  new keystroke would start a second. If the first response
                  arrives last, it clobbers the newer results — a classic
                  search race. The component sets{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-sync="this:replace"</code>{" "}
                  by default, which aborts the in-flight request and replaces
                  it with the latest one. This demo endpoint adds a small
                  artificial delay so the cancellation is observable in the
                  network panel.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-sync",
                  href: "https://htmx.org/attributes/hx-sync/",
                },
                {
                  source: "htmx",
                  label: "Active Search pattern",
                  href: "https://htmx.org/examples/active-search/",
                },
              ],
              preview: (
                <div class="grid w-full max-w-md gap-3">
                  <Label htmlFor="ex-as-slow">Search contacts (slow server)</Label>
                  <ActiveSearch
                    id="ex-as-slow"
                    name="q"
                    action="/docs/active-search/slow-search"
                    placeholder="Type fast — watch the network panel…"
                    hx-target="#ex-as-slow-rows"
                    hx-swap="innerHTML"
                  />
                  <ResultsTable rowsId="ex-as-slow-rows" contacts={CONTACTS} />
                </div>
              ),
              jsx: `// hx-sync="this:replace" is the component default — no extra props.
<ActiveSearch id="contacts" action="/contacts/search"
  hx-target="#contact-rows" hx-swap="innerHTML" />`,
              jinja: `{# hx-sync="this:replace" is applied by the macro automatically #}
{{ active_search(id="contacts", action="/contacts/search",
            hx_target="#contact-rows", hx_swap="innerHTML") }}`,
              go: `{{/* hx-sync="this:replace" is built into the template */}}
{{template "active-search" (dict "ID" "contacts" "Action" "/contacts/search"
  "HxTarget" "#contact-rows" "HxSwap" "innerHTML")}}`,
              phoenix: `<%# hx-sync="this:replace" is applied by the component %>
<.active_search id="contacts" action={~p"/contacts/search"}
  hx-target="#contact-rows" hx-swap="innerHTML" />`,
            })}
          </section>

          <ApiTable title="Active Search" rows={ACTIVE_SEARCH_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// --- htmx demo endpoints --------------------------------------------------
// Return <tr> rows that htmx swaps into the results table body. With JS off,
// the same routes render a full search page would normally — but for the docs
// demo we only need the fragment, since the no-JS path is documented inline.

activeSearchRoutes.get("/search", (c) => {
  const q = c.req.query("q") ?? ""
  return c.html(<ContactRows contacts={findContacts(q)} />)
})

// Same as /search but with a small artificial latency so the hx-sync
// cancellation is observable while typing quickly.
activeSearchRoutes.get("/slow-search", async (c) => {
  const q = c.req.query("q") ?? ""
  await new Promise((r) => setTimeout(r, 350))
  return c.html(<ContactRows contacts={findContacts(q)} />)
})
