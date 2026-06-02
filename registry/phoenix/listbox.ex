defmodule ShadcnHtmx.Components.Listbox do
  @moduledoc """
  Listbox — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/listbox.tsx. Function components: `listbox`,
  `listbox_option`, `listbox_group`.

  Renders the APG Listbox pattern: a `<ul role="listbox">` with
  `<li role="option">` children, a sibling hidden `<input>` for form
  submission, and a boot `<script>` that sets the roving tabindex (single
  tab stop) + seeds the hidden value on first paint. public/site.js (keyed
  on data-slot="listbox") owns the live keyboard + selection contract.
  Accessibility contract:
  repos/aria-practices/content/patterns/listbox/listbox-pattern.html

  ## Examples

      <.listbox aria-label="Favourite element" name="element">
        <.listbox_option value="H" selected>Hydrogen</.listbox_option>
        <.listbox_option value="He">Helium</.listbox_option>
        <.listbox_option value="Li">Lithium</.listbox_option>
      </.listbox>
  """

  use Phoenix.Component

  attr :orientation, :string, default: "vertical", values: ~w(horizontal vertical)
  attr :multiple, :boolean, default: false
  attr :disabled, :boolean, default: false
  # Group-level "one must be chosen" requirement (listbox supports aria-required).
  # repos/mdn/files/en-us/web/accessibility/aria/reference/roles/listbox_role/index.md
  attr :required, :boolean, default: false
  # WCAG error-identification: aria-invalid + aria-errormessage point at a visible error.
  # repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-invalid/index.md
  attr :"aria-invalid", :boolean, default: nil
  attr :"aria-errormessage", :string, default: nil
  # Locked-but-operable, distinct from aria-disabled.
  # repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-readonly/index.md
  attr :"aria-readonly", :boolean, default: false
  attr :name, :string, default: nil
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def listbox(assigns) do
    ~H"""
    <span class="relative inline-flex w-full flex-col">
      <ul
        role="listbox"
        data-slot="listbox"
        data-orientation={@orientation}
        aria-orientation={@orientation}
        aria-multiselectable={@multiple && "true"}
        aria-label={assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        aria-disabled={@disabled && "true"}
        aria-required={@required && "true"}
        aria-invalid={if assigns[:"aria-invalid"] == nil, do: nil, else: to_string(assigns[:"aria-invalid"])}
        aria-errormessage={assigns[:"aria-errormessage"]}
        aria-readonly={assigns[:"aria-readonly"] && "true"}
        tabindex="-1"
        class={[
          "max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-md border bg-background p-1 text-sm shadow-xs outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          "data-[orientation=horizontal]:flex data-[orientation=horizontal]:max-h-none data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:overflow-y-hidden",
          @class
        ]}
        {@rest}
      >
        {render_slot(@inner_block)}
      </ul>
      <input :if={@name} type="hidden" name={@name} data-listbox-value="" />
      <script>{Phoenix.HTML.raw(~s"""
        (function(el){
          var opts = el.querySelectorAll('[role="option"]');
          var sel = el.querySelector('[role="option"][aria-selected="true"]:not([aria-disabled="true"])');
          var active = sel || el.querySelector('[role="option"]:not([aria-disabled="true"])');
          opts.forEach(function(o){ o.setAttribute('tabindex', o === active ? '0' : '-1'); });
          var hidden = el.parentNode && el.parentNode.querySelector('[data-listbox-value]');
          if (hidden) {
            var vals = [];
            el.querySelectorAll('[role="option"][aria-selected="true"]').forEach(function(o){
              vals.push(o.getAttribute('data-value') || (o.textContent || '').trim());
            });
            hidden.value = vals.join(',');
          }
          el.setAttribute('data-listbox-ready','true');
        })(document.currentScript.parentNode.querySelector('[data-slot="listbox"]'));
      """)}</script>
    </span>
    """
  end

  attr :value, :string, default: nil
  attr :selected, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :id, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def listbox_option(assigns) do
    ~H"""
    <li
      role="option"
      data-slot="listbox-option"
      data-value={@value}
      aria-selected={!@disabled && (if @selected, do: "true", else: "false")}
      aria-disabled={@disabled && "true"}
      id={@id}
      class={[
        "relative flex cursor-pointer scroll-my-1 items-center gap-2 rounded-sm px-2 py-1.5 text-foreground outline-none select-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:bg-accent focus-visible:text-accent-foreground",
        "aria-selected:bg-primary aria-selected:text-primary-foreground",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        @class
      ]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </li>
    """
  end

  attr :label, :string, required: true
  attr :class, :string, default: nil
  slot :inner_block, required: true

  def listbox_group(assigns) do
    ~H"""
    <li role="presentation" data-slot="listbox-group-wrapper" class={["py-1", @class]}>
      <span aria-hidden="true" class="px-2 py-1 text-xs font-medium text-muted-foreground">
        {@label}
      </span>
      <ul role="group" data-slot="listbox-group" aria-label={@label} class="contents">
        {render_slot(@inner_block)}
      </ul>
    </li>
    """
  end
end
