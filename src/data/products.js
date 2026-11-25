import {
  Workflow, Wind, Link2, FileSpreadsheet, Gauge, Tags, LayoutDashboard,
} from 'lucide-react'

/**
 * ─────────────────────────────────────────────────────────────
 *  PRODUCT CATALOGUE — the single source of truth.
 *  The navbar dropdown, the landing-page grid and every product
 *  page are generated from this list.
 *
 *  PRICING: a tool is FREE while `pricing` is null. To charge for it,
 *  fill in the `pricing` block (see the commented template at the
 *  bottom) and paste the tool's Stripe Price id into `priceId`.
 *
 *  IMPORTANT: every `slug` here must also exist in the `products`
 *  table in Supabase (see migration 007). The subscriptions table
 *  points at it, so a missing row makes checkout fail.
 *
 *  DOCS: Markdown files live in src/content/docs/<slug>/.
 *  Images for docs go in public/docs/<slug>/ and are referenced
 *  in Markdown as  ![alt](/docs/<slug>/image.png)
 *  INSTALLERS: upload to Supabase Storage (public bucket "installers")
 *  and paste the public URL into `download.url`.
 * ─────────────────────────────────────────────────────────────
 */

// Every tool sells at $15 / user / month with a 14-day trial, so they share
// one pricing object. For quick testing you can point them all at a single
// Stripe price: create one recurring $15/month price and paste its id below.
// For production, give each tool its OWN Stripe price (better per-tool
// reporting) by overriding `pricing` on that product with its own priceId.
const MONTHLY_15 = {
  amount: 15,
  currency: 'USD',
  interval: 'month',
  trialDays: 14,
  note: 'Per user. Cancel anytime. Volume licensing available.',
  priceId: 'price_REPLACE_WITH_STRIPE_15_MONTH', // ← paste your $15/mo Stripe price id
}

const COMMON = {
  platform: 'pyRevit',
  version: '1.0.0',
  released: '2026-11-24',
  compatibility: ['Revit 2022', 'Revit 2023', 'Revit 2024', 'Revit 2025', 'Revit 2026'],
  requirements: ['pyRevit 4.8 or newer', 'Windows 10/11'],
  pricing: MONTHLY_15,
  price: null,
  docs: [
    { slug: 'getting-started', title: 'Getting Started' },
    { slug: 'installation', title: 'Installation' },
    { slug: 'using-the-tool', title: 'Using the Tool' },
    { slug: 'faq', title: 'FAQ' },
  ],
}

const dl = (slug, name) => ({
  url: '',
  fileName: `${name}-1.0.0-Setup.exe`,
  size: '',
})

export const PRODUCTS = [
  {
    ...COMMON,
    slug: 'pipe-2d-3d-convertor',
    name: '2D-3D Pipe Convertor',
    tagline: 'Turn DXF pipe drawings into a modelled Revit system',
    icon: Workflow,
    color: '#3B7BFF',
    description:
      'Reads a 2D DXF drawing, reports every pipe it finds, and models them as a real pipe system in Revit — turning flat CAD linework into a coordinated 3D model in one run.',
    features: [
      'Reads pipes directly from a DXF drawing',
      'Shows a report of what it found before modelling',
      'Builds the pipes as a real Revit system',
      'Settings dialog to control the conversion',
    ],
    download: dl('pipe-2d-3d-convertor', 'Pipe2D3DConvertor'),
  },
  {
    ...COMMON,
    slug: 'airflow-summary',
    name: 'Air Terminal Flow Summary',
    tagline: 'Export air terminal airflow (CFM) to Excel',
    icon: Wind,
    color: '#2DD4BF',
    description:
      'Collects every supply and return air terminal in the model and exports their airflow (CFM) to Excel, aggregated and summarised — ready for checking and reporting.',
    features: [
      'Finds all supply and return air terminals',
      'Summarises and aggregates airflow (CFM)',
      'One-click export to Excel',
      'Works on Revit 2024+ and older versions',
    ],
    download: dl('airflow-summary', 'AirTerminalFlowSummary'),
  },
  {
    ...COMMON,
    slug: 'equipment-mark-to-ducts',
    name: 'Equipment Mark to Ducts',
    tagline: 'Push equipment Marks onto their connected ducts',
    icon: Link2,
    color: '#9B8CFF',
    description:
      'Copies each mechanical equipment’s Mark into the Comments of the ducts connected to it, so duct runs carry the identity of the unit they serve — automatically, across the whole model.',
    features: [
      'Follows real duct connections from each equipment',
      'Writes the equipment Mark into duct Comments',
      'Processes the whole model at once',
      'Works on Revit 2024+ and older versions',
    ],
    download: dl('equipment-mark-to-ducts', 'EquipmentMarkToDucts'),
  },
  {
    ...COMMON,
    slug: 'import-export-parameter',
    name: 'Import & Export Parameter',
    tagline: 'Round-trip parameters through Excel',
    icon: FileSpreadsheet,
    color: '#F2B33D',
    description:
      'Export model elements or schedules to Excel, edit their parameter values there, then import the changes back into Revit — bulk editing that would take hours by hand, done in minutes.',
    features: [
      'Export elements or schedules to Excel',
      'Edit parameter values in a familiar spreadsheet',
      'Import the edited values back into the model',
      'Guided dialogs for selecting and mapping',
    ],
    download: dl('import-export-parameter', 'ImportExportParameter'),
  },
  {
    ...COMMON,
    slug: 'inline-valve-placer',
    name: 'Inline Pipe & Valve Placer',
    tagline: 'Drop valves onto pipes by length, automatically',
    icon: Gauge,
    color: '#E5484D',
    description:
      'Places a ball valve at the midpoint of every pipe longer than a length you enter — a repetitive task across hundreds of pipes reduced to a single dialog.',
    features: [
      'Set a minimum pipe length to target',
      'Places a valve at each pipe’s midpoint',
      'Runs across the whole model in one pass',
      'Skips pipes shorter than your threshold',
    ],
    download: dl('inline-valve-placer', 'InlinePipeValvePlacer'),
  },
  {
    ...COMMON,
    slug: 'room-name-to-spaces',
    name: 'Room Name to Spaces',
    tagline: 'Copy room names from CAD text into MEP Spaces',
    icon: Tags,
    color: '#3B7BFF',
    description:
      'Transfers room NAME and NUMBER from imported CAD text onto the matching MEP Spaces, pairing labels by position — so your spaces are named correctly without manual retyping.',
    features: [
      'Reads room name and number from imported CAD text',
      'Matches each label to the right MEP Space',
      'Pairs name and number texts by distance',
      'Configurable layer filter and tolerances',
    ],
    download: dl('room-name-to-spaces', 'RoomNameToSpaces'),
  },
  {
    ...COMMON,
    slug: 'sheets-from-unplaced-plans',
    name: 'Create Sheets from Unplaced Plans',
    tagline: 'One sheet per unplaced plan, view placed to fit',
    icon: LayoutDashboard,
    color: '#2DD4BF',
    description:
      'Creates one sheet for every unplaced plan view and places the view on it, scaled to fit the title block — turning sheet set-up from a manual chore into a single click.',
    features: [
      'Finds every plan view not yet on a sheet',
      'Creates a sheet per view with your title block',
      'Places and scales each view to fit',
      'Leaves a strip for your title block',
    ],
    download: dl('sheets-from-unplaced-plans', 'CreateSheetsFromUnplacedPlans'),
  },
]

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)

/** Supabase Storage forces a file download when ?download is appended. */
export function downloadHref(product) {
  const url = product.download?.url
  if (!url) return null
  if (url.includes('.supabase.co/storage/')) {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}download=${encodeURIComponent(product.download.fileName || '')}`
  }
  return url
}

/*
 *  PRICING TEMPLATE — paste into a product (replacing `pricing: null`)
 *  to charge for it:
 *
 *  pricing: {
 *    amount: 12,
 *    currency: 'USD',          // 'USD' | 'EUR' | 'GBP'
 *    interval: 'month',        // 'month' | 'year'
 *    trialDays: 14,
 *    note: 'Cancel anytime.',
 *    priceId: 'price_...',     // the Stripe Price id for this plan
 *  },
 */
