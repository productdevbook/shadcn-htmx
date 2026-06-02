defmodule ShadcnHtmx.Components.SegmentedControl do
  @moduledoc """
  Segmented control — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/segmented-control.tsx. A `<fieldset>` groups native
  `<input type="radio">` options sharing a `name`, so the platform handles
  arrow-key navigation + one-selected-at-a-time. It picks a *value*, not a
  panel — that is what distinguishes it from tabs.

  Sources read while building this:
    - web.dev settings pattern (grouped fieldset + appearance:none inputs
      styled via :checked): repos/web.dev/.../patterns/components/settings
    - web.dev learn/forms/accessibility (real grouped input, not a styled
      div): repos/web.dev/.../learn/forms/accessibility
    - APG radio group: repos/aria-practices/content/patterns/radio/

  ## Examples

      <.segmented_control name="view" aria-label="View" default_value="list">
        <.segmented_control_item value="list" name="view" id="view-list" checked>List</.segmented_control_item>
        <.segmented_control_item value="grid" name="view" id="view-grid">Grid</.segmented_control_item>
      </.segmented_control>
  """

  use Phoenix.Component

  @track_base "group/segmented inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-[3px] text-muted-foreground " <>
                "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 " <>
                "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"

  @item_base "relative inline-flex h-[calc(100%-2px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all select-none " <>
               "hover:text-foreground " <>
               "has-[:checked]:bg-background has-[:checked]:text-foreground has-[:checked]:shadow-sm " <>
               "dark:has-[:checked]:border-input dark:has-[:checked]:bg-input/30 dark:has-[:checked]:text-foreground " <>
               "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 " <>
               "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

  attr :name, :string, required: true
  attr :default_value, :string, default: nil
  attr :size, :string, default: "default", values: ["default", "sm"]
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby aria-describedby)
  slot :inner_block, required: true

  def segmented_control(assigns) do
    assigns =
      assigns
      |> assign(:track_base, @track_base)
      |> assign(:size_class, if(assigns.size == "sm", do: "h-8 text-xs", else: "h-9"))
      |> assign(:legend, assigns.rest["aria-label"])

    ~H"""
    <fieldset
      data-slot="segmented-control"
      data-name={@name}
      data-size={@size}
      data-default-value={@default_value}
      data-disabled={@disabled && "true"}
      disabled={@disabled}
      class={[@track_base, @size_class, @class]}
      {@rest}
    >
      <legend :if={@legend} class="sr-only">{@legend}</legend>
      {render_slot(@inner_block)}
    </fieldset>
    """
  end

  attr :value, :string, required: true
  attr :name, :string, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(id checked disabled required form aria-label)

  slot :inner_block, required: true

  def segmented_control_item(assigns) do
    assigns = assign(assigns, :item_base, @item_base)

    ~H"""
    <label
      data-slot="segmented-control-item"
      data-value={@value}
      class={[@item_base, @class]}
    >
      <input
        type="radio"
        class="peer sr-only"
        value={@value}
        name={@name}
        data-slot="segmented-control-input"
        {@rest}
      />
      <span data-slot="segmented-control-label">{render_slot(@inner_block)}</span>
    </label>
    """
  end
end
