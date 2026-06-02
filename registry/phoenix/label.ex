defmodule ShadcnHtmx.Components.Label do
  @moduledoc """
  Label — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/label.tsx. Native <label> with the `for` attribute does
  the work — clicking the label focuses the input it points at.

  ## Examples

      <.label for="email">Email</.label>
      <.input id="email" name="email" type="email" />

      # Implicit wrapping
      <.label>
        Email <.input name="email" type="email" />
      </.label>
  """

  use Phoenix.Component

  @base "flex items-center gap-2 text-sm leading-none font-medium select-none " <>
          "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " <>
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"

  attr :for, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  slot :inner_block, required: true

  def label(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <label
      for={@for}
      class={[@base_class, @class]}
      data-slot="label"
      {@rest}
    >
      {render_slot(@inner_block)}
    </label>
    """
  end
end
