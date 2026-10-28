import React from 'react';

export const TricolorBar: React.FC = () => {
  return (
    <div
      className="w-full h-1 flex overflow-hidden select-none"
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex-1 bg-saffron h-full" />
      <div className="w-12 bg-white h-full border-x border-slate-200" />
      <div className="flex-1 bg-govgreen h-full" />
    </div>
  );
};
