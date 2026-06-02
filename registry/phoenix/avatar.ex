defmodule ShadcnHtmx.Components.Avatar do
  @moduledoc """
  Avatar — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Native `<img>` on top of a fallback layer. If the image errors, an
  inline onerror handler hides it so the fallback shows through.

  ## Examples

      <.avatar src={~p"/users/mk.jpg"} alt="Mehmet K" fallback="MK" />
      <.avatar fallback="MK" aria-label="Mehmet K" />
  """

  use Phoenix.Component

  @sizes %{
    "sm" => "size-6 [&_[data-slot=avatar-fallback]]:text-xs",
    "default" => "size-8",
    "lg" => "size-10"
  }

  attr :src, :string, default: nil
  attr :alt, :string, default: nil
  attr :fallback, :string, default: nil
  attr :size, :string, default: "default", values: ~w(sm default lg)
  attr :"aria-label", :string, default: nil
  attr :class, :string, default: nil

  def avatar(assigns) do
    assigns =
      assigns
      |> assign(:size_class, Map.fetch!(@sizes, assigns.size))
      |> assign(:aria_label, assigns[:"aria-label"])

    ~H"""
    <span
      data-slot="avatar"
      data-size={@size}
      role={if !@src and (@fallback || @aria_label), do: "img"}
      aria-label={if !@src, do: @aria_label || @fallback}
      class={[
        "group/avatar relative inline-flex shrink-0 overflow-hidden rounded-full select-none",
        @size_class,
        @class
      ]}
    >
      <span
        data-slot="avatar-fallback"
        class="flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
      >
        {@fallback}
      </span>
      <img
        :if={@src}
        src={@src}
        alt={@alt || ""}
        data-slot="avatar-image"
        onerror="this.style.display='none'"
        class="absolute inset-0 aspect-square size-full object-cover"
      />
    </span>
    """
  end
end
