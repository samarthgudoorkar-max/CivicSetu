from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, delete
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import SavedScheme, Scheme
from app.models.schemas import SchemeResponse, SavedSchemeToggleRequest

router = APIRouter(prefix="/me", tags=["saved"])


def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    # If Supabase Bearer token is provided, extract user id, else fallback to guest-user
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "").strip()
        # For simplicity in mock/development, token can be user-id or Supabase JWT
        if token and len(token) > 2:
            return token
    return "guest-user"


@router.get("/saved", response_model=List[SchemeResponse])
async def get_saved_schemes(
    user_id: Optional[str] = None,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = user_id or get_current_user_id(auth_header)
    query = (
        select(Scheme)
        .join(SavedScheme, SavedScheme.scheme_id == Scheme.id)
        .options(
            selectinload(Scheme.documents),
            selectinload(Scheme.rules)
        )
        .where(SavedScheme.user_id == uid)
    )

    result = await db.execute(query)
    return result.scalars().all()


@router.post("/saved")
async def toggle_save_scheme(
    payload: SavedSchemeToggleRequest,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = payload.user_id or get_current_user_id(auth_header)

    # Check if scheme exists
    scheme_res = await db.execute(select(Scheme).where(Scheme.id == payload.scheme_id))
    scheme = scheme_res.scalars().first()
    if not scheme:
        # Check by slug
        scheme_slug_res = await db.execute(select(Scheme).where(Scheme.slug == payload.scheme_id))
        scheme = scheme_slug_res.scalars().first()
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found.")
        payload.scheme_id = scheme.id

    # Check existing save
    query = select(SavedScheme).where(
        and_(
            SavedScheme.user_id == uid,
            SavedScheme.scheme_id == payload.scheme_id
        )
    )
    result = await db.execute(query)
    existing = result.scalars().first()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"saved": False, "message": "Scheme removed from saved list."}
    else:
        new_save = SavedScheme(user_id=uid, scheme_id=payload.scheme_id)
        db.add(new_save)
        await db.commit()
        return {"saved": True, "message": "Scheme saved to your profile."}


@router.delete("/saved/{scheme_id}")
async def unsave_scheme(
    scheme_id: str,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = get_current_user_id(auth_header)
    await db.execute(
        delete(SavedScheme).where(
            and_(
                SavedScheme.user_id == uid,
                SavedScheme.scheme_id == scheme_id
            )
        )
    )
    await db.commit()
    return {"success": True, "message": "Scheme removed."}
