import React from 'react';
import { VerdictType } from '../types';
import { formatINR } from '../utils/calculator';
import { CheckCircle2, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface VerdictCardProps {
  name: string;
  price: number;
  usesPerMonth: number;
  lifespanMonths: number;
  costPerUse: number;
  costPerUse1Mo: number;
  costPerDay: number;
  totalUses: number;
  verdict: VerdictType;
  verdictReason: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  name,
  costPerUse,
  costPerUse1Mo,
  costPerDay,
  totalUses,
  lifespanMonths,
  verdict,
  verdictReason,
}) => {
  const verdictConfig = {
    great_value: {
      title: 'Great Value',
      badgeClass: 'neu-badge-great',
      icon: CheckCircle2,
      textColor: 'text-emerald-700',
      auraGradient: 'from-emerald-300/35 via-emerald-100/20 to-transparent',
      cardBorder: 'border-emerald-300/60',
      insetGlow: 'shadow-emerald-900/5',
    },
    okay: {
      title: 'Okay Value',
      badgeClass: 'neu-badge-okay',
      icon: HelpCircle,
      textColor: 'text-amber-700',
      auraGradient: 'from-amber-300/35 via-amber-100/20 to-transparent',
      cardBorder: 'border-amber-300/60',
      insetGlow: 'shadow-amber-900/5',
    },
    rethink: {
      title: 'Rethink This',
      badgeClass: 'neu-badge-rethink',
      icon: AlertCircle,
      textColor: 'text-rose-700',
      auraGradient: 'from-rose-300/35 via-rose-100/20 to-transparent',
      cardBorder: 'border-rose-300/60',
      insetGlow: 'shadow-rose-900/5',
    },
  }[verdict];

  const VerdictIcon = verdictConfig.icon;

  return (
    <div
      id="verdict-card"
      className={`neu-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden transition-all duration-300 border ${verdictConfig.cardBorder}`}
    >
      {/* Dynamic background glow strictly matching verdict */}
      <div
        className={`absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-bl ${verdictConfig.auraGradient} rounded-full blur-3xl pointer-events-none transition-all duration-500`}
      />

      <div className="space-y-5 relative z-10">
        {/* Top bar with Item name & unified verdict badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Evaluation Verdict
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
              {name.trim() ? name : 'Item Evaluation'}
            </h3>
          </div>

          <div
            id="verdict-badge"
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold shrink-0 ${verdictConfig.badgeClass} transform hover:scale-105 transition`}
          >
            <VerdictIcon className="w-4 h-4" />
            <span>{verdictConfig.title}</span>
          </div>
        </div>

        {/* Tactile Sunken Display for Cost Per Use */}
        <div className={`neu-inset rounded-2xl p-5 sm:p-6 text-center space-y-1.5 relative overflow-hidden ${verdictConfig.insetGlow}`}>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Calculated Cost Per Use
          </span>

          <div className="flex items-baseline justify-center space-x-2">
            <span
              className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${verdictConfig.textColor} drop-shadow-xs transition-colors`}
            >
              {formatINR(costPerUse)}
            </span>
            <span className="text-sm font-bold text-slate-500">
              / use
            </span>
          </div>

          {/* Punchy single-sentence verdict narrative */}
          <p className="text-xs sm:text-sm text-slate-700 pt-1.5 font-medium leading-relaxed max-w-sm mx-auto">
            {verdictReason}
          </p>
        </div>

        {/* Bottom stats row: Neutral usage stats + Warning-accented abandonment risk */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {/* 1. Total Uses (Neutral usage fact) */}
          <div className="neu-card-sm rounded-2xl p-3 bg-gradient-to-b from-slate-50/60 to-transparent">
            <span className="block text-[11px] font-bold text-slate-700">
              Total Uses
            </span>
            <span className="block text-sm sm:text-base font-extrabold font-mono text-slate-900 mt-0.5">
              {totalUses}x
            </span>
            <span className="block text-[10px] text-slate-500 font-medium">
              over {lifespanMonths} mos
            </span>
          </div>

          {/* 2. Daily Rate (Neutral usage fact) */}
          <div className="neu-card-sm rounded-2xl p-3 bg-gradient-to-b from-slate-50/60 to-transparent">
            <span className="block text-[11px] font-bold text-slate-700">
              Daily Rate
            </span>
            <span className="block text-sm sm:text-base font-extrabold font-mono text-slate-900 mt-0.5">
              {formatINR(costPerDay)}
            </span>
            <span className="block text-[10px] text-slate-500 font-medium">
              per day
            </span>
          </div>

          {/* 3. Month 1 Rate (Separated risk/caution metric with warning accent & tooltip) */}
          <div className="neu-card-sm rounded-2xl p-3 bg-gradient-to-b from-amber-50/80 to-amber-100/30 border-2 border-amber-300 shadow-xs">
            <div className="flex items-center justify-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="text-[11px] font-extrabold text-amber-900">
                Month 1 Rate
              </span>
              <InfoTooltip
                title="Abandonment Risk Metric"
                content="Your amortized cost per use if you abandon or stop using this item after the first 30 days. Highlights the financial downside of impulse buys that end up unused."
                formula={`Price ÷ Month 1 Uses = ${formatINR(costPerUse1Mo)}`}
                position="top"
              />
            </div>
            <span className="block text-sm sm:text-base font-black font-mono text-amber-950 mt-0.5">
              {formatINR(costPerUse1Mo)}
            </span>
            <span className="block text-[10px] text-amber-800 font-semibold">
              if abandoned
            </span>
          </div>
        </div>
      </div>

      {/* Threshold reference row */}
      <div className="pt-4 flex items-center justify-between text-[11px] font-semibold gap-1.5 border-t border-slate-200/60">
        <span className="neu-pill px-2.5 py-1 rounded-full flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs shadow-emerald-400" />
          <span>&le; ₹75: Great</span>
        </span>
        <span className="neu-pill px-2.5 py-1 rounded-full flex items-center space-x-1.5 text-amber-800 bg-amber-50/50">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-xs shadow-amber-400" />
          <span>₹75–₹300: Okay</span>
        </span>
        <span className="neu-pill px-2.5 py-1 rounded-full flex items-center space-x-1.5 text-rose-800 bg-rose-50/50">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-xs shadow-rose-400" />
          <span>&gt; ₹300: Rethink</span>
        </span>
      </div>
    </div>
  );
};
