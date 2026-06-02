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
    prop: "ariaDisabled",
    type: "boolean",
    default: "false",
    description: "Mark the button unavailable while keeping it focusable (stays in the tab order so a screen reader can land on it). Independent of disabled.",
    source: { badge: "MDN", label: "aria-disabled", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled" },
  },
  {
    prop: "pressed",
    type: ["boolean", '"mixed"'],
    description: "Toggle-button state forwarded to aria-pressed. Tri-state: true, false, or \"mixed\" when the controlled items do not all share one value. Keep the label constant across states.",
    source: { badge: "MDN", label: "aria-pressed", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed" },
  },
  {
    prop: "ariaExpanded",
    type: "boolean",
    description: "Disclosure state forwarded to aria-expanded for a trigger that shows/hides a panel or menu.",
    source: { badge: "MDN", label: "aria-expanded", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded" },
  },
  {
    prop: "ariaHaspopup",
    type: ["boolean", '"menu"', '"listbox"', '"tree"', '"grid"', '"dialog"'],
    description: "Announces that the button opens a popup, and of what kind, via aria-haspopup. true is equivalent to \"menu\".",
    source: { badge: "MDN", label: "aria-haspopup", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup" },
  },
  {
    prop: "ariaControls",
    type: "string",
    description: "Id of the element this button controls (e.g. the popup or panel it expands), forwarded to aria-controls.",
    source: { badge: "MDN", label: "aria-controls", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls" },
  },

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
  { prop: "spellcheck", type: "boolean", description: "Browser spellchecker hint (enumerated global attribute). Set false for fields holding PII, codes, usernames, or tokens — spellcheck content may be sent to a third party (\"spell-jacking\")." },
  { prop: "autocorrect", type: ['"on"', '"off"'], description: "Autocorrect hint (enumerated global attribute). Disable for names, usernames, addresses, or coupon/API codes where OS autocorrect is harmful. password/email/url are always off per spec." },

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
  { prop: "inputmode", type: '"none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"', default: "—", description: "Hints which virtual keyboard the OS should show for this multi-line field (e.g. numeric/decimal). Enumerated global attribute, valid on textarea." },
{ prop: "enterkeyhint", type: '"enter" | "done" | "go" | "next" | "previous" | "search" | "send"', default: "—", description: "Labels the soft-keyboard Enter key (e.g. send for a chat composer). Relevant when deciding whether Enter inserts a newline or submits." },
{ prop: "ariaErrormessage", type: "string", default: "—", description: "Id of a visible error-message element describing the validation error. Meaningful only alongside ariaInvalid set to true." },

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
  { prop: "hx-*", type: "any", description: "Any htmx attribute. Forwarded onto the underlying <label> element (already supported via attribute passthrough in all 5 flavours).", source: { badge: "htmx", label: "Attribute reference", href: "https://htmx.org/reference/" } },

  { prop: "htmlFor", type: "string", description: "Id of the associated input. Renders as <label for=\"...\"> — clicking the label focuses the input." },
  { prop: "id", type: "string", description: "Set when another control needs aria-labelledby on this." },
  CLASS_ROW,
]

export const CHECKBOX_PROPS: ApiRow[] = [
  { prop: "indeterminate", type: "boolean", description: "Render data-initial-indeterminate=\"true\" on the input so an on-mount script can set the IDL-only el.indeterminate (no HTML attribute exists for it per WHATWG HTML). Use for tri-state select-all rows." },

  { prop: "checked", type: "boolean", description: "Controlled checked state." },
  { prop: "defaultChecked", type: "boolean", description: "Initial checked state at render." },
  { prop: "indeterminate", type: "boolean", description: "Tri-state — set via JS DOM property after mount." },
  { prop: "ariaChecked", type: ['"true"', '"false"', '"mixed"'], description: "Override aria-checked for non-native variants." },
  { prop: "ariaReadonly", type: "boolean", description: "Mark as read-only without disabling focus." },
  { prop: "ariaErrormessage", type: "string", description: "Id of a visible error message element." },
  ...FORM_FIELD_COMMON.filter((r) => !["readonly", "value", "placeholder"].includes(r.prop)),
]

export const SWITCH_PROPS: ApiRow[] = [
  { prop: "autofocus", type: "boolean", description: "Focus this switch on initial page load (one per document)." },

  { prop: "size", type: ['"default"', '"sm"'], default: '"default"', description: "Visual size variant." },
  { prop: "checked", type: "boolean", description: "Controlled checked state." },
  { prop: "ariaReadonly", type: "boolean", description: "Read-only switch — focusable but non-toggleable." },
  ...FORM_FIELD_COMMON.filter((r) => !["readonly", "value", "placeholder"].includes(r.prop)),
]

export const RADIO_GROUP_PROPS: ApiRow[] = [
  { prop: "form", type: "string", description: "Associate the radio with a <form> by its id when rendered outside that form (common in SSR/htmx swaps).", source: { badge: "MDN", label: "<input> form", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form" } },
  { prop: "autocomplete", type: "string", description: "Control cross-load checked-state persistence. Pass \"off\" to stop the browser re-applying a prior selection on reload / back-forward.", source: { badge: "MDN", label: "input/radio autocomplete", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio" } },
  HX_ROW,

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
  { prop: "ariaErrormessage", type: "string", description: "Id of a visible error message element. Pair with ariaInvalid=\"true\" so assistive tech announces why the field is invalid." },

  ...FORM_FIELD_COMMON.filter((r) => !["placeholder", "readonly"].includes(r.prop)),
  { prop: "multiple", type: "boolean", default: "false", description: "Allow multi-select (renders as a listbox)." },
  { prop: "size", type: "number", default: "1", description: "Number of visible rows (>= 2 forces listbox)." },
  { prop: "autofocus", type: "boolean", description: "Focus on initial page load." },
]

export const SLIDER_PROPS: ApiRow[] = [
  { prop: "list", type: "string", description: "Id of a <datalist> whose <option> values render tick marks on the track (e.g. temperature presets).", source: { badge: "MDN", label: "range tick marks", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range#adding_tick_marks" } },

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
  { prop: "CardTitle.as", type: ['"div"', '"h1"', '"h2"', '"h3"', '"h4"', '"h5"', '"h6"'], default: '"div"', description: "Element CardTitle renders. Use a heading (h1-h6) so an article/section card has a child heading in the document outline.",
    source: { badge: "MDN", label: "section element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section" } },
  { prop: "CardTitle.id", type: "string", description: "Id on CardTitle. Point Card's ariaLabelledby at it to name a section/article card from its visible heading.",
    source: { badge: "MDN", label: "region role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/region_role" } },

  { prop: "as", type: ['"div"', '"article"', '"section"', '"li"', '"aside"'], default: '"div"', description: "Semantic element. Use article for self-contained content." },
  { prop: "ariaLabelledby", type: "string", description: "Id of a CardTitle inside to give the landmark an accessible name." },
  { prop: "ariaLabel", type: "string", description: "Accessible name when there's no CardTitle." },
  CLASS_ROW,
]

export const AVATAR_PROPS: ApiRow[] = [
  { prop: "loading", type: '"eager" | "lazy"', default: "—", description: "Native <img> loading attribute, forwarded to the inner image. Use \"lazy\" to defer fetching avatars that are off-screen in long lists until they near the viewport. Only applies when src is set." },
{ prop: "referrerpolicy", type: '"no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url"', default: "—", description: "Native <img> referrerpolicy, forwarded to the inner image. Useful when src is a third-party host (Gravatar/OAuth/CDN); e.g. \"no-referrer\" avoids leaking the page URL. Only applies when src is set." },
{ prop: "srcset", type: "string", default: "—", description: "Native <img> srcset, forwarded to the inner image. Primarily for the retina pixel-density case, e.g. \"avatar@2x.jpg 2x\"; src acts as the 1x fallback. Only applies when src is set." },
{ prop: "sizes", type: "string", default: "—", description: "Native <img> sizes, forwarded to the inner image. Pair with a width-descriptor srcset; not needed for the common 2x density case. Only applies when src is set." },

  { prop: "src", type: "string", description: "Image URL. Omit for fallback-only avatar." },
  { prop: "alt", type: "string", description: "Image alt text. Empty for decorative." },
  { prop: "fallback", type: "string", description: "Text shown when src is missing or 404s (typically initials)." },
  { prop: "size", type: ['"sm"', '"default"', '"lg"'], default: '"default"', description: "Visual size." },
  { prop: "ariaLabel", type: "string", description: "Accessible name when src is omitted." },
  CLASS_ROW,
]

export const BADGE_PROPS: ApiRow[] = [
  { prop: "target / rel / download / referrerpolicy / hreflang / type / ping", type: "string", description: "Anchor attributes forwarded to the underlying <a> when as=\"a\" (or via asChild). Use target=\"_blank\" (with rel=\"noopener\") for new-tab link badges, and download for download badges.", source: { badge: "MDN", label: "<a>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a" } },
  HX_ROW,

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
  { prop: "ariaLabelledby", type: "string", default: "—", description: "id of the AlertTitle (or other visible text) that names the live region. Some screen readers announce a status region's name before its contents; aria-labelledby wires that up. Forwarded as aria-labelledby on the alert div. Omitted when unset." },
{ prop: "ariaLabel", type: "string", default: "—", description: "Literal accessible name for the live region when no visible label element exists. Forwarded as aria-label on the alert div. Prefer ariaLabelledby when an AlertTitle is present. Omitted when unset." },

  { prop: "variant", type: ['"default"', '"destructive"', '"success"', '"warning"', '"info"'], default: '"default"', description: "Colour variant." },
  { prop: "live", type: ['"off"', '"polite"', '"assertive"'], default: '"polite"', description: "Live-region politeness. polite = role=status, assertive = role=alert.",
    source: { badge: "MDN", label: "aria-live", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live" } },
  { prop: "role", type: ['"alert"', '"status"', '"log"', '"none"'], description: "Direct override; takes precedence over live." },
  { prop: "ariaAtomic", type: "boolean", default: "true", description: "Read the entire alert on update (vs only changed parts)." },
  CLASS_ROW,
]

export const PROGRESS_PROPS: ApiRow[] = [
  { prop: "hx-*", type: "any", description: "Any htmx attribute, forwarded onto the root progressbar element. Progress is the textbook htmx polling target: re-render the bar from the server on a recurring trigger, e.g. hx-get=\"/upload/status\" hx-trigger=\"every 2s\" hx-swap=\"outerHTML\".", source: { badge: "htmx", label: "Attribute reference", href: "https://htmx.org/reference/" } }, { prop: "data-*", type: "any", description: "Any data-* attribute, forwarded onto the root progressbar element." },

  { prop: "value", type: "number", description: "Current value 0-max. Omit for indeterminate." },
  { prop: "min", type: "number", default: "0", description: "Minimum value." },
  { prop: "max", type: "number", default: "100", description: "Maximum value." },
  { prop: "ariaValuetext", type: "string", description: "Human-readable value (e.g. \"42 of 100 MB\")." },
  ...COMMON_ARIA,
  CLASS_ROW,
]

export const SKELETON_PROPS: ApiRow[] = [
  { prop: "ariaLabelledby", type: "string", default: "—", description: "References the id of a visible label (e.g. a section heading) to name the status region. Per the status role spec, prefer this over aria-label when a name is already visible on the page. When provided it supersedes the default \"Loading\" aria-label, so the two are never emitted together." },

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
  { prop: "closeHx", type: "object", description: "Optional htmx attributes (hx-get/post/put/patch/delete/target/swap/trigger/indicator/confirm/vals) forwarded onto the close button so dismissing also notifies the server (mark-read, analytics) while site.js still removes the node.", source: { badge: "htmx", label: "Attribute reference", href: "https://htmx.org/reference/" } },

  { prop: "variant", type: ['"default"', '"destructive"', '"success"', '"warning"', '"info"'], default: '"default"', description: "Visual variant." },
  { prop: "duration", type: "number", default: "5000", description: "Auto-dismiss timeout in ms. 0 keeps it until user clicks the X." },
  { prop: "live", type: ['"polite"', '"assertive"'], default: '"polite"', description: "Live-region politeness." },
  { prop: "showClose", type: "boolean", default: "true", description: "Render the X close button." },
  CLASS_ROW,
]

// ---- Overlays --------------------------------------------------------

export const DIALOG_PROPS: ApiRow[] = [
  { prop: "DialogTrigger native", type: "boolean", default: "false", description: "Opt-in: render a native Invoker Commands button (command=\"show-modal\" commandfor={dialogFor}) that opens the dialog as a modal with zero JS — the declarative equivalent of .showModal(). The data-dialog-trigger + site.js path stays the default fallback.", source: { badge: "MDN", label: "button command/commandfor", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command" } },
  { prop: "DialogClose command", type: ['"close"', '"request-close"'], description: "Opt-in native invoker close button. \"close\" = declarative .close(); \"request-close\" fires a cancelable cancel event first so an unsaved-changes guard can preventDefault() it. Without this prop, DialogClose keeps its data-dialog-close + site.js behaviour.", source: { badge: "MDN", label: "button command", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command" } },
  { prop: "DialogClose commandfor", type: "string", description: "Target dialog id for the native invoker close button. Defaults to the closest <dialog> ancestor; set it when the button lives outside the dialog. Only used when command is set." },
  { prop: "DialogClose value", type: "string", description: "Button value. With command=\"close\"/\"request-close\" the platform copies it into HTMLDialogElement.returnValue, so the close event can tell which control closed the dialog (e.g. \"confirm\" vs \"cancel\").", source: { badge: "MDN", label: "button value -> returnValue", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#value" } },

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
  { prop: "role", type: "string", description: "ARIA role for the popover element (e.g. menu, listbox, dialog). The native popover attribute assigns no role; emitted only when provided.",
    source: { badge: "MDN", label: "Popover accessibility", href: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#accessibility_features" } },
  { prop: "ariaLabelledby", type: "string", description: "Forwarded as aria-labelledby to give the popover an accessible name from another element. Emitted only when provided." },
  { prop: "ariaLabel", type: "string", description: "Forwarded as aria-label to give the popover an inline accessible name. Emitted only when provided." },

  { prop: "id", type: "string", required: true, description: "Used by PopoverTrigger's popoverTarget." },
  { prop: "mode", type: ['"auto"', '"manual"'], default: '"auto"', description: "auto = light dismiss + ESC. manual = only code can toggle.",
    source: { badge: "MDN", label: "popover attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover" } },
  { prop: "side", type: ['"top"', '"right"', '"bottom"', '"left"'], default: '"bottom"', description: "Placement relative to trigger (positioned by site.js)." },
  CLASS_ROW,
]

export const DROPDOWN_MENU_PROPS: ApiRow[] = [
  { prop: "ariaLabelledBy", type: "string", description: "ID of the trigger (or other element) whose text names the menu. role=\"menu\" requires an accessible name; this is the canonical menu-button wiring. Emits aria-labelledby on the menu.", source: { label: "menu role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_role", badge: "MDN" } },
{ prop: "ariaLabel", type: "string", description: "Accessible name for the menu when there is no visible label to reference (e.g. an icon-only trigger). Emits aria-label on the menu.", source: { label: "menu role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_role", badge: "MDN" } },

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
  { prop: "ariaLabelledby", type: "string", description: "TabsList: id of a visible heading that labels the tablist. APG prefers this over ariaLabel when a visible label exists; use ariaLabel only when there is no visible label.",
    source: { badge: "APG", label: "Tabs labelling rule", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#wai-ariaroles,states,andproperties" } },
  { prop: "hx-* / data-* / aria-*", type: "string", description: "TabsTrigger: extra attributes forwarded onto the underlying tab button. The idiomatic host for the htmx lazy-load pattern (hx-get + hx-trigger=\"click once\") so a panel is fetched only when its tab is activated; fixed contract attributes (type, role, data-slot, data-tab-trigger, class) cannot be overridden.",
    source: { badge: "htmx", label: "Lazy loading", href: "https://htmx.org/examples/lazy-load/" } },

  { prop: "id", type: "string", required: true, description: "Used to scope keyboard handlers + assign per-trigger ids." },
  { prop: "value", type: "string", required: true, description: "Initial active tab's value." },
  { prop: "orientation", type: ['"horizontal"', '"vertical"'], default: '"horizontal"', description: "Layout + aria-orientation + arrow-key axis." },
  { prop: "activation", type: ['"automatic"', '"manual"'], default: '"automatic"', description: "automatic: arrow keys also activate. manual: Space/Enter to activate.",
    source: { badge: "APG", label: "Manual vs automatic activation", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#kbd_label" } },
  CLASS_ROW,
]

export const ACCORDION_PROPS: ApiRow[] = [
  {
    prop: "hx-*",
    type: "any",
    description: "Any htmx attribute. Forwarded onto the underlying element via the ...rest spread on AccordionItem (<details>), AccordionTrigger (<summary>), and AccordionContent (<div>).",
    source: { badge: "htmx", label: "Attribute reference", href: "https://htmx.org/reference/" },
  },
  {
    prop: "...rest (toggle lazy-load)",
    type: "any",
    description: "Arbitrary global / hx-* attributes pass through to the rendered element. Because <details> fires a native toggle event just after open/close and hx-trigger accepts any DOM event, hx-trigger=\"toggle once\" hx-get=\"/panel\" on an item fetches its content only on first open — the canonical zero-JS lazy-load pattern.",
    source: { badge: "MDN", label: "toggle event", href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/toggle_event" },
  },

  { prop: "id", type: "string", required: true, description: "Used as the exclusive-group name for single-expand." },
  { prop: "type", type: ['"single"', '"multiple"'], default: '"multiple"', description: "single uses the new HTML <details name> for exclusive expansion.",
    source: { badge: "MDN", label: "<details name>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name" } },
  CLASS_ROW,
]

export const PAGINATION_PROPS: ApiRow[] = [
  { prop: "rel", type: "string", default: '"prev" / "next"', description: "Forwarded to the Previous/Next <a>. Defaults to the WHATWG sequence link types rel=\"prev\" / rel=\"next\"; overridable. Only emitted on the enabled anchor (dropped when disabled renders a <button>).", source: { badge: "WHATWG", label: "Link types: prev/next", href: "https://html.spec.whatwg.org/multipage/links.html#sequential-link-types" } },
{ prop: "disabled", type: "boolean", default: "false", description: "Dead-ends Previous/Next at the first/last page. Drops href and renders a native <button disabled> (removed from tab order, activation suppressed) while keeping aria-disabled=\"true\" — aria-disabled alone does not block keyboard activation.", source: { badge: "MDN", label: "aria-disabled", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled" } },

  { prop: "ariaLabel", type: "string", default: '"Pagination"', description: "Landmark name for the <nav>." },
  CLASS_ROW,
]

export const TABLE_PROPS: ApiRow[] = [
  { prop: "TableHead · colspan", type: "number", default: "—", description: "Number of columns the header cell spans. Maps to the native <th> colspan attribute. Use for grouped column headers (e.g. a header spanning two sub-columns)." },
{ prop: "TableHead · rowspan", type: "number", default: "—", description: "Number of rows the header cell spans. Maps to the native <th> rowspan attribute. 0 spans to the end of the row group." },
{ prop: "TableHead · id", type: "string", default: "—", description: "id for the header cell. Reference it from a cell's headers attribute to explicitly associate data cells with their headers in complex tables." },
{ prop: "TableHead · headers", type: "string", default: "—", description: "Space-separated list of header cell ids this header is associated with. Used for multi-level headers where scope alone is insufficient." },
{ prop: "TableHead · abbr", type: "string", default: "—", description: "Short alternative label assistive technologies may announce in place of a verbose column title. Native <th> abbr attribute (not for data cells)." },
{ prop: "TableCell · rowspan", type: "number", default: "—", description: "Number of rows the data cell spans. Maps to the native <td> rowspan attribute. 0 spans to the end of the row group." },
{ prop: "TableCell · id", type: "string", default: "—", description: "id for the data cell, so other cells can reference it via their headers attribute." },
{ prop: "TableCell · headers", type: "string", default: "—", description: "Space-separated list of header cell ids that head this data cell. Use for complex tables where scope alone cannot convey the associations." },

  { prop: "wrapperClass", type: "string", description: "Tailwind classes appended to the overflow-x wrapper." },
  CLASS_ROW,
]

// ---- New APG components (batch A) ----

export const METER_PROPS: ApiRow[] = [
  {
    prop: "title",
    type: "string",
    description: "Free-form units hint, e.g. title=\"gigabytes\". Per WHATWG HTML, <meter> has no units attribute and the global title is the only standard way to convey units. Forwarded to the native element.",
    source: { badge: "MDN", label: "<meter> global attributes", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter" },
  },

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
  { prop: "autocomplete", type: "string", default: "—", description: "Browser autofill hint forwarded to the native input (a supported common attribute on input type=number), e.g. \"postal-code\" or \"transaction-amount\". MDN input/number Accessibility section." }, { prop: "ariaValuetext", type: "string", default: "—", description: "Human-readable value announced by screen readers when the raw number is not user-friendly (currency, units, formatted quantities). Rendered as aria-valuetext on the spinbutton input. APG spinbutton pattern." },

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
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible heading that names the <nav> landmark (Breadcrumb root). When set, aria-label is not emitted so the landmark has a single name source. Use aria-label OR aria-labelledby, not both.",
    source: { badge: "APG", label: "Breadcrumb pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" },
  },
  {
    prop: "data-*",
    type: "string",
    description: "Global data-* attribute, forwarded onto the rendered element. Now also accepted on BreadcrumbSeparator and BreadcrumbEllipsis (e.g. a CSS/JS hook), matching the other subcomponents.",
    source: { badge: "MDN", label: "data-* global attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*" },
  },

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
    prop: "ariaDescribedby",
    type: "string",
    description: "Id of an element describing the link (announced after its name) — e.g. a \"PDF, 2MB\" or \"opens in new tab\" note. Applied to both the native anchor and the role=link fallback.",
    source: { badge: "MDN", label: "aria-describedby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby" },
  },

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
    prop: "hx-trigger=\"toggle once\"",
    type: "string",
    description: "Lazy-load the disclosure's contents the first time it opens. The root <details> fires a native toggle event whenever its open/closed state changes, and hx-trigger accepts any DOM event — so pairing hx-trigger=\"toggle once\" with hx-get/hx-post on the root fetches heavy panel content on first open with zero JS. Forwarded onto the underlying <details> via the standard hx-* passthrough.",
    source: { badge: "MDN", label: "details: toggle event", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#events" },
  },

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
  { prop: "list", type: "string", description: "Id of a <datalist> rendering tick marks / snap points on the track. Applied to both thumbs since they share min/max/step.", source: { badge: "MDN", label: "<input type=range> list", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range#list" } },

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
    prop: "ariaControls",
    type: "string",
    description: "Id(s) of the element the toolbar operates on, set as aria-controls on the role=\"toolbar\" container. Use for a formatting/editor toolbar to name the editor or region it acts on (e.g. a textarea), as in the canonical APG toolbar example.",
    source: { badge: "APG", label: "Toolbar example (aria-controls on the toolbar)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar/" },
  },

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
    prop: "required",
    type: "boolean",
    default: "false",
    description:
      "Group-level requirement that one option must be chosen. Sets aria-required on the container. The styled listbox submits via a hidden input, so the native required attribute cannot apply; aria-required is the only way to convey it (mirrors RadioGroup).",
    source: { badge: "MDN", label: "listbox role (aria-required)", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role" },
  },
  {
    prop: "ariaInvalid",
    type: "boolean",
    description:
      "Mark the widget invalid for the WCAG error-identification pattern (e.g. a required listbox submitted empty, or server validation over htmx). Emits aria-invalid on the container. Pair with ariaErrormessage.",
    source: { badge: "MDN", label: "aria-invalid", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid" },
  },
  {
    prop: "ariaErrormessage",
    type: "string",
    description:
      "Id of a visible element holding the error message. Emits aria-errormessage on the container. Pair with ariaInvalid for the full WCAG error-identification pattern.",
    source: { badge: "MDN", label: "aria-errormessage", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage" },
  },
  {
    prop: "ariaReadonly",
    type: "boolean",
    default: "false",
    description:
      "Locked-but-operable: the user cannot change which options are selected but the listbox stays focusable and navigable. Sets aria-readonly. Distinct from disabled, which makes the options inert.",
    source: { badge: "MDN", label: "aria-readonly", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-readonly" },
  },

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
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element (e.g. a heading) that names the menubar. APG prefers aria-labelledby over aria-label when a visible label exists (alternative to ariaLabel).",
    source: { badge: "MDN", label: "menubar role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role" },
  },
  {
    prop: "<MenubarShortcut>",
    type: "Child",
    description: "Presentational accelerator hint (e.g. \"⌘S\") rendered at the trailing edge of a MenubarItem. It is aria-hidden; expose the real shortcut to assistive tech by passing aria-keyshortcuts on the MenubarItem (forwarded onto the element).",
    source: { badge: "MDN", label: "aria-keyshortcuts", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts" },
  },

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
    prop: "<TreeItem> current",
    type: ["true", "\"page\""],
    description:
      "Marks the node that represents the current page/location, emitting aria-current (\"page\" for the boolean form). Distinct from selected: current is where you ARE, selected is what an action targets. Primary for trees used as htmx navigation.",
    source: { badge: "APG", label: "Tree View navigation example (aria-current)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/" },
  },
  {
    prop: "<TreeItem> level",
    type: "number",
    description:
      "Emits aria-level (1-based depth). Required only for lazy-loaded (htmx) trees whose full node set is not yet in the DOM; static, fully rendered trees can omit it and let the browser compute level from the DOM.",
    source: { badge: "MDN", label: "treeitem role (aria-level under dynamic loading)", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/treeitem_role" },
  },
  {
    prop: "<TreeItem> posinset",
    type: "number",
    description:
      "Emits aria-posinset (1-based position among its siblings). Required only for lazy-loaded (htmx) trees where the sibling set is not fully present in the DOM; otherwise the browser computes it.",
    source: { badge: "MDN", label: "treeitem role (aria-posinset under dynamic loading)", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/treeitem_role" },
  },
  {
    prop: "<TreeItem> setsize",
    type: "number",
    description:
      "Emits aria-setsize (number of nodes in the sibling set). Required only for lazy-loaded (htmx) trees where siblings are not fully present in the DOM; otherwise the browser computes it.",
    source: { badge: "MDN", label: "treeitem role (aria-setsize under dynamic loading)", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/treeitem_role" },
  },

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
  // Add to FEED_ARTICLE_PROPS (before CLASS_ROW):
{
  prop: "tabindex",
  type: "0 | -1",
  default: "0",
  description: "Article's tabindex. MDN's feed role allows each article to be focusable with 0 or -1; pass -1 to keep a long feed to a single Tab stop via a roving tabindex (only the active article stays in the Tab sequence, Page Up/Down moves between articles).",
  source: { badge: "MDN", label: "feed role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role" },
},
// Add to FEED_SENTINEL_PROPS (before CLASS_ROW):
{
  prop: "busy",
  type: "boolean",
  default: "false",
  description: "Sets aria-busy=\"true\" on the in-flight placeholder while a batch loads — the documented \"aria-busy rides on the sentinel\" contract. The outerHTML swap clears it by replacing this element with the response, so it never has to be reset to false manually.",
  source: { badge: "APG", label: "aria-busy", href: "https://www.w3.org/WAI/ARIA/apg/patterns/feed/#wai-ariaroles,states,andproperties" },
},

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
    prop: "ariaMultiselectable",
    type: "boolean",
    description: "Set on the grid when more than one cell/row can be selected. Pair with the selected prop on GridRow/GridCell; selectable-but-unselected nodes should then carry aria-selected=\"false\" so AT advertises that multiple selection is allowed.",
    source: { badge: "MDN", label: "aria-multiselectable", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-multiselectable" },
  },
  {
    prop: "ariaColindex",
    type: "number",
    description: "GridRow only. 1-based column index of the row's first cell. When the visible columns are contiguous, set this once on the row (instead of per cell) and browsers compute each cell's column number; use the per-cell ariaColindex form only when columns are non-contiguous.",
    source: { badge: "MDN", label: "aria-colindex", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-colindex" },
  },

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
    type: "(string | { label: string; sort?: \"none\" | \"ascending\" | \"descending\"; class?: string })[]",
    description:
      "<Treegrid> only. Column headers. Each entry is a plain label string, or a descriptor object to mark a sortable column. A descriptor's sort is emitted as aria-sort on that <th role=\"columnheader\"> (per APG, aria-sort lives on the header cell, not the grid); any hx-*/data-*/aria-* keys on the descriptor forward onto the header so the sorted column can be re-fetched via htmx. Plain-string columns render exactly as before with no aria-sort.",
    source: { badge: "APG", label: "Treegrid roles, states & properties (aria-sort)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/#wai-ariaroles,states,andproperties" },
  },

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
  { prop: "ariaValuetext", type: "string", default: "—", description: "Human-readable value announced by assistive tech in place of the bare aria-valuenow number on the divider (e.g. \"Files, 30%\"). Per MDN, a focusable role=separator may carry aria-valuetext when aria-valuenow alone is not optimal." },

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
  { prop: "<FormLandmark>", type: "<form>", description: "Form landmark. A <form> exposes the form role only when it has an accessible name — always pass ariaLabel or ariaLabelledby (give each a unique label). Use <SearchLandmark> instead when the form performs a search. action/method/hx-* forward through to the native <form>.", source: { badge: "MDN", label: "form role", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/form_role" } },

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

// ---- New components (tier-3) ----

export const KBD_PROPS: ApiRow[] = [
  {
    prop: "keys",
    type: "Child[]",
    description:
      "KbdGroup only. Render one key cap (a nested <kbd>) per entry, joined by separator. Omit and pass children to compose a shortcut by hand. Follows MDN's nested-<kbd> keystroke pattern.",
    source: { badge: "MDN", label: "Representing keystrokes within an input", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd#representing_keystrokes_within_an_input" },
  },
  {
    prop: "separator",
    type: "Child",
    default: '"+"',
    description: 'KbdGroup only. Node rendered between keys (aria-hidden so it is not announced). Set "" for no separator.',
  },
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name. Use on symbol-only caps (e.g. \"⌘\" with ariaLabel=\"Command\") so AT announces a word, not the raw glyph; or on a KbdGroup to name the whole shortcut.",
    source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" },
  },
  {
    prop: "title",
    type: "string",
    description: "Kbd only. Native browser tooltip shown on hover.",
    source: { badge: "MDN", label: "title attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const HIGHLIGHT_PROPS: ApiRow[] = [
  {
    prop: "text",
    type: "string",
    description:
      "The source text to scan for matches. Its original casing is preserved in the output (only this string is sliced, never the query). Omit in single-term mode.",
    source: { badge: "MDN", label: "<mark> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/mark" },
  },
  {
    prop: "query",
    type: "string",
    description:
      "The query to mark inside text. Empty or undefined renders text verbatim with no marks. The query is escaped before matching, so punctuation matches literally.",
  },
  {
    prop: "words",
    type: "boolean",
    default: "false",
    description:
      "Highlight each whitespace-separated term in query independently. Off treats the whole query as a single phrase.",
  },
  {
    prop: "caseSensitive",
    type: "boolean",
    default: "false",
    description: "Require an exact-case match. By default matching is case-insensitive.",
  },
  {
    prop: "children",
    type: "Child",
    description:
      "Single-term mode: when present, the children are wrapped verbatim in one <mark> and text/query are ignored. Use when the server already knows the exact run to mark.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const RELATIVE_TIME_PROPS: ApiRow[] = [
  {
    prop: "datetime",
    type: "string",
    required: true,
    description: "Machine-readable instant for the datetime attribute. An ISO 8601 string (e.g. 2024-05-12T09:00:00Z) is what the script can re-localise; any valid HTML datetime value still renders.",
    source: { badge: "MDN", label: "<time> datetime", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time" },
  },
  {
    prop: "format",
    type: ['"relative"', '"datetime"'],
    default: '"relative"',
    description: "How the optional script formats the label: relative renders 3 days ago via Intl.RelativeTimeFormat; datetime renders an absolute, locale/timezone-aware date+time via Intl.DateTimeFormat.",
    source: { badge: "MDN", label: "Intl.RelativeTimeFormat", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat" },
  },
  {
    prop: "tone",
    type: ['"default"', '"muted"'],
    default: '"muted"',
    description: "Text colour. muted for supporting timestamps, default for foreground emphasis.",
  },
  {
    prop: "children",
    type: "Child",
    required: true,
    description: "Server-rendered human label shown verbatim when JavaScript is off. The script replaces this text once Intl is available.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const FIGURE_PROPS: ApiRow[] = [
  {
    prop: "captionSide",
    type: ['"bottom"', '"top"'],
    default: '"bottom"',
    description: "Where the <figcaption> sits relative to the content. \"bottom\" reads as a credit/label below; \"top\" reads as a legend introducing the content (common for code blocks). The spec allows the caption as the figure's first or last child, so place the caption in that DOM order.",
    source: { badge: "MDN", label: "<figure>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure" },
  },
  {
    prop: "id",
    type: "string",
    description: "Forwarded onto the <figure> root.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const RESPONSIVE_IMAGE_PROPS: ApiRow[] = [
  {
    prop: "src",
    type: "string",
    required: true,
    description: "URL of the fallback <img>. Also the element that sizes the box and carries the accessible name. Required by the platform — the browser shows it when no <source> matches.",
    source: { badge: "MDN", label: "<img src>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#src" },
  },
  {
    prop: "alt",
    type: "string",
    required: true,
    description: "Alternative text on the fallback <img>. <picture>/<source> have no ARIA role, so this is the only accessible name. Use an empty string only for purely decorative images.",
    source: { badge: "MDN", label: "<img alt>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt" },
  },
  {
    prop: "sources",
    type: "ResponsiveImageSource[]",
    description: "Candidate <source> elements in priority order, each { srcset, type?, media?, sizes?, width?, height? }. The browser picks the first whose media + type match. Inside <picture>, srcset is required and src is not allowed.",
    source: { badge: "MDN", label: "<source> in <picture>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source#srcset" },
  },
  {
    prop: "srcset / sizes",
    type: "string",
    description: "Density or width candidates on the fallback <img> itself (Retina without explicit media queries). sizes only takes effect with width (w) descriptors, not density (x).",
    source: { badge: "MDN", label: "<img srcset>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#srcset" },
  },
  {
    prop: "width / height",
    type: "number",
    description: "Intrinsic dimensions on the fallback <img> (integers, no units). Set them to reserve layout space and avoid layout shift (CLS).",
    source: { badge: "MDN", label: "<img width/height>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#width" },
  },
  {
    prop: "loading",
    type: ['"lazy"', '"eager"'],
    description: "Native lazy loading. lazy defers off-screen images until they near the viewport.",
    source: { badge: "MDN", label: "<img loading>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#loading" },
  },
  {
    prop: "decoding",
    type: ['"sync"', '"async"', '"auto"'],
    description: "Hint for how the browser decodes the image relative to painting other content. async avoids blocking the main thread.",
    source: { badge: "MDN", label: "<img decoding>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#decoding" },
  },
  {
    prop: "fetchpriority",
    type: ['"high"', '"low"', '"auto"'],
    description: "Relative fetch priority. Use high for the LCP hero image, low for below-the-fold decoration.",
    source: { badge: "MDN", label: "<img fetchpriority>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#fetchpriority" },
  },
  {
    prop: "imgClass",
    type: "string",
    description: "Extra Tailwind classes on the inner <img> (e.g. object-contain, aspect-video). object-fit / object-position belong here, not on <picture>.",
    source: { badge: "MDN", label: "object-fit goes on <img>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture#usage_notes" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const MEDIA_PLAYER_PROPS: ApiRow[] = [
  { prop: "kind", type: ['"video"', '"audio"'], default: '"video"', description: "Render <video> (aspect-ratio framed) or <audio> (full-width control bar).",
    source: { badge: "MDN", label: "<video>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video" } },
  { prop: "src", type: "string", description: "Single media URL. Use sources instead when offering multiple formats." },
  { prop: "sources", type: "MediaSource[]", description: "Multiple encodings ({ src, type }) tried in order; the browser plays the first format it can decode.",
    source: { badge: "MDN", label: "<source>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source" } },
  { prop: "tracks", type: "MediaTrack[]", description: "WebVTT text tracks ({ src, kind, srclang, label, default }) for captions, subtitles, descriptions, or chapters the native UI can toggle.",
    source: { badge: "MDN", label: "<track>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track" } },
  { prop: "poster", type: "string", description: "Video only. Image shown while the video downloads, before the first frame is available." },
  { prop: "ratio", type: ["number", "string"], default: '"16/9"', description: "Video only. Frame ratio: a number (1.778) or a \"w/h\" string. Maps to a Tailwind aspect-* utility (\"1/1\" -> aspect-square, \"16/9\" -> aspect-video, anything else -> aspect-[w/h]). Ignored for audio.",
    source: { badge: "MDN", label: "aspect-ratio", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" } },
  { prop: "controls", type: "boolean", default: "true", description: "Show the browser's native playback controls (play, seek, volume, captions, fullscreen)." },
  { prop: "preload", type: ['"none"', '"metadata"', '"auto"'], description: "Hint for how much media to fetch before playback. The spec advises metadata." },
  { prop: "loop", type: "boolean", default: "false", description: "Seek back to the start when playback reaches the end." },
  { prop: "muted", type: "boolean", default: "false", description: "Start with the audio muted." },
  { prop: "autoplay", type: "boolean", default: "false", description: "Begin playback as soon as possible. Most browsers block autoplay of unmuted media." },
  { prop: "playsinline", type: "boolean", default: "false", description: "Video only. Play inline rather than forcing fullscreen on mobile." },
  { prop: "crossorigin", type: ['"anonymous"', '"use-credentials"'], description: "CORS mode for cross-origin media (required when caption tracks are cross-origin)." },
  { prop: "ariaLabel", type: "string", description: "Accessible name for the player when no caption track identifies the media (recommended for audio)." },
  { prop: "children", type: "Child", description: "No-support fallback content (e.g. download links) shown to browsers that cannot render <video>/<audio>." },
  CLASS_ROW,
  HX_ROW,
]

export const AUTOCOMPLETE_PROPS: ApiRow[] = [
  {
    prop: "id",
    type: "string",
    required: true,
    description:
      "Input id, and the base for the bound list id (`${id}-list`). The default htmx hx-target points at that datalist, so server-streamed options land in the right list.",
  },
  { prop: "name", type: "string", description: "Form field name on submit. The submitted value is the free text in the input." },
  {
    prop: "options",
    type: "AutocompleteOption[]",
    default: "[]",
    description:
      "Static suggestions rendered as <option> in the bound <datalist>. Each is { value: string; label?: string }. Server-streamed autocompletes pass [] and let htmx populate the list on input.",
    source: { badge: "MDN", label: "<datalist>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist" },
  },
  {
    prop: "endpoint",
    type: "string",
    description:
      "When set, wires the htmx streaming defaults: hx-get={endpoint}, hx-trigger=\"input changed delay:${delay}ms\", hx-target=\"#${id}-list\", hx-swap=\"innerHTML\", hx-sync=\"this:replace\". The server returns a fresh <option> set per keystroke. Explicit hx-* props override these.",
    source: { badge: "htmx", label: "hx-trigger (input changed delay)", href: "https://htmx.org/attributes/hx-trigger/" },
  },
  { prop: "delay", type: "number", default: "200", description: "Debounce window (ms) for the input trigger when endpoint is set." },
  { prop: "value", type: "string", description: "Initial free-text value." },
  { prop: "placeholder", type: "string", description: "Placeholder text when empty." },
  {
    prop: "list",
    type: "string",
    description:
      "Underlying native attribute the component sets to `${id}-list`. The value is always free text — a <datalist> suggests, it does not constrain (use Select / Listbox for a fixed value set).",
    source: { badge: "MDN", label: "<input> list attribute", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list" },
  },
  { prop: "minLength / maxLength", type: "number", description: "Character bounds the platform enforces on the value." },
  { prop: "required", type: "boolean", default: "false", description: "Native HTML required for form validation." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable — unfocusable, not submitted." },
  { prop: "readonly", type: "boolean", default: "false", description: "Read-only — focusable + selectable but not editable." },
  { prop: "autofocus", type: "boolean", default: "false", description: "Focus this input on initial page load (one per document)." },
  {
    prop: "ariaInvalid",
    type: ['"true"', '"false"', '"grammar"', '"spelling"', "boolean"],
    description: "Sets aria-invalid; drives the destructive border + ring styling.",
    source: { badge: "MDN", label: "aria-invalid", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid" },
  },
  { prop: "form", type: "string", description: "Associate the input with a <form> by id when it lives outside it." },
  { prop: "inputClass", type: "string", description: "Extra Tailwind classes appended to the <input> (root takes `class`)." },
  ...COMMON_ARIA,
  CLASS_ROW,
  HX_ROW,
]

export const EXCLUSIVE_ACCORDION_PROPS: ApiRow[] = [
  {
    prop: "name",
    type: "string",
    required: true,
    description: "Shared group name written onto every item's <details name>. Required — it is what makes the group exclusive. Pass the same value to the root and to each item. Distinct accordions on one page must use distinct names, or they'd close each other.",
    source: { badge: "MDN", label: "<details name>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name" },
  },
  {
    prop: "value",
    type: "string",
    description: "Distinct identifier per item, emitted as the data-value attribute so each item is individually targetable. Set on ExclusiveAccordionItem.",
  },
  {
    prop: "open",
    type: "boolean",
    default: "false",
    description: "Render this item expanded on initial load. Maps to the native boolean <details open> attribute — omit it (don't pass the string \"false\") to start collapsed. If two items in the group set open, the browser opens only the first in source order.",
    source: { badge: "MDN", label: "<details open>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#open" },
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Visually mute an item and block pointer interaction (pointer-events-none, reduced opacity). Set on ExclusiveAccordionItem.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const SCROLL_AREA_PROPS: ApiRow[] = [
  {
    prop: "orientation",
    type: ['"vertical"', '"horizontal"', '"both"'],
    default: '"vertical"',
    description: "Which axis scrolls. vertical = overflow-y, horizontal = overflow-x, both = overflow both ways. Also selects which scroll-state edges drive the fade masks.",
    source: { badge: "MDN", label: "overflow", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" },
  },
  {
    prop: "fade",
    type: "boolean",
    default: "true",
    description: "Render start/end fade masks (top+bottom for vertical, left+right for horizontal) that fade in only while content can still scroll towards that edge. Driven by CSS @container scroll-state() — no JS.",
    source: { badge: "MDN", label: "@container scroll-state()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@container" },
  },
  {
    prop: "ariaLabel",
    type: "string",
    description: "Accessible name for the scroll region (rendered on the viewport, which is role=region + tabindex=0). Provide this or ariaLabelledby so assistive tech can reach and identify the scrollable area.",
    source: { badge: "MDN", label: "aria-label", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label" },
  },
  {
    prop: "ariaLabelledby",
    type: "string",
    description: "Id of a visible element naming the scroll region. Alternative to ariaLabel.",
    source: { badge: "MDN", label: "aria-labelledby", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby" },
  },
  {
    prop: "viewportClass",
    type: "string",
    description: "Extra Tailwind classes for the inner scrolling viewport (e.g. padding). The root gets class; the viewport gets viewportClass.",
  },
  {
    prop: "children",
    type: "Child",
    description: "The scrollable content. Set a height/max-height on the root (via class, e.g. h-72) so the region actually constrains and overflows.",
  },
  CLASS_ROW,
  HX_ROW,
]

export const SNAP_LIST_PROPS: ApiRow[] = [
  {
    prop: "orientation",
    type: ['"horizontal"', '"vertical"'],
    default: '"horizontal"',
    description: "<SnapList>. Scroll/snap axis. Sets scroll-snap-type's axis (snap-x/snap-y) and lays the list out as a row or column. The vertical case needs a bounded height to scroll.",
    source: { badge: "MDN", label: "scroll-snap-type axis", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type#values" },
  },
  {
    prop: "snap",
    type: ['"mandatory"', '"proximity"'],
    default: '"mandatory"',
    description: "<SnapList>. scroll-snap-type strictness. mandatory always rests on a snap point; proximity only snaps when a rest point is near (gentler on long content).",
    source: { badge: "MDN", label: "scroll-snap-type", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type" },
  },
  {
    prop: "align",
    type: ['"start"', '"center"', '"end"'],
    default: '"start"',
    description: "<SnapListItem>. Where the item snaps within the rail (scroll-snap-align). start for chip rows, center for one-up media shelves.",
    source: { badge: "MDN", label: "scroll-snap-align", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align" },
  },
  {
    prop: "stop",
    type: "boolean",
    default: "false",
    description: "<SnapListItem>. Sets scroll-snap-stop: always so a fast fling cannot skip past this item — the scroll must come to rest on it.",
    source: { badge: "MDN", label: "scroll-snap-stop", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop" },
  },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
  HX_ROW,
]

export const CONTAINER_CARD_PROPS: ApiRow[] = [
  {
    prop: "as",
    type: ['"article"', '"section"', '"div"', '"li"', '"aside"'],
    default: '"article"',
    description: "Semantic element for the card root. Defaults to <article> for self-contained, syndicatable content (product, post, comment).",
    source: { badge: "MDN", label: "<article>", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article" },
  },
  {
    prop: "media",
    type: "Child",
    description: "Media element (img/video/picture/div) shown above the body when the card is stacked and beside it when wide. Omit for a text-only card.",
  },
  {
    prop: "break",
    type: "string",
    default: '"28rem"',
    description: "Inline width at which the card flips from stacked to side-by-side. Published as the --container-card-break custom property for inspection. Note: changing the number also requires editing the @min-[28rem] variant, since a container query condition cannot read a custom property.",
    source: { badge: "MDN", label: "container-type", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/container-type" },
  },
  ...COMMON_ARIA.slice(0, 2),
  CLASS_ROW,
  HX_ROW,
]

export const STICKY_HEADER_PROPS: ApiRow[] = [
  {
    prop: "as",
    type: ['"header"', '"div"', '"section"', '"nav"'],
    default: '"header"',
    description:
      "Semantic element to render as. A page banner or section title uses header; a sticky toolbar can use div.",
    source: { badge: "MDN", label: "<header> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header" },
  },
  {
    prop: "top",
    type: ["number", "string"],
    default: "0",
    description:
      "Offset from the scroll container's top edge at which the header pins (CSS top). A number is treated as pixels; a string passes through verbatim. The stuck query keys off this same edge.",
    source: { badge: "MDN", label: "position: sticky", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position" },
  },
  {
    prop: "id",
    type: "string",
    description: "Forwarded to the root element.",
  },
  {
    prop: "StickyHeaderBar.as",
    type: ['"div"', '"header"', '"nav"'],
    default: '"div"',
    description:
      "Element for a reveal region (the part that gains a shadow + solid background when stuck). Carries data-sticky-revealed.",
  },
  {
    prop: "StickyHeaderBar.class",
    type: "string",
    description:
      "Layout/spacing classes for the reveal region (e.g. flex h-14 items-center px-4). The stuck shadow + background are applied by the scoped [data-slot=\"sticky-header\"] CSS block via the data-sticky-revealed hook.",
    source: { badge: "MDN", label: "@container scroll-state(stuck)", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container" },
  },
  CLASS_ROW,
  HX_ROW,
]

export const SCROLL_PROGRESS_PROPS: ApiRow[] = [
  { prop: "position", type: ['"top"', '"bottom"'], default: '"top"', description: "Which viewport edge the bar pins to." },
  { prop: "timeline", type: "string", description: "A scroll-timeline-name (a --dashed-ident) to drive the bar from a named scroller instead of the whole page. Omit to track the page root via scroll(root block).", source: { badge: "MDN", label: "scroll-timeline-name", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline-name" } },
  CLASS_ROW,
  HX_ROW,
]
