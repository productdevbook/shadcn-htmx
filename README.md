# shadcn-htmx

A shadcn-style component library for **htmx v4** + **Tailwind CSS v4**, built on web standards (MDN, WHATWG, WAI-ARIA) — no hacks, only what the platform allows today.

## Vendored references

External source code and documentation are vendored under `repos/` via `git subtree --squash` so that coding agents can read real source instead of guessing from training data. See [`AGENTS.md`](./AGENTS.md) for usage rules.

Update vendored repos with:

```sh
./scripts/sync-repos.sh
```
