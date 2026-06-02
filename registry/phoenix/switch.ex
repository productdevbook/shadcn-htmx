defmodule ShadcnHtmx.Components.Switch do
  @moduledoc """
  Switch — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<input type="checkbox" role="switch">` styled as a sliding pill.
  Form-submittable, keyboard-toggleable (Space), accessible name from a
  linked `<label>`.

  See repos/aria-practices/content/patterns/switch/.

  ## Examples

      <label class="flex items-center gap-2">
        <.switch name="notifications" checked />
        Enable notifications
      </label>

      <.switch name="favorite" size="sm"
               hx-post="/items/42/favorite" hx-trigger="change" hx-swap="none" />
  """

  use Phoenix.Component

  @track_base "relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all align-middle"
  @track_sizes %{"default" => "h-[1.15rem] w-8", "sm" => "h-3.5 w-6"}
  @thumb_sizes %{"default" => "size-4", "sm" => "size-3"}
  @input_base "peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full outline-none transition-colors " <>
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
                "disabled:cursor-not-allowed disabled:opacity-50 " <>
                "bg-input dark:bg-input/80 checked:bg-primary"
  @thumb_base "pointer-events-none absolute top-1/2 left-px -translate-y-1/2 rounded-full bg-background transition-transform " <>
                "peer-checked:translate-x-[calc(100%-2px)] " <>
                "dark:peer-checked:bg-primary-foreground dark:bg-foreground"

  attr :size, :string, default: "default", values: ~w(default sm)
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-vals hx-include
         id name value checked required disabled readonly autofocus form
         aria-label aria-labelledby aria-describedby)

  def switch(assigns) do
    assigns =
      assigns
      |> assign(:track_class, Map.fetch!(@track_sizes, assigns.size))
      |> assign(:thumb_class, Map.fetch!(@thumb_sizes, assigns.size))
      |> assign(:track_base, @track_base)
      |> assign(:input_base, @input_base)
      |> assign(:thumb_base, @thumb_base)

    ~H"""
    <span
      data-slot="switch"
      data-size={@size}
      class={[@track_base, @track_class, @class]}
    >
      <input type="checkbox" role="switch" class={@input_base} {@rest} />
      <span class={[@thumb_base, @thumb_class]} data-slot="switch-thumb" aria-hidden="true"></span>
    </span>
    """
  end
end
