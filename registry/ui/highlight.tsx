/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Highlight — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Semantic marker for text that is relevant to the user's current activity —
// the canonical case is the words that matched a search query. It is a thin,
// server-rendered wrapper around the native <mark> element; the server splits
// a string on the query terms and wraps each match in a styled <mark>.
//
// Source of truth:
//   - <mark> semantics + the "search results" use case + the screen-reader
//     announcement note:
//     repos/mdn/files/en-us/web/html/reference/elements/mark/index.md
//     ("`<mark>` indicates a portion of the document's content which is likely
//      to be relevant to the user's current activity … the words that matched
//      a search operation." MDN also notes that `<mark>` is NOT announced by
//      default — which is correct here: a highlighted search match is a visual
//      affordance, not extra content to read out. Do not abuse the
//      ::before/::after announcement trick on a results list.)
//   - Don't use <mark> for syntax highlighting — use <span> (MDN, same file).
//     This component is strictly for relevance, never decoration.
//
// htmx: nothing of its own. The component just produces the marked-up HTML;
// the server renders it inside whatever fragment htmx swaps in (e.g. the
// <tr> rows returned to an Active Search `hx-target`). It forwards hx-*/data-*/
// aria-* via {...rest} so a single highlighted term can also be a swap hook.
// Verified there is no <mark>-specific htmx attribute:
//   repos/htmx/www/reference.md
//
// JS budget: none. Pure SSR + one CSS rule's worth of utility classes. The
// native <mark> default is a yellow background; we reset it to theme tokens so
// it reads on brand in light and dark and never clashes with selection colours.
//
// Accessibility:
//   - Keep highlighting to genuine matches. WCAG 1.4.1 (Use of Color): the
//     match must not rely on the tint alone to be perceivable — <mark> is a
//     real semantic element, and the bold weight + rounded chip give a
//     non-colour cue, so a match survives in a high-contrast / forced-colours
//     theme.
//   - Case-insensitive matching by default; the ORIGINAL casing of the source
//     text is preserved in the output (we slice the source, never the query).

// Reset the UA yellow default and paint with theme tokens so a match reads on
// brand in both schemes. bg-primary/15 is a soft tint of the brand colour;
// text-foreground keeps body contrast; the rounded chip + font-medium are the
// non-colour cue (WCAG 1.4.1). box-decoration-clone keeps the chip intact when
// a match wraps across lines.
const markBase =
  "rounded-sm bg-primary/15 px-0.5 font-medium text-foreground [box-decoration-break:clone]"

export function highlightClasses(opts?: { class?: ClassValue }): string {
  return cn(markBase, opts?.class)
}

// Escape a user-supplied query for safe use inside a RegExp.
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Split `text` on every occurrence of `query` (case-insensitive, whole-string
// or per-word) and return an alternating list of plain strings and { match }
// segments. The source casing is preserved — we only ever slice `text`.
export type HighlightSegment = { text: string; match: boolean }

export function splitMatches(
  text: string,
  query: string | undefined,
  opts?: { words?: boolean; caseSensitive?: boolean },
): HighlightSegment[] {
  const q = (query ?? "").trim()
  if (q.length === 0) return [{ text, match: false }]

  // words:true highlights each whitespace-separated term independently
  // (multi-term search). Otherwise the whole query is one phrase.
  const terms = opts?.words ? q.split(/\s+/).filter(Boolean) : [q]
  if (terms.length === 0) return [{ text, match: false }]

  const flags = opts?.caseSensitive ? "g" : "gi"
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, flags)

  const segments: HighlightSegment[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    const start = m.index
    if (start > last) segments.push({ text: text.slice(last, start), match: false })
    segments.push({ text: m[0], match: true })
    last = start + m[0].length
  }
  if (last < text.length) segments.push({ text: text.slice(last), match: false })
  return segments.length > 0 ? segments : [{ text, match: false }]
}

type HighlightProps = {
  // The source text to scan. Its original casing is preserved in the output.
  text?: string
  // The query to mark inside `text`. Empty/undefined renders `text` verbatim.
  query?: string
  // Highlight each whitespace-separated term in `query` independently.
  words?: boolean
  // Match case exactly (default: case-insensitive).
  caseSensitive?: boolean
  // Alternative "single term" mode: wrap the children verbatim in one <mark>.
  // Use when the server already knows the exact run to mark (no scanning).
  children?: Child
  class?: ClassValue
  // hx-* / data-* / aria-* ride onto the <mark> (or the wrapper in scan mode).
  [key: `hx-${string}`]: any
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}

export function Highlight(props: HighlightProps) {
  const {
    text,
    query,
    words,
    caseSensitive,
    children,
    class: className,
    ...rest
  } = props

  const classes = highlightClasses({ class: className })

  // Single-term mode: the caller hands us the exact run to mark.
  if (children !== undefined) {
    return (
      <mark data-slot="highlight" class={classes} {...rest}>
        {children}
      </mark>
    )
  }

  // Scan mode: split the source on the query and wrap each match. The root
  // carries data-slot="highlight" so the whole rendered run is one styling /
  // testing hook even though only the matched bits are <mark>.
  const segments = splitMatches(text ?? "", query, { words, caseSensitive })
  return (
    <span data-slot="highlight" {...rest}>
      {segments.map((seg) =>
        seg.match ? <mark class={classes}>{seg.text}</mark> : seg.text,
      )}
    </span>
  )
}
