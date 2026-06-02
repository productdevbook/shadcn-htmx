defmodule ShadcnHtmx.Components.Menubar do
  @moduledoc """
  Menubar — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  An app-style, visually-persistent horizontal bar of menus. The bar is
  `role="menubar"`; each top-level item is a `role="menuitem"` button with
  `aria-haspopup="menu"` + `aria-expanded` that opens its submenu via the
  native Popover API (`popovertarget` + `popover="auto"`). The APG composite
  keyboard contract (roving tabindex, ArrowLeft/Right, ArrowDown to open,
  ArrowUp/Down inside a menu, Home/End, type-ahead, ESC) is wired up in
  public/site.js keyed on `data-slot="menubar"`.

  ## Examples

      <.menubar aria_label="Application">
        <.menubar_menu label="File" id="mb-file">
          <.menubar_item>New File</.menubar_item>
          <.menubar_item>Open…</.menubar_item>
          <.menubar_separator />
          <.menubar_item variant="destructive">Delete project</.menubar_item>
        </.menubar_menu>
        <.menubar_menu label="Edit" id="mb-edit">
          <.menubar_item>Undo</.menubar_item>
          <.menubar_item>Redo</.menubar_item>
        </.menubar_menu>
      </.menubar>
  """

  use Phoenix.Component

  attr :aria_label, :string, default: nil
  # aria_labelledby: id of a visible element naming the menubar. APG prefers
  # aria-labelledby over aria-label when a visible label exists
  # (menu-and-menubar-pattern.html:220-222; MDN menubar_role:32).
  attr :aria_labelledby, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def menubar(assigns) do
    ~H"""
    <div
      role="menubar"
      data-slot="menubar"
      aria-label={@aria_label}
      aria-labelledby={@aria_labelledby}
      class={[
        "inline-flex h-9 items-center gap-0.5 rounded-md border bg-background p-1 shadow-xs",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :label, :string, required: true
  attr :id, :string, required: true
  attr :disabled, :boolean, default: false
  attr :trigger_class, :string, default: nil
  attr :content_class, :string, default: nil
  slot :inner_block, required: true

  def menubar_menu(assigns) do
    ~H"""
    <div data-slot="menubar-menu" class="contents">
      <button
        type="button"
        role="menuitem"
        tabindex="-1"
        popovertarget={@id}
        popovertargetaction="toggle"
        aria-haspopup="menu"
        aria-expanded="false"
        data-slot="menubar-trigger"
        data-menu-for={@id}
        data-disabled={@disabled && "true"}
        disabled={@disabled}
        class={[
          "flex select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none",
          "focus:bg-accent focus:text-accent-foreground",
          "aria-[expanded=true]:bg-accent aria-[expanded=true]:text-accent-foreground",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          @trigger_class
        ]}
      >
        {@label}
      </button>
      <div
        id={@id}
        popover="auto"
        role="menu"
        aria-label={@label}
        data-slot="menubar-content"
        data-side="bottom"
        class={[
          "z-50 m-0 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
          "[&:not(:popover-open)]:hidden",
          "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
          "anchor-popover-bottom",
          @content_class
        ]}
      >
        {render_slot(@inner_block)}
      </div>
    </div>
    """
  end

  attr :href, :string, default: nil
  attr :disabled, :boolean, default: false
  attr :variant, :string, default: "default", values: ~w(default destructive)
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def menubar_item(assigns) do
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
          data-slot="menubar-item"
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
          data-slot="menubar-item"
          data-disabled={@disabled && "true"}
          class={[@base, @destr, @class]}
          {@rest}
        >
          {render_slot(@inner_block)}
        </button>
        """
    end
  end

  def menubar_separator(assigns) do
    ~H"""
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="menubar-separator"
      class="-mx-1 my-1 h-px bg-border"
    />
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def menubar_label(assigns) do
    ~H"""
    <div
      data-slot="menubar-label"
      class={[
        "px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  @doc """
  Presentational accelerator hint (e.g. "⌘S") at the trailing edge of an
  item. aria-hidden so AT does not announce the glyph; expose the real
  shortcut via aria-keyshortcuts on menubar_item.
  repos/.../attributes/aria-keyshortcuts/index.md
  """
  def menubar_shortcut(assigns) do
    ~H"""
    <span
      aria-hidden="true"
      data-slot="menubar-shortcut"
      class={["ml-auto text-xs tracking-widest text-muted-foreground", @class]}
    >
      {render_slot(@inner_block)}
    </span>
    """
  end
end
