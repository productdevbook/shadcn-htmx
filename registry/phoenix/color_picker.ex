defmodule ShadcnHtmx.Components.ColorPicker do
  @moduledoc """
  Color Picker — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/color-picker.tsx. The control is a native
  `<input type="color">`, so the browser owns the whole picker UI and validates
  the CSS color value. `<input type=color>` has no implicit ARIA role, so pass a
  visible `<label for>` or `aria-label`. The optional hex `<output>` is mirrored
  from the input's value by the shared handler in public/site.js (keyed on
  `data-slot="color-picker"`). With `show_value={false}` it is a bare swatch
  (zero JS).

  ## Examples

      <.color_picker name="brand" value="#e66465" aria-label="Brand color" />
      <.color_picker name="bg" value="#1d4ed8" show_value={false} />

  See repos/mdn/files/en-us/web/html/reference/elements/input/color/index.md.
  """

  use Phoenix.Component

  @swatch_base "size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1 shadow-xs " <>
                 "outline-none transition-[color,box-shadow] dark:bg-input/30 " <>
                 "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
                 "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
                 "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " <>
                 "[&.htmx-request]:opacity-70 " <>
                 "[&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0 " <>
                 "[&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0"

  @value_text "font-mono text-sm tabular-nums text-muted-foreground uppercase select-none"

  attr :value, :string, default: "#000000"
  attr :show_value, :boolean, default: true
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-indicator hx-vals hx-include
         id name required autofocus form list autocomplete alpha colorspace
         aria-label aria-labelledby aria-describedby aria-invalid aria-required)

  def color_picker(assigns) do
    assigns =
      assigns
      |> assign(:swatch_base, @swatch_base)
      |> assign(:value_text, @value_text)

    ~H"""
    <span
      :if={@show_value}
      data-slot="color-picker"
      data-disabled={@disabled && "true"}
      class={["inline-flex items-center gap-2", @disabled && "opacity-50", @class]}
    >
      <input
        type="color"
        value={@value}
        disabled={@disabled}
        data-slot="color-picker-swatch"
        class={@swatch_base}
        {@rest}
      />
      <output data-slot="color-picker-value" aria-hidden="true" class={@value_text}>{@value}</output>
    </span>
    <input
      :if={!@show_value}
      type="color"
      value={@value}
      disabled={@disabled}
      data-slot="color-picker"
      class={[@swatch_base, @class]}
      {@rest}
    />
    """
  end
end
