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
import { TREEGRID_PROPS } from "@/app/data/api-rows"
import { Treegrid, TreegridRow, TreegridCell } from "@/registry/ui/treegrid"

export const treegridRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/treegrid.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/treegrid.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/treegrid.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/treegrid.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/treegrid.html"), "utf8"),
])

const usageJsx = `import { Treegrid, TreegridRow, TreegridCell } from "@/components/ui/treegrid"

<Treegrid ariaLabel="Inbox" columns={["Subject", "Summary", "Email"]}>
  <TreegridRow level={1} posinset={1} setsize={1} expanded>
    <TreegridCell first level={1} expandable>Treegrids are awesome</TreegridCell>
    <TreegridCell>Want to learn how to use them?</TreegridCell>
    <TreegridCell><a href="mailto:a@b.c">a@b.c</a></TreegridCell>
  </TreegridRow>
  <TreegridRow level={2} posinset={1} setsize={1}>
    <TreegridCell first level={2}>re: Treegrids are awesome</TreegridCell>
    <TreegridCell>I agree</TreegridCell>
    <TreegridCell><a href="mailto:b@c.d">b@c.d</a></TreegridCell>
  </TreegridRow>
</Treegrid>`

const usageJinja = `{% from "components/treegrid.html" import treegrid_open, treegrid_close,
   tg_row_open, tg_row_close, tg_cell, tg_first_cell %}

{{ treegrid_open(["Subject", "Summary", "Email"], aria_label="Inbox") }}
  {{ tg_row_open(level=1, posinset=1, setsize=1, expanded=true) }}
    {{ tg_first_cell("Treegrids are awesome", level=1, expandable=true) }}
    {{ tg_cell("Want to learn how to use them?") }}
    {{ tg_cell('<a href="mailto:a@b.c">a@b.c</a>') }}
  {{ tg_row_close() }}
{{ treegrid_close() }}`

const usageGo = `{{template "treegrid" (dict
  "AriaLabel" "Inbox"
  "Columns" (list "Subject" "Summary" "Email")
  "Body" (htmlSafe \`
    {{template "treegrid_row" (dict "Level" 1 "Posinset" 1 "Setsize" 1
      "HasExpanded" true "Expanded" true "Body" (htmlSafe "…cells…"))}}
  \`))}}`

const usagePhoenix = `<.treegrid aria-label="Inbox" columns={["Subject", "Summary", "Email"]}>
  <.treegrid_row level={1} posinset={1} setsize={1} expanded={true}>
    <.treegrid_cell first level={1} expandable>Treegrids are awesome</.treegrid_cell>
    <.treegrid_cell>Want to learn how to use them?</.treegrid_cell>
    <.treegrid_cell><a href="mailto:a@b.c">a@b.c</a></.treegrid_cell>
  </.treegrid_row>
</.treegrid>`

const usageHtml = `<table role="treegrid" data-slot="treegrid" aria-label="Inbox"
       class="w-full border-collapse text-sm">
  <thead><tr role="row">
    <th role="columnheader" scope="col">Subject</th> …
  </tr></thead>
  <tbody>
    <tr role="row" aria-level="1" aria-posinset="1" aria-setsize="1" aria-expanded="true">
      <td role="gridcell">Treegrids are awesome</td> …
    </tr>
    <tr role="row" aria-level="2" aria-posinset="1" aria-setsize="1">…</tr>
  </tbody>
</table>
<!-- inline boot <script> sets the roving tabindex; site.js owns the keys -->`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Inbox", nested: true },
  { href: "#ex-files", label: "File tree", nested: true },
  { href: "#api", label: "API Reference" },
]

// Inbox hierarchy mirroring the APG example so the keyboard model is familiar.
function InboxPreview() {
  return (
    <Treegrid ariaLabel="Inbox" columns={["Subject", "Summary", "Email"]}>
      <TreegridRow level={1} posinset={1} setsize={1} expanded>
        <TreegridCell first level={1} expandable>Treegrids are awesome</TreegridCell>
        <TreegridCell>Want to learn how to use them?</TreegridCell>
        <TreegridCell>
          <a href="mailto:aaron@thegoogle.rocks" class="underline-offset-4 hover:underline">aaron@thegoogle.rocks</a>
        </TreegridCell>
      </TreegridRow>
      <TreegridRow level={2} posinset={1} setsize={3}>
        <TreegridCell first level={2}>re: Treegrids are awesome</TreegridCell>
        <TreegridCell>I agree, they are the shizzle</TreegridCell>
        <TreegridCell>
          <a href="mailto:joe@blahblahblah.blahblah" class="underline-offset-4 hover:underline">joe@blahblahblah.blahblah</a>
        </TreegridCell>
      </TreegridRow>
      <TreegridRow level={2} posinset={2} setsize={3} expanded={false}>
        <TreegridCell first level={2} expandable>re: Treegrids are awesome</TreegridCell>
        <TreegridCell>They are great for showing a lot of data</TreegridCell>
        <TreegridCell>
          <a href="mailto:billy@dangerous.fish" class="underline-offset-4 hover:underline">billy@dangerous.fish</a>
        </TreegridCell>
      </TreegridRow>
      <TreegridRow level={3} posinset={1} setsize={1} hidden>
        <TreegridCell first level={3}>re: Treegrids are awesome</TreegridCell>
        <TreegridCell>Cool, we needed an example and docs</TreegridCell>
        <TreegridCell>
          <a href="mailto:doris@rufflazydogs.sleep" class="underline-offset-4 hover:underline">doris@rufflazydogs.sleep</a>
        </TreegridCell>
      </TreegridRow>
      <TreegridRow level={2} posinset={3} setsize={3}>
        <TreegridCell first level={2}>re: Treegrids are awesome</TreegridCell>
        <TreegridCell>I hear Fancytree is going to align with this!</TreegridCell>
        <TreegridCell>
          <a href="mailto:someone@please-do-it.company" class="underline-offset-4 hover:underline">someone@please-do-it.company</a>
        </TreegridCell>
      </TreegridRow>
    </Treegrid>
  )
}

// A second hierarchy: a file tree, showing two top-level branches.
function FilesPreview() {
  return (
    <Treegrid ariaLabel="Project files" columns={["Name", "Size", "Modified"]}>
      <TreegridRow level={1} posinset={1} setsize={2} expanded>
        <TreegridCell first level={1} expandable>src</TreegridCell>
        <TreegridCell>—</TreegridCell>
        <TreegridCell>2 days ago</TreegridCell>
      </TreegridRow>
      <TreegridRow level={2} posinset={1} setsize={2}>
        <TreegridCell first level={2}>index.ts</TreegridCell>
        <TreegridCell>1.2 KB</TreegridCell>
        <TreegridCell>2 days ago</TreegridCell>
      </TreegridRow>
      <TreegridRow level={2} posinset={2} setsize={2}>
        <TreegridCell first level={2}>app.ts</TreegridCell>
        <TreegridCell>4.8 KB</TreegridCell>
        <TreegridCell>yesterday</TreegridCell>
      </TreegridRow>
      <TreegridRow level={1} posinset={2} setsize={2} expanded={false}>
        <TreegridCell first level={1} expandable>tests</TreegridCell>
        <TreegridCell>—</TreegridCell>
        <TreegridCell>last week</TreegridCell>
      </TreegridRow>
      <TreegridRow level={2} posinset={1} setsize={1} hidden>
        <TreegridCell first level={2}>smoke.spec.ts</TreegridCell>
        <TreegridCell>3.1 KB</TreegridCell>
        <TreegridCell>last week</TreegridCell>
      </TreegridRow>
    </Treegrid>
  )
}

treegridRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/treegrid.json`
  return page(
    c,
    <Layout title="Treegrid — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/treegrid" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Components</p>
            <h1 class="text-3xl font-bold tracking-tight">Treegrid</h1>
            <p class="text-muted-foreground">
              A hierarchical data grid:{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="treegrid"</code>{" "}
              rows expand and collapse like a tree (
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-expanded</code>
              {" / "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-level</code>
              ) while cells navigate like a grid with the arrow keys.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">Installation</h2>
            <LangTabs
              id="install-treegrid"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/treegrid.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/treegrid.html", source: jinjaSource, note: "Copy treegrid.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/treegrid.tmpl", source: goSource, note: "Add treegrid.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/treegrid.ex", source: phoenixSource, note: "Drop treegrid.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/treegrid.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css plus the shared site.js keyboard contract." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">Examples</h2>

            {await Example({
              id: "ex-basic",
              title: "Inbox — expand/collapse + grid navigation",
              description:
                "Tab into the grid, then: Down/Up move by row, Right expands a collapsed row (or steps into the cells), Left collapses (or returns to the row), Enter toggles. Home/End and Ctrl+Home/Ctrl+End jump.",
              narrative: (
                <p>
                  Rows carry{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-level</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-posinset</code>{" "}
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-setsize</code>. Only{" "}
                  <em>parent</em> rows get{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-expanded</code>{" "}
                  — leaf rows omit it so AT never announces them as empty
                  parents. Collapsed descendants use the native{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hidden</code>{" "}
                  attribute, so they leave both layout and the accessibility
                  tree. Focus is a roving tabindex over the rows.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Treegrid pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/",
                },
                {
                  source: "MDN",
                  label: "treegrid role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/treegrid_role",
                },
              ],
              preview: <InboxPreview />,
              jsx: usageJsx,
              jinja: usageJinja,
              go: usageGo,
              phoenix: usagePhoenix,
            })}

            {await Example({
              id: "ex-files",
              title: "File tree — multiple branches",
              description:
                "Two top-level folders, one expanded and one collapsed. The chevron in the first cell only appears on rows that have children.",
              narrative: (
                <p>
                  The same component renders any hierarchy. Each first cell is
                  indented{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">1rem</code>{" "}
                  per level (from{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">level</code>
                  ), and the chevron renders only when{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">expandable</code>{" "}
                  is set — matching the row's{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-expanded</code>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "hidden attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden",
                },
                {
                  source: "MDN",
                  label: "aria-level",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-level",
                },
              ],
              preview: <FilesPreview />,
              jsx: `<Treegrid ariaLabel="Project files" columns={["Name", "Size", "Modified"]}>
  <TreegridRow level={1} posinset={1} setsize={2} expanded>
    <TreegridCell first level={1} expandable>src</TreegridCell>
    <TreegridCell>—</TreegridCell>
    <TreegridCell>2 days ago</TreegridCell>
  </TreegridRow>
  <TreegridRow level={2} posinset={1} setsize={2}>
    <TreegridCell first level={2}>index.ts</TreegridCell>
    <TreegridCell>1.2 KB</TreegridCell>
    <TreegridCell>2 days ago</TreegridCell>
  </TreegridRow>
</Treegrid>`,
              jinja: `{{ treegrid_open(["Name", "Size", "Modified"], aria_label="Project files") }}
  {{ tg_row_open(level=1, posinset=1, setsize=2, expanded=true) }}
    {{ tg_first_cell("src", level=1, expandable=true) }}
    {{ tg_cell("—") }}{{ tg_cell("2 days ago") }}
  {{ tg_row_close() }}
{{ treegrid_close() }}`,
              go: `{{template "treegrid_row" (dict "Level" 1 "Posinset" 1 "Setsize" 2
  "HasExpanded" true "Expanded" true "Body" (htmlSafe \`…first cell + cells…\`))}}`,
              phoenix: `<.treegrid aria-label="Project files" columns={["Name", "Size", "Modified"]}>
  <.treegrid_row level={1} posinset={1} setsize={2} expanded={true}>
    <.treegrid_cell first level={1} expandable>src</.treegrid_cell>
    <.treegrid_cell>—</.treegrid_cell>
    <.treegrid_cell>2 days ago</.treegrid_cell>
  </.treegrid_row>
</.treegrid>`,
            })}
          </section>

          <ApiTable title="<Treegrid>" rows={TREEGRID_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
