defmodule ShadcnHtmx.Components.SnapList do
  @moduledoc """
  Snap List — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/snap-list.tsx. The bare, reusable CSS scroll-snap rail
  (gallery strip / chip row / media shelf / date rail) — ZERO JavaScript. Two
  function components: `snap_list` (the scroll container) and `snap_list_item`.

  Built on CSS scroll snap (the platform owns scrolling + snapping):
    - scroll-snap-type on the <ul> (snap-x/snap-y + snap-mandatory/snap-proximity)
      repos/mdn/.../css/reference/properties/scroll-snap-type
    - scroll-snap-align on each <li> (snap-start/snap-center/snap-end)
      repos/mdn/.../css/reference/properties/scroll-snap-align
    - scroll-snap-stop: always (snap-always) so a fling can't skip an item
      repos/mdn/.../css/reference/properties/scroll-snap-stop
  Pattern: repos/web.dev/.../patterns/components/media-scroller

  The root is a real <ul role="list"> (Safari drops the implicit list role
  once list-style is removed) and a keyboard tab stop (tabindex="0"). The
  .scrollbar-none helper lives in app/styles/input.css.

  ## Examples

      <.snap_list aria-label="Photo strip">
        <.snap_list_item><img src="…" alt="…" /></.snap_list_item>
        <.snap_list_item><img src="…" alt="…" /></.snap_list_item>
      </.snap_list>
  """

  use Phoenix.Component

  attr :orientation, :string, default: "horizontal", values: ~w(horizontal vertical)
  attr :snap, :string, default: "mandatory", values: ~w(mandatory proximity)
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def snap_list(assigns) do
    axis =
      if assigns.orientation == "vertical",
        do: "snap-y flex-col overflow-y-auto",
        else: "snap-x flex-row overflow-x-auto"

    strictness = if assigns.snap == "proximity", do: "snap-proximity", else: "snap-mandatory"
    assigns = assign(assigns, axis: axis, strictness: strictness)

    ~H"""
    <ul
      data-slot="snap-list"
      data-orientation={@orientation}
      data-snap={@snap}
      role="list"
      tabindex="0"
      aria-label={assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      class={[
        "flex list-none scroll-smooth scrollbar-none rounded-lg outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        @axis,
        @strictness,
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </ul>
    """
  end

  attr :align, :string, default: "start", values: ~w(start center end)
  attr :stop, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def snap_list_item(assigns) do
    align_class =
      case assigns.align do
        "center" -> "snap-center"
        "end" -> "snap-end"
        _ -> "snap-start"
      end

    assigns = assign(assigns, align_class: align_class)

    ~H"""
    <li
      data-slot="snap-list-item"
      data-align={@align}
      class={[
        "min-w-0 shrink-0 grow-0",
        @align_class,
        @stop && "snap-always",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </li>
    """
  end
end
