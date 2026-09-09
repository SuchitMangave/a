import React from 'react';
import { EvaluatedItem, VerdictType } from '../types';
import { formatINR } from '../utils/calculator';
import { Trash2, ExternalLink, CheckCircle2, HelpCircle, AlertCircle, Layers } from 'lucide-react';

interface SavedItemsListProps {
  items: EvaluatedItem[];
  onSelectItem: (item: EvaluatedItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const SavedItemsList: React.FC<SavedItemsListProps> = ({
  items,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}) => {
  if (items.length === 0) return null;

  const getVerdictBadge = (verdict: VerdictType) => {
    switch (verdict) {
      case 'great_value':
        return (
          <span className="neu-badge-great inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Great Value</span>
          </span>
        );
      case 'okay':
        return (
          <span className="neu-badge-okay inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <HelpCircle className="w-3 h-3 text-amber-700" />
            <span>Okay</span>
          </span>
        );
      case 'rethink':
        return (
          <span className="neu-badge-rethink inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3 h-3 text-rose-700" />
            <span>Rethink</span>
          </span>
        );
    }
  };

  const getCostColor = (verdict: VerdictType) => {
    switch (verdict) {
      case 'great_value':
        return 'text-emerald-700';
      case 'okay':
        return 'text-amber-700';
      case 'rethink':
        return 'text-rose-700';
    }
  };

  const greatCount = items.filter((i) => i.verdict === 'great_value').length;
  const okayCount = items.filter((i) => i.verdict === 'okay').length;
  const rethinkCount = items.filter((i) => i.verdict === 'rethink').length;

  return (
    <div className="neu-card rounded-3xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/60">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Saved Items ({items.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Click any item to load and refine its cost calculation
          </p>
        </div>

        {/* Mini stats counters & Clear button */}
        <div className="flex items-center space-x-2">
          {greatCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {greatCount} Great
            </span>
          )}
          {okayCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {okayCount} Okay
            </span>
          )}
          {rethinkCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {rethinkCount} Rethink
            </span>
          )}

          <button
            id="clear-saved-btn"
            onClick={onClearAll}
            className="neu-btn text-xs text-slate-500 hover:text-rose-600 font-bold px-3 py-1.5 rounded-xl cursor-pointer ml-1"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            id={`saved-item-${item.id}`}
            onClick={() => onSelectItem(item)}
            className="neu-card-sm p-4 rounded-2xl flex items-center justify-between transition cursor-pointer group hover:scale-[1.01] hover:border-emerald-300"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                  {item.name}
                </span>
                {getVerdictBadge(item.verdict)}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Price: <span className="font-bold text-slate-800">{formatINR(item.price)}</span>
                {' • '}
                Usage: <span className="text-slate-800 font-semibold">{item.usesPerMonth}x/mo</span>
                {' • '}
                <span className="text-slate-500 font-sans">{item.lifespanMonths} mos</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Cost / use
                </span>
                <span className={`text-base font-extrabold font-mono ${getCostColor(item.verdict)}`}>
                  {formatINR(item.costPerUse)}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  title="Load into calculator"
                  className="neu-btn p-2 rounded-xl text-slate-500 hover:text-emerald-700 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  title="Delete item"
                  className="neu-btn p-2 rounded-xl text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
