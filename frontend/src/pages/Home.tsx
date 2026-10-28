import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Sprout,
  Briefcase,
  Users,
  Home as HomeIcon,
  IndianRupee,
  Compass,
  FileCheck,
  ExternalLink,
  MapPin,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { fetchCategories, fetchSchemes, fetchStates } from '../services/api';
import { Scheme, CategoryInfo, StateInfo } from '../types';
import { SchemeCard } from '../components/schemes/SchemeCard';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [selectedState, setSelectedState] = useState<string>('TG');
  const [isLoading, setIsLoading] = useState(true);

  // Search suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchSuggestions = [
    'PM-KISAN income support',
    'Ayushman Bharat 5 Lakh health card',
    'Post-Matric Scholarship for students',
    'Gruha Lakshmi monthly welfare',
    'Rythu Bharosa Telangana agriculture',
    'Street vendor micro-credit loan',
    'Pradhan Mantri Awas Yojana Gramin',
  ];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, schemesRes, statesRes] = await Promise.all([
          fetchCategories(),
          fetchSchemes({ featured: true }),
          fetchStates(),
        ]);
        setCategories(cats);
        setFeaturedSchemes(schemesRes.items.slice(0, 4));
        setStates(statesRes);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/schemes');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return GraduationCap;
      case 'HeartPulse':
        return HeartPulse;
      case 'Sprout':
        return Sprout;
      case 'Briefcase':
        return Briefcase;
      case 'Users':
        return Users;
      case 'Home':
        return HomeIcon;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'IndianRupee':
        return IndianRupee;
      default:
        return BookOpen;
    }
  };

  // Alternating icon styling for categories
  const getCategoryCardStyle = (index: number) => {
    const cycle = index % 3;
    if (cycle === 0) {
      // Navy accent
      return {
        bg: 'bg-navy-50 group-hover:bg-navy',
        iconColor: 'text-navy group-hover:text-white',
        border: 'border-slate-200 hover:border-navy-300',
      };
    } else if (cycle === 1) {
      // Saffron accent
      return {
        bg: 'bg-saffron-50 group-hover:bg-saffron',
        iconColor: 'text-saffron-800 group-hover:text-white',
        border: 'border-slate-200 hover:border-saffron-300',
      };
    } else {
      // Green accent
      return {
        bg: 'bg-govgreen-50 group-hover:bg-govgreen',
        iconColor: 'text-govgreen-700 group-hover:text-white',
        border: 'border-slate-200 hover:border-govgreen-300',
      };
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-50 pt-16 pb-20 border-b border-slate-200/80 overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1A3C6E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Introductory badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-govgreen-50 border border-govgreen-200 text-govgreen-800 text-xs font-semibold mb-6 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-govgreen" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-[1.15] mb-5">
            Government schemes,{' '}
            <span className="text-saffron underline decoration-saffron/40 decoration-4 underline-offset-8">
              made simple.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('app.subheadline')}
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-12 pr-28 py-4 bg-white border-2 border-slate-300 rounded-2xl shadow-sm hover:border-slate-400 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy-100 text-sm sm:text-base text-slate-900 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 px-5 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Quick Suggestions Dropdown / Chips */}
            {showSuggestions && (
              <div
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 text-left z-30"
                onMouseLeave={() => setShowSuggestions(false)}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Popular Citizen Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {searchSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item);
                        setShowSuggestions(false);
                        navigate(`/schemes?q=${encodeURIComponent(item)}`);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 hover:bg-navy-50 hover:text-navy text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Search className="w-3 h-3 text-slate-400" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/eligibility"
              className="w-full sm:w-auto px-7 py-3.5 bg-navy hover:bg-navy-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-navy-200"
            >
              <CheckCircle2 className="w-5 h-5 text-saffron" />
              <span>{t('hero.ctaPrimary')}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/schemes"
              className="w-full sm:w-auto px-7 py-3.5 bg-saffron hover:bg-saffron-600 text-slate-950 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-saffron-200"
            >
              <Compass className="w-5 h-5 text-slate-900" />
              <span>{t('hero.ctaSecondary')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY EXPLORATION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              {t('categories.heading')}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              {t('categories.subheading')}
            </p>
          </div>
          <Link
            to="/schemes"
            className="mt-3 md:mt-0 text-sm font-bold text-navy hover:text-navy-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.icon);
            const style = getCategoryCardStyle(idx);
            return (
              <Link
                key={cat.id}
                to={`/schemes?category=${encodeURIComponent(cat.name)}`}
                className={`group bg-white rounded-2xl p-5 border ${style.border} transition-all duration-200 hover:shadow-md flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-navy`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center transition-colors mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${style.iconColor}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-navy transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.scheme_count} schemes
                  </span>
                  <span className="text-navy group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. HOW CIVICSETU WORKS */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-saffron uppercase tracking-wider block mb-1">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              {t('howWorks.heading')}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {t('howWorks.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-navy text-white text-lg font-extrabold flex items-center justify-center mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                {t('howWorks.step1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('howWorks.step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-7 border border-saffron-300 ring-1 ring-saffron-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-saffron text-slate-950 text-lg font-extrabold flex items-center justify-center mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                {t('howWorks.step2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('howWorks.step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-govgreen text-white text-lg font-extrabold flex items-center justify-center mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                {t('howWorks.step3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('howWorks.step3Desc')}
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/eligibility"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy hover:bg-navy-800 text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              Start Guided Questionnaire
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SCHEMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-govgreen uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Verified Database Records
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              {t('featured.heading')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t('featured.subheading')}
            </p>
          </div>
          <Link
            to="/schemes"
            className="mt-3 md:mt-0 text-sm font-bold text-navy hover:text-navy-800 flex items-center gap-1 group"
          >
            <span>{t('featured.viewAllSchemes')}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} featured={true} />
          ))}
        </div>
      </section>

      {/* 5. CENTRAL AND STATE GOVERNMENT EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
          {/* Subtle accent corner */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-saffron uppercase tracking-wider block mb-2">
              Jurisdiction Explorer
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              {t('stateExplorer.heading')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-8">
              Explore national welfare programs applicable across all Indian states or choose your home state for localized subsidies, scholarships, and pension benefits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Central Schemes button */}
              <Link
                to="/schemes?level=central"
                className="px-6 py-3.5 bg-white text-navy font-bold rounded-xl hover:bg-slate-100 transition-colors text-center text-sm shadow-sm"
              >
                Explore Central Schemes
              </Link>

              {/* State Selector */}
              <div className="flex items-center gap-2 bg-navy-800 border border-navy-600 rounded-xl px-3 py-1.5">
                <MapPin className="w-4 h-4 text-saffron shrink-0" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer pr-4"
                  aria-label="Select State"
                >
                  {states.filter((s) => !s.is_central).map((st) => (
                    <option key={st.code} value={st.code} className="bg-slate-900 text-white">
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => navigate(`/schemes?state_code=${selectedState}`)}
                  className="px-3.5 py-1.5 bg-saffron hover:bg-saffron-600 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  View State Schemes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CIVICSETU? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-govgreen uppercase tracking-wider block mb-1">
            Built for Citizen Trust
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            {t('why.heading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-1.5">
              {t('why.p1Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('why.p1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-800 flex items-center justify-center font-bold mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-1.5">
              {t('why.p2Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('why.p2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-govgreen-50 text-govgreen-700 flex items-center justify-center font-bold mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-1.5">
              {t('why.p3Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('why.p3Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy flex items-center justify-center font-bold mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-1.5">
              {t('why.p4Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('why.p4Desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
