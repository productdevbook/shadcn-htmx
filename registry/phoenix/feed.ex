defmodule ShadcnHtmx.Components.Feed do
  @moduledoc """
  Feed — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A `role="feed"` container of `role="article"` items, following the
  WAI-ARIA APG Feed pattern. A feed is a STRUCTURE, not a widget: screen
  readers stay in reading mode while the page loads content as the user
  scrolls. Each article is focusable (`tabindex="0"`) and carries
  `aria-posinset` / `aria-setsize` (use `-1` for an unknown total),
  `aria-labelledby` (its title) and `aria-describedby` (its primary
  content, so AT users can skim).

  The trailing sentinel uses htmx `hx-trigger="revealed"` + `hx-swap="outerHTML"`
  to load the next page (infinite scroll) — the response (next articles plus a
  fresh sentinel) replaces it, forming a self-extending chain.

  ## Examples

      <.feed aria-labelledby="feed-title">
        <.feed_article posinset={1} setsize={-1} labelledby="post-1-title"
                       describedby="post-1-body" id="post-1">
          <h3 id="post-1-title" class="font-semibold">Title</h3>
          <p id="post-1-body" class="mt-1 text-sm text-muted-foreground">Body…</p>
        </.feed_article>
        <.feed_sentinel href={~p"/feed/page?page=2"} />
      </.feed>
  """

  use Phoenix.Component

  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :busy, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def feed(assigns) do
    ~H"""
    <div
      role="feed"
      data-slot="feed"
      aria-label={!assigns[:"aria-labelledby"] && assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      aria-busy={@busy && "true"}
      class={["flex flex-col gap-4", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :posinset, :integer, required: true
  attr :setsize, :integer, required: true
  attr :labelledby, :string, required: true
  attr :describedby, :string, default: nil
  # 0 (default) or -1 — MDN's feed role allows each article to be focusable
  # "with tabindex of 0 or -1"; pass -1 for a roving-tabindex feed.
  attr :tabindex, :integer, default: 0
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def feed_article(assigns) do
    ~H"""
    <article
      role="article"
      data-slot="feed-article"
      tabindex={@tabindex}
      aria-posinset={@posinset}
      aria-setsize={@setsize}
      aria-labelledby={@labelledby}
      aria-describedby={@describedby}
      class={[
        "rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </article>
    """
  end

  attr :href, :string, default: nil
  attr :trigger, :string, default: "revealed"
  # aria-busy="true" on the in-flight placeholder while a batch loads; the
  # outerHTML swap clears it by replacing this element (APG: aria-busy must be
  # false once the operation completes).
  attr :busy, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def feed_sentinel(assigns) do
    ~H"""
    <div
      data-slot="feed-sentinel"
      hx-get={@href}
      hx-trigger={@trigger}
      hx-swap="outerHTML"
      aria-busy={@busy && "true"}
      class={["flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground", @class]}
      {@rest}
    >
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <span
          aria-hidden="true"
          class="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
        />
        Loading more…
      <% end %>
    </div>
    """
  end
end
