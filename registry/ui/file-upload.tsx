/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// File Upload — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A styled <label>-wrapped native <input type="file"> with an optional
// drag-and-drop enhancement, a selected-file list (with image previews),
// and a native <progress> upload bar. It submits via a standard multipart
// POST — no custom transport — so it works with a plain <form> and degrades
// to a bare file picker when JavaScript is off.
//
// There is no "file upload" or "dropzone" element in the platform — the
// pieces are:
//   - <input type="file"> + <label>  — the picker + its accessible name.
//       repos/mdn/files/en-us/web/html/reference/elements/input/file/index.md
//   - Drag-and-Drop API (drop/dragover) + File API (input.files, FileList)
//     for the optional drop-zone enhancement.
//       repos/mdn/files/en-us/web/api/html_drag_and_drop_api/file_drag_and_drop/index.md
//   - htmx multipart upload (hx-encoding="multipart/form-data") and
//     hx-preserve to keep the selection across re-render-on-error swaps.
//       repos/htmx/www/src/content/patterns/02-forms/03-file-upload.md
//       repos/htmx/www/reference.md  (hx-encoding, hx-preserve)
//
// Style analogues (matched exactly): registry/ui/input.tsx (the field /
// file:* affordance + focus-visible ring + .htmx-request dim) and
// registry/ui/progress.tsx (the native <progress> visual).
//
// The keyboard/behaviour contract (drop wiring + filename/preview list +
// reset) lives in public/site.js, scoped to [data-slot="file-upload"]; an
// inline boot script next to the root only marks it ready, so a server swap
// re-arms cleanly. None of it is required for the upload to work.

const root =
  "group/file-upload grid w-full gap-3 " +
  // While a request triggered by/targeting this control is in flight,
  // htmx adds .htmx-request — dim like Input does.
  "[&.htmx-request]:opacity-70"

const zone =
  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-transparent px-6 py-8 text-center text-sm text-muted-foreground shadow-xs transition-[color,box-shadow] outline-none " +
  "dark:bg-input/30 " +
  // The visually-hidden <input> is the real focus target; mirror its focus
  // ring onto the styled label via :focus-within.
  "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 " +
  "hover:border-ring/60 hover:text-foreground " +
  // site.js sets data-dragover on the label while a file is over it.
  "data-[dragover=true]:border-ring data-[dragover=true]:bg-accent data-[dragover=true]:text-foreground " +
  // Disabled mirrors Input.
  "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"

// Visually-hidden but still focusable + operable: the native picker stays
// the accessible control; the label is its visible skin.
const srOnly =
  "absolute size-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]"

type FileUploadProps = {
  // Form field name — required to actually submit. multiple sends one entry
  // per file under this name.
  name?: string
  id?: string
  // Comma-separated unique file type specifiers (".pdf,image/*"). Native
  // filter in the OS picker; the drop enhancement re-checks it too.
  accept?: string
  multiple?: boolean
  required?: boolean
  disabled?: boolean
  // type="file" only — request the OS camera (user | environment).
  capture?: "user" | "environment" | boolean
  // Associate the input with a <form> by id. Per the htmx pattern, putting
  // the file input OUTSIDE the swap target (via form=) is an alternative to
  // hx-preserve for keeping the selection across error re-renders.
  form?: string
  // htmx: keep the chosen file across an outerHTML/innerHTML swap when the
  // form re-renders with validation errors. Renders the hx-preserve attr.
  preserve?: boolean

  // Visible prompt + sub-label inside the drop zone.
  label?: string
  hint?: string

  // Show the native <progress> bar. value=undefined → indeterminate
  // ("uploading…, length unknown"); a number 0–100 → determinate.
  showProgress?: boolean
  progress?: number

  class?: ClassValue
  // ARIA — the visible label text names the input by default; override here
  // when there is no visible label or a separate one elsewhere.
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean | "grammar" | "spelling"

  // htmx v4 (subset). Usually set on the wrapping <form> (hx-post +
  // hx-encoding="multipart/form-data"), but forwarded here too so a
  // standalone control can drive an upload on change.
  "hx-post"?: string
  "hx-put"?: string
  "hx-target"?: string
  "hx-swap"?: string
  "hx-trigger"?: string
  "hx-encoding"?: string
  "hx-indicator"?: string
  "hx-include"?: string
  "hx-preserve"?: boolean | "true"
  "hx-disable"?: string
}

export function FileUpload(props: FileUploadProps) {
  const {
    name,
    id,
    accept,
    multiple,
    required,
    disabled,
    capture,
    form,
    preserve,
    label = "Drop files here, or click to upload",
    hint,
    showProgress,
    progress,
    class: className,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    ...rest
  } = props

  const determinate = progress !== undefined
  const pct = determinate ? Math.min(100, Math.max(0, progress!)) : 0

  // Boot marks the root ready so site.js arms drop + the file list once,
  // and re-arms after an htmx swap re-inserts a fresh root.
  const boot = `(function(el){el.setAttribute('data-file-upload-ready','true');})(document.currentScript.previousElementSibling);`

  return (
    <>
      <div
        id={id}
        data-slot="file-upload"
        class={cn(root, className)}
      >
        <label
          data-slot="file-upload-zone"
          aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
          class={zone}
        >
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
          <span class="font-medium text-foreground">{label}</span>
          {hint && <span class="text-xs">{hint}</span>}
          <input
            type="file"
            data-slot="file-upload-input"
            class={srOnly}
            name={name}
            accept={accept}
            multiple={multiple}
            required={required}
            disabled={disabled}
            capture={capture}
            form={form}
            hx-preserve={preserve ? "true" : undefined}
            aria-label={ariaLabel ?? (ariaLabelledby ? undefined : label)}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid === undefined ? undefined : String(ariaInvalid)}
            {...rest}
          />
        </label>

        <ul
          data-slot="file-upload-list"
          class="m-0 grid list-none gap-2 p-0 empty:hidden"
          aria-live="polite"
        />

        {showProgress && (
          <div
            data-slot="file-upload-progress"
            role="progressbar"
            aria-label="Upload progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={determinate ? pct : undefined}
            data-state={determinate ? "determinate" : "indeterminate"}
            class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
          >
            <div
              data-slot="file-upload-progress-indicator"
              class={cn(
                "h-full bg-primary transition-all",
                !determinate &&
                  "absolute inset-y-0 -left-1/3 w-1/3 animate-[scn-progress-indeterminate_1.2s_ease-in-out_infinite]",
              )}
              style={determinate ? `width: ${pct}%` : undefined}
            />
          </div>
        )}
      </div>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR boot
        dangerouslySetInnerHTML={{ __html: boot }}
      />
    </>
  )
}
