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
    { slug: 'installation', title: 'Setup & Requirements' },
    { slug: 'using-the-tool', title: 'Using the Tool' },
    { slug: 'faq', title: 'FAQ' },
  ],
}

// Installers live in the public Supabase Storage bucket "installers".
// To release an update: upload the new <Name>-<version>-Setup.exe there,
// then change the version (and size) on that product's dl(...) line.
const INSTALLERS = 'https://ljrubyyjmbkbxyzrzcjp.supabase.co/storage/v1/object/public/installers/'
const dl = (slug, name, size, version = '1.0.0') => {
  const fileName = `${name}-${version}-Setup.exe`
  return { url: INSTALLERS + fileName, fileName, size }
}

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
    download: dl('pipe-2d-3d-convertor', 'Pipe2D3DConvertor', '3.4 MB'),
  },
  {
    ...COMMON,
    slug: 'airflow-summary',
    name: 'Air Terminal Flow Summary',
    tagline: 'An air terminal schedule that lands straight in Excel',
    icon: Wind,
    color: '#2DD4BF',
    description:
      'Reads every air terminal in the open model and writes a formatted Excel report split into Supply and Return tabs — one row per terminal with its Element ID, family, type and airflow in CFM, plus a count and average at the bottom. Read-only: it never changes your model.',
    features: [
      'Separate Supply and Return tabs with count and average',
      'Airflow always in CFM, whatever your project units',
      'Unconnected terminals left blank, never counted as 0',
      'Read-only — safe to run on a live model',
    ],
    download: dl('airflow-summary', 'AirTerminalFlowSummary', '2.2 MB'),
  },
  {
    ...COMMON,
    slug: 'equipment-mark-to-ducts',
    name: 'Equipment Mark to Ducts',
    tagline: 'Push equipment Marks onto their connected ducts',
    icon: Link2,
    color: '#9B8CFF',
    description:
      'Goes through every piece of mechanical equipment in the model, finds the ducts plugged straight into it, and writes the equipment’s Mark into those ducts’ Comments — so clicking any duct tells you which unit it belongs to.',
    features: [
      'Follows real connector links, not proximity',
      'Makes duct schedules groupable and filterable by unit',
      'Blank Comments flag connections that were never made',
      'Reports equipment found, skipped and ducts updated',
    ],
    download: dl('equipment-mark-to-ducts', 'EquipmentMarkToDucts', '2.2 MB'),
  },
  {
    ...COMMON,
    slug: 'import-export-parameter',
    name: 'Import & Export Parameter',
    tagline: 'Round-trip parameters through Excel',
    icon: FileSpreadsheet,
    color: '#F2B33D',
    description:
      'Takes parameter values out of your model into Excel, lets you edit them there, then writes them back — Revit for the model, Excel for the information. Shows exactly how many values will change before touching anything, and one Ctrl+Z undoes the whole import.',
    features: [
      'Export model elements or existing schedules to Excel',
      'Instance, type and shared parameters on separate sheets',
      'Preview of every change before it is written',
      'Empty cells are left alone; whole import undoes in one step',
    ],
    download: dl('import-export-parameter', 'ImportExportParameter', '2.2 MB'),
  },
  {
    ...COMMON,
    slug: 'inline-valve-placer',
    name: 'Inline Pipe & Valve Placer',
    tagline: 'Drop valves onto pipes by length, automatically',
    icon: Gauge,
    color: '#E5484D',
    description:
      'Finds every pipe longer than a length you enter and places a 2" ball valve at the middle of each one — a repetitive task across hundreds of pipes reduced to a single dialog, undone with one Ctrl+Z.',
    features: [
      'Shows the longest pipe so you know the valid range',
      'Places one valve at each qualifying pipe’s midpoint',
      'Checks your input before doing anything',
      'Reports how many valves were placed and their IDs',
    ],
    download: dl('inline-valve-placer', 'InlinePipeValvePlacer', '2.2 MB'),
  },
  {
    ...COMMON,
    slug: 'room-name-to-spaces',
    name: 'Space Name & Number Transfer',
    tagline: 'Rename every MEP Space from one list, in one run',
    icon: Tags,
    color: '#3B7BFF',
    description:
      'Writes real room numbers and names into the mechanical Spaces of a Revit model from a simple three-column list. It previews every change first, refuses to write anything if the list is inconsistent, reads every value back to confirm it, and undoes in one step.',
    features: [
      'Preview first — nothing changes until you confirm',
      'All-or-nothing: any problem in the list stops the whole run',
      'Reads every value back from the model to verify it',
      'Safe to re-run; already-correct spaces are left alone',
    ],
    download: dl('room-name-to-spaces', 'RoomNameToSpaces', '2.2 MB'),
  },
  {
    ...COMMON,
    slug: 'sheets-from-unplaced-plans',
    name: 'Create Sheets from Unplaced Plans',
    tagline: 'One sheet per unplaced plan, view placed to fit',
    icon: LayoutDashboard,
    color: '#2DD4BF',
    description:
      'Finds every floor plan that is not yet on a sheet, creates a sheet for it, and places the plan in the middle — dropping to the next standard scale if it is too big to fit. Sheet numbers never clash with existing ones.',
    features: [
      'Finds every floor plan not yet on a sheet',
      'One sheet per plan, named after the view',
      'Centres each view; rescales it if it does not fit',
      'Skips sheet numbers that already exist',
    ],
    requirements: [...COMMON.requirements, 'A title block loaded in the project'],
    download: dl('sheets-from-unplaced-plans', 'CreateSheetsFromUnplacedPlans', '2.2 MB'),
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
