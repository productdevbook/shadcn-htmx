defmodule ShadcnHtmx.Components.Accordion do
  @moduledoc """
  Accordion — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<details>` + `<summary>`. Single-expand mode (`type="single"`)
  uses the new HTML `name` attribute which makes the group exclusive
  with zero JS. Multi-expand mode just omits the name.

  Keyboard nav (arrows, Home/End) lives in public/site.js.

  ## Examples

      <.accordion id="faq" type="single">
        <.accordion_item value="q1" open>
          <.accordion_trigger>What's htmx?</.accordion_trigger>
          <.accordion_content>Hypermedia-driven HTML extensions.</.accordion_content>
        </.accordion_item>
      </.accordion>
  """

  use Phoenix.Component

  attr :id, :string, required: true
  attr :type, :string, default: "multiple", values: ~w(single multiple)
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def accordion(assigns) do
    ~H"""
    <div
      id={@id}
      data-slot="accordion"
      data-accordion
      data-type={@type}
      data-group-name={if @type == "single", do: @id}
      class={["w-full", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :value, :string, required: true
  attr :open, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  # Forward hx-* / global attributes so the native `toggle` event <details>
  # fires can drive zero-JS lazy loading: hx-trigger="toggle once" hx-get=...
  # (toggle event: HTMLElement; hx-trigger accepts any DOM event).
  attr :rest, :global
  slot :inner_block, required: true

  def accordion_item(assigns) do
    ~H"""
    <details
      data-slot="accordion-item"
      data-value={@value}
      data-disabled={@disabled && "true"}
      open={@open}
      class={[
        "border-b last:border-b-0",
        @disabled && "pointer-events-none opacity-50",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </details>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def accordion_trigger(assigns) do
    ~H"""
    <summary
      data-slot="accordion-trigger"
      class={[
        "flex cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium",
        "transition-all outline-none select-none marker:hidden hover:underline",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "list-none [&::-webkit-details-marker]:hidden",
        "[details[open]>&_[data-slot=accordion-chevron]]:rotate-180",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
      <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        data-slot="accordion-chevron"
        class="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def accordion_content(assigns) do
    ~H"""
    <div data-slot="accordion-content" class={["overflow-hidden pt-0 pb-4 text-sm", @class]} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end
end
