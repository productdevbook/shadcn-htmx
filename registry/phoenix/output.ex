defmodule ShadcnHtmx.Components.Output do
  @moduledoc """
  Output — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Renders the native `<output>` element (implicit `role="status"`) — a live
  result region for the outcome of a calculation or a server action, tied to
  its inputs via the `for` attribute.

  Because `role="status"` is an implicit `aria-live="polite"`,
  `aria-atomic="true"` live region, an htmx `innerHTML` swap of the output's
  content is announced by assistive tech automatically — no JS needed. Target
  THIS `<output>` and swap `innerHTML` so the live region persists across
  requests.

  Source: repos/mdn/.../elements/output/index.md (for / form / name; implicit
  role="status").

  ## Examples

      <form hx-post="/cart/total" hx-trigger="change, input delay:300ms"
        hx-target="#total" hx-swap="innerHTML">
        <input id="qty" name="qty" value="1" />
        <.output id="total" for="qty price" tone="primary">$0.00</.output>
      </form>

      <.output for="a b" name="result">60</.output>
  """

  use Phoenix.Component

  @base "inline-flex min-h-9 w-fit items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium tabular-nums transition-colors [&.htmx-request]:opacity-60"

  @tones %{
    "default" => "border-border bg-card text-card-foreground",
    "muted" => "border-transparent bg-muted text-muted-foreground",
    "primary" => "border-transparent bg-primary text-primary-foreground",
    "destructive" => "border-destructive/30 bg-destructive/5 text-destructive dark:bg-destructive/10"
  }

  attr :for, :string, default: nil
  attr :form, :string, default: nil
  attr :name, :string, default: nil
  attr :tone, :string, default: "default", values: ~w(default muted primary destructive)
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-get hx-post hx-put hx-patch hx-delete hx-target hx-swap hx-trigger
         hx-include hx-vals hx-indicator id aria-label aria-labelledby
         aria-describedby aria-atomic)

  slot :inner_block, required: false

  def output(assigns) do
    assigns =
      assigns
      |> assign(:base, @base)
      |> assign(:tone_class, Map.fetch!(@tones, assigns.tone))

    ~H"""
    <output
      class={[@base, @tone_class, @class]}
      for={@for}
      form={@form}
      name={@name}
      data-slot="output"
      data-tone={@tone}
      {@rest}
    >{render_slot(@inner_block)}</output>
    """
  end
end
