import React, { useState } from 'react';
import { PRESET_ITEMS } from '../utils/calculator';
import { BookmarkPlus, Sparkles, Tag, Calendar, Clock, Calculator, ChevronDown } from 'lucide-react';
import { AttractiveRupee } from './AttractiveRupee';

interface CalculatorFormProps {
  name: string;
  price: string;
  usesPerMonth: string;
  lifespanMonths: number;
  onNameChange: (val: string) => void;
  onPriceChange: (val: string) => void;
  onUsesPerMonthChange: (val: string) => void;
  onLifespanChange: (val: number) => void;
  onSelectPreset: (presetIndex: number) => void;
  onSaveItem: () => void;
  isExistingSaved: boolean;
}

const FREQUENCY_SHORTCUTS = [
  { label: 'Daily (30x)', value: '30' },
  { label: 'Weekdays (22x)', value: '22' },
  { label: '2x / wk (8x)', value: '8' },
  { label: 'Weekly (4x)', value: '4' },
  { label: 'Rarely (1x)', value: '1' },
];

const LIFESPAN_SHORTCUTS = [
  { label: '6 Mo', months: 6 },
  { label: '1 Year', months: 12 },
  { label: '2 Years', months: 24 },
  { label: '3 Years', months: 36 },
];

const PRESET_DOT_COLORS = [
  'bg-amber-500', // Mixer Grinder
  'bg-emerald-500', // Running Shoes
  'bg-teal-500', // ANC Earbuds
  'bg-rose-500', // Wedding Sherwani
  'bg-orange-500', // Air Fryer
  'bg-stone-500', // Party Watch
];

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  name,
  price,
  usesPerMonth,
  lifespanMonths,
  onNameChange,
  onPriceChange,
  onUsesPerMonthChange,
  onLifespanChange,
  onSelectPreset,
  onSaveItem,
  isExistingSaved,
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const isValid = name.trim().length > 0 && Number(price) > 0;

  return (
    <div className="neu-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 relative overflow-hidden">
      {/* Decorative warm ambient glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-amber-100/40 to-emerald-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        {/* Quick Example Presets */}
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Popular Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_ITEMS.slice(0, 5).map((preset, idx) => (
              <button
                key={preset.name}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => onSelectPreset(idx)}
                className="neu-pill text-xs px-3 py-1.5 rounded-xl text-slate-700 font-semibold cursor-pointer flex items-center space-x-1.5 hover:text-emerald-700 transition"
              >
                <span className={`w-2 h-2 rounded-full ${PRESET_DOT_COLORS[idx % PRESET_DOT_COLORS.length]}`} />
                <span>{preset.name}</span>
                <span className="text-amber-700 font-bold text-[11px]">
                  ₹{preset.price.toLocaleString('en-IN')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 pt-1">
          {/* Item Name */}
          <div>
            <label
              htmlFor="item-name-input"
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Item Name</span>
            </label>
            <div className="neu-inset rounded-2xl px-4 py-3 transition focus-within:ring-2 focus-within:ring-emerald-500/40">
              <input
                id="item-name-input"
                type="text"
                placeholder="e.g. Mixer Grinder, Running Shoes, Kurta..."
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Price (Clean label: "Price", without redundant "IN INR (₹)") */}
          <div>
            <label
              htmlFor="item-price-input"
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <AttractiveRupee className="w-3.5 h-3.5 text-amber-600" />
              <span>Price</span>
            </label>
            <div className="neu-inset rounded-2xl px-4 py-3 flex items-center space-x-2.5 transition focus-within:ring-2 focus-within:ring-amber-500/40">
              <AttractiveRupee size="lg" className="select-none font-black" />
              <input
                id="item-price-input"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 3499"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                className="w-full bg-transparent text-lg font-bold font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Monthly Usage (Frequency) - Clean label, no redundant duplicate pill */}
          <div>
            <label
              htmlFor="item-uses-input"
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Monthly Usage</span>
            </label>
            <div className="neu-inset rounded-2xl px-4 py-3 mb-2.5 transition focus-within:ring-2 focus-within:ring-emerald-500/40">
              <input
                id="item-uses-input"
                type="number"
                min="0.1"
                step="any"
                placeholder="e.g. 25"
                value={usesPerMonth}
                onChange={(e) => onUsesPerMonthChange(e.target.value)}
                className="w-full bg-transparent text-base font-bold font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Standardized Frequency Chips matching Expected Lifespan styling */}
            <div className="grid grid-cols-5 gap-1.5">
              {FREQUENCY_SHORTCUTS.map((item) => {
                const isActive = usesPerMonth === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    id={`freq-btn-${item.value}`}
                    onClick={() => onUsesPerMonthChange(item.value)}
                    className={`text-xs py-2 px-1 rounded-xl text-center cursor-pointer transition ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20 font-bold scale-[1.02]'
                        : 'neu-pill text-slate-700 hover:text-slate-950 font-semibold'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expected Lifespan - Standardized chip styling */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Expected Lifespan</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {LIFESPAN_SHORTCUTS.map((item) => {
                const isActive = lifespanMonths === item.months;
                return (
                  <button
                    key={item.months}
                    type="button"
                    id={`lifespan-btn-${item.months}`}
                    onClick={() => onLifespanChange(item.months)}
                    className={`text-xs py-2 rounded-xl text-center cursor-pointer transition ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20 font-bold scale-[1.02]'
                        : 'neu-pill text-slate-700 hover:text-slate-950 font-semibold'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible "How it's calculated" link instead of prominent card */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowFormula((prev) => !prev)}
              className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-emerald-800 font-semibold cursor-pointer transition"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>How it's calculated</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  showFormula ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showFormula && (
              <div className="mt-2 p-3 rounded-2xl bg-white/80 border border-emerald-200/70 text-xs text-slate-700 space-y-1 animate-in fade-in duration-150">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Amortization Formula</span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                    Price ÷ Total Uses
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>Cost Per Use</strong> = Price &divide; (Monthly Usage &times; Expected Lifespan in Months).
                  Items with high frequency pay for themselves much faster.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          id="save-item-btn"
          type="button"
          onClick={onSaveItem}
          disabled={!isValid}
          className={`w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl font-extrabold text-sm cursor-pointer transition ${
            !isValid
              ? 'neu-inset opacity-40 text-slate-400 cursor-not-allowed'
              : 'neu-btn-action cursor-pointer'
          }`}
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>
            {isExistingSaved ? 'Update Saved Item' : 'Save Item to Collection'}
          </span>
        </button>
      </div>
    </div>
  );
};
