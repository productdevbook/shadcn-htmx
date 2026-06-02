defmodule ShadcnHtmx.Components.Carousel do
  @moduledoc """
  Carousel — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/carousel.tsx. A native CSS scroll-snap slideshow:
  five function components — `carousel`, `carousel_content`, `carousel_item`,
  `carousel_previous`, `carousel_next`. The scroll itself is native
  (snap-x / snap-mandatory / snap-center); public/site.js owns the live
  scrollBy() + Prev/Next disabled contract (keyed on data-slot="carousel").

  Accessibility follows the WAI-ARIA APG Carousel pattern (Basic carousel):
  role="group" + aria-roledescription="carousel" on the container, role="group"
  + aria-roledescription="slide" on each item, real <button> prev/next.

  ## Examples

      <.carousel id="gallery" aria-label="Featured photos">
        <.carousel_content>
          <.carousel_item><img src="…" alt="…" /></.carousel_item>
          <.carousel_item><img src="…" alt="…" /></.carousel_item>
        </.carousel_content>
        <.carousel_previous />
        <.carousel_next />
      </.carousel>
  """

  use Phoenix.Component

  attr :id, :string, required: true
  # APG: since aria-roledescription is "carousel", the name must NOT contain
  # the word "carousel".
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def carousel(assigns) do
    ~H"""
    <section
      id={@id}
      data-slot="carousel"
      data-carousel
      role="group"
      aria-roledescription="carousel"
      aria-label={assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      class={["group/carousel relative", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </section>
    <script>{Phoenix.HTML.raw(~s"""
      (function(el){
        var content = el.querySelector('[data-slot="carousel-content"]');
        if (content){
          if (!content.id) content.id = el.id + '-content';
          var items = content.querySelectorAll('[data-slot="carousel-item"]');
          var total = items.length;
          items.forEach(function(it, i){
            if (!it.getAttribute('aria-label')) it.setAttribute('aria-label', (i+1)+' of '+total);
          });
          el.querySelectorAll('[data-carousel-prev],[data-carousel-next]').forEach(function(b){
            b.setAttribute('aria-controls', content.id);
          });
          var prev = el.querySelector('[data-carousel-prev]');
          if (prev) prev.disabled = content.scrollLeft <= 0;
        }
        el.setAttribute('data-carousel-ready','true');
      })(document.currentScript.previousElementSibling);
    """)}</script>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def carousel_content(assigns) do
    ~H"""
    <div
      data-slot="carousel-content"
      aria-atomic="false"
      aria-live="polite"
      tabindex="0"
      class={[
        "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scrollbar-none",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-lg",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def carousel_item(assigns) do
    ~H"""
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      aria-label={assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      class={["min-w-0 shrink-0 grow-0 basis-full snap-center", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :"aria-label", :string, default: "Previous slide"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def carousel_previous(assigns) do
    ~H"""
    <button
      type="button"
      data-slot="carousel-previous"
      data-carousel-prev
      aria-label={assigns[:"aria-label"]}
      class={[
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-all outline-none",
        "hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "absolute top-1/2 -left-3 -translate-y-1/2",
        @class
      ]}
      {@rest}
    >
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      <% end %>
    </button>
    """
  end

  attr :"aria-label", :string, default: "Next slide"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def carousel_next(assigns) do
    ~H"""
    <button
      type="button"
      data-slot="carousel-next"
      data-carousel-next
      aria-label={assigns[:"aria-label"]}
      class={[
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-all outline-none",
        "hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "absolute top-1/2 -right-3 -translate-y-1/2",
        @class
      ]}
      {@rest}
    >
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      <% end %>
    </button>
    """
  end
end
