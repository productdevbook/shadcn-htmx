defmodule ShadcnHtmx.Components.CascadingSelect do
  @moduledoc """
  Cascading Select — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/cascading-select.tsx. A pair of dependent native
  `<select>`s: picking the parent reloads the child's `<option>`s (and an
  optional detail panel via `hx-swap-oob`) from the server.

  No `hx-trigger`: htmx defaults `<select>` to `change`.
  See repos/htmx/www/src/content/patterns/02-forms/04-linked-selects.md

  ## Examples

      <.cascading_select id="vehicle" endpoint={~p"/models"}
        parent_name="make" child_name="model"
        legend="Vehicle" parent_label="Make" child_label="Model">
        <option value="audi" selected>Audi</option>
        <option value="toyota">Toyota</option>
      </.cascading_select>

  The inner block provides the PARENT `<option>`s; pass the initially-selected
  parent's options via the optional `child_options` slot so the child renders
  populated before the first change. Return the child `<option>`s plus a
  `<.cascading_select_detail>` carrying `hx-swap-oob` from the endpoint.
  """

  use Phoenix.Component

  @base "peer flex h-9 w-full min-w-0 cursor-pointer appearance-none items-center rounded-md border border-input bg-background px-3 pr-8 py-1 text-base shadow-xs " <>
          "transition-[color,box-shadow] outline-none " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:cursor-not-allowed disabled:opacity-50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "md:text-sm dark:bg-input/30 " <>
          "[&.htmx-request]:opacity-70"

  attr :id, :string, required: true
  attr :endpoint, :string, required: true
  attr :parent_name, :string, default: "parent"
  attr :child_name, :string, default: "child"
  attr :legend, :string, default: nil
  attr :parent_label, :string, default: nil
  attr :child_label, :string, default: nil
  attr :method, :string, default: "get", values: ~w(get post)
  attr :disabled, :boolean, default: false
  attr :detail, :boolean, default: true
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(hx-indicator hx-swap hx-vals hx-sync hx-confirm hx-disabled-elt)

  slot :inner_block, required: true
  slot :child_options

  def cascading_select(assigns) do
    assigns =
      assigns
      |> assign(:base, @base)
      |> assign(:hx_attr, if(assigns.method == "post", do: "hx-post", else: "hx-get"))
      |> assign(
        :controls,
        if(assigns.detail,
          do: "#{assigns.id}-child #{assigns.id}-detail",
          else: "#{assigns.id}-child"
        )
      )

    ~H"""
    <fieldset
      data-slot="cascading-select"
      id={@id}
      disabled={@disabled}
      class={["grid gap-4", @class]}
      aria-labelledby={@legend && "#{@id}-legend"}
    >
      <legend
        :if={@legend}
        id={"#{@id}-legend"}
        class="mb-1 text-sm leading-none font-medium text-foreground"
        data-slot="cascading-select-legend"
      >
        {@legend}
      </legend>
      <div class="grid gap-2">
        <label
          :if={@parent_label}
          for={"#{@id}-parent"}
          class="text-sm leading-none font-medium text-foreground select-none"
        >
          {@parent_label}
        </label>
        <span class="relative inline-flex w-full">
          <select
            id={"#{@id}-parent"}
            name={@parent_name}
            data-slot="cascading-select-parent"
            class={@base}
            {%{@hx_attr => @endpoint}}
            hx-target={"##{@id}-child"}
            hx-include={"[name='#{@parent_name}']"}
            aria-controls={@controls}
            {@rest}
          >
            {render_slot(@inner_block)}
          </select>
          <.chevron />
        </span>
      </div>
      <div class="grid gap-2">
        <label
          :if={@child_label}
          for={"#{@id}-child"}
          class="text-sm leading-none font-medium text-foreground select-none"
        >
          {@child_label}
        </label>
        <span class="relative inline-flex w-full">
          <select
            id={"#{@id}-child"}
            name={@child_name}
            data-slot="cascading-select-child"
            class={@base}
          >
            {render_slot(@child_options)}
          </select>
          <.chevron />
        </span>
      </div>
      <div
        :if={@detail}
        id={"#{@id}-detail"}
        data-slot="cascading-select-detail"
        aria-live="polite"
        class="text-sm text-muted-foreground"
      >
      </div>
    </fieldset>
    """
  end

  attr :id, :string, required: true
  slot :inner_block, required: true

  @doc """
  Detail fragment for the OOB swap — return alongside the child options.

  `hx-swap-oob="innerHTML"` (not `"true"`/`outerHTML`) keeps the live
  `#id-detail` node in the DOM and swaps only its contents, preserving the
  aria-live region's identity across updates.
  """
  def cascading_select_detail(assigns) do
    ~H"""
    <div
      id={"#{@id}-detail"}
      data-slot="cascading-select-detail"
      hx-swap-oob="innerHTML"
      aria-live="polite"
      class="text-sm text-muted-foreground"
    >
      {render_slot(@inner_block)}
    </div>
    """
  end

  defp chevron(assigns) do
    ~H"""
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
    """
  end
end
