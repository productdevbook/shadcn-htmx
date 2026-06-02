defmodule ShadcnHtmx.Components.Collapsible do
  @moduledoc """
  Collapsible — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<details>` + `<summary>` single disclosure (WAI-ARIA Disclosure
  pattern). Enter/Space toggle, focusable summary, and the browser-managed
  aria-expanded are all native — zero JS.

  Distinct from accordion: a standalone show/hide, not a group, so there is
  no `name` attribute and no exclusive grouping.

  ## Examples

      <.collapsible open>
        <.collapsible_trigger>Can I use this without JS?</.collapsible_trigger>
        <.collapsible_content>Yes — it is native &lt;details&gt;/&lt;summary&gt;.</.collapsible_content>
      </.collapsible>
  """

  use Phoenix.Component

  attr :open, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def collapsible(assigns) do
    ~H"""
    <details
      data-slot="collapsible"
      data-disabled={@disabled && "true"}
      open={@open}
      class={[
        "w-full",
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

  def collapsible_trigger(assigns) do
    ~H"""
    <summary
      data-slot="collapsible-trigger"
      class={[
        "flex cursor-pointer items-center justify-between gap-4 rounded-md py-2 text-left text-sm font-medium",
        "transition-all outline-none select-none marker:hidden hover:underline",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "list-none [&::-webkit-details-marker]:hidden",
        "[details[open]>&_[data-slot=collapsible-chevron]]:rotate-180",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
      <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        data-slot="collapsible-chevron"
        class="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200"
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

  def collapsible_content(assigns) do
    ~H"""
    <div data-slot="collapsible-content" class={["overflow-hidden pt-2 pb-1 text-sm", @class]} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end
end
