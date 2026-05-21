// Minimal class-name joiner. Drops falsy values; flattens arrays.
// Equivalent to clsx for the subset we need. No tailwind-merge — author
// the variants so they don't collide, the way shadcn does for cva-defined classes.
export type ClassValue = string | number | null | undefined | false | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return
    if (Array.isArray(v)) {
      for (const x of v) walk(x)
    } else {
      out.push(String(v))
    }
  }
  for (const v of inputs) walk(v)
  return out.join(" ")
}
