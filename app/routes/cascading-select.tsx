/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Layout, page } from "@/app/layout"
import { Example } from "@/app/components/example"
import { LangTabs } from "@/app/components/lang-tabs"
import { DocsSidebar } from "@/app/components/docs-sidebar"
import { DocsToc } from "@/app/components/docs-toc"
import { ApiTable } from "@/app/components/api-table"
import { InstallPanel } from "@/app/components/install-panel"
import { CASCADING_SELECT_PROPS } from "@/app/data/api-rows"
import {
  CascadingSelect,
  CascadingSelectOption,
  CascadingSelectDetail,
} from "@/registry/ui/cascading-select"

export const cascadingSelectRoutes = new Hono()

const REGISTRY_ROOT = resolve(import.meta.dir, "..", "..", "registry")
const [jsxSource, jinjaSource, goSource, phoenixSource, htmlSource] =
  await Promise.all([
    readFile(resolve(REGISTRY_ROOT, "ui/cascading-select.tsx"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "jinja2/cascading-select.html"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "go-templates/cascading-select.tmpl"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "phoenix/cascading_select.ex"), "utf8"),
    readFile(resolve(REGISTRY_ROOT, "html/cascading-select.html"), "utf8"),
  ])

const usageJsx = `import { CascadingSelect, CascadingSelectOption } from "@/components/ui/cascading-select"

// Picking the make GETs /models with the make value, swaps the model
// <option>s into the child, and updates the detail panel out of band.
// No hx-trigger: htmx defaults <select> to "change".
<CascadingSelect
  id="vehicle"
  endpoint="/models"
  parentName="make"
  childName="model"
  legend="Vehicle"
  parentLabel="Make"
  childLabel="Model"
  detail={<>Pick a make…</>}
>
  <CascadingSelectOption value="audi" selected>Audi</CascadingSelectOption>
  <CascadingSelectOption value="toyota">Toyota</CascadingSelectOption>
  <CascadingSelectOption value="bmw">BMW</CascadingSelectOption>
</CascadingSelect>`

const usageJinja = `{% from "components/cascading-select.html" import cascading_select_open, cascading_select_close, option %}

{{ cascading_select_open(id="vehicle", endpoint="/models",
       parent_name="make", child_name="model",
       legend="Vehicle", parent_label="Make", child_label="Model") }}
  {{ option("audi", "Audi", selected=true) }}
  {{ option("toyota", "Toyota") }}
  {{ option("bmw", "BMW") }}
{{ cascading_select_close(id="vehicle", child_name="model", child_label="Model") }}`

const usageGo = `{{template "cascading-select" (dict
  "ID" "vehicle" "Endpoint" "/models"
  "ParentName" "make" "ChildName" "model"
  "Legend" "Vehicle" "ParentLabel" "Make" "ChildLabel" "Model"
  "Detail" true
  "Body" (htmlSafe ` +
  "`" +
  `
    <option value="audi" selected>Audi</option>
    <option value="toyota">Toyota</option>
    <option value="bmw">BMW</option>
` +
  "`" +
  `))}}`

const usagePhoenix = `<.cascading_select id="vehicle" endpoint={~p"/models"}
  parent_name="make" child_name="model"
  legend="Vehicle" parent_label="Make" child_label="Model">
  <option value="audi" selected>Audi</option>
  <option value="toyota">Toyota</option>
  <option value="bmw">BMW</option>
</.cascading_select>`

const usageHtml = `<fieldset data-slot="cascading-select" id="vehicle" class="grid gap-4">
  <select id="vehicle-parent" name="make"
          hx-get="/models" hx-target="#vehicle-child" hx-include="[name='make']"
          class="…"> … </select>
  <select id="vehicle-child" name="model" class="…"></select>
  <div id="vehicle-detail" aria-live="polite" class="…"></div>
</fieldset>
<!-- Endpoint returns the model <option>s + a <div id="vehicle-detail"
     hx-swap-oob="innerHTML"> detail fragment. -->`

const tocItems = [
  { href: "#installation", label: "Installation" },
  { href: "#examples", label: "Examples" },
  { href: "#ex-basic", label: "Make → model + detail", nested: true },
  { href: "#ex-no-detail", label: "Country → state", nested: true },
  { href: "#api", label: "API Reference" },
]

// ---- Demo data + fragment helpers ----------------------------------------
// Mirrors repos/htmx/www/src/content/patterns/02-forms/04-linked-selects.md.

type Model = { value: string; name: string; type: string; price: string }

const MAKES: Record<string, { label: string; models: Model[] }> = {
  audi: {
    label: "Audi",
    models: [
      { value: "a4", name: "A4", type: "Sedan", price: "$39,900" },
      { value: "q5", name: "Q5", type: "SUV", price: "$45,600" },
      { value: "etron-gt", name: "e-tron GT", type: "Electric", price: "$106,500" },
    ],
  },
  toyota: {
    label: "Toyota",
    models: [
      { value: "tacoma", name: "Tacoma", type: "Truck", price: "$31,500" },
      { value: "gr-supra", name: "GR Supra", type: "Sport", price: "$56,250" },
      { value: "land-cruiser", name: "Land Cruiser", type: "SUV", price: "$58,250" },
    ],
  },
  bmw: {
    label: "BMW",
    models: [
      { value: "m3", name: "M3", type: "Sedan", price: "$76,000" },
      { value: "x5", name: "X5", type: "SUV", price: "$65,200" },
      { value: "i4", name: "i4", type: "Electric", price: "$52,200" },
    ],
  },
}

const STATES: Record<string, string[]> = {
  us: ["California", "New York", "Texas", "Washington"],
  de: ["Bayern", "Berlin", "Hamburg", "Hessen"],
  tr: ["İstanbul", "Ankara", "İzmir", "Bursa"],
}

function ModelOptions(props: { make: string }) {
  const make = MAKES[props.make] ?? MAKES.audi
  return (
    <>
      {make.models.map((m, i) => (
        <option value={m.value} selected={i === 0}>
          {m.name}
        </option>
      ))}
    </>
  )
}

function StateOptions(props: { country: string }) {
  const list = STATES[props.country] ?? []
  if (list.length === 0) {
    return <option value="">Pick a country first…</option>
  }
  return (
    <>
      {list.map((s, i) => (
        <option value={s.toLowerCase()} selected={i === 0}>
          {s}
        </option>
      ))}
    </>
  )
}

function detailText(makeKey: string, model: Model): string {
  const label = (MAKES[makeKey] ?? MAKES.audi).label
  return `${label} ${model.name} — ${model.type}, ${model.price}`
}

cascadingSelectRoutes.get("/", async (c) => {
  const origin = new URL(c.req.url).origin
  const cliCmd = `npx shadcn@latest add ${origin}/r/cascading-select.json`

  return page(
    c,
    <Layout title="Cascading Select — shadcn-htmx">
      <div class="mx-auto w-full max-w-7xl px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar current="/docs/cascading-select" />
        <main class="mx-auto w-full max-w-3xl space-y-12 py-10 lg:mx-0 lg:py-12">
          <header class="space-y-3 border-b pb-8">
            <p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Components
            </p>
            <h1 class="text-3xl font-bold tracking-tight">Cascading Select</h1>
            <p class="text-muted-foreground">
              Two dependent native{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">&lt;select&gt;</code>s:
              choosing the parent reloads the child's options — and an optional
              detail panel — from the server. The cascade is htmx's default{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">change</code>{" "}
              trigger plus one{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-sm">hx-swap-oob</code>{" "}
              fragment. No custom JavaScript.
            </p>
          </header>

          <section class="space-y-4">
            <h2 id="installation" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Installation
            </h2>
            <LangTabs
              id="install-cascading-select"
              panels={[
                { lang: "jsx", node: await InstallPanel({ cmd: cliCmd, usage: usageJsx, lang: "tsx", filename: "components/ui/cascading-select.tsx", source: jsxSource }) },
                { lang: "jinja", node: await InstallPanel({ usage: usageJinja, lang: "html", filename: "templates/components/cascading-select.html", source: jinjaSource, note: "Copy cascading-select.html into templates/components/." }) },
                { lang: "go", node: await InstallPanel({ usage: usageGo, lang: "html", filename: "components/cascading-select.tmpl", source: goSource, note: "Add cascading-select.tmpl alongside your templates." }) },
                { lang: "phoenix", node: await InstallPanel({ usage: usagePhoenix, lang: "elixir", filename: "lib/my_app_web/components/cascading_select.ex", source: phoenixSource, note: "Drop cascading_select.ex into lib/my_app_web/components/." }) },
                { lang: "html", node: await InstallPanel({ usage: usageHtml, lang: "html", filename: "snippets/cascading-select.html", source: htmlSource, note: "Paste the markup; relies only on theme tokens." }) },
              ]}
            />
          </section>

          <section class="space-y-8">
            <h2 id="examples" class="scroll-mt-20 text-xl font-semibold tracking-tight">
              Examples
            </h2>

            {await Example({
              id: "ex-basic",
              title: "Make → model, with a detail panel",
              description:
                "Picking a make GETs /models with the make value; the server returns the model <option>s swapped into the child select, plus a detail fragment that updates the price card out of band.",
              narrative: (
                <p>
                  One change on the parent fires one request. The default{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap="innerHTML"</code>{" "}
                  replaces the child's options, and a second fragment marked{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-swap-oob="true"</code>{" "}
                  updates the detail panel by id — two DOM updates, no extra
                  round-trip.{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">hx-include</code>{" "}
                  pins the make value to the request. With htmx off, the parent
                  still submits its value in a normal form post.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "Linked selects pattern",
                  href: "https://htmx.org/examples/value-select/",
                },
                {
                  source: "htmx",
                  label: "hx-swap-oob",
                  href: "https://htmx.org/attributes/hx-swap-oob/",
                },
                {
                  source: "MDN",
                  label: "<select> element",
                  href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <CascadingSelect
                    id="ex-cs-vehicle"
                    endpoint="/docs/cascading-select/models"
                    parentName="make"
                    childName="model"
                    legend="Vehicle"
                    parentLabel="Make"
                    childLabel="Model"
                    childOptions={<ModelOptions make="audi" />}
                    detail={<>{detailText("audi", MAKES.audi.models[0])}</>}
                  >
                    <CascadingSelectOption value="audi" selected>
                      Audi
                    </CascadingSelectOption>
                    <CascadingSelectOption value="toyota">Toyota</CascadingSelectOption>
                    <CascadingSelectOption value="bmw">BMW</CascadingSelectOption>
                  </CascadingSelect>
                </div>
              ),
              jsx: `<CascadingSelect id="vehicle" endpoint="/models"
  parentName="make" childName="model"
  legend="Vehicle" parentLabel="Make" childLabel="Model"
  detail={<>Audi A4 — Sedan, $39,900</>}>
  <CascadingSelectOption value="audi" selected>Audi</CascadingSelectOption>
  <CascadingSelectOption value="toyota">Toyota</CascadingSelectOption>
  <CascadingSelectOption value="bmw">BMW</CascadingSelectOption>
</CascadingSelect>

{/* GET /models returns: model <option>s + a detail fragment */}
{/* <CascadingSelectDetail id="vehicle">…</CascadingSelectDetail> */}`,
              jinja: `{{ cascading_select_open(id="vehicle", endpoint="/models",
       parent_name="make", child_name="model",
       legend="Vehicle", parent_label="Make", child_label="Model") }}
  {{ option("audi", "Audi", selected=true) }}
  {{ option("toyota", "Toyota") }}
  {{ option("bmw", "BMW") }}
{{ cascading_select_close(id="vehicle", child_name="model", child_label="Model") }}`,
              go: `{{template "cascading-select" (dict
  "ID" "vehicle" "Endpoint" "/models"
  "ParentName" "make" "ChildName" "model"
  "Legend" "Vehicle" "ParentLabel" "Make" "ChildLabel" "Model" "Detail" true
  "Body" (htmlSafe \`<option value="audi" selected>Audi</option>…\`))}}`,
              phoenix: `<.cascading_select id="vehicle" endpoint={~p"/models"}
  parent_name="make" child_name="model"
  legend="Vehicle" parent_label="Make" child_label="Model">
  <option value="audi" selected>Audi</option>
  <option value="toyota">Toyota</option>
  <option value="bmw">BMW</option>
</.cascading_select>`,
            })}

            {await Example({
              id: "ex-no-detail",
              title: "Country → state (options only)",
              description:
                "Omit the detail panel for a plain two-level cascade: the endpoint returns just the child <option>s, swapped in on change.",
              narrative: (
                <p>
                  When you only need dependent options, leave{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">detail</code>{" "}
                  off. The component drops the OOB panel entirely and the
                  endpoint returns nothing but the new{" "}
                  <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;option&gt;</code>s.
                  This is the bare linked-selects recipe from the htmx docs.
                </p>
              ),
              references: [
                {
                  source: "htmx",
                  label: "hx-include",
                  href: "https://htmx.org/attributes/hx-include/",
                },
                {
                  source: "htmx",
                  label: "hx-trigger (defaults to change for select)",
                  href: "https://htmx.org/attributes/hx-trigger/",
                },
              ],
              preview: (
                <div class="w-full max-w-md">
                  <CascadingSelect
                    id="ex-cs-region"
                    endpoint="/docs/cascading-select/states"
                    parentName="country"
                    childName="state"
                    legend="Region"
                    parentLabel="Country"
                    childLabel="State / Province"
                    childOptions={<StateOptions country="us" />}
                  >
                    <CascadingSelectOption value="us" selected>
                      United States
                    </CascadingSelectOption>
                    <CascadingSelectOption value="de">Deutschland</CascadingSelectOption>
                    <CascadingSelectOption value="tr">Türkiye</CascadingSelectOption>
                  </CascadingSelect>
                </div>
              ),
              jsx: `<CascadingSelect id="region" endpoint="/states"
  parentName="country" childName="state"
  legend="Region" parentLabel="Country" childLabel="State / Province">
  <CascadingSelectOption value="us" selected>United States</CascadingSelectOption>
  <CascadingSelectOption value="de">Deutschland</CascadingSelectOption>
  <CascadingSelectOption value="tr">Türkiye</CascadingSelectOption>
</CascadingSelect>

{/* GET /states returns just the <option>s for the country. */}`,
              jinja: `{{ cascading_select_open(id="region", endpoint="/states",
       parent_name="country", child_name="state",
       legend="Region", parent_label="Country", child_label="State / Province",
       detail=false) }}
  {{ option("us", "United States", selected=true) }}
  {{ option("de", "Deutschland") }}
  {{ option("tr", "Türkiye") }}
{{ cascading_select_close(id="region", child_name="state",
                          child_label="State / Province", detail=false) }}`,
              go: `{{template "cascading-select" (dict
  "ID" "region" "Endpoint" "/states"
  "ParentName" "country" "ChildName" "state"
  "Legend" "Region" "ParentLabel" "Country" "ChildLabel" "State / Province"
  "Detail" false
  "Body" (htmlSafe \`<option value="us" selected>United States</option>…\`))}}`,
              phoenix: `<.cascading_select id="region" endpoint={~p"/states"}
  parent_name="country" child_name="state"
  legend="Region" parent_label="Country" child_label="State / Province"
  detail={false}>
  <option value="us" selected>United States</option>
  <option value="de">Deutschland</option>
  <option value="tr">Türkiye</option>
</.cascading_select>`,
            })}
          </section>

          <ApiTable title="Cascading Select" rows={CASCADING_SELECT_PROPS} />
        </main>
        <DocsToc items={tocItems} />
      </div>
    </Layout>,
  )
})

// --- htmx demo endpoints ---------------------------------------------------
// Both default to the `change` trigger on the parent <select>. The /models
// endpoint returns the model <option>s AND a detail fragment carrying
// hx-swap-oob; /states returns only the dependent <option>s.

cascadingSelectRoutes.get("/models", (c) => {
  const makeKey = c.req.query("make") ?? "audi"
  const make = MAKES[makeKey] ?? MAKES.audi
  const first = make.models[0]
  return c.html(
    <>
      <ModelOptions make={makeKey} />
      <CascadingSelectDetail id="ex-cs-vehicle">
        {detailText(makeKey, first)}
      </CascadingSelectDetail>
    </>,
  )
})

cascadingSelectRoutes.get("/states", (c) => {
  const country = c.req.query("country") ?? ""
  const list = STATES[country] ?? []
  if (list.length === 0) {
    return c.html(<option value="">Pick a country first…</option>)
  }
  return c.html(
    <>
      {list.map((s, i) => (
        <option value={s.toLowerCase()} selected={i === 0}>
          {s}
        </option>
      ))}
    </>,
  )
})
