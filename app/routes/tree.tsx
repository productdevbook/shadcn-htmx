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
import { TREE_PROPS } from "@/app/data/api-rows"
import { Tree, TreeItem, TreeGroup } from "@/registry/ui/tree"

export const treeRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/tree.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/tree.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/tree.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/tree.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/tree.html"), "utf8"),
  ])

const usageJsx = `import { Tree, TreeItem, TreeGroup } from "@/components/ui/tree"

<Tree ariaLabel="File system">
  <TreeItem label="Projects" expanded>
    <TreeGroup>
      <TreeItem label="project-1.docx" />
      <TreeItem label="drafts" parent>
        <TreeGroup>
          <TreeItem label="draft-a.docx" />
        </TreeGroup>
      </TreeItem>
    </TreeGroup>
  </TreeItem>
  <TreeItem label="README.md" />
</Tree>`

const usageJinja = `{% from "components/tree.html" import tree_open, tree_close,
   tree_item_open, tree_item_close, tree_group_open, tree_group_close %}

{{ tree_open(aria_label="File system") }}
  {{ tree_item_open(label="Projects", expanded=true) }}
    {{ tree_group_open() }}
      {{ tree_item_open(label="project-1.docx") }}{{ tree_item_close() }}
    {{ tree_group_close() }}
  {{ tree_item_close() }}
{{ tree_close() }}`

const usageGo = `{{template "tree" (dict
  "AriaLabel" "File system"
  "Body" (htmlSafe \`
    {{template "tree_item" (dict
      "Label" "Projects" "Expanded" true
      "Body" (htmlSafe \`{{template "tree_group" (dict "Body" (htmlSafe \`
        {{template "tree_item" (dict "Label" "project-1.docx")}}
      \`))}}\`)
    )}}\`)
)}}`

const usagePhoenix = `<.tree aria_label="File system">
  <.tree_item label="Projects" expanded>
    <.tree_group>
      <.tree_item label="project-1.docx" />
    </.tree_group>
  </.tree_item>
</.tree>`

const usageHtml = `<ul role="tree" data-slot="tree" aria-label="File system" class="…">
  <li role="treeitem" data-slot="tree-item" tabindex="-1" aria-expanded="true" aria-selected="false">
    <span data-slot="tree-label" class="…"><svg data-slot="tree-chevron" …/> Projects</span>
    <ul role="group" data-slot="tree-group" class="…">
      <li role="treeitem" data-slot="tree-item" tabindex="-1" aria-selected="false">
        <span data-slot="tree-label" class="…">project-1.docx</span>
      </li>
    </ul>
  </li>
</ul>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "File tree", nested: true },
  { href: "#ex-keyboard", label: "Keyboard nav", nested: true },
  { href: "#ex-selection", label: "Selection", nested: true },
  { href: "#api", label: "API Reference" },
]

treeRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/tree.json`

  return page(
    c,
    <Layout title="tree — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/tree" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">tree</h1>
            <p class="text-muted-foreground">
              A hierarchical{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="tree"</code>{" "}
              built from nested{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;ul&gt;</code>/
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;li&gt;</code>{" "}
              lists. Parent nodes carry{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">aria-expanded</code>{" "}
              and hold a nested{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">role="group"</code>;
              the APG keyboard contract and roving tabindex live in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">public/site.js</code>.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-tree"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/tree.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/tree.html", source: jinjaSource, note: "Copy tree.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/tree.tmpl", source: goSource, note: "Add tree.tmpl alongside your other templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/tree.ex", source: phoenixSource, note: "Drop tree.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/tree.html", source: htmlSource, note: "Paste the markup; it relies only on the theme tokens in styles.css. Includes a boot + keyboard script — drop those if you already load site.js." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "File tree — nested groups",
              description:
                "Parent nodes get aria-expanded and contain a <ul role=\"group\">. A closed parent hides its group via a pure-CSS attribute selector — no JS needed to render the collapsed state.",
              narrative: (
                <p>
                  The structure is just nested{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;ul&gt;</code>/
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;li&gt;</code>{" "}
                  lists with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="tree"</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="treeitem"</code>,
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">role="group"</code>.
                  Browsers compute{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-level</code>,{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-setsize</code>,
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aria-posinset</code>{" "}
                  from this DOM nesting, so we don't declare them by hand.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tree View pattern",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/",
                },
                {
                  source: "MDN",
                  label: "tree role",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tree_role",
                },
              ],
              preview: (
                <Tree ariaLabel="File system">
                  <TreeItem label="Projects" expanded>
                    <TreeGroup>
                      <TreeItem label="project-1.docx" />
                      <TreeItem label="project-2.docx" />
                      <TreeItem label="drafts" parent>
                        <TreeGroup>
                          <TreeItem label="draft-a.docx" />
                          <TreeItem label="draft-b.docx" />
                        </TreeGroup>
                      </TreeItem>
                    </TreeGroup>
                  </TreeItem>
                  <TreeItem label="Reports" parent>
                    <TreeGroup>
                      <TreeItem label="q1.pdf" />
                      <TreeItem label="q2.pdf" />
                    </TreeGroup>
                  </TreeItem>
                  <TreeItem label="README.md" />
                </Tree>
              ),
              jsx: `<Tree ariaLabel="File system">
  <TreeItem label="Projects" expanded>
    <TreeGroup>
      <TreeItem label="project-1.docx" />
      <TreeItem label="drafts" parent>
        <TreeGroup>
          <TreeItem label="draft-a.docx" />
        </TreeGroup>
      </TreeItem>
    </TreeGroup>
  </TreeItem>
  <TreeItem label="README.md" />
</Tree>`,
              jinja: `{{ tree_open(aria_label="File system") }}
  {{ tree_item_open(label="Projects", expanded=true) }}
    {{ tree_group_open() }}
      {{ tree_item_open(label="project-1.docx") }}{{ tree_item_close() }}
    {{ tree_group_close() }}
  {{ tree_item_close() }}
{{ tree_close() }}`,
              go: `{{template "tree" (dict "AriaLabel" "File system" "Body" (htmlSafe \`
  {{template "tree_item" (dict "Label" "Projects" "Expanded" true "Body" (htmlSafe \`…\`))}}
\`))}}`,
              phoenix: `<.tree aria_label="File system">
  <.tree_item label="Projects" expanded>
    <.tree_group><.tree_item label="project-1.docx" /></.tree_group>
  </.tree_item>
</.tree>`,
            })}

            {await Example({
              id: "ex-keyboard",
              title: "Keyboard nav — arrows, Home/End, type-ahead",
              description:
                "Tab lands on one node (roving tabindex). Down/Up move between visible nodes; Right expands then steps into the first child; Left collapses then steps to the parent; Home/End jump to first/last; * expands all siblings; typing a letter jumps to the next matching node.",
              narrative: (
                <p>
                  This is the WAI-ARIA APG Tree View keyboard contract verbatim,
                  wired in{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">site.js</code>{" "}
                  on{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">data-slot="tree"</code>.
                  Only one node is in the page tab sequence
                  (<code class="rounded bg-muted px-1 py-0.5 text-xs">tabindex="0"</code>);
                  moving focus rolls that 0 onto the new node so Tab away and
                  back returns where you left off. Because the handler is
                  delegated, htmx-swapped subtrees work without re-init.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tree View — keyboard interaction",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction",
                },
              ],
              preview: (
                <Tree ariaLabel="Keyboard demo">
                  <TreeItem label="Animals" expanded>
                    <TreeGroup>
                      <TreeItem label="Birds" parent>
                        <TreeGroup>
                          <TreeItem label="Finch" />
                          <TreeItem label="Falcon" />
                        </TreeGroup>
                      </TreeItem>
                      <TreeItem label="Mammals" parent>
                        <TreeGroup>
                          <TreeItem label="Otter" />
                          <TreeItem label="Wolf" />
                        </TreeGroup>
                      </TreeItem>
                    </TreeGroup>
                  </TreeItem>
                  <TreeItem label="Plants" parent>
                    <TreeGroup>
                      <TreeItem label="Fern" />
                      <TreeItem label="Moss" />
                    </TreeGroup>
                  </TreeItem>
                </Tree>
              ),
              jsx: `// Keyboard contract is handled by site.js — no extra props.
<Tree ariaLabel="Keyboard demo">…</Tree>`,
              jinja: `{# keyboard nav is wired by site.js #}
{{ tree_open(aria_label="Keyboard demo") }}…{{ tree_close() }}`,
              go: `{{template "tree" (dict "AriaLabel" "Keyboard demo" "Body" (htmlSafe \`…\`))}}`,
              phoenix: `<.tree aria_label="Keyboard demo">…</.tree>`,
            })}

            {await Example({
              id: "ex-selection",
              title: "Selection — aria-selected, with a disabled node",
              description:
                "Single-select trees indicate the chosen node with aria-selected (the selected row gets the primary fill). Clicking or pressing Enter/Space selects. Disabled nodes set aria-disabled and are skipped by interaction.",
              narrative: (
                <p>
                  Selection is distinct from focus — moving focus with the
                  arrows does not change the selected node. Pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">selected</code>{" "}
                  to pre-select the active node on render; the boot state is plain
                  markup so a server (htmx/Phoenix) can drive it.
                </p>
              ),
              references: [
                {
                  source: "APG",
                  label: "Tree View — selection vs focus",
                  href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#wai-ariaroles,states,andproperties",
                },
                {
                  source: "MDN",
                  label: "aria-selected",
                  href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected",
                },
              ],
              preview: (
                <Tree ariaLabel="Selection demo">
                  <TreeItem label="src" expanded>
                    <TreeGroup>
                      <TreeItem label="index.ts" selected />
                      <TreeItem label="server.ts" />
                      <TreeItem label="legacy.ts" disabled />
                    </TreeGroup>
                  </TreeItem>
                  <TreeItem label="package.json" />
                </Tree>
              ),
              jsx: `<Tree ariaLabel="Files">
  <TreeItem label="src" expanded>
    <TreeGroup>
      <TreeItem label="index.ts" selected />
      <TreeItem label="legacy.ts" disabled />
    </TreeGroup>
  </TreeItem>
</Tree>`,
              jinja: `{{ tree_item_open(label="index.ts", selected=true) }}{{ tree_item_close() }}
{{ tree_item_open(label="legacy.ts", disabled=true) }}{{ tree_item_close() }}`,
              go: `{{template "tree_item" (dict "Label" "index.ts" "Selected" true)}}
{{template "tree_item" (dict "Label" "legacy.ts" "Disabled" true)}}`,
              phoenix: `<.tree_item label="index.ts" selected />
<.tree_item label="legacy.ts" disabled />`,
            })}
          </section>

          <ApiTable title="<Tree>" rows={TREE_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
