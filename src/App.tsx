import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { EvaluatedItem } from './types';
import {
  calculateCostPerUse,
  determineVerdict,
  generateDecayTrendData,
  PRESET_ITEMS,
} from './utils/calculator';
import { Header } from './components/Header';
import { SavingsSummary } from './components/SavingsSummary';
import { CalculatorForm } from './components/CalculatorForm';
import { VerdictCard } from './components/VerdictCard';
import { SavedItemsList } from './components/SavedItemsList';
import { Check } from 'lucide-react';

// Code-split recharts (the biggest bundle contributor) out of the main chunk.
// It's only needed once calculations exist, so loading it lazily keeps the
// initial mobile page load fast.
const TrendCharts = lazy(() =>
  import('./components/TrendCharts').then((m) => ({ default: m.TrendCharts }))
);

const STORAGE_KEY_ITEMS = 'cost_per_use_inr_items_v1';

export default function App() {
  // Saved items (in INR)
  const [savedItems, setSavedItems] = useState<EvaluatedItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load items', e);
    }
    // Seed with 3 simple everyday Indian items
    return PRESET_ITEMS.slice(0, 3).map((preset, idx) => {
      const calc = calculateCostPerUse(preset.price, preset.usesPerMonth, preset.lifespanMonths);
      const verdict = determineVerdict(calc.costPerUse, preset.price, preset.usesPerMonth, preset.lifespanMonths);
      return {
        id: `sample-${idx + 1}`,
        name: preset.name,
        price: preset.price,
        usesPerMonth: preset.usesPerMonth,
        lifespanMonths: preset.lifespanMonths,
        category: preset.category,
        createdAt: new Date().toISOString(),
        costPerUse: Number(calc.costPerUse.toFixed(1)),
        costPerUse1Mo: Number(calc.costPerUse1Mo.toFixed(1)),
        costPerDay: Number(calc.costPerDay.toFixed(1)),
        totalUses: calc.totalUses,
        verdict: verdict.verdict,
        verdictReason: verdict.reason,
      };
    });
  });

  // Active item inputs - initialized with a common Indian household item (Mixer Grinder)
  const [name, setName] = useState<string>('Mixer Grinder');
  const [price, setPrice] = useState<string>('3499');
  const [usesPerMonth, setUsesPerMonth] = useState<string>('25');
  const [lifespanMonths, setLifespanMonths] = useState<number>(12);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to save items', e);
    }
  }, [savedItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Calculations
  const numericPrice = Math.max(0, parseFloat(price) || 0);
  const numericUses = Math.max(0.1, parseFloat(usesPerMonth) || 1);

  const currentCalc = useMemo(() => {
    return calculateCostPerUse(numericPrice, numericUses, lifespanMonths);
  }, [numericPrice, numericUses, lifespanMonths]);

  const currentVerdict = useMemo(() => {
    return determineVerdict(currentCalc.costPerUse, numericPrice, numericUses, lifespanMonths);
  }, [currentCalc.costPerUse, numericPrice, numericUses, lifespanMonths]);

  const decayData = useMemo(() => {
    return generateDecayTrendData(numericPrice, numericUses, 24);
  }, [numericPrice, numericUses]);

  // Actions
  const handleSelectPreset = (index: number) => {
    const p = PRESET_ITEMS[index];
    if (p) {
      setName(p.name);
      setPrice(String(p.price));
      setUsesPerMonth(String(p.usesPerMonth));
      setLifespanMonths(p.lifespanMonths);
      setActiveId(null);
      showToast(`Loaded ${p.name}`);
    }
  };

  const handleResetActive = () => {
    setName('');
    setPrice('');
    setUsesPerMonth('15');
    setLifespanMonths(12);
    setActiveId(null);
    showToast('Form cleared');
  };

  const handleSaveItem = () => {
    if (!name.trim() || numericPrice <= 0) return;

    const newItem: EvaluatedItem = {
      id: activeId || `item-${Date.now()}`,
      name: name.trim(),
      price: numericPrice,
      usesPerMonth: numericUses,
      lifespanMonths,
      category: 'other',
      createdAt: new Date().toISOString(),
      costPerUse: Number(currentCalc.costPerUse.toFixed(1)),
      costPerUse1Mo: Number(currentCalc.costPerUse1Mo.toFixed(1)),
      costPerDay: Number(currentCalc.costPerDay.toFixed(1)),
      totalUses: currentCalc.totalUses,
      verdict: currentVerdict.verdict,
      verdictReason: currentVerdict.reason,
    };

    if (activeId) {
      setSavedItems((prev) => prev.map((item) => (item.id === activeId ? newItem : item)));
      showToast(`Updated "${newItem.name}"`);
    } else {
      setSavedItems((prev) => [newItem, ...prev]);
      setActiveId(newItem.id);
      showToast(`Saved "${newItem.name}"`);
    }
  };

  const handleSelectItem = (item: EvaluatedItem) => {
    setName(item.name);
    setPrice(String(item.price));
    setUsesPerMonth(String(item.usesPerMonth));
    setLifespanMonths(item.lifespanMonths);
    setActiveId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${item.name}"`);
  };

  const handleDeleteItem = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    if (activeId === id) setActiveId(null);
    showToast('Item deleted');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all saved items?')) {
      setSavedItems([]);
      setActiveId(null);
      showToast('All saved items cleared');
    }
  };

  const handleLoadSamples = () => {
    const samples: EvaluatedItem[] = PRESET_ITEMS.slice(0, 4).map((preset, idx) => {
      const calc = calculateCostPerUse(preset.price, preset.usesPerMonth, preset.lifespanMonths);
      const verdict = determineVerdict(calc.costPerUse, preset.price, preset.usesPerMonth, preset.lifespanMonths);
      return {
        id: `sample-${Date.now()}-${idx}`,
        name: preset.name,
        price: preset.price,
        usesPerMonth: preset.usesPerMonth,
        lifespanMonths: preset.lifespanMonths,
        category: preset.category,
        createdAt: new Date().toISOString(),
        costPerUse: Number(calc.costPerUse.toFixed(1)),
        costPerUse1Mo: Number(calc.costPerUse1Mo.toFixed(1)),
        costPerDay: Number(calc.costPerDay.toFixed(1)),
        totalUses: calc.totalUses,
        verdict: verdict.verdict,
        verdictReason: verdict.reason,
      };
    });
    setSavedItems(samples);
    showToast('Loaded sample Indian items');
  };

  return (
    <div className="min-h-screen neu-bg text-slate-800 font-sans antialiased pb-16 relative overflow-x-hidden">
      {/* Subtle warm natural ambient light backdrop (NO blue/purple neon) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-emerald-100/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-stone-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 neu-card px-4 py-3 rounded-2xl text-xs font-bold text-slate-800 shadow-xl border border-white/80 animate-in fade-in duration-200">
          <div className="p-1 rounded-full bg-emerald-500 text-white shadow-xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onLoadSampleData={handleLoadSamples}
        onResetActive={handleResetActive}
        savedCount={savedItems.length}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Summary Component: Lifetime Value & Avoided Costs */}
        <SavingsSummary
          items={savedItems}
          onLoadPresets={handleLoadSamples}
        />

        {/* Main 2-Column Section: Inputs & Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Inputs */}
          <CalculatorForm
            name={name}
            price={price}
            usesPerMonth={usesPerMonth}
            lifespanMonths={lifespanMonths}
            onNameChange={setName}
            onPriceChange={setPrice}
            onUsesPerMonthChange={setUsesPerMonth}
            onLifespanChange={setLifespanMonths}
            onSelectPreset={handleSelectPreset}
            onSaveItem={handleSaveItem}
            isExistingSaved={Boolean(activeId && savedItems.some((i) => i.id === activeId))}
          />

          {/* Verdict */}
          <VerdictCard
            name={name}
            price={numericPrice}
            usesPerMonth={numericUses}
            lifespanMonths={lifespanMonths}
            costPerUse={currentCalc.costPerUse}
            costPerUse1Mo={currentCalc.costPerUse1Mo}
            costPerDay={currentCalc.costPerDay}
            totalUses={currentCalc.totalUses}
            verdict={currentVerdict.verdict}
            verdictReason={currentVerdict.reason}
          />
        </div>

        {/* Visual Chart: Cost-Per-Use Spending Trend Over Time */}
        <Suspense
          fallback={
            <div className="neu-card rounded-2xl p-8 flex items-center justify-center text-sm text-slate-400">
              Loading chart…
            </div>
          }
        >
          <TrendCharts
            decayData={decayData}
            currentItemName={name}
          />
        </Suspense>

        {/* Saved Items List */}
        <SavedItemsList
          items={savedItems}
          onSelectItem={handleSelectItem}
          onDeleteItem={handleDeleteItem}
          onClearAll={handleClearAll}
        />
      </main>
    </div>
  );
}
