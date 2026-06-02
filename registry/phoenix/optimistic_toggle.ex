defmodule ShadcnHtmx.Components.OptimisticToggle do
  @moduledoc """
  Optimistic Toggle — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A server-backed action toggle (like / star / follow / pin). Clicking flips
  the appearance instantly via a native `<template>` of the toggled state, then
  reconciles with the server's HTML response (rolling back on error).

  Mirrors registry/ui/optimistic-toggle.tsx.

  No htmx extension needed. The behaviour `<script>` rendered with the component
  wires the optimistic flip + rollback with real htmx v4 events
  (`htmx:before:request` to flip, `htmx:before:swap` to cancel + roll back on a
  4xx/5xx). It self-guards with `window.__shadcnOptimisticToggle` so it attaches
  once page-wide. (htmx v4's bundled `hx-optimistic` extension is an unfinished
  stub that neither flips `aria-pressed` nor cancels the error swap.)

  A real `<button>` + `aria-pressed` follows the APG Button (toggle) pattern:
  the accessible name stays constant; only `aria-pressed` flips.
  repos/aria-practices/content/patterns/button/examples/button.html

  ## Examples

      <.optimistic_toggle id="like-42" pressed={@liked}
        hx-post="/posts/42/like" aria-label="Like">
        <:current>{if @liked, do: "Liked", else: "Like"}</:current>
        <:optimistic>Liked</:optimistic>
      </.optimistic_toggle>
  """

  use Phoenix.Component

  @variants %{
    "default" =>
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground " <>
        "aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90",
    "outline" =>
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground " <>
        "aria-pressed:border-primary aria-pressed:text-primary aria-pressed:bg-primary/10 aria-pressed:hover:bg-primary/15",
    "ghost" =>
      "hover:bg-accent hover:text-accent-foreground " <>
        "aria-pressed:bg-secondary aria-pressed:text-secondary-foreground aria-pressed:hover:bg-secondary/80"
  }

  @sizes %{
    "default" => "h-9 px-4 py-2 has-[>svg]:px-3",
    "sm" => "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
    "lg" => "h-10 rounded-md px-6 has-[>svg]:px-4",
    "icon" => "size-9"
  }

  @base "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium " <>
          "whitespace-nowrap transition-all outline-none " <>
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " <>
          "disabled:pointer-events-none disabled:opacity-50 " <>
          "aria-disabled:pointer-events-none aria-disabled:opacity-50 " <>
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " <>
          "[&.htmx-request]:opacity-80"

  attr :id, :string, required: true
  attr :pressed, :boolean, default: false

  attr :variant, :string, default: "default", values: ~w(default outline ghost)
  attr :size, :string, default: "default", values: ~w(default sm lg icon)

  attr :disabled, :boolean, default: false
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger hx-vals hx-confirm hx-disable
         aria-label aria-labelledby aria-describedby)

  slot :current, required: true, doc: "Inner markup for the resting state."
  slot :optimistic, required: true, doc: "Inner markup for the just-toggled state."

  # Optimistic flip + rollback behaviour, using only real htmx v4 events plus
  # the platform <template> + aria-pressed. Self-guarded so it attaches once
  # page-wide no matter how many toggles render. Rendered raw inside <script>.
  @behaviour_js """
  (function(){
    if (window.__shadcnOptimisticToggle) return;
    window.__shadcnOptimisticToggle = true;
    function toggleFor(detail){
      var ctx = detail && detail.ctx;
      var src = ctx && ctx.sourceElement;
      if (!src || !src.closest) return null;
      var btn = src.closest('[data-slot="optimistic-toggle"] > button[aria-pressed]');
      return btn || (src.matches && src.matches('button[aria-pressed]') &&
        src.closest('[data-slot="optimistic-toggle"]') ? src : null);
    }
    document.body.addEventListener('htmx:before:request', function(e){
      var btn = toggleFor(e.detail);
      if (!btn) return;
      btn.__optHTML = btn.innerHTML;
      btn.__optPressed = btn.getAttribute('aria-pressed');
      var sel = btn.getAttribute('data-optimistic');
      var tmpl = sel && document.querySelector(sel);
      var inner = tmpl && tmpl.content ? tmpl.content.querySelector('[data-slot="optimistic-toggle-state"]') : null;
      if (inner) btn.innerHTML = inner.innerHTML;
      btn.setAttribute('aria-pressed', btn.__optPressed === 'true' ? 'false' : 'true');
    }, true);
    document.body.addEventListener('htmx:before:swap', function(e){
      var btn = toggleFor(e.detail);
      if (!btn || btn.__optHTML == null) return;
      var status = e.detail && e.detail.ctx && e.detail.ctx.response && e.detail.ctx.response.status;
      if (status >= 400){
        e.preventDefault();
        btn.innerHTML = btn.__optHTML;
        btn.setAttribute('aria-pressed', btn.__optPressed);
      }
      btn.__optHTML = null;
    }, true);
    document.body.addEventListener('htmx:error', function(e){
      var btn = toggleFor(e.detail);
      if (!btn || btn.__optHTML == null) return;
      btn.innerHTML = btn.__optHTML;
      btn.setAttribute('aria-pressed', btn.__optPressed);
      btn.__optHTML = null;
    }, true);
  })();
  """

  def optimistic_toggle(assigns) do
    assigns =
      assigns
      |> assign(:classes, [@base, Map.fetch!(@variants, assigns.variant), Map.fetch!(@sizes, assigns.size), assigns.class])
      |> assign(:template_id, "#{assigns.id}-optimistic")
      |> assign(:behaviour_js, Phoenix.HTML.raw(@behaviour_js))

    ~H"""
    <span data-slot="optimistic-toggle" class="contents">
      <button
        type="button"
        id={@id}
        class={@classes}
        disabled={@disabled}
        aria-pressed={to_string(@pressed)}
        data-variant={@variant}
        data-size={@size}
        hx-target="this"
        hx-swap="outerHTML"
        data-optimistic={"##{@template_id}"}
        {@rest}
      >
        {render_slot(@current)}
      </button>
      <template id={@template_id}>
        <span data-slot="optimistic-toggle-state" class={[@classes, "pointer-events-none"]} aria-pressed="true">
          {render_slot(@optimistic)}
        </span>
      </template>
      <%!-- Optimistic flip + rollback. Self-guarded so it attaches once page-wide. --%>
      <script>{@behaviour_js}</script>
    </span>
    """
  end
end
