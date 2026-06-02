defmodule ShadcnHtmx.Components.SplitButton do
  @moduledoc """
  SplitButton — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A primary action `<button>` joined to a small disclosure toggle that opens a
  popup of related secondary actions. Distinct from a dropdown menu: there is
  always a DEFAULT primary action that fires on its own click.

  Built on the native Popover API (popover + popovertarget). The popup carries
  `data-slot="dropdown-menu"`, so it reuses the APG menu keyboard contract
  (arrows, Home/End, type-to-find, Enter/Space activate, click closes) shipped
  in public/site.js. A tiny split-button block in site.js mirrors the popup's
  open state onto the toggle's `aria-expanded`. Anatomy modelled on Adam
  Argyle's web.dev split-button pattern.

  ## Examples

      <.split_button label="Save" menu_id="save-actions" hx-post="/save">
        <:menu>
          <.split_button_item hx-post="/save-draft">Save draft</.split_button_item>
          <.split_button_item hx-post="/save-template">Save as template</.split_button_item>
        </:menu>
      </.split_button>
  """

  use Phoenix.Component

  @seg "inline-flex items-center justify-center font-medium whitespace-nowrap outline-none transition-colors " <>
         "focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
         "disabled:pointer-events-none disabled:opacity-50 " <>
         "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " <>
         "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

  @variants %{
    "default" => "bg-primary text-primary-foreground hover:bg-primary/90",
    "secondary" => "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    "destructive" => "bg-destructive text-white hover:bg-destructive/90",
    "outline" => "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
  }

  @action_sizes %{
    "sm" => "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
    "default" => "h-9 gap-2 px-4 text-sm has-[>svg]:px-3",
    "lg" => "h-10 gap-2 px-6 text-sm has-[>svg]:px-4"
  }

  @toggle_sizes %{"sm" => "w-8", "default" => "w-9", "lg" => "w-10"}

  @dividers %{
    "default" => "border-l border-primary-foreground/20",
    "secondary" => "border-l border-foreground/15",
    "destructive" => "border-l border-white/25",
    "outline" => "border-l-0"
  }

  attr :label, :string, required: true
  attr :menu_id, :string, required: true
  attr :variant, :string, default: "default", values: ~w(default secondary destructive outline)
  attr :size, :string, default: "default", values: ~w(sm default lg)
  attr :side, :string, default: "bottom", values: ~w(top right bottom left)
  attr :toggle_label, :string, default: "More actions"
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :menu, required: true

  def split_button(assigns) do
    assigns =
      assign(assigns,
        seg: @seg,
        variant_cls: @variants[assigns.variant],
        action_size: @action_sizes[assigns.size],
        toggle_size: @toggle_sizes[assigns.size],
        divider: @dividers[assigns.variant]
      )

    ~H"""
    <div data-slot="split-button" class={["inline-flex items-stretch rounded-md shadow-xs outline-none isolate", @class]}>
      <button
        type="button"
        disabled={@disabled}
        data-slot="split-button-action"
        class={[@seg, @variant_cls, @action_size, "rounded-l-md rounded-r-none"]}
        {@rest}
      >
        {@label}
      </button>
      <button
        type="button"
        disabled={@disabled}
        popovertarget={@menu_id}
        popovertargetaction="toggle"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label={@toggle_label}
        data-slot="split-button-toggle"
        class={[@seg, @variant_cls, @toggle_size, @divider, "rounded-r-md rounded-l-none"]}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="size-4">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>
    <.split_button_menu id={@menu_id} side={@side}>
      {render_slot(@menu)}
    </.split_button_menu>
    """
  end

  attr :id, :string, required: true
  attr :side, :string, default: "bottom", values: ~w(top right bottom left)
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def split_button_menu(assigns) do
    ~H"""
    <ul
      id={@id}
      popover="auto"
      role="menu"
      data-slot="dropdown-menu"
      data-side={@side}
      class={[
        "z-50 m-0 min-w-[12rem] list-none rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
        "[&:not(:popover-open)]:hidden",
        "[&:popover-open]:animate-[scn-popover-in_120ms_ease-out]",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </ul>
    """
  end

  attr :href, :string, default: nil
  attr :disabled, :boolean, default: false
  attr :variant, :string, default: "default", values: ~w(default destructive)
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def split_button_item(assigns) do
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
        <li role="none" class="contents">
          <a
            role="menuitem"
            tabindex="-1"
            href={@href}
            data-slot="split-button-item"
            data-disabled={@disabled && "true"}
            class={[@base, @destr, @class]}
            {@rest}
          >
            {render_slot(@inner_block)}
          </a>
        </li>
        """

      true ->
        ~H"""
        <li role="none" class="contents">
          <button
            type="button"
            role="menuitem"
            tabindex="-1"
            data-slot="split-button-item"
            data-disabled={@disabled && "true"}
            class={[@base, @destr, @class]}
            {@rest}
          >
            {render_slot(@inner_block)}
          </button>
        </li>
        """
    end
  end
end
