defmodule ShadcnHtmx.Components.ResponsiveImage do
  @moduledoc """
  Responsive Image — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/responsive-image.tsx. A native `<picture>` with zero or
  more `<source>` children and exactly one fallback `<img>`. The browser walks
  the source list top-to-bottom, picks the first whose `media`/`type` match,
  and falls back to the `<img>` when none match. Zero JS.

  Source of truth:
    repos/mdn/files/en-us/web/html/reference/elements/picture/index.md
    repos/mdn/files/en-us/web/html/reference/elements/source/index.md

  Accessibility: `<picture>`/`<source>` carry no ARIA role; the accessible name
  comes from the fallback `<img>`'s `alt` (empty "" only for decorative images).

  ## Examples

      <.responsive_image src={~p"/img/hero.jpg"} alt="A surfer at golden hour">
        <:source srcset={~p"/img/hero.avif"} type="image/avif" />
        <:source srcset={~p"/img/hero.webp"} type="image/webp" />
      </.responsive_image>
  """

  use Phoenix.Component

  attr :src, :string, required: true
  attr :alt, :string, required: true
  attr :srcset, :string, default: nil
  attr :sizes, :string, default: nil
  attr :width, :integer, default: nil
  attr :height, :integer, default: nil
  attr :loading, :string, default: nil, values: ~w(lazy eager) ++ [nil]
  attr :decoding, :string, default: nil, values: ~w(sync async auto) ++ [nil]
  attr :fetchpriority, :string, default: nil, values: ~w(high low auto) ++ [nil]
  attr :class, :string, default: nil
  attr :img_class, :string, default: nil
  attr :id, :string, default: nil
  attr :rest, :global

  slot :source do
    attr :srcset, :string, required: true
    attr :type, :string
    attr :media, :string
    attr :sizes, :string
    attr :width, :integer
    attr :height, :integer
  end

  def responsive_image(assigns) do
    ~H"""
    <picture
      id={@id}
      data-slot="responsive-image"
      class={["block overflow-hidden rounded-lg border bg-muted", @class]}
      {@rest}
    >
      <source
        :for={s <- @source}
        srcset={s.srcset}
        type={s[:type]}
        media={s[:media]}
        sizes={s[:sizes]}
        width={s[:width]}
        height={s[:height]}
      />
      <img
        src={@src}
        alt={@alt}
        srcset={@srcset}
        sizes={@sizes}
        width={@width}
        height={@height}
        loading={@loading}
        decoding={@decoding}
        fetchpriority={@fetchpriority}
        data-slot="responsive-image-img"
        class={["block size-full object-cover", @img_class]}
      />
    </picture>
    """
  end
end
