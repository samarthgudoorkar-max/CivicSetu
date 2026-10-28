from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, desc
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Scheme, SchemeDocument, EligibilityRule
from app.models.schemas import SchemeResponse, SchemeListResponse

router = APIRouter(prefix="", tags=["schemes"])


@router.get("/schemes", response_model=SchemeListResponse)
async def list_schemes(
    q: Optional[str] = Query(None, description="Search term for scheme name or benefits"),
    category: Optional[str] = Query(None, description="Filter by category"),
    level: Optional[str] = Query(None, description="Filter by 'central' or 'state'"),
    state_code: Optional[str] = Query(None, description="Filter by state code, e.g. TG, MH, KA, UP"),
    featured: Optional[bool] = Query(None, description="Filter featured schemes"),
    beneficiary: Optional[str] = Query(None, description="Filter by target beneficiary"),
    sort_by: Optional[str] = Query("popular", description="'popular', 'name_asc', 'verified_desc'"),
    db: AsyncSession = Depends(get_db)
):
    query = select(Scheme).options(
        selectinload(Scheme.documents),
        selectinload(Scheme.rules)
    )

    conditions = []

    if q:
        search_filter = f"%{q}%"
        conditions.append(
            or_(
                Scheme.name.ilike(search_filter),
                Scheme.short_name.ilike(search_filter),
                Scheme.description.ilike(search_filter),
                Scheme.department.ilike(search_filter),
                Scheme.category.ilike(search_filter)
            )
        )

    if category and category.lower() != "all":
        conditions.append(Scheme.category.ilike(category))

    if level and level.lower() != "all":
        conditions.append(Scheme.government_level == level.lower())

    if state_code and state_code.upper() != "ALL":
        # Include schemes that are central OR state matching state_code
        conditions.append(
            or_(
                Scheme.state_code == state_code.upper(),
                Scheme.government_level == "central"
            )
        )

    if featured is not None:
        conditions.append(Scheme.is_featured == featured)

    if conditions:
        query = query.where(and_(*conditions))

    if sort_by == "name_asc":
        query = query.order_by(Scheme.name.asc())
    elif sort_by == "verified_desc":
        query = query.order_by(desc(Scheme.last_verified_at))
    else:
        # Default: featured first, then name
        query = query.order_by(desc(Scheme.is_featured), Scheme.name.asc())

    result = await db.execute(query)
    schemes = result.scalars().all()

    # In-memory filter for JSON target_beneficiaries if requested
    if beneficiary and beneficiary.lower() != "all":
        filtered = []
        b_low = beneficiary.lower()
        for s in schemes:
            b_list = [b.lower() for b in (s.target_beneficiaries or [])]
            if any(b_low in b or b in b_low for b in b_list):
                filtered.append(s)
        schemes = filtered

    return SchemeListResponse(
        total=len(schemes),
        items=schemes
    )


@router.get("/schemes/{slug}", response_model=SchemeResponse)
async def get_scheme_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    query = select(Scheme).options(
        selectinload(Scheme.documents),
        selectinload(Scheme.rules)
    ).where(Scheme.slug == slug)

    result = await db.execute(query)
    scheme = result.scalars().first()

    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{slug}' not found.")

    return scheme


@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    canonical = [
        {"id": "Education", "name": "Education", "icon": "GraduationCap", "description": "Scholarships, tuition waivers, and student financial aid."},
        {"id": "Healthcare", "name": "Healthcare", "icon": "HeartPulse", "description": "Cashless health insurance, maternal care, and medical treatment."},
        {"id": "Agriculture", "name": "Agriculture", "icon": "Sprout", "description": "Farmer income support, input subsidies, and crop assistance."},
        {"id": "Employment", "name": "Employment", "icon": "Briefcase", "description": "Skill development, unemployment allowances, and micro-business loans."},
        {"id": "Women & Child Welfare", "name": "Women & Child Welfare", "icon": "Users", "description": "Financial empowerment, girl child support, and maternity grants."},
        {"id": "Housing", "name": "Housing", "icon": "Home", "description": "Pucca home construction assistance and rural housing grants."},
        {"id": "Senior Citizens", "name": "Senior Citizens", "icon": "ShieldCheck", "description": "Guaranteed pensions, retirement security, and elderly care."},
        {"id": "Financial Assistance", "name": "Financial Assistance", "icon": "IndianRupee", "description": "Working capital, street vendor credit, and direct transfers."}
    ]

    # Get count per category
    result = await db.execute(select(Scheme.category))
    cats = [r[0] for r in result.all()]
    
    enriched = []
    for c in canonical:
        count = sum(1 for item in cats if item.lower() == c["name"].lower())
        enriched.append({**c, "scheme_count": count})

    return enriched


@router.get("/states")
async def get_states():
    # Representative supported states in seed catalog with central coverage
    return [
        {"code": "ALL", "name": "All India (Central Schemes)", "is_central": True},
        {"code": "TG", "name": "Telangana", "is_central": False},
        {"code": "KA", "name": "Karnataka", "is_central": False},
        {"code": "MH", "name": "Maharashtra", "is_central": False},
        {"code": "UP", "name": "Uttar Pradesh", "is_central": False},
        {"code": "AP", "name": "Andhra Pradesh", "is_central": False},
        {"code": "TN", "name": "Tamil Nadu", "is_central": False},
        {"code": "KL", "name": "Kerala", "is_central": False},
        {"code": "DL", "name": "Delhi", "is_central": False},
        {"code": "GJ", "name": "Gujarat", "is_central": False},
        {"code": "RJ", "name": "Rajasthan", "is_central": False},
        {"code": "WB", "name": "West Bengal", "is_central": False},
        {"code": "MP", "name": "Madhya Pradesh", "is_central": False},
        {"code": "BR", "name": "Bihar", "is_central": False}
    ]
