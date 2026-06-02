defmodule ShadcnHtmx.Components.ScrollProgress do
  @moduledoc """
  Scroll Progress — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/scroll-progress.tsx. A reading-position bar whose fill
  tracks how far the user has scrolled the page (or a named scroller). This is
  DISTINCT from Progress (value-driven via aria-valuenow) — here there is no
  value, just scroll position the user already controls.

  Built entirely on CSS scroll-driven animations — ZERO JavaScript, no scroll
  listeners:
    - animation-timeline: scroll(root block) ties the fill to the page scroller
      repos/mdn/.../css/reference/properties/animation-timeline/scroll
      repos/mdn/.../css/reference/properties/animation-timeline
    - a named timeline (scroll-timeline-name on the scroller, referenced as a
      <dashed-ident>) drives progress from any scroll container
      repos/mdn/.../css/reference/properties/scroll-timeline-name
    - module overview: repos/mdn/.../css/guides/scroll-driven_animations

  The fill keyframe (scn-scroll-progress: scaleX(0)->scaleX(1)) + the default
  animation-timeline live in app/styles/input.css keyed on data-slot, with a
  prefers-reduced-motion fallback. The bar is decorative (aria-hidden) — it
  mirrors scroll position the user already commands.

  ## Examples

      <.scroll_progress />                        # tracks the page
      <.scroll_progress position="bottom" />
      <.scroll_progress timeline="--article" />   # named scroller
  """

  use Phoenix.Component

  attr :position, :string, default: "top", values: ~w(top bottom)
  attr :timeline, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  def scroll_progress(assigns) do
    edge = if assigns.position == "bottom", do: "bottom-0", else: "top-0"
    assigns = assign(assigns, :edge, edge)

    ~H"""
    <div
      data-slot="scroll-progress"
      data-position={@position}
      aria-hidden="true"
      class={[
        "pointer-events-none fixed inset-x-0 z-50 h-1 w-full overflow-hidden bg-primary/15",
        @edge,
        @class
      ]}
      {@rest}
    >
      <div
        data-slot="scroll-progress-indicator"
        style={if @timeline, do: "animation-timeline: #{@timeline}"}
        class="h-full w-full origin-left bg-primary"
      />
    </div>
    """
  end
end
