defmodule ShadcnHtmx.Components.Popover do
  @moduledoc """
  Popover — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native HTML Popover API. The browser handles light dismiss, ESC close,
  top-layer rendering, focus restoration.

  ## Examples

      <.popover_trigger popover_target="my-popover" class="…btn…">
        Open
      </.popover_trigger>

      <.popover id="my-popover">
        <p>Body content.</p>
      </.popover>
  """

  use Phoenix.Component

  @sides %{
    "top" => "anchor-popover-top",
    "bottom" => "anchor-popover-bottom",
    "left" => "anchor-popover-left",
    "right" => "anchor-popover-right"
  }

  attr :id, :string, required: true
  # "hint" = light-dismissable but does NOT close an open auto popover (falls
  # back to manual in non-supporting browsers).
  # mdn .../global_attributes/popover/index.md:22-24
  attr :mode, :string, default: "auto", values: ~w(auto hint manual)
  attr :side, :string, default: "bottom", values: ~w(top right bottom left)
  attr :class, :string, default: nil
  # The native popover attribute assigns no role or accessible name to the
  # popover element itself — supply these for menu/listbox popovers.
  # mdn .../api/popover_api/using/index.md:79-86
  attr :role, :string, default: nil
  attr :aria_labelledby, :string, default: nil
  attr :aria_label, :string, default: nil
  slot :inner_block, required: true

  def popover(assigns) do
    assigns = assign(assigns, :side_class, Map.fetch!(@sides, assigns.side))

    ~H"""
    <div
      id={@id}
      popover={@mode}
      data-slot="popover"
      data-side={@side}
      role={@role}
      aria-labelledby={@aria_labelledby}
      aria-label={@aria_label}
      class={[
        "z-50 m-0 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "[&:not(:popover-open)]:hidden",
        "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
        @side_class,
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :popover_target, :string, required: true
  attr :action, :string, default: "toggle", values: ~w(show hide toggle)
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def popover_trigger(assigns) do
    ~H"""
    <button
      type="button"
      popovertarget={@popover_target}
      popovertargetaction={@action}
      data-slot="popover-trigger"
      class={@class}
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end
end
