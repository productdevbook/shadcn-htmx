defmodule ShadcnHtmx.Components.Rating do
  @moduledoc """
  Rating — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/rating.tsx. A star rating built as a single-select
  radio group: one native `<input type="radio">` per star sharing a `name`,
  so the platform handles arrow-key navigation, focus, one-at-a-time, and
  form submission. Fill + hover preview are pure CSS via reversed DOM order
  (`flex-row-reverse` + stars rendered max..1) and named peer modifiers.

  APG: repos/aria-practices/content/patterns/radio/examples/radio-rating.html

  ## Examples

      <.rating name="score" value={3} />
      <.rating name="score" size="lg" required />
  """

  use Phoenix.Component

  @label_base "cursor-pointer p-0.5 text-muted-foreground transition-colors " <>
                "peer-disabled/star:cursor-not-allowed peer-disabled/star:opacity-50 " <>
                "peer-checked/star:text-primary peer-checked/star:[&_svg]:fill-current " <>
                "peer-hover/star:text-primary peer-hover/star:[&_svg]:fill-current " <>
                "peer-focus-visible/star:[&_svg]:ring-2 peer-focus-visible/star:[&_svg]:ring-ring/50"

  @sizes %{"sm" => "size-4", "default" => "size-6", "lg" => "size-7"}
  @gaps %{"sm" => "gap-0.5", "default" => "gap-0.5", "lg" => "gap-1"}

  attr :name, :string, required: true
  attr :max, :integer, default: 5
  attr :value, :integer, default: nil
  attr :size, :string, default: "default", values: ["sm", "default", "lg"]
  attr :disabled, :boolean, default: false
  attr :required, :boolean, default: false
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :"aria-describedby", :string, default: nil
  attr :class, :string, default: nil
  attr :rest, :global

  def rating(assigns) do
    assigns =
      assigns
      |> assign(:label_base, @label_base)
      |> assign(:sz, Map.get(@sizes, assigns.size, @sizes["default"]))
      |> assign(:gap, Map.get(@gaps, assigns.size, @gaps["default"]))
      # Reverse order (max..1) so the CSS sibling cascade fills left-to-right
      # under flex-row-reverse.
      |> assign(:stars, Enum.to_list(assigns.max..1//-1))

    ~H"""
    <div
      role="radiogroup"
      aria-label={if @rest[:"aria-labelledby"], do: nil, else: @rest[:"aria-label"] || "Rating"}
      aria-disabled={@disabled && "true"}
      aria-required={@required && "true"}
      data-slot="rating"
      class={["inline-flex w-fit items-center", @class]}
      {@rest}
    >
      <span class={["flex flex-row-reverse items-center justify-end", @gap]}>
        <%= for n <- @stars do %>
          <input
            type="radio"
            id={"#{@name}-star-#{n}"}
            name={@name}
            value={n}
            checked={@value == n}
            disabled={@disabled}
            required={@required && n == 1}
            data-slot="rating-item"
            class="peer/star sr-only"
          />
          <label
            for={"#{@name}-star-#{n}"}
            aria-label={"#{n} #{if n == 1, do: "star", else: "stars"} out of #{@max}"}
            class={@label_base}
          >
            <svg
              class={[@sz, "shrink-0 rounded-sm stroke-current"]}
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </label>
        <% end %>
      </span>
    </div>
    """
  end
end
