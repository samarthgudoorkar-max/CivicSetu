import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Bookmark,
  FileCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { EligibilityResult, AssessmentStatus } from '../types';
import { checkEligibility, createChecklist } from '../services/api';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useAuth } from '../context/AuthContext';

export const Results: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, profile } = useAuth();
  const { isSaved, toggleSave } = useSavedSchemes();

  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initResults() {
      // If results came from navigation state
      if (location.state?.results) {
        setResults(location.state.results);
      } else {
        // Evaluate fresh with current profile
        setIsLoading(true);
        try {
          const res = await checkEligibility(profile || {}, undefined, userId);
          setResults(res);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    initResults();
  }, [location.state, profile, userId]);

  // Counts by status
  const eligibleResults = results.filter((r) => r.assessment_status === 'Potentially Eligible');
  const moreInfoResults = results.filter((r) => r.assessment_status === 'More Information Required');
  const notEligibleResults = results.filter((r) => r.assessment_status === 'Not Eligible Based on Supplied Information');

  // Filtered by active tab
  const displayedResults = results.filter((r) => {
    if (activeTab === 'eligible') return r.assessment_status === 'Potentially Eligible';
    if (activeTab === 'more_info') return r.assessment_status === 'More Information Required';
    if (activeTab === 'not_eligible') return r.assessment_status === 'Not Eligible Based on Supplied Information';
    return true;
  });

  const getStatusBadge = (status: AssessmentStatus) => {
    switch (status) {
      case 'Potentially Eligible':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-govgreen-50 text-govgreen-800 border border-govgreen-200">
            <CheckCircle2 className="w-4 h-4 text-govgreen" />
            {t('results.potentiallyEligible')}
          </span>
        );
      case 'More Information Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            {t('results.moreInfo')}
          </span>
        );
      case 'Not Eligible Based on Supplied Information':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-4 h-4 text-red-600" />
            {t('results.notEligible')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Info className="w-4 h-4 text-slate-500" />
            {t('results.unableToVerify')}
          </span>
        );
    }
  };

  const handleAddChecklist = async (schemeId: string) => {
    try {
      await createChecklist(schemeId, userId);
      navigate('/applications');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-navy uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Deterministic Assessment Report</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">
            {t('results.title')}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t('results.subtitle')} Every outcome is accompanied by transparent, audit-ready criteria explanations.
          </p>
        </div>

        <Link
          to="/eligibility"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Questionnaire</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('eligible')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'eligible'
              ? 'bg-govgreen-50 border-govgreen-400 ring-2 ring-govgreen-200'
              : 'bg-white border-slate-200 hover:border-govgreen-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-govgreen-900 uppercase">Potentially Eligible</span>
            <CheckCircle2 className="w-5 h-5 text-govgreen" />
          </div>
          <div className="text-3xl font-extrabold text-govgreen-800">{eligibleResults.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Schemes where all verified rules are met</p>
        </button>

        <button
          onClick={() => setActiveTab('more_info')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'more_info'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 uppercase">More Info Needed</span>
            <HelpCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-800">{moreInfoResults.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requires specific portal criteria check</p>
        </button>

        <button
          onClick={() => setActiveTab('not_eligible')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'not_eligible'
              ? 'bg-red-50 border-red-400 ring-2 ring-red-200'
              : 'bg-white border-slate-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-900 uppercase">Not Eligible</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-extrabold text-red-800">{notEligibleResults.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Conditions like age or income exceeded</p>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'all' ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Assessed Schemes ({results.length})
        </button>
        <button
          onClick={() => setActiveTab('eligible')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'eligible' ? 'bg-govgreen text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Potentially Eligible ({eligibleResults.length})
        </button>
        <button
          onClick={() => setActiveTab('more_info')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'more_info' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          More Info Required ({moreInfoResults.length})
        </button>
        <button
          onClick={() => setActiveTab('not_eligible')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'not_eligible' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Not Eligible ({notEligibleResults.length})
        </button>
      </div>

      {/* Results List with Explainability Accordions */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Running deterministic rule evaluation...</p>
        </div>
      ) : displayedResults.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-sm mx-auto">
          <p className="text-xs text-slate-500">No schemes found in this status category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedResults.map((item) => {
            const isExpanded = expandedId === item.scheme_id;
            const saved = isSaved(item.scheme_id, item.scheme_slug);

            return (
              <div
                key={item.scheme_id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Main Card Header */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(item.assessment_status)}
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.government_level === 'central' ? 'Central Scheme' : `${item.state_name || 'State'} Scheme`}
                      </span>
                    </div>

                    <Link
                      to={`/schemes/${item.scheme_slug}`}
                      className="text-base sm:text-lg font-bold text-navy hover:underline block"
                    >
                      {item.scheme_name}
                    </Link>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>

                  {/* Actions & Ranking */}
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      onClick={() => toggleSave(item.scheme_id, item.scheme_slug)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                        saved
                          ? 'bg-saffron text-white border-saffron'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={saved ? 'Saved' : 'Save scheme'}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.scheme_id)}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? 'Hide Criteria' : 'View Criteria'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <Link
                      to={`/schemes/${item.scheme_slug}`}
                      className="px-4 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Explainability Accordion Detail */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Satisfied Criteria */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <h4 className="text-xs font-bold text-govgreen uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          {t('results.satisfiedTitle')} ({item.satisfied_conditions.length})
                        </h4>
                        {item.satisfied_conditions.length > 0 ? (
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {item.satisfied_conditions.map((c, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-govgreen font-bold shrink-0">✓</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No specific criteria validated yet.</p>
                        )}
                      </div>

                      {/* Not Satisfied Criteria */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          {t('results.notSatisfiedTitle')} ({item.not_satisfied_conditions.length})
                        </h4>
                        {item.not_satisfied_conditions.length > 0 ? (
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {item.not_satisfied_conditions.map((c, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-600 font-bold shrink-0">✕</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-govgreen-700 font-medium">None! No criteria were violated.</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Information / Official Portal Checks */}
                    {item.missing_information.length > 0 && (
                      <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-xs">
                        <h4 className="font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-amber-700 shrink-0" />
                          {t('results.missingTitle')}
                        </h4>
                        <ul className="space-y-1 text-slate-700">
                          {item.missing_information.map((m, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-700 shrink-0">•</span>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer Meta & Checklist CTA */}
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-govgreen" />
                        <span>Source: </span>
                        <a
                          href={item.official_source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          {new URL(item.official_source).hostname} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <button
                        onClick={() => handleAddChecklist(item.scheme_id)}
                        className="px-3 py-1.5 bg-navy hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Start Application Checklist</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Official Disclaimer */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Government Disclaimer:</strong> {t('common.disclaimerNote')} CivicSetu provides deterministic rule assessment to help citizens understand published guidelines before visiting government portals.
      </div>
    </div>
  );
};
