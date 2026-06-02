defmodule ShadcnHtmx.Components.Link do
  @moduledoc """
  Link — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/link.tsx. Renders a native `<a href>`, which the
  WAI-ARIA APG Link pattern "strongly encourages" over a faked role=link
  element — see
  repos/aria-practices/content/patterns/link/link-pattern.html. The native
  anchor gives us the implicit `link` role and Enter-activates-the-link
  keyboard behaviour with no JavaScript.

  ## Examples

      <.link_ href="/docs">Documentation</.link_>
      <.link_ href="/settings" variant="hover">Settings</.link_>
      <.link_ href="https://htmx.org" external>htmx.org</.link_>

  `external` sets `target="_blank" rel="noopener noreferrer"` and appends the
  "opens in new tab" icon + visually-hidden text (MDN: External links).

  `as="span"`/`"button"` renders the APG role=link fallback for markup that
  cannot be an `<a>`; you must wire navigation yourself. Prefer the native
  `<a>`.

  The function is named `link_` to avoid clashing with Phoenix.Component's
  built-in `link/1`.
  """

  use Phoenix.Component

  @base "inline-flex items-center gap-1 rounded-sm font-medium text-primary underline-offset-4 transition-colors outline-none " <>
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "[&[role=link]]:cursor-pointer " <>
          "[&>svg]:pointer-events-none [&>svg]:size-3.5 [&>svg]:shrink-0"

  @variants %{
    "default" => "underline decoration-primary/40 hover:decoration-primary",
    "muted" =>
      "text-muted-foreground underline decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground",
    "hover" => "no-underline hover:underline"
  }

  attr :variant, :string, default: "default", values: ~w(default muted hover)
  attr :href, :string, default: nil
  attr :external, :boolean, default: false
  attr :target, :string, default: nil
  attr :rel, :string, default: nil
  attr :as, :string, default: "a", values: ~w(a span button)
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-target hx-swap hx-boost hx-push-url
         download hreflang referrerpolicy ping type
         id aria-label aria-labelledby aria-describedby aria-current)

  slot :inner_block, required: true

  # APG fallback: href is invalid on a non-anchor element, so the browser will
  # not navigate (link/examples/link.html). We expose the destination as
  # data-href below so site.js can wire Enter/click on [role=link][data-href].
  def link_(assigns) do
    is_anchor = assigns.as == "a"
    target = assigns.target || if(assigns.external, do: "_blank")
    rel = assigns.rel || if(assigns.external, do: "noopener noreferrer")

    assigns =
      assigns
      |> assign(:variant_class, Map.fetch!(@variants, assigns.variant))
      |> assign(:base_class, @base)
      |> assign(:is_anchor, is_anchor)
      |> assign(:resolved_target, if(is_anchor, do: target))
      |> assign(:resolved_rel, if(is_anchor, do: rel))

    ~H"""
    <.dynamic_tag
      tag_name={@as}
      href={if @is_anchor, do: @href}
      target={@resolved_target}
      rel={@resolved_rel}
      role={if !@is_anchor, do: "link"}
      tabindex={if !@is_anchor, do: "0"}
      data-href={if !@is_anchor, do: @href}
      data-slot="link"
      data-variant={@variant}
      data-external={if @external, do: "true"}
      class={[@base_class, @variant_class, @class]}
      {@rest}
    >
      {render_slot(@inner_block)}<svg
        :if={@external}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      ><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg><span :if={@external} class="sr-only"> (opens in new tab)</span>
    </.dynamic_tag>
    """
  end
end
