// Wire up [data-copy-code] buttons to copy the nearest <pre>'s text to
// clipboard. Uses event delegation so it works for content swapped in by htmx.
document.addEventListener("click", async (e) => {
  const btn = e.target instanceof Element ? e.target.closest("[data-copy-code]") : null
  if (!btn) return

  const host = btn.closest(".shiki-host, .group")
  const pre = host?.querySelector("pre")
  if (!pre) return

  try {
    await navigator.clipboard.writeText(pre.innerText)
  } catch {
    return
  }

  const label = btn.querySelector("[data-copy-label]")
  const prev = label?.textContent
  if (label) label.textContent = "Copied"
  setTimeout(() => {
    if (label && prev !== undefined && prev !== null) label.textContent = prev
  }, 1500)
})
