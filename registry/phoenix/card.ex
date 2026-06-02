defmodule ShadcnHtmx.Components.Card do
  @moduledoc """
  Card — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/card.tsx. Structural container with
  Header / Title / Description / Action / Content / Footer slots.

  ## Examples

      <.card>
        <.card_header>
          <.card_title>Account</.card_title>
          <.card_description>Update your settings here.</.card_description>
        </.card_header>
        <.card_content>
          <p>Body content…</p>
        </.card_content>
        <.card_footer>
          <button>Save</button>
        </.card_footer>
      </.card>
  """

  use Phoenix.Component

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def card(assigns) do
    ~H"""
    <div
      data-slot="card"
      class={["flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def card_header(assigns) do
    ~H"""
    <div
      data-slot="card-header"
      class={[
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def card_title(assigns) do
    ~H"""
    <div data-slot="card-title" class={["leading-none font-semibold", @class]}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def card_description(assigns) do
    ~H"""
    <div data-slot="card-description" class={["text-sm text-muted-foreground", @class]}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def card_action(assigns) do
    ~H"""
    <div
      data-slot="card-action"
      class={["col-start-2 row-span-2 row-start-1 self-start justify-self-end", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def card_content(assigns) do
    ~H"""
    <div data-slot="card-content" class={["px-6", @class]}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def card_footer(assigns) do
    ~H"""
    <div
      data-slot="card-footer"
      class={["flex items-center px-6 [.border-t]:pt-6", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end
end
