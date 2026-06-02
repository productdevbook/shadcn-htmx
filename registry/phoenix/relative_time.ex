defmodule ShadcnHtmx.Components.RelativeTime do
  @moduledoc """
  Relative Time — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/relative-time.tsx. Renders a native `<time>` element
  carrying a machine-readable `datetime` plus a human-readable label as its
  body. With no JavaScript the server label is what the visitor sees — fully
  progressive. The small behaviour `<script>` rendered with the component
  re-localises the label to the visitor's locale + timezone via the platform
  `Intl.RelativeTimeFormat` / `Intl.DateTimeFormat` APIs, degrading silently
  to the server label if `Intl` is unavailable.

  Built on the native `<time>` element (implicit ARIA role `time`); no extra
  role/ARIA needed. `hx-*` / `data-*` / `aria-*` flow through `@rest`.
  """

  use Phoenix.Component

  @base "tabular-nums"

  @tones %{
    "default" => "text-foreground",
    "muted" => "text-muted-foreground"
  }

  # Re-localise every [data-relative-time] <time> on the page. Self-guarded so
  # it attaches once page-wide no matter how many timestamps render, and re-runs
  # after htmx swaps. Rendered raw inside <script>. Identical to the shared
  # site.js block — drop this and load site.js once instead if you prefer.
  @behaviour_js """
  (function () {
    if (window.__shadcnRelativeTime) return;
    window.__shadcnRelativeTime = true;
    var DIV = [
      ["year", 31536000], ["month", 2592000], ["week", 604800],
      ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1]
    ];
    function relLabel(then, now) {
      var diff = Math.round((then - now) / 1000);
      var abs = Math.abs(diff);
      for (var i = 0; i < DIV.length; i++) {
        if (abs >= DIV[i][1] || DIV[i][0] === "second") {
          var rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
          return rtf.format(Math.round(diff / DIV[i][1]), DIV[i][0]);
        }
      }
    }
    function localize(el) {
      var iso = el.getAttribute("datetime");
      if (!iso) return;
      var t = new Date(iso);
      if (isNaN(t.getTime())) return;
      try {
        if (el.getAttribute("data-format") === "datetime") {
          el.textContent = new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium", timeStyle: "short"
          }).format(t);
        } else if (typeof Intl.RelativeTimeFormat === "function") {
          el.textContent = relLabel(t, new Date());
        }
        if (!el.getAttribute("title")) {
          el.setAttribute("title", new Intl.DateTimeFormat(undefined, {
            dateStyle: "full", timeStyle: "long"
          }).format(t));
        }
      } catch (e) { /* leave the server label in place */ }
    }
    function run(root) {
      (root || document)
        .querySelectorAll('[data-slot="relative-time"][data-relative-time]')
        .forEach(localize);
    }
    document.addEventListener("DOMContentLoaded", function () { run(document); });
    run(document);
    document.addEventListener("htmx:after:swap", function (e) { run(e.target || document); });
    document.addEventListener("htmx:afterSwap", function (e) { run(e.target || document); });
    setInterval(function () { run(document); }, 60000);
  })();
  """

  attr :datetime, :string, required: true, doc: "Machine-readable instant (ISO 8601)."
  attr :format, :string, default: "relative", values: ~w(relative datetime)
  attr :tone, :string, default: "muted", values: ~w(default muted)
  attr :id, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  slot :inner_block, required: true, doc: "Human-readable label, e.g. \"3 days ago\"."

  def relative_time(assigns) do
    assigns =
      assigns
      |> assign(:tone_class, Map.fetch!(@tones, assigns.tone))
      |> assign(:base_class, @base)
      |> assign(:behaviour_js, Phoenix.HTML.raw(@behaviour_js))

    ~H"""
    <time
      id={@id}
      datetime={@datetime}
      data-slot="relative-time"
      data-relative-time=""
      data-format={@format}
      class={[@base_class, @tone_class, @class]}
      {@rest}
    >{render_slot(@inner_block)}</time>
    <script>{@behaviour_js}</script>
    """
  end
end
