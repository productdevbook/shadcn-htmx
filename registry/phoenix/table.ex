defmodule ShadcnHtmx.Components.Table do
  @moduledoc """
  Table — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Semantic `<table>` / `<thead>` / `<tbody>` etc. Sortable columns
  carry `aria-sort` and expose a clickable button inside the `<th>`.
  """

  use Phoenix.Component

  attr :class, :string, default: nil
  attr :wrapper_class, :string, default: nil
  slot :inner_block, required: true

  def table(assigns) do
    ~H"""
    <div class={["relative w-full overflow-auto", @wrapper_class]}>
      <table data-slot="table" class={["w-full caption-bottom text-sm", @class]}>
        {render_slot(@inner_block)}
      </table>
    </div>
    """
  end

  slot :inner_block, required: true
  def table_header(assigns), do: ~H"<thead data-slot=\"table-header\" class=\"[&_tr]:border-b\">{render_slot(@inner_block)}</thead>"

  slot :inner_block, required: true
  def table_body(assigns), do: ~H"<tbody data-slot=\"table-body\" class=\"[&_tr:last-child]:border-0\">{render_slot(@inner_block)}</tbody>"

  slot :inner_block, required: true
  attr :class, :string, default: nil
  def table_row(assigns) do
    ~H"""
    <tr data-slot="table-row" class={["border-b transition-colors hover:bg-muted/50", @class]}>
      {render_slot(@inner_block)}
    </tr>
    """
  end

  attr :scope, :string, default: "col"
  attr :sort, :string, default: nil, values: [nil, "none", "ascending", "descending"]
  attr :class, :string, default: nil
  # colspan/rowspan: native <th> spanning attrs (MDN web/html/reference/elements/th).
  attr :colspan, :integer, default: nil
  attr :rowspan, :integer, default: nil
  # id/headers: explicit header association for complex tables.
  attr :id, :string, default: nil
  attr :headers, :string, default: nil
  # abbr: short spoken label AT announces in place of verbose header text
  # (non-deprecated on <th>).
  attr :abbr, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def table_head(assigns) do
    base = "h-10 px-2 text-left align-middle font-medium text-muted-foreground"
    assigns = assign(assigns, base: base)

    if assigns.sort do
      ~H"""
      <th
        scope={@scope}
        colspan={@colspan}
        rowspan={@rowspan}
        id={@id}
        headers={@headers}
        abbr={@abbr}
        data-slot="table-head"
        data-sortable="true"
        aria-sort={@sort}
        class={[@base, @class]}
      >
        <button
          type="button"
          class="inline-flex h-7 items-center gap-1.5 rounded-md px-2 -ml-2 hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          {@rest}
        >
          {render_slot(@inner_block)}
          <svg :if={@sort == "ascending"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <svg :if={@sort == "descending"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <svg :if={@sort == "none"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 opacity-30" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </th>
      """
    else
      ~H"""
      <th
        scope={@scope}
        colspan={@colspan}
        rowspan={@rowspan}
        id={@id}
        headers={@headers}
        abbr={@abbr}
        data-slot="table-head"
        class={[@base, @class]}
      >
        {render_slot(@inner_block)}
      </th>
      """
    end
  end

  attr :colspan, :integer, default: nil
  # rowspan: native <td> spanning attr (MDN web/html/reference/elements/td).
  attr :rowspan, :integer, default: nil
  # id/headers: explicit header association for complex tables.
  attr :id, :string, default: nil
  attr :headers, :string, default: nil
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def table_cell(assigns) do
    ~H"""
    <td
      colspan={@colspan}
      rowspan={@rowspan}
      id={@id}
      headers={@headers}
      data-slot="table-cell"
      class={["p-2 align-middle", @class]}
    >
      {render_slot(@inner_block)}
    </td>
    """
  end
end
