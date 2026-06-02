defmodule ShadcnHtmx.Components.LoadMore do
  @moduledoc """
  Load More — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A self-replacing pagination trigger. It appends the next page and swaps a
  fresh trigger into its place (`hx-swap="outerHTML"`); when the server omits
  the trigger from its response, the chain ends. Two modes:

    * `trigger="click"` — a real `<button>`. Works with no JS (it's a plain
      button); htmx upgrades the click into a request.
    * `trigger="intersect"` / `trigger="revealed"` — a scroll sentinel that
      fires when it enters the viewport (IntersectionObserver under the hood).
      Use `intersect` inside an `overflow-y: scroll` container, `revealed`
      for the page viewport.

  Sources (read, not copied) — see registry/ui/load-more.tsx:
    repos/htmx/.../patterns/01-loading/01-click-to-load.md
    repos/htmx/.../patterns/01-loading/02-infinite-scroll.md
    repos/htmx/.../reference/01-attributes/{06-hx-trigger,07-hx-swap,19-hx-indicator}.md
    repos/mdn/.../web/api/intersection_observer_api/index.md

  ## Examples

      <.load_more href={~p"/comments?page=2"} label="Show more comments" />

      <.load_more href={~p"/contacts?page=2"} trigger="intersect" />
  """

  use Phoenix.Component

  attr :href, :string, default: nil
  attr :trigger, :string, default: "click", values: ~w(click intersect revealed)
  attr :label, :string, default: "Load more"
  attr :"aria-label", :string, default: nil
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def load_more(assigns) do
    ~H"""
    <%= if @trigger in ["intersect", "revealed"] do %>
      <div
        data-slot="load-more"
        data-trigger={@trigger}
        role="status"
        aria-label={assigns[:"aria-label"] || "Loading more"}
        hx-get={@href}
        hx-trigger={if @trigger == "intersect", do: "intersect once", else: "revealed"}
        hx-swap="outerHTML"
        class={["flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground", @class]}
        {@rest}
      >
        <%= if @inner_block != [] do %>
          {render_slot(@inner_block)}
        <% else %>
          <span
            class="htmx-indicator size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            aria-hidden="true"
          />
          Loading more…
        <% end %>
      </div>
    <% else %>
      <button
        type="button"
        data-slot="load-more"
        data-trigger="click"
        disabled={@disabled}
        aria-label={assigns[:"aria-label"]}
        hx-get={@href}
        hx-trigger="click"
        hx-target="this"
        hx-swap="outerHTML"
        class={[
          "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap outline-none transition-all",
          "text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70",
          @class
        ]}
        {@rest}
      >
        <span
          class="htmx-indicator size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
          aria-hidden="true"
        />
        <%= if @inner_block != [] do %>
          {render_slot(@inner_block)}
        <% else %>
          {@label}
        <% end %>
      </button>
    <% end %>
    """
  end
end
