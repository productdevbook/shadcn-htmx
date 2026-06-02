defmodule ShadcnHtmx.Components.Breadcrumb do
  @moduledoc """
  Breadcrumb — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A `<nav>` landmark with `aria-label` wrapping an ordered list of links.
  Zero JS — a breadcrumb is just a list of links (the WAI-ARIA APG lists
  keyboard interaction as "Not applicable"). The current page is a plain
  `<span aria-current="page">`, not a link. Separators / ellipsis are
  `aria-hidden`.

  Mirrors registry/ui/breadcrumb.tsx EXACTLY (elements, ARIA, data-slot,
  classes). APG pattern:
  repos/aria-practices/content/patterns/breadcrumb/breadcrumb-pattern.html

  ## Examples

      <.breadcrumb aria-label="Breadcrumb">
        <.breadcrumb_list>
          <.breadcrumb_item>
            <.breadcrumb_link href={~p"/"}>Home</.breadcrumb_link>
          </.breadcrumb_item>
          <.breadcrumb_separator />
          <.breadcrumb_item>
            <.breadcrumb_link href={~p"/components"}>Components</.breadcrumb_link>
          </.breadcrumb_item>
          <.breadcrumb_separator />
          <.breadcrumb_item>
            <.breadcrumb_page>Breadcrumb</.breadcrumb_page>
          </.breadcrumb_item>
        </.breadcrumb_list>
      </.breadcrumb>
  """

  use Phoenix.Component

  attr :"aria-label", :string, default: "Breadcrumb"
  # Id of a visible heading that labels the landmark. When set, that heading is
  # the name source and the defaulted aria-label is NOT emitted, so the <nav>
  # never carries two competing names. APG: the landmark "is labelled via
  # aria-label or aria-labelledby".
  # repos/aria-practices/content/patterns/breadcrumb/breadcrumb-pattern.html
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def breadcrumb(assigns) do
    ~H"""
    <nav
      data-slot="breadcrumb"
      aria-label={if assigns[:"aria-labelledby"], do: nil, else: assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      class={[@class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </nav>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def breadcrumb_list(assigns) do
    ~H"""
    <ol
      data-slot="breadcrumb-list"
      class={[
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </ol>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def breadcrumb_item(assigns) do
    ~H"""
    <li data-slot="breadcrumb-item" class={["inline-flex items-center gap-1.5", @class]} {@rest}>
      {render_slot(@inner_block)}
    </li>
    """
  end

  attr :href, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def breadcrumb_link(assigns) do
    ~H"""
    <a
      href={@href}
      data-slot="breadcrumb-link"
      class={[
        "transition-colors hover:text-foreground",
        "focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </a>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def breadcrumb_page(assigns) do
    ~H"""
    <span data-slot="breadcrumb-page" aria-current="page" class={["font-normal text-foreground", @class]}>
      {render_slot(@inner_block)}
    </span>
    """
  end

  attr :class, :string, default: nil
  # :rest forwards data-* (a global attribute valid on every element) so callers
  # can attach CSS/JS hooks, matching the other subcomponents.
  # repos/mdn/files/en-us/web/html/reference/global_attributes/index.md
  attr :rest, :global
  slot :inner_block

  def breadcrumb_separator(assigns) do
    ~H"""
    <li data-slot="breadcrumb-separator" aria-hidden="true" class={["[&>svg]:size-3.5", @class]} {@rest}>
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      <% end %>
    </li>
    """
  end

  attr :class, :string, default: nil
  # :rest forwards data-* (a global attribute valid on every element) so callers
  # can attach CSS/JS hooks, matching the other subcomponents.
  # repos/mdn/files/en-us/web/html/reference/global_attributes/index.md
  attr :rest, :global

  def breadcrumb_ellipsis(assigns) do
    ~H"""
    <span
      data-slot="breadcrumb-ellipsis"
      aria-hidden="true"
      class={["flex size-9 items-center justify-center", @class]}
      {@rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span class="sr-only">More</span>
    </span>
    """
  end
end
