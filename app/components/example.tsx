/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { CodeBlock } from "@/app/components/code-block"
import { LangTabs, type LangKey, LANG_SHIKI } from "@/app/components/lang-tabs"
import { formatHtml } from "@/app/lib/format-html"

// One example. Preview sits on top in its own bordered box; underneath, a row
// of language tabs (Hono JSX / Jinja2 / Go template / Phoenix LiveView /
// optionally raw HTML) shows how the same call reads in each ecosystem.
//
// No Preview/Code toggle — both live side-by-side vertically so the reader
// scrolls instead of clicks.

type Snippet = { lang: LangKey; code: string }

type Props = {
  id: string
  title: string
  description?: string
  preview: Child
  // The "JSX" snippet is required because it doubles as the canonical form;
  // other languages are optional — if missing, that tab just isn't shown.
  jsx: string
  jinja?: string
  go?: string
  phoenix?: string
  // If true, also show a "rendered HTML" panel built from the preview JSX.
  // Off by default because it tends to be visually noisy.
  showHtml?: boolean
}

export async function Example(props: Props) {
  const snippets: Snippet[] = [{ lang: "jsx", code: props.jsx }]
  if (props.jinja) snippets.push({ lang: "jinja", code: props.jinja })
  if (props.go) snippets.push({ lang: "go", code: props.go })
  if (props.phoenix) snippets.push({ lang: "phoenix", code: props.phoenix })

  if (props.showHtml) {
    const html = formatHtml(String(props.preview).trim())
    snippets.push({ lang: "html", code: html })
  }

  const panels = await Promise.all(
    snippets.map(async (s) => ({
      lang: s.lang,
      node: await CodeBlock({
        code: s.code,
        lang: LANG_SHIKI[s.lang] as any,
      }),
    })),
  )

  return (
    <section class="space-y-3">
      <div>
        <h3 class="text-sm font-semibold">{props.title}</h3>
        {props.description && (
          <p class="text-sm text-muted-foreground">{props.description}</p>
        )}
      </div>
      <div class="rounded-lg border bg-background p-6">{props.preview}</div>
      <LangTabs id={`${props.id}-lang`} panels={panels} />
    </section>
  )
}
