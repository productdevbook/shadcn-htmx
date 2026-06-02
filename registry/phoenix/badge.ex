defmodule ShadcnHtmx.Components.Badge do
  @moduledoc """
  Badge — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/badge.tsx. Non-interactive visual marker; renders
  as `<span>` by default. Pass `as="a"` + `href` for a link badge,
  `as="button"` for a clickable one.

  Accessibility: badge text is the accessible name. Use `aria-label` for
  icon-only badges. Status badges that change in place should live inside
  an `aria-live` region (see Alert / Toast).
  """

  use Phoenix.Component

  @base "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "[&>svg]:pointer-events-none [&>svg]:size-3"

  @variants %{
    "default" => "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
    "secondary" =>
      "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
    "destructive" =>
      "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
    "outline" =>
      "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
    "ghost" => "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
    "link" => "text-primary underline-offset-4 [a&]:hover:underline"
  }

  attr :variant, :string,
    default: "default",
    values: ~w(default secondary destructive outline ghost link)

  attr :as, :string, default: "span", values: ~w(span a div button)
  attr :href, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  slot :inner_block, required: true

  def badge(assigns) do
    assigns =
      assigns
      |> assign(:variant_class, Map.fetch!(@variants, assigns.variant))
      |> assign(:base_class, @base)

    ~H"""
    <.dynamic_tag
      tag_name={@as}
      data-slot="badge"
      data-variant={@variant}
      href={if @as == "a", do: @href}
      class={[@base_class, @variant_class, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </.dynamic_tag>
    """
  end
end
