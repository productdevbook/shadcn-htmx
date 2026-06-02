defmodule ShadcnHtmx.Components.StickyHeader do
  @moduledoc """
  Sticky Header — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/sticky-header.tsx so a Phoenix project renders the same
  markup our docs site renders.

  A page / section / table header that pins on scroll AND visually reacts
  (shadow + solid background) the moment it becomes STUCK — with no
  IntersectionObserver sentinel. The browser drives the stuck state; zero JS.

  How it works (all native):

    * the root is `position: sticky; top: <top>` so the platform pins it to
      the top edge of its scroll container ancestor
      (repos/mdn/files/en-us/web/css/reference/properties/position/index.md);
    * the SAME element is a scroll-state query container
      (`container-type: scroll-state`), and a
      `@container scroll-state(stuck: top)` rule applies the stuck styling to
      its descendants
      (repos/mdn/.../css/guides/conditional_rules/container_scroll-state_queries/index.md,
       repos/mdn/files/en-us/web/css/reference/at-rules/@container/index.md).

  The descendant reveal styling lives in a `[data-slot="sticky-header"]`
  block in app/styles/input.css; opt a region in with the
  `<.sticky_header_bar>` slot wrapper (data-sticky-revealed).

  ## Examples

      <.sticky_header>
        <.sticky_header_bar class="flex h-14 items-center px-4">
          <span class="font-semibold">Inbox</span>
        </.sticky_header_bar>
      </.sticky_header>

      # Pin below a fixed app bar, as a sticky section title
      <.sticky_header as="header" top="4rem">
        <.sticky_header_bar class="px-4 py-2 font-medium">Today</.sticky_header_bar>
      </.sticky_header>
  """

  use Phoenix.Component

  @base "sticky z-30 bg-background/95 supports-[backdrop-filter]:bg-background/80 " <>
          "[container-type:scroll-state]"

  attr :as, :string, default: "header", values: ~w(div header section nav)
  attr :top, :string, default: "0"
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger id role)

  slot :inner_block, required: true

  def sticky_header(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <.dynamic_tag
      tag_name={@as}
      data-slot="sticky-header"
      class={[@base_class, @class]}
      style={"top:#{@top}"}
      {@rest}
    >
      {render_slot(@inner_block)}
    </.dynamic_tag>
    """
  end

  attr :as, :string, default: "div", values: ~w(div header nav)
  attr :class, :string, default: nil
  attr :rest, :global

  slot :inner_block, required: true

  def sticky_header_bar(assigns) do
    ~H"""
    <.dynamic_tag
      tag_name={@as}
      data-slot="sticky-header-bar"
      data-sticky-revealed=""
      class={["transition-shadow transition-colors duration-200", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </.dynamic_tag>
    """
  end
end
