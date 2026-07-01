// ---------------------------------------------------------------------------
// src/types/FAQ.ts  —  shared contract for FAQ content
//
// One Q&A shape reused everywhere, so the visible accordion and the FAQPage
// JSON-LD are always generated from the same data (fixes the existing
// schema-without-visible-markup gap). Canonical data lives in data/faq/.
// ---------------------------------------------------------------------------

export interface FAQItem {
  question: string;
  /** May contain inline HTML; stripped to text for JSON-LD. */
  answer: string;
}

export interface FAQCategory {
  key: string;
  title: string;
  blurb?: string;
  items: FAQItem[];
}
