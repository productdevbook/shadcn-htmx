defmodule ShadcnHtmx.Components.Landmarks do
  @moduledoc """
  Landmarks — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/landmarks.tsx. An accessible page-shell built from the
  native HTML landmark elements. Each native element exposes the matching
  ARIA landmark role implicitly:

      <header>  -> banner          <aside>    -> complementary
      <nav>     -> navigation       <section>  -> region (only when labelled)
      <search>  -> search           <form>     -> form   (only when labelled)
      <main>    -> main             <footer>   -> contentinfo

  Labelling rules from the APG (pass `aria-label` / `aria-labelledby` where the
  practice calls for one — always for region; once there is more than one
  navigation/complementary/search landmark, each needs a unique label).
    repos/aria-practices/content/patterns/landmarks/examples/*.html
  The native `<search>` element defines a search landmark (no `role=search`):
    repos/mdn/files/en-us/web/html/reference/elements/search/index.md:20-22

  ## Examples

      <.banner>
        <h1 class="font-semibold">Acme Console</h1>
      </.banner>

      <.nav_landmark aria-label="Primary">
        <ul>…</ul>
      </.nav_landmark>

      <.search_landmark aria-label="Site">
        <form action="/search">
          <label for="q">Search</label>
          <input id="q" type="search" name="q" />
        </form>
      </.search_landmark>

      <.main_landmark>
        <h1>Dashboard</h1>
      </.main_landmark>

      <.complementary aria-label="Related">…</.complementary>
      <.region_landmark aria-label="Usage this month">…</.region_landmark>

      <.form_landmark aria-label="Contact">
        <form action="/contact" method="post">…</form>
      </.form_landmark>

      <.content_info>© 2026 Acme</.content_info>
  """

  use Phoenix.Component

  # banner — <header> in body context. Top-level only; one per page.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def banner(assigns) do
    ~H"""
    <header
      data-slot="landmark-banner"
      class={["border-b bg-card px-4 py-3 text-card-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </header>
    """
  end

  # navigation — <nav>. Each nav should have a unique label when >1 on a page.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def nav_landmark(assigns) do
    ~H"""
    <nav data-slot="landmark-navigation" class={["text-sm", @class]} {@rest}>
      {render_slot(@inner_block)}
    </nav>
    """
  end

  # search — native <search> element. Wrap a <form>; defines a search landmark
  # so no role=search on the form is needed.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def search_landmark(assigns) do
    ~H"""
    <search data-slot="landmark-search" class={[@class]} {@rest}>
      {render_slot(@inner_block)}
    </search>
    """
  end

  # main — <main>. Exactly one per page; top-level.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def main_landmark(assigns) do
    ~H"""
    <main data-slot="landmark-main" class={["min-w-0 flex-1", @class]} {@rest}>
      {render_slot(@inner_block)}
    </main>
    """
  end

  # complementary — <aside>. Top-level; unique label when >1.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def complementary(assigns) do
    ~H"""
    <aside
      data-slot="landmark-complementary"
      class={["rounded-lg border bg-card p-4 text-sm text-card-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </aside>
    """
  end

  # region — <section> WITH a label (a region landmark must be named).
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def region_landmark(assigns) do
    ~H"""
    <section
      data-slot="landmark-region"
      class={["rounded-lg border bg-card p-4 text-card-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </section>
    """
  end

  # form — <form> WITH a label (a form landmark must be named, like region).
  # Use search_landmark instead when the form performs a search. action/method
  # and hx-* forward through :global onto the native <form>.
  #   MDN repos/mdn/files/en-us/web/accessibility/aria/reference/roles/form_role/index.md:12,31,33,101
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby action method)
  slot :inner_block, required: true

  def form_landmark(assigns) do
    ~H"""
    <form
      data-slot="landmark-form"
      class={["rounded-lg border bg-card p-4 text-card-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </form>
    """
  end

  # contentinfo — <footer> in body context. Top-level only; one per page.
  attr :class, :string, default: nil
  attr :rest, :global, include: ~w(aria-label aria-labelledby)
  slot :inner_block, required: true

  def content_info(assigns) do
    ~H"""
    <footer
      data-slot="landmark-contentinfo"
      class={["border-t bg-card px-4 py-3 text-sm text-muted-foreground", @class]}
      {@rest}
    >
      {render_slot(@inner_block)}
    </footer>
    """
  end
end
