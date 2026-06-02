defmodule ShadcnHtmx.Components.AspectRatio do
  @moduledoc """
  Aspect Ratio — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/aspect-ratio.tsx.

  Locks the slotted child (image / video / iframe / embed / chart) to a
  fixed width-to-height ratio with the native CSS `aspect-ratio` property
  (no padding-top hack) and `object-fit` for replaced elements. Zero JS.

    * MDN aspect-ratio:
      repos/mdn/files/en-us/web/css/reference/properties/aspect-ratio/index.md
    * MDN object-fit:
      repos/mdn/files/en-us/web/css/reference/properties/object-fit/index.md
    * web.dev pattern:
      repos/web.dev/src/site/content/en/patterns/layout/aspect-ratio-image-card/index.md

  The slotted child should carry `size-full object-cover` / `object-contain`
  so the fit lands on the replaced element — mirroring how the .tsx clones
  the child.

  ## Examples

      <.aspect_ratio ratio="16/9">
        <img src="/photo.jpg" alt="…" class="size-full object-cover" />
      </.aspect_ratio>

      <.aspect_ratio ratio="1/1">
        <img src="/avatar.jpg" alt="…" class="size-full object-cover" />
      </.aspect_ratio>
  """

  use Phoenix.Component

  @root "relative block w-full overflow-hidden"

  attr :ratio, :string, default: "16/9"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def aspect_ratio(assigns) do
    assigns =
      assigns
      |> assign(:root, @root)
      |> assign(:ratio_class, ratio_class(assigns.ratio))

    ~H"""
    <div
      data-slot="aspect-ratio"
      data-ratio={@ratio}
      class={[@root, @ratio_class, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  defp ratio_class("1/1"), do: "aspect-square"
  defp ratio_class("16/9"), do: "aspect-video"
  defp ratio_class(ratio), do: "aspect-[#{String.replace(ratio, " ", "")}]"
end
