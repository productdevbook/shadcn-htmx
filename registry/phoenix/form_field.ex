defmodule ShadcnHtmx.Components.FormField do
  @moduledoc """
  Form Field — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/form-field.tsx. A field row that composes a `<label>`,
  a control slot, an optional description, and an optional error. The label's
  `for`, plus the control's `aria-describedby` / `aria-invalid`, are wired from
  the `for`/`id` you pass. Error styling rides on the native `:user-invalid`
  pseudo-class — the field only turns red after the user interacts and a submit
  is attempted, so no premature errors and no JS.

  ## Examples

      <.form_field for="email" label="Email"
                   description="We'll never share it."
                   error={@errors[:email]} required>
        <.input id="email" name="email" type="email"
                aria-describedby="email-description email-error"
                aria-invalid={@errors[:email] && "true"} />
      </.form_field>

      <.form_fieldset id="plan" legend="Plan" error={@errors[:plan]}>
        <%!-- radios / checkboxes --%>
      </.form_fieldset>

  Built on `<fieldset>`/`<legend>`, Constraint Validation + `:user-invalid`,
  and `aria-describedby`. See:
    repos/mdn/files/en-us/web/html/reference/elements/fieldset/index.md
    repos/mdn/files/en-us/web/css/reference/selectors/_colon_user-invalid/index.md
    repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-describedby/index.md
  """

  use Phoenix.Component

  @field_base "grid gap-2 [&:has(:user-invalid)_[data-slot=form-field-label]]:text-destructive"
  @label_base "flex items-center gap-2 text-sm leading-none font-medium select-none " <>
                "data-[invalid=true]:text-destructive " <>
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
  @legend_base "text-sm leading-none font-medium select-none float-none mb-1 data-[invalid=true]:text-destructive"

  attr :for, :string, default: nil, doc: "id of the control; the label points at it"
  attr :label, :string, default: nil
  attr :description, :string, default: nil
  attr :error, :string, default: nil, doc: "non-nil => invalid"
  attr :invalid, :boolean, default: nil, doc: "force invalid without a message"
  attr :required, :boolean, default: false
  attr :class, :string, default: nil
  attr :label_class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def form_field(assigns) do
    assigns =
      assigns
      |> assign(:is_invalid, if(assigns.invalid != nil, do: assigns.invalid, else: assigns.error != nil))
      |> assign(:field_base, @field_base)
      |> assign(:label_base, @label_base)

    ~H"""
    <div
      class={[@field_base, @class]}
      data-slot="form-field"
      data-invalid={@is_invalid && "true"}
      {@rest}
    >
      <label
        :if={@label}
        for={@for}
        class={[@label_base, @label_class]}
        data-slot="form-field-label"
        data-invalid={@is_invalid && "true"}
        data-required={@required && "true"}
      >
        {@label}<span :if={@required} class="text-destructive" aria-hidden="true">*</span>
      </label>
      {render_slot(@inner_block)}
      <p
        :if={@description}
        id={@for && "#{@for}-description"}
        class="text-sm text-muted-foreground"
        data-slot="form-field-description"
      >
        {@description}
      </p>
      <p
        :if={@is_invalid && @error}
        id={@for && "#{@for}-error"}
        role="alert"
        aria-live="assertive"
        class="text-sm font-medium text-destructive"
        data-slot="form-field-error"
      >
        {@error}
      </p>
    </div>
    """
  end

  attr :id, :string, default: nil
  attr :legend, :string, default: nil
  attr :description, :string, default: nil
  attr :error, :string, default: nil
  attr :invalid, :boolean, default: nil
  attr :disabled, :boolean, default: false
  attr :required, :boolean, default: false
  attr :class, :string, default: nil
  attr :legend_class, :string, default: nil
  attr :rest, :global
  slot :inner_block, required: true

  def form_fieldset(assigns) do
    is_invalid = if assigns.invalid != nil, do: assigns.invalid, else: assigns.error != nil

    described =
      [
        assigns.id && assigns.description && "#{assigns.id}-description",
        assigns.id && is_invalid && assigns.error && "#{assigns.id}-error"
      ]
      |> Enum.filter(& &1)

    assigns =
      assigns
      |> assign(:is_invalid, is_invalid)
      |> assign(:describedby, if(described == [], do: nil, else: Enum.join(described, " ")))
      |> assign(:field_base, @field_base)
      |> assign(:legend_base, @legend_base)

    ~H"""
    <fieldset
      class={[@field_base, "min-w-0 border-0 p-0", @class]}
      data-slot="form-field"
      data-invalid={@is_invalid && "true"}
      disabled={@disabled}
      aria-describedby={@describedby}
      aria-invalid={@is_invalid && "true"}
      aria-required={@required && "true"}
      {@rest}
    >
      <legend
        :if={@legend}
        class={[@legend_base, @legend_class]}
        data-slot="form-field-legend"
        data-invalid={@is_invalid && "true"}
        data-required={@required && "true"}
      >
        {@legend}<span :if={@required} class="text-destructive" aria-hidden="true"> *</span>
      </legend>
      {render_slot(@inner_block)}
      <p
        :if={@description}
        id={@id && "#{@id}-description"}
        class="text-sm text-muted-foreground"
        data-slot="form-field-description"
      >
        {@description}
      </p>
      <p
        :if={@is_invalid && @error}
        id={@id && "#{@id}-error"}
        role="alert"
        aria-live="assertive"
        class="text-sm font-medium text-destructive"
        data-slot="form-field-error"
      >
        {@error}
      </p>
    </fieldset>
    """
  end
end
