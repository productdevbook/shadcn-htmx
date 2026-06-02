defmodule ShadcnHtmx.Components.AutosizeTextarea do
  @moduledoc """
  Autosize Textarea — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/autosize-textarea.tsx. A `<textarea>` that grows and
  shrinks to fit its content between min/max bounds via the single CSS rule
  `field-sizing: content` — no scrollHeight JS hack required. See
  repos/mdn/files/en-us/web/css/reference/properties/field-sizing/index.md and
  the Tailwind utility in repos/tailwindcss/.../utilities.ts (field-sizing-content).

  Where `field-sizing` is unsupported the rule is ignored and the element renders
  as a plain fixed-height textarea — progressive enhancement, not emulation.

  ## Examples

      <.autosize_textarea name="reply" placeholder="Write a reply…" />

      <.autosize_textarea name="comment"
        hx-post="/comments/draft" hx-trigger="input changed delay:500ms" />

      <.autosize_textarea autosize={false} value="A plain bounded textarea." />
  """

  use Phoenix.Component

  @base "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs " <>
          "transition-[color,box-shadow] outline-none " <>
          "placeholder:text-muted-foreground " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:cursor-not-allowed disabled:opacity-50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "md:text-sm dark:bg-input/30 " <>
          "[&.htmx-request]:opacity-70"

  attr :class, :string, default: nil
  attr :value, :string, default: nil
  attr :autosize, :boolean, default: true
  attr :min_height, :string, default: "min-h-16"
  attr :max_height, :string, default: "max-h-80"

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-indicator hx-vals hx-include
         id name placeholder required disabled readonly
         rows cols minlength maxlength autocomplete autocapitalize autocorrect autofocus spellcheck dirname wrap form
         aria-label aria-labelledby aria-describedby aria-invalid aria-required)

  def autosize_textarea(assigns) do
    sizing = if assigns.autosize, do: "field-sizing-content resize-none", else: "field-sizing-fixed resize-y"

    assigns =
      assigns
      |> assign(:base_class, @base)
      |> assign(:sizing_class, sizing)

    ~H"""
    <textarea
      class={[@base_class, @sizing_class, @min_height, @max_height, "overflow-auto", @class]}
      data-slot="autosize-textarea"
      data-autosize={to_string(@autosize)}
      {@rest}
    >{@value}</textarea>
    """
  end
end
