/** @jsxImportSource hono/jsx */
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"
import { raw } from "hono/html"

// Cache-bust static asset URLs with a per-server-start version. Without this,
// the browser holds onto stale site.js / styles.css across dev iterations and
// "I fixed the bug" looks like "the bug is still there" from the user side.
// Re-renders only on cold start; hot-reload edits keep the same nonce.
const ASSET_VERSION = String(Date.now())

// Pre-paint script: runs synchronously in <head>, before the body renders, so
// the theme class and lang attribute are in place before CSS applies. This is
// the only way to avoid a flash of wrong theme / wrong framework snippet.
const prePaintScript = `
(function(){
  try {
    var lang = localStorage.getItem('shadcn-htmx-lang') || 'jsx';
    document.documentElement.setAttribute('data-lang', lang);
    var theme = localStorage.getItem('shadcn-htmx-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`.trim()

function SiteHeader() {
  return (
    <header class="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div class="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
        <a href="/" class="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background text-[10px] font-bold">
            sh
          </span>
          <span class="whitespace-nowrap">shadcn-htmx</span>
        </a>
        <nav class="flex items-center gap-4 text-sm text-muted-foreground sm:gap-5">
          <a href="/docs/button" class="transition-colors hover:text-foreground">
            Docs
          </a>
          <a
            href="https://github.com/productdevbook/shadcn-htmx"
            class="hidden transition-colors hover:text-foreground sm:inline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div class="ml-auto flex items-center gap-2">
          <label class="sr-only" for="framework-select">
            Framework
          </label>
          <div class="relative">
            <select
              id="framework-select"
              data-framework-select
              class="h-8 cursor-pointer appearance-none rounded-md border bg-background pr-8 pl-3 text-xs font-medium shadow-xs transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label="Select framework for code samples"
            >
              <option value="jsx">Hono JSX</option>
              <option value="jinja">Jinja2</option>
              <option value="go">Go template</option>
              <option value="phoenix">Phoenix</option>
              <option value="html">HTML</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <button
            type="button"
            data-theme-toggle
            class="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border bg-background shadow-xs transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="Toggle color theme"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4 dark:hidden"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="hidden size-4 dark:block"
              aria-hidden="true"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export function Layout(props: PropsWithChildren<{ title: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link rel="stylesheet" href={`/styles.css?v=${ASSET_VERSION}`} />
        {raw(`<script>${prePaintScript}</script>`)}
        <script src="/htmx.min.js" defer></script>
        <script src={`/copy-code.js?v=${ASSET_VERSION}`} defer></script>
        <script src={`/site.js?v=${ASSET_VERSION}`} defer></script>
      </head>
      <body class="min-h-svh bg-background text-foreground antialiased">
        <SiteHeader />
        {props.children}
      </body>
    </html>
  )
}

// Wrap a full-page JSX response with the HTML5 doctype. Hono JSX can't render
// `<!DOCTYPE>` directly, and without it Chromium falls into Quirks Mode.
export function page(c: Context, node: any) {
  return c.html(
    <>
      {raw("<!DOCTYPE html>")}
      {node}
    </>,
  )
}
