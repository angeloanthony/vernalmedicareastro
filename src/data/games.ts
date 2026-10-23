// src/data/games.ts — the game library catalog: the single source of truth for
// every game card the portal (/games) renders. Adding a game = build its page,
// add one entry here, run the checks (tests/games-catalog.test.ts verifies that
// every published path is a real route and that nothing unpublished links).
//
// Identity is the stable `id`, never the title. `status` gates rendering: only
// 'published' games get a Play link; 'coming-soon' renders a labelled card with
// no link. Artwork is original inline SVG so the library adds no image requests.

export type GameStatus = 'published' | 'coming-soon';

export type GameCategoryKey =
  | 'medicare-adventures'
  | 'brain-memory'
  | 'word-games'
  | 'number-logic'
  | 'cards-classic'
  | 'trivia';

export interface GameCategory {
  key: GameCategoryKey;
  label: string;
  blurb: string;
}

/** Category order on the portal. A category renders only if it has a game. */
export const GAME_CATEGORIES: GameCategory[] = [
  { key: 'medicare-adventures', label: 'Medicare Adventures', blurb: 'Learn how Medicare works by playing — quizzes, exploration, and decisions with consequences.' },
  { key: 'brain-memory', label: 'Brain & Memory', blurb: 'Matching, patterns, and sequence puzzles.' },
  { key: 'word-games', label: 'Word Games', blurb: 'Word searches, crosswords, and vocabulary challenges.' },
  { key: 'number-logic', label: 'Number & Logic Puzzles', blurb: 'Sudoku and other number-placement puzzles.' },
  { key: 'cards-classic', label: 'Cards & Classic Games', blurb: 'Solitaire and other familiar favorites.' },
  { key: 'trivia', label: 'Trivia & Knowledge', blurb: 'General-knowledge questions with explanations.' },
];

export interface GameEntry {
  /** Stable identifier (analytics, tests). Never derived from the title. */
  id: string;
  title: string;
  /** One line under the title on a card. */
  tagline: string;
  /** Two or three sentences for the featured card and search. */
  description: string;
  /** Root-relative path with .html (build.format 'file'). */
  path: string;
  category: GameCategoryKey;
  status: GameStatus;
  featured?: boolean;
  /** ISO date the game went live (used for "New" badges and ordering). */
  released?: string;
  /** Short format line: what kind of game and how long it takes. */
  format: string;
  /** Plain-language accessibility notes shown on the card's detail line. */
  accessibility: string[];
  /** Original inline SVG (viewBox 0 0 320 200). */
  art: string;
}

export const GAMES: GameEntry[] = [
  {
    id: 'medicare-journey',
    title: 'Medicare Journey',
    tagline: 'Explore Medicare Valley and help your neighbors.',
    description:
      'Walk Linda through six illustrated places, talk to characters, solve puzzles, collect 15 knowledge cards, and finish by helping her neighbor Joe make enrollment decisions.',
    path: '/medicare-journey-game.html',
    category: 'medicare-adventures',
    status: 'published',
    featured: true,
    released: '2026-10-22',
    format: 'Exploration game · about 20 minutes · untimed',
    accessibility: ['No timer', 'Keyboard play', 'Progress saved on your device'],
    art:
      '<svg viewBox="0 0 320 200" aria-hidden="true"><defs><linearGradient id="gjSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a5f"/><stop offset="1" stop-color="#2d5f8a"/></linearGradient></defs><rect width="320" height="200" fill="url(#gjSky)"/><circle cx="262" cy="42" r="18" fill="#fde68a"/><path d="M0 120L50 70L90 100L140 52L200 110L250 70L320 118V200H0Z" fill="#3b6f9c"/><path d="M140 52L150 64L142 62L138 70L132 62L125 64Z" fill="#fff"/><path d="M0 150Q80 120 160 146T320 140V200H0Z" fill="#4ea36f"/><path d="M0 200C60 170 120 196 180 160C220 136 260 150 320 128V200Z" fill="#f1dbad"/><path d="M34 158l9-26 9 26zM262 150l8-24 8 24z" fill="#1d5b3a"/><g transform="translate(120 96) rotate(-7)"><rect width="100" height="64" rx="5" fill="#fbf1d6" stroke="#d9c08a" stroke-width="2"/><path d="M14 50C26 40 34 52 46 42" fill="none" stroke="#c2410c" stroke-width="2.5" stroke-dasharray="4 4"/><circle cx="74" cy="34" r="13" fill="#fff" stroke="#a16207" stroke-width="2"/><path d="M74 23L77 34L74 45L71 34Z" fill="#0b2c45"/><path d="M74 23L77 34L71 34Z" fill="#d0343d"/></g></svg>',
  },
  {
    id: 'medicare-adventure',
    title: 'Medicare Adventure',
    tagline: 'Five stages, points, and badges.',
    description:
      'A friendly five-stage board game: meet Medicare, match the Parts, set the enrollment calendar, crack the cost puzzle, and take on the final challenge. Every answer comes with a plain-English explanation.',
    path: '/medicare-adventure-game.html',
    category: 'medicare-adventures',
    status: 'published',
    featured: true,
    released: '2026-10-21',
    format: 'Quiz adventure · about 10 minutes · untimed',
    accessibility: ['No timer', 'Keyboard play', 'Large buttons'],
    art:
      '<svg viewBox="0 0 320 200" aria-hidden="true"><defs><linearGradient id="gaSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a5f"/><stop offset="1" stop-color="#2f6f9f"/></linearGradient></defs><rect width="320" height="200" fill="url(#gaSky)"/><g fill="#fde68a"><path d="M52 40l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z"/><path d="M270 30l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/><path d="M230 70l2 5 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z"/></g><path d="M0 140Q90 96 160 130T320 120V200H0Z" fill="#4ea36f"/><path d="M0 172Q100 140 200 170T320 160V200H0Z" fill="#3e8a5c"/><rect x="154" y="70" width="12" height="100" rx="3" fill="#7a4a26"/><path d="M110 78h78l12 11-12 11h-78z" fill="#d0343d"/><path d="M210 112h-78l-12 11 12 11h78z" fill="#2563eb"/><g fill="#fff8e6" font-family="Arial, sans-serif" font-weight="800" font-size="13" text-anchor="middle"><text x="152" y="93">LEARN</text><text x="168" y="127">PLAY</text></g><circle cx="262" cy="156" r="22" fill="#fbbf24" stroke="#a16207" stroke-width="3"/><path d="M262 143l4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1z" fill="#fff8e6"/></svg>',
  },
  {
    id: 'medicare-life-simulator',
    title: 'Medicare Life Simulator',
    tagline: 'Guide Joe’s retirement month by month.',
    description:
      'A turn-based decision game. Each month you choose what Joe does — Part B, COBRA, drug coverage, Medigap or Medicare Advantage — but only when a real enrollment window is open. Then you see the consequences.',
    path: '/medicare-life-simulator.html',
    category: 'medicare-adventures',
    status: 'published',
    featured: true,
    released: '2026-10-23',
    format: 'Decision simulation · about 10 minutes · untimed',
    accessibility: ['No timer', 'Keyboard play', 'Replay and compare runs'],
    art:
      '<svg viewBox="0 0 320 200" aria-hidden="true"><defs><linearGradient id="glSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a5f"/><stop offset="1" stop-color="#2a5a82"/></linearGradient></defs><rect width="320" height="200" fill="url(#glSky)"/><g transform="translate(60 40)"><rect width="120" height="120" rx="10" fill="#fff" stroke="#0b2c45" stroke-width="3"/><rect width="120" height="30" rx="10" fill="#d0343d"/><rect y="18" width="120" height="12" fill="#d0343d"/><rect x="22" y="-8" width="8" height="22" rx="4" fill="#0b2c45"/><rect x="90" y="-8" width="8" height="22" rx="4" fill="#0b2c45"/><g fill="#cbd5e1">' +
      [0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${12 + c * 21}" y="${42 + r * 19}" width="14" height="12" rx="2"/>`).join('')).join('') +
      '</g><rect x="54" y="80" width="14" height="12" rx="2" fill="#16a34a"/><circle cx="103" cy="86" r="12" fill="none" stroke="#d0343d" stroke-width="3"/></g><g stroke="#a16207" stroke-width="2"><path d="M210 150v8a16 6 0 0 0 32 0v-8" fill="#f59e0b"/><ellipse cx="226" cy="150" rx="16" ry="6" fill="#fcd34d"/><path d="M210 138v8a16 6 0 0 0 32 0v-8" fill="#f59e0b"/><ellipse cx="226" cy="138" rx="16" ry="6" fill="#fcd34d"/><path d="M244 160v8a16 6 0 0 0 32 0v-8" fill="#f59e0b"/><ellipse cx="260" cy="160" rx="16" ry="6" fill="#fcd34d"/></g><circle cx="256" cy="72" r="28" fill="#fff" stroke="#0b2c45" stroke-width="3"/><path d="M256 72V54M256 72l12 8" stroke="#0b2c45" stroke-width="3.5" stroke-linecap="round"/><circle cx="256" cy="72" r="3" fill="#d0343d"/></svg>',
  },
];

/** Games visitors can play right now, newest first. */
export const publishedGames = (): GameEntry[] =>
  GAMES.filter((g) => g.status === 'published').sort((a, b) => (b.released ?? '').localeCompare(a.released ?? ''));

/** Featured strip: published featured games first, then labelled upcoming ones. */
export const featuredGames = (): GameEntry[] =>
  GAMES.filter((g) => g.featured).sort((a, b) => (a.status === b.status ? 0 : a.status === 'published' ? -1 : 1));

/** Categories that have at least one game to show, each with its games. */
export const categoriesWithGames = (): { category: GameCategory; games: GameEntry[] }[] =>
  GAME_CATEGORIES.map((category) => ({ category, games: GAMES.filter((g) => g.category === category.key) })).filter((c) => c.games.length > 0);

/** A game may link only when it is published — the one rule every card obeys. */
export const isPlayable = (g: GameEntry): boolean => g.status === 'published';

/** "New" for 60 days after release. */
export const isNew = (g: GameEntry, today = new Date()): boolean => {
  if (!g.released || g.status !== 'published') return false;
  const days = (today.getTime() - new Date(g.released + 'T00:00:00Z').getTime()) / 86400000;
  return days >= 0 && days <= 60;
};
