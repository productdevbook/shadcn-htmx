defmodule ShadcnHtmx.Components.SkipLink do
  @moduledoc """
  Skip Link — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/skip-link.tsx so a Phoenix LiveView project renders the
  same markup our docs site renders. Works with plain HEEx templates too —
  htmx / data / aria attributes pass straight through via `:rest`.

  A "Skip to main content" link: the FIRST focusable element in the document,
  visually hidden until keyboard focus, that jumps focus to the page's main
  landmark. Pure platform — a native `<a href="#main">` with a CSS focus
  reveal, zero JavaScript.

  Place it as the very first child of `<body>`, before the header/nav, and give
  your main landmark the matching id (`<main id="main">`).

  ## Examples

      <.skip_link />
      <.skip_link href="#content">Skip to content</.skip_link>

  Accessibility contract — WAI-ARIA APG Landmark Regions practice:
  repos/aria-practices/content/practices/landmark-regions/landmark-regions-practice.html
  The `<a href>` gives the link role + Enter-to-activate + focus-jump for free.
  """

  use Phoenix.Component

  @base "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 " <>
          "focus:inline-flex focus:items-center focus:gap-2 focus:rounded-md " <>
          "focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium " <>
          "focus:text-primary-foreground focus:shadow-md focus:no-underline " <>
          "focus:outline-none focus:ring-[3px] focus:ring-ring/50"

  attr :href, :string, default: "#main"
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(id hx-get hx-boost)

  slot :inner_block

  def skip_link(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <a href={@href} class={[@base_class, @class]} data-slot="skip-link" {@rest}>
      {if @inner_block == [], do: "Skip to main content", else: render_slot(@inner_block)}
    </a>
    """
  end
end
