from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.seed.seed_data import seed_database
from app.api import schemes, eligibility, saved, checklists, profile, assistant


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed verified data
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        await seed_database(session)

    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CivicSetu Backend: Intelligent Government Scheme Discovery & Citizen Assistance API",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
api_router = FastAPI()
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(eligibility.router, prefix=settings.API_V1_STR)
app.include_router(saved.router, prefix=settings.API_V1_STR)
app.include_router(checklists.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)


@app.get("/api/health", tags=["health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Welcome to CivicSetu API. Visit /docs for OpenAPI documentation.",
        "docs_url": "/docs"
    }
