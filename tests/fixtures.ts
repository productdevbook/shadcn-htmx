import { expect, type Locator, type Page } from "@playwright/test"

// Shared test helpers — keep individual *.spec.ts files thin.

/**
 * Get the bounding box, asserting it isn't null. Playwright returns null
 * when the element is detached or hidden; we want a hard error in tests.
 */
export async function rect(loc: Locator): Promise<{
  x: number
  y: number
  width: number
  height: number
  cx: number
  cy: number
  right: number
  bottom: number
}> {
  const b = await loc.boundingBox()
  if (!b) throw new Error(`No bounding box for ${loc}`)
  return {
    ...b,
    cx: b.x + b.width / 2,
    cy: b.y + b.height / 2,
    right: b.x + b.width,
    bottom: b.y + b.height,
  }
}

/**
 * Assert that an anchored floating element (popover, dropdown, tooltip)
 * is placed correctly relative to its trigger.
 *
 *   side="bottom"  → floating top = trigger.bottom + gap; centred X
 *   side="top"     → floating bottom = trigger.top - gap; centred X
 *   side="right"   → floating left = trigger.right + gap; centred Y
 *   side="left"    → floating right = trigger.left - gap; centred Y
 *
 * Tolerates sub-pixel rounding (±3px). `gap` defaults to 8.
 */
export async function expectAnchored(
  trigger: Locator,
  floating: Locator,
  side: "top" | "right" | "bottom" | "left",
  gap = 8,
) {
  const t = await rect(trigger)
  const f = await rect(floating)
  const tol = 3

  if (side === "bottom") {
    expect(Math.abs(f.y - (t.bottom + gap))).toBeLessThanOrEqual(tol)
    expect(Math.abs(f.cx - t.cx)).toBeLessThanOrEqual(tol)
  } else if (side === "top") {
    expect(Math.abs(f.bottom - (t.y - gap))).toBeLessThanOrEqual(tol)
    expect(Math.abs(f.cx - t.cx)).toBeLessThanOrEqual(tol)
  } else if (side === "right") {
    expect(Math.abs(f.x - (t.right + gap))).toBeLessThanOrEqual(tol)
    expect(Math.abs(f.cy - t.cy)).toBeLessThanOrEqual(tol)
  } else {
    expect(Math.abs(f.right - (t.x - gap))).toBeLessThanOrEqual(tol)
    expect(Math.abs(f.cy - t.cy)).toBeLessThanOrEqual(tol)
  }
}

/**
 * Visit a docs page and wait for it to settle. Returns the page for chaining.
 */
export async function gotoDoc(page: Page, slug: string): Promise<Page> {
  await page.goto(`/docs/${slug}`)
  // The pre-paint script for tabs/etc. runs synchronously, but htmx loads
  // async. Wait for body to have the htmx attribute so subsequent
  // interactions are reliable.
  await page.waitForLoadState("domcontentloaded")
  return page
}

/**
 * Open a popover-style floating element via its trigger and wait until it's
 * actually in the top layer (matches :popover-open).
 */
export async function openPopoverTrigger(
  page: Page,
  triggerSelector: string,
): Promise<void> {
  const trigger = page.locator(triggerSelector)
  const target = await trigger.getAttribute("popovertarget")
  if (!target) throw new Error(`${triggerSelector} has no popovertarget`)
  await trigger.click()
  // Wait until the popover has been promoted to the top layer.
  await page.waitForFunction(
    (id) => {
      const el = document.getElementById(id)
      return !!el && el.matches(":popover-open")
    },
    target,
    { timeout: 2000 },
  )
}
