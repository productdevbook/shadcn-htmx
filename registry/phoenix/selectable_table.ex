defmodule ShadcnHtmx.Components.SelectableTable do
  @moduledoc """
  Selectable Table — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/selectable-table.tsx EXACTLY (same elements, roles,
  data-slots, classes — only the templating syntax differs).

  A `<form>`-wrapped `<table>` with row checkboxes (`name="selected"`), a
  header select-all, a live `<output>` count, and a contextual bulk-action
  bar revealed PURELY in CSS via `:has(:checked)` — no JS decides visibility.
  Bulk-action `<button>`s sit inside the form, so htmx serialises every
  checked value on `hx-post`; `hx-target`/`hx-swap` on the form replace it
  with the re-render. The select-all toggle + running count come from the
  shared site.js keyed on `data-slot="selectable-table"` (graceful: every box
  still toggles + submits natively without it).

  Sources cited in selectable-table.tsx:
    repos/htmx/.../patterns/03-records/01-bulk-actions.md
    repos/htmx/.../reference/01-attributes/{02-hx-post,07-hx-swap,08-hx-target,22-hx-confirm}.md
    repos/mdn/.../web/css/reference/selectors/_colon_has/index.md
    repos/mdn/.../web/html/reference/elements/output/index.md

  ## Examples

      <.selectable_table aria_label="Users" message={@message}>
        <:actions label="With selected:">
          <.bulk_action hx-post="/users/activate">Activate</.bulk_action>
          <.bulk_action hx-post="/users/delete" variant="destructive" confirm="Delete selected users?">
            Delete
          </.bulk_action>
        </:actions>
        <:column label="Name" />
        <:column label="Email" />
        <:row :for={u <- @users} value={u.email} aria_label={"Select #{u.name}"}>
          <:cell>{u.name}</:cell>
          <:cell>{u.email}</:cell>
        </:row>
      </.selectable_table>
  """

  use Phoenix.Component

  @box "peer size-4 shrink-0 appearance-none rounded-[4px] border border-input bg-background shadow-xs " <>
         "transition-shadow outline-none " <>
         "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
         "disabled:cursor-not-allowed disabled:opacity-50 " <>
         "checked:border-primary checked:bg-primary " <>
         "indeterminate:border-primary indeterminate:bg-primary " <>
         "dark:bg-input/30"

  attr :aria_label, :string, default: nil
  attr :aria_labelledby, :string, default: nil
  attr :message, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-target hx-swap id)

  slot :actions do
    attr :label, :string
  end

  slot :column, required: true do
    attr :label, :string
  end

  slot :row, required: true do
    attr :value, :string, required: true
    attr :aria_label, :string
    attr :checked, :boolean
  end

  slot :cell

  def selectable_table(assigns) do
    assigns = assign(assigns, box: @box)

    ~H"""
    <%!-- htmx v4 inheritance is explicit, so the form carries no
          hx-target/hx-swap — each .bulk_action targets the closest form. --%>
    <form
      data-slot="selectable-table"
      aria-label={@aria_label}
      aria-labelledby={@aria_labelledby}
      class={["group/selectable-table w-full space-y-3", @class]}
      {@rest}
    >
      <div
        :for={actions <- @actions}
        data-slot="selectable-table-actions"
        class="hidden items-center gap-2 rounded-md border bg-muted px-3 py-2 group-has-[input[name=selected]:checked]/selectable-table:flex"
      >
        <span :if={actions[:label]} class="mr-1 text-xs font-medium text-muted-foreground">
          {actions.label}
        </span>
        {render_slot(actions)}
      </div>

      <div class="relative w-full overflow-auto rounded-md border">
        <table data-slot="selectable-table-content" class="w-full caption-bottom text-sm">
          <thead data-slot="selectable-table-header" class="[&_tr]:border-b">
            <tr data-slot="selectable-table-row" class="border-b transition-colors hover:bg-muted/50">
              <th
                scope="col"
                data-slot="selectable-table-head"
                class="h-10 w-10 px-3 text-left align-middle font-medium text-muted-foreground"
              >
                <span class="relative inline-flex size-4 shrink-0 align-middle">
                  <input
                    type="checkbox"
                    data-slot="selectable-table-select-all"
                    aria-label="Select all rows"
                    class={@box}
                  />
                  <.check_icon />
                </span>
              </th>
              <th
                :for={col <- @column}
                scope="col"
                data-slot="selectable-table-head"
                class="h-10 px-3 text-left align-middle font-medium text-muted-foreground"
              >
                {col[:label]}
              </th>
            </tr>
          </thead>
          <tbody data-slot="selectable-table-body" class="[&_tr:last-child]:border-0">
            <tr
              :for={r <- @row}
              data-slot="selectable-table-row"
              class="border-b transition-colors hover:bg-muted/50 has-[input[name=selected]:checked]:bg-muted"
            >
              <td data-slot="selectable-table-cell" class="px-3 py-2 align-middle">
                <span class="relative inline-flex size-4 shrink-0 align-middle">
                  <input
                    type="checkbox"
                    name="selected"
                    value={r.value}
                    checked={r[:checked]}
                    data-slot="selectable-table-select-row"
                    aria-label={r[:aria_label] || "Select #{r.value}"}
                    class={@box}
                  />
                  <.check_icon />
                </span>
              </td>
              {render_slot(r)}
            </tr>
          </tbody>
        </table>
      </div>

      <output data-slot="selectable-table-count" class="block text-sm text-muted-foreground">
        {@message}
      </output>
    </form>
    """
  end

  @doc "A table cell — use inside a `<:row>` slot's render block."
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def st_cell(assigns) do
    ~H"""
    <td data-slot="selectable-table-cell" class={["px-3 py-2 align-middle", @class]}>
      {render_slot(@inner_block)}
    </td>
    """
  end

  @bulk_base "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium whitespace-nowrap outline-none transition-colors " <>
               "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
               "disabled:pointer-events-none disabled:opacity-50 " <>
               "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

  attr :variant, :string, default: "default", values: ~w(default destructive)
  attr :type, :string, default: "button"
  attr :confirm, :string, default: nil
  attr :hx_target, :string, default: "closest [data-slot='selectable-table']"
  attr :hx_swap, :string, default: "outerHTML"
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-post hx-get)
  slot :inner_block, required: true

  def bulk_action(assigns) do
    variant_class =
      case assigns.variant do
        "destructive" -> "border-destructive/40 text-destructive hover:bg-destructive/10"
        _ -> "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
      end

    assigns = assign(assigns, bulk_base: @bulk_base, variant_class: variant_class)

    ~H"""
    <button
      type={@type}
      data-slot="selectable-table-action"
      hx-confirm={@confirm}
      hx-target={@hx_target}
      hx-swap={@hx_swap}
      disabled={@disabled}
      class={[@bulk_base, @variant_class, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end

  # Check + indeterminate icons layered over the native input (peer-checked /
  # peer-indeterminate reveal). aria-hidden — the input carries the semantics.
  defp check_icon(assigns) do
    ~H"""
    <svg
      class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-checked:block"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <svg
      class="pointer-events-none absolute inset-0 m-auto hidden size-3 text-primary-foreground peer-indeterminate:block"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
    """
  end
end
