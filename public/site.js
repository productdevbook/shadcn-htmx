// Wires up the global framework selector and theme toggle in the site header.
// The initial values are applied synchronously by the pre-paint script in
// app/layout.tsx; this file only handles user interaction after that.

(function () {
  var root = document.documentElement

  // Framework selector: keep <select> in sync with <html data-lang>.
  var select = document.querySelector('[data-framework-select]')
  if (select) {
    select.value = root.getAttribute('data-lang') || 'jsx'
    select.addEventListener('change', function () {
      var next = select.value
      root.setAttribute('data-lang', next)
      try { localStorage.setItem('shadcn-htmx-lang', next) } catch (e) {}
    })
  }

  // Theme toggle: flip .dark on <html> and persist.
  var toggle = document.querySelector('[data-theme-toggle]')
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.classList.toggle('dark') ? 'dark' : 'light'
      try { localStorage.setItem('shadcn-htmx-theme', next) } catch (e) {}
    })
  }

  // DEMO-ONLY HELPER — not part of any component's public API.
  // [data-disable-when-empty] form keeps a submit button disabled until
  // every <input>/<textarea> inside has a non-empty value. Used only in
  // the "Disabled" docs example to make the disabled→enabled transition
  // visible. Real apps should use native HTML validation (required
  // attribute + form.checkValidity()) instead.
  document.querySelectorAll('[data-disable-when-empty]').forEach(function (form) {
    var fields = form.querySelectorAll('input, textarea')
    var btn = form.querySelector('button[type="submit"]')
    if (!btn) return
    var sync = function () {
      var allFilled = true
      fields.forEach(function (f) {
        if (!f.value || !f.value.trim()) allFilled = false
      })
      if (allFilled) btn.removeAttribute('disabled')
      else btn.setAttribute('disabled', '')
    }
    fields.forEach(function (f) { f.addEventListener('input', sync) })
    sync()
  })

  // Popover positioning (registry/ui/popover.tsx + dropdown-menu.tsx).
  //
  // Native [popover] gives us open/close + light dismiss + ESC + top-layer,
  // but NOT positioning relative to the trigger. CSS Anchor Positioning
  // (anchor-name / position-anchor) solves this declaratively — shipped in
  // Chrome 125+, not yet in Firefox/Safari at time of writing. So we read
  // the trigger's rect on the `toggle` event and write inline top/left.
  // data-side ("top"|"right"|"bottom"|"left") controls placement; we
  // clamp to the viewport so the popover never goes off-screen.
  var positionPopover = function (pop) {
    var trig = document.querySelector(
      '[popovertarget="' + CSS.escape(pop.id) + '"]',
    )
    if (!trig) return
    var t = trig.getBoundingClientRect()
    var p = pop.getBoundingClientRect()
    var side = pop.getAttribute('data-side') || 'bottom'
    var gap = 8
    var top, left
    if (side === 'bottom') {
      top = t.bottom + gap
      left = t.left + t.width / 2 - p.width / 2
    } else if (side === 'top') {
      top = t.top - p.height - gap
      left = t.left + t.width / 2 - p.width / 2
    } else if (side === 'left') {
      top = t.top + t.height / 2 - p.height / 2
      left = t.left - p.width - gap
    } else {
      top = t.top + t.height / 2 - p.height / 2
      left = t.right + gap
    }
    var pad = 4
    top = Math.max(pad, Math.min(window.innerHeight - p.height - pad, top))
    left = Math.max(pad, Math.min(window.innerWidth - p.width - pad, left))
    pop.style.top = top + 'px'
    pop.style.left = left + 'px'
    // Override the fallback centred placement from input.css.
    pop.style.transform = 'none'
  }
  document.querySelectorAll('[popover][data-side]').forEach(function (pop) {
    pop.addEventListener('toggle', function (e) {
      if (e.newState !== 'open') return
      requestAnimationFrame(function () { positionPopover(pop) })
    })
  })
  var repositionOpenPopovers = function () {
    document.querySelectorAll('[popover][data-side]').forEach(function (pop) {
      if (pop.matches(':popover-open')) positionPopover(pop)
    })
  }
  window.addEventListener('scroll', repositionOpenPopovers, { passive: true })
  window.addEventListener('resize', repositionOpenPopovers)

  // Dropdown Menu (registry/ui/dropdown-menu.tsx).
  //
  // The native [popover] gives us light dismiss + ESC + focus restoration.
  // We add the APG menu keyboard contract on top.
  document.querySelectorAll('[data-slot="dropdown-menu"]').forEach(function (menu) {
    menu.addEventListener('toggle', function (e) {
      if (e.newState === 'open') {
        var first = menu.querySelector('[role="menuitem"]:not([data-disabled="true"])')
        if (first) setTimeout(function () { first.focus() }, 0)
      }
    })
  })
  // Click on menuitem closes the menu. APG: "Menu items perform an action
  // and close the menu." Without this, clicking an item leaves the popover
  // open while the action runs (e.g. htmx fetch); the menu just sits there.
  document.addEventListener('click', function (e) {
    var item = e.target.closest && e.target.closest('[role="menuitem"]')
    if (!item) return
    if (item.getAttribute('data-disabled') === 'true') return
    var menu = item.closest('[data-slot="dropdown-menu"]')
    if (menu && typeof menu.hidePopover === 'function') menu.hidePopover()
  })
  document.addEventListener('keydown', function (e) {
    var item = e.target.closest && e.target.closest('[role="menuitem"]')
    if (!item) return
    var menu = item.closest('[data-slot="dropdown-menu"]')
    if (!menu) return
    var items = [].slice.call(
      menu.querySelectorAll('[role="menuitem"]:not([data-disabled="true"])'),
    )
    var idx = items.indexOf(item)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(idx + 1) % items.length].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(idx - 1 + items.length) % items.length].focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0].focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1].focus()
    } else if (
      e.key.length === 1 &&
      /\S/.test(e.key) &&
      // Skip when a modifier is pressed — those are browser shortcuts
      // (Ctrl+S, Cmd+F, etc.) that we must not hijack into type-to-find.
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      var ch = e.key.toLowerCase()
      for (var i = 1; i <= items.length; i++) {
        var cand = items[(idx + i) % items.length]
        if ((cand.textContent || '').trim().toLowerCase().startsWith(ch)) {
          cand.focus()
          break
        }
      }
    }
  })

  // Accordion (registry/ui/accordion.tsx).
  //   - For type="single", set the `name` attribute on every <details>
  //     inside the group. The HTML Living Standard then makes the group
  //     exclusive — opening one closes the others, with no JS state.
  //   - Wire up the APG arrow-key + Home/End contract across summaries.
  document.querySelectorAll('[data-accordion]').forEach(function (group) {
    var groupName = group.getAttribute('data-group-name')
    if (groupName) {
      group.querySelectorAll('[data-slot="accordion-item"]').forEach(function (d) {
        d.setAttribute('name', groupName)
      })
    }
  })
  document.addEventListener('keydown', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-slot="accordion-trigger"]')
    if (!trigger) return
    var group = trigger.closest('[data-accordion]')
    if (!group) return
    var keys = { ArrowDown: 1, ArrowUp: -1, Home: 'home', End: 'end' }
    if (!(e.key in keys)) return
    e.preventDefault()
    var triggers = [].slice.call(
      group.querySelectorAll(
        'details:not([data-disabled="true"]) > [data-slot="accordion-trigger"]',
      ),
    )
    var idx = triggers.indexOf(trigger)
    var dir = keys[e.key]
    var target
    if (dir === 1) target = triggers[(idx + 1) % triggers.length]
    else if (dir === -1) target = triggers[(idx - 1 + triggers.length) % triggers.length]
    else if (dir === 'home') target = triggers[0]
    else if (dir === 'end') target = triggers[triggers.length - 1]
    if (target) target.focus()
  })

  // Tooltip (registry/ui/tooltip.tsx).
  //
  // CSS shows the tooltip on :hover and :focus-within. We only need the
  // APG ESC-to-dismiss bit: pressing Escape while a tooltip's trigger is
  // focused suppresses it until the user moves away. "Moves away" is
  // EITHER the pointer leaving the wrapper OR focus moving out of it —
  // so the next hover/Tab back reveals the tooltip again.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return
    var active = document.activeElement
    if (!active || !active.closest) return
    var trigger = active.closest('[data-tooltip-trigger]')
    if (!trigger) return
    trigger.setAttribute('data-suppress', 'true')
    active.blur()
  })
  document.addEventListener(
    'mouseleave',
    function (e) {
      var t = e.target
      if (t && t.removeAttribute) t.removeAttribute('data-suppress')
    },
    true,
  )
  // focusout fires whenever focus leaves an element — capture phase so we
  // catch it on the wrapper even when the inner button loses focus.
  // Without this, keyboard-only users who pressed ESC then Tabbed back
  // would see the tooltip stay hidden forever (the suppress flag was
  // only cleared on mouseleave).
  document.addEventListener(
    'focusout',
    function (e) {
      var t = e.target && e.target.closest && e.target.closest('[data-tooltip-trigger]')
      if (t) t.removeAttribute('data-suppress')
    },
    true,
  )

  // Toast (registry/ui/toast.tsx).
  //   - Auto-dismiss after [data-duration] ms (skip when 0).
  //   - Click on [data-toast-close] removes the toast.
  //   - We wait for the exit animation (~140ms) before actually removing.
  var armToast = function (toast) {
    if (toast._scnArmed) return
    toast._scnArmed = true
    var duration = Number(toast.getAttribute('data-duration') || 0)
    var dismiss = function () {
      if (toast.getAttribute('data-state') === 'closed') return
      toast.setAttribute('data-state', 'closed')
      // 140ms matches scn-toast-out in input.css.
      setTimeout(function () { toast.remove() }, 160)
    }
    var closer = toast.querySelector('[data-toast-close]')
    if (closer) closer.addEventListener('click', dismiss)
    if (duration > 0) setTimeout(dismiss, duration)
  }
  // Arm any toasts already in the DOM at boot.
  document.querySelectorAll('[data-slot="toast"]').forEach(armToast)
  // Arm toasts inserted later (e.g. via htmx swap into the viewport).
  if (typeof MutationObserver === 'function') {
    var armNew = function (root) {
      if (!root || !root.querySelectorAll) return
      if (root.matches && root.matches('[data-slot="toast"]')) armToast(root)
      root.querySelectorAll && root.querySelectorAll('[data-slot="toast"]').forEach(armToast)
    }
    document.querySelectorAll('[data-slot="toast-viewport"]').forEach(function (vp) {
      new MutationObserver(function (records) {
        records.forEach(function (r) { r.addedNodes.forEach(armNew) })
      }).observe(vp, { childList: true })
    })
  }

  // Combobox (registry/ui/combobox.tsx) — native <input list> + <datalist>.
  //
  // No JS needed. The browser handles the dropdown, filter, click, keyboard,
  // and focus management. For server-driven options, the consumer wires
  // htmx onto the input with hx-target pointing at the <datalist>.

  // Tabs (registry/ui/tabs.tsx). Initial state is set by an inline boot
  // script next to each <Tabs> element so there's no flicker. Here we wire
  // up the WAI-ARIA keyboard contract + click switching.
  //
  // Keyboard (matches repos/aria-practices/content/patterns/tabs/):
  //   - ArrowLeft / ArrowRight on horizontal tabs (or Up/Down on vertical)
  //   - Home → first tab, End → last tab
  //   - Tab moves focus out of the tablist into the active panel.
  var switchTab = function (group, value) {
    var oldActive = group.getAttribute('data-active-tab')
    if (oldActive === value) return
    group.setAttribute('data-active-tab', value)
    group.querySelectorAll('[data-tab-trigger]').forEach(function (t) {
      var on = t.getAttribute('data-tab-trigger') === value
      t.setAttribute('aria-selected', on ? 'true' : 'false')
      t.setAttribute('tabindex', on ? '0' : '-1')
    })
    group.querySelectorAll('[data-tab-panel]').forEach(function (p) {
      var on = p.getAttribute('data-tab-panel') === value
      if (on) p.removeAttribute('hidden')
      else p.setAttribute('hidden', '')
    })
  }
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-tab-trigger]')
    if (!trigger) return
    var group = trigger.closest('[data-tabs]')
    if (!group) return
    var value = trigger.getAttribute('data-tab-trigger')
    switchTab(group, value)
    trigger.focus()
  })
  document.addEventListener('keydown', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-tab-trigger]')
    if (!trigger) return
    var group = trigger.closest('[data-tabs]')
    if (!group) return
    var orientation = group.getAttribute('data-orientation') || 'horizontal'
    var activation = group.getAttribute('data-activation') || 'automatic'
    var prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    var next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

    // Space / Enter activate the focused tab. In automatic mode this is a
    // no-op (the tab is already active because focus = activation). In
    // manual mode this is the only way to switch.
    // See repos/aria-practices/content/patterns/tabs/tabs-pattern.html:82.
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      switchTab(group, trigger.getAttribute('data-tab-trigger'))
      return
    }

    if (e.key !== prev && e.key !== next && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    var triggers = [].slice.call(group.querySelectorAll('[data-tab-trigger]:not([disabled])'))
    var idx = triggers.indexOf(trigger)
    var target
    if (e.key === prev) target = triggers[(idx - 1 + triggers.length) % triggers.length]
    else if (e.key === next) target = triggers[(idx + 1) % triggers.length]
    else if (e.key === 'Home') target = triggers[0]
    else if (e.key === 'End') target = triggers[triggers.length - 1]
    if (target) {
      // Manual activation: move focus only, leave the active tab untouched.
      // Automatic activation: move focus AND activate.
      if (activation !== 'manual') switchTab(group, target.getAttribute('data-tab-trigger'))
      target.focus()
    }
  })

  // Dialog wiring (registry/ui/dialog.tsx).
  //   - [data-dialog-trigger] with [data-dialog-target="id"] → call .showModal()
  //     on the matching <dialog>.
  //   - [data-dialog-close] anywhere inside a <dialog> → call .close() on it.
  //   - Click on the <dialog> itself (not its children) closes it when
  //     [data-close-on-backdrop="true"] is set.
  //   - htmx-inserted dialogs that arrive with the `open` attribute are
  //     promoted to .showModal() so they get the focus trap and backdrop.
  // Dismiss a dialog. Use requestClose() when available — it fires the
  // native `cancel` event first, so consumers can preventDefault() to keep
  // the dialog open (e.g. "are you sure you want to discard changes?").
  // Falls back to close() on older browsers.
  // See repos/mdn/files/en-us/web/api/htmldialogelement/requestclose/.
  var dismissDialog = function (dlg, returnValue) {
    if (typeof dlg.requestClose === 'function') dlg.requestClose(returnValue)
    else dlg.close(returnValue)
  }
  // True if the clicked closer is a submit button inside a <form method="dialog">.
  // The browser closes the dialog natively in that case and sets returnValue,
  // so our handler stays out of the way.
  var isFormDialogSubmit = function (closer) {
    var btn =
      closer.matches && closer.matches('button[type="submit"]')
        ? closer
        : closer.querySelector && closer.querySelector('button[type="submit"]')
    return !!(btn && btn.form && btn.form.method && btn.form.method.toLowerCase() === 'dialog')
  }
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-dialog-trigger]')
    if (trigger) {
      var id = trigger.getAttribute('data-dialog-target')
      if (id) {
        var dlg = document.getElementById(id)
        if (dlg && typeof dlg.showModal === 'function') {
          if (!dlg.open) dlg.showModal()
        }
      }
    }
    var closer = e.target.closest && e.target.closest('[data-dialog-close]')
    if (closer) {
      // Form-submit inside <form method="dialog">: let the browser handle
      // close + returnValue natively. Calling .close() here would race with
      // the form submission and may zero out returnValue.
      if (isFormDialogSubmit(closer)) return
      var parent = closer.closest('dialog')
      if (parent) dismissDialog(parent)
    }
  })
  document.querySelectorAll('dialog[data-close-on-backdrop="true"]').forEach(function (dlg) {
    // Skip when the browser already handles light dismiss via closedby="any".
    if (dlg.getAttribute('closedby') === 'any') return
    dlg.addEventListener('click', function (e) {
      // Clicks on the inner content bubble through but hit a child, so we
      // only treat clicks whose target is the dialog itself as backdrop.
      if (e.target === dlg) dismissDialog(dlg)
    })
  })
  // After every htmx swap, look for newly-inserted dialogs that came in with
  // `open` set, and promote them to modal so focus trap + backdrop apply.
  // htmx v4 renamed the event from "htmx:afterSwap" to "htmx:after:swap"; we
  // listen for both so the same site.js works with htmx 2.x and 4.x. We can't
  // trust e.target — it's the trigger element, not the swap destination — so
  // we scan the whole document for any non-promoted open dialogs.
  var promoteSwappedDialogs = function () {
    document.querySelectorAll('dialog[open]').forEach(function (dlg) {
      if (!dlg._scnPromoted && typeof dlg.showModal === 'function') {
        dlg.removeAttribute('open')
        dlg.showModal()
        dlg._scnPromoted = true
      }
    })
  }
  document.addEventListener('htmx:after:swap', promoteSwappedDialogs)
  document.addEventListener('htmx:afterSwap', promoteSwappedDialogs)

  // DEMO-ONLY HELPER — not part of any component's public API.
  // [data-toggle-button] wraps a <Button pressed> demo so clicks flip
  // aria-pressed and update a sibling [data-toggle-state] indicator.
  // The Button component itself just renders aria-pressed from its prop;
  // real apps wire toggle state via htmx (e.g. hx-post + server returns
  // a new <Button pressed={...}>).
  document.querySelectorAll('[data-toggle-button]').forEach(function (wrap) {
    wrap.addEventListener('click', function (e) {
      var hit = e.target.closest && e.target.closest('button')
      if (!hit || !wrap.contains(hit)) return
      var pressed = hit.getAttribute('aria-pressed') === 'true'
      var next = pressed ? 'false' : 'true'
      hit.setAttribute('aria-pressed', next)
      var stateEl = wrap.querySelector('[data-toggle-state]')
      if (stateEl) stateEl.textContent = 'aria-pressed="' + next + '"'
    })
  })

  // TOC active-link tracking. We highlight whichever heading sits at the top
  // of the reading area. Strategy: observe each heading (h2/h3 with the
  // matching id); on every scroll, pick the last heading whose top has
  // already crossed the activation line (72px below the sticky header).
  // Falls back to the first link on initial paint so something is always lit.
  var tocLinks = document.querySelectorAll('[data-toc-link]')
  if (tocLinks.length) {
    var headings = []
    var linksByHash = {}
    tocLinks.forEach(function (a) {
      var hash = a.getAttribute('href')
      if (!hash || hash.charAt(0) !== '#') return
      var id = hash.slice(1)
      var el = document.getElementById(id)
      if (el) {
        headings.push({ id: id, el: el })
        linksByHash[id] = a
      }
    })

    var setActive = function (id) {
      tocLinks.forEach(function (a) { a.removeAttribute('data-active') })
      var link = linksByHash[id]
      if (link) link.setAttribute('data-active', 'true')
    }

    var updateActive = function () {
      // px from top of viewport that counts as "current". Slightly above the
      // 80px scroll-mt-20 anchor offset so a heading lit on scroll-into-view
      // actually qualifies despite sub-pixel rounding.
      var line = 100
      var current = headings[0] ? headings[0].id : null
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].el.getBoundingClientRect().top <= line) {
          current = headings[i].id
        } else {
          break
        }
      }
      if (current) setActive(current)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
  }

  // ===== New APG components (batch A) =====

  // Number Input (registry/ui/number-input.tsx).
    //
    // The control is a native <input type="number">, so it is already a
    // role=spinbutton with the full APG keyboard contract (ArrowUp/ArrowDown
    // step, value clamping) — see
    // repos/aria-practices/content/patterns/spinbutton/spinbutton-pattern.html.
    // The only thing the platform doesn't give us is click handlers for our
    // custom −/+ buttons, so we wire those to the native stepUp()/stepDown()
    // DOM methods. The buttons are tabindex="-1" (redundant with the arrow
    // keys, per the APG quantity-spinbutton example), so keyboard users never
    // tab onto them — focus stays on the input.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-slot="number-input"] [data-step]')
      if (!btn || btn.disabled) return
      var root = btn.closest('[data-slot="number-input"]')
      var input = root && root.querySelector('input[type="number"]')
      if (!input || input.disabled || input.readOnly) return
      try {
        if (btn.getAttribute('data-step') === 'up') input.stepUp()
        else input.stepDown()
      } catch (err) { return }
      // Fire input + change so listeners (and htmx hx-trigger="change") react
      // exactly as if the user had typed or pressed an arrow key.
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })

  // Link — APG fallback only. A native <a href> needs no JS: role=link and
    // Enter-activates-the-link come from the platform (APG Link pattern,
    // repos/aria-practices/content/patterns/link/link-pattern.html). This boots
    // ONLY the non-anchor fallback (as="span"/"button" + role="link"), which the
    // APG examples build by hand and which the browser will NOT navigate for us.
    // We honour the APG keyboard contract: Enter executes the link and moves to
    // its target. The navigation target comes from a data-href hook.
    document
      .querySelectorAll('[data-slot="link"][role="link"][data-href]')
      .forEach(function (el) {
        if (el.tagName === "A") return // real anchors are native; skip
        var go = function () {
          var href = el.getAttribute("data-href")
          if (href) window.location.assign(href)
        }
        el.addEventListener("click", go)
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault()
            go()
          }
        })
      })

  // Range Slider (registry/ui/range-slider.tsx).
    //
    // Two native <input type="range"> stacked on one track give us role=slider,
    // aria-valuemin/max/now and the full arrow/Home/End/PageUp/Down keyboard
    // contract for free (WAI-ARIA APG Multi-Thumb Slider pattern). The platform
    // does NOT know the two inputs are related, so here we:
    //   - stop the thumbs crossing. APG: "the maximum value of the thumb that
    //     sets the lower end of the range is limited by the current value of the
    //     thumb that sets the upper end" (and vice versa). Whichever thumb the
    //     user is moving is the one we pin to the other's value.
    //   - publish --range-min / --range-max (percentages) on the root so the
    //     coloured fill paints the segment between the two thumbs.
    document.querySelectorAll('[data-slot="range-slider"]').forEach(function (root) {
      var lo = root.querySelector('input[data-range="min"]')
      var hi = root.querySelector('input[data-range="max"]')
      if (!lo || !hi || root.dataset.rangeBound === 'true') return
      root.dataset.rangeBound = 'true'
      var pct = function (input) {
        var min = +input.min
        var max = +input.max
        return ((+input.value - min) / ((max - min) || 1)) * 100
      }
      var paint = function () {
        root.style.setProperty('--range-min', pct(lo) + '%')
        root.style.setProperty('--range-max', pct(hi) + '%')
      }
      var clamp = function (active) {
        if (+lo.value <= +hi.value) return
        // The thumb the user is driving wins; pin the other one to it.
        if (active === lo) hi.value = lo.value
        else lo.value = hi.value
      }
      lo.addEventListener('input', function () { clamp(lo); paint() })
      hi.addEventListener('input', function () { clamp(hi); paint() })
      paint()
    })

  // Toolbar (registry/ui/toolbar.tsx).
    //
    // role="toolbar" is a SINGLE tab stop. An inline boot script (next to each
    // toolbar) sets the initial roving tabindex — one control at tabindex="0",
    // the rest at -1. Here we own the live keyboard contract, modelled on how
    // Tabs handles arrows and on the APG example's roving tabindex:
    //   repos/aria-practices/content/patterns/toolbar/toolbar-pattern.html
    //   repos/aria-practices/content/patterns/toolbar/examples/js/FormatToolbar.js
    //
    // Keyboard:
    //   - ArrowLeft / ArrowRight on horizontal toolbars (Up/Down on vertical)
    //     move focus between controls, wrapping at the ends.
    //   - Home -> first control, End -> last control.
    //   - Moving focus rolls the tabindex="0" onto the new control so Tab/
    //     Shift+Tab always re-enters where focus last was.
    // Separators (role="separator") carry no data-toolbar-item, so they are
    // skipped. Disabled buttons ([disabled]) are skipped too.
    var rollToolbarFocus = function (bar, target) {
      bar.querySelectorAll('[data-toolbar-item]').forEach(function (it) {
        it.setAttribute('tabindex', '-1')
      })
      target.setAttribute('tabindex', '0')
      target.focus()
    }
    document.addEventListener('keydown', function (e) {
      var item = e.target.closest && e.target.closest('[data-toolbar-item]')
      if (!item) return
      var bar = item.closest('[data-slot="toolbar"]')
      if (!bar) return
      var vertical = bar.getAttribute('data-orientation') === 'vertical'
      var prev = vertical ? 'ArrowUp' : 'ArrowLeft'
      var next = vertical ? 'ArrowDown' : 'ArrowRight'
      if (e.key !== prev && e.key !== next && e.key !== 'Home' && e.key !== 'End') return
      e.preventDefault()
      var items = [].slice.call(
        bar.querySelectorAll('[data-toolbar-item]:not([disabled])'),
      )
      if (!items.length) return
      var idx = items.indexOf(item)
      var target
      if (e.key === prev) target = items[(idx - 1 + items.length) % items.length]
      else if (e.key === next) target = items[(idx + 1) % items.length]
      else if (e.key === 'Home') target = items[0]
      else if (e.key === 'End') target = items[items.length - 1]
      if (target) rollToolbarFocus(bar, target)
    })
    // Clicking a control also makes it the roving-tabindex owner, so a
    // subsequent Tab away + Shift+Tab back returns to the last-used control.
    document.addEventListener('click', function (e) {
      var item = e.target.closest && e.target.closest('[data-toolbar-item]')
      if (!item || item.hasAttribute('disabled')) return
      var bar = item.closest('[data-slot="toolbar"]')
      if (!bar) return
      bar.querySelectorAll('[data-toolbar-item]').forEach(function (it) {
        it.setAttribute('tabindex', it === item ? '0' : '-1')
      })
    })

})()
