defmodule ShadcnHtmx.Components.Figure do
  @moduledoc """
  Figure — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/figure.tsx. Self-contained captioned content (image,
  diagram, code block, quotation) in a native `<figure>`; the `<figcaption>`
  supplies the figure's accessible name. No JavaScript.

    MDN figure:     repos/mdn/files/en-us/web/html/reference/elements/figure/index.md
    MDN figcaption: repos/mdn/files/en-us/web/html/reference/elements/figcaption/index.md

  The `<figcaption>` must be the figure's first or last child. Pass
  `caption_side="top"` to render the caption above the content (legend),
  otherwise it renders below (credit/label).

  ## Examples

      <.figure>
        <img src="/elephant.jpg" alt="An elephant at sunset" class="w-full rounded-md" />
        <.figure_caption>An elephant at sunset</.figure_caption>
      </.figure>

      <.figure caption_side="top">
        <.figure_caption>
          Get browser details <.figure_credit>via navigator</.figure_credit>
        </.figure_caption>
        <.figure_content>
          <pre class="overflow-x-auto p-4"><code>navigator.userAgent</code></pre>
        </.figure_content>
      </.figure>
  """

  use Phoenix.Component

  attr :caption_side, :string, default: "bottom", values: ~w(top bottom)
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def figure(assigns) do
    ~H"""
    <figure
      data-slot="figure"
      data-caption-side={@caption_side}
      class={[
        "flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-3 text-card-foreground",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </figure>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def figure_content(assigns) do
    ~H"""
    <div
      data-slot="figure-content"
      class={["overflow-hidden rounded-md bg-muted text-sm text-foreground", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :id, :string, default: nil
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def figure_caption(assigns) do
    ~H"""
    <figcaption
      id={@id}
      data-slot="figure-caption"
      class={["px-1 text-sm leading-snug text-muted-foreground", @class]}
    >
      {render_slot(@inner_block)}
    </figcaption>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def figure_credit(assigns) do
    ~H"""
    <span
      data-slot="figure-credit"
      class={["mt-1 block text-xs text-muted-foreground/80", @class]}
    >
      {render_slot(@inner_block)}
    </span>
    """
  end
end
