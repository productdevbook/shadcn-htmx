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
import { AVATAR_PROPS } from "@/app/data/api-rows"
import { InstallPanel } from "@/app/components/install-panel"
import { Avatar, AvatarBadge, AvatarGroup, AvatarGroupCount } from "@/registry/ui/avatar"

export const avatarRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [avJsx, avJinja, avGo, avPhoenix, avHtml] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/avatar.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/avatar.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/avatar.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/avatar.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/avatar.html"), "utf8"),
])

const usageJsx = `import { Avatar } from "@/components/ui/avatar"

<Avatar src="/users/mk.jpg" alt="Mehmet K" fallback="MK" />
<Avatar fallback="MK" ariaLabel="Mehmet K" />`

const usageJinja = `{% from "components/avatar.html" import avatar %}

{{ avatar(src="/users/mk.jpg", alt="Mehmet K", fallback="MK") }}
{{ avatar(fallback="MK", aria_label="Mehmet K") }}`

const usageGo = `{{template "avatar" (dict "Src" "/users/mk.jpg" "Alt" "Mehmet K" "Fallback" "MK")}}`

const usagePhoenix = `<.avatar src={~p"/users/mk.jpg"} alt="Mehmet K" fallback="MK" />`

const usageHtml = `<span data-slot="avatar" data-size="default"
      class="group/avatar relative inline-flex size-8 …">
  <span data-slot="avatar-fallback" class="…">MK</span>
  <img src="/users/mk.jpg" alt="Mehmet K" onerror="this.style.display='none'" class="…">
</span>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-sizes", label: "Sizes", nested: true },
  { href: "#ex-fallback", label: "Fallback behaviour", nested: true },
  { href: "#ex-group", label: "Group + count", nested: true },
  { href: "#api", label: "API Reference" },
]

avatarRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/avatar.json`

  return page(
    c,
    <Layout title="Avatar — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/avatar" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Avatar</h1>
            <p class="text-muted-foreground">
              A round image with text/icon fallback. SSR-friendly: we
              render both layers and let the platform pick the visible
              one — image on top via{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">onerror="this.style.display='none'"</code>{" "}
              reveals the fallback when the URL 404s.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-avatar"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/avatar.tsx", source: avJsx }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/avatar.html", source: avJinja, note: "Copy avatar.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "templates/components/avatar.tmpl", source: avGo, note: "Add avatar.tmpl alongside button.tmpl." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/avatar.ex", source: avPhoenix, note: "Drop avatar.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "index.html", source: avHtml, note: "Tailwind utilities only; inline onerror handler." }) },
              ]}
            />
          </section>

          <section class="space-y-6">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-sizes",
              title: "Sizes — sm, default, lg",
              description:
                "Three sizes; the fallback text scales automatically.",
              narrative: (
                <p>
                  Avatar size is purely a visual concern. Pick{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">sm</code>{" "}
                  for dense lists (comments, mentions), default for headers,
                  and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">lg</code>{" "}
                  for profile-style banner-card placements.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<img> alt attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt",
                },
              ],
              preview: (
                <div class="flex items-center gap-3">
                  <Avatar size="sm" fallback="MK" ariaLabel="Mehmet K" />
                  <Avatar fallback="MK" ariaLabel="Mehmet K" />
                  <Avatar size="lg" fallback="MK" ariaLabel="Mehmet K" />
                </div>
              ),
              jsx: `<Avatar size="sm"      fallback="MK" />
<Avatar                fallback="MK" />
<Avatar size="lg"      fallback="MK" />`,
              jinja: `{{ avatar(fallback="MK", size="sm") }}
{{ avatar(fallback="MK") }}
{{ avatar(fallback="MK", size="lg") }}`,
              go: `{{template "avatar" (dict "Fallback" "MK" "Size" "sm")}}
{{template "avatar" (dict "Fallback" "MK")}}
{{template "avatar" (dict "Fallback" "MK" "Size" "lg")}}`,
              phoenix: `<.avatar size="sm" fallback="MK" />
<.avatar fallback="MK" />
<.avatar size="lg" fallback="MK" />`,
            })}

            {await Example({
              id: "ex-fallback",
              title: "Fallback — works even when src 404s",
              description:
                "Pass a broken URL and the fallback shows through. The inline onerror handler hides the broken img element.",
              narrative: (
                <p>
                  Don't fetch the user's photo on the server to check
                  availability — render the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;img&gt;</code>{" "}
                  and let the browser handle the error. Faster, cheaper, and
                  the platform already has the loading + error state machine
                  for you.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "HTMLImageElement onerror",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/error_event",
                },
              ],
              preview: (
                <div class="flex items-center gap-3">
                  <Avatar src="/this-does-not-exist.jpg" alt="Broken" fallback="??" />
                  <Avatar fallback="MK" ariaLabel="Mehmet K" />
                  <Avatar fallback="DR" ariaLabel="Dr. R" />
                  <Avatar fallback="AB" ariaLabel="A. B" />
                </div>
              ),
              jsx: `<Avatar src="/broken.jpg" alt="…" fallback="??" />
<Avatar fallback="MK" ariaLabel="Mehmet K" />`,
              jinja: `{{ avatar(src="/broken.jpg", alt="…", fallback="??") }}
{{ avatar(fallback="MK", aria_label="Mehmet K") }}`,
              go: `{{template "avatar" (dict "Src" "/broken.jpg" "Alt" "…" "Fallback" "??")}}
{{template "avatar" (dict "Fallback" "MK" "AriaLabel" "Mehmet K")}}`,
              phoenix: `<.avatar src="/broken.jpg" alt="…" fallback="??" />
<.avatar fallback="MK" aria-label="Mehmet K" />`,
            })}

            {await Example({
              id: "ex-group",
              title: "Group — overlapping stack with count",
              description:
                "Wrap avatars in AvatarGroup; the children overlap via negative margin. Append AvatarGroupCount for the \"+N more\" tile.",
              narrative: (
                <p>
                  Common pattern for "people on this thread" or "reviewers
                  of this PR". The container uses{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">-space-x-2</code>{" "}
                  to overlap children, and a ring on each child to separate
                  them visually from neighbours.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<img> + accessible-name semantics",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt",
                },
              ],
              preview: (
                <AvatarGroup>
                  <Avatar fallback="AB" ariaLabel="A. B" />
                  <Avatar fallback="CD" ariaLabel="C. D" />
                  <Avatar fallback="EF" ariaLabel="E. F" />
                  <AvatarGroupCount>+3</AvatarGroupCount>
                </AvatarGroup>
              ),
              jsx: `<AvatarGroup>
  <Avatar fallback="AB" ariaLabel="A. B" />
  <Avatar fallback="CD" ariaLabel="C. D" />
  <Avatar fallback="EF" ariaLabel="E. F" />
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>`,
              jinja: `<div data-slot="avatar-group" class="group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background">
  {{ avatar(fallback="AB") }}
  {{ avatar(fallback="CD") }}
  {{ avatar(fallback="EF") }}
  <div data-slot="avatar-group-count" class="…">+3</div>
</div>`,
              go: `<div data-slot="avatar-group" class="…">
  {{template "avatar" (dict "Fallback" "AB")}}
  {{template "avatar" (dict "Fallback" "CD")}}
  <div data-slot="avatar-group-count" class="…">+3</div>
</div>`,
              phoenix: `<div data-slot="avatar-group" class="…">
  <.avatar fallback="AB" />
  <.avatar fallback="CD" />
  <div data-slot="avatar-group-count">+3</div>
</div>`,
            })}
          </section>
          <ApiTable
            title="<Avatar>"
            rows={AVATAR_PROPS}
          />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
