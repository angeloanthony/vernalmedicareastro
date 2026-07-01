// ---------------------------------------------------------------------------
// src/data/glossary.ts  —  Medicare glossary terms  (SCAFFOLD)
//
// Plain-English definitions powering a future glossary page (a net-new utility
// from Alta). Seeded in Phase 3.
// ---------------------------------------------------------------------------

export interface GlossaryTerm {
  term: string;
  definition: string;
}

// TODO (Phase 3): seed 100+ Medicare terms (port + verify from Alta glossary).
export const GLOSSARY: GlossaryTerm[] = [];
