// tests/games-catalog.test.ts — the game library's invariants.
//
//   A published game is a real page. An unpublished game never links.
//
// The portal (/games) renders only from data/games.ts, so these checks are what
// stop a card from pointing at a page that does not exist, or a "coming soon"
// game from becoming launchable by accident.
import { describe, it, expect } from 'vitest';
import {
  GAMES, GAME_CATEGORIES, publishedGames, featuredGames, categoriesWithGames, isPlayable, isNew,
} from '../src/data/games';

// Same mechanism as page-registry.test.ts: enumerate routes from source.
const routeFiles = import.meta.glob('../src/pages/**/*.astro');
const routes = new Set(
  Object.keys(routeFiles)
    .map((k) => k.replace('../src/pages/', '').replace(/\.astro$/, ''))
    .filter((slug) => !slug.includes('['))
    .map((slug) => (slug === 'index' ? '/' : `/${slug}.html`)),
);

describe('game catalog', () => {
  it('has unique, stable ids', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('every entry has a title, tagline, description, format, artwork and a known category', () => {
    const keys = new Set(GAME_CATEGORIES.map((c) => c.key));
    for (const g of GAMES) {
      expect(g.title.trim().length, g.id).toBeGreaterThan(0);
      expect(g.tagline.trim().length, g.id).toBeGreaterThan(0);
      expect(g.description.trim().length, g.id).toBeGreaterThan(40);
      expect(g.format.trim().length, g.id).toBeGreaterThan(0);
      expect(g.art.startsWith('<svg'), g.id).toBe(true);
      expect(g.accessibility.length, g.id).toBeGreaterThan(0);
      expect(keys.has(g.category), g.id).toBe(true);
    }
  });

  it('every published game points at a real route file', () => {
    for (const g of publishedGames()) {
      expect(routes.has(g.path), `${g.id} → ${g.path} is not a page in src/pages`).toBe(true);
    }
  });

  it('a published game has a release date; an unpublished game is never playable', () => {
    for (const g of GAMES) {
      if (g.status === 'published') expect(g.released, g.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(isPlayable(g)).toBe(g.status === 'published');
    }
  });

  it('the games this portal launches are exactly the published games (update when one ships)', () => {
    expect(publishedGames().map((g) => g.path).sort()).toEqual(['/medicare-adventure-game.html', '/medicare-journey-game.html', '/medicare-life-simulator.html', '/word-search.html']);
  });

  it('featured strip lists published games before upcoming ones', () => {
    const f = featuredGames();
    expect(f.length).toBeGreaterThan(0);
    expect(f[0].status).toBe('published');
    const firstSoon = f.findIndex((g) => g.status === 'coming-soon');
    if (firstSoon > -1) expect(f.slice(firstSoon).every((g) => g.status === 'coming-soon')).toBe(true);
  });

  it('only categories with a game render, and each has at least one published game or a labelled upcoming one', () => {
    const cats = categoriesWithGames();
    expect(cats.length).toBeGreaterThan(0);
    for (const c of cats) expect(c.games.length).toBeGreaterThan(0);
    const rendered = new Set(cats.map((c) => c.category.key));
    for (const c of GAME_CATEGORIES) {
      expect(rendered.has(c.key)).toBe(GAMES.some((g) => g.category === c.key));
    }
  });

  it('"New" lasts 60 days from release and never applies to unpublished games', () => {
    const g = publishedGames()[0];
    expect(isNew(g, new Date(g.released + 'T12:00:00Z'))).toBe(true);
    expect(isNew(g, new Date(new Date(g.released + 'T12:00:00Z').getTime() + 61 * 86400000))).toBe(false);
    const soon = GAMES.find((x) => x.status === 'coming-soon');
    if (soon) expect(isNew({ ...soon, released: '2000-01-01' })).toBe(false);
  });
});
