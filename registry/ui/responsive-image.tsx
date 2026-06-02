/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx"
import { cn, type ClassValue } from "@/registry/lib/cn"

// Responsive Image — shadcn-htmx, htmx v4 + Tailwind v4.
//
// Art-directed / format-switching image. Renders a <picture> with zero or
// more <source> children and exactly one fallback <img>. The browser walks
// the <source> list top-to-bottom, picks the first whose `media` and `type`
// match, and falls back to the <img> when none match (or <picture> isn't
// supported). All selection happens natively — zero JS.
//
// Source of truth:
//   repos/mdn/files/en-us/web/html/reference/elements/picture/index.md
//     - <source media> for art direction + (prefers-color-scheme) theme swaps
//     - <source type> for format negotiation (image/avif, image/webp)
//     - the <img> is required: it sizes the box AND is the universal fallback
//   repos/mdn/files/en-us/web/html/reference/elements/source/index.md
//     - inside <picture>, `srcset` is required and `src` is NOT allowed
//     - <source> is a void element (no closing tag)
//     - `sizes` only takes effect with width (`w`) descriptors, not density (`x`)
//
// Accessibility:
//   - <picture> and <source> have NO corresponding ARIA role; the accessible
//     name + role come entirely from the child <img>'s `alt`. So `alt` is
//     required on the component (empty string only for decorative images).
//   - Per MDN, object-fit / object-position go on the <img>, never <picture>.

// One <source>: a candidate the browser may pick before the fallback <img>.
export type ResponsiveImageSource = {
  // Comma-separated candidate list. Inside <picture> this is REQUIRED and
  // `src` is not allowed. e.g. "hero.avif" or "small.jpg 480w, large.jpg 1200w".
  srcset: string
  // MIME type for format negotiation; unsupported types are skipped without
  // a network hit. e.g. "image/avif", "image/webp".
  type?: string
  // Media condition for art direction / theming, e.g.
  // "(min-width: 800px)" or "(prefers-color-scheme: dark)".
  media?: string
  // Only meaningful with width (`w`) descriptors in srcset.
  sizes?: string
  // Intrinsic dimensions (integers, no units) to reserve layout space.
  width?: number
  height?: number
}

const rootBase = "block overflow-hidden rounded-lg border bg-muted"

// The <img> fills the box; object-fit/position live here per MDN, not on <picture>.
const imgBase = "block size-full object-cover"

type ResponsiveImageProps = {
  // The fallback image — also the element that sizes the box and carries the
  // accessible name. Required by the platform.
  src: string
  // Required: empty string ("") only for purely decorative images.
  alt: string
  // The art-directed / format-switching candidates, in priority order.
  sources?: ResponsiveImageSource[]
  // Intrinsic dimensions on the fallback <img>; reserve space to avoid CLS.
  width?: number
  height?: number
  // Native lazy loading + async decode for off-screen hero/gallery images.
  loading?: "lazy" | "eager"
  decoding?: "sync" | "async" | "auto"
  fetchpriority?: "high" | "low" | "auto"
  // Density/width candidates for the fallback <img> itself (Retina without
  // explicit media queries — see MDN note on <img srcset>).
  srcset?: string
  sizes?: string
  class?: ClassValue
  // Extra classes applied to the inner <img> (e.g. object-contain, aspect-*).
  imgClass?: ClassValue
  id?: string
  // Render extra <source> elements by hand (advanced) instead of `sources`.
  children?: Child
  // Pass-through for htmx / data-* / aria-* on the <picture> root.
  [key: `data-${string}`]: any
  [key: `hx-${string}`]: any
  [key: `aria-${string}`]: any
}

export function ResponsiveImage(props: ResponsiveImageProps) {
  const {
    src,
    alt,
    sources = [],
    width,
    height,
    loading,
    decoding,
    fetchpriority,
    srcset,
    sizes,
    class: className,
    imgClass,
    id,
    children,
    ...rest
  } = props

  return (
    <picture
      id={id}
      data-slot="responsive-image"
      class={cn(rootBase, className)}
      {...rest}
    >
      {sources.map((s) => (
        // <source> is a void element; inside <picture> srcset is required and
        // src is not allowed. The first matching source wins.
        <source
          srcset={s.srcset}
          type={s.type}
          media={s.media}
          sizes={s.sizes}
          width={s.width}
          height={s.height}
        />
      ))}
      {children}
      {/* The fallback <img> sizes the box and provides the accessible name.
          object-fit / object-position go HERE per MDN, never on <picture>. */}
      <img
        src={src}
        alt={alt}
        srcset={srcset}
        sizes={sizes}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchpriority={fetchpriority}
        data-slot="responsive-image-img"
        class={cn(imgBase, imgClass)}
      />
    </picture>
  )
}
