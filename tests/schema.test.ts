import { describe, it, expect } from 'vitest';
import { assembleSchema } from '../src/lib/schema';
import type { PageContext } from '../src/types/Page';

const ctx: PageContext = {
  page: {
    title: 'Medicare Part A vs Part B',
    description: 'What each part covers.',
    taxonomy: { silo: 'medicare-101', tags: ['part-a', 'part-b'] },
    faqs: [{ question: 'Is Part A free?', answer: 'Usually.' }],
    sources: [{ title: 'CMS Costs', url: 'https://www.cms.gov/costs', publisher: 'CMS' }],
  },
  meta: { canonical: 'https://vernalmedicare.com/medicare-part-a-vs-part-b.html' },
  author: 'rocco',
  lastUpdated: 'June 2026',
  breadcrumb: [
    { name: 'Home', href: '/' },
    { name: 'Part A vs Part B', href: '/medicare-part-a-vs-part-b.html' },
  ],
};

const types = (nodes: Record<string, unknown>[]) => nodes.map((n) => n['@type']);

describe('schema.assembleSchema', () => {
  const s = assembleSchema(ctx, 'Article');

  it('emits primary + breadcrumb + faq + person + organization', () => {
    expect(types(s)).toEqual(expect.arrayContaining(['Article', 'BreadcrumbList', 'FAQPage', 'Person', 'Organization']));
  });

  it('builds the primary from PageData with resolved author + freshness', () => {
    const primary = s[0];
    expect(primary['@type']).toBe('Article');
    expect(primary.headline).toBe('Medicare Part A vs Part B');
    expect((primary.author as { name: string }).name).toBe('Rocco DeLuca');
    expect(primary.dateModified).toBe('June 2026');
    expect((primary.citation as unknown[]).length).toBe(1);
  });

  it('lets the layout pick the primary @type', () => {
    expect(assembleSchema(ctx, 'HowTo')[0]['@type']).toBe('HowTo');
    expect(assembleSchema(ctx, 'MedicalWebPage')[0]['@type']).toBe('MedicalWebPage');
    expect(assembleSchema(ctx, 'Drug')[0]['@type']).toBe('WebPage'); // not-yet-built → fallback
  });

  it('omits the author Person when no author is set', () => {
    const noAuthor = assembleSchema({ ...ctx, author: undefined }, 'Article');
    expect(types(noAuthor)).not.toContain('Person');
    expect(types(noAuthor)).toContain('Organization');
  });
});
