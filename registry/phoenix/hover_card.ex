defmodule ShadcnHtmx.Components.HoverCard do
  @moduledoc """
  Hover Card — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A rich preview surface revealed on INTEREST (hover / focus / long-press) of a
  trigger. Unlike Tooltip it MAY hold interactive content (links, buttons).
  Built on the native Popover API interest-invoker mechanism — zero JS:

    * the trigger carries `interestfor` pointing at the card's id;
    * the card is `popover="hint"` — shows on interest, ESC-closeable, does not
      light-dismiss `auto` popovers; falls back to `manual` when unsupported;
    * the implicit anchor reference lets CSS `position-area` place the card.

  Refs:
    repos/mdn/files/en-us/web/api/popover_api/using_interest_invokers/index.md
    repos/mdn/files/en-us/web/api/popover_api/index.md  (popover="hint")
    repos/mdn/files/en-us/web/css/reference/properties/position-area/index.md

  ## Examples

      <.hover_card_trigger card_for="user-card" href="/u/productdevbook" class="font-medium underline">
        @productdevbook
      </.hover_card_trigger>

      <.hover_card id="user-card">
        <p>Card body — links and buttons are allowed here.</p>
      </.hover_card>
  """

  use Phoenix.Component

  @sides %{
    "top" => "anchor-hovercard-top",
    "bottom" => "anchor-hovercard-bottom",
    "left" => "anchor-hovercard-left",
    "right" => "anchor-hovercard-right"
  }

  attr :id, :string, required: true
  attr :side, :string, default: "bottom", values: ~w(top right bottom left)
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def hover_card(assigns) do
    assigns = assign(assigns, :side_class, Map.fetch!(@sides, assigns.side))

    ~H"""
    <div
      id={@id}
      popover="hint"
      data-slot="hover-card"
      data-side={@side}
      class={[
        "z-50 m-0 w-64 rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none",
        "[&:not(:popover-open)]:hidden",
        "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
        @side_class,
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :card_for, :string, required: true
  attr :href, :string, default: "#"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def hover_card_trigger(assigns) do
    ~H"""
    <a
      href={@href}
      interestfor={@card_for}
      data-slot="hover-card-trigger"
      class={@class}
      {@rest}
    >
      {render_slot(@inner_block)}
    </a>
    """
  end
end
