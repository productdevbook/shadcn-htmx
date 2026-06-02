/** @jsxImportSource hono/jsx */
import type { Child, PropsWithChildren } from "hono/jsx"

// API Reference table — used by every /docs/<component> page to surface
// the full list of props, ARIA attributes, and platform-native attributes
// the component accepts. Without this, users have to read the source to
// know what they can pass.

export type ApiRow = {
  prop: string
  // Plain string (rendered as code) OR an array of union members rendered
  // as `"a"` | `"b"` | … pills.
  type: string | string[]
  default?: string
  // Plain-text description. Keep one sentence; long context goes in the
  // component's narrative.
  description: string | Child
  // Optional source the prop is forwarded to: useful for "this is just the
  // native HTML attribute" cases. Renders a small pill linking to MDN/APG.
  source?: {
    label: string
    href: string
    badge?: "MDN" | "APG" | "WHATWG" | "htmx" | "WCAG"
  }
  // Optional flag for required props.
  required?: boolean
}

type ApiTableProps = {
  // Heading shown above the table (e.g. component name + " props").
  title?: string
  rows: ApiRow[]
  // Optional subtitle / lead-in. Useful for tables that document attrs
  // passed through to the underlying element rather than custom props.
  caption?: Child
}

const BADGE_STYLES: Record<NonNullable<ApiRow["source"]>["badge"] & string, string> = {
  MDN: "border-sky-500/40 bg-sky-500/5 text-sky-700 dark:text-sky-300",
  APG: "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-200",
  WHATWG: "border-purple-500/40 bg-purple-500/5 text-purple-700 dark:text-purple-200",
  htmx: "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  WCAG: "border-pink-500/40 bg-pink-500/5 text-pink-700 dark:text-pink-300",
}

function renderType(t: string | string[]) {
  if (Array.isArray(t)) {
    return (
      <span class="flex flex-wrap items-center gap-1">
        {t.map((member, i) => (
          <>
            <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{member}</code>
            {i < t.length - 1 && <span class="text-muted-foreground">|</span>}
          </>
        ))}
      </span>
    )
  }
  return <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{t}</code>
}

export function ApiTable(props: ApiTableProps) {
  const { title, rows, caption } = props
  return (
    <section
      id="api"
      data-slot="api-table"
      class="scroll-mt-20 space-y-4 border-t pt-10"
    >
      <h2 class="text-xl font-semibold tracking-tight">API Reference</h2>
      {title && <h3 class="text-base font-medium">{title}</h3>}
      {caption && <p class="text-sm text-muted-foreground">{caption}</p>}
      <div class="relative w-full overflow-auto rounded-lg border">
        <table class="w-full caption-bottom text-sm">
          <thead class="bg-muted/50 [&_tr]:border-b">
            <tr class="border-b">
              <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                Prop
              </th>
              <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                Type
              </th>
              <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                Default
              </th>
              <th scope="col" class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            {rows.map((r) => (
              <tr data-slot="api-row" data-prop={r.prop} class="border-b align-top">
                <td class="px-3 py-2 align-top">
                  <code class="font-mono text-xs font-medium">{r.prop}</code>
                  {r.required && (
                    <span class="ml-1 align-top text-[10px] font-semibold text-destructive">
                      *
                    </span>
                  )}
                </td>
                <td class="px-3 py-2 align-top">{renderType(r.type)}</td>
                <td class="px-3 py-2 align-top">
                  {r.default !== undefined ? (
                    <code class="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {r.default}
                    </code>
                  ) : (
                    <span class="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td class="px-3 py-2 align-top text-muted-foreground">
                  <div class="flex flex-col gap-1">
                    <span>{r.description}</span>
                    {r.source && (
                      <a
                        href={r.source.href}
                        target="_blank"
                        rel="noreferrer"
                        class="inline-flex w-fit items-center gap-1.5 text-xs hover:underline"
                      >
                        {r.source.badge && (
                          <span
                            class={
                              "inline-flex items-center rounded-md border px-1.5 py-0 text-[10px] font-medium tracking-wider uppercase " +
                              BADGE_STYLES[r.source.badge]
                            }
                          >
                            {r.source.badge}
                          </span>
                        )}
                        <span>{r.source.label}</span>
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.some((r) => r.required) && (
        <p class="text-xs text-muted-foreground">
          <span class="text-destructive">*</span> required
        </p>
      )}
    </section>
  )
}
