#!/usr/bin/env bun
//
// Build per-item registry JSONs from registry.json.
//
// Input:  registry.json (root manifest; files[] reference paths on disk)
// Output: public/r/<name>.json (one per item; files[] embed `content`)
//
// The output shape matches shadcn/ui's registry-item.json schema so external
// tools (the official shadcn CLI, or any custom consumer) can read our items
// at https://<host>/r/<name>.json. Reference:
//   repos/shadcn-ui/apps/v4/public/schema/registry-item.json
//   repos/shadcn-ui/apps/v4/public/r/styles/new-york/button.json

import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"

const ROOT = resolve(import.meta.dir, "..")

type RegistryFile = {
  path: string
  type: string
  target?: string
}

type RegistryItem = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}

type Registry = {
  $schema?: string
  name: string
  homepage?: string
  items: RegistryItem[]
}

async function main() {
  const manifestPath = join(ROOT, "registry.json")
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Registry

  const outDir = join(ROOT, "public", "r")
  await mkdir(outDir, { recursive: true })

  for (const item of manifest.items) {
    const filesWithContent = await Promise.all(
      item.files.map(async (f) => ({
        path: f.path,
        type: f.type,
        target: f.target ?? "",
        content: await readFile(join(ROOT, f.path), "utf8"),
      })),
    )

    const out = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      ...(item.title && { title: item.title }),
      ...(item.description && { description: item.description }),
      ...(item.dependencies?.length && { dependencies: item.dependencies }),
      ...(item.devDependencies?.length && {
        devDependencies: item.devDependencies,
      }),
      ...(item.registryDependencies?.length && {
        registryDependencies: item.registryDependencies,
      }),
      files: filesWithContent,
    }

    const outPath = join(outDir, `${item.name}.json`)
    await mkdir(dirname(outPath), { recursive: true })
    await writeFile(outPath, JSON.stringify(out, null, 2) + "\n")
    console.log(`  ✓ ${item.name} → public/r/${item.name}.json`)
  }

  // Also emit an index listing for discoverability.
  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: manifest.name,
    homepage: manifest.homepage,
    items: manifest.items.map((i) => ({
      name: i.name,
      type: i.type,
      title: i.title,
      description: i.description,
    })),
  }
  await writeFile(
    join(outDir, "index.json"),
    JSON.stringify(index, null, 2) + "\n",
  )
  console.log(`  ✓ index → public/r/index.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
