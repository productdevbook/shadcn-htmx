/** @jsxImportSource hono/jsx */
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"
import { raw } from "hono/html"

export function Layout(props: PropsWithChildren<{ title: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/htmx.min.js" defer></script>
      </head>
      <body class="min-h-svh">{props.children}</body>
    </html>
  )
}

// Wrap a full-page JSX response with the HTML5 doctype. Hono JSX can't render
// `<!DOCTYPE>` directly, and without it Chromium falls into Quirks Mode.
export function page(c: Context, node: any) {
  return c.html(
    <>
      {raw("<!DOCTYPE html>")}
      {node}
    </>
  )
}
