import React from 'react';
import { EvaluatedItem } from '../types';
import { formatINR } from '../utils/calculator';
import { ShieldCheck, PiggyBank, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

interface SavingsSummaryProps {
  items: EvaluatedItem[];
  onLoadPresets?: () => void;
}

export const SavingsSummary: React.FC<SavingsSummaryProps> = ({ items, onLoadPresets }) => {
  if (items.length === 0) {
    return (
      <div className="neu-card rounded-3xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 neu-card-sm">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Lifetime Value &amp; Avoided Cost Tracker
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Save your evaluated purchases to track high-utility assets and calculate money saved by skipping impulse buys.
            </p>
          </div>
        </div>

        {onLoadPresets && (
          <button
            type="button"
            onClick={onLoadPresets}
            className="neu-btn text-xs font-bold text-slate-800 hover:text-emerald-700 px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Try Sample Portfolio</span>
          </button>
        )}
      </div>
    );
  }

  // Calculations
  const totalEvaluatedPrice = items.reduce((acc, i) => acc + i.price, 0);
  const greatValueItems = items.filter((i) => i.verdict === 'great_value');
  const rethinkItems = items.filter((i) => i.verdict === 'rethink');
  const okayItems = items.filter((i) => i.verdict === 'okay');

  // Value of sound, high-utility purchases
  const greatValueTotal = greatValueItems.reduce((acc, i) => acc + i.price, 0);

  // Potential avoided costs / waste from rethink items
  const potentialAvoidedCost = rethinkItems.reduce((acc, i) => acc + i.price, 0);

  // Total lifetime uses delivered across all items
  const totalLifetimeUses = items.reduce((acc, i) => acc + i.totalUses, 0);

  return (
    <div className="neu-card rounded-3xl p-5 sm:p-6 mb-6 space-y-4 relative overflow-hidden">
      {/* Decorative ambient tint */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-emerald-100/30 to-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Portfolio Lifetime Value &amp; Avoided Costs
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Aggregated financial insights across {items.length} evaluated item{items.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {/* Verdict counts pill */}
        <div className="flex items-center space-x-1.5 text-[11px] font-bold">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {greatValueItems.length} Great Value
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {okayItems.length} Okay
          </span>
          {rethinkItems.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {rethinkItems.length} Rethink
            </span>
          )}
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        {/* 1. Total Evaluated Spend */}
        <div className="neu-card-sm rounded-2xl p-3.5 bg-gradient-to-b from-slate-50/50 to-transparent">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Evaluated Spend
            </span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-slate-900">
            {formatINR(totalEvaluatedPrice)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            across {items.length} total items
          </div>
        </div>

        {/* 2. High-Utility Investments */}
        <div className="neu-card-sm rounded-2xl p-3.5 bg-gradient-to-b from-emerald-50/60 to-transparent border-t border-emerald-200">
          <div className="flex items-center space-x-1.5 text-emerald-800 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Sound Investments
            </span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-700">
            {formatINR(greatValueTotal)}
          </div>
          <div className="text-[10px] text-emerald-800 font-medium mt-0.5">
            {greatValueItems.length} high-utility asset{greatValueItems.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* 3. Potential Avoided Costs (Rethink Items) */}
        <div className="neu-card-sm rounded-2xl p-3.5 bg-gradient-to-b from-amber-50/70 to-rose-50/30 border-t-2 border-amber-400">
          <div className="flex items-center space-x-1.5 text-amber-900 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Avoided Waste
            </span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-amber-900">
            {formatINR(potentialAvoidedCost)}
          </div>
          <div className="text-[10px] text-amber-800 font-medium mt-0.5">
            {rethinkItems.length > 0
              ? `saved if skipping ${rethinkItems.length} rethink item${rethinkItems.length === 1 ? '' : 's'}`
              : 'no high-risk items saved'}
          </div>
        </div>

        {/* 4. Total Expected Lifetime Uses */}
        <div className="neu-card-sm rounded-2xl p-3.5 bg-gradient-to-b from-stone-50/60 to-transparent">
          <div className="flex items-center space-x-1.5 text-slate-600 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Lifetime Uses
            </span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-slate-900">
            {totalLifetimeUses.toLocaleString('en-IN')}x
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            total amortized usages
          </div>
        </div>
      </div>
    </div>
  );
};
