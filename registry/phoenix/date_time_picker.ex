defmodule ShadcnHtmx.Components.DateTimePicker do
  @moduledoc """
  Date Time Picker — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/date-time-picker.tsx. The control is a native
  `<input type="date|time|datetime-local|month|week">`, so the picker UI,
  segment editing, locale-aware display and constraint validation all come from
  the platform. The submitted value is always normalised (date → yyyy-mm-dd,
  time → HH:mm[:ss], month → YYYY-MM, week → yyyy-Www). No JS.

  Works with plain HEEx and LiveView forms; htmx attributes and any other input
  attribute pass through via `:rest`.

  ## Examples

      <.date_time_picker name="bday" type="date" min="1900-01-01" />
      <.date_time_picker name="slot" type="time" min="09:00" max="18:00" step="900" />

  See repos/mdn/files/en-us/web/html/reference/elements/input/ for native
  attribute semantics.
  """

  use Phoenix.Component

  @base "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs " <>
          "transition-[color,box-shadow] outline-none " <>
          "selection:bg-primary selection:text-primary-foreground " <>
          "placeholder:text-muted-foreground " <>
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " <>
          "md:text-sm dark:bg-input/30 " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "[&.htmx-request]:opacity-70 " <>
          "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:invert " <>
          "[&::-webkit-datetime-edit]:px-0 [&::-webkit-datetime-edit-fields-wrapper]:px-0"

  attr :type, :string,
    default: "date",
    values: ~w(date time datetime-local month week)

  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-indicator hx-vals hx-include hx-disable
         id name value required disabled readonly autofocus form list
         min max step
         aria-label aria-labelledby aria-describedby aria-invalid aria-required)

  def date_time_picker(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <input
      type={@type}
      class={[@base_class, @class]}
      data-slot="date-time-picker"
      {@rest}
    />
    """
  end
end
