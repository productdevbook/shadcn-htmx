#!/usr/bin/env node
// shadcn-htmx — flavour-aware component installer.
//
// Unlike `npx shadcn add`, which copies EVERY file in a registry item (all five
// flavours), this CLI copies only the file(s) for YOUR chosen framework, to the
// path the registry item declares for that flavour.
//
// It reuses the exact same registry JSON the project publishes at
// <host>/r/<name>.json (shadcn registry-item schema, with file `content`
// inlined), so the two installers stay in lockstep.
//
// Usage:
//   shadcn-htmx init                       # write shadcn-htmx.json (pick a flavour)
//   shadcn-htmx add button input [...]     # add components (flavour from config/--flavour)
//   shadcn-htmx list                       # list available components
//
// Flags:
//   -f, --flavour  jsx | jinja | go | phoenix | html
//   -r, --registry <url-or-dir>            registry base (…/r URL, or a local dir)
//   -o, --out <dir>                        base directory to write into (default: cwd)
//       --cwd <dir>                        run as if from this directory
//       --dry                              print what would happen, write nothing
//       --overwrite                        replace existing files (default: skip + warn)
//   -h, --help

import { mkdir, readFile, writeFile, access } from "node:fs/promises"
import { existsSync } from "node:fs"
import { dirname, join, resolve, isAbsolute } from "node:path"

const FLAVOURS = {
  jsx: { label: "Hono JSX (TypeScript)", dir: "registry/ui/" },
  jinja: { label: "Jinja2", dir: "registry/jinja2/" },
  go: { label: "Go html/template", dir: "registry/go-templates/" },
  phoenix: { label: "Phoenix", dir: "registry/phoenix/" },
  html: { label: "Raw HTML", dir: "registry/html/" },
}
const CONFIG_FILE = "shadcn-htmx.json"

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
}
const info = (s) => console.log(s)
const ok = (s) => console.log(`${c.green("✓")} ${s}`)
const warn = (s) => console.warn(`${c.yellow("!")} ${s}`)
const die = (s) => { console.error(`${c.red("✗")} ${s}`); process.exit(1) }

function parseArgs(argv) {
  const args = { _: [], flags: {} }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const take = () => argv[++i]
    if (a === "-f" || a === "--flavour") args.flags.flavour = take()
    else if (a === "-r" || a === "--registry") args.flags.registry = take()
    else if (a === "-o" || a === "--out") args.flags.out = take()
    else if (a === "--cwd") args.flags.cwd = take()
    else if (a === "--dry") args.flags.dry = true
    else if (a === "--overwrite") args.flags.overwrite = true
    else if (a === "-h" || a === "--help") args.flags.help = true
    else args._.push(a)
  }
  return args
}

async function readConfig(cwd) {
  const p = join(cwd, CONFIG_FILE)
  if (!existsSync(p)) return null
  try { return JSON.parse(await readFile(p, "utf8")) } catch { die(`${CONFIG_FILE} is not valid JSON`) }
}

// Resolve the registry base: a URL (http/https) or a local directory.
function resolveRegistry(reg, cwd) {
  if (!reg) {
    // Convenience: when run inside this repo, fall back to the built registry.
    const local = join(cwd, "public", "r")
    if (existsSync(local)) return { kind: "dir", base: local }
    die(`No registry configured. Pass --registry <url|dir> or run \`${c.bold("shadcn-htmx init")}\`.`)
  }
  if (/^https?:\/\//.test(reg)) return { kind: "url", base: reg.replace(/\/$/, "") }
  return { kind: "dir", base: isAbsolute(reg) ? reg : resolve(cwd, reg) }
}

async function fetchItem(registry, name) {
  if (registry.kind === "url") {
    const url = `${registry.base}/${name}.json`
    let res
    try { res = await fetch(url) } catch (e) { die(`Could not reach ${url}: ${e.message}`) }
    if (!res.ok) die(`Registry returned ${res.status} for ${name} (${url})`)
    return res.json()
  }
  const p = join(registry.base, `${name}.json`)
  if (!existsSync(p)) die(`Component "${name}" not found in registry (${p})`)
  return JSON.parse(await readFile(p, "utf8"))
}

async function listItems(registry) {
  if (registry.kind === "url") {
    const res = await fetch(`${registry.base}/index.json`)
    if (!res.ok) die(`Registry index returned ${res.status}`)
    return res.json()
  }
  const p = join(registry.base, "index.json")
  if (!existsSync(p)) die(`Registry index not found (${p})`)
  return JSON.parse(await readFile(p, "utf8"))
}

// Pick the file(s) of an item that belong to the chosen flavour.
function filesForFlavour(item, flavour) {
  const dir = FLAVOURS[flavour].dir
  return (item.files || []).filter((f) => (f.path || "").startsWith(dir))
}
// lib/util files (registry:lib) — only relevant to the jsx flavour.
function libFiles(item) {
  return (item.files || []).filter((f) => f.type === "registry:lib")
}

async function writeFileSafe(absPath, content, { dry, overwrite }) {
  if (existsSync(absPath) && !overwrite) {
    warn(`skip ${c.dim(absPath)} (exists; pass --overwrite to replace)`)
    return false
  }
  if (dry) { info(`${c.cyan("would write")} ${absPath}`); return true }
  await mkdir(dirname(absPath), { recursive: true })
  await writeFile(absPath, content)
  return true
}

async function addComponent(name, ctx, seen) {
  if (seen.has(name)) return
  seen.add(name)
  const item = await fetchItem(ctx.registry, name)
  const picked = filesForFlavour(item, ctx.flavour)
  // jsx pulls its lib registryDependencies (e.g. the cn() util); other flavours don't need them.
  if (ctx.flavour === "jsx") {
    for (const dep of item.registryDependencies || []) await addComponent(dep, ctx, seen)
    for (const f of libFiles(item)) picked.push(f)
  }
  if (picked.length === 0) {
    warn(`${name}: no ${ctx.flavour} file in this item (skipped)`) ; return
  }
  for (const f of picked) {
    if (typeof f.content !== "string") { warn(`${name}: ${f.path} has no inlined content; skipped`); continue }
    const target = f.target || f.path.replace(/^registry\//, "")
    const abs = join(ctx.outDir, target)
    const wrote = await writeFileSafe(abs, f.content, ctx)
    if (wrote) ok(`${name} ${c.dim("→")} ${target}`)
  }
}

const HELP = `${c.bold("shadcn-htmx")} — flavour-aware component installer

${c.bold("Usage")}
  shadcn-htmx init
  shadcn-htmx add <component...> [options]
  shadcn-htmx list

${c.bold("Options")}
  -f, --flavour   jsx | jinja | go | phoenix | html
  -r, --registry  registry base URL (…/r) or local directory
  -o, --out       base directory to write into (default: current dir)
      --cwd       run as if from this directory
      --dry       print actions without writing
      --overwrite replace existing files
  -h, --help

${c.bold("Examples")}
  shadcn-htmx init
  shadcn-htmx add button input --flavour jinja
  shadcn-htmx add dialog -r https://shadcn-htmx.productdevbook.com/r -o ./templates
  shadcn-htmx list -r ./public/r`

async function main() {
  const argv = process.argv.slice(2)
  const { _, flags } = parseArgs(argv)
  if (flags.help || _.length === 0) { console.log(HELP); return }
  const cwd = flags.cwd ? resolve(flags.cwd) : process.cwd()
  const cmd = _[0]
  const config = await readConfig(cwd)

  if (cmd === "init") {
    const flavour = flags.flavour || "jsx"
    if (!FLAVOURS[flavour]) die(`Unknown flavour "${flavour}". One of: ${Object.keys(FLAVOURS).join(", ")}`)
    const registry = flags.registry || "https://shadcn-htmx.productdevbook.com/r"
    const cfg = { $schema: "https://github.com/productdevbook/shadcn-htmx", flavour, registry }
    const p = join(cwd, CONFIG_FILE)
    if (existsSync(p) && !flags.overwrite) die(`${CONFIG_FILE} already exists (pass --overwrite).`)
    if (flags.dry) { info(`${c.cyan("would write")} ${p}:\n${JSON.stringify(cfg, null, 2)}`); return }
    await writeFile(p, JSON.stringify(cfg, null, 2) + "\n")
    ok(`wrote ${CONFIG_FILE} ${c.dim(`(flavour: ${flavour})`)}`)
    info(`  Set ${c.bold('"registry"')} to your docs host's /r endpoint, then run ${c.bold("shadcn-htmx add <component>")}.`)
    return
  }

  const flavour = flags.flavour || (config && config.flavour) || "jsx"
  if (!FLAVOURS[flavour]) die(`Unknown flavour "${flavour}". One of: ${Object.keys(FLAVOURS).join(", ")}`)
  const registry = resolveRegistry(flags.registry || (config && config.registry), cwd)
  const outDir = flags.out ? resolve(cwd, flags.out) : ((config && config.out) ? resolve(cwd, config.out) : cwd)
  const ctx = { flavour, registry, outDir, dry: !!flags.dry, overwrite: !!flags.overwrite }

  if (cmd === "list") {
    const idx = await listItems(registry)
    info(c.bold(`${idx.name || "registry"} ${c.dim(`(${(idx.items || []).length} items)`)}`))
    for (const it of idx.items || []) info(`  ${c.cyan(it.name.padEnd(18))} ${c.dim(it.title || "")}`)
    return
  }

  if (cmd === "add") {
    const names = _.slice(1)
    if (names.length === 0) die("Nothing to add. Try `shadcn-htmx add button`.")
    info(`Adding ${c.bold(String(names.length))} component(s) as ${c.bold(FLAVOURS[flavour].label)}${ctx.dry ? c.dim(" (dry run)") : ""}`)
    const seen = new Set()
    for (const n of names) await addComponent(n, ctx, seen)
    if (!ctx.dry) ok(c.bold("Done."))
    return
  }

  die(`Unknown command "${cmd}". Run \`shadcn-htmx --help\`.`)
}

main().catch((e) => die(e && e.stack ? e.stack : String(e)))
