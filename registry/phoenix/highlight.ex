defmodule ShadcnHtmx.Components.Highlight do
  @moduledoc """
  Highlight — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/highlight.tsx. Wraps query matches in a styled native
  `<mark>` — the semantic element for "text relevant to the user's current
  activity", i.e. the words that matched a search.

    * repos/mdn/files/en-us/web/html/reference/elements/mark/index.md
      (`<mark>` marks "a portion of the document's content which is likely to be
      relevant to the user's current activity … the words that matched a search
      operation." Don't use it for syntax highlighting — that's a `<span>`.)

  The UA yellow `<mark>` default is reset to theme tokens (`bg-primary/15` +
  `text-foreground`) so a match reads on brand in light and dark.

  htmx: nothing of its own. The component renders the marked-up HTML the server
  swaps into an `hx-target`; no `<mark>`-specific attribute exists
  (repos/htmx/www/reference.md). `hx-*/data-*/aria-*` ride through `@rest`.

  Two modes:

    * `<.highlight text="…" query="…" />` — scan `text` and mark each match.
      Source casing is preserved; the query is escaped before matching.
    * `<.mark>Imperial</.mark>` — wrap a body the server already sliced.

  ## Examples

      <.highlight text="Several species of salamander" query="salamander" />
      <.mark>Imperial</.mark>
  """

  use Phoenix.Component

  @mark_class "rounded-sm bg-primary/15 px-0.5 font-medium text-foreground [box-decoration-break:clone]"

  # Single-term mode: wrap a server-sliced run in one <mark>.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-get hx-post hx-target hx-swap hx-trigger)
  slot :inner_block, required: true

  def mark(assigns) do
    assigns = assign(assigns, :mark_class, @mark_class)

    ~H"""
    <mark data-slot="highlight" class={[@mark_class, @class]} {@rest}>
      {render_slot(@inner_block)}
    </mark>
    """
  end

  # Scan mode: split `text` on `query` and mark each match.
  attr :text, :string, default: ""
  attr :query, :string, default: nil
  attr :words, :boolean, default: false
  attr :case_sensitive, :boolean, default: false
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(hx-get hx-post hx-target hx-swap hx-trigger)

  def highlight(assigns) do
    assigns =
      assigns
      |> assign(:mark_class, @mark_class)
      |> assign(
        :segments,
        split_matches(assigns.text, assigns.query,
          words: assigns.words,
          case_sensitive: assigns.case_sensitive
        )
      )

    ~H"""
    <span data-slot="highlight" {@rest}><%= for seg <- @segments do %><%= if seg.match do %><mark class={[@mark_class, @class]}>{seg.text}</mark><% else %>{seg.text}<% end %><% end %></span>
    """
  end

  @doc """
  Split `text` on every occurrence of `query` (case-insensitive by default).
  Returns an ordered list of `%{text: binary, match: boolean}` runs; the source
  casing is preserved. `words: true` marks each whitespace term independently.
  """
  def split_matches(text, query, opts \\ []) do
    q = String.trim(query || "")

    if q == "" do
      [%{text: text, match: false}]
    else
      terms = if opts[:words], do: String.split(q, ~r/\s+/, trim: true), else: [q]

      flags = if opts[:case_sensitive], do: "", else: "i"
      pattern = terms |> Enum.map(&Regex.escape/1) |> Enum.join("|")
      re = Regex.compile!("(#{pattern})", flags)

      Regex.split(re, text, include_captures: true, trim: true)
      |> Enum.map(fn part -> %{text: part, match: Regex.match?(re, part)} end)
      |> case do
        [] -> [%{text: text, match: false}]
        segs -> segs
      end
    end
  end
end
