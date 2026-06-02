defmodule ShadcnHtmx.Components.RangeSlider do
  @moduledoc """
  Range Slider (two-thumb) — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Two native `<input type="range">` overlaid on one track. The platform
  gives each thumb role=slider, aria-valuemin/max/now and the full
  arrow/Home/End/PageUp/Down keyboard contract for free (WAI-ARIA APG
  Multi-Thumb Slider pattern). Each input is form-submittable
  (name=min / name=max). site.js (keyed on data-slot="range-slider")
  clamps the thumbs so they can't cross and keeps the --range-min /
  --range-max CSS variables in sync for the coloured fill.

  ## Examples

      <.range_slider min={0} max={500} step={10}
        min_value={120} max_value={380}
        min_label="Minimum price" max_label="Maximum price" />
  """

  use Phoenix.Component

  attr :id, :string, default: nil
  attr :min_name, :string, default: "min"
  attr :max_name, :string, default: "max"
  attr :min_value, :integer, default: nil
  attr :max_value, :integer, default: nil
  attr :min, :integer, default: 0
  attr :max, :integer, default: 100
  attr :step, :integer, default: nil
  # list: id of a <datalist> for native tick marks on type=range (MDN range ref)
  attr :list, :string, default: nil
  attr :disabled, :boolean, default: false
  attr :form, :string, default: nil
  attr :min_label, :string, default: "Minimum"
  attr :max_label, :string, default: "Maximum"
  attr :min_valuetext, :string, default: nil
  attr :max_valuetext, :string, default: nil
  attr :class, :string, default: nil

  attr :rest, :global, include: ~w(aria-labelledby aria-describedby)

  @input_class "pointer-events-none absolute inset-x-0 top-1/2 m-0 h-4 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm focus-visible:[&::-webkit-slider-thumb]:ring-[3px] focus-visible:[&::-webkit-slider-thumb]:ring-ring/50 focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-ring)_50%,transparent)] disabled:cursor-not-allowed"

  def range_slider(assigns) do
    lo = assigns.min_value || assigns.min
    hi = assigns.max_value || assigns.max
    span = if assigns.max - assigns.min == 0, do: 1, else: assigns.max - assigns.min

    assigns =
      assigns
      |> assign(:lo, lo)
      |> assign(:hi, hi)
      |> assign(:min_pct, (lo - assigns.min) / span * 100)
      |> assign(:max_pct, (hi - assigns.min) / span * 100)
      |> assign(:input_class, @input_class)

    ~H"""
    <span
      data-slot="range-slider"
      data-disabled={@disabled && "true"}
      style={"--range-min:#{@min_pct}%;--range-max:#{@max_pct}%"}
      class={[
        "relative flex h-4 w-full touch-none items-center select-none",
        @disabled && "opacity-50",
        @class
      ]}
      {@rest}
    >
      <span
        class="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted"
        aria-hidden="true"
      >
      </span>
      <span
        class="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary [left:var(--range-min,0%)] [right:calc(100%-var(--range-max,100%))]"
        aria-hidden="true"
      >
      </span>
      <input
        type="range"
        data-range="min"
        id={@id && "#{@id}-min"}
        name={@min_name}
        value={@lo}
        min={@min}
        max={@max}
        step={@step}
        list={@list}
        disabled={@disabled}
        form={@form}
        aria-label={@min_label}
        aria-valuetext={@min_valuetext}
        class={@input_class}
      />
      <input
        type="range"
        data-range="max"
        id={@id && "#{@id}-max"}
        name={@max_name}
        value={@hi}
        min={@min}
        max={@max}
        step={@step}
        list={@list}
        disabled={@disabled}
        form={@form}
        aria-label={@max_label}
        aria-valuetext={@max_valuetext}
        class={@input_class}
      />
    </span>
    """
  end
end
