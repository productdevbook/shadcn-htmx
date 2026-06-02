defmodule ShadcnHtmx.Components.Separator do
  @moduledoc """
  Separator — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/separator.tsx.

  Semantics:
    - `decorative: true` (default) → purely visual; renders as a styled <div>
      with no role so AT skips it.
    - `decorative: false` (semantic) → marks a thematic break. Horizontal
      uses <hr> (implicit role="separator"); vertical uses
      <div role="separator" aria-orientation="vertical"> (no native equivalent).

  ## Examples

      <.separator />                          # decorative horizontal
      <.separator orientation="vertical" />   # decorative vertical
      <.separator decorative={false} />       # semantic <hr>
  """

  use Phoenix.Component

  @base "shrink-0 bg-border " <>
          "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full " <>
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"

  attr :orientation, :string, default: "horizontal", values: ~w(horizontal vertical)
  attr :decorative, :boolean, default: true
  attr :class, :string, default: nil
  attr :rest, :global

  def separator(assigns) do
    assigns = assign(assigns, :base, @base)

    cond do
      not assigns.decorative and assigns.orientation == "horizontal" ->
        ~H"""
        <hr
          data-slot="separator"
          data-orientation="horizontal"
          aria-orientation="horizontal"
          class={[@base, "border-0", @class]}
          {@rest}
        />
        """

      true ->
        ~H"""
        <div
          data-slot="separator"
          data-orientation={@orientation}
          role={if !@decorative, do: "separator"}
          aria-orientation={if !@decorative, do: @orientation}
          class={[@base, @class]}
          {@rest}
        />
        """
    end
  end
end
