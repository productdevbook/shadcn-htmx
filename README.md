<div align="center">

# shadcn-htmx

**shadcn-style UI components for [htmx v4](https://htmx.org) + [Tailwind CSS v4](https://tailwindcss.com) — built on web standards, not hacks.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
![Components: 82](https://img.shields.io/badge/components-82-8b5cf6)
![Flavours: 5](https://img.shields.io/badge/flavours-5-1f2937)
![htmx v4](https://img.shields.io/badge/htmx-v4-3366cc)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)
![a11y: WAI-ARIA APG](https://img.shields.io/badge/a11y-WAI--ARIA%20APG-22c55e)

One design. **82 components.** Five backends — **Hono JSX, Jinja2, Go templates, Phoenix, and raw HTML** — generated from a single source of truth. Copy what you need, ship it in any stack.

</div>

---

## Why

Most component libraries assume React. shadcn-htmx assumes the **platform**: a real
`<button>`, a real `<dialog>`, real `aria-*`, real `<input type="date">`. Behaviour
the browser already ships is never re-implemented in JavaScript — the only script is
a tiny, shared keyboard layer for the composite ARIA widgets the platform *doesn't*
cover (menus, listboxes, trees…).

- **Web standards first.** Every component is justified against the WAI-ARIA APG, MDN, the htmx v4 source, and the Tailwind v4 source before it ships. No polyfills, no emulation, no "browsers will support this eventually."
- **Five flavours, one design.** Each component exists as a typed Hono JSX component, a Jinja2 macro, a Go `html/template`, a Phoenix function component, and a copy-paste HTML snippet — all rendering identical, accessible markup.
- **Server-rendered + htmx-native.** Components are built for server rendering and wired for the htmx v4 attribute set (live search, infinite scroll, inline edit, optimistic toggles…).
- **Accessible by construction.** Keyboard interaction, focus management, and ARIA roles are checked against the spec — and against an axe-core + APG keyboard test suite.
- **Your code, your repo.** Copy a component in and it's yours. No runtime dependency, no version lock-in.

## Flavours

| Flavour      | Language / engine          | What you copy                     |
| ------------ | -------------------------- | --------------------------------- |
| **Hono JSX** | TypeScript (`.tsx`)        | A typed component you import      |
| **Jinja2**   | Python templates (`.html`) | A `{% macro %}` you call          |
| **Go**       | `html/template` (`.tmpl`)  | A `{{ define }}` template         |
| **Phoenix**  | Elixir (`.ex`)             | A `~H` function component         |
| **HTML**     | Raw markup (`.html`)       | A copy-paste snippet              |

The Hono JSX file is the canonical source; the other four mirror its semantics exactly — same elements, roles, ARIA, and Tailwind classes. Only the templating syntax differs.

## Quick start

The fastest path is the **flavour-aware CLI**. Pick your stack once, then add components — only *your* framework's file lands in your project.

```sh
npx shadcn-htmx init --flavour jinja        # jsx | jinja | go | phoenix | html
npx shadcn-htmx add button dialog combobox  # writes only the Jinja2 files
npx shadcn-htmx list                         # browse every component
```

`init` writes a `shadcn-htmx.json` so later commands need no flags. Point its
`registry` field (or `--registry`) at your docs host's `/r` endpoint.

<details>
<summary><b>Other ways to install</b></summary>

**shadcn CLI** — the registry follows the shadcn `registry-item` schema, so the
stock CLI works too (but it copies *all five* flavours' files; delete the ones you
don't need):

```sh
npx shadcn@latest add https://<your-host>/r/button.json
```

**curl** — pull a raw flavour file straight into your project:

```sh
curl -o templates/components/button.html \
  https://raw.githubusercontent.com/productdevbook/shadcn-htmx/main/registry/jinja2/button.html
```

**Copy-paste** — open the component's docs page, switch the framework selector to
your stack, and copy the source.

</details>

## Components

**82 components** across six categories — every interactive one mapped to its
WAI-ARIA APG pattern, every other to a native HTML element, Web API, or modern CSS
feature.

| Category       | Components |
| -------------- | ---------- |
| **Forms**      | Button · Input · Textarea · Label · Checkbox · Combobox · Switch · Radio Group · Select · Slider · Number Input · Range Slider · Listbox · Form Field · File Upload · Date Time Picker · Active Search · Edit In Place · Output · Segmented Control · Rating · Color Picker · Autosize Textarea · Cascading Select · Autocomplete |
| **Layout**     | Card · Table · Collapsible · Toolbar · Grid · Treegrid · Splitter · Landmarks · Aspect Ratio · Auto Grid · Scroll Area · Snap List · Container Card · Sticky Header · Exclusive Accordion |
| **Display**    | Avatar · Badge · Separator · Carousel · Copy Button · Kbd · Highlight · Relative Time · Figure · Responsive Image · Media Player · Selectable Table · Delete Row |
| **Feedback**   | Alert · Progress · Skeleton · Toast · Meter · Feed · Status · Lazy Load · Optimistic Toggle · Scroll Progress |
| **Overlays**   | Dialog · Dropdown Menu · Popover · Tooltip · Alert Dialog · Sheet · Hover Card |
| **Navigation** | Accordion · Pagination · Tabs · Breadcrumb · Link · Menubar · Tree · Skip Link · Theme Toggle · Split Button · Sidebar · Load More |

## Accessibility

Interactive components implement the matching [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
pattern — keyboard interaction, focus management, and ARIA roles checked against the
spec. The repo ships a Playwright suite that enforces it: axe-core on every page,
APG keyboard contracts, overlay geometry, an interaction smoke sweep, and a
console-error sweep.

## How it works

`registry.json` is the manifest — one entry per component, listing its five flavour
files. `scripts/build-registry.ts` reads it and emits `public/r/<name>.json` (the
shadcn `registry-item` schema, with each file's contents inlined) plus an
`index.json`. The docs app serves `/r/*`, so the CLI — or any HTTP consumer — pulls
items straight over the wire. The `shadcn-htmx` CLI reads that same JSON and writes
only the file for your chosen flavour.

## Local development

The repository **is** the docs site — a [Hono](https://hono.dev) + JSX app rendered
on [Bun](https://bun.sh).

```sh
bun install
bun dev                  # docs at http://localhost:3000 (server + Tailwind watcher)
```

```sh
bun run typecheck        # tsc --noEmit
bun run build            # build:registry (public/r/*.json) + build:css (minified)
bun run build:registry   # regenerate the registry JSON from registry.json
bun run build:css        # compile app/styles/input.css -> public/styles.css
```

### Tests

End-to-end tests run on Playwright (Chromium). The config does **not** start the
server — run the app on port **3010** in one terminal and the tests in another:

```sh
PORT=3010 bun run app/server.tsx     # terminal 1
bun run test:e2e                     # terminal 2 — all browser suites
bun run test:a11y                    # axe-core accessibility checks
bun run test:kbd                     # APG keyboard contracts
bun run test:geom                    # overlay positioning
bun run test:cli                     # the flavour-aware CLI (bun test)
```

## Project structure

```
registry/
  ui/            *.tsx     Hono JSX — canonical source of truth
  jinja2/        *.html    Jinja2 macros
  go-templates/  *.tmpl    Go html/template
  phoenix/       *.ex      Phoenix function components
  html/          *.html    raw HTML snippets
  lib/           cn.ts     class-name joiner
app/             Hono docs site (routes, layout, shared components, demo endpoints)
tests/           Playwright e2e (a11y, keyboard, geometry, smoke, console)
scripts/         build-registry.ts · cli.mjs (the shadcn-htmx CLI) · sync-repos.sh
public/r/        generated registry JSON (served at /r/*)
repos/           vendored upstream sources, read-only — see AGENTS.md
```

## Philosophy

This project ships only what the web platform supports natively today. The sources
it's measured against — the WAI-ARIA APG, MDN, the htmx v4 source, and the Tailwind
v4 source — are vendored under `repos/` so contributors (human or agent) read
current ground truth instead of recalling from memory. The full rules live in
[`AGENTS.md`](./AGENTS.md). Vendored sources are refreshed with `./scripts/sync-repos.sh`.

## Contributing & sponsoring

Issues and PRs are welcome. If shadcn-htmx saves you time, you can sponsor ongoing
maintenance and new components at
**[github.com/sponsors/productdevbook](https://github.com/sponsors/productdevbook)**.

## License

[MIT](./LICENSE) © [productdevbook](https://github.com/productdevbook)
