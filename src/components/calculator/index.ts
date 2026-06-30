// Barrel for the calculator framework. Import components from one place:
//   import { CalculatorLayout, CalculatorInput, CalculatorResult } from '../components/calculator';
//
// (Re-exports of .astro components are resolved by Astro's compiler at build
// time; full type-validation comes via `astro check`.)
export { default as CalculatorLayout } from './CalculatorLayout.astro';
export { default as CalculatorHeader } from './CalculatorHeader.astro';
export { default as CalculatorSection } from './CalculatorSection.astro';
export { default as CalculatorInput } from './CalculatorInput.astro';
export { default as CalculatorResult } from './CalculatorResult.astro';
export { default as CalculatorComparison } from './CalculatorComparison.astro';
export { default as CalculatorWarning } from './CalculatorWarning.astro';
export { default as CalculatorDisclaimer } from './CalculatorDisclaimer.astro';
export { default as CalculatorPrint } from './CalculatorPrint.astro';
export { default as CalculatorShare } from './CalculatorShare.astro';
export { default as CalculatorCTA } from './CalculatorCTA.astro';
