defmodule ShadcnHtmx.Components.Kbd do
  @moduledoc """
  Kbd — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/kbd.tsx. Zero JavaScript — `<kbd>` is phrasing
  content with no interaction.

  Native element:
    repos/mdn/files/en-us/web/html/reference/elements/kbd/index.md
    (nested `<kbd>` per key inside an outer `<kbd>` = MDN keystroke pattern)

  `kbd/1` renders one key cap. `kbd_group/1` renders the outer `<kbd>`
  wrapping a shortcut — pass `keys` for an auto-joined sequence, or use the
  default slot to compose the body by hand.
  """

  use Phoenix.Component

  @base "pointer-events-none inline-flex h-5 w-fit min-w-5 shrink-0 select-none items-center justify-center gap-1 " <>
          "rounded-sm border bg-muted px-1 font-sans text-xs font-medium text-muted-foreground " <>
          "[&_svg:not([class*='size-'])]:size-3"

  @group_base "inline-flex w-fit items-center gap-1 align-middle"

  attr :id, :string, default: nil
  attr :aria_label, :string, default: nil
  attr :title, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  slot :inner_block, required: true

  def kbd(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <kbd
      id={@id}
      data-slot="kbd"
      class={[@base_class, @class]}
      aria-label={@aria_label}
      title={@title}
      {@rest}
    >
      {render_slot(@inner_block)}
    </kbd>
    """
  end

  attr :keys, :list, default: nil
  attr :separator, :string, default: "+"
  attr :id, :string, default: nil
  attr :aria_label, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  slot :inner_block

  def kbd_group(assigns) do
    assigns =
      assigns
      |> assign(:base_class, @base)
      |> assign(:group_class, @group_base)

    ~H"""
    <kbd
      id={@id}
      data-slot="kbd-group"
      class={[@group_class, @class]}
      aria-label={@aria_label}
      {@rest}
    >
      <%= if @keys && @keys != [] do %>
        <%= for {key, i} <- Enum.with_index(@keys) do %>
          <span :if={i > 0 && @separator != ""} aria-hidden="true" class="text-muted-foreground/70">{@separator}</span>
          <kbd data-slot="kbd" class={@base_class}>{key}</kbd>
        <% end %>
      <% else %>
        {render_slot(@inner_block)}
      <% end %>
    </kbd>
    """
  end
end
