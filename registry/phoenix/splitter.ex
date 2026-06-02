defmodule ShadcnHtmx.Components.Splitter do
  @moduledoc """
  Splitter (window splitter) — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/splitter.tsx. A CSS grid whose first track is sized by
  `--split` (a percentage) plus a focusable `role="separator"` divider.
  public/site.js (keyed on data-slot="splitter") owns pointer drag + the APG
  keyboard contract and keeps `--split` / `aria-valuenow` in sync.

  Accessibility contract follows the WAI-ARIA APG Window Splitter pattern:
  repos/aria-practices/content/patterns/windowsplitter/windowsplitter-pattern.html

  ## Examples

      <.splitter aria-label="Files" value={30} primary_id="files">
        <:primary>Sidebar</:primary>
        <:secondary>Editor</:secondary>
      </.splitter>
  """

  use Phoenix.Component

  attr :orientation, :string, default: "horizontal", values: ~w(horizontal vertical)
  attr :value, :integer, default: 50
  attr :min, :integer, default: 0
  attr :max, :integer, default: 100
  attr :step, :integer, default: 10
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :primary_id, :string, default: nil
  attr :id, :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :primary, required: true
  slot :secondary, required: true

  def splitter(assigns) do
    # Clamp the initial value into [min, max] so --split and aria-valuenow agree.
    now = assigns.value |> max(assigns.min) |> min(assigns.max)
    pane_id = assigns.primary_id || (assigns.id && "#{assigns.id}-primary")
    assigns = assign(assigns, now: now, pane_id: pane_id)

    ~H"""
    <div
      id={@id}
      data-slot="splitter"
      data-orientation={@orientation}
      style={"--split:#{@now}%"}
      class={[
        "grid w-full overflow-hidden rounded-md border bg-card",
        "data-[orientation=horizontal]:h-64 data-[orientation=horizontal]:grid-cols-[var(--split,50%)_auto_minmax(0,1fr)]",
        "data-[orientation=vertical]:h-96 data-[orientation=vertical]:grid-rows-[var(--split,50%)_auto_minmax(0,1fr)]",
        @class
      ]}
      {@rest}
    >
      <div data-slot="splitter-panel" data-splitter-panel="primary" id={@pane_id} class="min-h-0 min-w-0 overflow-auto p-4 text-sm text-foreground">
        {render_slot(@primary)}
      </div>
      <div
        role="separator"
        tabindex="0"
        data-slot="splitter-handle"
        data-orientation={@orientation}
        data-min={@min}
        data-max={@max}
        data-step={@step}
        data-collapsed="false"
        aria-orientation={@orientation}
        aria-controls={@pane_id}
        aria-label={!assigns[:"aria-labelledby"] && assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        aria-valuenow={@now}
        aria-valuemin={@min}
        aria-valuemax={@max}
        class={[
          "group/splitter relative flex shrink-0 touch-none items-center justify-center bg-border outline-none transition-colors select-none",
          "hover:bg-ring/40 focus-visible:bg-ring/40 focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "data-[orientation=horizontal]:w-1.5 data-[orientation=horizontal]:cursor-col-resize data-[orientation=horizontal]:h-full",
          "data-[orientation=vertical]:h-1.5 data-[orientation=vertical]:cursor-row-resize data-[orientation=vertical]:w-full"
        ]}
      >
        <span
          class="pointer-events-none rounded-full bg-muted-foreground/40 transition-colors group-hover/splitter:bg-muted-foreground/70 group-data-[orientation=horizontal]/splitter:h-6 group-data-[orientation=horizontal]/splitter:w-0.5 group-data-[orientation=vertical]/splitter:w-6 group-data-[orientation=vertical]/splitter:h-0.5"
          aria-hidden="true"
        >
        </span>
      </div>
      <div data-slot="splitter-panel" data-splitter-panel="secondary" class="min-h-0 min-w-0 overflow-auto p-4 text-sm text-foreground">
        {render_slot(@secondary)}
      </div>
    </div>
    """
  end
end
