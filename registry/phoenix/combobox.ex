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
  attr :placeholder, :string, default: nil
  attr :value, :string, default: nil
  attr :options, :list, default: []
  attr :required, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(hx-get hx-post hx-trigger hx-target hx-swap hx-vals hx-headers)

  def combobox(assigns) do
    ~H"""
    <span data-slot="combobox" class={["inline-block w-full", @class]}>
      <input
        type="text"
        id={@id}
        name={@name}
        list={"#{@id}-list"}
        value={@value}
        placeholder={@placeholder}
        required={@required}
        disabled={@disabled}
        aria-label={assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        autocomplete="off"
        class="flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {@rest}
      />
      <datalist id={"#{@id}-list"} data-slot="combobox-list">
        <option :for={opt <- @options} value={opt[:value]} label={opt[:label]} />
      </datalist>
    </span>
    """
  end

  attr :value, :string, required: true
  attr :label, :string, default: nil

  def combobox_option(assigns) do
    ~H"""
    <option value={@value} label={@label} />
    """
  end
end
