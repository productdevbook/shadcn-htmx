/** @jsxImportSource hono/jsx */
import { cn, type ClassValue } from "@/registry/lib/cn"

// Rating — shadcn-htmx, htmx v4 + Tailwind v4.
//
// A star/icon rating control built as a single-select radio group: one real
// <input type="radio"> per star, all sharing a `name`. The browser handles
// arrow-key navigation, focus management, one-selected-at-a-time, and form
// submission for free — no JavaScript. Submitting the form sends the chosen
// star count as the field value.
//
// APG: WAI-ARIA Radio Group pattern, star-styled rating example.
//   repos/aria-practices/content/patterns/radio/examples/radio-rating.html
//   repos/aria-practices/content/patterns/radio/examples/css/radio-rating.css
// The APG example puts role="radio" on SVG <g> elements driven by JS. We
// instead use native radios (zero JS, form-submittable) and reproduce its
// fill / hover-preview purely in CSS.
//
// Native element + ARIA references:
//   repos/mdn/files/en-us/web/html/reference/elements/input/radio/index.md
//   repos/mdn/files/en-us/web/accessibility/aria/reference/roles/radiogroup_role
//
// CSS technique: inputs and their <label> stars are FLAT siblings inside a
// flex-row-reverse track, in DOM order max..1. Because CSS sibling
// combinators only reach *later* siblings, reversing the source order lets a
// checked (or hovered) star's general-sibling rule light up itself AND every
// star that follows it in DOM — i.e. every star to its visual LEFT — which is
// exactly what a star rating expects. The whole thing is one <input> + one
// <label> per star; the browser does the rest.

const ratingBase = "inline-flex w-fit items-center"

// flex-row-reverse so DOM order 5..1 paints visually left-to-right as 1..5.
const trackBase = "flex flex-row-reverse items-center justify-end"

// The native radio. Clipped to zero box (still focusable + in the a11y tree).
// `peer` so the adjacent <label> can react to :checked / :hover / :disabled.
const inputBase = "peer/star sr-only"

// The clickable star icon = a <label> for its radio.
//   text-muted-foreground  → empty star
//   text-primary + fill     → active star
// A named peer modifier (peer-checked/star) compiles to a GENERAL sibling
// selector (.peer\/star:checked ~ label). Because the inputs sit before the
// stars they should fill (DOM order max..1 under flex-row-reverse), checking
// or hovering star N automatically lights N and every star after it in DOM —
// i.e. N and everything to its visual left. No extra cascade rules needed.
const labelBase =
  "cursor-pointer p-0.5 text-muted-foreground transition-colors " +
  "peer-disabled/star:cursor-not-allowed peer-disabled/star:opacity-50 " +
  "peer-checked/star:text-primary peer-checked/star:[&_svg]:fill-current " +
  "peer-hover/star:text-primary peer-hover/star:[&_svg]:fill-current " +
  "peer-focus-visible/star:[&_svg]:ring-2 peer-focus-visible/star:[&_svg]:ring-ring/50"

const starSize: Record<string, string> = {
  sm: "size-4",
  default: "size-6",
  lg: "size-7",
}

const gapForSize: Record<string, string> = {
  sm: "gap-0.5",
  default: "gap-0.5",
  lg: "gap-1",
}

type RatingProps = {
  // Form field name shared by every star radio — groups them and is the key
  // submitted with the chosen value.
  name: string
  // Number of stars. Default 5.
  max?: number
  // Pre-selected value (1..max). Renders the matching radio `checked`.
  value?: number
  // Disable the whole control — every radio becomes unfocusable + unsubmitted.
  disabled?: boolean
  // Require a selection for native form validation. Applied to the first star
  // radio; the browser treats any required radio in a name-group as making
  // the whole group required.
  // repos/mdn/files/en-us/web/html/reference/elements/input/radio/index.md
  required?: boolean
  size?: keyof typeof starSize
  // Builds each star's accessible name, e.g. (n,max) => `${n} of ${max} stars`.
  label?: (n: number, max: number) => string
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  class?: ClassValue
  // Spread onto the radiogroup wrapper: hx-*, data-*, aria-*, id, …
  [key: string]: unknown
}

const defaultLabel = (n: number, max: number) =>
  `${n} ${n === 1 ? "star" : "stars"} out of ${max}`

export function Rating(props: RatingProps) {
  const {
    name,
    max = 5,
    value,
    disabled,
    required,
    size = "default",
    label = defaultLabel,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    class: className,
    ...rest
  } = props

  const sz = starSize[size] ?? starSize.default
  const gap = gapForSize[size] ?? gapForSize.default
  // Stars 1..max, rendered in reverse (max..1) so the sibling cascade fills
  // left-to-right correctly under flex-row-reverse.
  const stars = Array.from({ length: max }, (_, i) => max - i)

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabelledby ? undefined : (ariaLabel ?? "Rating")}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-disabled={disabled ? "true" : undefined}
      aria-required={required ? "true" : undefined}
      data-slot="rating"
      class={cn(ratingBase, className)}
      {...rest}
    >
      <span class={cn(trackBase, gap)}>
        {stars.map((n) => {
          const id = `${name}-star-${n}`
          return (
            <>
              <input
                type="radio"
                id={id}
                name={name}
                value={String(n)}
                checked={value === n || undefined}
                disabled={disabled || undefined}
                required={(required && n === 1) || undefined}
                data-slot="rating-item"
                class={inputBase}
                key={id}
              />
              <label for={id} aria-label={label(n, max)} class={labelBase}>
                <svg
                  class={cn(sz, "shrink-0 rounded-sm stroke-current")}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </label>
            </>
          )
        })}
      </span>
    </div>
  )
}
