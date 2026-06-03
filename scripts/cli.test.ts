// CLI tests — run with `bun test scripts/cli.test.ts` (or `bun run test:cli`).
// Exercises the flavour-aware installer against the local built registry
// (public/r), asserting it copies ONLY the chosen flavour's file(s).
import { test, expect, beforeAll } from "bun:test"
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = join(import.meta.dir, "..")
const CLI = join(ROOT, "scripts", "cli.mjs")
const REG = join(ROOT, "public", "r")

beforeAll(() => {
  if (!existsSync(join(REG, "button.json"))) {
    // Ensure the registry is built before testing.
    spawnSync("bun", ["run", "build:registry"], { cwd: ROOT })
  }
})

function run(args: string[], out: string) {
  // Use node:child_process (reliable stdout/stderr capture across Bun builds —
  // Bun.spawnSync's capture behaved inconsistently on some versions).
  const r = spawnSync("node", [CLI, ...args, "-r", REG, "-o", out], {
    cwd: ROOT,
    encoding: "utf8",
  })
  return { code: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" }
}
function tmp() {
  const d = mkdtempSync(join(tmpdir(), "shadcn-htmx-cli-"))
  return d
}

test("jinja flavour writes only the .html macro to its target", () => {
  const out = tmp()
  const r = run(["add", "button", "-f", "jinja"], out)
  expect(r.code).toBe(0)
  const f = join(out, "templates/components/button.html")
  expect(existsSync(f)).toBe(true)
  expect(readFileSync(f, "utf8")).toContain("macro")
  // must NOT have pulled the tsx / go / phoenix / html-snippet files
  expect(existsSync(join(out, "components/ui/button.tsx"))).toBe(false)
  expect(existsSync(join(out, "components/button.tmpl"))).toBe(false)
  rmSync(out, { recursive: true, force: true })
})

test("go flavour writes only the .tmpl", () => {
  const out = tmp()
  const r = run(["add", "button", "-f", "go"], out)
  expect(r.code).toBe(0)
  expect(existsSync(join(out, "components/button.tmpl"))).toBe(true)
  expect(existsSync(join(out, "templates/components/button.html"))).toBe(false)
  rmSync(out, { recursive: true, force: true })
})

test("phoenix flavour writes only the .ex", () => {
  const out = tmp()
  const r = run(["add", "button", "-f", "phoenix"], out)
  expect(r.code).toBe(0)
  expect(existsSync(join(out, "lib/my_app_web/components/button.ex"))).toBe(true)
  rmSync(out, { recursive: true, force: true })
})

test("jsx flavour writes the .tsx AND resolves the utils lib dependency", () => {
  const out = tmp()
  const r = run(["add", "button", "-f", "jsx"], out)
  expect(r.code).toBe(0)
  expect(existsSync(join(out, "components/ui/button.tsx"))).toBe(true)
  // button depends on "utils" → cn.ts should be pulled in for jsx only
  expect(existsSync(join(out, "lib/cn.ts"))).toBe(true)
  rmSync(out, { recursive: true, force: true })
})

test("multiple components in one call", () => {
  const out = tmp()
  const r = run(["add", "input", "label", "-f", "html"], out)
  expect(r.code).toBe(0)
  expect(existsSync(join(out, "snippets/input.html"))).toBe(true)
  expect(existsSync(join(out, "snippets/label.html"))).toBe(true)
  rmSync(out, { recursive: true, force: true })
})

test("--dry writes nothing", () => {
  const out = tmp()
  const r = run(["add", "button", "-f", "jinja", "--dry"], out)
  expect(r.code).toBe(0)
  expect(existsSync(join(out, "templates/components/button.html"))).toBe(false)
  rmSync(out, { recursive: true, force: true })
})

test("existing files are skipped unless --overwrite", () => {
  const out = tmp()
  run(["add", "button", "-f", "jinja"], out)
  const r2 = run(["add", "button", "-f", "jinja"], out)
  expect(r2.stderr + r2.stdout).toContain("skip")
  const r3 = run(["add", "button", "-f", "jinja", "--overwrite"], out)
  expect(r3.code).toBe(0)
  rmSync(out, { recursive: true, force: true })
})

test("list shows registry items", () => {
  const out = tmp()
  const r = run(["list"], out)
  expect(r.code).toBe(0)
  expect(r.stdout).toContain("button")
  rmSync(out, { recursive: true, force: true })
})

test("unknown component exits non-zero", () => {
  const out = tmp()
  const r = run(["add", "does-not-exist", "-f", "jinja"], out)
  expect(r.code).not.toBe(0)
  rmSync(out, { recursive: true, force: true })
})
