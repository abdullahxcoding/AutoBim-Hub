import { PRODUCTS } from './products.js'

export const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Solutions',
    href: '/#services',
    menu: {
      title: 'Solutions',
      blurb: 'Automation and development services for AEC teams.',
      links: [
        { label: 'Revit Automation', desc: 'Add-ins and batch tooling for Revit', href: '/#services' },
        { label: 'pyRevit Development', desc: 'Custom extensions and ribbon tools', href: '/#services' },
        { label: 'AutoCAD Automation', desc: 'Scripts and plugins for CAD processes', href: '/#services' },
        { label: 'Custom BIM Software', desc: 'Desktop and web apps for BIM data', href: '/#services' },
      ],
    },
  },
  {
    label: 'Products & Tools',
    href: '/#products',
    menu: {
      title: 'Products & Tools',
      blurb: 'Free and professional tools for Revit, pyRevit and AutoCAD.',
      // Generated from the product catalogue in products.js
      links: PRODUCTS.map((p) => ({
        label: p.name,
        desc: p.tagline,
        href: `/products/${p.slug}`,
        icon: p.icon,
        color: p.color,
      })),
    },
  },
  { label: 'About Us', href: '/#why-us' },
]
