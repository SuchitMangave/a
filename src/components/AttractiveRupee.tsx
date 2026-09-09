import React from 'react';

interface AttractiveRupeeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * An attractive, beautifully styled Indian Rupee (₹) coin badge.
 * Features an embossed golden-amber and rich emerald medallion with warm tactile depth.
 * Strictly avoids any blue/purple neon.
 */
export const RupeeCoinBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-xl',
    lg: 'w-14 h-14 text-2xl',
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} rounded-2xl flex items-center justify-center select-none shadow-md shadow-amber-900/10 transition-transform duration-200 hover:scale-105`}
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #f59e0b 60%, #d97706 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '4px 4px 10px rgba(180, 83, 9, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.8)',
      }}
    >
      {/* Inner ring for coin detail */}
      <div className="absolute inset-1 rounded-xl border border-amber-600/30 pointer-events-none" />
      <span
        className="font-black font-serif text-amber-950 drop-shadow-xs"
        style={{ textShadow: '0 1px 1px rgba(255, 255, 255, 0.6)' }}
      >
        ₹
      </span>
    </div>
  );
};

export const AttractiveRupee: React.FC<AttractiveRupeeProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <span
      className={`inline-block font-bold tracking-tight text-amber-600 ${sizeClass} ${className}`}
      style={{
        textShadow: '0 0.5px 0.5px rgba(180, 83, 9, 0.2)',
      }}
    >
      ₹
    </span>
  );
};
