defmodule ShadcnHtmx.Components.Pagination do
  @moduledoc """
  Pagination — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A `<nav>` landmark with `aria-label`. Active page carries
  `aria-current="page"`. Previous/Next have built-in aria-labels
  so AT users hear "Previous page" instead of "<".

  ## Examples

      <.pagination aria-label="Articles">
        <.pagination_prev href={~p"/articles?page=1"} />
        <.pagination_page n={1} href={~p"/articles?page=1"} />
        <.pagination_page n={2} active />
        <.pagination_page n={3} href={~p"/articles?page=3"} />
        <.pagination_ellipsis />
        <.pagination_next href={~p"/articles?page=3"} />
      </.pagination>
  """

  use Phoenix.Component

  attr :"aria-label", :string, default: "Pagination"
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def pagination(assigns) do
    ~H"""
    <nav data-slot="pagination" aria-label={assigns[:"aria-label"]}
         class={["mx-auto flex w-full justify-center", @class]}>
      <ul class="flex flex-row items-center gap-1">{render_slot(@inner_block)}</ul>
    </nav>
    """
  end

  @base "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors " <>
          "hover:bg-accent hover:text-accent-foreground " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"

  attr :n, :integer, required: true
  attr :href, :string, default: nil
  attr :active, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global

  def pagination_page(assigns) do
    on = if assigns.active, do: "bg-primary text-primary-foreground hover:bg-primary/90", else: ""
    assigns = assign(assigns, on: on, base: @base)

    ~H"""
    <li>
      <a
        href={@href}
        data-slot="pagination-link"
        aria-current={if @active, do: "page"}
        class={[@base, @on, @class]}
        {@rest}
      >
        {@n}
      </a>
    </li>
    """
  end

  attr :href, :string, default: nil
  attr :disabled, :boolean, default: false
  # WHATWG sequence link type, emitted on the enabled <a>. Overridable.
  attr :rel, :string, default: "prev"
  attr :class, :string, default: nil
  attr :rest, :global

  def pagination_prev(assigns) do
    assigns = assign(assigns, base: @base)

    # Disabled renders a native <button disabled>, not an <a>: per the
    # aria-disabled spec, aria-disabled alone does not suppress keyboard
    # activation, and the native disabled attr is invalid on <a>.
    ~H"""
    <li>
      <button
        :if={@disabled}
        type="button"
        data-slot="pagination-prev"
        aria-label="Previous page"
        aria-disabled="true"
        disabled
        class={[@base, "gap-1 pl-2.5 pointer-events-none opacity-50", @class]}
        {@rest}
      >
        ‹ Previous
      </button>
      <a
        :if={!@disabled}
        href={@href}
        data-slot="pagination-prev"
        aria-label="Previous page"
        rel={@rel}
        class={[@base, "gap-1 pl-2.5", @class]}
        {@rest}
      >
        ‹ Previous
      </a>
    </li>
    """
  end

  attr :href, :string, default: nil
  attr :disabled, :boolean, default: false
  attr :rel, :string, default: "next"
  attr :class, :string, default: nil
  attr :rest, :global

  def pagination_next(assigns) do
    assigns = assign(assigns, base: @base)

    ~H"""
    <li>
      <button
        :if={@disabled}
        type="button"
        data-slot="pagination-next"
        aria-label="Next page"
        aria-disabled="true"
        disabled
        class={[@base, "gap-1 pr-2.5 pointer-events-none opacity-50", @class]}
        {@rest}
      >
        Next ›
      </button>
      <a
        :if={!@disabled}
        href={@href}
        data-slot="pagination-next"
        aria-label="Next page"
        rel={@rel}
        class={[@base, "gap-1 pr-2.5", @class]}
        {@rest}
      >
        Next ›
      </a>
    </li>
    """
  end

  def pagination_ellipsis(assigns) do
    ~H"""
    <li>
      <span data-slot="pagination-ellipsis" aria-hidden="true"
            class="flex h-9 w-9 items-center justify-center text-muted-foreground">…</span>
    </li>
    """
  end
end
