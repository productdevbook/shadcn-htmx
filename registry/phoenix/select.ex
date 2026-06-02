defmodule ShadcnHtmx.Components.Select do
  @moduledoc """
  Select — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/select.tsx. Native `<select>` + a chevron icon overlay.
  Full keyboard, mobile-native picker, form submission for free.

  ## Examples

      <.select id="role" name="role" aria-label="Role">
        <option value="admin"  selected>Administrator</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </.select>

      <.select name="country"
        hx-get={~p"/cities"} hx-target="#cities" hx-trigger="change">
        <option value="tr">Türkiye</option>
        <option value="de">Deutschland</option>
      </.select>
  """

  use Phoenix.Component

  @base "peer flex h-9 w-full min-w-0 cursor-pointer appearance-none items-center rounded-md border border-input bg-background px-3 pr-8 py-1 text-base shadow-xs " <>
          "transition-[color,box-shadow] outline-none " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:cursor-not-allowed disabled:opacity-50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "md:text-sm dark:bg-input/30 " <>
          "[&.htmx-request]:opacity-70"

  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-vals hx-include
         id name required disabled multiple size form autocomplete
         aria-label aria-labelledby aria-describedby aria-invalid
         aria-errormessage aria-required)

  slot :inner_block, required: true

  def select(assigns) do
    assigns = assign(assigns, :base, @base)

    ~H"""
    <span class="relative inline-flex w-full">
      <select class={[@base, @class]} data-slot="select" {@rest}>
        {render_slot(@inner_block)}
      </select>
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
    </span>
    """
  end
end
