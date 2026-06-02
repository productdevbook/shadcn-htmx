defmodule ShadcnHtmx.Components.Textarea do
  @moduledoc """
  Textarea — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/textarea.tsx. Uses CSS `field-sizing: content` so the
  element grows with its value — no JS auto-resize hook required.

  ## Examples

      <.textarea name="bio" placeholder="Tell us about yourself…" rows="4" />

      <.textarea name="comment"
        hx-post="/comments/draft" hx-trigger="input changed delay:500ms" />
  """

  use Phoenix.Component

  @base "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs " <>
          "transition-[color,box-shadow] outline-none " <>
          "placeholder:text-muted-foreground " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:cursor-not-allowed disabled:opacity-50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "md:text-sm dark:bg-input/30 " <>
          "[&.htmx-request]:opacity-70"

  attr :class, :string, default: nil
  attr :value, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-indicator hx-vals hx-include
         id name placeholder required disabled readonly
         rows cols minlength maxlength autocomplete autocapitalize autocorrect autofocus spellcheck dirname wrap form
         inputmode enterkeyhint
         aria-label aria-labelledby aria-describedby aria-invalid aria-required aria-errormessage)

  def textarea(assigns) do
    assigns = assign(assigns, :base_class, @base)

    ~H"""
    <textarea
      class={[@base_class, @class]}
      data-slot="textarea"
      {@rest}
    >{@value}</textarea>
    """
  end
end
