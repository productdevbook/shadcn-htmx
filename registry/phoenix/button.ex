defmodule ShadcnHtmx.Components.Button do
  @moduledoc """
  Button — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/button.tsx so a Phoenix LiveView project can render
  the same markup our docs site renders. Works with plain HEEx templates
  too — htmx attributes pass straight through via `:rest`.

  ## Examples

      <.button hx-post="/save">Save</.button>
      <.button variant="destructive" size="sm">Delete</.button>
      <.button pressed={true} aria-label="Mute">Mute</.button>

      # Multi-submit form (one button posts to a different URL)
      <.button type="submit" name="action" value="continue"
               formaction="/orders/save" formmethod="post">
        Save and continue
      </.button>

  The button is a native `<button>` so role and Space/Enter activation come
  for free. See repos/aria-practices/content/patterns/button/.
  """

  use Phoenix.Component

  @variants %{
    "default" => "bg-primary text-primary-foreground hover:bg-primary/90",
    "destructive" =>
      "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
    "outline" =>
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
    "secondary" => "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    "ghost" => "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
    "link" => "text-primary underline-offset-4 hover:underline"
  }

  @sizes %{
    "default" => "h-9 px-4 py-2 has-[>svg]:px-3",
    "xs" =>
      "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
    "sm" => "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
    "lg" => "h-10 rounded-md px-6 has-[>svg]:px-4",
    "icon" => "size-9",
    "icon-xs" => "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
    "icon-sm" => "size-8",
    "icon-lg" => "size-10"
  }

  @base "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium " <>
          "whitespace-nowrap transition-all outline-none " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:pointer-events-none disabled:opacity-50 " <>
          "aria-disabled:pointer-events-none aria-disabled:opacity-50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " <>
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " <>
          "[&.htmx-request]:pointer-events-none [&.htmx-request]:opacity-70"

  attr :variant, :string,
    default: "default",
    values: ~w(default destructive outline secondary ghost link)

  attr :size, :string,
    default: "default",
    values: ~w(default xs sm lg icon icon-xs icon-sm icon-lg)

  attr :type, :string, default: "button"
  attr :disabled, :boolean, default: false
  # aria-disabled keeps the button focusable while unavailable, unlike `disabled`
  # which drops it from the a11y tree / tab order. Independent of `disabled`.
  # See repos/aria-practices/content/patterns/button/button-pattern.html
  attr :aria_disabled, :boolean, default: false
  # aria-pressed is tri-state: true | false | "mixed". `:any` accepts a "mixed"
  # string for toggles whose controlled items don't all share one value.
  # See repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-pressed/
  attr :pressed, :any, default: nil
  # Disclosure / menu trigger contract. See
  # repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-expanded/
  # and .../aria-haspopup/
  attr :aria_expanded, :any, default: nil
  attr :aria_haspopup, :any, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-indicator hx-confirm hx-vals hx-disable
         id name value form formaction formenctype formmethod formnovalidate formtarget popovertarget popovertargetaction
         command commandfor
         aria-label aria-labelledby aria-describedby aria-controls)

  slot :inner_block, required: true

  def button(assigns) do
    assigns =
      assigns
      |> assign(:variant_class, Map.fetch!(@variants, assigns.variant))
      |> assign(:size_class, Map.fetch!(@sizes, assigns.size))
      |> assign(:base_class, @base)

    ~H"""
    <button
      type={@type}
      class={[@base_class, @variant_class, @size_class, @class]}
      disabled={@disabled}
      aria-disabled={if @aria_disabled, do: "true", else: nil}
      aria-pressed={if is_nil(@pressed), do: nil, else: to_string(@pressed)}
      aria-expanded={if is_nil(@aria_expanded), do: nil, else: to_string(@aria_expanded)}
      aria-haspopup={if is_nil(@aria_haspopup), do: nil, else: to_string(@aria_haspopup)}
      data-slot="button"
      data-variant={@variant}
      data-size={@size}
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end
end
