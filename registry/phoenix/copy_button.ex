defmodule ShadcnHtmx.Components.CopyButton do
  @moduledoc """
  Copy Button — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/copy-button.tsx so a Phoenix LiveView project renders the
  same markup our docs site renders. Works with plain HEEx too — htmx attributes
  pass through via `:rest`.

  Click-to-copy: writes `value` (or the text of the element named by
  `copy_target`) to the clipboard via the Async Clipboard API, then flips to a
  transient "Copied" state announced through an empty aria-live region. The
  shared behaviour ships in site.js. Sources:

    * repos/mdn/files/en-us/web/api/clipboard/writetext/index.md
    * repos/web.dev/src/site/content/en/patterns/clipboard/copy-text/index.md
    * repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-live/index.md

  ## Examples

      <.copy_button value="npm i shadcn-htmx" />
      <.copy_button copy_target="api-key" size="icon" aria-label="Copy API key" />

  Native `<button>` → role and Space/Enter activation come for free.
  See repos/aria-practices/content/patterns/button/.
  """

  use Phoenix.Component

  @variants %{
    "outline" =>
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
    "ghost" => "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
    "secondary" => "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }

  @sizes %{
    "default" => "h-8 px-2.5",
    "sm" => "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
    "icon" => "size-8 [&]:px-0"
  }

  @base "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-sm font-medium " <>
          "whitespace-nowrap transition-all outline-none " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:pointer-events-none disabled:opacity-50 " <>
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 " <>
          "[&[data-copied=true]]:text-emerald-600 dark:[&[data-copied=true]]:text-emerald-400 " <>
          "[&_[data-copy-check]]:hidden [&[data-copied=true]_[data-copy-icon]]:hidden [&[data-copied=true]_[data-copy-check]]:inline-flex"

  attr :value, :string, default: nil
  attr :copy_target, :string, default: nil

  attr :variant, :string, default: "outline", values: ~w(outline ghost secondary)
  attr :size, :string, default: "default", values: ~w(default sm icon)

  attr :label, :string, default: "Copy"
  attr :copied_label, :string, default: "Copied"
  attr :live, :string, default: "polite", values: ~w(polite assertive)
  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-vals
         id name value form aria-label aria-labelledby aria-describedby)

  def copy_button(assigns) do
    assigns =
      assigns
      |> assign(:variant_class, Map.fetch!(@variants, assigns.variant))
      |> assign(:size_class, Map.fetch!(@sizes, assigns.size))
      |> assign(:base_class, @base)
      |> assign(:icon_only, assigns.size == "icon")

    ~H"""
    <button
      type="button"
      data-slot="copy-button"
      data-variant={@variant}
      data-size={@size}
      data-copy-text={@value}
      data-copy-target={@copy_target}
      data-copied-label={@copied_label}
      class={[@base_class, @variant_class, @size_class, @class]}
      disabled={@disabled}
      aria-label={@rest[:"aria-label"] || if(@icon_only, do: @label, else: nil)}
      {@rest}
    >
      <svg
        data-copy-icon
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      <svg
        data-copy-check
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span :if={!@icon_only} data-copy-label>{@label}</span>
      <span class="sr-only" aria-live={@live} data-copy-status></span>
    </button>
    """
  end
end
