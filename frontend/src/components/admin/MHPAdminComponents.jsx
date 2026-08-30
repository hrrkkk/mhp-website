import React from 'react';

/**
 * Reusable MHP Admin UI Component Library
 * Strict Color System:
 * - Deep Forest Green: #183A2A (Sidebar, Headers, Secondary CTAs)
 * - Warm Cream: #FFF7E8 (Page Background)
 * - Food Orange: #F47B20 (Primary CTAs, Active States, Highlights)
 * - Sage Green: #7D967E (Borders, Muted Text, Subtle Accents)
 * - Charcoal: #202522 (Primary Body Text)
 * - Soft White: #FFFFFF (Card Surfaces, Tables, Modals)
 */

export const MHPCard = ({ children, className = '', title, subtitle, action }) => (
  <div className={`bg-[#FFFFFF] border-2 border-[#7D967E]/30 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 ${className}`}>
    {(title || subtitle || action) && (
      <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
        <div>
          {title && <h3 className="font-display font-extrabold text-lg text-[#183A2A]">{title}</h3>}
          {subtitle && <p className="text-xs text-[#7D967E] font-medium">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div>{children}</div>
  </div>
);

export const MHPButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  loading = false,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-extrabold rounded-xl transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#F47B20] text-white hover:bg-[#FF882E] active:scale-98 border border-[#F47B20]",
    secondary: "bg-[#183A2A] text-[#FFF7E8] hover:bg-[#204935] active:scale-98 border border-[#183A2A]",
    outline: "bg-transparent text-[#183A2A] border-2 border-[#183A2A] hover:bg-[#183A2A] hover:text-[#FFF7E8]",
    ghost: "bg-transparent text-[#202522] hover:bg-[#7D967E]/10",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:scale-98 border border-rose-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-6 py-3.5 text-sm gap-2.5"
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export const MHPBadge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-[#183A2A]/10 text-[#183A2A] border-[#7D967E]/40",
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    warning: "bg-amber-100 text-amber-900 border-amber-300",
    danger: "bg-rose-100 text-rose-800 border-rose-300",
    orange: "bg-[#F47B20]/15 text-[#F47B20] border-[#F47B20]/40",
    green: "bg-[#183A2A] text-[#FFF7E8] border-[#183A2A]"
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border inline-flex items-center gap-1 ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export const MHPInput = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-extrabold text-[#183A2A] uppercase tracking-wider">{label}</label>}
    <input
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#7D967E]/30 text-[#202522] placeholder-[#7D967E]/60 text-xs font-semibold focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20] transition-colors ${className}`}
      {...props}
    />
    {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
  </div>
);

export const MHPSelect = ({ label, error, children, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-extrabold text-[#183A2A] uppercase tracking-wider">{label}</label>}
    <select
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#7D967E]/30 text-[#202522] text-xs font-semibold focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20] transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
  </div>
);

export const MHPTextarea = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-extrabold text-[#183A2A] uppercase tracking-wider">{label}</label>}
    <textarea
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#7D967E]/30 text-[#202522] placeholder-[#7D967E]/60 text-xs font-semibold focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20] transition-colors ${className}`}
      {...props}
    />
    {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
  </div>
);

export const MHPTable = ({ headers = [], children, className = '' }) => (
  <div className={`overflow-x-auto rounded-2xl border-2 border-[#7D967E]/30 bg-[#FFFFFF] shadow-sm ${className}`}>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-[#183A2A] text-[#FFF7E8] text-xs font-extrabold uppercase tracking-wider">
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3.5 border-b border-[#7D967E]/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#7D967E]/20 text-xs font-medium text-[#202522]">
        {children}
      </tbody>
    </table>
  </div>
);
