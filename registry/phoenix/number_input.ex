defmodule ShadcnHtmx.Components.NumberInput do
  @moduledoc """
  Number Input — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/number-input.tsx. The control is a native
  `<input type="number">`, so role=spinbutton, aria-valuenow/min/max, and the
  ArrowUp/ArrowDown stepping contract all come from the platform. The optional
  −/+ buttons call `stepDown()` / `stepUp()` through the shared handler in
  public/site.js (keyed on `data-slot="number-input"`).

  ## Examples

      <.number_input name="qty" value={1} min={0} max={10} aria-label="Quantity" />
      <.number_input name="price" min={0} step="0.01" inputmode="decimal" steppers={false} />

  See repos/mdn/files/en-us/web/html/reference/elements/input/number/index.md.
  """

  use Phoenix.Component

  @input_base "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs " <>
                "transition-[color,box-shadow] outline-none " <>
                "selection:bg-primary selection:text-primary-foreground " <>
                "placeholder:text-muted-foreground " <>
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " <>
                "md:text-sm dark:bg-input/30 " <>
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
                "[&.htmx-request]:opacity-70 " <>
                "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"

  @stepper_btn "inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors outline-none select-none " <>
                 "hover:text-foreground hover:bg-accent " <>
                 "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:relative focus-visible:z-10 " <>
                 "disabled:pointer-events-none disabled:opacity-50"

  attr :steppers, :boolean, default: true
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      # autocomplete: supported common attr on <input type=number> (MDN input/number).
      # aria-valuetext: human-readable spinbutton value (APG spinbutton pattern).
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-indicator hx-vals hx-include
         id name value placeholder min max step required readonly autofocus form list autocomplete inputmode
         aria-label aria-labelledby aria-describedby aria-valuetext aria-invalid aria-required)

  def number_input(assigns) do
    assigns =
      assigns
      |> assign(:input_base, @input_base)
      |> assign(:stepper_btn, @stepper_btn)

    ~H"""
    <div
      :if={@steppers}
      data-slot="number-input"
      data-disabled={@disabled && "true"}
      class={[
        "flex h-9 w-full min-w-0 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
        "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50",
        @class
      ]}
    >
      <button
        type="button"
        data-step="down"
        tabindex="-1"
        disabled={@disabled}
        aria-label="Decrease"
        title="Decrease"
        class={[@stepper_btn, "rounded-l-md border-r border-input"]}
      >
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M5 12h14" />
          </svg>
        </span>
      </button>
      <input
        type="number"
        disabled={@disabled}
        data-slot="number-input-field"
        class={[@input_base, "rounded-none border-0 text-center shadow-none focus-visible:ring-0"]}
        {@rest}
      />
      <button
        type="button"
        data-step="up"
        tabindex="-1"
        disabled={@disabled}
        aria-label="Increase"
        title="Increase"
        class={[@stepper_btn, "rounded-r-md border-l border-input"]}
      >
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </span>
      </button>
    </div>
    <input
      :if={!@steppers}
      type="number"
      disabled={@disabled}
      data-slot="number-input"
      class={[@input_base, @class]}
      {@rest}
    />
    """
  end
end
