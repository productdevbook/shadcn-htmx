#!/usr/bin/env bun
//
// Static pre-render for Cloudflare Pages (or any static host).
//
// The docs site is a Hono server, but every GET page renders deterministic
// HTML. We import the app in-process, render each page via `app.fetch`, and
// write it to dist/<path>/index.html, then copy public/* (styles.css, site.js,
// the registry JSON at /r, etc.) alongside.
//
// NOTE: the htmx *demo* endpoints (POST/GET) are dynamic and do NOT work on a
// static host — the live interactive demos won't run, but every page, its
// source panels, install instructions, and the registry/CLI still work.
//
// Build command for Cloudflare Pages:  bun run build:static
// Build output directory:              dist

import { mkdir, writeFile, readFile, cp, rm } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import server from "@/app/server"

const ROOT = resolve(import.meta.dir, "..")
const DIST = join(ROOT, "dist")
const fetcher = server.fetch as (req: Request) => Response | Promise<Response>

// Routes to pre-render: home + every component docs page + the CLI page.
const index = JSON.parse(await readFile(join(ROOT, "public", "r", "index.json"), "utf8"))
const slugs: string[] = index.items.filter((i: any) => i.name !== "utils").map((i: any) => i.name)
const routes = ["/", ...slugs.map((s) => `/docs/${s}`), "/docs/introduction", "/docs/why-htmx-tailwind", "/docs/cli"]

await rm(DIST, { recursive: true, force: true })
await mkdir(DIST, { recursive: true })

// 1. Copy static assets first (public/* → dist/*): styles.css, site.js,
//    htmx.min.js, copy-code.js, and the registry JSON under /r.
await cp(join(ROOT, "public"), DIST, { recursive: true })

// 2. Render each page to dist/<path>/index.html.
let ok = 0
const failures: string[] = []
for (const path of routes) {
  const res = await fetcher(new Request("http://localhost" + path))
  if (res.status !== 200) {
    failures.push(`${path} → ${res.status}`)
    continue
  }
  const html = await res.text()
  const out = path === "/" ? join(DIST, "index.html") : join(DIST, path.replace(/^\//, ""), "index.html")
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html)
  ok++
}

// 3. A 404 page (Cloudflare Pages serves dist/404.html on unmatched routes).
const home404 = await fetcher(new Request("http://localhost/"))
if (home404.status === 200) await writeFile(join(DIST, "404.html"), await home404.text())

console.log(`✓ pre-rendered ${ok}/${routes.length} pages → dist/`)
if (failures.length) {
  console.error("✗ failed routes:\n  " + failures.join("\n  "))
  process.exit(1)
}
