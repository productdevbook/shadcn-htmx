defmodule ShadcnHtmx.Components.Alert do
  @moduledoc """
  Alert — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/alert.tsx. Spec-divergence note: shadcn upstream
  hardcodes role="alert" (assertive). We expose `live` so polite/static
  cases use role="status" or no role, per APG.

  ## Examples

      <.alert variant="success">
        <.alert_title>Saved</.alert_title>
        <.alert_description>Your changes have been recorded.</.alert_description>
      </.alert>

      # Truly time-critical — interrupts AT
      <.alert variant="destructive" live="assertive">
        <.alert_title>Connection lost</.alert_title>
        <.alert_description>Trying to reconnect…</.alert_description>
      </.alert>
  """

  use Phoenix.Component

  @base "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm " <>
          "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 " <>
          "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"

  @variants %{
    "default" => "bg-card text-card-foreground",
    "destructive" =>
      "border-destructive/30 bg-destructive/5 text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
    "success" =>
      "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 *:data-[slot=alert-description]:text-emerald-700/90 dark:text-emerald-300 dark:*:data-[slot=alert-description]:text-emerald-300/90 [&>svg]:text-current",
    "warning" =>
      "border-amber-500/30 bg-amber-500/10 text-amber-800 *:data-[slot=alert-description]:text-amber-800/90 dark:text-amber-200 dark:*:data-[slot=alert-description]:text-amber-200/90 [&>svg]:text-current",
    "info" =>
      "border-sky-500/30 bg-sky-500/5 text-sky-800 *:data-[slot=alert-description]:text-sky-800/90 dark:text-sky-200 dark:*:data-[slot=alert-description]:text-sky-200/90 [&>svg]:text-current"
  }

  attr :variant, :string, default: "default", values: ~w(default destructive success warning info)
  attr :live, :string, default: "polite", values: ~w(off polite assertive)
  attr :role, :string, default: nil
  attr :aria_atomic, :boolean, default: true
  # Name the live region for AT: aria_labelledby points at an alert_title id,
  # aria_label is a literal name. status_role associated properties —
  # repos/mdn/files/en-us/web/accessibility/aria/reference/roles/status_role/index.md:28-29
  attr :aria_labelledby, :string, default: nil
  attr :aria_label, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def alert(assigns) do
    role =
      assigns.role ||
        case assigns.live do
          "assertive" -> "alert"
          "polite" -> "status"
          _ -> nil
        end

    assigns =
      assigns
      |> assign(:variant_class, Map.fetch!(@variants, assigns.variant))
      |> assign(:base, @base)
      |> assign(:computed_role, role)

    ~H"""
    <div
      data-slot="alert"
      data-variant={@variant}
      role={@computed_role}
      aria-live={if @live != "off", do: @live}
      aria-atomic={if @aria_atomic, do: "true"}
      aria-labelledby={@aria_labelledby}
      aria-label={@aria_label}
      class={[@base, @variant_class, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def alert_title(assigns) do
    ~H"""
    <div
      data-slot="alert-title"
      class={["col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", @class]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def alert_description(assigns) do
    ~H"""
    <div
      data-slot="alert-description"
      class={[
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        @class
      ]}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end
end
