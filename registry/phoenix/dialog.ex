defmodule ShadcnHtmx.Components.Dialog do
  @moduledoc """
  Dialog — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/dialog.tsx. Renders the native <dialog> element +
  attaches the data attributes that public/site.js looks for to open / close.

  ## Examples

      <.dialog_trigger dialog_for="confirm-delete" class="…btn-classes…">
        Delete item
      </.dialog_trigger>

      <.dialog id="confirm-delete" title="Delete item?"
               description="This action cannot be undone.">
        <div class="flex justify-end gap-2">
          <button type="button" data-dialog-close="true">Cancel</button>
          <button type="button" hx-post={~p"/items/\#{@item.id}"} hx-method="delete">Delete</button>
        </div>
      </.dialog>
  """

  use Phoenix.Component

  @dialog_base "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-lg " <>
                 "grid gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg outline-none " <>
                 "hidden open:grid " <>
                 "backdrop:bg-black/60 backdrop:backdrop-blur-sm"

  attr :id, :string, required: true
  attr :title, :string, default: nil
  attr :description, :string, default: nil
  attr :close_on_backdrop, :boolean, default: true
  attr :show_close_button, :boolean, default: true
  attr :open, :boolean, default: false
  # Native HTML `closedby` attribute (HTML Living Standard).
  # See repos/mdn/files/en-us/web/html/reference/elements/dialog/index.md:19-35.
  attr :closedby, :string, default: nil, values: ["any", "closerequest", "none", nil]
  # APG: role="alertdialog" demands a synchronous response and is announced
  # with higher urgency by AT. Requires aria-describedby.
  attr :role, :string, default: "dialog", values: ~w(dialog alertdialog)
  attr :class, :string, default: nil

  slot :inner_block, required: true

  def dialog(assigns) do
    assigns = assign(assigns, :base, @dialog_base)

    ~H"""
    <dialog
      id={@id}
      open={@open}
      closedby={@closedby}
      role={@role}
      class={[@base, @class]}
      data-slot="dialog"
      data-close-on-backdrop={@close_on_backdrop && "true"}
      aria-labelledby={"#{@id}-title"}
      aria-describedby={"#{@id}-description"}
    >
      <div :if={@title || @description} data-slot="dialog-header" class="flex flex-col gap-1.5 text-left">
        <h2 :if={@title} id={"#{@id}-title"} data-slot="dialog-title" class="text-lg leading-none font-semibold">{@title}</h2>
        <p :if={@description} id={"#{@id}-description"} data-slot="dialog-description" class="text-sm text-muted-foreground">{@description}</p>
      </div>
      {render_slot(@inner_block)}
      <button
        :if={@show_close_button}
        type="button"
        data-dialog-close="true"
        aria-label="Close"
        class="absolute top-4 right-4 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </dialog>
    """
  end

  attr :dialog_for, :string, required: true
  attr :type, :string, default: "button"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def dialog_trigger(assigns) do
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
