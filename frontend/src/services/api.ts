import {
  Scheme,
  EligibilityResult,
  CitizenProfile,
  ApplicationChecklist,
  CategoryInfo,
  StateInfo,
  DashboardSummary,
  AssistantChatResponse
} from '../types';
import {
  VERIFIED_SCHEMES_DATA,
  CATEGORIES_DATA,
  STATES_DATA,
  evaluateEligibilityClient
} from './localData';

const API_BASE = '/api';

export async function fetchSchemes(params?: {
  q?: string;
  category?: string;
  level?: string;
  state_code?: string;
  featured?: boolean;
  beneficiary?: string;
  sort_by?: string;
}): Promise<{ total: number; items: Scheme[] }> {
  try {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.level && params.level !== 'all') query.append('level', params.level);
    if (params?.state_code && params.state_code !== 'ALL') query.append('state_code', params.state_code);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.beneficiary && params.beneficiary !== 'all') query.append('beneficiary', params.beneficiary);
    if (params?.sort_by) query.append('sort_by', params.sort_by);

    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to verified local datasets (for GitHub Pages static hosting)
  }

  // Client-side filtering fallback
  let items = [...VERIFIED_SCHEMES_DATA];

  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.short_name && s.short_name.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }

  if (params?.category && params.category.toLowerCase() !== 'all') {
    items = items.filter((s) => s.category.toLowerCase() === params.category!.toLowerCase());
  }

  if (params?.level && params.level.toLowerCase() !== 'all') {
    items = items.filter((s) => s.government_level.toLowerCase() === params.level!.toLowerCase());
  }

  if (params?.state_code && params.state_code !== 'ALL') {
    items = items.filter((s) => s.government_level === 'central' || s.state_code === params.state_code);
  }

  if (params?.featured !== undefined) {
    items = items.filter((s) => s.is_featured === params.featured);
  }

  if (params?.sort_by === 'name_asc') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params?.sort_by === 'verified_desc') {
    items.sort((a, b) => (b.last_verified_at || '').localeCompare(a.last_verified_at || ''));
  }

  return { total: items.length, items };
}

export async function fetchSchemeBySlug(slug: string): Promise<Scheme> {
  try {
    const res = await fetch(`${API_BASE}/schemes/${slug}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const found = VERIFIED_SCHEMES_DATA.find((s) => s.slug === slug);
  if (!found) throw new Error(`Scheme '${slug}' not found.`);
  return found;
}

export async function fetchCategories(): Promise<CategoryInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return CATEGORIES_DATA;
}

export async function fetchStates(): Promise<StateInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/states`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return STATES_DATA;
}

export async function checkEligibility(
  profile: Partial<CitizenProfile>,
  schemeSlug?: string,
  userId: string = 'guest-user'
): Promise<EligibilityResult[]> {
  try {
    const res = await fetch(`${API_BASE}/eligibility/check?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, scheme_slug: schemeSlug }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  // Fallback to client deterministic rule evaluator
  return evaluateEligibilityClient(profile, schemeSlug);
}

// Local Storage helpers for user data persistence when offline/static
const SAVED_STORAGE_KEY = 'civicsetu_saved_schemes';
const CHECKLIST_STORAGE_KEY = 'civicsetu_checklists';

export async function fetchSavedSchemes(userId: string = 'guest-user'): Promise<Scheme[]> {
  try {
    const res = await fetch(`${API_BASE}/me/saved?user_id=${userId}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const savedIds: string[] = JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY) || '["1", "2"]');
  return VERIFIED_SCHEMES_DATA.filter((s) => savedIds.includes(s.id) || savedIds.includes(s.slug));
}

export async function toggleSaveScheme(schemeId: string, userId: string = 'guest-user'): Promise<{ saved: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/me/saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheme_id: schemeId, user_id: userId }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const savedIds: string[] = JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY) || '["1", "2"]');
  const index = savedIds.indexOf(schemeId);
  let saved = false;
  if (index > -1) {
    savedIds.splice(index, 1);
    saved = false;
  } else {
    savedIds.push(schemeId);
    saved = true;
  }
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
  return { saved, message: saved ? 'Scheme saved' : 'Scheme removed' };
}

export async function fetchChecklists(userId: string = 'guest-user'): Promise<ApplicationChecklist[]> {
  try {
    const res = await fetch(`${API_BASE}/me/checklists`, {
      headers: { Authorization: `Bearer ${userId}` }
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw);
  }

  // Default seed checklist for demo
  const sample = VERIFIED_SCHEMES_DATA[0];
  const initialChecklist: ApplicationChecklist[] = [
    {
      id: 'chk-default-1',
      user_id: userId,
      scheme_id: sample.id,
      stage: 'Documents Ready',
      notes: 'Aadhaar e-KYC completed. Need to get passbook stamped.',
      target_deadline: '2026-11-15',
      checklist_data: sample.documents.map((d, i) => ({
        doc_id: d.id,
        name: d.document_name,
        checked: i === 0,
        is_required: d.is_required,
        notes: d.description
      })),
      scheme: sample,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(initialChecklist));
  return initialChecklist;
}

export async function createChecklist(schemeId: string, userId: string = 'guest-user'): Promise<ApplicationChecklist> {
  try {
    const res = await fetch(`${API_BASE}/me/checklists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`
      },
      body: JSON.stringify({ scheme_id: schemeId, user_id: userId }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const scheme = VERIFIED_SCHEMES_DATA.find((s) => s.id === schemeId || s.slug === schemeId) || VERIFIED_SCHEMES_DATA[0];
  const current = await fetchChecklists(userId);
  const existing = current.find((c) => c.scheme_id === scheme.id);
  if (existing) return existing;

  const newChk: ApplicationChecklist = {
    id: `chk-${Date.now()}`,
    user_id: userId,
    scheme_id: scheme.id,
    stage: 'Research',
    notes: '',
    target_deadline: '',
    checklist_data: scheme.documents.map((d) => ({
      doc_id: d.id,
      name: d.document_name,
      checked: false,
      is_required: d.is_required,
      notes: d.description
    })),
    scheme,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  current.push(newChk);
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(current));
  return newChk;
}

export async function updateChecklist(
  checklistId: string,
  update: {
    stage?: string;
    notes?: string;
    target_deadline?: string;
    checklist_data?: any[];
  },
  userId: string = 'guest-user'
): Promise<ApplicationChecklist> {
  try {
    const res = await fetch(`${API_BASE}/me/checklists/${checklistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`
      },
      body: JSON.stringify(update),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const current = await fetchChecklists(userId);
  const index = current.findIndex((c) => c.id === checklistId);
  if (index > -1) {
    current[index] = {
      ...current[index],
      ...(update as any),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(current));
    return current[index];
  }
  throw new Error('Checklist not found');
}

export async function deleteChecklist(checklistId: string, userId: string = 'guest-user'): Promise<void> {
  try {
    await fetch(`${API_BASE}/me/checklists/${checklistId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userId}` }
    });
  } catch {
    // Fallback
  }

  const current = await fetchChecklists(userId);
  const filtered = current.filter((c) => c.id !== checklistId);
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(filtered));
}

export async function fetchDashboardSummary(userId: string = 'guest-user'): Promise<DashboardSummary> {
  try {
    const res = await fetch(`${API_BASE}/me/dashboard`, {
      headers: { Authorization: `Bearer ${userId}` }
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const checklists = await fetchChecklists(userId);
  let totalDocs = 0;
  let readyDocs = 0;
  for (const ch of checklists) {
    const items = ch.checklist_data || [];
    totalDocs += items.length;
    readyDocs += items.filter((i) => i.checked).length;
  }

  const pct = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 67;

  return {
    user_id: userId,
    saved_schemes_count: 2,
    active_checklists_count: checklists.length,
    document_readiness_percentage: pct,
    total_documents_tracked: totalDocs || 5,
    ready_documents_count: readyDocs || 3,
    assessments_summary: {
      potentially_eligible: 3,
      more_info_required: 2,
      not_eligible: 1,
      total_assessed: 6
    }
  };
}

export async function fetchProfile(userId: string = 'guest-user'): Promise<CitizenProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/me/profile`, {
      headers: { Authorization: `Bearer ${userId}` }
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const raw = localStorage.getItem(`civicsetu_profile_${userId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveProfile(profile: CitizenProfile): Promise<CitizenProfile> {
  try {
    const res = await fetch(`${API_BASE}/me/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${profile.user_id}`
      },
      body: JSON.stringify(profile),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  localStorage.setItem(`civicsetu_profile_${profile.user_id}`, JSON.stringify(profile));
  return profile;
}

export async function askAssistant(
  query: string,
  schemeSlug?: string,
  language: string = 'en'
): Promise<AssistantChatResponse> {
  try {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, scheme_slug: schemeSlug, language }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const scheme = schemeSlug ? VERIFIED_SCHEMES_DATA.find((s) => s.slug === schemeSlug) : undefined;
  const qLow = query.toLowerCase();

  if (scheme) {
    const docNames = scheme.documents.map((d) => d.document_name);
    return {
      answer: `For **${scheme.name}**:\n• Benefits: ${scheme.benefits[0]}\n• Required documents: ${docNames.join(', ')}\n• Official Gateway: ${scheme.official_source_url}`,
      sources: [scheme.official_source_url],
      suggested_actions: ['Check Eligibility', 'Add to Checklist', 'Open Portal'],
      is_ai_generated: false
    };
  }

  return {
    answer: `Welcome to **CivicSetu Assistant**. I can help you discover verified Central and State Government schemes across India, understand required documents, and guide you to official portals.`,
    sources: ['https://www.myscheme.gov.in/'],
    suggested_actions: ['Schemes for Farmers', 'Student Scholarships', 'Healthcare PM-JAY'],
    is_ai_generated: false
  };
}
