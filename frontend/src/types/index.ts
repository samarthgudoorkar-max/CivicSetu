export type GovernmentLevel = 'central' | 'state';

export interface SchemeDocument {
  id: string;
  document_name: string;
  is_required: boolean;
  description?: string;
}

export interface EligibilityRule {
  id: string;
  rule_type: string;
  rule_definition: {
    allowed_states?: string[];
    min_age?: number;
    max_age?: number;
    max_annual_income?: number;
    student_required?: boolean;
    farmer_required?: boolean;
    gender_required?: string;
    allowed_categories?: string[];
    allowed_occupations?: string[];
    unverified_conditions?: string[];
  };
  source_url?: string;
  effective_from?: string;
  effective_until?: string;
  verified_at?: string;
}

export interface Scheme {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  description: string;
  government_level: GovernmentLevel;
  state_code?: string;
  state_name?: string;
  department: string;
  category: string;
  target_beneficiaries: string[];
  benefits: string[];
  application_mode: string;
  application_url?: string;
  official_source_url: string;
  last_verified_at?: string;
  is_featured: boolean;
  documents: SchemeDocument[];
  rules: EligibilityRule[];
}

export type AssessmentStatus =
  | 'Potentially Eligible'
  | 'Not Eligible Based on Supplied Information'
  | 'More Information Required'
  | 'Unable to Verify';

export interface EligibilityResult {
  scheme_id: string;
  scheme_slug: string;
  scheme_name: string;
  category: string;
  government_level: GovernmentLevel;
  state_name?: string;
  assessment_status: AssessmentStatus;
  relevance_score: number;
  summary: string;
  satisfied_conditions: string[];
  not_satisfied_conditions: string[];
  missing_information: string[];
  official_source: string;
  last_verified_at?: string;
}

export interface CitizenProfile {
  user_id: string;
  full_name?: string;
  preferred_language?: string;
  state_code?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  is_student?: boolean;
  is_farmer?: boolean;
  annual_income?: number;
  category?: string;
}

export interface ChecklistItem {
  doc_id: string;
  name: string;
  checked: boolean;
  is_required?: boolean;
  notes?: string;
}

export interface ApplicationChecklist {
  id: string;
  user_id: string;
  scheme_id: string;
  stage: 'Research' | 'Documents Ready' | 'Applied Online' | 'Verification' | 'Completed';
  notes?: string;
  target_deadline?: string;
  checklist_data: ChecklistItem[];
  scheme?: Scheme;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  scheme_count: number;
}

export interface StateInfo {
  code: string;
  name: string;
  is_central: boolean;
}

export interface DashboardSummary {
  user_id: string;
  saved_schemes_count: number;
  active_checklists_count: number;
  document_readiness_percentage: number;
  total_documents_tracked: number;
  ready_documents_count: number;
  assessments_summary: {
    potentially_eligible: number;
    more_info_required: number;
    not_eligible: number;
    total_assessed: number;
  };
}

export interface AssistantChatResponse {
  answer: string;
  sources: string[];
  suggested_actions: string[];
  is_ai_generated: boolean;
}
