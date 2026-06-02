defmodule ShadcnHtmx.Components.Sidebar do
  @moduledoc """
  Sidebar — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/sidebar.tsx. A responsive app-navigation sidebar: a
  fixed rail on wide screens that collapses to an off-canvas drawer on narrow
  screens. Nav links are real `<a href>`; open/close works WITHOUT JavaScript.

  LAYOUT is CSS grid (minmax rail / 1fr content — the "sidebar says" pattern).
  OPEN/CLOSE on narrow screens is the CSS `:target` pseudo-class (the web.dev
  Sidenav technique): the hamburger is an `<a href="#nav">`, the scrim/close is
  an `<a href="#">`. The responsive `:target` drawer transition lives in
  app/styles/input.css keyed off `data-slot="sidebar"`; a tiny site.js block
  adds Escape-to-close + focus as an enhancement.

    * repos/web.dev/.../patterns/layout/sidebar-says/index.md
    * repos/web.dev/.../patterns/components/sidenav/index.md
    * repos/mdn/files/en-us/web/css/reference/selectors/_colon_target/index.md
    * repos/mdn/files/en-us/web/accessibility/aria/reference/roles/navigation_role/index.md

  ## Examples

      <.sidebar_layout>
        <.sidebar_trigger sidebar_for="nav" label="Menu" />
        <.sidebar_scrim sidebar_for="nav" />
        <.sidebar id="nav" aria_label="Main">
          <div data-slot="sidebar-body" class="flex-1 overflow-y-auto px-2 py-2">
            <.sidebar_item href={~p"/"} current>Dashboard</.sidebar_item>
            <.sidebar_item href={~p"/settings"}>Settings</.sidebar_item>
          </div>
        </.sidebar>
        <main data-slot="sidebar-content" class="min-w-0 flex-1">…</main>
      </.sidebar_layout>
  """

  use Phoenix.Component

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def sidebar_layout(assigns) do
    ~H"""
    <div
      data-slot="sidebar-layout"
      class={["relative grid w-full grid-cols-1 [--sidebar-h:100svh] [min-height:var(--sidebar-h)] sm:grid-cols-[minmax(var(--sidebar-w,16rem),20rem)_minmax(0,1fr)]", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :sidebar_for, :string, required: true
  attr :label, :string, default: "Menu"
  attr :class, :string, default: nil
  attr :rest, :global

  def sidebar_trigger(assigns) do
    ~H"""
    <a
      href={"##{@sidebar_for}"}
      data-slot="sidebar-trigger"
      data-sidebar-open={@sidebar_for}
      aria-label={"Open #{@label}"}
      aria-controls={@sidebar_for}
      class={["inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:hidden", @class]}
      {@rest}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
        <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" />
      </svg>
      {@label}
    </a>
    """
  end

  attr :sidebar_for, :string, required: true
  attr :class, :string, default: nil
  attr :rest, :global

  def sidebar_scrim(assigns) do
    ~H"""
    <a
      href="#"
      data-slot="sidebar-scrim"
      data-sidebar-scrim-for={@sidebar_for}
      aria-label="Close navigation"
      tabindex="-1"
      class={["absolute inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden", @class]}
      {@rest}
    />
    """
  end

  attr :id, :string, required: true
  attr :aria_label, :string, default: nil
  attr :aria_labelledby, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def sidebar(assigns) do
    ~H"""
    <nav
      id={@id}
      data-slot="sidebar"
      tabindex="-1"
      aria-label={@aria_label}
      aria-labelledby={@aria_labelledby}
      class={["flex h-[var(--sidebar-h,100svh)] flex-col gap-2 border-r bg-card text-card-foreground max-sm:absolute max-sm:inset-y-0 max-sm:left-0 max-sm:z-50 max-sm:h-full max-sm:w-72 max-sm:max-w-[85vw] max-sm:shadow-lg sm:sticky sm:top-0", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </nav>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global

  def sidebar_close(assigns) do
    ~H"""
    <a
      href="#"
      data-slot="sidebar-close"
      aria-label="Close navigation"
      class={["absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:hidden", @class]}
      {@rest}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </a>
    """
  end

  attr :id, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def sidebar_group_label(assigns) do
    ~H"""
    <div
      id={@id}
      data-slot="sidebar-group-label"
      class={["px-3 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :href, :string, required: true
  attr :current, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def sidebar_item(assigns) do
    ~H"""
    <a
      href={@href}
      data-slot="sidebar-item"
      aria-current={@current && "page"}
      class={["flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground aria-[current=page]:hover:bg-primary", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </a>
    """
  end
end
