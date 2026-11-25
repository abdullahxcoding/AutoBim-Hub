/**
 * Site-wide settings. Fill these in when real details are available.
 */
export const SITE = {
  name: 'AutoBim Hub',
  social: [
    // { label: 'LinkedIn', href: 'https://www.linkedin.com/company/...' },
  ],
}

/** Opens the enquiry form dialog, optionally preselecting a topic. */
export function contact(topic = 'project') {
  window.dispatchEvent(new CustomEvent('abh:enquiry', { detail: topic }))
}
