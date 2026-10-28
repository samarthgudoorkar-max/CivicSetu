from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import ApplicationChecklist, Scheme, SchemeDocument
from app.models.schemas import (
    ApplicationChecklistCreate,
    ApplicationChecklistUpdate,
    ApplicationChecklistResponse
)
from app.api.saved import get_current_user_id

router = APIRouter(prefix="/me/checklists", tags=["checklists"])


@router.get("", response_model=List[ApplicationChecklistResponse])
async def list_checklists(
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = get_current_user_id(auth_header)
    query = (
        select(ApplicationChecklist)
        .options(
            selectinload(ApplicationChecklist.scheme).selectinload(Scheme.documents),
            selectinload(ApplicationChecklist.scheme).selectinload(Scheme.rules)
        )
        .where(ApplicationChecklist.user_id == uid)
        .order_by(ApplicationChecklist.updated_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=ApplicationChecklistResponse)
async def create_or_get_checklist(
    payload: ApplicationChecklistCreate,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = payload.user_id or get_current_user_id(auth_header)

    # Resolve scheme by id or slug
    scheme_res = await db.execute(
        select(Scheme)
        .options(selectinload(Scheme.documents))
        .where(Scheme.id == payload.scheme_id)
    )
    scheme = scheme_res.scalars().first()
    if not scheme:
        scheme_slug_res = await db.execute(
            select(Scheme)
            .options(selectinload(Scheme.documents))
            .where(Scheme.slug == payload.scheme_id)
        )
        scheme = scheme_slug_res.scalars().first()
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found.")
        payload.scheme_id = scheme.id

    # Check if already exists
    existing = await db.execute(
        select(ApplicationChecklist)
        .options(selectinload(ApplicationChecklist.scheme).selectinload(Scheme.documents))
        .where(
            and_(
                ApplicationChecklist.user_id == uid,
                ApplicationChecklist.scheme_id == payload.scheme_id
            )
        )
    )
    checklist = existing.scalars().first()

    if not checklist:
        # Build initial items from scheme documents
        items = []
        for doc in scheme.documents:
            items.append({
                "doc_id": doc.id,
                "name": doc.document_name,
                "checked": False,
                "is_required": doc.is_required,
                "notes": doc.description or ""
            })

        checklist = ApplicationChecklist(
            user_id=uid,
            scheme_id=scheme.id,
            stage="Research",
            notes=payload.notes or "",
            target_deadline=payload.target_deadline or "",
            checklist_data=items
        )
        db.add(checklist)
        await db.commit()
        await db.refresh(checklist)

    # Re-fetch with relationships
    refetched = await db.execute(
        select(ApplicationChecklist)
        .options(
            selectinload(ApplicationChecklist.scheme).selectinload(Scheme.documents),
            selectinload(ApplicationChecklist.scheme).selectinload(Scheme.rules)
        )
        .where(ApplicationChecklist.id == checklist.id)
    )
    return refetched.scalars().first()


@router.put("/{checklist_id}", response_model=ApplicationChecklistResponse)
async def update_checklist(
    checklist_id: str,
    payload: ApplicationChecklistUpdate,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = get_current_user_id(auth_header)
    query = select(ApplicationChecklist).where(
        and_(
            ApplicationChecklist.id == checklist_id,
            ApplicationChecklist.user_id == uid
        )
    )
    result = await db.execute(query)
    checklist = result.scalars().first()

    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found.")

    if payload.stage is not None:
        checklist.stage = payload.stage
    if payload.notes is not None:
        checklist.notes = payload.notes
    if payload.target_deadline is not None:
        checklist.target_deadline = payload.target_deadline
    if payload.checklist_data is not None:
        checklist.checklist_data = [item.dict() for item in payload.checklist_data]

    await db.commit()
    await db.refresh(checklist)

    refetched = await db.execute(
        select(ApplicationChecklist)
        .options(
            selectinload(ApplicationChecklist.scheme).selectinload(Scheme.documents),
            selectinload(ApplicationChecklist.scheme).selectinload(Scheme.rules)
        )
        .where(ApplicationChecklist.id == checklist.id)
    )
    return refetched.scalars().first()


@router.delete("/{checklist_id}")
async def delete_checklist(
    checklist_id: str,
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    uid = get_current_user_id(auth_header)
    result = await db.execute(
        select(ApplicationChecklist).where(
            and_(
                ApplicationChecklist.id == checklist_id,
                ApplicationChecklist.user_id == uid
            )
        )
    )
    checklist = result.scalars().first()
    if checklist:
        await db.delete(checklist)
        await db.commit()
    return {"success": True, "message": "Checklist removed."}
