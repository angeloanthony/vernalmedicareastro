// src/config/footer.ts — footer link groups as data.
// MIRRORS the "Medicare Help" nav currently in components/Footer.astro for a
// future refactor. Footer.astro is NOT changed yet (Phase 6).

export interface FooterLink {
  href: string;
  label: string;
}
export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: 'Medicare Help',
    links: [
      { href: '/medicare-help-vernal.html', label: 'Local Help' },
      { href: '/medicare-agent-vernal.html', label: 'About Rocco' },
      { href: '/part-d-help-vernal.html', label: 'Part D' },
      { href: '/medicare-enrollment-vernal.html', label: 'Enrollment' },
    ],
  },
];
