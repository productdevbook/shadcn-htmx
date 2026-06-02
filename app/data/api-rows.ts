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

// ---- New APG components (batch A) ----

export const METER_PROPS: ApiRow[] = [
  {
    prop: "value",
    type: "number",
    required: true,
    description: "Current reading. The browser clamps it into [min, max].",
    source: { badge: "MDN", label: "<meter value>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#value" },
  },
  { prop: "min", type: "number", default: "0", description: "Lower bound of the range." },
  { prop: "max", type: "number", default: "1", description: "Upper bound of the range. Default 1, so value=0.75 reads as 75%." },
  {
    prop: "low",
    type: "number",
    description: "Upper bound of the low zone. Values below it render in the low colour band.",
    source: { badge: "MDN", label: "<meter low>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#low" },
  },
  {
    prop: "high",
    type: "number",
    description: "Lower bound of the high zone. Values above it render in the high colour band.",
    source: { badge: "MDN", label: "<meter high>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#high" },
  },
  {
    prop: "optimum",
    type: "number",
    description: "The preferred value. Tells the browser which zone is \"good\" (green), making the others suboptimal (amber) or far-off (red).",
    source: { badge: "MDN", label: "<meter optimum>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#optimum" },
  },
  {
    prop: "valuetext",
    type: "string",
    description: "Human-readable value for AT (e.g. \"12.4 GB of 16 GB\"). Sets aria-valuetext. Per APG, use it when a bare percentage isn't user-friendly.",
    source: { badge: "APG", label: "Meter pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/meter/" },
  },
  {
    prop: "children",
    type: "Child",
    description: "Fallback text shown by legacy AT and browsers without <meter> support. Defaults to a \"value / max\" string.",
  },
  ...COMMON_ARIA,
  HX_ROW,
  CLASS_ROW,
]

export const NUMBER_INPUT_PROPS: ApiRow[] = [
  {
    prop: "steppers",
    type: "boolean",
    default: "true",
    description:
      "Render the styled −/+ buttons around the field. false renders a bare native spinbutton (zero JS) — arrow keys still step.",
  },
  {
    prop: "value",
    type: ["number", "string"],
    description: "Initial value. Reflected to aria-valuenow by the browser.",
  },
  {
    prop: "min",
    type: ["number", "string"],
    description: "Minimum allowed value; the browser clamps and exposes it as aria-valuemin.",
    source: { badge: "MDN", label: "min", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/min" },
  },
  {
    prop: "max",
    type: ["number", "string"],
    description: "Maximum allowed value; the browser clamps and exposes it as aria-valuemax.",
    source: { badge: "MDN", label: "max", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/max" },
  },
  {
    prop: "step",
    type: ["number", "string"],
    default: '"1"',
    description: 'Increment per arrow press / button click. Use "any" to allow arbitrary decimals.',
    source: { badge: "MDN", label: "step", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step" },
  },
  {
    prop: "inputmode",
    type: ['"none"', '"numeric"', '"decimal"'],
    description: "Mobile keyboard hint — decimal for prices, numeric for integers.",
    source: { badge: "MDN", label: "inputmode", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode" },
  },
  {
    prop: "readonly",
    type: "boolean",
    default: "false",
    description: "Read-only — focusable + selectable but not editable, and not stepped by the buttons.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the field and both stepper buttons; not submitted with the form.",
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const BREADCRUMB_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    default: '"Breadcrumb"',
    description: "Accessible name for the <nav> landmark (Breadcrumb root).",
    source: { badge: "APG", label: "Breadcrumb pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" },
  },
  {
    prop: "href",
    type: "string",
    description: "Destination for a BreadcrumbLink. Rendered as a real <a href>; omit on the current page (use BreadcrumbPage instead).",
    source: { badge: "MDN", label: "<a> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a" },
  },
  {
    prop: "children",
    type: "Child",
    description: "Trail content. BreadcrumbSeparator accepts children to override the default chevron glyph.",
  },
  HX_ROW,
  CLASS_ROW,
]

export const LINK_PROPS: ApiRow[] = [
  {
    prop: "href",
    type: "string",
    description: "Destination URL. Renders a native <a href> with the implicit link role and Enter-to-activate from the platform.",
    source: { badge: "MDN", label: "<a href>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#href" },
  },
  {
    prop: "variant",
    type: ['"default"', '"muted"', '"hover"'],
    default: '"default"',
    description: "Emphasis: default (underlined primary), muted (low-emphasis), hover (underline only on hover/focus — for nav, not prose).",
  },
  {
    prop: "external",
    type: "boolean",
    default: "false",
    description: "Open in a new tab. Sets target=\"_blank\" rel=\"noopener noreferrer\" and appends an icon + visually-hidden \"(opens in new tab)\" text.",
    source: { badge: "MDN", label: "External links", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#external_links_and_linking_to_non-html_resources" },
  },
  {
    prop: "target / rel",
    type: "string",
    description: "Standard <a> attributes. Managed by `external`, but settable explicitly.",
    source: { badge: "MDN", label: "<a target>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target" },
  },
  {
    prop: "download / hreflang / referrerpolicy / ping / type",
    type: "string",
    description: "Pass-through native <a> attributes.",
    source: { badge: "MDN", label: "<a> attributes", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#attributes" },
  },
  {
    prop: "ariaCurrent",
    type: ['"page"', '"step"', '"location"', '"date"', '"time"', '"true"', '"false"'],
    description: "Marks the link to the current resource (e.g. the active nav item).",
    source: { badge: "MDN", label: "aria-current", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current" },
  },
  {
    prop: "as",
    type: ['"a"', '"span"', '"button"'],
    default: '"a"',
    description: "APG fallback only — render a non-anchor with role=\"link\" + tabindex=0 when an <a> is impossible. The platform will NOT navigate for you; site.js wires Enter/click on [data-slot=\"link\"][role=\"link\"] via a data-href hook.",
    source: { badge: "APG", label: "Link pattern note", href: "https://www.w3.org/WAI/ARIA/apg/patterns/link/" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const COLLAPSIBLE_PROPS: ApiRow[] = [
  {
    prop: "open",
    type: "boolean",
    default: "false",
    description: "Render expanded on initial load. Maps to the native boolean <details open> attribute — omit it (don't pass the string \"false\") to start collapsed.",
    source: { badge: "MDN", label: "<details open>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#open" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Visually mute the disclosure and block pointer interaction (pointer-events-none, reduced opacity).",
  },
  CLASS_ROW,
  HX_ROW,
]

export const ALERT_DIALOG_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used by AlertDialogTrigger's dialogFor prop to open this alert dialog. Also seeds the title/description ids (`{id}-title`, `{id}-description`)." },
  { prop: "open", type: "boolean", default: "false", description: "Pre-open at initial render (for htmx-fetched alert dialogs; site.js promotes <dialog open> to .showModal())." },
  { prop: "closedby", type: '"closerequest"', default: '"closerequest"', description: "Pinned by the component. ESC + code only — never a backdrop click — so an alert dialog always requires an explicit response.",
    source: { badge: "MDN", label: "<dialog closedby>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby" } },
  { prop: "role", type: '"alertdialog"', default: '"alertdialog"', description: "Fixed by the component. Announced with higher urgency than a plain dialog and requires aria-describedby.",
    source: { badge: "APG", label: "Alert and Message Dialogs", href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/" } },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
]

export const RANGE_SLIDER_PROPS: ApiRow[] = [
  { prop: "min", type: "number", default: "0", description: "Track minimum (shared by both thumbs)." },
  { prop: "max", type: "number", default: "100", description: "Track maximum (shared by both thumbs)." },
  { prop: "step", type: "number", description: "Increment per arrow press, applied to both thumbs." },
  { prop: "minValue", type: "number", default: "min", description: "Initial value of the lower thumb." },
  { prop: "maxValue", type: "number", default: "max", description: "Initial value of the upper thumb." },
  { prop: "minName", type: "string", default: '"min"', description: "Form field name submitted for the lower thumb." },
  { prop: "maxName", type: "string", default: '"max"', description: "Form field name submitted for the upper thumb." },
  { prop: "minLabel", type: "string", default: '"Minimum"', description: "Accessible name for the lower thumb (aria-label).",
    source: { badge: "APG", label: "Slider (Multi-Thumb)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/" } },
  { prop: "maxLabel", type: "string", default: '"Maximum"', description: "Accessible name for the upper thumb (aria-label)." },
  { prop: "minValuetext", type: "string", description: "Human-readable value for the lower thumb (e.g. \"$120\").",
    source: { badge: "MDN", label: "aria-valuetext", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuetext" } },
  { prop: "maxValuetext", type: "string", description: "Human-readable value for the upper thumb (e.g. \"$380\")." },
  { prop: "ariaLabelledby", type: "string", description: "Id of a visible element naming the whole control; applied to both thumbs in place of the per-thumb labels." },
  { prop: "ariaDescribedby", type: "string", description: "Id of an element describing the control; applied to both thumbs." },
  { prop: "id", type: "string", description: "Base id; the thumbs become id-min / id-max." },
  { prop: "form", type: "string", description: "Associate both inputs with a <form> by id." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable both thumbs — unfocusable, not submitted." },
  CLASS_ROW,
  HX_ROW,
]

export const TOOLBAR_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "Accessible name for the toolbar when there's no visible label. APG requires every toolbar to be labelled via aria-label or aria-labelledby.",
    source: { badge: "APG", label: "Toolbar roles, states & properties", href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element that names the toolbar (alternative to ariaLabel).",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "orientation",
    type: ['"horizontal"', '"vertical"'],
    default: '"horizontal"',
    description:
      "Layout axis. Sets aria-orientation and selects the arrow-key axis: Left/Right when horizontal, Up/Down when vertical. The role's implicit orientation is horizontal.",
    source: { badge: "MDN", label: "toolbar role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/toolbar_role" },
  },
  CLASS_ROW,
  HX_ROW,
]
