import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Building,
  MapPin,
  Check,
  ChevronDown,
  ArrowUpDown,
  Compass,
  AlertCircle
} from 'lucide-react';
import { fetchSchemes, fetchCategories, fetchStates } from '../services/api';
import { Scheme, CategoryInfo, StateInfo } from '../types';
import { SchemeCard } from '../components/schemes/SchemeCard';

export const Schemes: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const levelParam = searchParams.get('level') || 'all';
  const stateCodeParam = searchParams.get('state_code') || 'ALL';
  const beneficiaryParam = searchParams.get('beneficiary') || 'all';
  const sortByParam = searchParams.get('sort_by') || 'popular';

  // Component state
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Beneficiary quick filters
  const beneficiaryOptions = [
    { id: 'all', label: 'All Citizens' },
    { id: 'farmer', label: 'Farmers & Cultivators' },
    { id: 'student', label: 'Students & Youth' },
    { id: 'women', label: 'Women & Girls' },
    { id: 'senior', label: 'Senior Citizens (60+)' },
    { id: 'vendor', label: 'Micro-entrepreneurs' },
  ];

  // Fetch categories and states once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, sts] = await Promise.all([fetchCategories(), fetchStates()]);
        setCategories(cats);
        setStates(sts);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch schemes whenever URL query params change
  useEffect(() => {
    async function loadSchemes() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchSchemes({
          q: queryParam || undefined,
          category: categoryParam !== 'all' ? categoryParam : undefined,
          level: levelParam !== 'all' ? levelParam : undefined,
          state_code: stateCodeParam !== 'ALL' ? stateCodeParam : undefined,
          beneficiary: beneficiaryParam !== 'all' ? beneficiaryParam : undefined,
          sort_by: sortByParam,
        });
        setSchemes(res.items);
        setTotalCount(res.total);
      } catch (err) {
        setError('Failed to fetch schemes from the government records database.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSchemes();
  }, [queryParam, categoryParam, levelParam, stateCodeParam, beneficiaryParam, sortByParam]);

  // Sync search input with URL
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'ALL') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', searchQuery.trim());
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    queryParam !== '' ||
    categoryParam !== 'all' ||
    levelParam !== 'all' ||
    stateCodeParam !== 'ALL' ||
    beneficiaryParam !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Introduction */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4 text-saffron" />
          <span>Public Scheme Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
          Government Schemes Catalogue
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Browse verified Central and State Government programs. Every scheme record is cross-referenced with official ministerial notifications and direct application gateways.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by scheme name, benefits, or responsible department..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                updateParam('q', '');
              }}
              className="absolute right-24 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-navy hover:bg-navy-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Level and State Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Central vs State Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => updateParam('level', 'all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                levelParam === 'all' ? 'bg-white text-navy shadow-xs font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              All Jurisdictions
            </button>
            <button
              onClick={() => updateParam('level', 'central')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                levelParam === 'central' ? 'bg-white text-navy shadow-xs font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Central Government
            </button>
            <button
              onClick={() => updateParam('level', 'state')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                levelParam === 'state' ? 'bg-white text-navy shadow-xs font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              State Governments
            </button>
          </div>

          {/* State Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">State:</span>
            <select
              value={stateCodeParam}
              onChange={(e) => updateParam('state_code', e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-navy"
            >
              <option value="ALL">All States / Central</option>
              {states.filter((s) => !s.is_central).map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortByParam}
              onChange={(e) => updateParam('sort_by', e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-navy"
            >
              <option value="popular">Recommended / Featured</option>
              <option value="name_asc">Scheme Name (A-Z)</option>
              <option value="verified_desc">Most Recently Verified</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => updateParam('category', 'all')}
            className={`px-3 py-1.5 rounded-full border shrink-0 transition-colors ${
              categoryParam === 'all'
                ? 'bg-navy text-white border-navy font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam('category', c.name)}
              className={`px-3 py-1.5 rounded-full border shrink-0 transition-colors ${
                categoryParam.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-saffron text-slate-950 border-saffron-400 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {c.name} ({c.scheme_count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Header: Count & Active Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 text-sm">
        <div className="text-slate-700 font-medium">
          Showing <span className="font-bold text-navy">{totalCount}</span> verified scheme{totalCount !== 1 ? 's' : ''}
          {stateCodeParam !== 'ALL' && ` in ${stateCodeParam}`}
          {categoryParam !== 'all' && ` under "${categoryParam}"`}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs text-navy font-semibold hover:underline self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Main Grid / States */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4 h-64"
            >
              <div className="flex justify-between">
                <div className="w-20 h-5 bg-slate-200 rounded"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
              </div>
              <div className="w-3/4 h-6 bg-slate-200 rounded"></div>
              <div className="w-1/2 h-4 bg-slate-100 rounded"></div>
              <div className="w-full h-12 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No schemes found</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            We could not find any government schemes matching your current filters. Try relaxing the search keywords or selecting all categories.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

      {/* Scope Disclaimer Banner */}
      <div className="mt-14 bg-slate-100 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-800">Need personal eligibility evaluation?</span>
          <p className="text-slate-500 mt-0.5">
            Use our deterministic Eligibility Checker to see which of these schemes you potentially qualify for.
          </p>
        </div>
        <Link
          to="/eligibility"
          className="px-5 py-2.5 bg-navy hover:bg-navy-800 text-white font-bold rounded-xl shrink-0 transition-colors"
        >
          Check My Eligibility
        </Link>
      </div>
    </div>
  );
};
