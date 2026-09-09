import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { DecayDataPoint } from '../types';
import { formatINR } from '../utils/calculator';
import { TrendingDown, Sparkles } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface TrendChartsProps {
  decayData: DecayDataPoint[];
  currentItemName: string;
}

export const TrendCharts: React.FC<TrendChartsProps> = ({
  decayData,
  currentItemName,
}) => {
  const itemName = currentItemName.trim() || 'This item';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DecayDataPoint = payload[0].payload;
      const isGreat = data.costPerUse <= 75;
      const isOkay = data.costPerUse <= 300;

      return (
        <div className="neu-card rounded-2xl p-4 text-xs space-y-1.5 text-slate-800 shadow-xl border border-white/80 min-w-[200px]">
          <div className="font-extrabold text-slate-800 pb-1.5 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-slate-900">{data.label} Milestone</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {data.totalUses} total uses
            </span>
          </div>
          <div className="pt-1 flex items-center justify-between gap-3">
            <span className="text-slate-500 font-semibold">Amortized Cost:</span>
            <span
              className={`font-mono font-extrabold text-sm ${
                isGreat ? 'text-emerald-700' : isOkay ? 'text-amber-700' : 'text-rose-700'
              }`}
            >
              {formatINR(data.costPerUse)}
              <span className="text-[10px] font-sans text-slate-400 font-normal"> / use</span>
            </span>
          </div>
          <div
            className={`text-[10px] font-bold px-2 py-1 rounded-lg mt-1 text-center ${
              isGreat
                ? 'bg-emerald-100 text-emerald-800'
                : isOkay
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isGreat ? '🌟 Great Value Zone (≤ ₹75)' : isOkay ? '👍 Okay Value Zone (≤ ₹300)' : '⚠️ Rethink Zone (> ₹300)'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neu-card rounded-3xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
      {/* Decorative warm ambient tint */}
      <div className="absolute -top-10 left-1/3 w-64 h-32 bg-gradient-to-r from-emerald-100/30 to-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Cost-Per-Use Timeline
            </h2>
            <InfoTooltip
              title="How the Decay Curve Works"
              content="The chart maps out how your cost-per-use plummets as you use the product more over time. The curve drops steeply at the beginning, showing that early frequent usage provides the fastest payback."
              formula="Cost/Use at Month N = Total Price ÷ (Monthly Usage × N)"
              position="bottom"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Watch cost per use drop for <strong className="text-slate-800 font-bold">{itemName}</strong> as cumulative uses increase
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2.5 text-xs font-bold">
          <span className="neu-pill px-3 py-1 rounded-full flex items-center space-x-1.5 text-emerald-800 bg-emerald-50/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-400" />
            <span>Great (&le; ₹75)</span>
          </span>
          <span className="neu-pill px-3 py-1 rounded-full flex items-center space-x-1.5 text-amber-800 bg-amber-50/50">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs shadow-amber-400" />
            <span>Okay (&le; ₹300)</span>
          </span>
        </div>
      </div>

      {/* Axis Guide Bar */}
      <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-500 font-semibold">
        {/* Y-Axis Explanation */}
        <div className="flex items-center space-x-1 text-emerald-800">
          <span>Y-Axis: Cost / Use in ₹</span>
        </div>

        {/* X-Axis Explanation */}
        <div className="flex items-center space-x-1 text-slate-600">
          <span>X-Axis: Ownership Timeline</span>
        </div>
      </div>

      {/* Recessed Sunken Chart Canvas */}
      <div className="neu-inset rounded-2xl p-4 sm:p-5 h-68 sm:h-76 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={decayData}
            margin={{ top: 12, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="warmEmeraldDecayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} opacity={0.6} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={75}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.75}
              label={{
                value: 'Great (₹75)',
                fill: '#047857',
                fontSize: 10,
                fontWeight: 700,
                position: 'insideBottomRight',
              }}
            />
            <ReferenceLine
              y={300}
              stroke="#d97706"
              strokeDasharray="4 4"
              strokeWidth={1.75}
              label={{
                value: 'Okay (₹300)',
                fill: '#b45309',
                fontSize: 10,
                fontWeight: 700,
                position: 'insideTopRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="costPerUse"
              stroke="#047857"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#warmEmeraldDecayGradient)"
              dot={{ fill: '#047857', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-medium pt-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>With regular use, initial costs amortize toward ₹0 per usage.</span>
      </div>
    </div>
  );
};
