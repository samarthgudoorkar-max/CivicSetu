import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { SchemeCard } from '../components/schemes/SchemeCard';

export const Saved: React.FC = () => {
  const { savedSchemes, isLoading } = useSavedSchemes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider mb-2">
          <Bookmark className="w-4 h-4 text-saffron" />
          <span>Personal Bookmarks</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy tracking-tight">
          Saved Government Schemes
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Quickly access your shortlisted welfare initiatives, check required certificates, and monitor application links.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading your saved schemes...</p>
        </div>
      ) : savedSchemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Saved Schemes Yet</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            When browsing the catalogue, click the bookmark icon on any scheme to save it for easy offline reference and checklist creation.
          </p>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All Schemes</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};
