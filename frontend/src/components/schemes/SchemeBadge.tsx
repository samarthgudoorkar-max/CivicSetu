import React from 'react';

interface SchemeBadgeProps {
  type: 'central' | 'state' | 'category' | 'verified' | 'status';
  text: string;
  variant?: 'navy' | 'saffron' | 'green' | 'slate';
}

export const SchemeBadge: React.FC<SchemeBadgeProps> = ({ type, text, variant }) => {
  if (type === 'central') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-50 text-navy border border-navy-200">
        Central Scheme
      </span>
    );
  }

  if (type === 'state') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
        {text} State Scheme
      </span>
    );
  }

  if (type === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-govgreen-50 text-govgreen-700 border border-govgreen-200">
        <span className="w-1.5 h-1.5 rounded-full bg-govgreen"></span>
        Verified Source
      </span>
    );
  }

  const colorStyles = {
    navy: 'bg-navy-50 text-navy border-navy-200',
    saffron: 'bg-saffron-50 text-saffron-800 border-saffron-200',
    green: 'bg-govgreen-50 text-govgreen-700 border-govgreen-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[variant || 'slate'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyles}`}>
      {text}
    </span>
  );
};
