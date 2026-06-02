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


  // ===== New APG components (batch B) =====

  ;(function () {
    // Listbox (registry/ui/listbox.tsx) — APG Listbox pattern.
      //
      // The native fallback (<select multiple>) needs no JS, but the styled
      // role="listbox" widget does: the platform doesn't manage option focus or
      // selection. An inline boot <script> next to each listbox sets the initial
      // roving tabindex (single tab stop) + seeds the hidden form value; here we
      // own the live keyboard + selection contract, keyed on data-slot="listbox".
      //
      // Focus management = roving tabindex (matches Toolbar/Tabs/Menu), the APG-
      // sanctioned alternative to aria-activedescendant. Keyboard contract from
      //   repos/aria-practices/content/patterns/listbox/listbox-pattern.html
      //   - Up/Down (or Left/Right when horizontal): move focus to the prev/next
      //     option. In a single-select listbox, selection follows focus.
      //   - Home/End: move focus to the first/last option.
      //   - Space / Enter: toggle (multi) or select (single) the focused option.
      //   - Multi-select (recommended model, no modifier needed): Space toggles;
      //     Shift+Arrow / Shift+Click select a contiguous range; Ctrl/Cmd+A
      //     selects all (or clears if all already selected).
      //   - Type-ahead: a printable key focuses the next option whose text starts
      //     with the typed string (cleared after 500ms of no typing).
      var listboxOptions = function (lb) {
        return [].slice.call(
          lb.querySelectorAll('[role="option"]:not([aria-disabled="true"])'),
        )
      }
      var listboxSync = function (lb) {
        // Mirror the current selection into the sibling hidden input so the
        // widget submits like a normal field, then fire change + listbox:change
        // so consumers (and htmx hx-trigger="change") react.
        var span = lb.parentNode
        var hidden = span && span.querySelector('[data-listbox-value]')
        var vals = []
        lb.querySelectorAll('[role="option"][aria-selected="true"]').forEach(
          function (o) {
            vals.push(o.getAttribute('data-value') || (o.textContent || '').trim())
          },
        )
        if (hidden) {
          hidden.value = vals.join(',')
          hidden.dispatchEvent(new Event('change', { bubbles: true }))
        }
        lb.dispatchEvent(
          new CustomEvent('listbox:change', { bubbles: true, detail: { values: vals } }),
        )
      }
      var listboxRoveTo = function (lb, target) {
        lb.querySelectorAll('[role="option"]').forEach(function (o) {
          o.setAttribute('tabindex', o === target ? '0' : '-1')
        })
        if (target) {
          target.focus()
          // Keep the focused option visible in the scroll container.
          if (target.scrollIntoView) target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
        }
      }
      var listboxSelectOnly = function (lb, target) {
        // Single-select: exactly one option is aria-selected.
        lb.querySelectorAll('[role="option"]').forEach(function (o) {
          if (o.getAttribute('aria-disabled') === 'true') return
          o.setAttribute('aria-selected', o === target ? 'true' : 'false')
        })
      }
      var listboxToggle = function (o) {
        o.setAttribute(
          'aria-selected',
          o.getAttribute('aria-selected') === 'true' ? 'false' : 'true',
        )
      }
      var listboxRange = function (lb, fromIdx, toIdx) {
        var opts = listboxOptions(lb)
        var lo = Math.min(fromIdx, toIdx)
        var hi = Math.max(fromIdx, toIdx)
        opts.forEach(function (o, i) {
          o.setAttribute('aria-selected', i >= lo && i <= hi ? 'true' : 'false')
        })
      }
      // Per-listbox type-ahead buffer.
      var listboxTypeahead = {}
      document.addEventListener('keydown', function (e) {
        var opt = e.target.closest && e.target.closest('[role="option"]')
        if (!opt) return
        var lb = opt.closest('[data-slot="listbox"]')
        if (!lb || lb.getAttribute('aria-disabled') === 'true') return
        var multi = lb.getAttribute('aria-multiselectable') === 'true'
        var horizontal = lb.getAttribute('data-orientation') === 'horizontal'
        var prev = horizontal ? 'ArrowLeft' : 'ArrowUp'
        var next = horizontal ? 'ArrowDown' : 'ArrowDown'
        var nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
        var opts = listboxOptions(lb)
        var idx = opts.indexOf(opt)
    
        // Ctrl/Cmd+A — select all (or clear when all already selected).
        if (multi && (e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          var allSel = opts.every(function (o) {
            return o.getAttribute('aria-selected') === 'true'
          })
          opts.forEach(function (o) {
            o.setAttribute('aria-selected', allSel ? 'false' : 'true')
          })
          listboxSync(lb)
          return
        }
    
        if (e.key === prev || e.key === nextKey || e.key === 'Home' || e.key === 'End') {
          e.preventDefault()
          if (!opts.length) return
          var target
          if (e.key === prev) target = opts[(idx - 1 + opts.length) % opts.length]
          else if (e.key === nextKey) target = opts[(idx + 1) % opts.length]
          else if (e.key === 'Home') target = opts[0]
          else target = opts[opts.length - 1]
          listboxRoveTo(lb, target)
          if (multi) {
            if (e.shiftKey) {
              // Shift+Arrow extends the range and toggles the new option.
              listboxToggle(target)
              listboxSync(lb)
            }
          } else {
            // Single-select: selection follows focus.
            listboxSelectOnly(lb, target)
            listboxSync(lb)
          }
          return
        }
    
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          if (multi) {
            if (e.shiftKey) {
              // Shift+Space: select contiguous range from the last anchor.
              var anchor = lb._scnAnchor != null ? lb._scnAnchor : idx
              listboxRange(lb, anchor, idx)
            } else {
              listboxToggle(opt)
              lb._scnAnchor = idx
            }
          } else {
            listboxSelectOnly(lb, opt)
          }
          listboxSync(lb)
          return
        }
    
        if (e.key === 'Shift') {
          lb._scnAnchor = idx
          return
        }
    
        // Type-ahead: printable key, no modifiers.
        if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          var id = lb.id || (lb._scnId || (lb._scnId = 'lb' + Math.random()))
          var ta = listboxTypeahead[id] || (listboxTypeahead[id] = { str: '', t: null })
          ta.str += e.key.toLowerCase()
          if (ta.t) clearTimeout(ta.t)
          ta.t = setTimeout(function () { ta.str = '' }, 500)
          for (var i = 1; i <= opts.length; i++) {
            var cand = opts[(idx + i) % opts.length]
            if ((cand.textContent || '').trim().toLowerCase().indexOf(ta.str) === 0) {
              listboxRoveTo(lb, cand)
              if (!multi) { listboxSelectOnly(lb, cand); listboxSync(lb) }
              break
            }
          }
        }
      })
      // Click selection (and Shift+Click range for multi-select).
      document.addEventListener('click', function (e) {
        var opt = e.target.closest && e.target.closest('[role="option"]')
        if (!opt || opt.getAttribute('aria-disabled') === 'true') return
        var lb = opt.closest('[data-slot="listbox"]')
        if (!lb || lb.getAttribute('aria-disabled') === 'true') return
        var multi = lb.getAttribute('aria-multiselectable') === 'true'
        var opts = listboxOptions(lb)
        var idx = opts.indexOf(opt)
        listboxRoveTo(lb, opt)
        if (multi) {
          if (e.shiftKey && lb._scnAnchor != null) {
            listboxRange(lb, lb._scnAnchor, idx)
          } else {
            listboxToggle(opt)
            lb._scnAnchor = idx
          }
        } else {
          listboxSelectOnly(lb, opt)
        }
        listboxSync(lb)
      })
      // Prevent text selection on Shift+Click in multi-select listboxes.
      document.addEventListener('mousedown', function (e) {
        var opt = e.target.closest && e.target.closest('[role="option"]')
        if (!opt) return
        var lb = opt.closest('[data-slot="listbox"][aria-multiselectable="true"]')
        if (lb && e.shiftKey) e.preventDefault()
      })
  })();

  ;(function () {
    // Menubar (registry/ui/menubar.tsx).
      //
      // Composite widget per the APG Menu and Menubar pattern
      //   repos/aria-practices/content/patterns/menubar/menu-and-menubar-pattern.html
      // Native [popover] (popovertarget + popover="auto") gives open/close, light
      // dismiss, ESC and focus restoration for each submenu — the same approach as
      // dropdown-menu. The popover carries data-side="bottom", so the existing
      // [popover][data-side] positioner above places it under its trigger. Here we
      // add the parts the platform doesn't provide:
      //   - Roving tabindex on the bar: the bar is a single tab stop; the first
      //     enabled trigger is tabindex="0", the rest -1 (APG: "in a menubar … the
      //     first item has tabindex 0").
      //   - ArrowLeft/Right move along the bar (wrapping); Home/End jump.
      //   - ArrowDown (also Enter/Space) opens the focused menu and focuses its
      //     first item; ArrowUp opens it and focuses the last item.
      //   - Inside a menu: ArrowUp/Down cycle, Home/End jump, type-ahead, and
      //     ArrowLeft/Right close the current menu and hop to the adjacent bar
      //     menu (APG Left/Right Arrow in a submenu of a menubar item).
      //   - aria-expanded on each trigger reflects its submenu's open state.
      //   - Clicking a leaf item closes the menu (APG: items perform an action +
      //     close the menu).
      document.querySelectorAll('[data-slot="menubar"]').forEach(function (bar) {
        var triggers = function () {
          return [].slice.call(
            bar.querySelectorAll('[data-slot="menubar-trigger"]:not([disabled])'),
          )
        }
        var ts = triggers()
        ts.forEach(function (t, i) { t.setAttribute('tabindex', i === 0 ? '0' : '-1') })
        var menuOf = function (trig) {
          return document.getElementById(trig.getAttribute('data-menu-for'))
        }
        var roll = function (target) {
          triggers().forEach(function (t) { t.setAttribute('tabindex', '-1') })
          target.setAttribute('tabindex', '0')
          target.focus()
        }
        bar.addEventListener('keydown', function (e) {
          var trig = e.target.closest && e.target.closest('[data-slot="menubar-trigger"]')
          if (!trig) return
          var list = triggers()
          var i = list.indexOf(trig)
          if (e.key === 'ArrowRight') { e.preventDefault(); roll(list[(i + 1) % list.length]) }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); roll(list[(i - 1 + list.length) % list.length]) }
          else if (e.key === 'Home') { e.preventDefault(); roll(list[0]) }
          else if (e.key === 'End') { e.preventDefault(); roll(list[list.length - 1]) }
          else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
            var menu = menuOf(trig)
            if (!menu || typeof menu.showPopover !== 'function') return
            e.preventDefault()
            if (!menu.matches(':popover-open')) menu.showPopover()
            var items = [].slice.call(
              menu.querySelectorAll('[role="menuitem"]:not([data-disabled="true"])'),
            )
            if (items.length) {
              var pick = e.key === 'ArrowUp' ? items.length - 1 : 0
              setTimeout(function () { items[pick].focus() }, 0)
            }
          }
        })
        // Reflect submenu open/closed state onto the parent trigger.
        bar.querySelectorAll('[data-slot="menubar-content"]').forEach(function (menu) {
          menu.addEventListener('toggle', function (e) {
            var trig = bar.querySelector('[data-menu-for="' + CSS.escape(menu.id) + '"]')
            if (trig) trig.setAttribute('aria-expanded', e.newState === 'open' ? 'true' : 'false')
          })
        })
      })
      // Inside a submenu: cycle items, type-ahead, and hop between bar menus.
      document.addEventListener('keydown', function (e) {
        var item = e.target.closest && e.target.closest('[data-slot="menubar-content"] [role="menuitem"]')
        if (!item) return
        var menu = item.closest('[data-slot="menubar-content"]')
        if (!menu) return
        var bar = menu.closest('[data-slot="menubar"]')
        if (!bar) return
        var items = [].slice.call(
          menu.querySelectorAll('[role="menuitem"]:not([data-disabled="true"])'),
        )
        var i = items.indexOf(item)
        var bars = [].slice.call(
          bar.querySelectorAll('[data-slot="menubar-trigger"]:not([disabled])'),
        )
        var trig = bar.querySelector('[data-menu-for="' + CSS.escape(menu.id) + '"]')
        var bi = bars.indexOf(trig)
        var hop = function (dir) {
          if (typeof menu.hidePopover === 'function') menu.hidePopover()
          var next = bars[(bi + dir + bars.length) % bars.length]
          bars.forEach(function (t) { t.setAttribute('tabindex', '-1') })
          next.setAttribute('tabindex', '0')
          var nm = document.getElementById(next.getAttribute('data-menu-for'))
          if (nm && typeof nm.showPopover === 'function') {
            nm.showPopover()
            var ni = [].slice.call(
              nm.querySelectorAll('[role="menuitem"]:not([data-disabled="true"])'),
            )
            if (ni.length) setTimeout(function () { ni[0].focus() }, 0)
          } else {
            next.focus()
          }
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus() }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus() }
        else if (e.key === 'Home') { e.preventDefault(); items[0].focus() }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus() }
        else if (e.key === 'ArrowRight') { e.preventDefault(); hop(1) }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); hop(-1) }
        else if (
          e.key.length === 1 &&
          /\S/.test(e.key) &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          var ch = e.key.toLowerCase()
          for (var k = 1; k <= items.length; k++) {
            var cand = items[(i + k) % items.length]
            if ((cand.textContent || '').trim().toLowerCase().startsWith(ch)) {
              cand.focus()
              break
            }
          }
        }
      })
      // Click a leaf item closes its menu.
      document.addEventListener('click', function (e) {
        var item = e.target.closest && e.target.closest('[data-slot="menubar-item"]')
        if (!item || item.getAttribute('data-disabled') === 'true') return
        var menu = item.closest('[data-slot="menubar-content"]')
        if (menu && typeof menu.hidePopover === 'function') menu.hidePopover()
      })
  })();

  ;(function () {
    // Tree / Tree View (registry/ui/tree.tsx).
      //
      // Web-standard nested <ul>/<li> lists wired to the WAI-ARIA APG Tree View
      // pattern. We model the keyboard contract + roving tabindex on the APG
      // example: repos/aria-practices/content/patterns/treeview/examples/js/tree.js
      // and treeitem.js. The focusable element is the <li role="treeitem"> itself;
      // exactly one node is in the tab sequence (tabindex="0"), the rest -1. An
      // inline boot script next to each tree seeds that initial state before paint;
      // here we own the live contract, delegated on document so htmx-swapped
      // subtrees pick it up for free.
      //
      // Keyboard (APG):
      //   Down/Up  — move focus between VISIBLE nodes (skips collapsed branches)
      //   Right    — closed parent: open it (focus stays); open parent: focus first
      //              child; end node: nothing
      //   Left     — open parent: close it; otherwise focus the parent node
      //   Home/End — first / last visible node
      //   Enter/Space — select the node (and toggle a parent's open state)
      //   *        — expand all sibling parents at the focused node's level
      //   a-z      — type-ahead: focus the next visible node whose label starts
      //              with the typed character (wraps)
      var scnTreeVisibleItems = function (tree) {
        return [].slice
          .call(tree.querySelectorAll('[role="treeitem"]'))
          .filter(function (it) {
            var p = it.parentElement
            while (p && p !== tree) {
              if (p.getAttribute && p.getAttribute('role') === 'group') {
                var owner = p.closest('[role="treeitem"]')
                if (owner && owner.getAttribute('aria-expanded') === 'false') return false
              }
              p = p.parentElement
            }
            return true
          })
      }
      var scnTreeFocusItem = function (tree, item) {
        tree.querySelectorAll('[role="treeitem"]').forEach(function (it) {
          it.setAttribute('tabindex', it === item ? '0' : '-1')
        })
        item.focus()
      }
      var scnTreeChildGroup = function (item) {
        var el = item.firstElementChild
        while (el) {
          if (el.getAttribute && el.getAttribute('role') === 'group') return el
          el = el.nextElementSibling
        }
        return null
      }
      var scnTreeSelect = function (tree, item) {
        tree
          .querySelectorAll('[role="treeitem"][aria-selected="true"]')
          .forEach(function (n) { n.setAttribute('aria-selected', 'false') })
        item.setAttribute('aria-selected', 'true')
      }
      document.addEventListener('keydown', function (e) {
        var item = e.target.closest && e.target.closest('[role="treeitem"]')
        if (!item) return
        var tree = item.closest('[data-slot="tree"]')
        if (!tree) return
        if (item.getAttribute('aria-disabled') === 'true') return
        var isParent = item.hasAttribute('aria-expanded')
        var open = item.getAttribute('aria-expanded') === 'true'
        var vis = scnTreeVisibleItems(tree)
        var idx = vis.indexOf(item)
        var key = e.key
        if (key === 'ArrowDown') {
          e.preventDefault()
          if (idx > -1 && idx < vis.length - 1) scnTreeFocusItem(tree, vis[idx + 1])
        } else if (key === 'ArrowUp') {
          e.preventDefault()
          if (idx > 0) scnTreeFocusItem(tree, vis[idx - 1])
        } else if (key === 'Home') {
          e.preventDefault()
          if (vis.length) scnTreeFocusItem(tree, vis[0])
        } else if (key === 'End') {
          e.preventDefault()
          if (vis.length) scnTreeFocusItem(tree, vis[vis.length - 1])
        } else if (key === 'ArrowRight') {
          e.preventDefault()
          if (isParent && !open) {
            item.setAttribute('aria-expanded', 'true')
          } else if (isParent && open) {
            var g = scnTreeChildGroup(item)
            var first = g && g.querySelector('[role="treeitem"]')
            if (first) scnTreeFocusItem(tree, first)
          }
        } else if (key === 'ArrowLeft') {
          e.preventDefault()
          if (isParent && open) {
            item.setAttribute('aria-expanded', 'false')
          } else {
            var parent = item.parentElement.closest('[role="treeitem"]')
            if (parent && tree.contains(parent)) scnTreeFocusItem(tree, parent)
          }
        } else if (key === 'Enter' || key === ' ') {
          e.preventDefault()
          scnTreeSelect(tree, item)
          if (isParent) item.setAttribute('aria-expanded', open ? 'false' : 'true')
        } else if (key === '*') {
          e.preventDefault()
          var sibs = item.parentElement.children
          for (var i = 0; i < sibs.length; i++) {
            if (sibs[i].hasAttribute && sibs[i].hasAttribute('aria-expanded')) {
              sibs[i].setAttribute('aria-expanded', 'true')
            }
          }
        } else if (
          key.length === 1 &&
          /\S/.test(key) &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          var ch = key.toLowerCase()
          for (var j = 1; j <= vis.length; j++) {
            var cand = vis[(idx + j) % vis.length]
            var lbl = cand.querySelector('[data-slot="tree-label"]')
            var text = ((lbl ? lbl.textContent : cand.textContent) || '')
              .trim()
              .toLowerCase()
            if (text.indexOf(ch) === 0) {
              scnTreeFocusItem(tree, cand)
              break
            }
          }
        }
      })
      // Click on a node's label: toggle a parent open/closed, select the node, and
      // make it the roving-tabindex owner so a later Tab away + back returns here.
      document.addEventListener('click', function (e) {
        var label = e.target.closest && e.target.closest('[data-slot="tree-label"]')
        if (!label) return
        var item = label.closest('[role="treeitem"]')
        var tree = item && item.closest('[data-slot="tree"]')
        if (!tree || item.getAttribute('aria-disabled') === 'true') return
        if (item.hasAttribute('aria-expanded')) {
          item.setAttribute(
            'aria-expanded',
            item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
          )
        }
        scnTreeSelect(tree, item)
        scnTreeFocusItem(tree, item)
      })
  })();

  ;(function () {
    // Carousel (registry/ui/carousel.tsx).
      //
      // The slideshow is native: CSS scroll-snap (snap-x snap-mandatory; each slide
      // snap-center) handles touch/trackpad/wheel scrolling and keeps slides
      // aligned with zero JS. The APG carousel pattern's Basic style only needs us
      // to script the Prev/Next buttons (see
      // repos/aria-practices/content/patterns/carousel/carousel-pattern.html and
      // examples/carousel-1-prev-next.html): advance by exactly one slide and
      // disable each button at the matching end of the track.
      //
      // We scroll the content region by one slide width via Element.scrollBy()
      // (repos/mdn/files/en-us/web/api/element/scrollby/index.md). Activating a
      // Prev/Next button does NOT move focus (APG note), so a keyboard user can
      // repeatedly press Enter/Space to keep advancing.
      var carouselSlideStep = function (content) {
        var item = content.querySelector('[data-slot="carousel-item"]')
        if (!item) return content.clientWidth
        var styles = getComputedStyle(content)
        var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0
        return item.getBoundingClientRect().width + gap
      }
      var carouselSyncDisabled = function (root, content) {
        var prev = root.querySelector('[data-carousel-prev]')
        var next = root.querySelector('[data-carousel-next]')
        var max = content.scrollWidth - content.clientWidth
        // 1px slack absorbs sub-pixel rounding so the ends register reliably.
        if (prev) prev.disabled = content.scrollLeft <= 1
        if (next) next.disabled = content.scrollLeft >= max - 1
      }
      document.querySelectorAll('[data-slot="carousel"]').forEach(function (root) {
        if (root._scnCarouselBound) return
        var content = root.querySelector('[data-slot="carousel-content"]')
        if (!content) return
        root._scnCarouselBound = true
        root.querySelectorAll('[data-carousel-prev]').forEach(function (b) {
          b.addEventListener('click', function () {
            content.scrollBy({ left: -carouselSlideStep(content), behavior: 'smooth' })
          })
        })
        root.querySelectorAll('[data-carousel-next]').forEach(function (b) {
          b.addEventListener('click', function () {
            content.scrollBy({ left: carouselSlideStep(content), behavior: 'smooth' })
          })
        })
        content.addEventListener('scroll', function () {
          window.requestAnimationFrame(function () { carouselSyncDisabled(root, content) })
        }, { passive: true })
        window.addEventListener('resize', function () { carouselSyncDisabled(root, content) })
        carouselSyncDisabled(root, content)
      })
  })();

  ;(function () {
    // Feed (registry/ui/feed.tsx).
      //
      // A feed is a STRUCTURE, not a widget — the feed role has no native desktop
      // equivalent, so the WAI-ARIA APG only RECOMMENDS these keys (author-optional):
      //   repos/aria-practices/content/patterns/feed/feed-pattern.html (Keyboard Interaction)
      //   repos/aria-practices/content/patterns/feed/examples/js/feed.js (reference impl)
      //
      // When focus is inside the feed:
      //   - Page Down  -> next article
      //   - Page Up    -> previous article
      //   - Ctrl+Home  -> first article in the feed
      //   - Ctrl+End   -> first focusable element AFTER the feed (leave the feed)
      // Articles are ordered by aria-posinset, matching the APG example which
      // indexes feedItems by aria-posinset (1-based). The platform gives us
      // nothing here (the role is reading-mode structure), so this is the minimal
      // JS the APG contract needs.
      var feedFocusables =
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
        'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      var feedArticlesOf = function (feed) {
        var list = [].slice.call(feed.querySelectorAll('[data-slot="feed-article"]'))
        // Sort by aria-posinset so navigation order matches the feed contract even
        // if the DOM order is ever disturbed.
        list.sort(function (a, b) {
          return (
            (parseInt(a.getAttribute('aria-posinset'), 10) || 0) -
            (parseInt(b.getAttribute('aria-posinset'), 10) || 0)
          )
        })
        return list
      }
      // First focusable element after the feed in document order (Ctrl+End target).
      var firstFocusableAfter = function (feed) {
        var all = [].slice.call(document.querySelectorAll(feedFocusables))
        for (var i = 0; i < all.length; i++) {
          var el = all[i]
          if (feed.contains(el)) continue
          // 4 === Node.DOCUMENT_POSITION_FOLLOWING: el comes after the feed.
          if (feed.compareDocumentPosition(el) & 4) return el
        }
        return null
      }
      document.addEventListener('keydown', function (e) {
        if (
          e.key !== 'PageDown' &&
          e.key !== 'PageUp' &&
          !(e.key === 'Home' && e.ctrlKey) &&
          !(e.key === 'End' && e.ctrlKey)
        ) {
          return
        }
        var target = e.target
        if (!target || !target.closest) return
        var feed = target.closest('[data-slot="feed"]')
        if (!feed) return
        var article = target.closest('[data-slot="feed-article"]')
        var articles = feedArticlesOf(feed)
        if (!articles.length) return
        var idx = article ? articles.indexOf(article) : -1
    
        if (e.key === 'PageDown') {
          e.preventDefault()
          var next = idx < 0 ? articles[0] : articles[idx + 1]
          if (next) next.focus()
        } else if (e.key === 'PageUp') {
          e.preventDefault()
          var prev = idx <= 0 ? articles[0] : articles[idx - 1]
          if (prev) prev.focus()
        } else if (e.key === 'Home') {
          // Ctrl+Home -> first article in the feed.
          e.preventDefault()
          articles[0].focus()
        } else if (e.key === 'End') {
          // Ctrl+End -> first focusable element after the feed (leave it).
          e.preventDefault()
          var after = firstFocusableAfter(feed)
          if (after) after.focus()
          else feed.blur()
        }
      })
  })();

  ;(function () {
    // Grid (registry/ui/grid.tsx).
      //
      // An interactive data grid: role="grid" on a real <table>, a SINGLE tab
      // stop with 2-D arrow-key navigation via a roving tabindex. We model the
      // focus management on the APG data-grid reference implementation:
      //   repos/aria-practices/content/patterns/grid/grid-pattern.html
      //   repos/aria-practices/content/patterns/grid/examples/js/dataGrid.js
      //     (setupFocusGrid / setFocusPointer / getNextCell / checkFocusChange)
      //
      // Data-grid keyboard contract (no wrapping — wrapping is a layout-grid
      // option the APG warns is disorienting for data grids):
      //   - Arrow keys move focus one cell; movement clamps at the grid edges.
      //   - Home / End -> first / last cell in the current row.
      //   - Ctrl+Home / Ctrl+End -> first cell of first row / last cell of last.
      // An inline boot <script> next to each grid set the initial roving
      // tabindex before paint; here we own the live key handling. We key off
      // [data-grid-cell]: each is either focusable itself (text cell) or wraps a
      // single widget (e.g. a link) which we focus instead — APG "whether to
      // focus a cell or an element inside it".
      var gridCellsByRow = function (grid) {
        return [].slice
          .call(grid.querySelectorAll('tr, [role="row"]'))
          .map(function (row) {
            return [].slice.call(row.querySelectorAll('[data-grid-cell]'))
          })
          .filter(function (cells) {
            return cells.length
          })
      }
      var gridFocusTarget = function (cell) {
        // If the cell holds a single focusable widget (link/button/input), focus
        // that; otherwise focus the cell itself.
        var widget = cell.querySelector('a[href], button, input, select, textarea, [tabindex]')
        return widget || cell
      }
      var rollGridFocus = function (grid, cell) {
        grid.querySelectorAll('[data-grid-cell]').forEach(function (c) {
          c.setAttribute('tabindex', '-1')
          c.removeAttribute('data-grid-active')
        })
        cell.setAttribute('tabindex', '0')
        cell.setAttribute('data-grid-active', 'true')
        gridFocusTarget(cell).focus()
      }
      document.addEventListener('keydown', function (e) {
        var cell = e.target.closest && e.target.closest('[data-grid-cell]')
        if (!cell) return
        var grid = cell.closest('[data-slot="grid"]')
        if (!grid) return
        var keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
        if (keys.indexOf(e.key) === -1) return
        var rows = gridCellsByRow(grid)
        if (!rows.length) return
        // Locate the focused cell in the 2-D map.
        var r = -1
        var col = -1
        for (var i = 0; i < rows.length; i++) {
          var ci = rows[i].indexOf(cell)
          if (ci !== -1) {
            r = i
            col = ci
            break
          }
        }
        if (r === -1) return
        e.preventDefault()
        var lastRow = rows.length - 1
        if (e.key === 'ArrowUp') r = Math.max(0, r - 1)
        else if (e.key === 'ArrowDown') r = Math.min(lastRow, r + 1)
        else if (e.key === 'ArrowLeft') col = Math.max(0, col - 1)
        else if (e.key === 'ArrowRight') col = Math.min(rows[r].length - 1, col + 1)
        else if (e.key === 'Home') {
          if (e.ctrlKey || e.metaKey) r = 0
          col = 0
        } else if (e.key === 'End') {
          if (e.ctrlKey || e.metaKey) r = lastRow
          col = rows[r].length - 1
        }
        // Clamp the column to the (possibly ragged) target row.
        col = Math.min(col, rows[r].length - 1)
        var next = rows[r][col]
        if (next) rollGridFocus(grid, next)
      })
      // Clicking a cell makes it the roving-tabindex owner, so a later Tab away +
      // Shift+Tab back returns to the last-used cell (dataGrid.js focusClickedCell).
      document.addEventListener('click', function (e) {
        var cell = e.target.closest && e.target.closest('[data-grid-cell]')
        if (!cell) return
        var grid = cell.closest('[data-slot="grid"]')
        if (!grid) return
        grid.querySelectorAll('[data-grid-cell]').forEach(function (c) {
          var on = c === cell
          c.setAttribute('tabindex', on ? '0' : '-1')
          if (on) c.setAttribute('data-grid-active', 'true')
          else c.removeAttribute('data-grid-active')
        })
      })
  })();

  ;(function () {
    // Treegrid (registry/ui/treegrid.tsx).
      //
      // role="treegrid" on a native <table>: rows expand/collapse like a tree
      // (aria-expanded + aria-level on the <tr>) and cells navigate like a grid.
      // This is a faithful port of the WAI-ARIA APG example's keyboard model —
      // the "rows focused first, but cells can be focused" variant
      // (doAllowRowFocus=true, doStartRowFocus=true):
      //   repos/aria-practices/content/patterns/treegrid/treegrid-pattern.html
      //   repos/aria-practices/content/patterns/treegrid/examples/js/treegrid-1.js
      //
      // The inline boot <script> next to each table already set the roving
      // tabindex (first row tabindex="0", the rest -1; widgets inside rows -1).
      // Here we own the live contract:
      //   - Down/Up: move by row (when a row is focused) or by cell.
      //   - Right: on a collapsed row -> expand; on an expanded/leaf row -> step
      //     into the first cell; on a cell -> move one cell right (clamped).
      //   - Left: on an expanded row -> collapse; on a collapsed row -> move to
      //     the parent row; on the first cell -> focus the row; else one cell left.
      //   - Home/End: first/last cell in row (or first/last row when a row is
      //     focused). Ctrl+Home/Ctrl+End: first/last row, same column.
      //   - Enter: toggle expansion when the row/first cell controls children.
      // Collapse hides descendant rows with the native `hidden` attribute, which
      // drops them from layout AND the accessibility tree.
      (function () {
        var tabindexable = 'a,button,input,[tabindex]'
    
        function rowsOf(grid) {
          return [].slice.call(grid.querySelectorAll('tbody > tr[role="row"]'))
        }
        function visibleRowsOf(grid) {
          return rowsOf(grid).filter(function (r) { return !r.hidden })
        }
        function cellsOf(row) {
          return [].slice.call(row.querySelectorAll(':scope > td'))
        }
        function focusableIn(cell) {
          return cell.querySelector(tabindexable)
        }
        function level(row) { return parseInt(row.getAttribute('aria-level'), 10) || 1 }
        function isExpandable(row) { return row.hasAttribute('aria-expanded') }
        function isExpanded(row) { return row.getAttribute('aria-expanded') === 'true' }
    
        function rowWithFocus(grid) {
          var el = document.activeElement
          while (el && el !== grid) {
            if (el.localName === 'tr') return el
            el = el.parentElement
          }
          return null
        }
        function cellWithFocus(row) {
          if (!row) return null
          var el = document.activeElement
          while (el && el !== row) {
            if (el.localName === 'td') return el
            el = el.parentElement
          }
          return null
        }
        function rowIsFocused(grid) {
          var row = rowWithFocus(grid)
          return row && row === document.activeElement
        }
        function isEditableFocused() {
          var el = document.activeElement
          return el && el.localName === 'input'
        }
    
        // Roving tabindex: only the active row (and the active widgets inside it)
        // stay in the tab sequence. Mirrors onFocusIn() in the APG example.
        function setActiveRow(grid, row) {
          rowsOf(grid).forEach(function (r) {
            r.setAttribute('tabindex', r === row ? '0' : '-1')
            focusableInRow(r).forEach(function (f) {
              f.setAttribute('tabindex', r === row ? '0' : '-1')
            })
          })
        }
        function focusableInRow(row) {
          return [].slice.call(row.querySelectorAll(tabindexable))
        }
        function focusRow(grid, row) {
          setActiveRow(grid, row)
          row.focus()
        }
        function focusCell(grid, cell) {
          var row = cell.closest('tr[role="row"]')
          setActiveRow(grid, row)
          var widget = focusableIn(cell)
          if (widget) { widget.setAttribute('tabindex', '0'); widget.focus() }
          else { cell.setAttribute('tabindex', '0'); cell.focus() }
        }
    
        function clampIndex(i, n) { return i < 0 ? 0 : i >= n ? n - 1 : i }
    
        // Show/hide descendant rows to reflect a row's expanded state, exactly
        // like changeExpanded() in the APG example but using `hidden`.
        function changeExpanded(grid, row, doExpand) {
          if (!row || !isExpandable(row)) return false
          var all = rowsOf(grid)
          var start = all.indexOf(row)
          var curLevel = level(row)
          var show = []
          show[curLevel + 1] = doExpand
          var changed = false
          for (var i = start + 1; i < all.length; i++) {
            var next = all[i]
            var lv = level(next)
            if (lv <= curLevel) break
            show[lv + 1] = show[lv] && (isExpandable(next) ? isExpanded(next) : false)
            var willHide = !show[lv]
            if (willHide !== next.hidden) { next.hidden = willHide; changed = true }
          }
          row.setAttribute('aria-expanded', doExpand ? 'true' : 'false')
          return changed || true
        }
    
        function moveByRow(grid, dir, requireLevelChange) {
          var rows = visibleRowsOf(grid)
          var cur = rowWithFocus(grid)
          var idx = cur ? rows.indexOf(cur) : -1
          var wantLevel = requireLevelChange && cur ? level(cur) + dir : null
          var max = requireLevelChange && dir === 1 ? 1 : Infinity
          do {
            if (max-- === 0) return
            idx = clampIndex(idx + dir, rows.length)
          } while (wantLevel !== null && wantLevel !== level(rows[idx]))
          if (!sameColInRow(grid, cur, rows[idx])) focusRow(grid, rows[idx])
        }
        function sameColInRow(grid, fromRow, toRow) {
          var col = cellWithFocus(fromRow)
          if (!col) return false
          var fromCols = cellsOf(fromRow)
          var ci = fromCols.indexOf(col)
          if (ci < 0) return false
          focusCell(grid, cellsOf(toRow)[ci])
          return true
        }
        function moveByCol(grid, dir) {
          var row = rowWithFocus(grid)
          if (!row) return
          var cols = cellsOf(row)
          var col = cellWithFocus(row)
          var ci = cols.indexOf(col)
          var ni = col || dir < 0 ? ci + dir : 0
          if (ni < 0) { focusRow(grid, row); return } // left of first cell -> row
          focusCell(grid, cols[clampIndex(ni, cols.length)])
        }
        function moveToExtreme(grid, dir) {
          var row = rowWithFocus(grid)
          if (!row) return
          if (cellWithFocus(row)) {
            var cols = cellsOf(row)
            focusCell(grid, cols[dir < 0 ? 0 : cols.length - 1])
          } else {
            var rows = visibleRowsOf(grid)
            focusRow(grid, rows[dir < 0 ? 0 : rows.length - 1])
          }
        }
        function moveToExtremeRow(grid, dir) {
          var rows = visibleRowsOf(grid)
          var to = rows[dir > 0 ? rows.length - 1 : 0]
          if (!sameColInRow(grid, rowWithFocus(grid), to)) focusRow(grid, to)
        }
        function doPrimaryAction(grid) {
          var row = rowWithFocus(grid)
          if (!row) return
          // Toggle when the row (or its first cell) is the expand control.
          var col = cellWithFocus(row)
          if ((!col || col === cellsOf(row)[0]) && isExpandable(row)) {
            changeExpanded(grid, row, !isExpanded(row))
          }
        }
    
        document.addEventListener('keydown', function (e) {
          var grid = e.target.closest && e.target.closest('[data-slot="treegrid"]')
          if (!grid) return
          var mods = e.ctrlKey + e.altKey + e.shiftKey + e.metaKey
          if (mods > 1) return
          var ctrl = mods === 1 && e.ctrlKey
          if (mods === 1 && !e.ctrlKey) return
          var handled = true
          switch (e.key) {
            case 'ArrowDown': moveByRow(grid, 1); break
            case 'ArrowUp': moveByRow(grid, -1); break
            case 'ArrowRight':
              if (isEditableFocused()) return
              if (!rowIsFocused(grid)) { moveByCol(grid, 1) }
              else if (!isExpanded(rowWithFocus(grid)) && changeExpanded(grid, rowWithFocus(grid), true)) { /* expanded */ }
              else { moveByCol(grid, 1) }
              break
            case 'ArrowLeft':
              if (isEditableFocused()) return
              if (rowIsFocused(grid)) {
                var r = rowWithFocus(grid)
                if (isExpandable(r) && isExpanded(r)) changeExpanded(grid, r, false)
                else moveByRow(grid, -1, true) // collapsed/leaf -> parent row
              } else { moveByCol(grid, -1) }
              break
            case 'Home':
              if (isEditableFocused()) return
              ctrl ? moveToExtremeRow(grid, -1) : moveToExtreme(grid, -1)
              break
            case 'End':
              if (isEditableFocused()) return
              ctrl ? moveToExtremeRow(grid, 1) : moveToExtreme(grid, 1)
              break
            case 'Enter': doPrimaryAction(grid); break
            default: handled = false
          }
          if (handled) e.preventDefault()
        })
    
        // Click on the first cell of an expandable row toggles it (the chevron is
        // a decorative SVG, so the whole first cell is the affordance).
        document.addEventListener('click', function (e) {
          var grid = e.target.closest && e.target.closest('[data-slot="treegrid"]')
          if (!grid) return
          if (e.target.closest('a,button,input')) return // let real widgets act
          var cell = e.target.closest('td[data-slot="treegrid-cell"]')
          if (!cell) return
          var row = cell.closest('tr[role="row"]')
          if (!row || !isExpandable(row) || cell !== cellsOf(row)[0]) return
          changeExpanded(grid, row, !isExpanded(row))
        })
      })()
  })();

  ;(function () {
    // Splitter / window splitter (registry/ui/splitter.tsx).
      //
      // The divider is a focusable role="separator" widget. The platform gives us
      // nothing here, so this owns the WAI-ARIA Window Splitter contract:
      //   repos/aria-practices/content/patterns/windowsplitter/windowsplitter-pattern.html
      //   - pointer drag updates the primary pane's size.
      //   - ArrowLeft/Right (or Up/Down when vertical) resize by `step`.
      //   - Home -> aria-valuemin (collapse primary), End -> aria-valuemax (expand).
      //   - Enter toggles collapse: drops to min, then restores the previous
      //     position (APG: "If the primary pane is not collapsed, collapses the
      //     pane. If the pane is collapsed, restores the splitter to its previous
      //     position.").
      // We write --split (a percentage) on the root, which sizes the first grid
      // track, and keep aria-valuenow + data-collapsed in sync. The min/max/step
      // come from data-* on the handle so there's no per-instance config.
      document.querySelectorAll('[data-slot="splitter"]').forEach(function (root) {
        var handle = root.querySelector('[data-slot="splitter-handle"]')
        if (!handle || handle._scnSplit) return
        handle._scnSplit = true
        var min = +handle.getAttribute('data-min') || 0
        var max = +handle.getAttribute('data-max')
        if (isNaN(max)) max = 100
        var step = +handle.getAttribute('data-step') || 10
        var vertical = handle.getAttribute('data-orientation') === 'vertical'
        var clamp = function (v) { return Math.min(max, Math.max(min, v)) }
        var current = function () { return +handle.getAttribute('aria-valuenow') || 0 }
        var apply = function (v) {
          v = clamp(Math.round(v))
          root.style.setProperty('--split', v + '%')
          handle.setAttribute('aria-valuenow', v)
          handle.setAttribute('data-collapsed', v <= min ? 'true' : 'false')
        }
        handle.addEventListener('pointerdown', function (e) {
          // Only primary button / touch / pen.
          if (e.button !== undefined && e.button !== 0) return
          e.preventDefault()
          handle.focus()
          handle.setPointerCapture(e.pointerId)
          var move = function (ev) {
            var r = root.getBoundingClientRect()
            var pct = vertical
              ? ((ev.clientY - r.top) / (r.height || 1)) * 100
              : ((ev.clientX - r.left) / (r.width || 1)) * 100
            apply(pct)
          }
          var up = function () {
            handle.removeEventListener('pointermove', move)
            handle.removeEventListener('pointerup', up)
          }
          handle.addEventListener('pointermove', move)
          handle.addEventListener('pointerup', up)
        })
        handle.addEventListener('keydown', function (e) {
          var dec = vertical ? 'ArrowUp' : 'ArrowLeft'
          var inc = vertical ? 'ArrowDown' : 'ArrowRight'
          if (e.key === dec) { e.preventDefault(); apply(current() - step) }
          else if (e.key === inc) { e.preventDefault(); apply(current() + step) }
          else if (e.key === 'Home') { e.preventDefault(); apply(min) }
          else if (e.key === 'End') { e.preventDefault(); apply(max) }
          else if (e.key === 'Enter') {
            e.preventDefault()
            if (handle.getAttribute('data-collapsed') === 'true') {
              // Restore to the position recorded before collapse.
              apply(+handle.getAttribute('data-prev') || Math.round((min + max) / 2))
            } else {
              handle.setAttribute('data-prev', current())
              apply(min)
            }
          }
        })
      })
  })();


  // ===== New components (tier-1) =====

  ;(function () {
    // (see siteJsBlock field)
  })();

  ;(function () {
    // Copy Button (registry/ui/copy-button.tsx).
      //
      // Click-to-copy via the Async Clipboard API. navigator.clipboard.writeText()
      // returns a Promise and works only in a secure context (HTTPS / localhost)
      // from a focused window — repos/mdn/files/en-us/web/api/clipboard/writetext/.
      // When the API is missing we fall back to web.dev's recipe: a throwaway,
      // off-screen <textarea> + document.execCommand('copy') —
      // repos/web.dev/src/site/content/en/patterns/clipboard/copy-text/.
      // On success we set data-copied="true" for a beat (CSS swaps the glyph for a
      // check) and write the copied label into the EMPTY aria-live region so AT
      // announces it without moving focus —
      // repos/mdn/files/en-us/web/accessibility/aria/reference/attributes/aria-live/.
      // Delegated on document so htmx-swapped copy buttons work with zero rebinding.
      ;(function () {
        var COPIED_MS = 2000
        var copyTextFor = function (btn) {
          var targetId = btn.getAttribute('data-copy-target')
          if (targetId) {
            var el = document.getElementById(targetId)
            if (el) {
              return 'value' in el && el.value != null ? el.value : (el.textContent || '')
            }
          }
          return btn.getAttribute('data-copy-text') || ''
        }
        var legacyCopy = function (text) {
          var ta = document.createElement('textarea')
          ta.value = text
          ta.setAttribute('readonly', '')
          ta.style.position = 'fixed'
          ta.style.top = '0'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.focus()
          ta.select()
          var ok = false
          try { ok = document.execCommand('copy') } catch (e) { ok = false }
          document.body.removeChild(ta)
          return ok
        }
        var flashCopied = function (btn) {
          var copied = btn.getAttribute('data-copied-label') || 'Copied'
          var status = btn.querySelector('[data-copy-status]')
          var label = btn.querySelector('[data-copy-label]')
          var prevLabel = label ? label.textContent : null
          btn.setAttribute('data-copied', 'true')
          if (label) label.textContent = copied
          // Write into the empty live region so it is announced as a change.
          if (status) status.textContent = copied
          if (btn._scnCopyTimer) clearTimeout(btn._scnCopyTimer)
          btn._scnCopyTimer = setTimeout(function () {
            btn.removeAttribute('data-copied')
            if (label && prevLabel != null) label.textContent = prevLabel
            if (status) status.textContent = ''
          }, COPIED_MS)
        }
        document.addEventListener('click', function (e) {
          var btn = e.target.closest && e.target.closest('[data-slot="copy-button"]')
          if (!btn || btn.disabled) return
          var text = copyTextFor(btn)
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(
              function () { flashCopied(btn) },
              function () { if (legacyCopy(text)) flashCopied(btn) },
            )
          } else if (legacyCopy(text)) {
            flashCopied(btn)
          }
        })
      })();
  })();

  ;(function () {
    /* NONE — Sheet needs no new site.js. It reuses the existing Dialog wiring in public/site.js verbatim: [data-dialog-trigger]/[data-dialog-target] -> .showModal(), [data-dialog-close] -> .requestClose()/.close(), the htmx after:swap promote-to-modal listener, and the dialog[data-close-on-backdrop="true"] handler (which already skips when closedby="any"). A Sheet is a <dialog data-slot="sheet" data-side="..."> — light dismiss is the native closedby="any" attribute, not JS. */
  })();

  ;(function () {
    /* No site.js needed — Hover Card is zero-JS. The Popover API interest-invoker
       mechanism (interestfor + popover="hint") provides hover/focus reveal, ESC
       dismissal, and implicit-anchor positioning natively. Nothing to add to
       public/site.js. */
  })();

  ;(function () {
    undefined
  })();

  ;(function () {
    // No site.js needed. The skip link is pure platform: a native <a href="#main">
    // revealed on :focus with CSS only (sr-only -> focus:not-sr-only). The browser
    // supplies the link role, Enter-to-activate, and the focus jump to the target.
  })();

  ;(function () {
    // Theme Toggle — shared behaviour for [data-slot="theme-toggle"].
    // Reads/writes the `theme` cookie ("system" | "light" | "dark"), toggles the
    // class-based `.dark` on <html>, and keeps "system" tracking the OS live.
    // The synchronous pre-paint script in app/layout.tsx applies the cookie value
    // BEFORE first paint (no flash); this block only handles interaction after.
    // Adapted from (not copied from) the web.dev theming patterns
    // (repos/web.dev/.../patterns/theming/theme-switch + .../color-schemes) —
    // those use localStorage; an SSR/htmx app uses a cookie so the *server* can
    // read it. Native <input type="radio"> means keyboard + selection are free.
    (function () {
      var root = document.documentElement
      var media = window.matchMedia('(prefers-color-scheme: dark)')
    
      function applyTheme(choice) {
        var dark = choice === 'dark' || (choice === 'system' && media.matches)
        root.classList.toggle('dark', dark)
        root.style.colorScheme = dark ? 'dark' : 'light'
      }
      function setCookie(choice) {
        document.cookie = 'theme=' + choice + ';path=/;max-age=31536000;samesite=lax'
      }
    
      document.querySelectorAll('[data-slot="theme-toggle"]').forEach(function (group) {
        // On change of any radio in this group, persist + reflect the new choice.
        group.addEventListener('change', function (e) {
          var t = e.target
          if (!t || t.getAttribute('data-slot') !== 'theme-toggle-item') return
          group.setAttribute('data-value', t.value)
          setCookie(t.value)
          applyTheme(t.value)
        })
      })
    
      // When the OS scheme flips, follow it only while a group is on "system".
      media.addEventListener('change', function () {
        document.querySelectorAll('[data-slot="theme-toggle"]').forEach(function (group) {
          if (group.getAttribute('data-value') === 'system') applyTheme('system')
        })
      })
    })()
  })();

})()
