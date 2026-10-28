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
  const query = new URLSearchParams();
  if (params?.q) query.append('q', params.q);
  if (params?.category && params.category !== 'all') query.append('category', params.category);
  if (params?.level && params.level !== 'all') query.append('level', params.level);
  if (params?.state_code && params.state_code !== 'ALL') query.append('state_code', params.state_code);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));
  if (params?.beneficiary && params.beneficiary !== 'all') query.append('beneficiary', params.beneficiary);
  if (params?.sort_by) query.append('sort_by', params.sort_by);

  const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load schemes.');
  return res.json();
}

export async function fetchSchemeBySlug(slug: string): Promise<Scheme> {
  const res = await fetch(`${API_BASE}/schemes/${slug}`);
  if (!res.ok) throw new Error(`Scheme '${slug}' not found.`);
  return res.json();
}

export async function fetchCategories(): Promise<CategoryInfo[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to load categories.');
  return res.json();
}

export async function fetchStates(): Promise<StateInfo[]> {
  const res = await fetch(`${API_BASE}/states`);
  if (!res.ok) throw new Error('Failed to load states.');
  return res.json();
}

export async function checkEligibility(
  profile: Partial<CitizenProfile>,
  schemeSlug?: string,
  userId: string = 'guest-user'
): Promise<EligibilityResult[]> {
  const res = await fetch(`${API_BASE}/eligibility/check?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...profile, scheme_slug: schemeSlug }),
  });
  if (!res.ok) throw new Error('Failed to evaluate eligibility.');
  return res.json();
}

export async function fetchSavedSchemes(userId: string = 'guest-user'): Promise<Scheme[]> {
  const res = await fetch(`${API_BASE}/me/saved?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to load saved schemes.');
  return res.json();
}

export async function toggleSaveScheme(schemeId: string, userId: string = 'guest-user'): Promise<{ saved: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/me/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to update saved scheme.');
  return res.json();
}

export async function fetchChecklists(userId: string = 'guest-user'): Promise<ApplicationChecklist[]> {
  const res = await fetch(`${API_BASE}/me/checklists`, {
    headers: { Authorization: `Bearer ${userId}` }
  });
  if (!res.ok) throw new Error('Failed to load application checklists.');
  return res.json();
}

export async function createChecklist(schemeId: string, userId: string = 'guest-user'): Promise<ApplicationChecklist> {
  const res = await fetch(`${API_BASE}/me/checklists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userId}`
    },
    body: JSON.stringify({ scheme_id: schemeId, user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to create checklist.');
  return res.json();
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
  const res = await fetch(`${API_BASE}/me/checklists/${checklistId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userId}`
    },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error('Failed to update checklist.');
  return res.json();
}

export async function deleteChecklist(checklistId: string, userId: string = 'guest-user'): Promise<void> {
  await fetch(`${API_BASE}/me/checklists/${checklistId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userId}` }
  });
}

export async function fetchDashboardSummary(userId: string = 'guest-user'): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/me/dashboard`, {
    headers: { Authorization: `Bearer ${userId}` }
  });
  if (!res.ok) throw new Error('Failed to load dashboard summary.');
  return res.json();
}

export async function fetchProfile(userId: string = 'guest-user'): Promise<CitizenProfile | null> {
  const res = await fetch(`${API_BASE}/me/profile`, {
    headers: { Authorization: `Bearer ${userId}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function saveProfile(profile: CitizenProfile): Promise<CitizenProfile> {
  const res = await fetch(`${API_BASE}/me/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${profile.user_id}`
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to save citizen profile.');
  return res.json();
}

export async function askAssistant(
  query: string,
  schemeSlug?: string,
  language: string = 'en'
): Promise<AssistantChatResponse> {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, scheme_slug: schemeSlug, language }),
  });
  if (!res.ok) throw new Error('Failed to communicate with CivicSetu Assistant.');
  return res.json();
}
