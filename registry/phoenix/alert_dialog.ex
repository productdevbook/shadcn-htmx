defmodule ShadcnHtmx.Components.AlertDialog do
  @moduledoc """
  AlertDialog — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/alert-dialog.tsx. Renders the native <dialog> element +
  the data attributes public/site.js looks for to open / close
  (data-dialog-trigger / data-dialog-close, shared with the Dialog component).

  Unlike `Dialog`, this is an *alert* dialog
  (repos/aria-practices/content/patterns/alertdialog/alertdialog-pattern.html):

    - role="alertdialog", aria-describedby is required (the alert message).
    - NOT light-dismissible: no data-close-on-backdrop, closedby="closerequest"
      (the native default for showModal() — see
      repos/mdn/files/en-us/web/html/reference/elements/dialog/index.md:33-35).
    - No X button — the user must choose Cancel or the confirming action.

  ## Examples

      <.alert_dialog_trigger dialog_for="confirm" class="…btn-classes…">
        Delete item
      </.alert_dialog_trigger>

      <.alert_dialog id="confirm" title="Are you absolutely sure?"
                     description="This action cannot be undone.">
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" data-dialog-close="true" autofocus>Cancel</button>
          <button type="button" data-dialog-close="true"
                  hx-post={~p"/items/\#{@item.id}"} hx-method="delete">Delete</button>
        </div>
      </.alert_dialog>
  """

  use Phoenix.Component

  @alert_dialog_base "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-lg " <>
                       "grid gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg outline-none " <>
                       "hidden open:grid " <>
                       "backdrop:bg-black/60 backdrop:backdrop-blur-sm"

  attr :id, :string, required: true
  attr :title, :string, default: nil
  attr :description, :string, default: nil
  attr :open, :boolean, default: false
  attr :class, :string, default: nil
  # APG: name the alertdialog with aria-label when there is no visible title
  # (alertdialog-pattern.html:47-57). When set, it suppresses the id-title
  # aria-labelledby fallback so the dialog isn't named twice.
  attr :aria_label, :string, default: nil

  slot :inner_block, required: true

  def alert_dialog(assigns) do
    assigns = assign(assigns, :base, @alert_dialog_base)

    ~H"""
    <dialog
      id={@id}
      open={@open}
      closedby="closerequest"
      role="alertdialog"
      class={[@base, @class]}
      data-slot="alert-dialog"
      aria-label={@aria_label}
      aria-labelledby={if @aria_label, do: nil, else: "#{@id}-title"}
      aria-describedby={"#{@id}-description"}
    >
      <div :if={@title || @description} data-slot="alert-dialog-header" class="flex flex-col gap-1.5 text-left">
        <h2 :if={@title} id={"#{@id}-title"} data-slot="alert-dialog-title" class="text-lg leading-none font-semibold">{@title}</h2>
        <p :if={@description} id={"#{@id}-description"} data-slot="alert-dialog-description" class="text-sm text-muted-foreground">{@description}</p>
      </div>
      {render_slot(@inner_block)}
    </dialog>
    """
  end

  attr :dialog_for, :string, required: true
  attr :type, :string, default: "button"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def alert_dialog_trigger(assigns) do
    ~H"""
    <button
      type={@type}
      class={@class}
      data-dialog-trigger="true"
      data-dialog-target={@dialog_for}
      aria-haspopup="dialog"
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end
end
