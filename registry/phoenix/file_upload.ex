defmodule ShadcnHtmx.Components.FileUpload do
  @moduledoc """
  File Upload — shadcn-htmx, htmx v4 + Tailwind v4 for Phoenix.

  Mirrors registry/ui/file-upload.tsx. A `<label>`-wrapped native
  `<input type="file">` with a drag-and-drop enhancement, a selected-file
  list, and a native `<progress>` bar. Submits via a standard multipart POST.

  The drop wiring + filename/preview list live in public/site.js, scoped to
  `[data-slot="file-upload"]`. An inline boot script marks the root ready so
  a swap re-arms cleanly. None of it is required for the upload to work.

  ## Examples

      <form hx-post="/upload" hx-encoding="multipart/form-data"
            hx-target="#result" hx-swap="outerHTML">
        <.file_upload name="files" accept="image/*" multiple
          hint="PNG, JPG up to 5MB" show_progress preserve />
        <button type="submit">Upload</button>
      </form>

  Sources: repos/mdn/.../elements/input/file,
  repos/mdn/.../api/html_drag_and_drop_api/file_drag_and_drop,
  repos/htmx/.../patterns/02-forms/03-file-upload (hx-encoding, hx-preserve).
  """

  use Phoenix.Component

  @root "group/file-upload grid w-full gap-3 [&.htmx-request]:opacity-70"

  @zone "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input " <>
          "bg-transparent px-6 py-8 text-center text-sm text-muted-foreground shadow-xs transition-[color,box-shadow] outline-none " <>
          "dark:bg-input/30 " <>
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 " <>
          "hover:border-ring/60 hover:text-foreground " <>
          "data-[dragover=true]:border-ring data-[dragover=true]:bg-accent data-[dragover=true]:text-foreground " <>
          "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50 " <>
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"

  @sr_only "absolute size-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]"

  attr :name, :string, default: nil
  attr :id, :string, default: nil
  attr :accept, :string, default: nil
  attr :multiple, :boolean, default: false
  attr :required, :boolean, default: false
  attr :disabled, :boolean, default: false
  attr :capture, :string, default: nil
  attr :form, :string, default: nil
  attr :preserve, :boolean, default: false
  attr :label, :string, default: "Drop files here, or click to upload"
  attr :hint, :string, default: nil
  attr :show_progress, :boolean, default: false
  attr :progress, :integer, default: nil
  attr :class, :string, default: nil

  attr :rest, :global,
    include:
      ~w(hx-post hx-put hx-target hx-swap hx-trigger hx-encoding hx-indicator hx-include hx-disable
         aria-label aria-labelledby aria-describedby aria-invalid)

  def file_upload(assigns) do
    determinate = assigns.progress != nil
    pct = if determinate, do: assigns.progress |> max(0) |> min(100), else: 0

    assigns =
      assigns
      |> assign(:root_class, @root)
      |> assign(:zone_class, @zone)
      |> assign(:sr_only_class, @sr_only)
      |> assign(:determinate, determinate)
      |> assign(:pct, pct)

    ~H"""
    <div id={@id} data-slot="file-upload" class={[@root_class, @class]}>
      <label data-slot="file-upload-zone" class={@zone_class}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-6 shrink-0 opacity-70"
          aria-hidden="true"
        >
          <path d="M12 13v8" />
          <path d="m8 17 4-4 4 4" />
          <path d="M20 16.7A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
        </svg>
        <span class="font-medium text-foreground">{@label}</span>
        <span :if={@hint} class="text-xs">{@hint}</span>
        <input
          type="file"
          data-slot="file-upload-input"
          class={@sr_only_class}
          name={@name}
          accept={@accept}
          multiple={@multiple}
          required={@required}
          disabled={@disabled}
          capture={@capture}
          form={@form}
          hx-preserve={if @preserve, do: "true"}
          aria-label={@label}
          {@rest}
        />
      </label>

      <ul
        data-slot="file-upload-list"
        class="m-0 grid list-none gap-2 p-0 empty:hidden"
        aria-live="polite"
      >
      </ul>

      <div
        :if={@show_progress}
        data-slot="file-upload-progress"
        role="progressbar"
        aria-label="Upload progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={if @determinate, do: @pct}
        data-state={if @determinate, do: "determinate", else: "indeterminate"}
        class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
      >
        <div
          data-slot="file-upload-progress-indicator"
          class={[
            "h-full bg-primary transition-all",
            !@determinate &&
              "absolute inset-y-0 -left-1/3 w-1/3 animate-[scn-progress-indeterminate_1.2s_ease-in-out_infinite]"
          ]}
          style={if @determinate, do: "width: #{@pct}%"}
        >
        </div>
      </div>
    </div>
    <script>{Phoenix.HTML.raw(~s"""
      (function(el){el.setAttribute('data-file-upload-ready','true');})(document.currentScript.previousElementSibling);
    """)}</script>
    """
  end
end
