defmodule ShadcnHtmx.Components.Status do
  @moduledoc """
  Status — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/status.tsx. A persistent POLITE live region for
  non-urgent updates ("Saved", "3 results"). Swap text INTO it
  (hx-swap="innerHTML") — never move focus.

    - role="status" (default) → aria-live="polite", aria-atomic="true"
    - role="log"              → aria-live="polite", aria-atomic="false"
                                only the appended entry is announced.

  Refs:
    repos/aria-practices/.../practices/structural-roles/structural-roles-practice.html
    repos/mdn/.../roles/status_role/  repos/mdn/.../roles/log_role/

  ## Examples

      <.status aria_label="Save status">Saved</.status>

      <.status as="log" aria_label="Activity">
        <.status_item>Connected</.status_item>
        <.status_item>Synced 3 files</.status_item>
      </.status>
  """

  use Phoenix.Component

  @base "block min-h-5 text-sm"

  @tones %{
    "default" => "text-foreground",
    "muted" => "text-muted-foreground",
    "success" => "text-emerald-700 dark:text-emerald-300",
    "destructive" => "text-destructive"
  }

  @role_atomic %{"status" => "true", "log" => "false"}

  attr :as, :string, default: "status", values: ~w(status log)
  attr :tone, :string, default: "muted", values: ~w(default muted success destructive)
  attr :aria_atomic, :boolean, default: nil
  attr :aria_label, :string, default: nil
  attr :aria_labelledby, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def status(assigns) do
    atomic =
      case assigns.aria_atomic do
        nil -> Map.fetch!(@role_atomic, assigns.as)
        true -> "true"
        false -> "false"
      end

    assigns =
      assigns
      |> assign(:base, @base)
      |> assign(:tone_class, Map.fetch!(@tones, assigns.tone))
      |> assign(:atomic, atomic)

    ~H"""
    <div
      data-slot="status"
      data-role={@as}
      role={@as}
      aria-live="polite"
      aria-atomic={@atomic}
      aria-label={@aria_label}
      aria-labelledby={@aria_labelledby}
      class={[@base, @tone_class, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def status_item(assigns) do
    ~H"""
    <div data-slot="status-item" class={["py-0.5", @class]} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end
end
