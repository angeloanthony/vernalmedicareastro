import { describe, it, expect } from 'vitest';
import { relatedFor } from '../src/lib/related';
import type { PageIndexEntry } from '../src/data/pageIndex';

const INDEX: PageIndexEntry[] = [
  { href: '/self.html', title: 'Self', taxonomy: { silo: 'medicare-101', tags: ['a', 'b'] } },
  { href: '/same-2tags.html', title: 'Same silo, 2 shared tags', taxonomy: { silo: 'medicare-101', tags: ['a', 'b'] } },
  { href: '/same-0tags.html', title: 'Same silo, 0 shared tags', taxonomy: { silo: 'medicare-101', tags: ['x'] } },
  { href: '/other-1tag.html', title: 'Other silo, 1 shared tag', taxonomy: { silo: 'costs-irmaa', tags: ['a'] } },
  { href: '/pillar-other.html', title: 'Pillar, other silo', taxonomy: { silo: 'enrollment', tags: [], pillar: true } },
];

describe('related.relatedFor', () => {
  const result = relatedFor({ silo: 'medicare-101', tags: ['a', 'b'] }, INDEX, '/self.html');

  it('excludes the current page', () => {
    expect(result.find((r) => r.href === '/self.html')).toBeUndefined();
  });

  it('ranks same-silo + tag overlap highest (60 + 12·2 = 84)', () => {
    expect(result[0].href).toBe('/same-2tags.html');
    expect(result[0].score).toBe(84);
  });

  it('scores same-silo (60) above other-silo tag/pillar matches', () => {
    const scores = result.map((r) => r.score ?? 0);
    expect(scores).toEqual([...scores].sort((a, b) => b - a)); // descending
    const other = result.find((r) => r.href === '/other-1tag.html');
    const pillar = result.find((r) => r.href === '/pillar-other.html');
    expect(other?.score).toBe(12); // 12·1
    expect(pillar?.score).toBe(10); // pillar bonus only
  });

  it('honors the limit', () => {
    expect(relatedFor({ silo: 'medicare-101' }, INDEX, undefined, 2).length).toBe(2);
  });
});
