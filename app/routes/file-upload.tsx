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
import { FILE_UPLOAD_PROPS } from "@/app/data/api-rows"
import { FileUpload } from "@/registry/ui/file-upload"

export const fileUploadRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/file-upload.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/file-upload.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/file-upload.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/file_upload.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/file-upload.html"), "utf8"),
  ])

const usageJsx = `import { FileUpload } from "@/components/ui/file-upload"

<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="outerHTML">
  <FileUpload name="files" accept="image/*" multiple
              hint="PNG, JPG up to 5MB" preserve />
  <button type="submit">Upload</button>
</form>`

const usageJinja = `{% from "components/file-upload.html" import file_upload %}

<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="outerHTML">
  {{ file_upload(name="files", accept="image/*", multiple=true,
                 hint="PNG, JPG up to 5MB", preserve=true) }}
  <button type="submit">Upload</button>
</form>`

const usageGo = `tpl.ExecuteTemplate(w, "file-upload", map[string]any{
    "Name": "files",
    "Accept": "image/*",
    "Multiple": true,
    "Hint": "PNG, JPG up to 5MB",
    "Preserve": true,
})`

const usagePhoenix = `<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="outerHTML">
  <.file_upload name="files" accept="image/*" multiple
    hint="PNG, JPG up to 5MB" preserve />
  <button type="submit">Upload</button>
</form>`

const usageHtml = `<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="outerHTML">
  <div data-slot="file-upload" class="group/file-upload grid w-full gap-3 …">
    <label data-slot="file-upload-zone" class="… border-dashed …">
      <span class="font-medium text-foreground">Drop files here, or click to upload</span>
      <input type="file" data-slot="file-upload-input" name="files"
             accept="image/*" multiple hx-preserve="true"
             class="absolute size-px … [clip:rect(0,0,0,0)]">
    </label>
    <ul data-slot="file-upload-list" class="… empty:hidden" aria-live="polite"></ul>
  </div>
  <button type="submit">Upload</button>
</form>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Basic", nested: true },
  { href: "#ex-multiple", label: "Multiple + preview", nested: true },
  { href: "#ex-htmx", label: "htmx multipart upload", nested: true },
  { href: "#api", label: "API Reference" },
]

fileUploadRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/file-upload.json`

  return page(
    c,
    <Layout title="File Upload — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/file-upload" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">File Upload</h1>
            <p class="text-muted-foreground">
              A styled{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                &lt;label&gt;
              </code>{" "}
              wrapping a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                &lt;input type="file"&gt;
              </code>
              , with drag-and-drop, a filename/preview list, and a native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">
                &lt;progress&gt;
              </code>{" "}
              bar. It submits with a standard multipart POST, so it works in a
              plain form and degrades to a bare picker without JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2
              id="installation"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Installation
            </h2>
            <p class="text-sm text-muted-foreground">
              One file per stack. Use the shadcn CLI for JSX, or copy the
              source for your template engine.
            </p>
            <LangTabs
              id="install-file-upload"
              panels={[
                {
                  lang: "jsx",
                  node: await InstallPanel({
                    cmd: cliCmd,
                    usage: usageJsx,
                    lang: "tsx",
                    filename: "components/ui/file-upload.tsx",
                    source: jsxSource,
                  }),
                },
                {
                  lang: "jinja",
                  node: await InstallPanel({
                    usage: usageJinja,
                    lang: "html",
                    filename: "templates/components/file-upload.html",
                    source: jinjaSource,
                    note: "Copy file-upload.html into templates/components/.",
                  }),
                },
                {
                  lang: "go",
                  node: await InstallPanel({
                    usage: usageGo,
                    lang: "html",
                    filename: "components/file-upload.tmpl",
                    source: goSource,
                    note: "Add file-upload.tmpl alongside your templates.",
                  }),
                },
                {
                  lang: "phoenix",
                  node: await InstallPanel({
                    usage: usagePhoenix,
                    lang: "elixir",
                    filename: "lib/my_app_web/components/file_upload.ex",
                    source: phoenixSource,
                    note: "Drop file_upload.ex into lib/my_app_web/components/.",
                  }),
                },
                {
                  lang: "html",
                  node: await InstallPanel({
                    usage: usageHtml,
                    lang: "html",
                    filename: "snippets/file-upload.html",
                    source: htmlSource,
                    note: "Paste the markup; relies only on theme tokens.",
                  }),
                },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2
              id="examples"
              class="scroll-mt-20 text-xl font-semibold tracking-tight"
            >
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Basic — label-wrapped file input",
              description:
                "A single styled drop zone. The visible <label> wraps a visually-hidden native <input type=\"file\">, so clicking, focus, and the OS picker all come from the platform.",
              narrative: (
                <p>
                  The browser already pairs a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    &lt;label&gt;
                  </code>{" "}
                  with the{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    &lt;input type="file"&gt;
                  </code>{" "}
                  it contains — clicking anywhere on the zone opens the OS file
                  picker, and the input stays the real, focusable, accessible
                  control. We only hide the default file button and restyle the
                  label. The{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">accept</code>{" "}
                  attribute pre-filters the picker; pick the right one rather
                  than validating type in JavaScript.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: '<input type="file">',
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file",
                },
                {
                  source: "MDN",
                  label: "accept (unique file type specifiers)",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept",
                },
              ],
              preview: (
                <div class="w-full max-w-md p-6">
                  <FileUpload
                    id="ex-basic-fu"
                    name="document"
                    accept=".pdf,.doc,.docx"
                    hint="PDF or Word, up to 10MB"
                  />
                </div>
              ),
              jsx: `<FileUpload name="document" accept=".pdf,.doc,.docx"
            hint="PDF or Word, up to 10MB" />`,
              jinja: `{{ file_upload(name="document", accept=".pdf,.doc,.docx",
               hint="PDF or Word, up to 10MB") }}`,
              go: `{{template "file-upload" (dict
  "Name" "document" "Accept" ".pdf,.doc,.docx"
  "Hint" "PDF or Word, up to 10MB")}}`,
              phoenix: `<.file_upload name="document" accept=".pdf,.doc,.docx"
  hint="PDF or Word, up to 10MB" />`,
            })}

            {await Example({
              id: "ex-multiple",
              title: "Multiple files + previews",
              description:
                "multiple lets the user pick or drop several files. site.js lists each selected file (with an image thumbnail when it's a picture) under the zone.",
              narrative: (
                <p>
                  With{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    multiple
                  </code>{" "}
                  the native picker returns a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    FileList
                  </code>
                  ; the drop enhancement reads the same{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    input.files
                  </code>
                  . The list and{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    URL.createObjectURL
                  </code>{" "}
                  thumbnails are pure progressive enhancement — drop is wired on
                  the label per the MDN File drag-and-drop guide, and the same{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    change
                  </code>{" "}
                  handler powers both the picker and the drop.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "File drag and drop",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop",
                },
                {
                  source: "MDN",
                  label: "multiple attribute",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/multiple",
                },
              ],
              preview: (
                <div class="w-full max-w-md p-6">
                  <FileUpload
                    id="ex-multiple-fu"
                    name="photos"
                    accept="image/*"
                    multiple
                    hint="Drop images or click — PNG, JPG, GIF"
                  />
                </div>
              ),
              jsx: `<FileUpload name="photos" accept="image/*" multiple
            hint="Drop images or click — PNG, JPG, GIF" />`,
              jinja: `{{ file_upload(name="photos", accept="image/*", multiple=true,
               hint="Drop images or click — PNG, JPG, GIF") }}`,
              go: `{{template "file-upload" (dict
  "Name" "photos" "Accept" "image/*" "Multiple" true
  "Hint" "Drop images or click — PNG, JPG, GIF")}}`,
              phoenix: `<.file_upload name="photos" accept="image/*" multiple
  hint="Drop images or click — PNG, JPG, GIF" />`,
            })}

            {await Example({
              id: "ex-htmx",
              title: "htmx — multipart upload",
              description:
                "Wrap it in a form with hx-encoding=\"multipart/form-data\" and hx-post. htmx sends the files as FormData; the server returns HTML that swaps in. hx-preserve keeps the selection if the form re-renders with errors.",
              narrative: (
                <p>
                  This is the standard htmx file pattern:{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    hx-encoding="multipart/form-data"
                  </code>{" "}
                  is what turns the request into a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    FormData
                  </code>{" "}
                  POST — required for files. The server owns validation and
                  responds with HTML;{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">
                    hx-preserve
                  </code>{" "}
                  on the input keeps the chosen file across an error
                  re-render, since file inputs otherwise lose their selection
                  on swap. Pick a file below and submit.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "File Upload pattern (hx-encoding, hx-preserve)",
                  href: "https://htmx.org/examples/file-upload/",
                },
                {
                  source: "MDN",
                  label: "FormData",
                  href: "https://developer.mozilla.org/en-US/docs/Web/API/FormData",
                },
              ],
              preview: (
                <div class="w-full max-w-md p-6">
                  <form
                    id="ex-htmx-form"
                    hx-post="/docs/file-upload/upload"
                    hx-encoding="multipart/form-data"
                    hx-target="#ex-htmx-result"
                    hx-swap="innerHTML"
                    class="grid gap-3"
                  >
                    <FileUpload
                      id="ex-htmx-fu"
                      name="file"
                      accept="image/*,.pdf"
                      hint="Any image or PDF"
                      preserve
                    />
                    <button
                      type="submit"
                      class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Upload
                    </button>
                    <p
                      id="ex-htmx-result"
                      class="text-sm text-muted-foreground"
                      aria-live="polite"
                    >
                      No file uploaded yet.
                    </p>
                  </form>
                </div>
              ),
              jsx: `<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="innerHTML">
  <FileUpload name="file" accept="image/*,.pdf" preserve />
  <button type="submit">Upload</button>
  <p id="result" aria-live="polite"></p>
</form>`,
              jinja: `<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="innerHTML">
  {{ file_upload(name="file", accept="image/*,.pdf", preserve=true) }}
  <button type="submit">Upload</button>
  <p id="result" aria-live="polite"></p>
</form>`,
              go: `<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="innerHTML">
  {{template "file-upload" (dict "Name" "file" "Accept" "image/*,.pdf" "Preserve" true)}}
  <button type="submit">Upload</button>
  <p id="result" aria-live="polite"></p>
</form>`,
              phoenix: `<form hx-post="/upload" hx-encoding="multipart/form-data"
      hx-target="#result" hx-swap="innerHTML">
  <.file_upload name="file" accept="image/*,.pdf" preserve />
  <button type="submit">Upload</button>
  <p id="result" aria-live="polite"></p>
</form>`,
            })}
          </section>

          <ApiTable title="<FileUpload>" rows={FILE_UPLOAD_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// ─── htmx endpoint for the live demo ────────────────────────────────

fileUploadRoutes.post("/upload", async (c) => {
  const body = await c.req.parseBody()
  const file = body.file
  if (file instanceof File && file.size > 0) {
    const kb = Math.max(1, Math.round(file.size / 1024))
    return c.html(
      <span class="text-foreground">
        Uploaded <strong>{file.name}</strong> ({kb} KB,{" "}
        {file.type || "unknown type"}).
      </span>,
    )
  }
  return c.html(
    <span class="text-destructive">No file received — choose a file first.</span>,
  )
})
