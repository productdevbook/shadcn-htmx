/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Media Player — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A styled native <video controls> / <audio controls>. The browser ships a
// complete, accessible playback UI — play/pause, scrubber, volume, captions
// toggle, fullscreen, Picture-in-Picture — so we render the real platform
// element and only frame it (rounded card, aspect-ratio, poster). No custom
// controls, no JavaScript: the platform already does playback, and we never
// emulate a feature the browser ships (see AGENTS.md rule 4).
//
// Multiple <source> children let the browser pick the first format it can
// decode (webm → mp4 fallback, etc.); <track kind="captions"> overlays
// WebVTT subtitles/captions the native UI can toggle.
//
// Built on:
//   - <video> — embeds a media player with native controls (play, seek,
//     volume, fullscreen, PiP). `controls`, `poster`, `preload`, `loop`,
//     `muted`, `playsinline`, `crossorigin`, `width`/`height`.
//       repos/mdn/files/en-us/web/html/reference/elements/video/index.md
//   - <audio> — same playback API without a visual frame; the native
//     control bar is the whole UI.
//       repos/mdn/files/en-us/web/html/reference/elements/audio/index.md
//   - <source> — one media resource per format; the browser uses the first
//     it can play. `src` + `type` (MIME, optionally with codecs).
//       repos/mdn/files/en-us/web/html/reference/elements/source/index.md
//   - <track> — timed WebVTT text track (captions/subtitles/descriptions/
//     chapters). `kind`, `src`, `srclang`, `label`, `default`.
//       repos/mdn/files/en-us/web/html/reference/elements/track/index.md
//
// CSS framing reuses the aspect-ratio approach (native `aspect-ratio`, no
// padding hack):
//   repos/mdn/files/en-us/web/css/reference/properties/aspect-ratio/index.md
//
// Accessibility:
//   - Native controls are keyboard-operable and labelled by the user agent.
//   - Provide a <track kind="captions"> for spoken content (WCAG 1.2.2).
//   - When no caption track exists, pass `ariaLabel` so AT announces what
//     the player plays. The text inside the element is the no-support
//     fallback shown to browsers that can't render <video>/<audio>.

export type MediaSource = {
  // URL of the media resource.
  src: string
  // MIME type, optionally with a codecs parameter, e.g. 'video/webm',
  // 'video/mp4; codecs="avc1.42E01E"'. Lets the browser skip formats it
  // can't decode without downloading them.
  type?: string
}

export type MediaTrackKind =
  | "captions"
  | "subtitles"
  | "descriptions"
  | "chapters"
  | "metadata"

export type MediaTrack = {
  // Address of the .vtt WebVTT file (same-origin unless the player carries a
  // crossorigin attribute).
  src: string
  // How the timed text is used. Defaults to "subtitles" per the spec.
  kind?: MediaTrackKind
  // BCP 47 language tag, required when kind is "subtitles".
  srclang?: string
  // Human-readable name shown in the native captions menu.
  label?: string
  // Enable this track by default (at most one per media element).
  default?: boolean
}

export type MediaPlayerKind = "video" | "audio"

const root =
  "group/media-player relative block w-full overflow-hidden rounded-lg border bg-card"

// The media element itself. For video we stretch it to the framed box and
// letterbox with object-contain (cover would crop the picture); audio is a
// full-width native control bar.
const mediaClasses: Record<MediaPlayerKind, string> = {
  video: "block size-full bg-black object-contain",
  audio: "block w-full",
}

// Turn a "w/h" ratio string or number into a Tailwind aspect utility,
// mirroring registry/ui/aspect-ratio.tsx so the two components frame media
// identically.
const NAMED_RATIO: Record<string, string> = {
  "1/1": "aspect-square",
  "16/9": "aspect-video",
}

function ratioClass(ratio: number | string): string {
  if (typeof ratio === "number") return `aspect-[${ratio}]`
  const key = ratio.replace(/\s+/g, "")
  return NAMED_RATIO[key] ?? `aspect-[${key}]`
}

type MediaPlayerProps = {
  // "video" (default) frames a <video> in an aspect-ratio box; "audio"
  // renders a full-width <audio> control bar.
  kind?: MediaPlayerKind
  // Single source shortcut. For multiple formats pass `sources` instead.
  src?: string
  // Multiple encodings, tried in order until one plays.
  sources?: MediaSource[]
  // Caption / subtitle tracks (WebVTT).
  tracks?: MediaTrack[]
  // Video only: image shown before the first frame is available.
  poster?: string
  // Width-to-height frame ratio for video (ignored for audio). A number
  // (1.778) or a "w/h" string ("16/9", "4/3"). Defaults to 16:9.
  ratio?: number | string
  // Native playback hints / flags.
  controls?: boolean
  preload?: "none" | "metadata" | "auto"
  loop?: boolean
  muted?: boolean
  autoplay?: boolean
  // Video only: play inline rather than forcing fullscreen on mobile.
  playsinline?: boolean
  // CORS mode for cross-origin media (needed for cross-origin tracks).
  crossorigin?: "anonymous" | "use-credentials"
  // Accessible name when there is no caption track to identify the media.
  ariaLabel?: string
  class?: ClassValue
  id?: string
  // No-support fallback content (links to download the media, etc.). Also
  // receives <source>/<track> if you'd rather pass them as children than via
  // the `sources` / `tracks` props.
  children?: Child
  // Forward hx-*, data-*, aria-*, and standard attributes onto the root.
  [key: string]: unknown
}

export function MediaPlayer(props: MediaPlayerProps) {
  const {
    kind = "video",
    src,
    sources,
    tracks,
    poster,
    ratio = "16/9",
    controls = true,
    preload,
    loop,
    muted,
    autoplay,
    playsinline,
    crossorigin,
    ariaLabel,
    class: className,
    id,
    children,
    ...rest
  } = props

  const isVideo = kind === "video"

  const sourceEls = (sources ?? []).map((s) => (
    <source data-slot="media-player-source" src={s.src} type={s.type} />
  ))

  const trackEls = (tracks ?? []).map((t) => (
    <track
      data-slot="media-player-track"
      kind={t.kind ?? "subtitles"}
      src={t.src}
      srclang={t.srclang}
      label={t.label}
      default={t.default}
    />
  ))

  const common = {
    "data-slot": "media-player-media",
    src,
    controls: controls ? true : undefined,
    preload,
    loop: loop ? true : undefined,
    muted: muted ? true : undefined,
    autoplay: autoplay ? true : undefined,
    crossorigin,
    "aria-label": ariaLabel,
  }

  const media = isVideo ? (
    <video
      {...common}
      poster={poster}
      playsinline={playsinline ? true : undefined}
      class={mediaClasses.video}
    >
      {sourceEls}
      {trackEls}
      {children}
    </video>
  ) : (
    <audio {...common} class={mediaClasses.audio}>
      {sourceEls}
      {trackEls}
      {children}
    </audio>
  )

  return (
    <div
      id={id}
      data-slot="media-player"
      data-kind={kind}
      class={cn(root, isVideo && ratioClass(ratio), !isVideo && "p-2", className)}
      {...rest}
    >
      {media}
    </div>
  )
}
