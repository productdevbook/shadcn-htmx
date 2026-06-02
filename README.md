# shadcn-htmx

A shadcn-style component library for **htmx v4** + **Tailwind CSS v4**, built on
web standards — real `<button>`, real `<dialog>`, real `aria-*`. No hacks, only
what the platform ships today.

One design, **five flavours** generated from a single source of truth:

| Flavour       | Language / engine            | What you copy                       |
| ------------- | ---------------------------- | ----------------------------------- |
| **Hono JSX**  | TypeScript (`.tsx`)          | A typed component you import         |
| **Jinja2**    | Python templates (`.html`)   | A `{% macro %}` you call             |
| **Go**        | `html/template` (`.tmpl`)    | A `{{ define }}` template            |
| **Phoenix**   | Elixir (`.ex`)               | A function component (`~H`)          |
| **HTML**      | Raw markup (`.html`)         | A copy-paste snippet                 |

Every interactive component follows the matching [WAI-ARIA Authoring
Practices](https://www.w3.org/WAI/ARIA/apg/) pattern — keyboard interaction,
focus management, and ARIA roles checked against the spec, not guessed.

## Install

Four ways to get a component into your project — pick whichever fits your stack.

**1. The `shadcn-htmx` CLI** (recommended — flavour-aware). Unlike the stock
shadcn CLI, this copies **only your chosen framework's file** to the right path,
reusing the same registry. Pick a flavour once with `init`, then `add`:

```sh
npx shadcn-htmx init --flavour jinja        # or jsx | go | phoenix | html
npx shadcn-htmx add button input dialog     # writes only the Jinja2 files
npx shadcn-htmx list                         # see every component
```

Flags: `-f/--flavour`, `-r/--registry <url|dir>`, `-o/--out <dir>`, `--dry`,
`--overwrite`. Point `--registry` (or the `registry` field in `shadcn-htmx.json`)
at your docs host's `/r` endpoint. For JSX, registry dependencies (the `cn()`
util) are resolved automatically; the template flavours pull just their one file.

**2. shadcn CLI** (JSX/TSX projects). Each item is served as a
[shadcn registry item](https://ui.shadcn.com/docs/registry) at
`<docs-host>/r/<name>.json` (note: this copies *all five* flavours' files):

```sh
# against your deployed docs host, or http://localhost:3000 when running locally
npx shadcn@latest add https://<docs-host>/r/button.json
```

**3. curl the source** straight into your templates folder (any stack). The raw
flavour files live in the repo, and every flavour's contents are also inlined in
the registry item at `<docs-host>/r/<name>.json`:

```sh
curl -o templates/components/button.html \
  https://raw.githubusercontent.com/productdevbook/shadcn-htmx/main/registry/jinja2/button.html
```

**4. Copy-paste.** Open the component's docs page, switch the framework selector
to your stack, and copy the source. Your code, your repo, no runtime dependency.

## Components

43 components across six categories — every interactive one mapped to its
WAI-ARIA APG pattern:

- **Forms** — Button, Input, Textarea, Label, Checkbox, Combobox, Switch, Radio Group, Select, Slider, Number Input, Range Slider, Listbox
- **Layout** — Card, Table, Collapsible, Toolbar, Grid, Treegrid, Splitter, Landmarks
- **Display** — Avatar, Badge, Separator, Carousel
- **Feedback** — Alert, Progress, Skeleton, Toast, Meter, Feed
- **Overlays** — Dialog, Dropdown Menu, Popover, Tooltip, Alert Dialog
- **Navigation** — Accordion, Pagination, Tabs, Breadcrumb, Link, Menubar, Tree

## Local development

The repo is also the docs site — a [Hono](https://hono.dev) + JSX app rendered
on [Bun](https://bun.sh).

```sh
bun install
bun dev          # docs at http://localhost:3000 (server + Tailwind watcher)
```

Other scripts:

```sh
bun run typecheck       # tsc --noEmit
bun run build           # build:registry (public/r/*.json) + build:css (minified)
bun run build:registry  # regenerate the registry JSON from registry.json
bun run build:css       # compile app/styles/input.css -> public/styles.css
```

### Tests

End-to-end tests run on Playwright (Chromium). The config does **not** start the
server, so run the app on port **3010** in one terminal and the tests in another:

```sh
PORT=3010 bun run app/server.tsx       # terminal 1
bun run test:e2e                       # terminal 2 — all suites
bun run test:a11y                      # axe-core accessibility checks
bun run test:kbd                       # APG keyboard contracts
bun run test:geom                      # overlay positioning
```

## How it's built

`registry.json` is the manifest: one entry per component listing its five flavour
files. `scripts/build-registry.ts` reads it and emits `public/r/<name>.json`
(shadcn `registry-item` schema, with file contents inlined) plus an `index.json`.
The docs app serves `/r/*` so the shadcn CLI — or any consumer — can pull items
over HTTP.

```
registry/
  ui/         *.tsx    Hono JSX (canonical source of truth)
  jinja2/     *.html   Jinja2 macros
  go-templates/ *.tmpl Go html/template
  phoenix/    *.ex     Phoenix function components
  html/       *.html   raw HTML snippets
  lib/        cn.ts    class-name joiner
app/           Hono docs site (routes, layout, components, demo endpoints)
tests/         Playwright e2e (a11y, keyboard, geometry, smoke)
scripts/       build-registry.ts, sync-repos.sh
repos/         vendored upstream sources (read-only reference — see AGENTS.md)
```

## Philosophy

This project ships only what the web platform supports natively. Before a feature
ships, it's justified against the WAI-ARIA APG, MDN, the htmx v4 source, and the
Tailwind v4 source — all vendored under `repos/` so contributors (human or agent)
read current ground truth instead of recalling from memory. The rules live in
[`AGENTS.md`](./AGENTS.md). Vendored sources are refreshed with
`./scripts/sync-repos.sh`.

## Contributing & sponsoring

Issues and PRs welcome. If this saves you time, you can sponsor ongoing
maintenance and new components at
[github.com/sponsors/productdevbook](https://github.com/sponsors/productdevbook).

## License

[MIT](./LICENSE) © productdevbook
