/** @jsxImportSource hono/jsx */
import { SPONSORS, SPONSORS_UPDATED_AT, type Sponsor } from "@/app/data/sponsors"

const SPONSORS_URL = "https://github.com/sponsors/productdevbook"

// Tile size scales with the monthly tier amount. Bigger spenders get a bigger
// square (and a visible name); entry tiers stay compact. Buckets are matched
// top-down, so order matters — keep `min` descending.
type Tier = {
  name: string
  min: number // inclusive monthly-dollars threshold
  cell: string // grid spanning for the tile
  avatar: string // avatar size classes
  showName: boolean
}
const TIERS: Tier[] = [
  { name: "platinum", min: 50, cell: "col-span-2 row-span-2", avatar: "size-20 sm:size-24", showName: true },
  { name: "gold", min: 20, cell: "col-span-2 aspect-[2/1]", avatar: "size-14 sm:size-16", showName: true },
  { name: "silver", min: 10, cell: "aspect-square", avatar: "size-12", showName: false },
  { name: "bronze", min: 0, cell: "aspect-square", avatar: "size-10", showName: false },
]
const tierFor = (monthly: number): Tier => TIERS.find((t) => monthly >= t.min) ?? TIERS[TIERS.length - 1]!

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const tier = tierFor(sponsor.monthlyDollars)
  const name = sponsor.name || sponsor.login
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noreferrer"
      title={`${name} — sponsor`}
      aria-label={`${name}, sponsor — open their GitHub profile`}
      class={`group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border bg-card p-3 text-center transition-colors hover:border-foreground/20 hover:bg-accent/40 ${tier.cell}`}
    >
      <img
        src={sponsor.avatarUrl}
        alt=""
        loading="lazy"
        decoding="async"
        class={`rounded-full object-cover ring-1 ring-border transition-transform group-hover:scale-105 ${tier.avatar}`}
      />
      {tier.showName ? (
        <span class="max-w-full truncate text-xs font-medium text-foreground">{name}</span>
      ) : null}
    </a>
  )
}

function BecomeSponsorTile() {
  return (
    <a
      href={SPONSORS_URL}
      target="_blank"
      rel="noreferrer"
      class="flex aspect-square flex-col items-center justify-center rounded-xl bg-foreground p-4 text-center text-xs font-semibold text-background transition-opacity hover:opacity-90"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mb-1.5 size-5" aria-hidden="true">
        <path d="M12 21.35 10.55 20a132 132 0 0 1-4.95-4.6C2.8 13 1 10.7 1 8.05 1 5.42 3.03 3.4 5.66 3.4c1.49 0 2.91.69 3.84 1.79l.5.59.5-.59A5.04 5.04 0 0 1 14.34 3.4C16.97 3.4 19 5.42 19 8.05c0 2.66-1.8 4.95-4.6 7.35a132 132 0 0 1-4.95 4.6L12 21.35Z" />
      </svg>
      Become a sponsor
    </a>
  )
}

// Shown until the first sponsor is fetched — keeps the section looking intentional.
function EmptyState() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <a
          href={SPONSORS_URL}
          target="_blank"
          rel="noreferrer"
          class="flex aspect-square items-center justify-center rounded-xl border border-dashed bg-muted/10 p-4 text-center text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/30 hover:text-foreground"
          aria-label={`Sponsor slot ${i + 1} — open sponsor page`}
        >
          Your logo here
        </a>
      ))}
      <BecomeSponsorTile />
    </>
  )
}

export function Sponsors() {
  // Highest tier first so the featured tiles lead the grid; dense auto-flow
  // backfills the small squares around them.
  const sponsors = [...SPONSORS].sort((a, b) => b.monthlyDollars - a.monthlyDollars || a.login.localeCompare(b.login))
  const hasSponsors = sponsors.length > 0

  return (
    <section class="border-b">
      <div class="mx-auto max-w-5xl px-6 py-20">
        <div class="mb-10 max-w-2xl space-y-2">
          <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Sponsors</p>
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Backed by people who build with this.</h2>
          <p class="text-sm text-muted-foreground">
            shadcn-htmx is open source and free to use. Sponsorship pays for maintenance time, new
            components, and keeping the docs current with htmx and Tailwind upstream releases.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 [grid-auto-flow:dense]">
          {hasSponsors ? (
            <>
              {sponsors.map((s) => (
                <SponsorTile sponsor={s} />
              ))}
              <BecomeSponsorTile />
            </>
          ) : (
            <EmptyState />
          )}
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            {hasSponsors
              ? "Thank you to everyone supporting the project. Tiers are sized by sponsorship amount."
              : "Already sponsoring? It'll appear here on the next docs build."}
          </p>
          <a
            href={SPONSORS_URL}
            target="_blank"
            rel="noreferrer"
            class="font-medium text-foreground underline underline-offset-4 hover:no-underline"
          >
            github.com/sponsors/productdevbook →
          </a>
        </div>

        {SPONSORS_UPDATED_AT ? (
          <p class="mt-2 text-[11px] text-muted-foreground/70">Sponsors updated {SPONSORS_UPDATED_AT.slice(0, 10)}.</p>
        ) : null}
      </div>
    </section>
  )
}
