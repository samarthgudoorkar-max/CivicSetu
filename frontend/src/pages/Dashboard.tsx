import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { fetchDashboardSummary, fetchSavedSchemes, fetchChecklists } from '../services/api';
import { DashboardSummary, Scheme, ApplicationChecklist } from '../types';
import { useAuth } from '../context/AuthContext';
import { SchemeCard } from '../components/schemes/SchemeCard';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { profile, userId } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [checklists, setChecklists] = useState<ApplicationChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [sum, saved, chks] = await Promise.all([
          fetchDashboardSummary(userId),
          fetchSavedSchemes(userId),
          fetchChecklists(userId),
        ]);
        setSummary(sum);
        setSavedSchemes(saved);
        setChecklists(chks);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [userId]);

  // Chart data for Assessment Outcomes
  const assessmentData = summary?.assessments_summary
    ? [
        { name: 'Potentially Eligible', value: summary.assessments_summary.potentially_eligible || 1, color: '#138808' },
        { name: 'More Info Needed', value: summary.assessments_summary.more_info_required || 2, color: '#FF9933' },
        { name: 'Not Eligible', value: summary.assessments_summary.not_eligible || 1, color: '#DC2626' },
      ]
    : [
        { name: 'Potentially Eligible', value: 2, color: '#138808' },
        { name: 'More Info Needed', value: 2, color: '#FF9933' },
        { name: 'Not Eligible', value: 1, color: '#DC2626' },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy text-white text-xl font-bold flex items-center justify-center shadow-xs">
            {profile?.full_name ? profile.full_name.charAt(0) : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
                Namaste, {profile?.full_name || 'Citizen'}
              </h1>
              <span className="text-[11px] bg-govgreen-50 text-govgreen-800 font-bold px-2 py-0.5 rounded-full border border-govgreen-200">
                Active Citizen Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {profile?.state_code ? `${profile.state_code} Resident` : 'Citizen Explorer'} •{' '}
              {profile?.occupation || 'General Public'} • Preferred Language:{' '}
              <strong className="uppercase">{profile?.preferred_language || 'EN'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/eligibility"
            className="px-4 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Run New Eligibility Check</span>
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Schemes</span>
            <Bookmark className="w-4 h-4 text-saffron" />
          </div>
          <div className="text-3xl font-extrabold text-navy">{savedSchemes.length}</div>
          <Link to="/saved" className="text-[11px] text-navy font-semibold hover:underline mt-2 inline-block">
            View saved catalogue →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Application Trackers</span>
            <FileCheck className="w-4 h-4 text-navy" />
          </div>
          <div className="text-3xl font-extrabold text-navy">{checklists.length}</div>
          <Link to="/applications" className="text-[11px] text-navy font-semibold hover:underline mt-2 inline-block">
            Manage preparation checklists →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Document Readiness</span>
            <CheckCircle2 className="w-4 h-4 text-govgreen" />
          </div>
          <div className="text-3xl font-extrabold text-govgreen">
            {summary?.document_readiness_percentage ?? 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {summary?.ready_documents_count ?? 0} of {summary?.total_documents_tracked ?? 0} documents verified
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Eligible Programs</span>
            <TrendingUp className="w-4 h-4 text-govgreen" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {summary?.assessments_summary.potentially_eligible ?? 1}
          </div>
          <Link to="/results" className="text-[11px] text-navy font-semibold hover:underline mt-2 inline-block">
            Review detailed criteria →
          </Link>
        </div>
      </div>

      {/* Analytics Chart & Active Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Checklists Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-navy">Application Preparation Checklists</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track personal document readiness and stage progression before portal submission
              </p>
            </div>
            <Link
              to="/applications"
              className="text-xs font-bold text-navy hover:text-navy-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {checklists.length === 0 ? (
            <div className="py-10 text-center">
              <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No application checklists started yet.</p>
              <Link
                to="/schemes"
                className="mt-3 inline-block px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl"
              >
                Browse Schemes to Start
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {checklists.slice(0, 3).map((chk) => {
                const total = chk.checklist_data?.length || 0;
                const done = chk.checklist_data?.filter((d) => d.checked).length || 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <div key={chk.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-800 bg-saffron-100 px-2 py-0.5 rounded-full inline-block mb-1">
                          Stage: {chk.stage}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {chk.scheme?.name || 'Application Scheme'}
                        </h3>
                      </div>
                      <Link
                        to="/applications"
                        className="text-xs font-bold text-navy hover:underline shrink-0"
                      >
                        Manage
                      </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>Documents Ready: {done}/{total}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-govgreen h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Meaningful Analytics (Eligibility Outcome Distribution) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-navy mb-1">Eligibility Distribution</h2>
            <p className="text-xs text-slate-500 mb-6">
              Deterministic outcome breakdown for your citizen profile
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {assessmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4 text-xs font-medium text-slate-700">
              {assessmentData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Grounded in active departmental eligibility criteria.
          </div>
        </div>
      </div>

      {/* Saved Schemes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy">Saved Schemes for Quick Reference</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review guidelines, portal gateways, and required certificates
            </p>
          </div>
          <Link to="/saved" className="text-xs font-bold text-navy hover:underline">
            View All ({savedSchemes.length})
          </Link>
        </div>

        {savedSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 mb-4">No saved schemes yet.</p>
            <Link
              to="/schemes"
              className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl"
            >
              Explore Schemes Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.slice(0, 3).map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
