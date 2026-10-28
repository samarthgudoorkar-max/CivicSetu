import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    short_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    government_level = Column(String(20), nullable=False)  # "central" or "state"
    state_code = Column(String(10), nullable=True, index=True)  # e.g., "TG", "MH", "KA", "UP"
    state_name = Column(String(100), nullable=True)
    department = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    target_beneficiaries = Column(JSON, default=list)  # list of strings
    benefits = Column(JSON, default=list)  # list of key benefits / description
    application_mode = Column(String(50), default="Online")  # Online, Offline, Assisted
    application_url = Column(String(500), nullable=True)
    official_source_url = Column(String(500), nullable=False)
    last_verified_at = Column(DateTime, default=get_utc_now)
    is_featured = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    rules = relationship("EligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
    documents = relationship("SchemeDocument", back_populates="scheme", cascade="all, delete-orphan")
    saved_by = relationship("SavedScheme", back_populates="scheme", cascade="all, delete-orphan")
    assessments = relationship("EligibilityAssessment", back_populates="scheme", cascade="all, delete-orphan")
    checklists = relationship("ApplicationChecklist", back_populates="scheme", cascade="all, delete-orphan")


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    rule_type = Column(String(50), default="composite")
    rule_definition = Column(JSON, nullable=False)  # structured criteria
    source_url = Column(String(500), nullable=True)
    effective_from = Column(String(50), nullable=True)
    effective_until = Column(String(50), nullable=True)
    verified_at = Column(DateTime, default=get_utc_now)

    scheme = relationship("Scheme", back_populates="rules")


class SchemeDocument(Base):
    __tablename__ = "scheme_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    document_name = Column(String(255), nullable=False)
    is_required = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

    scheme = relationship("Scheme", back_populates="documents")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    preferred_language = Column(String(10), default="en")
    state_code = Column(String(10), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    occupation = Column(String(100), nullable=True)
    is_student = Column(Boolean, nullable=True)
    is_farmer = Column(Boolean, nullable=True)
    annual_income = Column(Float, nullable=True)
    category = Column(String(50), nullable=True)  # General, OBC, SC, ST, EWS
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)


class SavedScheme(Base):
    __tablename__ = "saved_schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(100), nullable=False, index=True)
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=get_utc_now)

    scheme = relationship("Scheme", back_populates="saved_by")


class EligibilityAssessment(Base):
    __tablename__ = "eligibility_assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(100), nullable=False, index=True)
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_status = Column(String(60), nullable=False)  # "Potentially Eligible", "Not Eligible Based on Supplied Information", "More Information Required", "Unable to Verify"
    explanation = Column(JSON, nullable=False)  # {satisfied: [], not_satisfied: [], missing_info: [], summary: ""}
    relevance_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=get_utc_now)

    scheme = relationship("Scheme", back_populates="assessments")


class ApplicationChecklist(Base):
    __tablename__ = "application_checklists"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(100), nullable=False, index=True)
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    stage = Column(String(50), default="Research")  # Research, Documents Ready, Applied Online, Verification, Completed
    checklist_data = Column(JSON, default=list)  # [{doc_id: ..., name: ..., checked: bool, notes: str}]
    notes = Column(Text, nullable=True)
    target_deadline = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    scheme = relationship("Scheme", back_populates="checklists")
