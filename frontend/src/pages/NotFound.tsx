import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Compass, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-navy-50 text-navy rounded-3xl flex items-center justify-center mx-auto">
        <Landmark className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-navy">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-1">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The government scheme or citizen resource you are looking for may have moved or is unavailable.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          to="/schemes"
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Schemes</span>
        </Link>
      </div>
    </div>
  );
};
