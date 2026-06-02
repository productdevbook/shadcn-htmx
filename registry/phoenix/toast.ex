defmodule ShadcnHtmx.Components.Toast do
  @moduledoc """
  Toast — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Pattern:
    1. Render `<.toast_viewport />` once in your layout.
    2. Endpoints that flash return a `<.toast>` fragment with
       hx-target="#toast-viewport" hx-swap="beforeend".
    3. The boot script in public/site.js auto-dismisses each toast after
       data-duration ms and wires up the X close button.

  ## Examples

      <.toast_viewport />

      # From an endpoint:
      <.toast title="Saved" description="Your changes were recorded." />
      <.toast variant="destructive" live="assertive"
              title="Save failed" description="Try again." />
  """

  use Phoenix.Component

  @viewport_positions %{
    "top-right" => "top-4 right-4 flex-col items-end",
    "top-left" => "top-4 left-4 flex-col items-start",
    "top-center" => "top-4 left-1/2 -translate-x-1/2 flex-col items-center",
    "bottom-right" => "bottom-4 right-4 flex-col-reverse items-end",
    "bottom-left" => "bottom-4 left-4 flex-col-reverse items-start",
    "bottom-center" =>
      "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center"
  }

  attr :id, :string, default: "toast-viewport"

  attr :position, :string,
    default: "bottom-right",
    values: ~w(top-right top-left top-center bottom-right bottom-left bottom-center)

  attr :aria_label, :string, default: "Notifications"

  # Politeness of the viewport's primed live region. Because the viewport is
  # rendered once (empty) at page load, toasts swapped in later announce as
  # *additions* to an existing live region — which is what gets polite
  # (role=status) toasts read out at all.
  # See repos/mdn/.../aria/guides/live_regions/.
  attr :live, :string, default: "polite", values: ~w(polite assertive)

  attr :class, :string, default: nil

  def toast_viewport(assigns) do
    assigns = assign(assigns, :position_class, Map.fetch!(@viewport_positions, assigns.position))

    ~H"""
    <ol
      id={@id}
      role="region"
      aria-label={@aria_label}
      aria-live={@live}
      aria-atomic="false"
      data-slot="toast-viewport"
      data-position={@position}
      class={[
        "pointer-events-none fixed z-50 flex w-full max-w-[420px] gap-2 p-2",
        @position_class,
        @class
      ]}
    >
    </ol>
    """
  end

  @base "pointer-events-auto relative grid w-full grid-cols-[0_1fr_auto] items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm text-card-foreground shadow-lg " <>
          "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:gap-x-3 " <>
          "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current " <>
          "animate-[scn-toast-in_180ms_ease-out] data-[state=closed]:animate-[scn-toast-out_140ms_ease-in]"

  @variants %{
    "default" => "",
    "destructive" =>
      "border-destructive/30 bg-destructive/5 text-destructive *:data-[slot=toast-description]:text-destructive/90",
    "success" =>
      "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 *:data-[slot=toast-description]:text-emerald-700/90 dark:*:data-[slot=toast-description]:text-emerald-300/90",
    "warning" =>
      "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 *:data-[slot=toast-description]:text-amber-800/90 dark:*:data-[slot=toast-description]:text-amber-200/90",
    "info" =>
      "border-sky-500/30 bg-sky-500/5 text-sky-800 dark:text-sky-200 *:data-[slot=toast-description]:text-sky-800/90 dark:*:data-[slot=toast-description]:text-sky-200/90"
  }

  attr :title, :string, required: true
  attr :description, :string, default: nil
  attr :variant, :string, default: "default", values: ~w(default destructive success warning info)
  attr :duration, :integer, default: 5000
  attr :live, :string, default: "polite", values: ~w(polite assertive)
  attr :show_close, :boolean, default: true

  # Optional htmx attrs forwarded onto the close button so dismiss can notify
  # the server (mark-read, etc.) while site.js still removes the node, e.g.
  # close_hx={%{"hx-post" => "/notifications/123/read"}}.
  # See repos/htmx/www/src/content/reference/01-attributes/.
  attr :close_hx, :map, default: %{}

  attr :class, :string, default: nil
  attr :id, :string, default: nil

  def toast(assigns) do
    role = if assigns.live == "assertive", do: "alert", else: "status"

    assigns =
      assigns
      |> assign(:base, @base)
      |> assign(:variant_class, Map.fetch!(@variants, assigns.variant))
      |> assign(:role, role)

    ~H"""
    <li
      id={@id}
      data-slot="toast"
      data-variant={@variant}
      data-state="open"
      data-duration={@duration}
      role={@role}
      aria-live={@live}
      aria-atomic="true"
      class={[@base, @variant_class, @class]}
    >
      <div data-slot="toast-title" class="col-start-2 line-clamp-1 font-medium tracking-tight">
        {@title}
      </div>
      <div :if={@description} data-slot="toast-description" class="col-start-2 text-sm text-muted-foreground">
        {@description}
      </div>
      <button
        :if={@show_close}
        type="button"
        data-toast-close="true"
        aria-label="Dismiss notification"
        {@close_hx}
        class="col-start-3 row-span-2 row-start-1 inline-flex size-6 -translate-y-0.5 items-center justify-center self-start rounded-md text-current opacity-60 transition-opacity hover:bg-current/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </li>
    """
  end
end
