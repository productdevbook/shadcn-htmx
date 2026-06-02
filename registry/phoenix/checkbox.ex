defmodule ShadcnHtmx.Components.Checkbox do
  @moduledoc """
  Checkbox — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<input type="checkbox">` styled with shadcn polish. Pair with the
  Label component for the click-target / accessible-name pattern.

  ## Examples

      <label class="flex items-center gap-2">
        <.checkbox name="terms" required />
        I agree to the terms.
      </label>

      <.checkbox name="newsletter" checked
        hx-post="/preferences/newsletter" hx-trigger="change" />
  """

  use Phoenix.Component

  @input_base "peer size-4 shrink-0 appearance-none rounded-[4px] border border-input bg-background shadow-xs " <>
                "transition-shadow outline-none " <>
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
                "disabled:cursor-not-allowed disabled:opacity-50 " <>
                "checked:border-primary checked:bg-primary " <>
                "indeterminate:border-primary indeterminate:bg-primary " <>
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
                "dark:bg-input/30"

  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-vals hx-include
         id name value checked required disabled readonly form
         aria-label aria-labelledby aria-describedby aria-invalid)

  def checkbox(assigns) do
    assigns = assign(assigns, :input_base, @input_base)

    ~H"""
    <span class="relative inline-flex size-4 shrink-0 align-middle">
      <input
        type="checkbox"
        class={[@input_base, @class]}
        data-slot="checkbox"
        {@rest}
      />
      <svg
        class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-checked:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <svg
        class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-indeterminate:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
    """
  end
end
