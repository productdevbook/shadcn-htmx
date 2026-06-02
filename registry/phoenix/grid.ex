defmodule ShadcnHtmx.Components.Grid do
  @moduledoc """
  Grid — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  An INTERACTIVE data grid: a `<table role="grid">` that is a SINGLE tab stop
  with 2-D arrow-key cell navigation (roving tabindex). Distinct from the
  static `table` component — reach for `grid` only when you want
  spreadsheet-style cell focus and a shorter tab sequence.

  Mirrors registry/ui/grid.tsx. Function components: `grid`, `grid_header`,
  `grid_body`, `grid_row`, `grid_columnheader`, `grid_rowheader`, `grid_cell`.

  A boot `<script>` sets the roving tabindex on first paint, and
  public/site.js (keyed on data-slot="grid") owns the arrow / Home / End /
  Ctrl+Home / Ctrl+End contract. Accessibility contract:
  repos/aria-practices/content/patterns/grid/grid-pattern.html
  repos/aria-practices/content/patterns/grid/examples/js/dataGrid.js

  ## Examples

      <.grid aria-label="Transactions">
        <.grid_header>
          <.grid_row>
            <.grid_columnheader sort="ascending">Name</.grid_columnheader>
            <.grid_columnheader>Amount</.grid_columnheader>
          </.grid_row>
        </.grid_header>
        <.grid_body>
          <.grid_row>
            <.grid_cell>Ada</.grid_cell>
            <.grid_cell>$120</.grid_cell>
          </.grid_row>
        </.grid_body>
      </.grid>
  """

  use Phoenix.Component

  @cell "border-b border-r px-3 py-2 align-middle outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-[2px] focus-visible:ring-ring/50 data-[grid-active=true]:bg-muted/50"
  @head @cell <>
          " border-t bg-muted/50 text-left font-medium text-muted-foreground first:rounded-tl-md last:rounded-tr-md"
  @data @cell <> " bg-background text-foreground"

  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :"aria-describedby", :string, default: nil
  attr :"aria-rowcount", :integer, default: nil
  attr :"aria-colcount", :integer, default: nil
  attr :"aria-readonly", :boolean, default: false
  # grid supports selecting more than one cell/row: w3c.github.io/aria/#aria-multiselectable
  attr :"aria-multiselectable", :boolean, default: false
  attr :class, :string, default: nil
  attr :wrapper_class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def grid(assigns) do
    ~H"""
    <div class={["relative w-full overflow-auto rounded-md border", @wrapper_class]}>
      <table
        role="grid"
        data-slot="grid"
        aria-label={assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        aria-describedby={assigns[:"aria-describedby"]}
        aria-rowcount={assigns[:"aria-rowcount"]}
        aria-colcount={assigns[:"aria-colcount"]}
        aria-readonly={assigns[:"aria-readonly"] && "true"}
        aria-multiselectable={assigns[:"aria-multiselectable"] && "true"}
        class={["w-full caption-bottom border-separate border-spacing-0 text-sm", @class]}
        {@rest}
      >
        {render_slot(@inner_block)}
      </table>
      <script>{Phoenix.HTML.raw(~s"""
        (function(el){
          var cells = el.querySelectorAll('[data-grid-cell]');
          cells.forEach(function(c,i){ c.setAttribute('tabindex', i===0 ? '0' : '-1'); });
          if (cells.length) cells[0].setAttribute('data-grid-active','true');
          el.setAttribute('data-grid-ready','true');
        })(document.currentScript.previousElementSibling);
      """)}</script>
    </div>
    """
  end

  slot :inner_block, required: true
  def grid_header(assigns), do: ~H"<thead data-slot=\"grid-header\">{render_slot(@inner_block)}</thead>"

  slot :inner_block, required: true
  def grid_body(assigns), do: ~H"<tbody data-slot=\"grid-body\">{render_slot(@inner_block)}</tbody>"

  attr :"aria-rowindex", :integer, default: nil
  # contiguous-columns form: aria-colindex once on the row. w3c.github.io/aria/#aria-colindex
  attr :"aria-colindex", :integer, default: nil
  attr :selected, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def grid_row(assigns) do
    ~H"""
    <tr
      data-slot="grid-row"
      aria-rowindex={assigns[:"aria-rowindex"]}
      aria-colindex={assigns[:"aria-colindex"]}
      aria-selected={@selected && "true"}
      class={["transition-colors", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </tr>
    """
  end

  attr :sort, :string, default: nil, values: [nil, "none", "ascending", "descending"]
  attr :"aria-colindex", :integer, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def grid_columnheader(assigns) do
    assigns = assign(assigns, head: @head)

    ~H"""
    <th
      scope="col"
      data-slot="grid-columnheader"
      data-grid-cell=""
      data-sortable={@sort && "true"}
      aria-sort={@sort}
      aria-colindex={assigns[:"aria-colindex"]}
      class={[@head, @class]}
      {@rest}
    >
      <span class="inline-flex items-center gap-1.5">
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
      </span>
    </th>
    """
  end

  attr :"aria-colindex", :integer, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def grid_rowheader(assigns) do
    assigns = assign(assigns, head: @head)

    ~H"""
    <th
      scope="row"
      data-slot="grid-rowheader"
      data-grid-cell=""
      aria-colindex={assigns[:"aria-colindex"]}
      class={[@head, "font-medium text-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </th>
    """
  end

  attr :"aria-colindex", :integer, default: nil
  attr :selected, :boolean, default: false
  attr :"aria-readonly", :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def grid_cell(assigns) do
    assigns = assign(assigns, data: @data)

    ~H"""
    <td
      data-slot="grid-cell"
      data-grid-cell=""
      aria-colindex={assigns[:"aria-colindex"]}
      aria-selected={@selected && "true"}
      aria-readonly={assigns[:"aria-readonly"] && "true"}
      class={[@data, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </td>
    """
  end
end
