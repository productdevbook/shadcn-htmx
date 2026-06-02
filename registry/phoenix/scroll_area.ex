defmodule ShadcnHtmx.Components.ScrollArea do
  @moduledoc """
  Scroll Area — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/scroll-area.tsx.

  A constrained-overflow region: content taller (or wider) than the box
  scrolls NATIVELY, with a themed scrollbar and optional top/bottom fade
  masks that appear only while more content can scroll in that direction.
  Zero JavaScript — the masks are driven by CSS `@container scroll-state()`.

  Built on:
    * CSS overflow + the web.dev a11y contract (a scroll region needs
      `tabindex="0"` + `role="region"` + an accessible name):
      repos/web.dev/src/site/content/en/learn/css/overflow/index.md
    * Tailwind v4 `scrollbar-thin` / `scrollbar-thumb-*` / `scrollbar-track-*`
      (standard `scrollbar-width` / `scrollbar-color`):
      repos/tailwindcss/packages/tailwindcss/src/utilities.ts:2230-2255
    * CSS `@container scroll-state(scrollable: top|bottom)` for the fade masks:
      repos/mdn/files/en-us/web/css/reference/at-rules/@container/index.md
      repos/mdn/files/en-us/web/css/guides/conditional_rules/container_scroll-state_queries/index.md

  The container-type + fade rules live in app/styles/input.css, scoped to
  `[data-slot="scroll-area"]`.

  ## Examples

      <.scroll_area aria-label="Changelog" class="h-72">
        <div class="p-4 text-sm">…lots of content…</div>
      </.scroll_area>

      <.scroll_area orientation="horizontal" fade={false} class="w-96">
        <div class="flex gap-3 p-4">…wide row…</div>
      </.scroll_area>
  """

  use Phoenix.Component

  @root "relative overflow-hidden rounded-md"

  @viewport_base "size-full scroll-smooth scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent " <>
                   "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-[inherit]"

  attr :orientation, :string, default: "vertical", values: ~w(vertical horizontal both)
  attr :fade, :boolean, default: true
  attr :class, :string, default: nil
  attr :viewport_class, :string, default: nil

  attr :rest, :global,
    include: ~w(id aria-label aria-labelledby)

  slot :inner_block, required: true

  def scroll_area(assigns) do
    assigns =
      assigns
      |> assign(:root, @root)
      |> assign(:viewport_base, @viewport_base)
      |> assign(:overflow, overflow_axis(assigns.orientation))

    ~H"""
    <div
      data-slot="scroll-area"
      data-orientation={@orientation}
      class={[@root, @class]}
      {@rest}
    >
      <div
        data-slot="scroll-area-viewport"
        data-scroll-area-viewport
        data-fade={if @fade, do: "true", else: nil}
        role="region"
        tabindex="0"
        class={[@viewport_base, @overflow, @viewport_class]}
      >
        <div
          :if={@fade}
          data-slot="scroll-area-fade"
          data-edge="start"
          aria-hidden="true"
          class="pointer-events-none sticky z-[1] opacity-0 transition-opacity duration-200"
        />
        {render_slot(@inner_block)}
        <div
          :if={@fade}
          data-slot="scroll-area-fade"
          data-edge="end"
          aria-hidden="true"
          class="pointer-events-none sticky z-[1] opacity-0 transition-opacity duration-200"
        />
      </div>
    </div>
    """
  end

  defp overflow_axis("horizontal"), do: "overflow-x-auto overflow-y-hidden"
  defp overflow_axis("both"), do: "overflow-auto"
  defp overflow_axis(_vertical), do: "overflow-y-auto overflow-x-hidden"
end
