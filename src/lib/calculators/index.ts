// src/lib/calculators — the calculator FRAMEWORK (no specific calculator).
// A calculator = a CalculatorDefinition (UI, from types) + a CalculatorCompute
// (pure fields→result). These helpers are shared by every calculator so each
// one stays ~tiny; the IRMAA/Drug/Penalty math lives in its own file later.

import type { CalculatorResult } from '../../types/Calculator';

/** A calculator's compute step: pure (raw field strings in → result out). */
export type CalculatorCompute = (fields: Record<string, string>) => CalculatorResult;

/** Tier lookup: index of the first upper bound `value` does NOT exceed.
 *  e.g. bracketIndex(150000, [109000, 137000, 171000]) === 2.
 *  Returns bounds.length if above all bounds. Generic — IRMAA builds on this. */
export const bracketIndex = (value: number, upperBounds: number[]): number => {
  for (let i = 0; i < upperBounds.length; i++) {
    if (value <= upperBounds[i]) return i;
  }
  return upperBounds.length;
};

// ── Client-side DOM helpers (used by each calculator's own <script>) ──────────

/** Read every [data-calc-field] control under `root` into a plain object. */
export function readFields(root: ParentNode): Record<string, string> {
  const out: Record<string, string> = {};
  root.querySelectorAll<HTMLElement>('[data-calc-field]').forEach((el) => {
    const key = el.getAttribute('data-calc-field');
    if (!key) return;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      out[key] = el.checked ? 'true' : 'false';
    } else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
      out[key] = el.value;
    } else {
      const checked = el.querySelector<HTMLInputElement>('input:checked');
      out[key] = checked?.value ?? '';
    }
  });
  return out;
}

/** Render a CalculatorResult into a [data-calc-results] container. */
export function renderResults(container: HTMLElement, result: CalculatorResult): void {
  const rows = result.rows
    .map(
      (r) =>
        `<div class="calc-row${r.emphasis ? ' is-emphasis' : ''}"><dt>${r.label}</dt><dd>${r.value}</dd></div>`,
    )
    .join('');
  const summary = result.summary ? `<p class="calc-result-summary">${result.summary}</p>` : '';
  container.innerHTML = `${summary}<dl class="calc-result-list">${rows}</dl>`;
}

/** Wire a form: recompute + render on every input/change. Returns a teardown fn. */
export function bindCalculator(
  form: HTMLElement,
  resultsEl: HTMLElement,
  compute: CalculatorCompute,
): () => void {
  const handler = () => renderResults(resultsEl, compute(readFields(form)));
  form.addEventListener('input', handler);
  form.addEventListener('change', handler);
  handler();
  return () => {
    form.removeEventListener('input', handler);
    form.removeEventListener('change', handler);
  };
}
