defmodule ShadcnHtmx.Components.ExclusiveAccordion do
  @moduledoc """
  Exclusive Accordion — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.
  Mirrors registry/ui/exclusive-accordion.tsx EXACTLY.

  The scriptless single-open accordion. Several `<details>` elements share one
  `name` attribute, so the browser keeps exactly one open at a time — opening
  one auto-closes the others. ZERO JavaScript: no boot script, no site.js. Per
  the HTML spec, if multiple grouped items carry `open`, only the first in
  source order renders open.

  Ref: repos/mdn/files/en-us/web/html/reference/elements/details (name)

  ## Examples

      <.exclusive_accordion name="faq">
        <.exclusive_accordion_item name="faq" value="q1" open>
          <.exclusive_accordion_trigger>What's htmx?</.exclusive_accordion_trigger>
          <.exclusive_accordion_content>Hypermedia-driven HTML extensions.</.exclusive_accordion_content>
        </.exclusive_accordion_item>
      </.exclusive_accordion>
  """

  use Phoenix.Component

  attr :name, :string, required: true
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def exclusive_accordion(assigns) do
    ~H"""
    <div
      data-slot="exclusive-accordion"
      data-name={@name}
      class={["w-full", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :name, :string, required: true
  attr :value, :string, default: nil
  attr :open, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def exclusive_accordion_item(assigns) do
    ~H"""
    <details
      data-slot="exclusive-accordion-item"
      data-value={@value}
      data-disabled={@disabled && "true"}
      name={@name}
      open={@open}
      class={[
        "border-b last:border-b-0",
        @disabled && "pointer-events-none opacity-50",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </details>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def exclusive_accordion_trigger(assigns) do
    ~H"""
    <summary
      data-slot="exclusive-accordion-trigger"
      class={[
        "flex cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium",
        "transition-all outline-none select-none marker:hidden hover:underline",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "list-none [&::-webkit-details-marker]:hidden",
        "[details[open]>&_[data-slot=exclusive-accordion-chevron]]:rotate-180",
        @class
      ]}
    >
      {render_slot(@inner_block)}
      <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        data-slot="exclusive-accordion-chevron"
        class="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def exclusive_accordion_content(assigns) do
    ~H"""
    <div data-slot="exclusive-accordion-content" class={["overflow-hidden pt-0 pb-4 text-sm", @class]}>
      {render_slot(@inner_block)}
    </div>
    """
  end
end
