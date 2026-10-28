import os
from typing import Optional, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.config import settings
from app.models.models import Scheme
from app.models.schemas import AssistantChatRequest, AssistantChatResponse

router = APIRouter(prefix="/assistant", tags=["assistant"])


def build_fallback_response(query: str, scheme: Optional[Scheme]) -> AssistantChatResponse:
    q_low = query.lower()
    
    if scheme:
        # Grounded in the specific scheme
        doc_names = [d.document_name for d in (scheme.documents or [])]
        rule_desc = scheme.rules[0].rule_definition if scheme.rules else {}

        if any(w in q_low for w in ["document", "paper", "id proof", "certificate"]):
            answer = (
                f"For **{scheme.name}**, the required documents are:\n\n"
                + "\n".join([f"• **{d.document_name}**: {d.description or 'Mandatory verification'}" for d in scheme.documents])
                + f"\n\n*Note:* You can add these directly to your CivicSetu Application Checklist to track your preparation."
            )
        elif any(w in q_low for w in ["benefit", "money", "amount", "cash", "grant", "support"]):
            answer = (
                f"Benefits provided under **{scheme.name}** include:\n\n"
                + "\n".join([f"• {b}" for b in scheme.benefits])
                + f"\n\nDepartment in charge: {scheme.department}."
            )
        elif any(w in q_low for w in ["eligible", "who can", "age", "criteria", "rule"]):
            age_cond = f"Age between {rule_desc.get('min_age', 'any')} and {rule_desc.get('max_age', 'any')} years" if 'min_age' in rule_desc or 'max_age' in rule_desc else "No strict age cap specified"
            income_cond = f"Annual income up to ₹{rule_desc.get('max_annual_income'):,.0f}" if rule_desc.get('max_annual_income') else "Income limit subject to official verification"
            states_cond = f"Restricted to {', '.join(rule_desc.get('allowed_states', []))}" if rule_desc.get('allowed_states') and 'ALL' not in rule_desc.get('allowed_states') else "Open to all Indian citizens"
            
            answer = (
                f"Eligibility criteria for **{scheme.name}**:\n\n"
                f"• **Domicile / Region:** {states_cond}\n"
                f"• **Age Requirement:** {age_cond}\n"
                f"• **Financial Limit:** {income_cond}\n"
                f"• **Beneficiary Target:** {', '.join(scheme.target_beneficiaries)}\n\n"
                f"You can use our guided **Eligibility Checker** for a deterministic evaluation."
            )
        elif any(w in q_low for w in ["apply", "portal", "website", "link", "how to"]):
            answer = (
                f"To apply for **{scheme.name}**:\n\n"
                f"1. Application Mode: **{scheme.application_mode}**\n"
                f"2. Official Portal: [{scheme.application_url or scheme.official_source_url}]({scheme.application_url or scheme.official_source_url})\n"
                f"3. Ensure all mandatory documents ({', '.join(doc_names[:3])}) are ready in electronic format.\n\n"
                f"*CivicSetu Reminder:* Final verification and approval are solely granted by the respective government authority."
            )
        else:
            answer = (
                f"**{scheme.name}** is administered by the {scheme.department}.\n\n"
                f"{scheme.description}\n\n"
                f"• Official Portal: {scheme.official_source_url}\n"
                f"• Last verified on: {scheme.last_verified_at.strftime('%d %B %Y') if scheme.last_verified_at else 'Verified'}"
            )
        
        return AssistantChatResponse(
            answer=answer,
            sources=[scheme.official_source_url],
            suggested_actions=[
                f"Check Eligibility for {scheme.short_name or scheme.name}",
                "Add to My Checklist",
                "View Official Portal"
            ],
            is_ai_generated=False
        )

    # General query across platform
    if any(w in q_low for w in ["telangana", "tg"]):
        answer = (
            "CivicSetu currently indexes verified Telangana state initiatives including the **Rythu Bharosa / Rythu Bandhu Scheme** (agricultural investment support) "
            "and the **Aarogyasri Health Care Trust Scheme** (cashless hospitalization up to ₹10 Lakhs). "
            "You can filter by 'Telangana' on the Schemes page or use the Eligibility questionnaire."
        )
        sources = ["https://rythubandhu.telangana.gov.in/", "https://aarogyasri.telangana.gov.in/"]
    elif any(w in q_low for w in ["karnataka", "ka"]):
        answer = (
            "For Karnataka, verified schemes include the **Gruha Lakshmi Scheme** (₹2,000 monthly for woman heads of households) "
            "and the **Yuva Nidhi Scheme** (monthly allowance for unemployed graduates and diploma holders). "
            "Applications are processed via Karnataka's Seva Sindhu platform."
        )
        sources = ["https://sevasindhu.karnataka.gov.in/"]
    elif any(w in q_low for w in ["farmer", "kisan", "agriculture"]):
        answer = (
            "We have verified agricultural schemes such as **PM-KISAN** (Central: ₹6,000/year in 3 installments) "
            "and state-specific programs like **Rythu Bharosa** (Telangana). You can check your eligibility using the questionnaire."
        )
        sources = ["https://pmkisan.gov.in/"]
    elif any(w in q_low for w in ["health", "hospital", "ayushman"]):
        answer = (
            "For healthcare, **Ayushman Bharat (PM-JAY)** provides ₹5,00,000 coverage per family per year across India, "
            "with special cards for senior citizens aged 70+. Telangana residents can also access **Aarogyasri** up to ₹10,00,000."
        )
        sources = ["https://beneficiary.nha.gov.in/"]
    elif any(w in q_low for w in ["student", "scholarship", "study", "college"]):
        answer = (
            "Education schemes include the Central **NSP Post-Matric Scholarship for SC/ST Students** (tuition fee reimbursement + allowances) "
            "and Maharashtra's **MahaDBT Rajarshi Shahu Maharaj Scholarship** (50% fee concession for higher education)."
        )
        sources = ["https://scholarships.gov.in/", "https://mahadbt.maharashtra.gov.in/"]
    else:
        answer = (
            "Welcome to **CivicSetu Assistant**. I can help you understand eligibility criteria, required documents, and application procedures "
            "for verified Central and State Government schemes. You can ask about scholarships, farmer support, healthcare coverage, or housing grants."
        )
        sources = ["https://www.myscheme.gov.in/", "https://www.india.gov.in/"]

    return AssistantChatResponse(
        answer=answer,
        sources=sources,
        suggested_actions=["Check My Eligibility", "Explore All Schemes", "View Central Schemes"],
        is_ai_generated=False
    )


@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(
    payload: AssistantChatRequest,
    db: AsyncSession = Depends(get_db)
):
    scheme = None
    if payload.scheme_slug:
        query = select(Scheme).options(
            selectinload(Scheme.documents),
            selectinload(Scheme.rules)
        ).where(Scheme.slug == payload.scheme_slug)
        result = await db.execute(query)
        scheme = result.scalars().first()

    # If Gemini API Key is configured in settings/env, we could invoke Gemini here.
    # To keep response fast, 100% deterministic, source-grounded and compliant with non-hallucination rules,
    # we provide the grounded assistant response:
    return build_fallback_response(payload.query, scheme)
