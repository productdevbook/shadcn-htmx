defmodule ShadcnHtmx.Components.ContainerCard do
  @moduledoc """
  Container Card — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/container-card.tsx.

  A self-adapting card that restyles based on its OWN inline width rather than
  the viewport: stacked (media above text) when narrow, side-by-side when wide.
  The same markup drops into a sidebar, a wide column, or a grid cell with no
  per-call breakpoints. Built on CSS container queries
  (container-type: inline-size + @container). Pure CSS; zero JavaScript.

    - repos/mdn/files/en-us/web/css/reference/properties/container-type/index.md
    - repos/web.dev/src/site/content/en/patterns/layout/container-query-card/index.md

  ## Examples

      <.container_card>
        <:media>
          <img src="/cover.jpg" alt="" class="size-full object-cover" />
        </:media>
        <.container_card_title>Card title</.container_card_title>
        <.container_card_description>Supporting copy.</.container_card_description>
        <.container_card_footer>
          <a href="/more">Read more</a>
        </.container_card_footer>
      </.container_card>
  """

  use Phoenix.Component

  attr :tag, :string, default: "article", values: ~w(article section div li aside)
  # Flip threshold; published as --container-card-break. Changing the number
  # also requires editing the @min-[…] variant (a container query condition
  # cannot read a custom property — platform limitation, not a hack).
  attr :break, :string, default: "28rem"
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :media
  slot :inner_block, required: true

  def container_card(assigns) do
    ~H"""
    <.dynamic_tag
      tag_name={@tag}
      data-slot="container-card"
      style={"--container-card-break:#{@break}"}
      class={[
        "@container/container-card overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        @class
      ]}
      {@rest}
    >
      <div
        data-slot="container-card-layout"
        class="flex flex-col @min-[28rem]/container-card:grid @min-[28rem]/container-card:grid-cols-[40%_1fr] @min-[28rem]/container-card:items-stretch"
      >
        <div
          :if={@media != []}
          data-slot="container-card-media"
          class="bg-muted aspect-video w-full @min-[28rem]/container-card:aspect-auto @min-[28rem]/container-card:h-full"
        >
          {render_slot(@media)}
        </div>
        <div
          data-slot="container-card-body"
          class="flex flex-col gap-2 p-6 text-center @min-[28rem]/container-card:text-left"
        >
          {render_slot(@inner_block)}
        </div>
      </div>
    </.dynamic_tag>
    """
  end

  attr :id, :string, default: nil
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def container_card_title(assigns) do
    ~H"""
    <div data-slot="container-card-title" id={@id} class={["leading-none font-semibold", @class]}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def container_card_description(assigns) do
    ~H"""
    <p data-slot="container-card-description" class={["text-sm text-muted-foreground", @class]}>
      {render_slot(@inner_block)}
    </p>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def container_card_footer(assigns) do
    ~H"""
    <div
      data-slot="container-card-footer"
      class={[
        "mt-2 flex items-center justify-center gap-2 @min-[28rem]/container-card:justify-start",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end
end
