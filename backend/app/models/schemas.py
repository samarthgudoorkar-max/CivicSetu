from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class SchemeDocumentSchema(BaseModel):
    id: str
    document_name: str
    is_required: bool
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class EligibilityRuleSchema(BaseModel):
    id: str
    rule_type: str
    rule_definition: Dict[str, Any]
    source_url: Optional[str] = None
    effective_from: Optional[str] = None
    effective_until: Optional[str] = None
    verified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SchemeResponse(BaseModel):
    id: str
    slug: str
    name: str
    short_name: Optional[str] = None
    description: str
    government_level: str  # "central" | "state"
    state_code: Optional[str] = None
    state_name: Optional[str] = None
    department: str
    category: str
    target_beneficiaries: List[str]
    benefits: List[str]
    application_mode: str
    application_url: Optional[str] = None
    official_source_url: str
    last_verified_at: Optional[datetime] = None
    is_featured: bool
    documents: List[SchemeDocumentSchema] = []
    rules: List[EligibilityRuleSchema] = []

    model_config = ConfigDict(from_attributes=True)


class SchemeListResponse(BaseModel):
    total: int
    items: List[SchemeResponse]


class EligibilityCheckRequest(BaseModel):
    state_code: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    is_student: Optional[bool] = None
    is_farmer: Optional[bool] = None
    annual_income: Optional[float] = None
    category: Optional[str] = None  # General, OBC, SC, ST, EWS
    scheme_slug: Optional[str] = None  # if checking single scheme or all schemes


class EligibilityCheckResult(BaseModel):
    scheme_id: str
    scheme_slug: str
    scheme_name: str
    category: str
    government_level: str
    state_name: Optional[str] = None
    assessment_status: str  # Potentially Eligible | Not Eligible Based on Supplied Information | More Information Required | Unable to Verify
    relevance_score: float
    summary: str
    satisfied_conditions: List[str]
    not_satisfied_conditions: List[str]
    missing_information: List[str]
    official_source: str
    last_verified_at: Optional[str] = None


class CitizenProfileRequest(BaseModel):
    user_id: str
    full_name: Optional[str] = None
    preferred_language: Optional[str] = "en"
    state_code: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    is_student: Optional[bool] = None
    is_farmer: Optional[bool] = None
    annual_income: Optional[float] = None
    category: Optional[str] = None


class CitizenProfileResponse(CitizenProfileRequest):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SavedSchemeToggleRequest(BaseModel):
    scheme_id: str
    user_id: Optional[str] = "guest-user"


class ChecklistItem(BaseModel):
    doc_id: str
    name: str
    checked: bool = False
    notes: Optional[str] = None


class ApplicationChecklistCreate(BaseModel):
    user_id: str = "guest-user"
    scheme_id: str
    stage: str = "Research"
    target_deadline: Optional[str] = None
    notes: Optional[str] = None
    checklist_data: List[ChecklistItem] = []


class ApplicationChecklistUpdate(BaseModel):
    stage: Optional[str] = None
    notes: Optional[str] = None
    target_deadline: Optional[str] = None
    checklist_data: Optional[List[ChecklistItem]] = None


class ApplicationChecklistResponse(BaseModel):
    id: str
    user_id: str
    scheme_id: str
    stage: str
    notes: Optional[str] = None
    target_deadline: Optional[str] = None
    checklist_data: List[Dict[str, Any]] = []
    scheme: Optional[SchemeResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AssistantChatRequest(BaseModel):
    query: str
    scheme_slug: Optional[str] = None
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None


class AssistantChatResponse(BaseModel):
    answer: str
    sources: List[str]
    suggested_actions: List[str] = []
    is_ai_generated: bool = True
