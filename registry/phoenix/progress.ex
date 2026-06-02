defmodule ShadcnHtmx.Components.Progress do
  @moduledoc """
  Progress — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  ARIA role="progressbar" with valuemin/max/now. Pass `value={nil}` for
  the indeterminate state (animated stripe).

  ## Examples

      <.progress value={42} aria-label="Upload progress" />
      <.progress aria-label="Loading" />     # indeterminate
  """

  use Phoenix.Component

  attr :value, :integer, default: nil
  attr :min, :integer, default: 0
  attr :max, :integer, default: 100
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :"aria-valuetext", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  def progress(assigns) do
    determinate = !is_nil(assigns.value)

    pct =
      if determinate,
        do: (assigns.value - assigns.min) / (assigns.max - assigns.min) * 100,
        else: 0

    assigns =
      assigns
      |> assign(:determinate, determinate)
      |> assign(:pct, pct)

    ~H"""
    <div
      role="progressbar"
      aria-label={assigns[:"aria-label"]}
      aria-labelledby={assigns[:"aria-labelledby"]}
      aria-valuemin={@min}
      aria-valuemax={@max}
      aria-valuenow={if @determinate, do: @value}
      aria-valuetext={assigns[:"aria-valuetext"]}
      data-slot="progress"
      data-state={if @determinate, do: "determinate", else: "indeterminate"}
      class={[
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        @class
      ]}
      {@rest}
    >
      <div
        data-slot="progress-indicator"
        class={[
          "h-full bg-primary transition-all",
          !@determinate &&
            "absolute inset-y-0 -left-1/3 w-1/3 animate-[scn-progress-indeterminate_1.2s_ease-in-out_infinite]"
        ]}
        style={if @determinate, do: "width: #{@pct}%"}
      />
    </div>
    """
  end
end
