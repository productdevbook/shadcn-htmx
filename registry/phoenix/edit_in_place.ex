defmodule ShadcnHtmx.Components.EditInPlace do
  @moduledoc """
  Edit In Place — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/edit-in-place.tsx. The canonical htmx editable record:
  a read-only view with an Edit button that swaps in a pre-filled form.
  Save = PUT, Cancel re-GETs the view. No modal, no custom JS — the whole
  thing rides on outerHTML swaps over REST.
  See repos/htmx/www/src/content/patterns/03-records/04-edit-in-place.md.

  Two function components:
    - `edit_in_place/1`      — the read-only view (GET /users/1 returns this).
    - `edit_in_place_form/1` — the pre-filled editor (GET /users/1/edit).

  Each `:fields` entry is a map:

      %{label: "Email", value: "joe@smith.org", name: "email", type: "email", required: true}

  ## Examples

      <%# View %>
      <.edit_in_place id="user" edit_href="/users/1/edit" fields={[
        %{label: "Name", value: @user.name},
        %{label: "Email", value: @user.email, type: "email"}
      ]} />

      <%# Editor %>
      <.edit_in_place_form id="user" put_href="/users/1" cancel_href="/users/1" fields={[
        %{label: "Name", value: @user.name},
        %{label: "Email", value: @user.email, type: "email"}
      ]} />

  hx-target="this" + hx-swap="outerHTML" on each root mean every descendant
  request replaces the whole element in place.
  """

  use Phoenix.Component

  @container "flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm"
  @term "text-xs font-medium tracking-wide text-muted-foreground uppercase"
  @value "mt-0.5 text-sm font-medium text-foreground"
  @label "flex items-center gap-2 text-sm leading-none font-medium select-none " <>
            "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " <>
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " <>
            "text-xs font-medium tracking-wide text-muted-foreground uppercase"
  @input "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs " <>
            "transition-[color,box-shadow] outline-none " <>
            "selection:bg-primary selection:text-primary-foreground " <>
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground " <>
            "placeholder:text-muted-foreground " <>
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " <>
            "md:text-sm dark:bg-input/30 " <>
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
            "[&.htmx-request]:opacity-70"
  @btn_base "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none " <>
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
              "disabled:pointer-events-none disabled:opacity-50 " <>
              "aria-disabled:pointer-events-none aria-disabled:opacity-50 " <>
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " <>
              "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70 " <>
              "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"
  @edit_btn @btn_base <>
              " border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
  @save_btn @btn_base <> " bg-primary text-primary-foreground hover:bg-primary/90"
  @cancel_btn @btn_base <> " bg-secondary text-secondary-foreground hover:bg-secondary/80"

  attr :id, :string, default: nil
  attr :edit_href, :string, required: true
  attr :edit_label, :string, default: "Edit"
  attr :fields, :list, default: []
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-indicator)

  def edit_in_place(assigns) do
    assigns =
      assigns
      |> assign(:container, @container)
      |> assign(:term, @term)
      |> assign(:value, @value)
      |> assign(:edit_btn, @edit_btn)

    ~H"""
    <div
      data-slot="edit-in-place"
      data-mode="view"
      id={@id}
      hx-target="this"
      hx-swap="outerHTML"
      class={[@container, @class]}
      {@rest}
    >
      <dl class="flex flex-col gap-3" data-slot="edit-in-place-fields">
        <div :for={f <- @fields}>
          <dt class={@term}>{f.label}</dt>
          <dd class={@value}>{f.value}</dd>
        </div>
      </dl>
      <div class="flex">
        <button
          type="button"
          data-slot="edit-in-place-edit"
          hx-get={@edit_href}
          hx-target="closest [data-slot='edit-in-place']"
          hx-swap="outerHTML"
          class={@edit_btn}
        >
          {@edit_label}
        </button>
      </div>
    </div>
    """
  end

  attr :id, :string, default: nil
  attr :put_href, :string, required: true
  attr :cancel_href, :string, required: true
  attr :save_label, :string, default: "Save"
  attr :cancel_label, :string, default: "Cancel"
  attr :fields, :list, default: []
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-target hx-swap hx-trigger hx-indicator)

  def edit_in_place_form(assigns) do
    base_id = assigns.id || "field"

    assigns =
      assigns
      |> assign(:base_id, base_id)
      |> assign(:container, @container)
      |> assign(:label, @label)
      |> assign(:input, @input)
      |> assign(:save_btn, @save_btn)
      |> assign(:cancel_btn, @cancel_btn)

    ~H"""
    <form
      data-slot="edit-in-place"
      data-mode="edit"
      id={@id}
      hx-put={@put_href}
      hx-target="this"
      hx-swap="outerHTML"
      class={[@container, @class]}
      {@rest}
    >
      <div class="flex flex-col gap-3" data-slot="edit-in-place-fields">
        <div :for={f <- @fields} class="grid gap-1.5">
          <label for={"#{@base_id}-#{f[:name] || String.downcase(f.label)}"} class={@label}>
            {f.label}
          </label>
          <input
            id={"#{@base_id}-#{f[:name] || String.downcase(f.label)}"}
            name={f[:name] || String.downcase(f.label)}
            type={f[:type] || "text"}
            value={f.value}
            required={f[:required] || nil}
            data-slot="input"
            class={@input}
          />
        </div>
      </div>
      <div class="flex gap-2">
        <button type="submit" data-slot="edit-in-place-save" class={@save_btn}>
          {@save_label}
        </button>
        <button
          type="button"
          data-slot="edit-in-place-cancel"
          hx-get={@cancel_href}
          hx-target="closest [data-slot='edit-in-place']"
          hx-swap="outerHTML"
          class={@cancel_btn}
        >
          {@cancel_label}
        </button>
      </div>
    </form>
    """
  end
end
