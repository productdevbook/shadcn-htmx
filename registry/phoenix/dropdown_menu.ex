defmodule ShadcnHtmx.Components.DropdownMenu do
  @moduledoc """
  DropdownMenu — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Built on the native Popover API (popover + popovertarget). The APG menu
  keyboard contract (arrows, Home/End, type-to-find, Enter/Space activate)
  is wired up in public/site.js.

  ## Examples

      <.dropdown_trigger menu_for="user-menu" class="…btn…">Account</.dropdown_trigger>

      <.dropdown_menu id="user-menu">
        <.dropdown_label>My account</.dropdown_label>
        <.dropdown_item>Profile</.dropdown_item>
        <.dropdown_item>Settings</.dropdown_item>
        <.dropdown_separator />
        <.dropdown_item variant="destructive">Log out</.dropdown_item>
      </.dropdown_menu>
  """

  use Phoenix.Component

  attr :menu_for, :string, required: true
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def dropdown_trigger(assigns) do
    ~H"""
    <button
      type="button"
      popovertarget={@menu_for}
      popovertargetaction="toggle"
      data-slot="dropdown-menu-trigger"
      aria-haspopup="menu"
      class={@class}
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end

  attr :id, :string, required: true
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def dropdown_menu(assigns) do
    ~H"""
    <div
      id={@id}
      popover="auto"
      role="menu"
      data-slot="dropdown-menu"
      class={[
        "z-50 m-0 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
        "[&:not(:popover-open)]:hidden",
        "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
        "anchor-popover-bottom",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :href, :string, default: nil
  attr :disabled, :boolean, default: false
  attr :variant, :string, default: "default", values: ~w(default destructive)
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def dropdown_item(assigns) do
    base =
      "relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none " <>
        "focus:bg-accent focus:text-accent-foreground " <>
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " <>
        "[&_svg]:size-4 [&_svg]:shrink-0"

    destr =
      if assigns.variant == "destructive",
        do: "text-destructive focus:bg-destructive/10 focus:text-destructive",
        else: ""

    assigns = assign(assigns, base: base, destr: destr)

    cond do
      assigns.href ->
        ~H"""
        <a
          role="menuitem"
          tabindex="-1"
          href={@href}
          data-slot="dropdown-menu-item"
          data-disabled={@disabled && "true"}
          class={[@base, @destr, @class]}
          {@rest}
        >
          {render_slot(@inner_block)}
        </a>
        """

      true ->
        ~H"""
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          data-slot="dropdown-menu-item"
          data-disabled={@disabled && "true"}
          class={[@base, @destr, @class]}
          {@rest}
        >
          {render_slot(@inner_block)}
        </button>
        """
    end
  end

  def dropdown_separator(assigns) do
    ~H"""
    <div role="separator" data-slot="dropdown-menu-separator" class="-mx-1 my-1 h-px bg-border" />
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def dropdown_label(assigns) do
    ~H"""
    <div
      data-slot="dropdown-menu-label"
      class={[
        "px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end
end
