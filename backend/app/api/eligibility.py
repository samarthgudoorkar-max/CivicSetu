from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Scheme, EligibilityRule, EligibilityAssessment
from app.models.schemas import EligibilityCheckRequest, EligibilityCheckResult
from app.rules.evaluator import evaluate_eligibility

router = APIRouter(prefix="", tags=["eligibility"])


@router.post("/eligibility/check", response_model=List[EligibilityCheckResult])
async def check_eligibility(
    payload: EligibilityCheckRequest,
    user_id: Optional[str] = "guest-user",
    db: AsyncSession = Depends(get_db)
):
    query = select(Scheme).options(
        selectinload(Scheme.rules),
        selectinload(Scheme.documents)
    )

    if payload.scheme_slug:
        query = query.where(Scheme.slug == payload.scheme_slug)

    result = await db.execute(query)
    schemes = result.scalars().all()

    if not schemes:
        if payload.scheme_slug:
            raise HTTPException(status_code=404, detail="Scheme not found for eligibility check.")
        return []

    profile_dict = {
        "state_code": payload.state_code,
        "age": payload.age,
        "gender": payload.gender,
        "occupation": payload.occupation,
        "is_student": payload.is_student,
        "is_farmer": payload.is_farmer,
        "annual_income": payload.annual_income,
        "category": payload.category,
    }

    results: List[EligibilityCheckResult] = []

    for scheme in schemes:
        # If scheme has structured rules, evaluate against the first/composite rule
        rule_def = {}
        if scheme.rules and len(scheme.rules) > 0:
            rule_def = scheme.rules[0].rule_definition

        eval_res = evaluate_eligibility(
            rule_definition=rule_def,
            citizen_profile=profile_dict,
            scheme_level=scheme.government_level,
            scheme_state_code=scheme.state_code,
            official_source_url=scheme.official_source_url,
            last_verified_at=scheme.last_verified_at.strftime("%Y-%m-%d") if scheme.last_verified_at else None
        )

        check_res = EligibilityCheckResult(
            scheme_id=scheme.id,
            scheme_slug=scheme.slug,
            scheme_name=scheme.name,
            category=scheme.category,
            government_level=scheme.government_level,
            state_name=scheme.state_name,
            assessment_status=eval_res["assessment_status"],
            relevance_score=eval_res["relevance_score"],
            summary=eval_res["summary"],
            satisfied_conditions=eval_res["satisfied_conditions"],
            not_satisfied_conditions=eval_res["not_satisfied_conditions"],
            missing_information=eval_res["missing_information"],
            official_source=eval_res["official_source"],
            last_verified_at=eval_res["last_verified_at"]
        )
        results.append(check_res)

        # Record assessment for user
        if user_id:
            assessment = EligibilityAssessment(
                user_id=user_id,
                scheme_id=scheme.id,
                assessment_status=eval_res["assessment_status"],
                explanation={
                    "satisfied": eval_res["satisfied_conditions"],
                    "not_satisfied": eval_res["not_satisfied_conditions"],
                    "missing_info": eval_res["missing_information"],
                    "summary": eval_res["summary"]
                },
                relevance_score=eval_res["relevance_score"]
            )
            db.add(assessment)

    try:
        await db.commit()
    except Exception:
        await db.rollback()

    # Sort results: Potentially Eligible first, then More Info, then Unable to Verify, then Not Eligible
    status_order = {
        "Potentially Eligible": 1,
        "More Information Required": 2,
        "Unable to Verify": 3,
        "Not Eligible Based on Supplied Information": 4
    }
    results.sort(key=lambda r: (status_order.get(r.assessment_status, 5), -r.relevance_score))

    return results
