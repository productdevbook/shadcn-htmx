defmodule ShadcnHtmx.Components.Toolbar do
  @moduledoc """
  Toolbar — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/toolbar.tsx. Function components: `toolbar`,
  `toolbar_button`, `toolbar_toggle`, `toolbar_separator`, `toolbar_group`.

  The container has role="toolbar" and is a single tab stop; a boot <script>
  sets the roving tabindex on first paint, and public/site.js (keyed on
  data-slot="toolbar") owns the arrow-key contract. Accessibility contract:
  repos/aria-practices/content/patterns/toolbar/toolbar-pattern.html

  ## Examples

      <.toolbar aria-label="Text formatting">
        <.toolbar_toggle pressed>Bold</.toolbar_toggle>
        <.toolbar_toggle>Italic</.toolbar_toggle>
        <.toolbar_separator />
        <.toolbar_group aria-label="Alignment">
          <.toolbar_button>Left</.toolbar_button>
          <.toolbar_button>Center</.toolbar_button>
        </.toolbar_group>
      </.toolbar>
  """

  use Phoenix.Component

  attr :orientation, :string, default: "horizontal", values: ~w(horizontal vertical)
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def toolbar(assigns) do
    ~H"""
    <div
      role="toolbar"
      data-slot="toolbar"
      data-orientation={@orientation}
      aria-orientation={@orientation}
      aria-label={assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      class={[
        "group/toolbar flex w-fit items-center gap-1 rounded-md border bg-card p-1 shadow-xs",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    <script>{Phoenix.HTML.raw(~s"""
      (function(el){
        var items = el.querySelectorAll('[data-toolbar-item]');
        var set = false;
        items.forEach(function(it){
          var off = it.hasAttribute('disabled') || it.getAttribute('aria-disabled') === 'true';
          if (!set && !off) { it.setAttribute('tabindex','0'); set = true; }
          else { it.setAttribute('tabindex','-1'); }
        });
        if (!set && items.length) items[0].setAttribute('tabindex','0');
        el.setAttribute('data-toolbar-ready','true');
      })(document.currentScript.previousElementSibling);
    """)}</script>
    """
  end

  attr :disabled, :boolean, default: false
  attr :"aria-disabled", :boolean, default: false
  attr :"aria-label", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def toolbar_button(assigns) do
    ~H"""
    <button
      type="button"
      data-slot="toolbar-button"
      data-toolbar-item=""
      disabled={@disabled}
      aria-disabled={assigns[:"aria-disabled"] && "true"}
      aria-label={assigns[:"aria-label"]}
      class={[
        "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2.5 text-sm font-medium whitespace-nowrap text-foreground transition-all outline-none",
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "aria-pressed:bg-accent aria-pressed:text-accent-foreground dark:aria-pressed:bg-accent/50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end

  attr :pressed, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :"aria-disabled", :boolean, default: false
  attr :"aria-label", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def toolbar_toggle(assigns) do
    ~H"""
    <button
      type="button"
      data-slot="toolbar-toggle"
      data-toolbar-item=""
      aria-pressed={if @pressed, do: "true", else: "false"}
      disabled={@disabled}
      aria-disabled={assigns[:"aria-disabled"] && "true"}
      aria-label={assigns[:"aria-label"]}
      class={[
        "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2.5 text-sm font-medium whitespace-nowrap text-foreground transition-all outline-none",
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "aria-pressed:bg-accent aria-pressed:text-accent-foreground dark:aria-pressed:bg-accent/50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end

  attr :orientation, :string, default: "horizontal", values: ~w(horizontal vertical)
  attr :class, :string, default: nil

  def toolbar_separator(assigns) do
    # A separator inside a horizontal toolbar draws vertically (and vice
    # versa); not focusable, so the arrow navigation skips it.
    sep = if assigns.orientation == "horizontal", do: "vertical", else: "horizontal"
    assigns = assign(assigns, :sep, sep)

    ~H"""
    <div
      role="separator"
      data-slot="toolbar-separator"
      aria-orientation={@sep}
      class={[
        "shrink-0 bg-border",
        if(@sep == "vertical", do: "mx-0.5 h-5 w-px", else: "my-0.5 h-px w-full"),
        @class
      ]}
    >
    </div>
    """
  end

  attr :"aria-label", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def toolbar_group(assigns) do
    ~H"""
    <div
      role="group"
      data-slot="toolbar-group"
      aria-label={assigns[:"aria-label"]}
      class={[
        "flex items-center gap-1 group-data-[orientation=vertical]/toolbar:flex-col group-data-[orientation=vertical]/toolbar:items-stretch",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end
end
