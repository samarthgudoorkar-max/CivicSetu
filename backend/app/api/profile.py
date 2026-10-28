from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from app.core.database import get_db
from app.models.models import Profile, SavedScheme, ApplicationChecklist, EligibilityAssessment, Scheme
from app.models.schemas import CitizenProfileRequest, CitizenProfileResponse
from app.api.saved import get_current_user_id

router = APIRouter(prefix="/me", tags=["profile"])


@router.get("/profile", response_model=Optional[CitizenProfileResponse])
async def get_profile(
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = get_current_user_id(auth_header)
    result = await db.execute(select(Profile).where(Profile.user_id == uid))
    return result.scalars().first()


@router.post("/profile", response_model=CitizenProfileResponse)
async def update_profile(
    payload: CitizenProfileRequest,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = payload.user_id or get_current_user_id(auth_header)
    result = await db.execute(select(Profile).where(Profile.user_id == uid))
    profile = result.scalars().first()

    if not profile:
        profile = Profile(
            user_id=uid,
            full_name=payload.full_name,
            preferred_language=payload.preferred_language or "en",
            state_code=payload.state_code,
            age=payload.age,
            gender=payload.gender,
            occupation=payload.occupation,
            is_student=payload.is_student,
            is_farmer=payload.is_farmer,
            annual_income=payload.annual_income,
            category=payload.category
        )
        db.add(profile)
    else:
        profile.full_name = payload.full_name
        profile.preferred_language = payload.preferred_language or profile.preferred_language
        profile.state_code = payload.state_code
        profile.age = payload.age
        profile.gender = payload.gender
        profile.occupation = payload.occupation
        profile.is_student = payload.is_student
        profile.is_farmer = payload.is_farmer
        profile.annual_income = payload.annual_income
        profile.category = payload.category

    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/dashboard")
async def get_dashboard_summary(
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = get_current_user_id(auth_header)

    # Count saved
    saved_count_res = await db.execute(
        select(func.count(SavedScheme.id)).where(SavedScheme.user_id == uid)
    )
    saved_count = saved_count_res.scalar() or 0

    # Checklists
    checklists_res = await db.execute(
        select(ApplicationChecklist).where(ApplicationChecklist.user_id == uid)
    )
    checklists = checklists_res.scalars().all()
    active_checklists_count = len(checklists)
    
    total_docs = 0
    ready_docs = 0
    for ch in checklists:
        items = ch.checklist_data or []
        total_docs += len(items)
        ready_docs += sum(1 for it in items if it.get("checked"))

    doc_readiness_pct = int((ready_docs / total_docs * 100)) if total_docs > 0 else 0

    # Recent assessments
    assessments_res = await db.execute(
        select(EligibilityAssessment)
        .where(EligibilityAssessment.user_id == uid)
        .order_by(EligibilityAssessment.created_at.desc())
        .limit(5)
    )
    assessments = assessments_res.scalars().all()

    # Category breakdown for chart
    eligible_count = sum(1 for a in assessments if a.assessment_status == "Potentially Eligible")
    more_info_count = sum(1 for a in assessments if a.assessment_status == "More Information Required")
    not_eligible_count = sum(1 for a in assessments if a.assessment_status == "Not Eligible Based on Supplied Information")

    return {
        "user_id": uid,
        "saved_schemes_count": saved_count,
        "active_checklists_count": active_checklists_count,
        "document_readiness_percentage": doc_readiness_pct,
        "total_documents_tracked": total_docs,
        "ready_documents_count": ready_docs,
        "assessments_summary": {
            "potentially_eligible": eligible_count,
            "more_info_required": more_info_count,
            "not_eligible": not_eligible_count,
            "total_assessed": len(assessments)
        }
    }
