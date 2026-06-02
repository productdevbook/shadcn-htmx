/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"

// Per-language code panels (JSX / Jinja2 / Go / Phoenix / HTML).
//
// Selection lives at the document root as `<html data-lang="…">`, set by the
// pre-paint script in app/layout.tsx and toggled from the global header (see
// public/site.js). CSS in app/styles/input.css hides every panel whose
// data-lang does not match the root attribute, so every section on the page
// switches in sync when the header selector changes.

export type LangKey = "jsx" | "jinja" | "go" | "phoenix" | "html"

export const LANG_LABELS: Record<LangKey, string> = {
  jsx: "Hono JSX",
  jinja: "Jinja2",
  go: "Go template",
  phoenix: "Phoenix",
  html: "HTML",
}

// Shiki language per LangKey. Phoenix uses elixir (no dedicated heex grammar).
export const LANG_SHIKI: Record<LangKey, string> = {
  jsx: "tsx",
  jinja: "html",
  go: "html",
  phoenix: "elixir",
  html: "html",
}

type Panel = { lang: LangKey; node: Child }

type Props = {
  id: string
  panels: Panel[]
}

export function LangTabs(props: Props) {
  return (
    <div class="lang-tabs">
      {props.panels.map((p) => (
        <div class="lang-panel" data-lang={p.lang}>
          {p.node}
        </div>
      ))}
    </div>
  )
}
