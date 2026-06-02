defmodule ShadcnHtmx.Components.RadioGroup do
  @moduledoc """
  Radio group — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/radio-group.tsx. Native `<input type="radio">` grouped
  by `name` so the platform handles arrow-key navigation + focus management.

  APG: repos/aria-practices/content/patterns/radio/.

  ## Examples

      <.radio_group aria-label="Plan">
        <div class="flex items-center gap-2">
          <.radio_group_item value="free" name="plan" id="plan-free" checked />
          <.label for="plan-free">Free</.label>
        </div>
        <div class="flex items-center gap-2">
          <.radio_group_item value="pro" name="plan" id="plan-pro" />
          <.label for="plan-pro">Pro</.label>
        </div>
      </.radio_group>
  """

  use Phoenix.Component

  @input_base "peer aspect-square size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none " <>
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
                "disabled:cursor-not-allowed disabled:opacity-50 " <>
                "checked:border-primary " <>
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
                "dark:bg-input/30"

  attr :required, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :orientation, :string, default: nil, values: [nil, "horizontal", "vertical"]
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def radio_group(assigns) do
    ~H"""
    <div
      role="radiogroup"
      aria-required={@required && "true"}
      aria-disabled={@disabled && "true"}
      aria-orientation={@orientation}
      data-orientation={@orientation}
      data-slot="radio-group"
      class={[
        "grid gap-3 data-[orientation=horizontal]:grid-flow-col data-[orientation=horizontal]:auto-cols-max",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :value, :string, required: true
  attr :name, :string, required: true
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      # hx-* fire on the radio's change event (live filters, dependent panels).
      #   repos/htmx/www/content/attributes/hx-trigger.md
      # form: associate with a <form> rendered in a separate swap.
      # autocomplete: control cross-load checked-state persistence ("off").
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-vals hx-include
         id checked disabled required form autocomplete
         aria-label aria-labelledby aria-describedby aria-invalid)

  def radio_group_item(assigns) do
    assigns = assign(assigns, :input_base, @input_base)

    ~H"""
    <span class="relative inline-flex size-4 shrink-0 align-middle">
      <input
        type="radio"
        class={[@input_base, @class]}
        value={@value}
        name={@name}
        data-slot="radio-group-item"
        {@rest}
      />
      <span
        class="pointer-events-none absolute inset-0 m-auto size-2 hidden rounded-full bg-primary peer-checked:block"
        data-slot="radio-group-indicator"
        aria-hidden="true"
      >
      </span>
    </span>
    """
  end
end
