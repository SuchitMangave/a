import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { RupeeCoinBadge } from './AttractiveRupee';

interface HeaderProps {
  onLoadSampleData: () => void;
  onResetActive: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSampleData,
  onResetActive,
  savedCount,
}) => {
  return (
    <header className="neu-flat sticky top-0 z-20 transition-all backdrop-blur-md bg-opacity-95">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <RupeeCoinBadge size="md" />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Usely
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Smart amortized purchase evaluation for Indian shoppers
              </p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            id="load-sample-btn"
            onClick={onLoadSampleData}
            className="neu-btn flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-emerald-700 cursor-pointer"
            title="Load popular Indian examples"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Presets</span>
            {savedCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="reset-form-btn"
            onClick={onResetActive}
            className="neu-btn p-2.5 rounded-xl text-slate-500 hover:text-rose-600 transition cursor-pointer"
            title="Reset to blank form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
