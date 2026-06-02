defmodule ShadcnHtmx.Components.Autocomplete do
  @moduledoc """
  Autocomplete — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Free-text input with native typeahead suggestions: `<input list>` bound to
  a `<datalist>`. The light, native sibling of the APG combobox — the browser
  owns the dropdown UI, substring filtering, click + keyboard selection, and
  focus management. No custom JS. The value is always free text: an
  autocomplete *suggests*, it does not constrain.

  Refs: repos/mdn/.../elements/datalist/index.md,
        repos/mdn/.../elements/input/index.md#list

  ## Examples

      # Static suggestions
      <.autocomplete id="fruit" name="fruit" placeholder="Search fruit…"
        options={[%{value: "Apple"}, %{value: "Apricot"}, %{value: "Banana"}]} />

      # Server-streamed via htmx — set `endpoint`; the component wires
      # hx-get / hx-trigger / hx-target / hx-swap / hx-sync and the server
      # returns <option> tags swapped into the bound <datalist>.
      <.autocomplete id="city" name="city" placeholder="Search cities…"
        endpoint={~p"/api/cities"} />
      # Endpoint returns: <.autocomplete_option value="Berlin" />
  """

  use Phoenix.Component

  attr :id, :string, required: true
  attr :name, :string, default: nil
  attr :placeholder, :string, default: nil
  attr :value, :string, default: nil
  attr :options, :list, default: []
  attr :required, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :readonly, :boolean, default: false
  attr :minlength, :integer, default: nil
  attr :maxlength, :integer, default: nil
  attr :delay, :integer, default: 200
  attr :endpoint, :string, default: nil
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :"aria-describedby", :string, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(hx-get hx-post hx-trigger hx-target hx-swap hx-sync hx-vals hx-headers form)

  def autocomplete(assigns) do
    assigns =
      assign(assigns, :hx, if(assigns.endpoint, do: stream_attrs(assigns.id, assigns.delay, assigns.endpoint), else: %{}))

    ~H"""
    <span data-slot="autocomplete" class={["inline-block w-full", @class]}>
      <input
        type="text"
        id={@id}
        name={@name}
        list={"#{@id}-list"}
        value={@value}
        placeholder={@placeholder}
        required={@required}
        disabled={@disabled}
        readonly={@readonly}
        minlength={@minlength}
        maxlength={@maxlength}
        autocomplete="off"
        aria-label={assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        aria-describedby={assigns[:"aria-describedby"]}
        data-slot="autocomplete-input"
        class="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&.htmx-request]:opacity-70"
        {@hx}
        {@rest}
      />
      <datalist id={"#{@id}-list"} data-slot="autocomplete-list">
        <option :for={opt <- @options} value={opt[:value]} label={opt[:label]} />
      </datalist>
    </span>
    """
  end

  # Standard server-streaming htmx defaults; explicit hx-* in @rest override
  # these because @rest is spread after @hx in the markup.
  defp stream_attrs(id, delay, endpoint) do
    %{
      "hx-get" => endpoint,
      "hx-trigger" => "input changed delay:#{delay}ms",
      "hx-target" => "##{id}-list",
      "hx-swap" => "innerHTML",
      "hx-sync" => "this:replace"
    }
  end

  attr :value, :string, required: true
  attr :label, :string, default: nil

  def autocomplete_option(assigns) do
    ~H"""
    <option value={@value} label={@label} />
    """
  end
end
