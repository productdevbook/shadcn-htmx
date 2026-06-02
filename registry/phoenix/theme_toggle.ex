defmodule ShadcnHtmx.Components.ThemeToggle do
  @moduledoc """
  Theme Toggle — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/theme-toggle.tsx EXACTLY. A light / dark / system
  colour-scheme switcher. The "system" default honours prefers-color-scheme;
  an explicit choice is persisted in a cookie so the server can re-render the
  right theme with no flash. The three states are a native radio group (one
  `<input type="radio">` per choice, grouped by `name`).

  Built on web standards (modelled on, NOT copied from these sources):
    - prefers-color-scheme media feature (the "system" default).
    - color-scheme property (native controls follow the theme).
    - cookie persistence + a pre-paint boot script, adapted from web.dev:
        repos/web.dev/.../patterns/theming/theme-switch
        repos/web.dev/.../patterns/theming/color-schemes
  APG radio group: repos/aria-practices/content/patterns/radio/

  ## Examples

      <.theme_toggle value={@conn.cookies["theme"] || "system"} />

      # persist server-side too (cookie is set by the boot script):
      <.theme_toggle value={@theme} hx-post="/prefs/theme" hx-trigger="change" hx-swap="none" />

  Pair with the boot script (see the docs site.js block) so the cookie is
  read/written and `.dark` is toggled on <html> with no flash.
  """

  use Phoenix.Component

  @group_base "inline-flex items-center gap-0.5 rounded-md border bg-muted p-0.5 text-muted-foreground shadow-xs " <>
                "aria-disabled:pointer-events-none aria-disabled:opacity-50"

  @item_base "relative inline-flex size-7 cursor-pointer items-center justify-center rounded-[5px] outline-none transition-colors " <>
               "peer-hover:bg-background/60 peer-hover:text-foreground " <>
               "peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-xs " <>
               "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 " <>
               "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " <>
               "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

  @icons %{
    "system" =>
      ~s(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>),
    "light" =>
      ~s(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>),
    "dark" =>
      ~s(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>)
  }

  @labels %{"system" => "System", "light" => "Light", "dark" => "Dark"}

  attr :value, :string, default: "system", values: ~w(system light dark)
  attr :name, :string, default: "theme"
  attr :id, :string, default: "theme-toggle"
  attr :disabled, :boolean, default: false
  attr :aria_label, :string, default: "Colour theme"
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-target hx-swap hx-trigger hx-vals
         aria-labelledby aria-describedby)

  def theme_toggle(assigns) do
    assigns =
      assigns
      |> assign(:group_base, @group_base)
      |> assign(:item_base, @item_base)
      |> assign(:options, ~w(system light dark))
      |> assign(:icons, @icons)
      |> assign(:labels, @labels)

    ~H"""
    <div
      role="radiogroup"
      aria-label={@aria_label}
      aria-disabled={if @disabled, do: "true", else: nil}
      data-slot="theme-toggle"
      data-name={@name}
      data-value={@value}
      class={[@group_base, @class]}
      {@rest}
    >
      <span :for={choice <- @options} class="relative inline-flex">
        <input
          type="radio"
          id={"#{@id}-#{choice}"}
          name={@name}
          value={choice}
          checked={choice == @value}
          disabled={@disabled}
          class="peer sr-only"
          data-slot="theme-toggle-item"
        />
        <label
          for={"#{@id}-#{choice}"}
          class={@item_base}
          data-slot="theme-toggle-label"
          title={@labels[choice]}
        >
          {Phoenix.HTML.raw(@icons[choice])}
          <span class="sr-only">{@labels[choice]}</span>
        </label>
      </span>
    </div>
    """
  end
end
