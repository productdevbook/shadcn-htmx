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

// ---- New APG components (batch B) ----

export const LISTBOX_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "Accessible name for the listbox when there's no visible label. APG requires a standalone listbox to be labelled via aria-label or aria-labelledby.",
    source: { badge: "APG", label: "Listbox roles, states & properties", href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element that names the listbox (alternative to ariaLabel).",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "multiple",
    type: "boolean",
    default: "false",
    description:
      "Allow more than one option to be selected. Sets aria-multiselectable=\"true\"; Space toggles the focused option and Shift/Ctrl extend the selection per the APG recommended model.",
    source: { badge: "MDN", label: "aria-multiselectable", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-multiselectable" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the whole widget. Sets aria-disabled and makes the options inert.",
  },
  {
    prop: "orientation",
    type: ['"horizontal"', '"vertical"'],
    default: '"vertical"',
    description:
      "Layout axis. Sets aria-orientation and selects the arrow-key axis: Up/Down when vertical, Left/Right when horizontal.",
    source: { badge: "MDN", label: "listbox role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role" },
  },
  {
    prop: "name",
    type: "string",
    description:
      "Renders a sibling <input type=\"hidden\"> whose value mirrors the selection (single value, or comma-joined when multiple) so the listbox submits like a normal field. Omit to skip the hidden input.",
  },
  CLASS_ROW,
  HX_ROW,
]

// ListboxOption props: value (string, defaults to text content), selected
// (boolean), disabled (boolean), id, class — forwarded onto <li role="option">.

export const MENUBAR_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name for the menubar. APG: a menubar without a visible label must have aria-label (or aria-labelledby).",
    source: { badge: "APG", label: "Menu and Menubar pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" },
  },
  CLASS_ROW,
]

export const MENUBAR_MENU_PROPS: ApiRow[] = [
  {
    prop: "label",
    type: "string",
    required: true,
    description: "Visible text of the top-level menu (e.g. \"File\"). Also used as the submenu's aria-label.",
  },
  {
    prop: "id",
    type: "string",
    required: true,
    description: "Unique id. Wires the trigger's popovertarget attribute to the submenu popover.",
    source: { badge: "MDN", label: "Popover API", href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the menu trigger. Disabled triggers are skipped by roving tabindex and arrow navigation.",
  },
  {
    prop: "triggerClass",
    type: "string",
    description: "Extra classes on the top-level trigger button.",
  },
  {
    prop: "contentClass",
    type: "string",
    description: "Extra classes on the submenu popover container.",
  },
]

export const MENUBAR_ITEM_PROPS: ApiRow[] = [
  {
    prop: "variant",
    type: ['"default"', '"destructive"'],
    default: '"default"',
    description: "Visual style. destructive renders the item in the destructive colour.",
  },
  {
    prop: "href",
    type: "string",
    description: "Render the item as an <a>. Use for navigation menubars.",
  },
  {
    prop: "onclick",
    type: "string",
    description: "Inline click handler for the item (button variant).",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the item. Focusable per APG, but not activatable and skipped by arrow navigation.",
    source: { badge: "APG", label: "Disabled menu items", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" },
  },
  HX_ROW,
  CLASS_ROW,
]

export const TREE_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "Accessible name for the tree when there's no visible label. APG requires every tree to be labelled via aria-label or aria-labelledby.",
    source: { badge: "APG", label: "Tree View roles, states & properties", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element (e.g. a heading) that names the tree (alternative to ariaLabel).",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "<TreeItem> label",
    type: "Child",
    description: "Visible label for a node. Rendered before any nested <TreeGroup> and used as the type-ahead match text.",
  },
  {
    prop: "<TreeItem> expanded",
    type: "boolean",
    description:
      "Marks the node as a parent and sets its initial open state via aria-expanded. Pass it (true/false) on parent nodes; omit it on end nodes so they are not mis-announced as parents.",
    source: { badge: "APG", label: "aria-expanded on parent nodes", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "<TreeItem> parent",
    type: "boolean",
    default: "false",
    description: "Mark a node as a parent without pre-expanding it (forces aria-expanded=\"false\"). Shorthand for expanded={false}.",
  },
  {
    prop: "<TreeItem> selected",
    type: "boolean",
    default: "false",
    description: "Single-select state — sets aria-selected and the primary fill. Selection is distinct from focus.",
    source: { badge: "MDN", label: "aria-selected", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected" },
  },
  {
    prop: "<TreeItem> disabled",
    type: "boolean",
    default: "false",
    description: "Sets aria-disabled and dims the node; click/keyboard interaction is skipped over it.",
    source: { badge: "MDN", label: "aria-disabled", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled" },
  },
  {
    prop: "<TreeItem> value",
    type: "string",
    description: "Stable identifier emitted as data-value so consumers or htmx can target the node.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const CAROUSEL_PROPS: ApiRow[] = [
  {
    prop: "id",
    type: "string",
    required: true,
    description:
      "Scopes the boot script + site.js handlers to this carousel and links the Prev/Next buttons to the scroller via aria-controls.",
  },
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "Accessible name for the carousel container. APG: since aria-roledescription is \"carousel\", the name must NOT contain the word \"carousel\".",
    source: { badge: "APG", label: "Carousel — name the container", href: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element that names the carousel (alternative to ariaLabel).",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const FEED_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "Accessible name for the feed when there's no visible heading. APG: the feed must be named via aria-label or aria-labelledby.",
    source: { badge: "APG", label: "Feed roles, states & properties", href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description:
      "Id of a visible element (usually the heading) that names the feed. Preferred over ariaLabel when a title is on screen.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "busy",
    type: "boolean",
    default: "false",
    description:
      "Sets aria-busy=\"true\" while a batch of articles is being added or removed, then must return to false once the DOM is stable. With htmx this usually rides on the in-flight sentinel rather than the container.",
    source: { badge: "APG", label: "aria-busy", href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/#wai-ariaroles,states,andproperties" },
  },
  CLASS_ROW,
  HX_ROW,
]

// Per-article props (sub-component <FeedArticle>).
export const FEED_ARTICLE_PROPS: ApiRow[] = [
  {
    prop: "posinset",
    type: "number",
    required: true,
    description: "1-based position of this article within the feed (aria-posinset).",
    source: { badge: "APG", label: "aria-posinset", href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "setsize",
    type: "number",
    required: true,
    description: "Total number of articles (loaded or in the feed). Use -1 when the total is unknown (aria-setsize).",
    source: { badge: "APG", label: "aria-setsize", href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "labelledby",
    type: "string",
    required: true,
    description: "Id of the element inside the article that names it (its title) — sets aria-labelledby.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "describedby",
    type: "string",
    description: "Id(s) of the element(s) providing the article's primary content, so AT users can skim (aria-describedby).",
    source: { badge: "MDN", label: "aria-describedby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby" },
  },
  CLASS_ROW,
  HX_ROW,
]

// Trailing infinite-scroll placeholder props (sub-component <FeedSentinel>).
export const FEED_SENTINEL_PROPS: ApiRow[] = [
  {
    prop: "href",
    type: "string",
    description: "Next-page URL. Sets hx-get on the sentinel.",
    source: { badge: "htmx", label: "hx-get", href: "https://htmx.org/attributes/hx-get/" },
  },
  {
    prop: "trigger",
    type: "string",
    default: '"revealed"',
    description: "htmx trigger that fires the load. Defaults to \"revealed\"; use \"intersect once\" when the feed scrolls inside an overflow container.",
    source: { badge: "htmx", label: "hx-trigger (revealed)", href: "https://htmx.org/reference/#trigger-modifiers" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const GRID_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name for the grid. Required when there is no visible labelling element (APG: a grid must be named).",
    source: { badge: "APG", label: "Grid pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element that names the grid (use instead of ariaLabel).",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "ariaDescribedby",
    type: "string",
    description: "Id of an element describing the grid (announced after the name).",
    source: { badge: "MDN", label: "aria-describedby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby" },
  },
  {
    prop: "ariaRowcount",
    type: "number",
    description: "Total number of rows when not all are present in the DOM (virtualised/paginated grids).",
    source: { badge: "MDN", label: "aria-rowcount", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-rowcount" },
  },
  {
    prop: "ariaColcount",
    type: "number",
    description: "Total number of columns when not all are present in the DOM.",
    source: { badge: "MDN", label: "aria-colcount", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-colcount" },
  },
  {
    prop: "ariaReadonly",
    type: "boolean",
    description: "Set on the grid when editing is disabled for all cells (read-only data grid).",
    source: { badge: "MDN", label: "aria-readonly", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-readonly" },
  },
  { prop: "wrapperClass", type: "string", description: "Tailwind classes appended to the overflow-x scroll wrapper." },
  CLASS_ROW,
  HX_ROW,
]

export const TREEGRID_PROPS: ApiRow[] = [
  {
    prop: "columns",
    type: "string[]",
    required: true,
    description:
      "Column header labels for <Treegrid>. Rendered as a single header row of <th role=\"columnheader\" scope=\"col\">.",
    source: { badge: "APG", label: "Treegrid roles, states & properties", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/#wai-ariaroles,states,andproperties" },
  },
  ...COMMON_ARIA.slice(0, 2),
  {
    prop: "level",
    type: "number",
    required: true,
    description:
      "<TreegridRow> only. 1-based depth in the hierarchy; root rows are level 1. Emitted as aria-level.",
    source: { badge: "MDN", label: "aria-level", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-level" },
  },
  {
    prop: "posinset",
    type: "number",
    required: true,
    description:
      "<TreegridRow> only. 1-based position of this row within its sibling set at this level. Emitted as aria-posinset.",
    source: { badge: "MDN", label: "aria-posinset", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-posinset" },
  },
  {
    prop: "setsize",
    type: "number",
    required: true,
    description:
      "<TreegridRow> only. Total number of rows in this row's sibling set at this level. Emitted as aria-setsize.",
    source: { badge: "MDN", label: "aria-setsize", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-setsize" },
  },
  {
    prop: "expanded",
    type: "boolean",
    description:
      "<TreegridRow> only. Set on PARENT rows: true = children visible, false = collapsed. Emitted as aria-expanded on the <tr>. Omit on leaf rows so AT doesn't announce them as empty parents.",
    source: { badge: "APG", label: "Treegrid pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/" },
  },
  {
    prop: "hidden",
    type: "boolean",
    description:
      "<TreegridRow> only. Collapsed descendant rows pass hidden to leave layout AND the accessibility tree until their ancestor is expanded. The keyboard contract toggles this attribute.",
    source: { badge: "MDN", label: "hidden attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden" },
  },
  {
    prop: "selected",
    type: "boolean",
    description:
      "<TreegridRow> only. Single-select treegrids set this on the selected row; emitted as aria-selected.",
    source: { badge: "MDN", label: "aria-selected", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected" },
  },
  {
    prop: "first",
    type: "boolean",
    description:
      "<TreegridCell> only. Marks the first cell of a row; hosts the indent and (when expandable) the expand/collapse chevron.",
  },
  {
    prop: "expandable",
    type: "boolean",
    description:
      "<TreegridCell> only. On the first cell of a PARENT row, renders the chevron whose rotation tracks the row's aria-expanded.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const SPLITTER_PROPS: ApiRow[] = [
  {
    prop: "orientation",
    type: ['"horizontal"', '"vertical"'],
    default: '"horizontal"',
    description:
      "Layout axis. horizontal puts the panes side by side (the divider resizes width); vertical stacks them (resizes height). Sets aria-orientation and selects the arrow-key axis: Left/Right when horizontal, Up/Down when vertical.",
    source: { badge: "MDN", label: "aria-orientation", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-orientation" },
  },
  { prop: "primary", type: "Child", description: "Content of the primary pane — the one the divider's value sizes." },
  { prop: "secondary", type: "Child", description: "Content of the secondary pane, which fills the remaining space." },
  {
    prop: "value",
    type: "number",
    default: "50",
    description:
      "Initial size of the primary pane as a percent, clamped into [min, max]. Becomes aria-valuenow and the --split CSS variable.",
    source: { badge: "APG", label: "Window Splitter (value = primary pane size)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/" },
  },
  {
    prop: "min",
    type: "number",
    default: "0",
    description: "Position giving the primary pane its smallest size (aria-valuemin). Typically 0 — fully collapsed.",
    source: { badge: "MDN", label: "aria-valuemin", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuemin" },
  },
  {
    prop: "max",
    type: "number",
    default: "100",
    description: "Position giving the primary pane its largest size (aria-valuemax). Typically 100.",
    source: { badge: "MDN", label: "aria-valuemax", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuemax" },
  },
  { prop: "step", type: "number", default: "10", description: "Resize increment per arrow-key press (in the same percent units as value)." },
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "Accessible name for the divider; per APG it matches the primary pane (e.g. \"Files\"). Required when there's no visible label and ariaLabelledby is not set.",
    source: { badge: "APG", label: "Window Splitter roles, states & properties", href: "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/#wai-ariaroles,states,andproperties" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element (typically the primary pane's heading) that names the divider, used in place of ariaLabel.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "primaryId",
    type: "string",
    default: "id-primary",
    description: "Id given to the primary pane; the divider's aria-controls points at it. Auto-derived from id when omitted.",
    source: { badge: "MDN", label: "aria-controls", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls" },
  },
  { prop: "id", type: "string", description: "Root id. Also seeds primaryId (id-primary) when primaryId is not supplied." },
  CLASS_ROW,
  HX_ROW,
]

// ---- Landmarks (APG landmark practice) ----
export const LANDMARKS_PROPS: ApiRow[] = [
  { prop: "<Banner>", type: "<header>", description: "Banner landmark — top-level only; one per page. A <header> nested in article/aside/main/nav/section is just a sectioning header.", source: { badge: "APG", label: "Banner landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html" } },
  { prop: "<NavLandmark>", type: "<nav>", description: "Navigation landmark. Give each a unique ariaLabel when a page has more than one nav.", source: { badge: "APG", label: "Navigation landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html" } },
  { prop: "<SearchLandmark>", type: "<search>", description: "Search landmark via the native <search> element wrapping a <form>; no role=\"search\" needed.", source: { badge: "MDN", label: "<search> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search" } },
  { prop: "<MainLandmark>", type: "<main>", description: "Main landmark — exactly one per page, top-level.", source: { badge: "APG", label: "Main landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/main.html" } },
  { prop: "<Complementary>", type: "<aside>", description: "Complementary landmark for supporting content; label each when more than one.", source: { badge: "APG", label: "Complementary landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/complementary.html" } },
  { prop: "<RegionLandmark>", type: "<section>", description: "Region landmark. A bare <section> exposes NO role — always pass ariaLabel or ariaLabelledby.", source: { badge: "APG", label: "Region landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/region.html" } },
  { prop: "<ContentInfo>", type: "<footer>", description: "Contentinfo landmark (copyright, privacy/accessibility links) — top-level only; one per page.", source: { badge: "APG", label: "Contentinfo landmark", href: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/contentinfo.html" } },
  { prop: "ariaLabel", type: "string", description: "Accessible name. Required for region; recommended for navigation/complementary/search once there is more than one of that type.", source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" } },
  { prop: "ariaLabelledby", type: "string", description: "Id of a visible heading that names the landmark. Preferred over ariaLabel when a title is on screen.", source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" } },
  CLASS_ROW,
]

// ---- New components (tier-1) ----

export const FORM_FIELD_PROPS: ApiRow[] = [
  {
    prop: "children",
    type: "Child",
    description: "The single control to wire up (an <Input>, <Textarea>, <Select>, …). It is cloned to inject id, aria-describedby, and aria-invalid.",
  },
  {
    prop: "label",
    type: "Child",
    description: "Visible label text. Rendered in a <label for> linked to the control. Omit to render no label (e.g. a self-labelled control).",
    source: { badge: "MDN", label: "<label>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label" },
  },
  {
    prop: "for",
    type: "string",
    description: "The control's id. The label points at it, and the description/error ids are derived as {id}-description and {id}-error.",
  },
  {
    prop: "description",
    type: "Child",
    description: "Helper text under the label. Its id is folded into the control's aria-describedby so screen readers announce it after the name.",
    source: { badge: "MDN", label: "aria-describedby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby" },
  },
  {
    prop: "error",
    type: "Child",
    description: "Error message. When set, the field marks aria-invalid, renders a role=alert message, and wires it into aria-describedby. Defaults invalid to true.",
    source: { badge: "WCAG", label: "3.3.1 Error Identification", href: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html" },
  },
  {
    prop: "invalid",
    type: "boolean",
    description: "Force the invalid state. Defaults to true when error is provided.",
    source: { badge: "MDN", label: "aria-invalid", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid" },
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Adds a * indicator to the label and forwards aria-required onto the control.",
  },
  {
    prop: "labelClass",
    type: "string",
    description: "Extra Tailwind classes appended to the label element.",
  },
  CLASS_ROW,
  HX_ROW,
]

// <FormFieldset> — group variant for radios/checkboxes under one <legend>.
export const FORM_FIELDSET_PROPS: ApiRow[] = [
  {
    prop: "legend",
    type: "Child",
    description: "The <legend> caption for the group; becomes its accessible name.",
    source: { badge: "MDN", label: "<legend>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend" },
  },
  {
    prop: "id",
    type: "string",
    description: "Base id for the group. Description/error ids are derived ({id}-description, {id}-error) and referenced from the fieldset's aria-describedby.",
  },
  {
    prop: "description",
    type: "Child",
    description: "Helper text under the controls, linked via the fieldset's aria-describedby.",
  },
  {
    prop: "error",
    type: "Child",
    description: "Error message for the whole group. Sets aria-invalid on the fieldset and renders a role=alert message.",
  },
  {
    prop: "invalid",
    type: "boolean",
    description: "Force the invalid state. Defaults to true when error is provided.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables every descendant control in one go via the native fieldset disabled attribute.",
    source: { badge: "MDN", label: "<fieldset disabled>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset" },
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Adds a * to the legend and forwards aria-required onto the fieldset.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const FILE_UPLOAD_PROPS: ApiRow[] = [
  {
    prop: "name",
    type: "string",
    description: "Form field name. Required to submit; with multiple, one entry per file is sent under this name.",
    source: { badge: "MDN", label: "<input type=\"file\">", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file" },
  },
  {
    prop: "accept",
    type: "string",
    description: "Comma-separated unique file type specifiers (e.g. \".pdf,image/*\"). Pre-filters the OS picker; the drop enhancement re-checks it.",
    source: { badge: "MDN", label: "accept", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept" },
  },
  {
    prop: "multiple",
    type: "boolean",
    default: "false",
    description: "Allow choosing or dropping more than one file. The picker returns a FileList.",
    source: { badge: "MDN", label: "multiple", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/multiple" },
  },
  {
    prop: "capture",
    type: ['"user"', '"environment"', "boolean"],
    description: "With an image/video accept, request the OS camera — user (front) or environment (rear).",
    source: { badge: "MDN", label: "capture", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture" },
  },
  { prop: "required", type: "boolean", default: "false", description: "Native constraint — the form won't submit until a file is chosen." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable the picker and dim the zone; not submitted with the form." },
  {
    prop: "preserve",
    type: "boolean",
    default: "false",
    description: "Emit hx-preserve=\"true\" on the input so the chosen file survives when the form re-renders with validation errors during an htmx swap.",
    source: { badge: "htmx", label: "hx-preserve (file upload)", href: "https://htmx.org/examples/file-upload/" },
  },
  {
    prop: "form",
    type: "string",
    description: "Associate the input with a <form> by id. Placing the input outside the swap target is an alternative to preserve for keeping the selection.",
    source: { badge: "MDN", label: "input form", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form" },
  },
  {
    prop: "label",
    type: "string",
    default: '"Drop files here, or click to upload"',
    description: "Visible prompt inside the zone. Also becomes the input's aria-label when no other accessible name is set.",
  },
  { prop: "hint", type: "string", description: "Secondary sub-label under the prompt (e.g. accepted types / size limit)." },
  {
    prop: "showProgress",
    type: "boolean",
    default: "false",
    description: "Render a native-style progressbar under the list. Drive it from XHR upload progress; htmx 4.x's fetch transport exposes upload progress only in some browsers.",
    source: { badge: "MDN", label: "XMLHttpRequest.upload", href: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload" },
  },
  { prop: "progress", type: "number", description: "0–100 makes the bar determinate; omit (with showProgress) for the indeterminate animation." },
  {
    prop: "ariaInvalid",
    type: ["boolean", '"grammar"', '"spelling"'],
    description: "Mark the field invalid — red border + ring on the zone. Pair with a visible error via ariaDescribedby.",
    source: { badge: "MDN", label: "aria-invalid", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid" },
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const COPY_BUTTON_PROPS: ApiRow[] = [
  {
    prop: "value",
    type: "string",
    description: "The string written to the clipboard. Pass this OR copyTarget; if both are set, copyTarget wins.",
    source: { badge: "MDN", label: "Clipboard.writeText()", href: "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText" },
  },
  {
    prop: "copyTarget",
    type: "string",
    description: "Id of an element whose live value (form fields) or textContent is copied at click time. Lets the source of truth live elsewhere (e.g. a read-only input or code block).",
    source: { badge: "MDN", label: "Node.textContent", href: "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent" },
  },
  {
    prop: "variant",
    type: ['"outline"', '"ghost"', '"secondary"'],
    default: '"outline"',
    description: "Visual style. All three are understated since a copy button is auxiliary chrome.",
  },
  {
    prop: "size",
    type: ['"default"', '"sm"', '"icon"'],
    default: '"default"',
    description: "Size variant. icon is square with no visible label — pass ariaLabel for an accessible name.",
  },
  {
    prop: "label",
    type: "string",
    default: '"Copy"',
    description: "Visible label next to the icon. Dropped for size=\"icon\".",
  },
  {
    prop: "copiedLabel",
    type: "string",
    default: '"Copied"',
    description: "Label + announcement shown for two seconds after a successful copy.",
  },
  {
    prop: "live",
    type: ['"polite"', '"assertive"'],
    default: '"polite"',
    description: "Politeness of the success announcement written into the empty aria-live region. polite waits for a graceful pause; assertive interrupts.",
    source: { badge: "MDN", label: "aria-live", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the button — skipped from tab order, no copy on click.",
  },
  ...COMMON_ARIA.slice(0, 1),
  CLASS_ROW,
  HX_ROW,
]

export const DATE_TIME_PICKER_PROPS: ApiRow[] = [
  {
    prop: "type",
    type: ['"date"', '"time"', '"datetime-local"', '"month"', '"week"'],
    default: '"date"',
    description:
      "Which native temporal control to render. Drives the picker UI, the normalised value format and the units of min/max/step.",
    source: { badge: "MDN", label: "<input type>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types" },
  },
  {
    prop: "value",
    type: "string",
    description:
      "Initial value in the variant's normalised, locale-independent format — date yyyy-mm-dd, time HH:mm[:ss], datetime-local yyyy-mm-ddTHH:mm, month YYYY-MM, week yyyy-Www.",
    source: { badge: "MDN", label: "Date and time formats", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats" },
  },
  {
    prop: "min",
    type: "string",
    description:
      "Earliest accepted value, in the value's format. For time the domain is periodic, so a min later than max is valid and the range crosses midnight.",
    source: { badge: "MDN", label: "min", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/min" },
  },
  {
    prop: "max",
    type: "string",
    description: "Latest accepted value, in the value's format. The browser fails constraint validation when the value falls outside [min, max].",
    source: { badge: "MDN", label: "max", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/max" },
  },
  {
    prop: "step",
    type: ["number", "string"],
    description:
      'Granularity. date: days (default 1); time / datetime-local: seconds (default 60 → minutes, "1" reveals a seconds segment); month: months; week: weeks. "any" removes stepping.',
    source: { badge: "MDN", label: "step", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step" },
  },
  {
    prop: "list",
    type: "string",
    description: "Id of a <datalist> of suggested values shown alongside the picker.",
    source: { badge: "MDN", label: "<datalist>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist" },
  },
  {
    prop: "readonly",
    type: "boolean",
    default: "false",
    description: "Read-only — focusable but not editable. Per MDN, required has no effect on a readonly field.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the field — unfocusable, not submitted with the form.",
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Native HTML required for form validation — submit is blocked while the field is empty.",
  },
  {
    prop: "autofocus",
    type: "boolean",
    default: "false",
    description: "Focus this field on initial page load (one per document).",
  },
  {
    prop: "form",
    type: "string",
    description: "Associate the field with a <form> elsewhere in the document by id.",
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const SHEET_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Used by SheetTrigger's sheetFor prop to open this sheet. Also seeds the title/description ids (`{id}-title`, `{id}-description`)." },
  { prop: "side", type: ['"top"', '"right"', '"bottom"', '"left"'], default: '"right"', description: "Viewport edge the drawer slides in from. Side drawers fill the cross-axis; top/bottom sheets size to content.",
    source: { badge: "MDN", label: "inset / inset-x / inset-y", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset" } },
  { prop: "open", type: "boolean", default: "false", description: "Pre-open at initial render (for htmx-fetched sheets; site.js promotes <dialog open> to .showModal())." },
  { prop: "closedby", type: ['"any"', '"closerequest"', '"none"'], default: '"any"', description: "Native HTML attribute. \"any\" = ESC + backdrop light dismiss, \"closerequest\" = ESC + code only, \"none\" = code only. When not \"any\", a data-close-on-backdrop hook keeps backdrop-click dismissal.",
    source: { badge: "MDN", label: "<dialog closedby>", href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy" } },
  { prop: "showCloseButton", type: "boolean", default: "true", description: "Render the X button in the top-right corner." },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
]

export const HOVER_CARD_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Required on <HoverCard>. Referenced by the trigger's cardFor (rendered as interestfor)." },
  { prop: "cardFor", type: "string", required: true, description: "On <HoverCardTrigger>. Id of the HoverCard to reveal; rendered as the interestfor attribute on the trigger.",
    source: { badge: "MDN", label: "interestfor", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#interestfor" } },
  { prop: "side", type: ['"top"', '"right"', '"bottom"', '"left"'], default: '"bottom"', description: "Placement relative to the trigger. Drives CSS position-area off the implicit anchor reference, with a centred fallback in browsers without anchor positioning.",
    source: { badge: "MDN", label: "position-area", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/position-area" } },
  { prop: "href", type: "string", default: '"#"', description: "On <HoverCardTrigger>. Click destination for the default <a>. Interest invokers reveal on hover/focus, but the trigger still navigates on click — keeping it useful and functional in non-supporting browsers." },
  { prop: "asChild", type: "boolean", default: "false", description: "On <HoverCardTrigger>. Merge the interest-invoker wiring onto the single child element (e.g. an existing <a> or <button>) instead of rendering a wrapper anchor, so no extra element enters the accessibility tree." },
  CLASS_ROW,
  HX_ROW,
]

export const ACTIVE_SEARCH_PROPS: ApiRow[] = [
  {
    prop: "id",
    type: "string",
    required: true,
    description: "Input id. The loading indicator gets id=\"{id}-indicator\" and hx-indicator points at it.",
  },
  {
    prop: "name",
    type: "string",
    default: '"q"',
    description: "Form field name submitted on Enter and sent as the query param to the server.",
  },
  {
    prop: "action",
    type: "string",
    description: "URL the native <form> navigates to on Enter when JS is off, and the htmx GET URL when hx-get isn't passed explicitly.",
    source: { badge: "MDN", label: "<form action>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#action" },
  },
  {
    prop: "method",
    type: ['"get"', '"post"'],
    default: '"get"',
    description: "Form method for the no-JS fallback. GET keeps the search idempotent and the result URL shareable.",
  },
  {
    prop: "delay",
    type: "number",
    default: "300",
    description: "Debounce window in ms for the input trigger (hx-trigger=\"input changed delay:{delay}ms, search\").",
    source: { badge: "htmx", label: "hx-trigger delay", href: "https://htmx.org/attributes/hx-trigger/" },
  },
  {
    prop: "placeholder",
    type: "string",
    default: '"Search…"',
    description: "Placeholder hint shown when the field is empty.",
  },
  {
    prop: "value",
    type: "string",
    description: "Initial value (e.g. to reflect a server-rendered query).",
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Native HTML required constraint for the no-JS form submit.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the input — skipped from tab order, no requests.",
  },
  {
    prop: "autofocus",
    type: "boolean",
    default: "false",
    description: "Focus the search field on initial page load (one per document).",
  },
  {
    prop: "loadingLabel",
    type: "string",
    default: '"Searching…"',
    description: "Visually-hidden text inside the role=\"status\" indicator, announced to assistive tech while a request is in flight.",
    source: { badge: "MDN", label: "role=status", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role" },
  },
  {
    prop: "inputClass",
    type: "string",
    description: "Extra Tailwind classes appended to the <input> (the root <form> uses class).",
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const EDIT_IN_PLACE_PROPS: ApiRow[] = [
  {
    prop: "editHref",
    type: "string",
    required: true,
    description: "GET endpoint that returns the editor form fragment. Set on EditInPlace (the view); wired to the Edit button's hx-get.",
    source: { badge: "htmx", label: "hx-get", href: "https://htmx.org/attributes/hx-get/" },
  },
  {
    prop: "putHref",
    type: "string",
    required: true,
    description: "PUT endpoint hit when Save is pressed. Set on EditInPlaceForm (the editor); the response (the updated view) replaces the form in place.",
    source: { badge: "htmx", label: "hx-put", href: "https://htmx.org/attributes/hx-put/" },
  },
  {
    prop: "cancelHref",
    type: "string",
    required: true,
    description: "GET endpoint that restores the read-only view on Cancel, discarding edits. Set on EditInPlaceForm.",
  },
  {
    prop: "fields",
    type: "EditInPlaceField[]",
    description: "Record fields: { label, value, name?, type?, inputValue?, required? }. Rendered as a <dl> of term/value pairs in the view and as pre-filled native inputs in the editor. Omit to pass custom children instead.",
    source: { badge: "MDN", label: "<dl> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl" },
  },
  {
    prop: "editLabel",
    type: "string",
    default: '"Edit"',
    description: "Text on the Edit button in the view.",
  },
  {
    prop: "saveLabel",
    type: "string",
    default: '"Save"',
    description: "Text on the Save submit button in the editor.",
  },
  {
    prop: "cancelLabel",
    type: "string",
    default: '"Cancel"',
    description: "Text on the Cancel button in the editor.",
  },
  {
    prop: "id",
    type: "string",
    description: "Root id. Reused across the view<->editor swap so the element keeps its identity; also seeds each editor input id as {id}-{name}.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const LOAD_MORE_PROPS: ApiRow[] = [
  {
    prop: "href",
    type: "string",
    description: "Next-page URL. Sets hx-get on the trigger.",
    source: { badge: "htmx", label: "hx-get", href: "https://htmx.org/attributes/hx-get/" },
  },
  {
    prop: "trigger",
    type: ['"click"', '"intersect"', '"revealed"'],
    default: '"click"',
    description:
      "How the load fires. \"click\" renders a real <button>; \"intersect\" / \"revealed\" render a scroll sentinel that fires when it enters the viewport. Use \"intersect\" inside an overflow-y:scroll container, \"revealed\" for the page viewport.",
    source: { badge: "htmx", label: "hx-trigger (intersect / revealed)", href: "https://htmx.org/reference/#trigger-modifiers" },
  },
  {
    prop: "label",
    type: "string",
    default: '"Load more"',
    description: "Visible text for the click button. Ignored by the sentinel modes, which use their children or the default spinner.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the click trigger — skipped from tab order, no request. No effect on the sentinel modes.",
  },
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name. On the sentinel modes the visible text is decorative, so set this to keep AT announcements meaningful (defaults to \"Loading more\").",
    source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const SKIP_LINK_PROPS: ApiRow[] = [
  {
    prop: "href",
    type: "string",
    default: '"#main"',
    description:
      "Fragment of the target landmark. Must match the id of the element focus should jump to (typically <main id=\"main\">). The native <a href> gives the link role, Enter-to-activate and the focus-jump for free.",
    source: { badge: "MDN", label: "<a href>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#href" },
  },
  {
    prop: "children",
    type: "Child",
    description:
      "Visible label, revealed on focus. Defaults to \"Skip to main content\".",
  },
  {
    prop: "id",
    type: "string",
    description: "Set when another control needs to reference this link.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const THEME_TOGGLE_PROPS: ApiRow[] = [
  {
    prop: "value",
    type: ['"system"', '"light"', '"dark"'],
    default: '"system"',
    description: "Server-resolved current choice (read from the `theme` cookie). Drives which radio renders checked + the .dark class, so there is no flash on first paint.",
    source: { badge: "MDN", label: "prefers-color-scheme", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme" },
  },
  {
    prop: "name",
    type: "string",
    default: '"theme"',
    description: "Radio group name and the cookie key the boot script reads/writes. All three radios share it so the browser groups them.",
  },
  {
    prop: "id",
    type: "string",
    default: '"theme-toggle"',
    description: "Id prefix for the inputs and their labels, so multiple toggles can coexist on one page.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the whole group — sets aria-disabled on the root and disabled on every radio.",
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

// ---- New components (tier-2) ----

export const OUTPUT_PROPS: ApiRow[] = [
  {
    prop: "htmlFor",
    type: "string",
    description:
      "Space-separated list of the ids of the inputs that contributed to the result. Sets the native for attribute.",
    source: { badge: "MDN", label: "<output for>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output" },
  },
  {
    prop: "form",
    type: "string",
    description:
      "Id of a <form> elsewhere in the document to associate with; overrides the nearest ancestor <form>. The output's value is not submitted.",
    source: { badge: "MDN", label: "<output form>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output" },
  },
  {
    prop: "name",
    type: "string",
    description: "The element's name in the form.elements API.",
  },
  {
    prop: "tone",
    type: ['"default"', '"muted"', '"primary"', '"destructive"'],
    default: '"default"',
    description: "Visual tone of the result chip. Purely cosmetic — the role=\"status\" semantics are identical across tones.",
  },
  {
    prop: "children",
    type: "Child",
    description: "The result value / content. With an htmx innerHTML swap, this is the initial content replaced in place.",
  },
  {
    prop: "ariaAtomic",
    type: "boolean",
    description: "Override the implicit aria-atomic=\"true\". Leave unset to announce the whole result on every change (the usual choice).",
    source: { badge: "MDN", label: "status role (aria-atomic)", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role" },
  },
  ...COMMON_ARIA,
  HX_ROW,
  CLASS_ROW,
]

export const SEGMENTED_CONTROL_PROPS: ApiRow[] = [
  { prop: "name", type: "string", required: true, description: "Shared name attribute. Every SegmentedControlItem reuses it so the browser groups the radios." },
  { prop: "defaultValue", type: "string", description: "Value of the segment that starts selected. Match it to one item's value (or set checked on that item)." },
  { prop: "size", type: ['"default"', '"sm"'], default: '"default"', description: "Track height + text size. Use sm for toolbars." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable the whole control. Renders a disabled <fieldset>, which natively disables every radio inside." },
  { prop: "value", type: "string", required: true, description: "On SegmentedControlItem: the value submitted when that segment is selected and matched against defaultValue." },
  { prop: "checked", type: "boolean", description: "On SegmentedControlItem: pre-select this segment." },
  { prop: "required", type: "boolean", description: "On SegmentedControlItem: native required, making the whole name-group required." },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const RATING_PROPS: ApiRow[] = [
  { prop: "name", type: "string", required: true, description: "Form field name shared by every star radio. Groups them so the browser allows one selection, and is the key submitted with the chosen value." },
  { prop: "max", type: "number", default: "5", description: "Number of stars to render." },
  { prop: "value", type: "number", description: "Pre-selected rating (1..max). Renders the matching radio checked." },
  { prop: "size", type: ['"sm"', '"default"', '"lg"'], default: '"default"', description: "Star dimensions." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable the whole control. Sets the disabled attribute on every radio, so the group is skipped from the tab order and not submitted.", source: { badge: "MDN", label: "input disabled", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled" } },
  { prop: "required", type: "boolean", default: "false", description: "Require a selection for native form validation. Applied to the first star radio; the browser treats any required radio in a name-group as making the whole group required.", source: { badge: "MDN", label: "<input type=\"radio\"> required", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio" } },
  { prop: "label", type: "(n: number, max: number) => string", default: "n of max stars", description: "Builds each star's accessible name (the aria-label on the per-star label)." },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
  HX_ROW,
]

// Append to app/data/api-rows.ts (references existing CLASS_ROW / HX_ROW / COMMON_ARIA partials).
export const COLOR_PICKER_PROPS: ApiRow[] = [
  {
    prop: "value",
    type: "string",
    default: '"#000000"',
    description:
      "A CSS <color> value. The browser coerces invalid input to a valid color and defaults to #000000 when omitted or unparseable.",
    source: { badge: "MDN", label: "color input value", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color#value" },
  },
  {
    prop: "showValue",
    type: "boolean",
    default: "true",
    description:
      "Render a live hex <output> next to the swatch. false renders a bare native swatch (zero JS).",
  },
  {
    prop: "alpha",
    type: "boolean",
    default: "false",
    description:
      "Allow editing the color's alpha channel. Experimental — ignored where the engine does not support it.",
    source: { badge: "MDN", label: "alpha attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color#additional_attributes" },
  },
  {
    prop: "colorspace",
    type: ['"limited-srgb"', '"display-p3"'],
    default: '"limited-srgb"',
    description: "Hints the picker's color space and gamut. Experimental.",
    source: { badge: "MDN", label: "colorspace attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color#additional_attributes" },
  },
  {
    prop: "list",
    type: "string",
    description: "Id of a <datalist> of preset color swatches the browser offers in the picker.",
    source: { badge: "MDN", label: "list / <datalist>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist" },
  },
  {
    prop: "autocomplete",
    type: "string",
    description: "Browser auto-fill hint. One of the few common attributes the color input supports.",
  },
  { prop: "id", type: "string", description: "Pairs the input with a <label for>." },
  { prop: "name", type: "string", description: "Form field name on submit." },
  { prop: "required", type: "boolean", default: "false", description: "Native HTML required for form validation." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable — unfocusable, not submitted." },
  { prop: "autofocus", type: "boolean", default: "false", description: "Focus this swatch on initial page load (one per document)." },
  { prop: "form", type: "string", description: "Associate with a <form> by id when rendered outside it." },
  {
    prop: "ariaInvalid",
    type: ["boolean", '"grammar"', '"spelling"'],
    description: "Mark the swatch invalid — drives the destructive border/ring styling.",
    source: { badge: "MDN", label: "aria-invalid", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid" },
  },
  { prop: "ariaRequired", type: "boolean", description: "Expose required state to assistive tech." },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const AUTOSIZE_TEXTAREA_PROPS: ApiRow[] = [
  {
    prop: "autosize",
    type: "boolean",
    default: "true",
    description:
      "true sets field-sizing: content so the textarea grows/shrinks to fit its value; false sets field-sizing: fixed — a plain bounded textarea with a drag handle.",
    source: { badge: "MDN", label: "field-sizing", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing" },
  },
  {
    prop: "minHeight",
    type: "string",
    default: '"min-h-16"',
    description:
      "Lower growth bound as a Tailwind height utility. Per MDN, pair min/max height with field-sizing rather than a fixed height (a fixed height would reimpose a static size).",
    source: { badge: "MDN", label: "field-sizing + min/max height", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing#field-sizing_interaction_with_other_size_settings" },
  },
  {
    prop: "maxHeight",
    type: "string",
    default: '"max-h-80"',
    description: "Upper growth bound as a Tailwind height utility. Once the value reaches it the browser shows a scrollbar.",
  },
  {
    prop: "rows / cols",
    type: "number",
    description: "Fallback size only. With field-sizing: content active these have no effect (MDN); they size the control where field-sizing is unsupported.",
    source: { badge: "MDN", label: "<textarea> rows", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#rows" },
  },
  { prop: "minlength / maxlength", type: "number", description: "Length bounds. maxlength also stops the field growing once the character limit is reached." },
  { prop: "wrap", type: ['"hard"', '"soft"', '"off"'], default: '"soft"', description: "Newline handling on submit." },
  { prop: "spellcheck", type: "boolean", description: "Browser spellchecker." },
  { prop: "autocorrect", type: ['"on"', '"off"'], description: "WebKit autocorrect (Safari/iOS)." },
  { prop: "autocapitalize", type: ['"off"', '"on"', '"sentences"', '"words"', '"characters"'], description: "Mobile capitalisation hint." },
  { prop: "dirname", type: "string", description: "Submit text direction (ltr/rtl) as a second form field." },
  ...FORM_FIELD_COMMON,
]

// Add to app/data/api-rows.ts (references the existing CLASS_ROW / HX_ROW partials).
// Place it right before `export const SLIDER_PROPS` to mirror the file's ordering.
export const CASCADING_SELECT_PROPS: ApiRow[] = [
  { prop: "id", type: "string", required: true, description: "Base id. The child select is `${id}-child`, the detail panel `${id}-detail`, the legend `${id}-legend`." },
  { prop: "endpoint", type: "string", required: true, description: "URL the parent select requests on change. Returns the child <option>s, plus an optional detail fragment with hx-swap-oob.", source: { badge: "htmx", label: "Linked selects", href: "https://htmx.org/examples/value-select/" } },
  { prop: "parentName", type: "string", default: '"parent"', description: "Form field name for the parent select; also pinned to the request via hx-include." },
  { prop: "childName", type: "string", default: '"child"', description: "Form field name for the child (dependent) select." },
  { prop: "legend", type: "string", description: "Group label rendered as a <legend>; also wires aria-labelledby on the fieldset." },
  { prop: "parentLabel", type: "string", description: "Visible <label> for the parent select." },
  { prop: "childLabel", type: "string", description: "Visible <label> for the child select." },
  { prop: "children", type: "Child", required: true, description: "The parent <option>s (use CascadingSelectOption)." },
  { prop: "childOptions", type: "Child", description: "Initial child <option>s shown before the first change fires." },
  { prop: "detail", type: "Child", description: "Initial detail-panel content. Omit to drop the detail panel and the OOB swap entirely.", source: { badge: "htmx", label: "hx-swap-oob", href: "https://htmx.org/attributes/hx-swap-oob/" } },
  { prop: "method", type: ['"get"', '"post"'], default: '"get"', description: "Request method for the cascade. GET keeps it idempotent and the no-JS form post shareable." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable the whole group via the <fieldset disabled> attribute.", source: { badge: "MDN", label: "<fieldset disabled>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset" } },
  CLASS_ROW,
  HX_ROW,
]

export const SELECTABLE_TABLE_PROPS: ApiRow[] = [
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name for the <form> region wrapping the table. Use when there is no visible heading naming the table.",
    source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element (e.g. a heading) that names the table. Alternative to ariaLabel.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "BulkAction hx-post",
    type: "string",
    description: "Endpoint for a bulk action. The button sits inside the form, so htmx serialises every checked name=\"selected\" value onto the POST. The button defaults hx-target to the closest [data-slot=selectable-table] form and hx-swap to outerHTML, so the response replaces the whole table.",
    source: { badge: "htmx", label: "hx-post", href: "https://htmx.org/attributes/hx-post/" },
  },
  {
    prop: "BulkAction confirm",
    type: "string",
    description: "Sets hx-confirm on the button. htmx pops the browser's native window.confirm before issuing the request — used to gate destructive actions.",
    source: { badge: "htmx", label: "hx-confirm", href: "https://htmx.org/attributes/hx-confirm/" },
  },
  {
    prop: "BulkAction variant",
    type: ['"default"', '"destructive"'],
    default: '"default"',
    description: "Visual style for the bulk-action button. Use destructive for delete/remove actions.",
  },
  {
    prop: "SelectRowCheckbox value",
    type: "string",
    required: true,
    description: "Identifier submitted for this row when its checkbox is checked. Rendered as <input type=\"checkbox\" name=\"selected\" value>.",
    source: { badge: "MDN", label: "<input type=checkbox>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox" },
  },
  {
    prop: "SelectRowCheckbox checked",
    type: "boolean",
    default: "false",
    description: "Pre-check this row on render (e.g. to restore a server-side selection).",
  },
  {
    prop: "SelectRowCheckbox name",
    type: "string",
    default: '"selected"',
    description: "Form field name for the row checkboxes. Keep the same name across all rows so the checked values submit as one repeated field.",
  },
  {
    prop: "SelectableTableCount children",
    type: "Child",
    description: "Result message rendered into the <output> live region after a bulk POST. <output> is an implicit aria-live region, so the message is announced without moving focus. The running selection count (\"N selected\") is written here by site.js when no server message is present.",
    source: { badge: "MDN", label: "<output>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output" },
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const DELETE_ROW_PROPS: ApiRow[] = [
  {
    prop: "href",
    type: "string",
    required: true,
    description:
      "DELETE endpoint for this row's resource (on DeleteRow). The server must answer 200 with an empty body so htmx swaps the row with nothing; a 204 performs no swap and the row stays.",
    source: { badge: "htmx", label: "hx-delete", href: "https://htmx.org/attributes/hx-delete/" },
  },
  {
    prop: "confirm",
    type: ["string", "null"],
    default: '"Are you sure you want to delete this?"',
    description:
      "Confirmation question shown by window.confirm before each DELETE (on DeleteRowList; inherited by every Delete button via hx-confirm:inherited). Pass null to skip confirmation.",
    source: { badge: "htmx", label: "hx-confirm", href: "https://htmx.org/attributes/hx-confirm/" },
  },
  {
    prop: "target",
    type: "string",
    default: '"closest tr"',
    description:
      'Selector for the element each Delete request removes (on DeleteRowList; inherited as hx-target). Change to match the host element, e.g. "closest li" for a <ul>.',
    source: { badge: "htmx", label: "hx-target", href: "https://htmx.org/attributes/hx-target/" },
  },
  {
    prop: "swapMs",
    type: "number",
    default: "300",
    description:
      'Fade duration in milliseconds. Set on both DeleteRowList (the htmx swap delay, hx-swap="outerHTML swap:Nms") and DeleteRowItem (the CSS transition); the two must match so the row finishes fading before htmx detaches it.',
    source: { badge: "htmx", label: "hx-swap (swap: modifier)", href: "https://htmx.org/attributes/hx-swap/" },
  },
  {
    prop: "as",
    type: ['"tbody"', '"ul"', '"ol"', '"div"', '"tr"', '"li"'],
    default: '"tbody" (list) / "tr" (item)',
    description:
      "Element the host (DeleteRowList) or row (DeleteRowItem) renders as. Defaults suit a table; switch to ul/li (etc.) for non-table lists and set the matching target.",
    source: { badge: "MDN", label: "<tbody>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody" },
  },
  {
    prop: "variant",
    type: ['"default"', '"secondary"', '"destructive"', '"outline"', '"ghost"', '"link"'],
    default: '"ghost"',
    description:
      "Visual style of the Delete button (on DeleteRow). Ghost sits quietly in a cell; destructive makes the affordance louder.",
  },
  {
    prop: "size",
    type: ['"xs"', '"sm"', '"default"', '"lg"', '"icon"', '"icon-xs"', '"icon-sm"', '"icon-lg"'],
    default: '"sm"',
    description: "Size of the Delete button (on DeleteRow). Use an icon-* size with ariaLabel for an icon-only affordance.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the Delete button — skipped from tab order, no request fires.",
  },
  {
    prop: "ariaLabel",
    type: "string",
    description:
      'Accessible name for the Delete button (on DeleteRow). Set this when the visible label is an icon or when several Delete buttons need to be distinguished (e.g. "Delete Joe Smith").',
    source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const OPTIMISTIC_TOGGLE_PROPS: ApiRow[] = [
  {
    prop: "id",
    type: "string",
    required: true,
    description: "Unique id. Seeds the button id and the optimistic <template> id (`{id}-optimistic`) that the data-optimistic behaviour script points at.",
  },
  {
    prop: "pressed",
    type: "boolean",
    default: "false",
    description: "Current persisted state from your server/DB. Sets aria-pressed and the pressed visual treatment.",
    source: { badge: "MDN", label: "aria-pressed", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed" },
  },
  {
    prop: "children",
    type: "Child",
    required: true,
    description: "Visible content for the current (resting) state — icon and/or label.",
  },
  {
    prop: "optimistic",
    type: "Child",
    required: true,
    description: "Visible content for the just-toggled state, rendered into a <template> and swapped in instantly on click before the server responds.",
    source: { badge: "MDN", label: "<template> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template" },
  },
  {
    prop: "hx-post / hx-put / hx-patch / hx-delete",
    type: "string",
    description: "Where to send the toggle request. The server should reply with a fresh toggle button in the new state.",
    source: { badge: "htmx", label: "hx-post", href: "https://htmx.org/attributes/hx-post/" },
  },
  {
    prop: "hx-target",
    type: "string",
    default: '"this"',
    description: "Swap target. Defaults to the button itself so the server response replaces the whole control.",
    source: { badge: "htmx", label: "hx-target", href: "https://htmx.org/attributes/hx-target/" },
  },
  {
    prop: "hx-swap",
    type: "string",
    default: '"outerHTML"',
    description: "Swap strategy. Defaults to outerHTML so the authoritative server button replaces the optimistic one.",
    source: { badge: "htmx", label: "hx-swap", href: "https://htmx.org/attributes/hx-swap/" },
  },
  {
    prop: "variant",
    type: ['"default"', '"outline"', '"ghost"'],
    default: '"default"',
    description: "Pressed-state visual treatment: default fills with primary, outline tints, ghost uses the secondary surface.",
  },
  {
    prop: "size",
    type: ['"default"', '"sm"', '"lg"', '"icon"'],
    default: '"default"',
    description: "Size variant. icon is square with no horizontal padding.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the toggle — skipped from tab order, no click handling.",
  },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const STATUS_PROPS: ApiRow[] = [
  { prop: "as", type: ['"status"', '"log"'], default: '"status"', description: "Structural role. status = single advisory message (atomic); log = append-only ordered sequence (only new entries announced).",
    source: { badge: "APG", label: "Structural Roles", href: "https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/" } },
  { prop: "tone", type: ['"default"', '"muted"', '"success"', '"destructive"'], default: '"muted"', description: "Text tone. Status text is supporting by default." },
  { prop: "ariaAtomic", type: "boolean", description: "Override aria-atomic. Defaults to the role implicit value: status=true, log=false.",
    source: { badge: "MDN", label: "aria-atomic", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-atomic" } },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
  HX_ROW,
]

export const SPLIT_BUTTON_PROPS: ApiRow[] = [
  {
    prop: "menuId",
    type: "string",
    description: "Required. Id of the SplitButtonMenu popup; matched by popovertarget on the toggle.",
    required: true,
    source: { badge: "MDN", label: "popovertarget", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/popovertarget" },
  },
  {
    prop: "label",
    type: "string",
    description: "Visible text of the primary action button. Falls back to children when omitted.",
  },
  {
    prop: "variant",
    type: ['"default"', '"secondary"', '"destructive"', '"outline"'],
    default: '"default"',
    description: "Visual skin shared by both segments.",
  },
  {
    prop: "size",
    type: ['"sm"', '"default"', '"lg"'],
    default: '"default"',
    description: "Height of the action; the toggle stays square and tracks it.",
  },
  {
    prop: "side",
    type: ['"top"', '"right"', '"bottom"', '"left"'],
    default: '"bottom"',
    description: "Which side of the toggle the popup opens on (positioned by site.js).",
  },
  {
    prop: "toggleLabel",
    type: "string",
    default: '"More actions"',
    description: "Accessible name for the icon-only disclosure toggle.",
    source: { badge: "APG", label: "Menu button pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable both the action and the toggle.",
  },
  {
    prop: "type",
    type: ['"button"', '"submit"', '"reset"'],
    default: '"button"',
    description: "Submit / reset semantics for the primary action when nested in a form.",
    source: { badge: "MDN", label: "<button type>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#type" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const LAZY_LOAD_PROPS: ApiRow[] = [
  {
    prop: "src",
    type: "string",
    description:
      "URL this container fetches its own contents from. Sets hx-get. With the default innerHTML swap the response must NOT repeat hx-trigger=\"load\", or the request loops.",
    source: { badge: "htmx", label: "hx-get", href: "https://htmx.org/attributes/hx-get/" },
  },
  {
    prop: "trigger",
    type: ['"load"', '"revealed"', '"intersect"'],
    default: '"load"',
    description:
      "When the fetch fires. \"load\" fires immediately when the element enters the DOM (deferred but eager); \"revealed\" fires when it scrolls into the page viewport; \"intersect\" fires once inside an overflow-y:scroll container (intersect once).",
    source: { badge: "htmx", label: "hx-trigger (load / revealed / intersect)", href: "https://htmx.org/attributes/hx-trigger/" },
  },
  {
    prop: "swap",
    type: ['"innerHTML"', '"outerHTML"'],
    default: '"innerHTML"',
    description:
      "How the response lands. \"innerHTML\" replaces the contents and keeps this reserved-space wrapper; \"outerHTML\" replaces the wrapper wholesale (use when the response brings its own box).",
    source: { badge: "htmx", label: "hx-swap", href: "https://htmx.org/attributes/hx-swap/" },
  },
  {
    prop: "reserve",
    type: "string",
    description:
      "Reserved minimum height (any CSS length, e.g. \"12rem\" or \"200px\"). Sets min-height inline so the box holds its size before content arrives — prevents Cumulative Layout Shift (CLS).",
    source: { badge: "MDN", label: "min-height", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-height" },
  },
  {
    prop: "ariaLabel",
    type: "string",
    default: '"Loading"',
    description:
      "Accessible name for the loading region (e.g. \"Loading sales report\"). The wrapper is a role=\"status\" + aria-busy=\"true\" live region while content is in flight.",
    source: { badge: "MDN", label: "aria-busy", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy" },
  },
  CLASS_ROW,
  HX_ROW,
]

// ---- Sidebar (navigation) ----
export const SIDEBAR_PROPS: ApiRow[] = [
  {
    prop: "id",
    type: "string",
    required: true,
    description:
      "On <Sidebar>: the id targeted by the trigger's href fragment (#id). Drives the no-JS :target open/close. Triggers/scrims reference it via sidebarFor.",
    source: { badge: "MDN", label: ":target", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/:target" },
  },
  {
    prop: "sidebarFor",
    type: "string",
    required: true,
    description:
      "On <SidebarTrigger> / <SidebarScrim>: the id of the <Sidebar> to open/close. The trigger renders <a href=\"#sidebarFor\">; the scrim renders <a href=\"#\">.",
  },
  {
    prop: "label",
    type: "string",
    default: '"Menu"',
    description:
      "<SidebarTrigger> only. Visible hamburger text and the source of its accessible name (aria-label=\"Open {label}\").",
  },
  {
    prop: "href",
    type: "string",
    required: true,
    description:
      "<SidebarItem> only. Destination of the nav link, rendered as a real <a href> (role=link + Enter-to-activate come from the platform).",
    source: { badge: "MDN", label: "<a href>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#href" },
  },
  {
    prop: "current",
    type: "boolean",
    default: "false",
    description:
      "<SidebarItem> only. Marks the link to the current page — sets aria-current=\"page\" and the active (primary-filled) styling.",
    source: { badge: "MDN", label: "aria-current", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current" },
  },
  {
    prop: "icon",
    type: "Child",
    description: "<SidebarItem> only. Optional leading icon rendered before the label.",
  },
  {
    prop: "ariaLabel",
    type: "string",
    description:
      "<Sidebar> only. Accessible name for the <nav> landmark. Give each navigation landmark a unique name when a page has more than one.",
    source: { badge: "MDN", label: "navigation role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/navigation_role" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "<Sidebar> only. Id of a visible element (e.g. the header) that names the nav landmark, used instead of ariaLabel.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "--sidebar-w",
    type: "CSS length",
    default: "16rem",
    description: "Custom property on <SidebarLayout> setting the rail's minimum width in the grid track minmax(--sidebar-w, 20rem).",
    source: { badge: "MDN", label: "minmax()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/minmax" },
  },
  {
    prop: "--sidebar-h",
    type: "CSS length",
    default: "100svh",
    description: "Custom property on <SidebarLayout> setting the shell + rail height. Lower it (e.g. 22rem) to fit a bounded container instead of the full viewport.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const ASPECT_RATIO_PROPS: ApiRow[] = [
  { prop: "ratio", type: ["number", "string"], default: '"16/9"', description: "Width-to-height ratio. A number (1.778) or a \"w/h\" string (\"16/9\", \"4/3\", \"1/1\"). Maps to Tailwind's aspect-* utility; \"1/1\" -> aspect-square, \"16/9\" -> aspect-video, anything else -> aspect-[w/h].",
    source: { badge: "MDN", label: "aspect-ratio", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" } },
  { prop: "fit", type: ['"cover"', '"contain"'], default: '"cover"', description: "How a replaced child (img/video) fills the box. cover scales up and crops; contain letterboxes so nothing is cut off. Has no effect on iframe/embed children.",
    source: { badge: "MDN", label: "object-fit", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit" } },
  { prop: "children", type: "Child", required: true, description: "The locked element: an <img>, <video>, <iframe>, <embed>, or any block. A single valid element child is cloned so size-full + object-fit classes land directly on it." },
  CLASS_ROW,
  HX_ROW,
]

export const AUTO_GRID_PROPS: ApiRow[] = [
  {
    prop: "min",
    type: "string",
    default: '"16rem"',
    description: "Minimum per-item width (any CSS length, e.g. \"16rem\", \"200px\", \"20ch\"). Drives how many columns fit. Published as the --auto-grid-min custom property and read inside minmax().",
    source: { badge: "MDN", label: "minmax()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/minmax" },
  },
  {
    prop: "gap",
    type: ["number", "string"],
    default: "4",
    description: "Gap between cells. A number maps to gap-<n> (0,1,2,3,4,5,6,8,10,12); a string is appended verbatim as a class.",
  },
  {
    prop: "fill",
    type: "boolean",
    default: "false",
    description: "Use auto-fill (keep empty trailing tracks) instead of auto-fit (collapse them so real items stretch to fill the row).",
    source: { badge: "MDN", label: "repeat()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/repeat" },
  },
  {
    prop: "as",
    type: ['"div"', '"ul"', '"ol"', '"section"'],
    default: '"div"',
    description: "Semantic element / role for the grid container. Use ul/ol when the cells are a genuine list (children should be <li>).",
  },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
  HX_ROW,
]
