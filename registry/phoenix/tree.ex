defmodule ShadcnHtmx.Components.Tree do
  @moduledoc """
  Tree (Tree View) — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Web-standard nested lists wired to the WAI-ARIA APG Tree View pattern:
  `<ul role="tree">` containing `<li role="treeitem">` nodes; parent nodes
  carry `aria-expanded` and hold a nested `<ul role="group">`. End nodes have
  no `aria-expanded` so they are not mis-described as parents.

  The live keyboard + roving-tabindex contract (Up/Down between visible nodes,
  Right expand / into child, Left collapse / to parent, Home/End, type-ahead,
  `*` expand siblings, Enter/Space select) lives in public/site.js keyed on
  `data-slot="tree"`. An inline boot script seeds the roving tabindex before
  paint so the tree is a single tab stop with no flash.

  ## Examples

      <.tree aria_label="File system">
        <.tree_item label="Projects" expanded>
          <.tree_group>
            <.tree_item label="project-1.docx" />
          </.tree_group>
        </.tree_item>
      </.tree>
  """

  use Phoenix.Component

  attr :id, :string, default: nil
  attr :aria_label, :string, default: nil
  attr :aria_labelledby, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def tree(assigns) do
    ~H"""
    <ul
      id={@id}
      role="tree"
      data-slot="tree"
      aria-label={@aria_label}
      aria-labelledby={@aria_labelledby}
      class={["w-fit min-w-56 select-none text-sm text-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </ul>
    <%= Phoenix.HTML.raw(~s(<script>(function(el){var items=el.querySelectorAll('[role="treeitem"]');items.forEach(function(it,i){it.setAttribute('tabindex',i===0?'0':'-1');});el.setAttribute('data-tree-ready','true');})(document.currentScript.previousElementSibling);</script>)) %>
    """
  end

  attr :label, :string, default: nil
  attr :value, :string, default: nil
  attr :parent, :boolean, default: false
  # nil means "end node" (no aria-expanded); true/false means a parent node.
  attr :expanded, :boolean, default: nil
  attr :selected, :boolean, default: false
  # current: "page" (the canonical current-location value) or true → "page".
  # Distinct from selected (current = where you ARE) — APG treeview-navigation.
  attr :current, :any, default: nil
  # aria-level/-posinset/-setsize. REQUIRED only for lazy-loaded (htmx) trees
  # whose full node set is not yet in the DOM (APG treeview pattern + MDN
  # treeitem role); declared in the treeview-1b example.
  attr :level, :integer, default: nil
  attr :posinset, :integer, default: nil
  attr :setsize, :integer, default: nil
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def tree_item(assigns) do
    assigns =
      assigns
      |> assign(:is_parent, assigns.parent || assigns.expanded != nil)
      |> assign(
        :aria_current,
        case assigns.current do
          true -> "page"
          false -> nil
          other -> other
        end
      )

    ~H"""
    <li
      role="treeitem"
      data-slot="tree-item"
      data-value={@value}
      tabindex="-1"
      aria-expanded={@is_parent && (if @expanded, do: "true", else: "false")}
      aria-selected={if @selected, do: "true", else: "false"}
      aria-current={@aria_current}
      aria-level={@level}
      aria-posinset={@posinset}
      aria-setsize={@setsize}
      aria-disabled={@disabled && "true"}
      class={@class}
      {@rest}
    >
      <span
        data-slot="tree-label"
        class="flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 outline-none"
      >
        <svg
          :if={@is_parent}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          data-slot="tree-chevron"
          class="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span :if={!@is_parent} aria-hidden="true" class="size-4 shrink-0"></span>
        {@label}
      </span>
      {render_slot(@inner_block)}
    </li>
    """
  end

  attr :class, :string, default: nil
  slot :inner_block, required: true

  def tree_group(assigns) do
    ~H"""
    <ul role="group" data-slot="tree-group" class={["ml-3.5 border-l border-border pl-1.5", @class]}>
      {render_slot(@inner_block)}
    </ul>
    """
  end
end
