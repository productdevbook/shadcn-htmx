defmodule ShadcnHtmx.Components.Treegrid do
  @moduledoc """
  Treegrid — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/treegrid.tsx so a Phoenix LiveView project can render
  the same markup our docs site renders. htmx attributes pass through via
  `:rest`.

  A treegrid is a hierarchical, 2-D-navigable grid: rows expand/collapse like
  a tree, cells navigate like a grid. The accessibility contract comes from
  the WAI-ARIA APG Treegrid pattern (rows-focused-first variant):

    repos/aria-practices/content/patterns/treegrid/treegrid-pattern.html
    repos/aria-practices/content/patterns/treegrid/examples/treegrid-1.html

  ## Examples

      <.treegrid aria-label="Inbox" columns={["Subject", "Summary", "Email"]}>
        <.treegrid_row level={1} posinset={1} setsize={1} expanded={true}>
          <.treegrid_cell first level={1} expandable>Treegrids are awesome</.treegrid_cell>
          <.treegrid_cell>Want to learn how to use them?</.treegrid_cell>
          <.treegrid_cell><a href="mailto:a@b.c">a@b.c</a></.treegrid_cell>
        </.treegrid_row>
        <.treegrid_row level={2} posinset={1} setsize={1}>
          <.treegrid_cell first level={2}>re: Treegrids are awesome</.treegrid_cell>
          <.treegrid_cell>I agree</.treegrid_cell>
          <.treegrid_cell><a href="mailto:b@c.d">b@c.d</a></.treegrid_cell>
        </.treegrid_row>
      </.treegrid>

  The keyboard contract (Up/Down/Left/Right/Home/End/Enter, roving tabindex)
  lives in public/site.js, keyed on data-slot="treegrid".
  """

  use Phoenix.Component

  @table_base "w-full caption-bottom border-collapse text-sm"
  @head_cell "h-10 px-2 text-left align-middle font-medium text-muted-foreground"
  @row_base "border-b outline-none transition-colors hover:bg-muted/50 " <>
              "focus-visible:bg-accent focus-visible:text-accent-foreground " <>
              "[&:focus-within]:bg-muted/60 aria-selected:bg-muted data-[state=selected]:bg-muted"
  @cell_base "px-2 py-1.5 align-middle outline-none focus-visible:bg-accent focus-visible:text-accent-foreground"

  @boot """
  <script>(function(el){
    var rows = el.querySelectorAll('tbody > tr[role="row"]');
    rows.forEach(function(r, i){ r.setAttribute('tabindex', i === 0 ? '0' : '-1'); });
    el.querySelectorAll('tbody a,tbody button,tbody input,tbody [tabindex]').forEach(function(f){
      if (f.getAttribute('role') === 'row') return;
      f.setAttribute('tabindex', '-1');
    });
    el.setAttribute('data-treegrid-ready', 'true');
  })(document.currentScript.parentElement.querySelector('[data-slot="treegrid"]'));</script>
  """

  attr :columns, :list, required: true
  attr :class, :string, default: nil
  attr :wrapper_class, :string, default: nil
  attr :rest, :global, include: ~w(id aria-label aria-labelledby hx-get hx-post hx-target hx-swap)
  slot :inner_block, required: true

  def treegrid(assigns) do
    assigns =
      assigns
      |> assign(:boot, @boot)
      |> assign(:table_base, @table_base)
      |> assign(:head_cell, @head_cell)

    ~H"""
    <div class={["relative w-full overflow-auto", @wrapper_class]}>
      <table role="treegrid" data-slot="treegrid" class={[@table_base, @class]} {@rest}>
        <thead>
          <tr role="row" class="border-b">
            <th :for={label <- @columns} role="columnheader" scope="col" class={@head_cell}>
              {label}
            </th>
          </tr>
        </thead>
        <tbody>{render_slot(@inner_block)}</tbody>
      </table>
      {Phoenix.HTML.raw(@boot)}
    </div>
    """
  end

  attr :level, :integer, required: true
  attr :posinset, :integer, required: true
  attr :setsize, :integer, required: true
  attr :expanded, :any, default: nil
  attr :selected, :any, default: nil
  attr :hidden, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-get hx-post hx-target hx-swap)
  slot :inner_block, required: true

  def treegrid_row(assigns) do
    assigns = assign(assigns, :row_base, @row_base)

    ~H"""
    <tr
      role="row"
      data-slot="treegrid-row"
      aria-level={@level}
      aria-posinset={@posinset}
      aria-setsize={@setsize}
      aria-expanded={if is_nil(@expanded), do: nil, else: to_string(@expanded)}
      aria-selected={if is_nil(@selected), do: nil, else: to_string(@selected)}
      hidden={@hidden}
      class={[@row_base, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </tr>
    """
  end

  attr :first, :boolean, default: false
  attr :level, :integer, default: 1
  attr :expandable, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def treegrid_cell(assigns) do
    assigns = assign(assigns, :cell_base, @cell_base)

    ~H"""
    <td :if={!@first} role="gridcell" data-slot="treegrid-cell" class={[@cell_base, @class]} {@rest}>
      {render_slot(@inner_block)}
    </td>
    <td :if={@first} role="gridcell" data-slot="treegrid-cell" class={[@cell_base, @class]} {@rest}>
      <span class="flex items-center gap-1.5" style={"padding-left:#{@level - 1}rem"}>
        <svg
          :if={@expandable}
          data-slot="treegrid-chevron"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3.5 shrink-0 text-muted-foreground transition-transform"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span :if={!@expandable} class="size-3.5 shrink-0" aria-hidden="true"></span>
        <span>{render_slot(@inner_block)}</span>
      </span>
    </td>
    """
  end
end
