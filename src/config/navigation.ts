// src/config/navigation.ts — primary nav as data, now the single source of
// truth (Header.astro reads from here as of the M44 nav reorg).
//
// The site outgrew a flat 13-item bar. Nav is now SIX topic hubs, each a
// clickable landing page with a dropdown of its spokes. Every href below points
// at a real built page (build.format:'file' → .html). When you add a page and
// want it in the nav, add a child here — do NOT reintroduce top-level items.

export interface NavLink {
  /** Omit href to render a non-clickable section heading inside a dropdown. */
  href?: string;
  label: string;
  /** Present on hub items → renders a dropdown. The hub's own href stays clickable. */
  children?: NavLink[];
  /** Visually emphasize this hub (used for Start Here, the site's front door). */
  featured?: boolean;
}

// Absolute (root-relative) hrefs so nav resolves from any directory depth,
// including subfolder pages like /medicare-news/* and /medicare-coverage/*.
export const PRIMARY_NAV: NavLink[] = [
  { href: '/', label: 'Home' },
  {
    href: '/medicare-decision-center.html',
    label: 'Start Here',
    featured: true,
    children: [
      { href: '/medicare-decision-center.html', label: 'Medicare Decision Center' },
      { href: '/turning-65.html', label: 'Turning 65' },
      { href: '/working-past-65.html', label: 'Working Past 65' },
      { href: '/medicare-financial-assistance.html', label: 'Financial Assistance' },
    ],
  },
  {
    href: '/medicare-plans-vernal-utah.html',
    label: 'Plans',
    children: [
      { href: '/best-medicare-advantage-vernal.html', label: 'Medicare Advantage' },
      { href: '/medigap.html', label: 'Medigap (Supplement)' },
      { href: '/best-part-d-plans-vernal.html', label: 'Part D Drug Plans' },
      { href: '/medicare-supplement-vs-advantage.html', label: 'Compare Plans' },
    ],
  },
  {
    href: '/medicare-coverage.html',
    label: 'Coverage',
    children: [
      { href: '/medicare-coverage.html', label: 'Services Coverage' },
      { href: '/medicare-drug-coverage.html', label: 'Drug Coverage' },
      { href: '/medicare-costs.html', label: 'Medicare Costs' },
      { href: '/medicare-irmaa.html', label: 'IRMAA' },
    ],
  },
  {
    href: '/medicare-help-center.html',
    label: 'Learn',
    children: [
      { href: '/medicare-help-center.html', label: 'Medicare Help Center' },
      { href: '/medicare-calculators.html', label: 'Calculators' },
      { href: '/medicare-glossary.html', label: 'Glossary' },
      { href: '/medicare-news.html', label: 'News' },
      { href: '/faq.html', label: 'FAQ' },
      { href: '/medicare-search.html', label: 'Search' },
    ],
  },
  {
    href: '/vernal.html',
    label: 'Locations',
    children: [
      { href: '/vernal.html', label: 'Vernal' },
      { href: '/medicare-roosevelt-utah.html', label: 'Roosevelt' },
      { href: '/medicare-duchesne-utah.html', label: 'Duchesne' },
      { href: '/medicare-cost-uintah-county.html', label: 'Uintah County' },
    ],
  },
  {
    href: '/medicare-quote-vernal.html',
    label: 'Contact',
    children: [
      { href: '/medicare-quote-vernal.html', label: 'Schedule a Free Review' },
      { href: '/reviews.html', label: 'Reviews' },
      { href: '/about.html', label: 'About' },
      // Non-Medicare product lines live here so Medicare stays the nav's focus.
      { label: 'Other Insurance' }, // section heading (no href)
      { href: '/aca.html', label: 'Under-65 Health Insurance' },
      { href: '/indemnity.html', label: 'Copay Coverage' },
      { href: '/life.html', label: 'Life Insurance' },
    ],
  },
];
