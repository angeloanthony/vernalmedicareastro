// ---------------------------------------------------------------------------
// src/types/DecisionPath.ts — the situation-based router model (M39).
//
// The Decision Center answers one question — "where do I start?" — by turning
// the platform's hubs into a small set of SITUATIONS a person self-selects.
// Each path points at an existing hub (the primary destination) plus a few
// supporting links. It is a NAVIGATION LAYER over content we already have, not
// new content — so this model is deliberately thin and reusable (the same
// PATHS array can power a homepage widget or a future interactive wizard).
// ---------------------------------------------------------------------------

export interface DecisionLink {
  label: string;
  href: string;
}

export interface DecisionPath {
  id: string;
  /** How the visitor identifies themselves — e.g. "I'm turning 65". */
  situation: string;
  /** One line that confirms they're in the right place. */
  blurb: string;
  /** The hub this path routes into. */
  primary: DecisionLink;
  /** A few supporting destinations under this situation. */
  links: DecisionLink[];
}
