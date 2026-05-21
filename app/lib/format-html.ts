// Pretty-print an HTML fragment for display in docs. Not a full HTML parser —
// we only need to make Hono JSX's single-line output readable. The fragment
// is assumed to be well-formed (it came from our own JSX renderer).
//
// Approach: split into a stream of tags and text, then walk it tracking depth.

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
])

type Token =
  | { kind: "open"; tag: string; raw: string; selfClosing: boolean }
  | { kind: "close"; tag: string; raw: string }
  | { kind: "text"; raw: string }

function tokenize(html: string): Token[] {
  const tokens: Token[] = []
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    if (m.index > last) {
      const text = html.slice(last, m.index)
      if (text.trim()) tokens.push({ kind: "text", raw: text })
    }
    const raw = m[0]
    const tag = m[1].toLowerCase()
    if (raw.startsWith("</")) {
      tokens.push({ kind: "close", tag, raw })
    } else {
      const selfClosing = raw.endsWith("/>") || VOID_ELEMENTS.has(tag)
      tokens.push({ kind: "open", tag, raw, selfClosing })
    }
    last = re.lastIndex
  }
  if (last < html.length) {
    const text = html.slice(last)
    if (text.trim()) tokens.push({ kind: "text", raw: text })
  }
  return tokens
}

export function formatHtml(html: string, indent = "  "): string {
  const tokens = tokenize(html.trim())
  const out: string[] = []
  let depth = 0
  const pad = () => indent.repeat(depth)

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.kind === "open") {
      // <tag>text</tag> on one line if the next token is a short text and
      // the one after is the matching close tag.
      const next = tokens[i + 1]
      const after = tokens[i + 2]
      if (
        !t.selfClosing &&
        next?.kind === "text" &&
        after?.kind === "close" &&
        after.tag === t.tag &&
        next.raw.length < 80 &&
        !next.raw.includes("\n")
      ) {
        out.push(`${pad()}${t.raw}${next.raw.trim()}${after.raw}`)
        i += 2
        continue
      }
      out.push(`${pad()}${t.raw}`)
      if (!t.selfClosing) depth++
    } else if (t.kind === "close") {
      depth = Math.max(0, depth - 1)
      out.push(`${pad()}${t.raw}`)
    } else {
      out.push(`${pad()}${t.raw.trim()}`)
    }
  }

  return out.join("\n")
}
