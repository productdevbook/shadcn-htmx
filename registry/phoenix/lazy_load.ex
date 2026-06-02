defmodule ShadcnHtmx.Components.LazyLoad do
  @moduledoc """
  Lazy Load — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A deferred-content container. It renders a placeholder immediately, then
  fetches its own contents after the page paints (`hx-get` + `hx-trigger="load"`)
  and swaps them in. `reserve` sets `min-height` so the swap does not shift the
  page (Cumulative Layout Shift). Pair it with `<.skeleton>` for slow dashboard
  panels or per-tab content.

    * `trigger="load"` — fires immediately when the element enters the DOM.
    * `trigger="revealed"` — fires when it scrolls into the page viewport.
    * `trigger="intersect"` — fires once inside an `overflow-y: scroll`
      container (`intersect once`).
    * `swap="innerHTML"` (default) keeps this reserved-space wrapper; the server
      response must NOT repeat `hx-trigger="load"` or it loops. `swap="outerHTML"`
      replaces the wrapper wholesale.

  Sources (read, not copied) — see registry/ui/lazy-load.tsx:
    repos/htmx/.../patterns/01-loading/03-lazy-load.md
    repos/htmx/.../reference/01-attributes/{01-hx-get,06-hx-trigger,07-hx-swap}.md
    repos/mdn/.../web/accessibility/aria/reference/attributes/aria-busy/index.md
    repos/mdn/.../web/api/intersection_observer_api/index.md

  ## Examples

      <.lazy_load src={~p"/dashboard/sales"} reserve="12rem" aria-label="Loading sales" />

      <.lazy_load src={~p"/comments"} trigger="revealed" reserve="8rem" />
  """

  use Phoenix.Component

  attr :src, :string, default: nil
  attr :trigger, :string, default: "load", values: ~w(load revealed intersect)
  attr :swap, :string, default: "innerHTML", values: ~w(innerHTML outerHTML)
  attr :reserve, :string, default: nil
  attr :"aria-label", :string, default: "Loading"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def lazy_load(assigns) do
    ~H"""
    <div
      data-slot="lazy-load"
      data-trigger={@trigger}
      role="status"
      aria-busy="true"
      aria-label={assigns[:"aria-label"]}
      hx-get={@src}
      hx-trigger={
        case @trigger do
          "intersect" -> "intersect once"
          "revealed" -> "revealed"
          _ -> "load"
        end
      }
      hx-swap={@swap}
      style={@reserve && "min-height:#{@reserve}"}
      class={["flex w-full items-center justify-center text-sm text-muted-foreground", @class]}
      {@rest}
    >
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <span class="flex items-center gap-2">
          <span
            class="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            aria-hidden="true"
          />
          Loading…
        </span>
      <% end %>
    </div>
    """
  end
end
