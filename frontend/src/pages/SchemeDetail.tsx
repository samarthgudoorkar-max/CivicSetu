import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  Check,
  Sparkles,
  Info,
  Clock,
  Laptop
} from 'lucide-react';
import { fetchSchemeBySlug, createChecklist } from '../services/api';
import { Scheme } from '../types';
import { SchemeBadge } from '../components/schemes/SchemeBadge';
import { useSavedSchemes } from '../../src/context/SavedSchemesContext';
import { useAuth } from '../context/AuthContext';

export const SchemeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { isSaved, toggleSave } = useSavedSchemes();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [checklistAdded, setChecklistAdded] = useState(false);

  useEffect(() => {
    async function loadScheme() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSchemeBySlug(slug);
        setScheme(data);
      } catch (err) {
        setError('Scheme details could not be found.');
      } finally {
        setIsLoading(false);
      }
    }
    loadScheme();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-medium">Retrieving verified government scheme data...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Scheme Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'The requested scheme is not in our database.'}</p>
        <Link
          to="/schemes"
          className="px-5 py-2.5 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-800"
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const saved = isSaved(scheme.id, scheme.slug);
  const ruleDef = scheme.rules && scheme.rules.length > 0 ? scheme.rules[0].rule_definition : {};

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme.name,
        text: scheme.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToChecklist = async () => {
    try {
      await createChecklist(scheme.id, userId);
      setChecklistAdded(true);
      setTimeout(() => navigate('/applications'), 600);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Schemes</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {scheme.government_level === 'central' ? (
            <SchemeBadge type="central" text="Central" />
          ) : (
            <SchemeBadge type="state" text={scheme.state_name || scheme.state_code || 'State'} />
          )}
          <SchemeBadge type="category" text={scheme.category} variant="navy" />
          <SchemeBadge type="verified" text="Verified" />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight mb-3">
          {scheme.name}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 mb-6">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-700">{scheme.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-slate-400" />
            <span>Mode: <strong>{scheme.application_mode}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-govgreen" />
            <span>
              Last verified:{' '}
              {scheme.last_verified_at
                ? new Date(scheme.last_verified_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Oct 2026'}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed max-w-4xl mb-8">
          {scheme.description}
        </p>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          {/* Check My Eligibility */}
          <Link
            to={`/eligibility?scheme=${scheme.slug}`}
            className="px-5 py-2.5 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-saffron" />
            <span>Check My Eligibility</span>
          </Link>

          {/* Official Portal Link */}
          {scheme.application_url && (
            <a
              href={scheme.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-saffron hover:bg-saffron-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Add to Checklist */}
          <button
            onClick={handleAddToChecklist}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 ${
              checklistAdded
                ? 'bg-govgreen text-white border-govgreen'
                : 'bg-white text-slate-700 border-slate-300 hover:border-navy hover:text-navy'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{checklistAdded ? 'Added to Checklist!' : 'Add to My Checklist'}</span>
          </button>

          {/* Save Scheme */}
          <button
            onClick={() => toggleSave(scheme.id, scheme.slug)}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              saved
                ? 'bg-saffron text-white border-saffron'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Benefits & Eligibility Details (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Benefits Section */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-govgreen"></span>
              Scheme Benefits & Assistance
            </h2>
            <div className="space-y-3">
              {scheme.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-govgreen-100 text-govgreen flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility Requirements Breakdown */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-navy"></span>
              Eligibility Requirements & Criteria
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Jurisdiction & Domicile
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {ruleDef.allowed_states && !ruleDef.allowed_states.includes('ALL')
                    ? `Residents of ${ruleDef.allowed_states.join(', ')} only`
                    : 'Open across all Indian States & Union Territories'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Age Bracket
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {ruleDef.min_age || ruleDef.max_age
                    ? `${ruleDef.min_age || 0} to ${ruleDef.max_age || 'No maximum'} years`
                    : 'No specific age restrictions specified'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Income Ceiling
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {ruleDef.max_annual_income
                    ? `Annual household income up to ₹${ruleDef.max_annual_income.toLocaleString('en-IN')}`
                    : 'No strict income ceiling mandated'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Target Beneficiaries
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {scheme.target_beneficiaries.join(', ')}
                </span>
              </div>
            </div>

            {/* Additional Conditions / Advisory */}
            {ruleDef.unverified_conditions && ruleDef.unverified_conditions.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Info className="w-4 h-4 shrink-0" />
                  Specific Conditions Checked at Official Portal:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {ruleDef.unverified_conditions.map((cond, i) => (
                    <li key={i}>{cond}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Step-by-Step Application Procedure */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron"></span>
              Application Procedure
            </h2>

            <ol className="relative border-l border-slate-200 ml-3 space-y-6 text-xs sm:text-sm">
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-navy text-white rounded-full ring-4 ring-white text-xs font-bold">
                  1
                </span>
                <h3 className="font-bold text-slate-900 mb-1">Prepare Required Documents</h3>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Collect authentic copies of your Aadhaar card, bank passbook, and category/land/income certificates as specified.
                </p>
              </li>

              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-navy text-white rounded-full ring-4 ring-white text-xs font-bold">
                  2
                </span>
                <h3 className="font-bold text-slate-900 mb-1">Access Official Government Gateway</h3>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Navigate to the authorized ministerial portal (<strong>{scheme.department}</strong>) at{' '}
                  <a
                    href={scheme.official_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    {new URL(scheme.official_source_url).hostname} <ExternalLink className="w-3 h-3" />
                  </a>.
                </p>
              </li>

              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-navy text-white rounded-full ring-4 ring-white text-xs font-bold">
                  3
                </span>
                <h3 className="font-bold text-slate-900 mb-1">Complete Electronic KYC & Submission</h3>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Fill in beneficiary particulars, authenticate through Aadhaar OTP or CSC biometric verification, and save your application reference number for subsequent tracking.
                </p>
              </li>
            </ol>
          </section>
        </div>

        {/* Right Column: Required Documents Checklist Preview & Portal Metadata (1 col) */}
        <div className="space-y-6">
          {/* Required Documents Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-navy mb-3 flex items-center justify-between">
              <span>Required Documents</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                {scheme.documents.length} Items
              </span>
            </h2>

            <p className="text-xs text-slate-500 mb-4">
              Ensure these documents are readily accessible before starting your official submission:
            </p>

            <ul className="space-y-2.5">
              {scheme.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{doc.document_name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        doc.is_required
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {doc.is_required ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                  {doc.description && (
                    <p className="text-[11px] text-slate-500 leading-relaxed">{doc.description}</p>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={handleAddToChecklist}
              className="mt-5 w-full py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>Track in Application Checklist</span>
            </button>
          </div>

          {/* Official Portal Metadata Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs space-y-3.5">
            <h3 className="font-bold text-navy text-sm">Official Source & Governance</h3>

            <div>
              <span className="text-slate-500 block mb-0.5">Authoritative Portal</span>
              <a
                href={scheme.official_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy font-semibold hover:underline break-all flex items-center gap-1"
              >
                {scheme.official_source_url}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Responsible Department</span>
              <span className="text-slate-800 font-semibold">{scheme.department}</span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Application Channel</span>
              <span className="text-slate-800 font-semibold">{scheme.application_mode}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <strong>Official Disclaimer:</strong> CivicSetu displays verified scheme guidelines for informational facilitation. Beneficiary approval and funds disbursement remain the sole authority of the designated ministry.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
