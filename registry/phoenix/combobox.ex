defmodule ShadcnHtmx.Components.Combobox do
  @moduledoc """
  Combobox — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<input list>` + `<datalist>`. The browser handles the dropdown
  UI, filter, click + keyboard selection, focus management. No custom JS.

  ## Examples

      # Static options
      <.combobox id="lang" name="lang" placeholder="Pick a language…"
        options={[%{value: "JavaScript"}, %{value: "Python"}, %{value: "Go"}]} />

      # Server-filter via htmx — target the datalist by id.
      <.combobox id="user" name="user" placeholder="Search users…"
        hx-get={~p"/api/users/search"}
        hx-trigger="input changed delay:200ms"
        hx-target="#user-list"
        hx-swap="innerHTML" />
      # Endpoint returns: <.combobox_option value="ada" />
  """

  use Phoenix.Component

  attr :id, :string, required: true
  attr :name, :string, default: nil
  # `list` is valid on 13 input types, not just text.
  # repos/mdn/files/en-us/web/html/reference/elements/input/index.md:492
  attr :type, :string, default: "text"
  attr :placeholder, :string, default: nil
  attr :value, :string, default: nil
  attr :options, :list, default: []
  attr :required, :boolean, default: false
  attr :disabled, :boolean, default: false
  # Focusable + selectable but not editable. Not supported on range/color.
  # repos/mdn/files/en-us/web/html/reference/elements/input/index.md:588
  attr :readonly, :boolean, default: false
  # Constrain the free-typed value — datalist suggestions are not requirements.
  # repos/mdn/files/en-us/web/html/reference/elements/input/index.md:505
  attr :maxlength, :integer, default: nil
  attr :minlength, :integer, default: nil
  attr :pattern, :string, default: nil
  attr :title, :string, default: nil
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :"aria-describedby", :string, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(hx-get hx-post hx-trigger hx-target hx-swap hx-vals hx-headers)

  def combobox(assigns) do
    ~H"""
    <span data-slot="combobox" class={["inline-block w-full", @class]}>
      <input
        type={@type}
        id={@id}
        name={@name}
        list={"#{@id}-list"}
        value={@value}
        placeholder={@placeholder}
        required={@required}
        disabled={@disabled}
        readonly={@readonly}
        maxlength={@maxlength}
        minlength={@minlength}
        pattern={@pattern}
        title={@title}
        aria-label={assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        aria-describedby={assigns[:"aria-describedby"]}
        autocomplete="off"
        class="flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {@rest}
      />
      <datalist id={"#{@id}-list"} data-slot="combobox-list">
        <option
          :for={opt <- @options}
          value={opt[:value]}
          label={opt[:label]}
          disabled={opt[:disabled]}
        />
      </datalist>
    </span>
    """
  end

  attr :value, :string, required: true
  attr :label, :string, default: nil
  # Marks the option non-checkable (browsers grey it out).
  # repos/mdn/files/en-us/web/html/reference/elements/option/index.md:45
  attr :disabled, :boolean, default: false

  def combobox_option(assigns) do
    ~H"""
    <option value={@value} label={@label} disabled={@disabled} />
    """
  end
end
