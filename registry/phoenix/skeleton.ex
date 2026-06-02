defmodule ShadcnHtmx.Components.Skeleton do
  @moduledoc """
  Skeleton — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Visual loading placeholder with role="status" + aria-busy + pulse
  animation. Pair with htmx; once content swaps in, the skeleton DOM
  is replaced wholesale.

  ## Examples

      <.skeleton class="h-4 w-64" aria-label="Loading row" />
  """

  use Phoenix.Component

  attr :"aria-label", :string, default: "Loading"
  attr :class, :string, default: nil
  attr :rest, :global

  def skeleton(assigns) do
    ~H"""
    <div
      role="status"
      aria-busy="true"
      aria-label={assigns[:"aria-label"]}
      data-slot="skeleton"
      class={["animate-pulse rounded-md bg-muted", @class]}
      {@rest}
    />
    """
  end
end
