defmodule ShadcnHtmx.Components.AutoGrid do
  @moduledoc """
  Auto Grid — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/auto-grid.tsx.

  A responsive, intrinsically-wrapping grid of equal cells with no media
  queries — children flow into as many columns as fit at a configurable
  minimum item width, then grow to share the leftover space. This is the
  "RAM" pattern (Repeat, Auto, Minmax). Pure CSS Grid; zero JavaScript.

    - `min`  — per-item minimum width (any CSS length). Default "16rem".
    - `gap`  — a gap-* class. Default "gap-4".
    - `fill` — true → auto-fill (keep empty tracks); false → auto-fit
               (collapse them so real items stretch). Default false.
    - `tag`  — div | ul | ol | section. Default "div".

  ## Examples

      <.auto_grid>
        <div :for={item <- @items}>…</.auto_grid>

      <.auto_grid min="20rem" gap="gap-6" fill tag="ul">
        <li :for={item <- @items}>…</li>
      </.auto_grid>
  """

  use Phoenix.Component

  attr :min, :string, default: "16rem"
  attr :gap, :string, default: "gap-4"
  attr :fill, :boolean, default: false
  attr :tag, :string, default: "div", values: ~w(div ul ol section)
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def auto_grid(assigns) do
    tracks =
      if assigns.fill do
        "repeat(auto-fill,minmax(min(var(--auto-grid-min,16rem),100%),1fr))"
      else
        "repeat(auto-fit,minmax(min(var(--auto-grid-min,16rem),100%),1fr))"
      end

    assigns = assign(assigns, :tracks, tracks)

    ~H"""
    <.dynamic_tag
      tag_name={@tag}
      data-slot="auto-grid"
      data-fill={if @fill, do: "true"}
      style={"--auto-grid-min:#{@min}"}
      class={["grid", "[grid-template-columns:#{@tracks}]", @gap, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </.dynamic_tag>
    """
  end
end
