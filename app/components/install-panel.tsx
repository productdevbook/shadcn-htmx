/** @jsxImportSource hono/jsx */
import { CodeBlock } from "@/app/components/code-block"

// Re-used inside every component's Installation tab. Three slots:
//   1. "Install via the shadcn CLI" + bash command  (JSX panels)
//      OR "Save the file" + a short note            (other languages)
//   2. "Use it" — short snippet showing the call site for this stack.
//   3. Collapsible source view with the full file contents.

export async function InstallPanel(props: {
  // Present for JSX (shadcn CLI works), absent for template engines.
  cmd?: string
  // Short call-site snippet.
  usage: string
  // The Shiki language for both the usage snippet AND the source view.
  lang: "tsx" | "ts" | "html" | "css" | "json" | "bash" | "elixir"
  // Filename label shown above the code blocks.
  filename: string
  // Full file source for the collapsible details panel.
  source: string
  // For non-JSX panels: short note explaining where the file goes.
  note?: string
}) {
  return (
    <div class="space-y-5">
      {props.cmd ? (
        <div class="space-y-2">
          <p class="text-sm font-medium">1. Install via the shadcn CLI</p>
          {await CodeBlock({ code: props.cmd, lang: "bash" })}
        </div>
      ) : (
        props.note && (
          <div class="space-y-2">
            <p class="text-sm font-medium">1. Save the file</p>
            <p class="text-xs text-muted-foreground">{props.note}</p>
          </div>
        )
      )}
      <div class="space-y-2">
        <p class="text-sm font-medium">2. Use it</p>
        {await CodeBlock({ code: props.usage, lang: props.lang, filename: props.filename })}
      </div>
      <details class="group rounded-lg border bg-muted/20">
        <summary class="cursor-pointer list-none px-4 py-2.5 text-sm font-medium select-none marker:hidden">
          <span class="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-3.5 transition-transform group-open:rotate-90"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {props.cmd ? "Or copy the source manually" : "View source"}
          </span>
        </summary>
        <div class="border-t bg-background p-4">
          {await CodeBlock({ code: props.source, lang: props.lang, filename: props.filename })}
        </div>
      </details>
    </div>
  )
}
