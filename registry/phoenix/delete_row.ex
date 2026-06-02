defmodule ShadcnHtmx.Components.DeleteRow do
  @moduledoc """
  Delete Row — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/delete-row.tsx. A row/item delete affordance that
  confirms, sends DELETE, then fades out in place. One inherited declaration
  on the list host covers every row — no per-row wiring, no client-side list
  state. The server answers the DELETE with a 200 and an empty body, so the
  row is swapped with nothing and simply disappears.
  See repos/htmx/www/src/content/patterns/03-records/02-delete-in-place.md.

  htmx v4 inheritance is explicit (the `:inherited` modifier), so the host
  hoists hx-confirm / hx-target / hx-swap to every descendant Delete button:
  see repos/htmx/www/src/content/docs/03-features/08-attribute-inheritance.md.

  Three function components:
    - `delete_row_list/1` — the inheritance host (default <tbody>).
    - `delete_row_item/1` — one deletable row (default <tr>) with the fade.
    - `delete_row/1`      — the Delete button; only carries hx-delete.

  ## Examples

      <table class="w-full caption-bottom text-sm">
        <.delete_row_list>
          <.delete_row_item>
            <td>Joe Smith</td>
            <td class="text-right"><.delete_row href={~p"/contacts/1"} /></td>
          </.delete_row_item>
        </.delete_row_list>
      </table>
  """

  use Phoenix.Component

  @btn "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none " <>
         "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
         "disabled:pointer-events-none disabled:opacity-50 " <>
         "aria-disabled:pointer-events-none aria-disabled:opacity-50 " <>
         "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
         "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " <>
         "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70 " <>
         "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 " <>
         "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5 " <>
         "text-muted-foreground hover:text-destructive"

  attr :confirm, :string,
    default: "Are you sure you want to delete this?",
    doc: "Confirm prompt; pass nil to skip confirmation."

  attr :target, :string, default: "closest tr"
  attr :swap_ms, :integer, default: 300
  attr :as, :string, default: "tbody"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def delete_row_list(assigns) do
    ~H"""
    <.dynamic_tag
      tag_name={@as}
      data-slot="delete-row"
      hx-confirm:inherited={@confirm}
      hx-target:inherited={@target}
      hx-swap:inherited={"outerHTML swap:#{@swap_ms}ms"}
      class={@class}
      {@rest}
    >
      {render_slot(@inner_block)}
    </.dynamic_tag>
    """
  end

  attr :swap_ms, :integer, default: 300
  attr :as, :string, default: "tr"
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def delete_row_item(assigns) do
    ~H"""
    <.dynamic_tag
      tag_name={@as}
      data-slot="delete-row-item"
      style={"transition-duration:#{@swap_ms}ms"}
      class={["transition-opacity ease-out [&.htmx-swapping]:opacity-0", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </.dynamic_tag>
    """
  end

  attr :href, :string, required: true
  attr :label, :string, default: "Delete"
  attr :aria_label, :string, default: nil
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-target hx-swap hx-confirm hx-trigger hx-indicator)

  def delete_row(assigns) do
    assigns = assign(assigns, :btn, @btn)

    ~H"""
    <button
      type="button"
      data-slot="delete-row-trigger"
      hx-delete={@href}
      aria-label={@aria_label}
      disabled={@disabled}
      class={[@btn, @class]}
      {@rest}
    >
      {@label}
    </button>
    """
  end
end
