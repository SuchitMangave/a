import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  formula?: string;
  variant?: 'info' | 'help' | 'inline';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  title,
  formula,
  variant = 'info',
  position = 'top',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const IconComponent = variant === 'help' ? HelpCircle : Info;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={title || 'More information'}
        className="p-1 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
      >
        <IconComponent className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-50 w-64 sm:w-72 p-3.5 rounded-2xl bg-white text-slate-800 text-xs shadow-2xl border border-emerald-100 neu-card-sm ${positionClasses} animate-in fade-in zoom-in-95 duration-150 pointer-events-auto`}
        >
          {title && (
            <div className="font-bold text-slate-900 pb-1 mb-1.5 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-semibold">{title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                Formula Insight
              </span>
            </div>
          )}

          <div className="text-slate-600 leading-relaxed font-normal">{content}</div>

          {formula && (
            <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-800">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                Math Formula:
              </div>
              <div className="font-bold text-emerald-700">{formula}</div>
            </div>
          )}

          {/* Tiny tail / arrow */}
          <div
            className={`absolute w-2 h-2 bg-white border border-emerald-100 transform rotate-45 ${
              position === 'top'
                ? 'top-full -mt-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0'
                : position === 'bottom'
                ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0'
                : position === 'left'
                ? 'left-full -ml-1 top-1/2 -translate-y-1/2 border-b-0 border-l-0'
                : 'right-full -mr-1 top-1/2 -translate-y-1/2 border-t-0 border-r-0'
            }`}
          />
        </div>
      )}
    </div>
  );
};
