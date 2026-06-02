defmodule ShadcnHtmx.Components.MediaPlayer do
  @moduledoc """
  Media Player — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/media-player.tsx.

  A styled native `<video controls>` / `<audio controls>`. The browser ships
  the full accessible playback UI — play/pause, scrubber, volume, captions
  toggle, fullscreen, Picture-in-Picture — so we render the real platform
  element and only frame it (rounded card, aspect-ratio, poster). No custom
  controls, no JavaScript: we never emulate a feature the browser ships.

    * MDN <video>:
      repos/mdn/files/en-us/web/html/reference/elements/video/index.md
    * MDN <audio>:
      repos/mdn/files/en-us/web/html/reference/elements/audio/index.md
    * MDN <source>:
      repos/mdn/files/en-us/web/html/reference/elements/source/index.md
    * MDN <track>:
      repos/mdn/files/en-us/web/html/reference/elements/track/index.md

  `:source` slots are <source> rows ({src, type}); `:track` slots are
  WebVTT <track> rows ({src, kind, srclang, label, default}). The inner block
  is the no-support fallback (download links).

  ## Examples

      <.media_player poster="/poster.jpg">
        <:source src="/clip.webm" type="video/webm" />
        <:source src="/clip.mp4" type="video/mp4" />
        <:track src="/clip.en.vtt" kind="captions" srclang="en" label="English" default />
        <a href="/clip.mp4">Download the video</a>
      </.media_player>

      <.media_player kind="audio">
        <:source src="/song.mp3" type="audio/mpeg" />
      </.media_player>
  """

  use Phoenix.Component

  @root "group/media-player relative block w-full overflow-hidden rounded-lg border bg-card"

  attr :kind, :string, default: "video", values: ~w(video audio)
  attr :src, :string, default: nil
  attr :poster, :string, default: nil
  attr :ratio, :string, default: "16/9"
  attr :controls, :boolean, default: true
  attr :preload, :string, default: nil
  attr :loop, :boolean, default: false
  attr :muted, :boolean, default: false
  attr :autoplay, :boolean, default: false
  attr :playsinline, :boolean, default: false
  attr :crossorigin, :string, default: nil
  attr :aria_label, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  slot :source do
    attr :src, :string, required: true
    attr :type, :string
  end

  slot :track do
    attr :src, :string, required: true
    attr :kind, :string
    attr :srclang, :string
    attr :label, :string
    attr :default, :boolean
  end

  slot :inner_block

  def media_player(assigns) do
    assigns =
      assigns
      |> assign(:root, @root)
      |> assign(:is_video, assigns.kind == "video")
      |> assign(:ratio_class, ratio_class(assigns.ratio))

    ~H"""
    <div
      data-slot="media-player"
      data-kind={@kind}
      class={[
        @root,
        @is_video && @ratio_class,
        !@is_video && "p-2",
        @class
      ]}
      {@rest}
    >
      <video
        :if={@is_video}
        data-slot="media-player-media"
        src={@src}
        controls={@controls}
        poster={@poster}
        preload={@preload}
        loop={@loop}
        muted={@muted}
        autoplay={@autoplay}
        playsinline={@playsinline}
        crossorigin={@crossorigin}
        aria-label={@aria_label}
        class="block size-full bg-black object-contain"
      >
        <source
          :for={s <- @source}
          data-slot="media-player-source"
          src={s.src}
          type={Map.get(s, :type)}
        />
        <track
          :for={t <- @track}
          data-slot="media-player-track"
          kind={Map.get(t, :kind, "subtitles")}
          src={t.src}
          srclang={Map.get(t, :srclang)}
          label={Map.get(t, :label)}
          default={Map.get(t, :default, false)}
        />
        {render_slot(@inner_block)}
      </video>
      <audio
        :if={!@is_video}
        data-slot="media-player-media"
        src={@src}
        controls={@controls}
        preload={@preload}
        loop={@loop}
        muted={@muted}
        autoplay={@autoplay}
        crossorigin={@crossorigin}
        aria-label={@aria_label}
        class="block w-full"
      >
        <source
          :for={s <- @source}
          data-slot="media-player-source"
          src={s.src}
          type={Map.get(s, :type)}
        />
        <track
          :for={t <- @track}
          data-slot="media-player-track"
          kind={Map.get(t, :kind, "subtitles")}
          src={t.src}
          srclang={Map.get(t, :srclang)}
          label={Map.get(t, :label)}
          default={Map.get(t, :default, false)}
        />
        {render_slot(@inner_block)}
      </audio>
    </div>
    """
  end

  defp ratio_class("1/1"), do: "aspect-square"
  defp ratio_class("16/9"), do: "aspect-video"
  defp ratio_class(ratio), do: "aspect-[#{String.replace(ratio, " ", "")}]"
end
