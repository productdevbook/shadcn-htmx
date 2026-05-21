/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"

// Per-language code tabs (JSX / Jinja2 / Go template / Phoenix EEx / raw HTML).
// Same JS-free radio + :has() pattern as DocsTabs, but parameterised — see
// the .lang-tabs rules in app/styles/input.css for the supported values.

export type LangKey = "jsx" | "jinja" | "go" | "phoenix" | "html"

export const LANG_LABELS: Record<LangKey, string> = {
  jsx: "Hono JSX",
  jinja: "Jinja2",
  go: "Go template",
  phoenix: "Phoenix",
  html: "HTML",
}

// Shiki language name per LangKey. Phoenix is closest to elixir+heex (no
// dedicated heex grammar in Shiki by default; elixir is fine for our snippets).
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
  default?: LangKey
}

export function LangTabs(props: Props) {
  const def = props.default ?? props.panels[0]?.lang ?? "jsx"
  return (
    <div class="lang-tabs">
      <div
        role="tablist"
        class="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground"
      >
        {props.panels.map((p) => {
          const inputId = `${props.id}-${p.lang}`
          return (
            <>
              <input
                type="radio"
                name={props.id}
                id={inputId}
                value={p.lang}
                class="sr-only"
                checked={p.lang === def}
              />
              <label
                for={inputId}
                data-lang-label={p.lang}
                class="inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition-all has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
              >
                {LANG_LABELS[p.lang]}
              </label>
            </>
          )
        })}
      </div>
      <div class="mt-3">
        {props.panels.map((p) => (
          <div class="lang-panel" data-lang={p.lang}>
            {p.node}
          </div>
        ))}
      </div>
    </div>
  )
}
