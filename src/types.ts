export type VerdictType = 'great_value' | 'okay' | 'rethink';

export type ItemCategory = 
  | 'electronics' 
  | 'apparel' 
  | 'kitchen_home' 
  | 'fitness' 
  | 'hobby_tools' 
  | 'other';

export interface EvaluatedItem {
  id: string;
  name: string;
  price: number;
  usesPerMonth: number;
  lifespanMonths: number;
  category: ItemCategory;
  createdAt: string;
  costPerUse: number;
  costPerUse1Mo: number;
  costPerDay: number;
  totalUses: number;
  verdict: VerdictType;
  verdictReason: string;
}

export interface DecayDataPoint {
  month: number;
  label: string;
  totalUses: number;
  costPerUse: number;
  thresholdGreat: number;
  thresholdOkay: number;
}

export interface MonthlySpendTrendPoint {
  month: string;
  amortizedSpend: number;
  cumulativeValueUses: number;
}

export interface PresetItem {
  name: string;
  price: number;
  usesPerMonth: number;
  lifespanMonths: number;
  category: ItemCategory;
  description: string;
}
