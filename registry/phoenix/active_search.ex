defmodule ShadcnHtmx.Components.ActiveSearch do
  @moduledoc """
  Active Search — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  A debounced live-search box that filters an external results list/table as
  the user types, with an inline loading indicator and stale-request
  cancellation. Submits as a normal GET search on Enter when JS is off
  (native `<form action>`).

  Native-first: `<form role="search">` wraps `<input type="search">`. The
  `search` event fires on Enter + the native clear button, so it's added to
  `hx-trigger`.

    * repos/mdn/files/en-us/web/html/reference/elements/input/search/index.md
    * repos/mdn/files/en-us/web/api/htmlinputelement/search_event/index.md

  htmx wiring:

    * `hx-trigger="input changed delay:Nms, search"` — debounce + clear/Enter.
      repos/htmx/www/src/content/reference/01-attributes/06-hx-trigger.md
    * `hx-sync="this:replace"` — abort the in-flight request, use the latest.
      repos/htmx/www/src/content/reference/01-attributes/21-hx-sync.md
    * `hx-indicator="#{id}-indicator"` — htmx adds `.htmx-request`; the spinner
      fades in. repos/htmx/www/src/content/reference/01-attributes/19-hx-indicator.md

  ## Examples

      <.active_search id="search" action={~p"/search"} placeholder="Search contacts…"
        hx-get={~p"/search"} hx-target="#results" hx-swap="innerHTML" />
      <tbody id="results"></tbody>
  """

  use Phoenix.Component

  attr :id, :string, required: true
  attr :name, :string, default: "q"
  attr :placeholder, :string, default: "Search…"
  attr :value, :string, default: nil
  attr :action, :string, default: nil
  attr :method, :string, default: "get"
  attr :delay, :integer, default: 300
  attr :required, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :autofocus, :boolean, default: false
  attr :loading_label, :string, default: "Searching…"
  attr :"aria-label", :string, default: nil
  attr :"aria-labelledby", :string, default: nil
  attr :"aria-describedby", :string, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include: ~w(hx-get hx-post hx-trigger hx-sync hx-target hx-swap hx-indicator hx-vals hx-include)

  def active_search(assigns) do
    ~H"""
    <form
      data-slot="active-search"
      role="search"
      class={["relative w-full", @class]}
      action={@action}
      method={@method}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        id={@id}
        name={@name}
        value={@value}
        placeholder={@placeholder}
        required={@required}
        disabled={@disabled}
        autofocus={@autofocus}
        autocomplete="off"
        enterkeyhint="search"
        inputmode="search"
        aria-label={assigns[:"aria-label"]}
        aria-labelledby={assigns[:"aria-labelledby"]}
        aria-describedby={assigns[:"aria-describedby"]}
        data-slot="active-search-input"
        hx-get={@action}
        hx-trigger={"input changed delay:#{@delay}ms, search"}
        hx-sync="this:replace"
        hx-indicator={"##{@id}-indicator"}
        class="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 pr-9 pl-9 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&::-webkit-search-cancel-button]:hidden"
        {@rest}
      />
      <span
        id={"#{@id}-indicator"}
        data-slot="active-search-indicator"
        role="status"
        aria-live="polite"
        class="htmx-indicator pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4 animate-spin"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span class="sr-only">{@loading_label}</span>
      </span>
    </form>
    """
  end
end
