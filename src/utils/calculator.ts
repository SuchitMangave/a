import { EvaluatedItem, ItemCategory, VerdictType, DecayDataPoint, PresetItem } from '../types';

export const PRESET_ITEMS: PresetItem[] = [
  {
    name: 'Mixer Grinder',
    price: 3499,
    usesPerMonth: 25,
    lifespanMonths: 24,
    category: 'kitchen_home',
    description: 'Daily cooking, chutney, and smoothie prep.',
  },
  {
    name: 'Running Shoes',
    price: 2999,
    usesPerMonth: 18,
    lifespanMonths: 12,
    category: 'fitness',
    description: 'Morning running and gym workouts.',
  },
  {
    name: 'ANC Wireless Earbuds',
    price: 3999,
    usesPerMonth: 24,
    lifespanMonths: 24,
    category: 'electronics',
    description: 'Daily commute, office calls, and music.',
  },
  {
    name: 'Wedding Party Outfit / Sherwani',
    price: 16000,
    usesPerMonth: 0.5,
    lifespanMonths: 12,
    category: 'apparel',
    description: 'Worn to occasional weddings and festive events.',
  },
  {
    name: 'Air Fryer',
    price: 5499,
    usesPerMonth: 16,
    lifespanMonths: 18,
    category: 'kitchen_home',
    description: 'Healthy snacks and quick daily meals.',
  },
  {
    name: 'Designer Party Watch',
    price: 11999,
    usesPerMonth: 2,
    lifespanMonths: 12,
    category: 'other',
    description: 'Worn only on rare special dinners.',
  },
];

export function calculateCostPerUse(
  price: number,
  usesPerMonth: number,
  lifespanMonths: number
): {
  costPerUse: number;
  costPerUse1Mo: number;
  costPerDay: number;
  totalUses: number;
} {
  const safePrice = Math.max(0, price);
  const safeUses = Math.max(0.1, usesPerMonth);
  const safeMonths = Math.max(1, lifespanMonths);

  const totalUses = Math.round(safeUses * safeMonths);
  const costPerUse = totalUses > 0 ? safePrice / totalUses : safePrice;
  const costPerUse1Mo = safeUses > 0 ? safePrice / safeUses : safePrice;
  const totalDays = safeMonths * 30.4375;
  const costPerDay = safePrice / totalDays;

  return {
    costPerUse,
    costPerUse1Mo,
    costPerDay,
    totalUses,
  };
}

export function determineVerdict(
  costPerUse: number,
  price: number,
  usesPerMonth: number,
  lifespanMonths: number
): { verdict: VerdictType; reason: string } {
  if (price <= 0) {
    return {
      verdict: 'great_value',
      reason: 'No upfront cost provides immediate return on value.',
    };
  }

  // In INR:
  // Great Value: <= ₹75/use, or <= ₹150/use for high daily frequency (>= 15 uses/month)
  if (costPerUse <= 75 || (costPerUse <= 150 && usesPerMonth >= 15)) {
    const punchyReason =
      usesPerMonth >= 15
        ? 'Great return on investment for frequent everyday use.'
        : 'Outstanding value — each use easily pays for itself.';
    return {
      verdict: 'great_value',
      reason: punchyReason,
    };
  }

  // Okay Value: <= ₹300/use, or <= ₹500/use with moderate usage
  if (costPerUse <= 300 || (costPerUse <= 500 && usesPerMonth >= 8)) {
    const punchyReason =
      usesPerMonth <= 3
        ? 'Fair value, provided you commit to using it regularly.'
        : 'Solid value as long as you use it consistently as planned.';
    return {
      verdict: 'okay',
      reason: punchyReason,
    };
  }

  // Rethink This: > ₹300/use or very rare usage
  const punchyRethink =
    usesPerMonth <= 2
      ? 'High per-use cost — consider renting or borrowing instead.'
      : 'Expensive per use — consider a lower-priced alternative.';

  return {
    verdict: 'rethink',
    reason: punchyRethink,
  };
}

export function generateDecayTrendData(
  price: number,
  usesPerMonth: number,
  maxMonths: number = 24
): DecayDataPoint[] {
  const points: DecayDataPoint[] = [];
  const safeUses = Math.max(0.1, usesPerMonth);
  const safePrice = Math.max(0, price);

  const monthsToEvaluate = [1, 2, 3, 6, 9, 12, 18, 24];

  for (const m of monthsToEvaluate) {
    if (m > maxMonths && m !== 12 && m !== 24) continue;
    const totalUsesAtMonth = Math.max(1, Math.round(safeUses * m));
    const cpu = Number((safePrice / totalUsesAtMonth).toFixed(0));
    points.push({
      month: m,
      label: m === 1 ? '1 mo' : m === 12 ? '1 yr' : m === 24 ? '2 yrs' : `${m} mos`,
      totalUses: totalUsesAtMonth,
      costPerUse: cpu,
      thresholdGreat: 75,
      thresholdOkay: 300,
    });
  }

  return points;
}

export function formatINR(value: number): string {
  if (isNaN(value)) return '₹0';
  const rounded = Math.round(value * 100) / 100;
  // If integer or >= 100, format with commas without decimals
  if (rounded >= 100 || Number.isInteger(rounded)) {
    return `₹${Math.round(rounded).toLocaleString('en-IN')}`;
  }
  return `₹${rounded.toLocaleString('en-IN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })}`;
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  electronics: 'Electronics',
  apparel: 'Clothing & Footwear',
  kitchen_home: 'Kitchen & Home',
  fitness: 'Fitness & Health',
  hobby_tools: 'Work & Tools',
  other: 'General',
};
