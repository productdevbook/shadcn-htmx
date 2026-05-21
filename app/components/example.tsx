/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { CodeBlock } from "@/app/components/code-block"
import { DocsTabs } from "@/app/components/docs-tabs"
import { formatHtml } from "@/app/lib/format-html"

// Render the same JSX as both preview and HTML source. The HTML in the Code
// tab is what htmx users will literally paste into their template engine of
// choice — Jinja2, Go's html/template, Twig, ERB, etc. There is no JSX in the
// output, which is the whole point: htmx ships HTML, not components.

type Props = {
  id: string
  title: string
  description?: string
  children: Child
}

export async function Example(props: Props) {
  // Hono JSX renders to an HtmlEscapedString — coercing to string gives us
  // the literal HTML we'll show in the Code tab. Trim because top-level
  // whitespace makes the formatter's output ugly.
  const rendered = String(props.children).trim()
  const formatted = formatHtml(rendered)

  return (
    <section class="space-y-3">
      <div>
        <h3 class="text-sm font-semibold">{props.title}</h3>
        {props.description && (
          <p class="text-sm text-muted-foreground">{props.description}</p>
        )}
      </div>
      <DocsTabs
        id={props.id}
        preview={
          <div class="rounded-lg border bg-background p-6">{props.children}</div>
        }
        code={await CodeBlock({ code: formatted, lang: "html" })}
      />
    </section>
  )
}
