defmodule ShadcnHtmx.Components.Tooltip do
  @moduledoc """
  Tooltip — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  CSS-only show/hide on hover + focus-within. ESC dismissal handled by
  public/site.js. APG tooltip pattern: must reveal on keyboard focus too,
  must be dismissible with ESC, and must NOT contain interactive content.

  ## Examples

      <.tooltip id="save-tt" content="Saves your draft">
        <button class="…">Save</button>
      </.tooltip>
  """

  use Phoenix.Component

  @wrapper "relative inline-block w-fit group/tooltip align-middle " <>
             "[&:hover>[data-slot=tooltip-content]]:opacity-100 " <>
             "[&:focus-within>[data-slot=tooltip-content]]:opacity-100 " <>
             "[&[data-suppress=true]>[data-slot=tooltip-content]]:opacity-0!"

  @content_base "pointer-events-none absolute z-50 w-max max-w-xs rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md opacity-0 transition-opacity duration-150 dark:bg-foreground dark:text-background"

  @sides %{
    "top" => "left-1/2 -translate-x-1/2 bottom-[calc(100%+0.5rem)]",
    "bottom" => "left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)]",
    "left" => "top-1/2 -translate-y-1/2 right-[calc(100%+0.5rem)]",
    "right" => "top-1/2 -translate-y-1/2 left-[calc(100%+0.5rem)]"
  }

  attr :id, :string, required: true
  attr :content, :string, required: true
  attr :side, :string, default: "top", values: ~w(top right bottom left)
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def tooltip(assigns) do
    assigns =
      assigns
      |> assign(:wrapper, @wrapper)
      |> assign(:content_base, @content_base)
      |> assign(:side_class, Map.fetch!(@sides, assigns.side))

    ~H"""
    <span
      data-slot="tooltip"
      data-side={@side}
      data-tooltip-trigger
      class={[@wrapper, @class]}
      aria-describedby={@id}
    >
      {render_slot(@inner_block)}
      <span
        id={@id}
        role="tooltip"
        data-slot="tooltip-content"
        data-side={@side}
        class={[@content_base, @side_class]}
      >
        {@content}
      </span>
    </span>
    """
  end
end
