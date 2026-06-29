export interface Unit {
  id: string; // e.g. 'm', 'cm', 'inch'
  name: string; // e.g. 'Meter', 'Centimeter', 'Inch'
  pluralName: string; // e.g. 'meters', 'centimeters', 'inches'
  symbol: string; // e.g. 'm', 'cm', '"'
  factor: number; // Factor to convert to base unit (multiply by factor)
  offset?: number; // For temperature (e.g. C to F offset is 32)
}

export interface UnitCategory {
  id: string; // e.g. 'length', 'weight'
  name: string; // e.g. 'Length', 'Weight'
  icon: string; // Lucide icon name
  baseUnitId: string; // e.g. 'm'
  units: Unit[];
  realWorldContexts?: {
    threshold: number; // value in base unit
    label: string; // e.g. "≈ Large pineapple"
    symbolicRelation?: string;
  }[];
}

export interface ConversionResult {
  category: string;
  fromUnit: Unit;
  toUnit: Unit;
  inputValue: number;
  outputValue: number;
  alsoEquals: { unit: Unit; value: number }[];
  formula: string;
  steps: string;
  referenceTable: { input: number; output: number }[];
  faqs: { question: string; answer: string }[];
  realWorld?: string[];
  smartSuggestions: { unit: Unit; label: string }[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  category: string;
  fromUnitId: string;
  toUnitId: string;
  value: number;
}

export interface FavoriteItem {
  id: string;
  category: string;
  fromUnitId: string;
  toUnitId: string;
}

export interface SearchIntent {
  value?: number;
  fromUnitId?: string;
  toUnitId?: string;
  categoryId?: string;
  error?: string;
  isAiParsed?: boolean;
}
