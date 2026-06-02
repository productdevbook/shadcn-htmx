defmodule ShadcnHtmx.Components.Slider do
  @moduledoc """
  Slider — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<input type="range">` styled via Tailwind. The platform handles
  role=slider, aria-valuemin/max/now, arrow/Home/End/PageUp/Down — we
  just provide the visual track + thumb.

  ## Examples

      <.slider name="volume" value={50} min={0} max={100} aria-label="Volume" />
  """

  use Phoenix.Component

  attr :id, :string, default: nil
  attr :name, :string, default: nil
  attr :value, :integer, default: nil
  attr :min, :integer, default: 0
  attr :max, :integer, default: 100
  # :any so step accepts a number or the special string "any" (continuous
  # range) — MDN input/range "Setting step to any".
  attr :step, :any, default: nil
  attr :disabled, :boolean, default: false
  attr :required, :boolean, default: false
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(form list aria-label aria-labelledby aria-describedby aria-valuetext)

  def slider(assigns) do
    ~H"""
    <span
      data-slot="slider"
      data-disabled={@disabled && "true"}
      class={[
        "relative flex w-full touch-none items-center select-none",
        @disabled && "opacity-50",
        @class
      ]}
    >
      <input
        type="range"
        id={@id}
        name={@name}
        value={@value}
        min={@min}
        max={@max}
        step={@step}
        disabled={@disabled}
        required={@required}
        class={[
          "h-2 w-full cursor-pointer appearance-none bg-transparent outline-none",
          "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted",
          "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
          "focus-visible:[&::-webkit-slider-thumb]:ring-[3px] focus-visible:[&::-webkit-slider-thumb]:ring-ring/50",
          "disabled:cursor-not-allowed"
        ]}
        {@rest}
      />
    </span>
    """
  end
end
