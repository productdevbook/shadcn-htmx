defmodule ShadcnHtmx.Components.Input do
  @moduledoc """
  Input — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/input.tsx. Works with plain HEEx and LiveView forms;
  htmx attributes and any other input attribute pass through via `:rest`.

  ## Examples

      <.input type="email" name="email" placeholder="you@example.com" required />
      <.input type="search" name="q"
              hx-get="/search" hx-target="#results"
              hx-trigger="input changed delay:300ms" />

  See repos/mdn/files/en-us/web/html/reference/elements/input/ for native
  attribute semantics.
  """

  use Phoenix.Component

  @base "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs " <>
          "transition-[color,box-shadow] outline-none " <>
          "selection:bg-primary selection:text-primary-foreground " <>
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground " <>
          "placeholder:text-muted-foreground " <>
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " <>
          "md:text-sm dark:bg-input/30 " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "[&.htmx-request]:opacity-70"

  attr :type, :string,
    default: "text",
    values:
      ~w(text password email number search tel url date time datetime-local month week color file hidden)

  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-indicator hx-vals hx-include hx-disable
         id name value placeholder required disabled readonly
         minlength maxlength min max step pattern
         inputmode enterkeyhint autocomplete autocapitalize autofocus list accept capture multiple size dirname form
         spellcheck autocorrect
         aria-label aria-labelledby aria-describedby aria-invalid aria-required)

  def input(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <input
      type={@type}
      class={[@base_class, @class]}
      data-slot="input"
      {@rest}
    />
    """
  end
end
