defmodule ShadcnHtmx.Components.Tabs do
  @moduledoc """
  Tabs — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/tabs.tsx. Three function components: `tabs`,
  `tabs_list`, `tabs_trigger`, `tabs_content`. The keyboard contract
  (arrows, Home, End) is wired up in public/site.js.

  ## Examples

      <.tabs id="account-tabs" value="account">
        <.tabs_list>
          <.tabs_trigger value="account">Account</.tabs_trigger>
          <.tabs_trigger value="password">Password</.tabs_trigger>
        </.tabs_list>
        <.tabs_content value="account">
          <p>Account fields…</p>
        </.tabs_content>
        <.tabs_content value="password">
          <p>Password fields…</p>
        </.tabs_content>
      </.tabs>
  """

  use Phoenix.Component

  attr :id, :string, required: true
  attr :value, :string, required: true
  attr :orientation, :string, default: "horizontal", values: ~w(horizontal vertical)
  # APG activation mode — "automatic" (focus = activate) or "manual" (focus
  # only; Space/Enter to activate). See
  # repos/aria-practices/content/patterns/tabs/tabs-pattern.html:49,104-107.
  attr :activation, :string, default: "automatic", values: ~w(automatic manual)
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def tabs(assigns) do
    ~H"""
    <div
      id={@id}
      data-slot="tabs"
      data-tabs
      data-orientation={@orientation}
      data-activation={@activation}
      data-active-tab={@value}
      class={["group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    <script>{Phoenix.HTML.raw(~s"""
      (function(el){
        var active = el.getAttribute('data-active-tab');
        el.querySelectorAll('[data-tab-panel]').forEach(function(p){
          p.id = el.id + '-panel-' + p.getAttribute('data-tab-panel');
        });
        el.querySelectorAll('[data-tab-trigger]').forEach(function(t){
          var value = t.getAttribute('data-tab-trigger');
          var on = value === active;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
          t.setAttribute('aria-controls', el.id + '-panel-' + value);
          t.id = el.id + '-trigger-' + value;
        });
        el.querySelectorAll('[data-tab-panel]').forEach(function(p){
          var value = p.getAttribute('data-tab-panel');
          var on = value === active;
          if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
          p.setAttribute('aria-labelledby', el.id + '-trigger-' + value);
        });
        el.setAttribute('data-tabs-ready','true');
      })(document.currentScript.previousElementSibling);
    """)}</script>
    """
  end

  attr :class, :string, default: nil
  attr :"aria-label", :string, default: nil
  slot :inner_block, required: true

  def tabs_list(assigns) do
    ~H"""
    <div
      role="tablist"
      aria-label={assigns[:"aria-label"]}
      data-slot="tabs-list"
      class={[
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :value, :string, required: true
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def tabs_trigger(assigns) do
    ~H"""
    <button
      type="button"
      role="tab"
      data-slot="tabs-trigger"
      data-tab-trigger={@value}
      disabled={@disabled}
      class={[
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all",
        "hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm",
        "dark:aria-selected:border-input dark:aria-selected:bg-input/30 dark:aria-selected:text-foreground",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end

  attr :value, :string, required: true
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def tabs_content(assigns) do
    ~H"""
    <div
      role="tabpanel"
      data-slot="tabs-content"
      data-tab-panel={@value}
      tabindex="0"
      class={[
        "flex-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end
end
