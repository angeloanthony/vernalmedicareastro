// ---------------------------------------------------------------------------
// src/types/Calculator.ts  —  shared contract for the calculator framework
//
// FORWARD-LOOKING (Phase 3). Defines the shape every calculator/tool will share
// so the framework (CalculatorLayout + inputs + results) is built once and each
// calculator (IRMAA, Cost, Drug, Penalty, Timeline) is just a definition + a
// compute function fed by data/annualMedicareData.ts. No implementation yet.
// ---------------------------------------------------------------------------

export type CalculatorFieldType =
  | 'number'
  | 'currency'
  | 'percent'
  | 'select'
  | 'radio'
  | 'date'
  | 'boolean';

export interface CalculatorOption {
  label: string;
  value: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: CalculatorFieldType;
  help?: string;
  /** For select/radio fields. */
  options?: CalculatorOption[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface CalculatorResultRow {
  label: string;
  value: string;
  /** Highlight the primary answer row. */
  emphasis?: boolean;
  help?: string;
}

export interface CalculatorResult {
  rows: CalculatorResultRow[];
  /** Optional plain-language summary sentence. */
  summary?: string;
}

export interface CalculatorDefinition {
  slug: string;
  title: string;
  description: string;
  fields: CalculatorField[];
  /** Standard compliance disclaimer text. */
  disclaimer: string;
}
