/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { CodeBlock } from "@/app/components/code-block"
import { LangTabs, type LangKey, LANG_SHIKI } from "@/app/components/lang-tabs"
import { formatHtml } from "@/app/lib/format-html"

// One example. Top: heading + narrative paragraph. Middle: the live preview
// on the design canvas (.demo-canvas), then the code panel that flips with
// the global framework selector. Bottom: optional "Further reading" list of
// external specs / docs (MDN, APG, htmx) so the reader can verify behaviour
// against the authoritative source.

type Snippet = { lang: LangKey; code: string }

export type Reference = {
  label: string
  href: string
  source?: "MDN" | "APG" | "htmx" | "WCAG" | "Tailwind" | "WHATWG"
}

type Props = {
  id: string
  title: string
  // Short one-line caption above the demo (italic-ish; sets the scene).
  description?: string
  // Longer narrative below the description — "why does this exist, when do
  // you reach for it." Renders as a regular paragraph. Optional.
  narrative?: Child
  preview: Child
  // The "JSX" snippet is required because it doubles as the canonical form;
  // other languages are optional — if missing, that tab just isn't shown.
  jsx: string
  jinja?: string
  go?: string
  phoenix?: string
  // Show a "rendered HTML" panel built from the preview JSX. On by default
  // so the global "HTML" framework choice always has something to display.
  showHtml?: boolean
  // Spec / doc links surfaced below the example. Common sources are tagged
  // with a small coloured pill so the reader recognises the provenance at
  // a glance.
  references?: Reference[]
}

const SOURCE_STYLES: Record<NonNullable<Reference["source"]>, string> = {
  MDN: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  APG: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  htmx: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  WCAG: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Tailwind: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  WHATWG: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
}

export async function Example(props: Props) {
  const snippets: Snippet[] = [{ lang: "jsx", code: props.jsx }]
  if (props.jinja) snippets.push({ lang: "jinja", code: props.jinja })
  if (props.go) snippets.push({ lang: "go", code: props.go })
  if (props.phoenix) snippets.push({ lang: "phoenix", code: props.phoenix })

  if (props.showHtml ?? true) {
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
    <section class="space-y-4">
      <div class="space-y-2">
        <h3 id={props.id} class="scroll-mt-20 text-base font-semibold">
          {props.title}
        </h3>
        {props.description && (
          <p class="text-sm text-muted-foreground">{props.description}</p>
        )}
        {props.narrative && (
          <div class="prose-sm max-w-none text-sm leading-relaxed text-muted-foreground">
            {props.narrative}
          </div>
        )}
      </div>
      <div class="demo-canvas overflow-hidden rounded-lg border">
        {props.preview}
      </div>
      <LangTabs id={`${props.id}-lang`} panels={panels} />
      {props.references && props.references.length > 0 && (
        <div class="space-y-2 pt-1">
          <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Further reading
          </p>
          <ul class="space-y-1.5 text-sm">
            {props.references.map((ref) => (
              <li>
                <a
                  href={ref.href}
                  target="_blank"
                  rel="noreferrer"
                  class="group inline-flex items-baseline gap-2 text-muted-foreground hover:text-foreground"
                >
                  {ref.source && (
                    <span
                      class={
                        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase " +
                        SOURCE_STYLES[ref.source]
                      }
                    >
                      {ref.source}
                    </span>
                  )}
                  <span class="underline decoration-muted-foreground/40 underline-offset-4 group-hover:decoration-foreground">
                    {ref.label}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-3 shrink-0 opacity-60"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
