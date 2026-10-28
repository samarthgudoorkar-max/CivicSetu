import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, ShieldCheck, Calendar, Building2, Check } from 'lucide-react';
import { Scheme } from '../../types';
import { SchemeBadge } from './SchemeBadge';
import { useSavedSchemes } from '../../context/SavedSchemesContext';

interface SchemeCardProps {
  scheme: Scheme;
  featured?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, featured = false }) => {
  const { isSaved, toggleSave } = useSavedSchemes();
  const saved = isSaved(scheme.id, scheme.slug);

  const formattedDate = scheme.last_verified_at
    ? new Date(scheme.last_verified_at).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Oct 2026';

  // Category Icon tint background
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Agriculture':
        return 'bg-govgreen-50 text-govgreen-700 border-govgreen-200';
      case 'Healthcare':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Education':
        return 'bg-navy-50 text-navy border-navy-200';
      case 'Women & Child Welfare':
        return 'bg-saffron-50 text-saffron-800 border-saffron-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md hover:border-slate-300 ${
        featured ? 'border-saffron-300 ring-1 ring-saffron-200 bg-linear-to-b from-saffron-50/20 to-white' : 'border-slate-200'
      }`}
    >
      <div className="p-6">
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {scheme.government_level === 'central' ? (
              <SchemeBadge type="central" text="Central" />
            ) : (
              <SchemeBadge type="state" text={scheme.state_name || scheme.state_code || 'State'} />
            )}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryStyles(
                scheme.category
              )}`}
            >
              {scheme.category}
            </span>
            {featured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-saffron-100 text-saffron-900 border border-saffron-300">
                Featured
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleSave(scheme.id, scheme.slug);
            }}
            className={`p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-navy ${
              saved
                ? 'bg-saffron text-white shadow-xs'
                : 'bg-slate-100 text-slate-500 hover:text-navy hover:bg-slate-200'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save scheme'}
            title={saved ? 'Remove from saved' : 'Save scheme'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Scheme Title */}
        <Link to={`/schemes/${scheme.slug}`} className="block group-hover:text-navy transition-colors">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-navy">
            {scheme.name}
          </h3>
        </Link>

        {/* Department */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3.5">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{scheme.department}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {scheme.description}
        </p>

        {/* Key Benefits Bullet preview */}
        {scheme.benefits && scheme.benefits.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
            <span className="text-[11px] font-bold text-navy uppercase tracking-wider block mb-1">
              Primary Benefit
            </span>
            <div className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
              <Check className="w-3.5 h-3.5 text-govgreen shrink-0 mt-0.5" />
              <span className="line-clamp-2">{scheme.benefits[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details & CTA */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-govgreen" />
          <span>Verified: {formattedDate}</span>
        </div>

        <Link
          to={`/schemes/${scheme.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-navy-800 group/link focus:outline-none focus:underline"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
