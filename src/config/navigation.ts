// src/config/navigation.ts — primary nav as data.
// MIRRORS the links currently hardcoded in components/Header.astro so a future
// refactor can read from here. Header.astro is NOT changed yet (Phase 6).

export interface NavLink {
  href: string;
  label: string;
}

// Absolute (root-relative) hrefs so nav resolves from any directory depth.
export const PRIMARY_NAV: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/medicare-decision-center.html', label: 'Start Here' },
  { href: '/medicare-help-center.html', label: 'Medicare Help Center' },
  { href: '/turning-65.html', label: 'Turning 65' },
  { href: '/medigap.html', label: 'Medigap' },
  { href: '/aca.html', label: 'Under-65 Health Insurance' },
  { href: '/indemnity.html', label: 'Copay Coverage' },
  { href: '/life.html', label: 'Life Insurance' },
  { href: '/faq.html', label: 'FAQ' },
  { href: '/reviews.html', label: 'Reviews' },
  { href: '/about.html', label: 'About' },
  { href: '/medicare-news.html', label: 'News' },
  { href: '/medicare-search.html', label: 'Search' },
];
