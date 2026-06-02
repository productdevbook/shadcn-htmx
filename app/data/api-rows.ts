// Shared API-table rows for every /docs/<component> page.
// Each export is the props list shown in the docs page's API Reference
// section. Pulled out of the route files to keep them readable.

import type { ApiRow } from "@/app/components/api-table"

// ---- Common partials reused across components ------------------------

const CLASS_ROW: ApiRow = {
  prop: "class",
  type: "string",
  description: "Extra Tailwind classes appended to the root element.",
}

const HX_ROW: ApiRow = {
  prop: "hx-*",
  type: "any",
  description: "Any htmx attribute. Forwarded onto the underlying element.",
  source: { badge: "htmx", label: "Attribute reference", href: "https://htmx.org/reference/" },
}

const COMMON_ARIA: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name when no visible <label>.",
    source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element providing the accessible name.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "ariaDescribedby",
    type: "string",
    description: "Id of an element describing this control (announced after the name).",
    source: { badge: "MDN", label: "aria-describedby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby" },
  },
]

// ---- Forms -----------------------------------------------------------

export const BUTTON_PROPS: ApiRow[] = [
  {
    prop: "variant",
    type: ['"default"', '"secondary"', '"destructive"', '"outline"', '"ghost"', '"link"'],
    default: '"default"',
    description: "Visual style variant.",
  },
  {
    prop: "size",
    type: ['"xs"', '"sm"', '"default"', '"lg"', '"icon"', '"icon-xs"', '"icon-sm"', '"icon-lg"'],
    default: '"default"',
    description: "Size variant. icon-* sizes are square with no horizontal padding.",
  },
  {
    prop: "type",
    type: ['"button"', '"submit"', '"reset"'],
    default: '"button"',
    description: "Submit / reset semantics when nested in a form.",
    source: { badge: "MDN", label: "<button type>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#type" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the button — skipped from tab order, no click handling.",
  },
  {
    prop: "autofocus",
    type: "boolean",
    default: "false",
    description: "Focus this button on initial page load (one per document).",
  },
  {
    prop: "formaction / formenctype / formmethod / formnovalidate / formtarget",
    type: "string",
    description: "Per-button overrides for <form> attributes when this button submits.",
    source: { badge: "MDN", label: "<button> form-overrides", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#formaction" },
  },
  {
    prop: "popovertarget / popovertargetaction",
    type: "string",
    description: "Open / hide / toggle a [popover] element by id. Zero-JS popover trigger.",
    source: { badge: "MDN", label: "popovertarget", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/popovertarget" },
  },
  {
    prop: "command / commandfor",
    type: "string",
    description: "Newer Invoker API — declarative show-modal / close / show-popover / toggle-popover.",
    source: { badge: "MDN", label: "<button command>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button" },
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
    description: "Render the wrapped child instead of a <button>, merging button classes onto it. Useful to render an <a> styled like a button.",
  },
  CLASS_ROW,
  HX_ROW,
]

const FORM_FIELD_COMMON: ApiRow[] = [
  { prop: "id", type: "string", description: "Pairs the input with a <label for>." },
  { prop: "name", type: "string", description: "Form field name on submit." },
  { prop: "value", type: "string", description: "Initial value." },
  { prop: "placeholder", type: "string", description: "Placeholder text when empty." },
  { prop: "required", type: "boolean", default: "false", description: "Native HTML required for form validation." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable — unfocusable, not submitted." },
  { prop: "readonly", type: "boolean", default: "false", description: "Read-only — focusable + selectable but not editable." },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const INPUT_PROPS: ApiRow[] = [
  {
    prop: "type",
    type: ['"text"', '"email"', '"password"', '"tel"', '"url"', '"search"', '"number"', '"date"', '"datetime-local"', '"month"', '"time"', '"week"', '"color"', '"file"'],
    default: '"text"',
    description: "Native HTML input type. Drives keyboard, validation, picker UI.",
    source: { badge: "MDN", label: "<input type>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types" },
  },
  { prop: "minlength / maxlength", type: "number", description: "Character bounds for text-like types." },
  { prop: "min / max / step", type: "number | string", description: "Bounds + increment for number / range / date types." },
  { prop: "pattern", type: "string", description: "Regex the value must match for the input to be valid." },
  { prop: "autocomplete", type: "string", description: "Browser auto-fill hint (email, current-password, postal-code, etc.).",
    source: { badge: "MDN", label: "autocomplete", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete" } },
  { prop: "inputmode", type: ['"text"', '"numeric"', '"decimal"', '"tel"', '"email"', '"url"', '"search"', '"none"'], description: "Mobile keyboard hint." },
  { prop: "enterkeyhint", type: ['"done"', '"go"', '"next"', '"previous"', '"search"', '"send"', '"enter"'], description: "Mobile Enter-key label." },
  { prop: "dirname", type: "string", description: "Submit the writer's text direction (ltr/rtl) as a second form field." },
  { prop: "capture", type: ['"user"', '"environment"', "boolean"], description: "type=\"file\" only — request the OS camera." },
  { prop: "autocapitalize", type: ['"off"', '"on"', '"sentences"', '"words"', '"characters"'], description: "Mobile keyboard capitalisation hint." },
  { prop: "list", type: "string", description: "Id of a <datalist> for native suggestions." },
  ...FORM_FIELD_COMMON,
]

export const TEXTAREA_PROPS: ApiRow[] = [
  { prop: "rows", type: "number", description: "Initial visible row count (native default 2)." },
  { prop: "cols", type: "number", description: "Visible width in characters." },
  { prop: "minlength / maxlength", type: "number", description: "Length bounds." },
  { prop: "wrap", type: ['"hard"', '"soft"', '"off"'], default: '"soft"', description: "Newline handling on submit." },
  { prop: "spellcheck", type: "boolean", description: "Browser spellchecker." },
  { prop: "autocorrect", type: ['"on"', '"off"'], description: "WebKit autocorrect (Safari/iOS)." },
  { prop: "autocapitalize", type: ['"off"', '"on"', '"sentences"', '"words"', '"characters"'], description: "Mobile capitalisation hint." },
  { prop: "dirname", type: "string", description: "Submit text direction as a second form field." },
  ...FORM_FIELD_COMMON,
]

export const LABEL_PROPS: ApiRow[] = [
  { prop: "htmlFor", type: "string", description: "Id of the associated input. Renders as <label for=\"...\"> — clicking the label focuses the input." },
  { prop: "id", type: "string", description: "Set when another control needs aria-labelledby on this." },
  CLASS_ROW,
]

export const CHECKBOX_PROPS: ApiRow[] = [
  { prop: "checked", type: "boolean", description: "Controlled checked state." },
  { prop: "defaultChecked", type: "boolean", description: "Initial checked state at render." },
  { prop: "indeterminate", type: "boolean", description: "Tri-state — set via JS DOM property after mount." },
  { prop: "ariaChecked", type: ['"true"', '"false"', '"mixed"'], description: "Override aria-checked for non-native variants." },
  { prop: "ariaReadonly", type: "boolean", description: "Mark as read-only without disabling focus." },
  { prop: "ariaErrormessage", type: "string", description: "Id of a visible error message element." },
  ...FORM_FIELD_COMMON.filter((r) => !["readonly", "value", "placeholder"].includes(r.prop)),
]

export const SWITCH_PROPS: ApiRow[] = [
  { prop: "size", type: ['"default"', '"sm"'], default: '"default"', description: "Visual size variant." },
  { prop: "checked", type: "boolean", description: "Controlled checked state." },
  { prop: "ariaReadonly", type: "boolean", description: "Read-only switch — focusable but non-toggleable." },
  ...FORM_FIELD_COMMON.filter((r) => !["readonly", "value", "placeholder"].includes(r.prop)),
]

export const RADIO_GROUP_PROPS: ApiRow[] = [
  { prop: "name", type: "string", required: true, description: "Shared name attribute. All radios in the group must use it." },
  { prop: "defaultValue", type: "string", description: "Initially selected value." },
  { prop: "required", type: "boolean", description: "Set aria-required at the group level + native required on the first item." },
  { prop: "disabled", type: "boolean", description: "Disable the whole group." },
  { prop: "orientation", type: ['"horizontal"', '"vertical"'], default: '"vertical"', description: "Layout + aria-orientation." },
  { prop: "ariaErrormessage", type: "string", description: "Id of a visible error message for the group." },
  ...COMMON_ARIA,
  CLASS_ROW,
]

export const SELECT_PROPS: ApiRow[] = [
  ...FORM_FIELD_COMMON.filter((r) => !["placeholder", "readonly"].includes(r.prop)),
  { prop: "multiple", type: "boolean", default: "false", description: "Allow multi-select (renders as a listbox)." },
  { prop: "size", type: "number", default: "1", description: "Number of visible rows (>= 2 forces listbox)." },
  { prop: "autofocus", type: "boolean", description: "Focus on initial page load." },
]

export const SLIDER_PROPS: ApiRow[] = [
  { prop: "min", type: "number", default: "0", description: "Minimum value." },
  { prop: "max", type: "number", default: "100", description: "Maximum value." },
  { prop: "step", type: "number", description: "Increment per arrow press." },
  { prop: "value", type: "number", description: "Current value." },
  { prop: "ariaValuetext", type: "string", description: "Human-readable value (e.g. \"$24 per month\") for AT.",
    source: { badge: "MDN", label: "aria-valuetext", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuetext" } },
  ...FORM_FIELD_COMMON.filter((r) => !["readonly", "value", "placeholder"].includes(r.prop)),
]

// ---- Display + Feedback ---------------------------------------------

export const CARD_PROPS: ApiRow[] = [
  { prop: "as", type: ['"div"', '"article"', '"section"', '"li"', '"aside"'], default: '"div"', description: "Semantic element. Use article for self-contained content." },
  { prop: "ariaLabelledby", type: "string", description: "Id of a CardTitle inside to give the landmark an accessible name." },
  { prop: "ariaLabel", type: "string", description: "Accessible name when there's no CardTitle." },
  CLASS_ROW,
]

export const AVATAR_PROPS: ApiRow[] = [
  { prop: "src", type: "string", description: "Image URL. Omit for fallback-only avatar." },
  { prop: "alt", type: "string", description: "Image alt text. Empty for decorative." },
  { prop: "fallback", type: "string", description: "Text shown when src is missing or 404s (typically initials)." },
  { prop: "size", type: ['"sm"', '"default"', '"lg"'], default: '"default"', description: "Visual size." },
  { prop: "ariaLabel", type: "string", description: "Accessible name when src is omitted." },
  CLASS_ROW,
]

export const BADGE_PROPS: ApiRow[] = [
  { prop: "variant", type: ['"default"', '"secondary"', '"destructive"', '"outline"', '"ghost"', '"link"'], default: '"default"', description: "Visual variant." },
  { prop: "as", type: ['"span"', '"a"', '"div"', '"button"'], default: '"span"', description: "Element to render. Defaults to span (or a if href provided)." },
  { prop: "href", type: "string", description: "When set, renders as <a> and adds hover state." },
  { prop: "ariaLabel", type: "string", description: "Required for icon-only badges (e.g. \"3 unread notifications\")." },
  { prop: "asChild", type: "boolean", description: "Render child instead, merging badge classes onto it." },
  CLASS_ROW,
]

export const SEPARATOR_PROPS: ApiRow[] = [
  { prop: "orientation", type: ['"horizontal"', '"vertical"'], default: '"horizontal"', description: "Direction. Vertical needs a parent with defined height." },
  { prop: "decorative", type: "boolean", default: "true", description: "Decorative — div with no role (AT skips). Semantic — <hr> for horizontal, div+role for vertical.",
    source: { badge: "MDN", label: "role=\"separator\"", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/separator_role" } },
  CLASS_ROW,
]

export const ALERT_PROPS: ApiRow[] = [
  { prop: "variant", type: ['"default"', '"destructive"', '"success"', '"warning"', '"info"'], default: '"default"', description: "Colour variant." },
  { prop: "live", type: ['"off"', '"polite"', '"assertive"'], default: '"polite"', description: "Live-region politeness. polite = role=status, assertive = role=alert.",
    source: { badge: "MDN", label: "aria-live", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live" } },
  { prop: "role", type: ['"alert"', '"status"', '"log"', '"none"'], description: "Direct override; takes precedence over live." },
  { prop: "ariaAtomic", type: "boolean", default: "true", description: "Read the entire alert on update (vs only changed parts)." },
  CLASS_ROW,
]

export const PROGRESS_PROPS: ApiRow[] = [
  { prop: "value", type: "number", description: "Current value 0-max. Omit for indeterminate." },
  { prop: "min", type: "number", default: "0", description: "Minimum value." },
  { prop: "max", type: "number", default: "100", description: "Maximum value." },
  { prop: "ariaValuetext", type: "string", description: "Human-readable value (e.g. \"42 of 100 MB\")." },
  ...COMMON_ARIA,
  CLASS_ROW,
]

export const SKELETON_PROPS: ApiRow[] = [
  { prop: "ariaLabel", type: "string", default: '"Loading"', description: "Announced by AT while content loads. Pass a specific label (\"Loading user profile\") so multiple skeletons aren't all just \"Loading\"." },
  CLASS_ROW,
]

export const TOAST_VIEWPORT_PROPS: ApiRow[] = [
  { prop: "id", type: "string", default: '"toast-viewport"', description: "Used as hx-target by triggers." },
  { prop: "position", type: ['"top-right"', '"top-left"', '"top-center"', '"bottom-right"', '"bottom-left"', '"bottom-center"'], default: '"bottom-right"', description: "Viewport anchor." },
  { prop: "ariaLabel", type: "string", default: '"Notifications"', description: "Landmark name for the viewport region." },
  CLASS_ROW,
]

export const TOAST_PROPS: ApiRow[] = [
  { prop: "variant", type: ['"default"', '"destructive"', '"success"', '"warning"', '"info"'], default: '"default"', description: "Visual variant." },
  { prop: "duration", type: "number", default: "5000", description: "Auto-dismiss timeout in ms. 0 keeps it until user clicks the X." },
  { prop: "live", type: ['"polite"', '"assertive"'], default: '"polite"', description: "Live-region politeness." },
  { prop: "showClose", type: "boolean", default: "true", description: "Render the X close button." },
  CLASS_ROW,
]

// ---- Overlays --------------------------------------------------------

export const DIALOG_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used by DialogTrigger's dialogFor prop to open this dialog." },
  { prop: "open", type: "boolean", default: "false", description: "Pre-open at initial render (for htmx-fetched dialogs)." },
  { prop: "closeOnBackdrop", type: "boolean", default: "true", description: "Click outside the dialog box closes it." },
  { prop: "closedby", type: ['"any"', '"closerequest"', '"none"'], description: "Native HTML attribute. \"any\" = ESC + backdrop, \"closerequest\" = ESC only, \"none\" = code only.",
    source: { badge: "MDN", label: "<dialog closedby>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby" } },
  { prop: "role", type: ['"dialog"', '"alertdialog"'], default: '"dialog"', description: "alertdialog announces with higher urgency; requires aria-describedby." },
  { prop: "showCloseButton", type: "boolean", default: "true", description: "Render the X button in the top-right." },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
]

export const POPOVER_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used by PopoverTrigger's popoverTarget." },
  { prop: "mode", type: ['"auto"', '"manual"'], default: '"auto"', description: "auto = light dismiss + ESC. manual = only code can toggle.",
    source: { badge: "MDN", label: "popover attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover" } },
  { prop: "side", type: ['"top"', '"right"', '"bottom"', '"left"'], default: '"bottom"', description: "Placement relative to trigger (positioned by site.js)." },
  CLASS_ROW,
]

export const DROPDOWN_MENU_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Matches DropdownMenuTrigger's menuFor." },
  { prop: "side", type: ['"top"', '"right"', '"bottom"', '"left"'], default: '"bottom"', description: "Placement relative to trigger." },
  CLASS_ROW,
]

export const TOOLTIP_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used in the trigger's aria-describedby." },
  { prop: "content", type: "string", required: true, description: "Tooltip text. Must be plain — no buttons or links (APG)." },
  { prop: "side", type: ['"top"', '"right"', '"bottom"', '"left"'], default: '"top"', description: "Placement relative to trigger." },
  { prop: "hoverOnly", type: "boolean", default: "false", description: "Skip focus-reveal. Use only when keyboard users have no need (degradation)." },
  CLASS_ROW,
]

// ---- Navigation -----------------------------------------------------

export const TABS_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used to scope keyboard handlers + assign per-trigger ids." },
  { prop: "value", type: "string", required: true, description: "Initial active tab's value." },
  { prop: "orientation", type: ['"horizontal"', '"vertical"'], default: '"horizontal"', description: "Layout + aria-orientation + arrow-key axis." },
  { prop: "activation", type: ['"automatic"', '"manual"'], default: '"automatic"', description: "automatic: arrow keys also activate. manual: Space/Enter to activate.",
    source: { badge: "APG", label: "Manual vs automatic activation", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#kbd_label" } },
  CLASS_ROW,
]

export const ACCORDION_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used as the exclusive-group name for single-expand." },
  { prop: "type", type: ['"single"', '"multiple"'], default: '"multiple"', description: "single uses the new HTML <details name> for exclusive expansion.",
    source: { badge: "MDN", label: "<details name>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name" } },
  CLASS_ROW,
]

export const PAGINATION_PROPS: ApiRow[] = [
  { prop: "ariaLabel", type: "string", default: '"Pagination"', description: "Landmark name for the <nav>." },
  CLASS_ROW,
]

export const TABLE_PROPS: ApiRow[] = [
  { prop: "wrapperClass", type: "string", description: "Tailwind classes appended to the overflow-x wrapper." },
  CLASS_ROW,
]
