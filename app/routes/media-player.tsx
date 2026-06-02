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
import { MEDIA_PLAYER_PROPS } from "@/app/data/api-rows"
import { MediaPlayer } from "@/registry/ui/media-player"

export const mediaPlayerRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] = await Promise.all([
  readFile(resolve(REGISTRY_ROOT, "ui/media-player.tsx"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "jinja2/media-player.html"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "go-templates/media-player.tmpl"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "phoenix/media_player.ex"), "utf8"),
  readFile(resolve(REGISTRY_ROOT, "html/media-player.html"), "utf8"),
])

// A gradient SVG used as the video poster so the docs render with zero
// external network requests (and no broken-image flashes).
const POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='%230f172a'/><stop offset='1' stop-color='%237c3aed'/>` +
      `</linearGradient></defs>` +
      `<rect width='640' height='360' fill='url(%23g)'/>` +
      `<text x='50%' y='50%' fill='white' font-family='sans-serif' font-size='26' ` +
      `text-anchor='middle' dominant-baseline='middle'>Poster — press play</text></svg>`,
  )

// A tiny inline WebVTT captions track (data URI) so the captions button in
// the native control bar has something to toggle, with no external file.
const VTT =
  "data:text/vtt," +
  encodeURIComponent(
    "WEBVTT\n\n00:00.000 --> 00:05.000\nNative captions, toggled from the platform UI.\n",
  )

const usageJsx = `import { MediaPlayer } from "@/components/ui/media-player"

// Video with multiple formats + captions + poster
<MediaPlayer
  poster="/poster.jpg"
  sources={[
    { src: "/clip.webm", type: "video/webm" },
    { src: "/clip.mp4", type: "video/mp4" },
  ]}
  tracks={[{ src: "/clip.en.vtt", kind: "captions", srclang: "en", label: "English", default: true }]}
/>

// Audio — native control bar
<MediaPlayer kind="audio" ariaLabel="Episode 12"
  sources={[{ src: "/episode-12.mp3", type: "audio/mpeg" }]} />`

const usageJinja = `{% from "components/media-player.html" import media_player %}

{% call media_player(
     poster="/poster.jpg",
     sources=[{"src": "/clip.webm", "type": "video/webm"},
              {"src": "/clip.mp4",  "type": "video/mp4"}],
     tracks=[{"src": "/clip.en.vtt", "kind": "captions",
              "srclang": "en", "label": "English", "default": True}]) %}
  <a href="/clip.mp4">Download the video</a>
{% endcall %}`

const usageGo = `{{template "media-player" (dict
  "Poster" "/poster.jpg"
  "Sources" (list (dict "Src" "/clip.webm" "Type" "video/webm")
                  (dict "Src" "/clip.mp4"  "Type" "video/mp4"))
  "Tracks" (list (dict "Src" "/clip.en.vtt" "Kind" "captions"
                       "Srclang" "en" "Label" "English" "Default" true)))}}`

const usagePhoenix = `<.media_player poster="/poster.jpg">
  <:source src="/clip.webm" type="video/webm" />
  <:source src="/clip.mp4" type="video/mp4" />
  <:track src="/clip.en.vtt" kind="captions" srclang="en" label="English" default />
  <a href="/clip.mp4">Download the video</a>
</.media_player>`

const usageHtml = `<div data-slot="media-player" data-kind="video"
     class="group/media-player relative block w-full overflow-hidden rounded-lg border bg-card aspect-video">
  <video data-slot="media-player-media" controls preload="metadata"
         poster="/poster.jpg" class="block size-full bg-black object-contain">
    <source data-slot="media-player-source" src="/clip.webm" type="video/webm">
    <source data-slot="media-player-source" src="/clip.mp4" type="video/mp4">
    <track data-slot="media-player-track" kind="captions" src="/clip.en.vtt"
           srclang="en" label="English" default>
    <a href="/clip.mp4">Download the MP4</a>.
  </video>
</div>`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Video + captions", nested: true },
  { href: "#ex-ratio", label: "Aspect ratio", nested: true },
  { href: "#ex-audio", label: "Audio", nested: true },
  { href: "#api", label: "API Reference" },
]

mediaPlayerRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/media-player.json`

  return page(
    c,
    <Layout title="Media Player — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/media-player" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Media Player</h1>
            <p class="text-muted-foreground">
              A styled native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;video&gt;</code>{" "}
              /{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;audio&gt;</code>{" "}
              with multiple{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;source&gt;</code>{" "}
              formats,{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;track&gt;</code>{" "}
              captions, a poster, and aspect-ratio framing. The browser ships
              the entire accessible playback UI — play, scrub, volume,
              captions, fullscreen, Picture-in-Picture — so there are no custom
              controls and zero JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-media-player"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/media-player.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/media-player.html", source: jinjaSource, note: "Copy media-player.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/media-player.tmpl", source: goSource, note: "Add media-player.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/media_player.ex", source: phoenixSource, note: "Drop media_player.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/media-player.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Video — multiple formats, poster, and captions",
              description:
                "Two <source> encodings let the browser pick the first it can decode; a <track kind=\"captions\"> overlays WebVTT subtitles the native UI can toggle.",
              narrative: (
                <p>
                  This is the real platform{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;video controls&gt;</code>{" "}
                  — every button you see (play, scrubber, volume, captions,
                  fullscreen, PiP) is the browser's own UI, keyboard-operable
                  and labelled by the user agent. The poster shows before the
                  first frame; the captions button appears because there is a{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;track&gt;</code>.
                  No JavaScript runs here.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<video>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video",
                },
                {
                  source: "MDN",
                  label: "<track>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track",
                },
                {
                  source: "WCAG",
                  label: "1.2.2 Captions",
                  href: "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <MediaPlayer
                    poster={POSTER}
                    preload="none"
                    tracks={[{ src: VTT, kind: "captions", srclang: "en", label: "English", default: true }]}
                  >
                    Your browser does not support the video element.
                  </MediaPlayer>
                </div>
              ),
              jsx: `<MediaPlayer
  poster="/poster.jpg"
  sources={[
    { src: "/clip.webm", type: "video/webm" },
    { src: "/clip.mp4", type: "video/mp4" },
  ]}
  tracks={[{ src: "/clip.en.vtt", kind: "captions", srclang: "en", label: "English", default: true }]}
/>`,
              jinja: `{% call media_player(
     poster="/poster.jpg",
     sources=[{"src": "/clip.webm", "type": "video/webm"},
              {"src": "/clip.mp4",  "type": "video/mp4"}],
     tracks=[{"src": "/clip.en.vtt", "kind": "captions",
              "srclang": "en", "label": "English", "default": True}]) %}
  <a href="/clip.mp4">Download the video</a>
{% endcall %}`,
              go: `{{template "media-player" (dict
  "Poster" "/poster.jpg"
  "Sources" (list (dict "Src" "/clip.webm" "Type" "video/webm")
                  (dict "Src" "/clip.mp4"  "Type" "video/mp4"))
  "Tracks" (list (dict "Src" "/clip.en.vtt" "Kind" "captions"
                       "Srclang" "en" "Label" "English" "Default" true)))}}`,
              phoenix: `<.media_player poster="/poster.jpg">
  <:source src="/clip.webm" type="video/webm" />
  <:source src="/clip.mp4" type="video/mp4" />
  <:track src="/clip.en.vtt" kind="captions" srclang="en" label="English" default />
</.media_player>`,
            })}

            {await Example({
              id: "ex-ratio",
              title: "Aspect-ratio framing",
              description:
                "The wrapper carries a native aspect-ratio so the player reserves its space before the media loads — no layout shift. Pass ratio=\"4/3\", \"1/1\", or any w/h.",
              narrative: (
                <p>
                  The frame uses the native CSS{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">aspect-ratio</code>{" "}
                  property (the same mechanism as the Aspect Ratio component),
                  and the video letterboxes inside it with{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">object-contain</code>{" "}
                  so nothing is cropped. Here the frame is{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">4/3</code>.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "aspect-ratio",
                  href: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <MediaPlayer ratio="4/3" poster={POSTER} preload="none">
                    Your browser does not support the video element.
                  </MediaPlayer>
                </div>
              ),
              jsx: `<MediaPlayer ratio="4/3" poster="/poster.jpg"
  sources={[{ src: "/clip.mp4", type: "video/mp4" }]} />`,
              jinja: `{% call media_player(ratio="4/3", poster="/poster.jpg",
     sources=[{"src": "/clip.mp4", "type": "video/mp4"}]) %}{% endcall %}`,
              go: `{{template "media-player" (dict "Ratio" "4/3" "Poster" "/poster.jpg"
  "Sources" (list (dict "Src" "/clip.mp4" "Type" "video/mp4")))}}`,
              phoenix: `<.media_player ratio="4/3" poster="/poster.jpg">
  <:source src="/clip.mp4" type="video/mp4" />
</.media_player>`,
            })}

            {await Example({
              id: "ex-audio",
              title: "Audio — native control bar",
              description:
                "kind=\"audio\" renders <audio controls>: a full-width native control bar with no video frame. Give it an ariaLabel so AT announces what it plays.",
              narrative: (
                <p>
                  For audio the control bar{" "}
                  <em>is</em> the whole UI, so there is no aspect-ratio frame —
                  just a padded card. Because there is no caption track to name
                  the media, pass{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">ariaLabel</code>{" "}
                  so assistive tech announces the episode title.
                </p>
              ),
              references: [
                {
                  source: "MDN",
                  label: "<audio>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio",
                },
                {
                  source: "MDN",
                  label: "<source>",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <MediaPlayer
                    kind="audio"
                    preload="none"
                    ariaLabel="Episode 12 — The Platform Strikes Back"
                  >
                    Your browser does not support the audio element.
                  </MediaPlayer>
                </div>
              ),
              jsx: `<MediaPlayer
  kind="audio"
  ariaLabel="Episode 12 — The Platform Strikes Back"
  sources={[
    { src: "/episode-12.ogg", type: "audio/ogg" },
    { src: "/episode-12.mp3", type: "audio/mpeg" },
  ]}
/>`,
              jinja: `{% call media_player(kind="audio",
     aria_label="Episode 12",
     sources=[{"src": "/episode-12.mp3", "type": "audio/mpeg"}]) %}{% endcall %}`,
              go: `{{template "media-player" (dict "Kind" "audio" "AriaLabel" "Episode 12"
  "Sources" (list (dict "Src" "/episode-12.mp3" "Type" "audio/mpeg")))}}`,
              phoenix: `<.media_player kind="audio" aria_label="Episode 12">
  <:source src="/episode-12.mp3" type="audio/mpeg" />
</.media_player>`,
            })}
          </section>

          <ApiTable title="<MediaPlayer>" rows={MEDIA_PLAYER_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})
