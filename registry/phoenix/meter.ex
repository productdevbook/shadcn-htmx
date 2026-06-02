defmodule ShadcnHtmx.Components.Meter do
  @moduledoc """
  Meter — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Renders the native `<meter>` element (implicit `role="meter"`) — a gauge
  of a value within a known range (battery, disk usage, score), NOT task
  progress. For progress use the Progress component instead.

  `low` / `high` / `optimum` drive the fill color via the cross-browser
  meter pseudo-elements styled in input.css ([data-slot="meter"]).

  ## Examples

      <label for="disk" class="text-sm font-medium">Disk usage</label>
      <.meter id="disk" value={0.62} low={0.25} high={0.85} optimum={0.1}
        value_text="12.4 GB of 16 GB" />

      <.meter value={6} min={0} max={10} aria-label="Score" />
  """

  use Phoenix.Component

  @base "block h-2 w-full overflow-hidden rounded-full bg-primary/20 align-middle"

  attr :value, :float, default: 0.0
  attr :min, :float, default: 0.0
  attr :max, :float, default: 1.0
  attr :low, :float, default: nil
  attr :high, :float, default: nil
  attr :optimum, :float, default: nil
  attr :value_text, :string, default: nil
  attr :text, :string, default: nil
  attr :class, :string, default: nil

  # title is the spec-sanctioned way to convey units on a meter, e.g.
  # title="gigabytes" (WHATWG HTML: <meter> has no units attribute).
  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-vals hx-include
         id title aria-label aria-labelledby aria-describedby)

  def meter(assigns) do
    assigns =
      assigns
      |> assign(:base, @base)
      |> assign(:body, assigns.text || "#{assigns.value} / #{assigns.max}")

    ~H"""
    <meter
      class={[@base, @class]}
      value={@value}
      min={@min}
      max={@max}
      low={@low}
      high={@high}
      optimum={@optimum}
      aria-valuetext={@value_text}
      data-slot="meter"
      {@rest}
    >{@body}</meter>
    """
  end
end
