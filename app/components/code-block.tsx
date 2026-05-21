/** @jsxImportSource hono/jsx */
import { raw } from "hono/html"
import { createHighlighter, type Highlighter } from "shiki"

// One shared highlighter for the process. Shiki's createHighlighter is async
// and expensive; we lazy-init once on first render. The themes/langs list is
// intentionally small — add more only as docs need them.
let highlighterPromise: Promise<Highlighter> | null = null
function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "ts", "html", "css", "json", "bash", "elixir"],
  })
  return highlighterPromise
}

type CodeBlockProps = {
  code: string
  lang?: "tsx" | "ts" | "html" | "css" | "json" | "bash" | "elixir"
  // Filename label shown above the code (e.g. "components/ui/button.tsx").
  filename?: string
  copy?: boolean
}

export async function CodeBlock(props: CodeBlockProps) {
  const { code, lang = "tsx", filename, copy = true } = props
  const hl = await getHighlighter()

  // Shiki emits a <pre> with inline styles for both themes. We render the
  // light theme by default and let CSS swap to dark when .dark is on the
  // ancestor. `defaultColor: false` keeps both color sets as CSS variables.
  const html = hl.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })

  return (
    <div class="group relative overflow-hidden rounded-lg border bg-muted/30">
      {filename && (
        <div class="flex items-center justify-between border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span class="font-mono">{filename}</span>
        </div>
      )}
      <div class="relative">
        {copy && (
          <button
            type="button"
            class="absolute top-2 right-2 z-10 inline-flex h-7 items-center gap-1.5 rounded-md border bg-background/80 px-2 text-xs font-medium opacity-70 backdrop-blur transition-opacity hover:bg-accent hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
            data-copy-code
            aria-label="Copy code"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-3.5"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span data-copy-label>Copy</span>
          </button>
        )}
        <div class="shiki-host overflow-x-auto p-4 text-sm leading-relaxed [&_pre]:bg-transparent! [&_pre]:p-0! [&_code]:text-[0.8125rem]!">
          {raw(html)}
        </div>
      </div>
    </div>
  )
}
