import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Plus,
  AlertCircle,
  Calendar,
  Save,
  Check,
  Building2,
  FileText
} from 'lucide-react';
import { fetchChecklists, updateChecklist, deleteChecklist } from '../services/api';
import { ApplicationChecklist } from '../types';
import { useAuth } from '../context/AuthContext';

const STAGES = [
  'Research',
  'Documents Ready',
  'Applied Online',
  'Verification',
  'Completed',
] as const;

export const Applications: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();

  const [checklists, setChecklists] = useState<ApplicationChecklist[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const list = await fetchChecklists(userId);
        setChecklists(list);
        if (list.length > 0 && !selectedId) {
          setSelectedId(list[0].id);
        }
      } catch (e) {
        console.error('Failed to load checklists', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  const activeChecklist = checklists.find((c) => c.id === selectedId) || checklists[0] || null;

  const handleToggleItem = async (docId: string) => {
    if (!activeChecklist) return;

    const updatedData = activeChecklist.checklist_data.map((item) => {
      if (item.doc_id === docId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    // Optimistic UI update
    setChecklists((prev) =>
      prev.map((c) => (c.id === activeChecklist.id ? { ...c, checklist_data: updatedData } : c))
    );

    try {
      await updateChecklist(activeChecklist.id, { checklist_data: updatedData }, userId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStageChange = async (newStage: string) => {
    if (!activeChecklist) return;

    setChecklists((prev) =>
      prev.map((c) => (c.id === activeChecklist.id ? { ...c, stage: newStage as any } : c))
    );

    try {
      await updateChecklist(activeChecklist.id, { stage: newStage }, userId);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotesChange = async (newNotes: string) => {
    if (!activeChecklist) return;

    setChecklists((prev) =>
      prev.map((c) => (c.id === activeChecklist.id ? { ...c, notes: newNotes } : c))
    );
  };

  const handleSaveNotes = async () => {
    if (!activeChecklist) return;
    try {
      await updateChecklist(
        activeChecklist.id,
        {
          notes: activeChecklist.notes,
          target_deadline: activeChecklist.target_deadline,
        },
        userId
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this application checklist?')) return;
    try {
      await deleteChecklist(id, userId);
      const remaining = checklists.filter((c) => c.id !== id);
      setChecklists(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider mb-2">
          <FileCheck className="w-4 h-4 text-govgreen" />
          <span>Application Preparation Assistant</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy tracking-tight">
          Application Checklists & Document Tracker
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Prepare verified documents, track stages of personal preparation, and access official application gateways with confidence.
        </p>
      </div>

      {/* Disclaimers & Integrity Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-navy mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>Personal Tracker Distinction:</strong> This dashboard tracks your personal preparation and document readiness. It does not replace or automate official government portals. Submission and final approval take place on the authorized ministerial website.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading your application checklists...</p>
        </div>
      ) : checklists.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Checklists Created Yet</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add any scheme to your application checklist to organize required certificates, track deadlines, and follow official procedures.
          </p>
          <Link
            to="/schemes"
            className="inline-block px-5 py-2.5 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Browse Verified Schemes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checklists List (1 col) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              My Active Applications ({checklists.length})
            </h2>

            {checklists.map((chk) => {
              const isSelected = chk.id === selectedId;
              const total = chk.checklist_data?.length || 0;
              const completed = chk.checklist_data?.filter((d) => d.checked).length || 0;

              return (
                <button
                  key={chk.id}
                  onClick={() => setSelectedId(chk.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-navy text-white border-navy shadow-md ring-2 ring-navy/20'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-saffron text-slate-950'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {chk.stage}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {completed}/{total} Ready
                    </span>
                  </div>

                  <h3 className="text-sm font-bold truncate">
                    {chk.scheme?.short_name || chk.scheme?.name || 'Scheme Application'}
                  </h3>

                  <div className="w-full bg-slate-200/50 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isSelected ? 'bg-saffron' : 'bg-govgreen'
                      }`}
                      style={{
                        width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Checklist Workspace (2 cols) */}
          {activeChecklist && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-navy">
                    {activeChecklist.scheme?.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeChecklist.scheme?.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeChecklist.scheme?.application_url && (
                    <a
                      href={activeChecklist.scheme.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-saffron hover:bg-saffron-600 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Apply Online</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(activeChecklist.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete checklist"
                    aria-label="Delete checklist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stage Progress Stepper */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Application Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STAGES.map((stg) => {
                    const isCurrent = activeChecklist.stage === stg;
                    return (
                      <button
                        key={stg}
                        onClick={() => handleStageChange(stg)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isCurrent
                            ? 'bg-navy text-white border-navy shadow-xs font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Document Preparation Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-navy">
                    Document Checklist ({activeChecklist.checklist_data?.length || 0})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Click items as you verify or arrange them
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeChecklist.checklist_data?.map((item) => (
                    <div
                      key={item.doc_id}
                      onClick={() => handleToggleItem(item.doc_id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        item.checked
                          ? 'bg-govgreen-50/70 border-govgreen-300'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border transition-colors ${
                          item.checked
                            ? 'bg-govgreen border-govgreen text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold ${
                              item.checked ? 'line-through text-slate-500' : 'text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              item.is_required
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.is_required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Notes & Deadlines */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Submission Deadline
                    </label>
                    <input
                      type="date"
                      value={activeChecklist.target_deadline || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setChecklists((prev) =>
                          prev.map((c) =>
                            c.id === activeChecklist.id ? { ...c, target_deadline: val } : c
                          )
                        );
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSaveNotes}
                      className="w-full py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saveSuccess ? 'Changes Saved!' : 'Save Progress & Notes'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Personal Application Notes
                  </label>
                  <textarea
                    rows={3}
                    value={activeChecklist.notes || ''}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="e.g. Appointment scheduled at CSC Centre on Monday, Aadhaar phone number verified..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
