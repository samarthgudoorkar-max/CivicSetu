import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import engine, Base, AsyncSessionLocal
from app.seed.seed_data import seed_database


@pytest_asyncio.fixture(scope="module", autouse=True)
async def setup_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await seed_database(session)
    yield
    await engine.dispose()


@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_get_categories():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/categories")
    assert response.status_code == 200
    cats = response.json()
    assert len(cats) == 8
    cat_names = [c["name"] for c in cats]
    assert "Education" in cat_names
    assert "Agriculture" in cat_names


@pytest.mark.asyncio
async def test_list_schemes():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/schemes")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 10
    assert len(data["items"]) >= 10


@pytest.mark.asyncio
async def test_scheme_detail():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/schemes/pm-kisan-samman-nidhi")
    assert response.status_code == 200
    scheme = response.json()
    assert scheme["slug"] == "pm-kisan-samman-nidhi"
    assert len(scheme["documents"]) > 0
    assert len(scheme["rules"]) > 0


@pytest.mark.asyncio
async def test_check_eligibility_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "state_code": "TG",
            "age": 30,
            "is_farmer": True,
            "annual_income": 150000
        }
        response = await ac.post("/api/eligibility/check", json=payload)
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    # Rythu Bharosa / PM-KISAN should be Potentially Eligible for TG farmer
    pmkisan = next((r for r in results if r["scheme_slug"] == "pm-kisan-samman-nidhi"), None)
    assert pmkisan is not None
    assert pmkisan["assessment_status"] == "Potentially Eligible"
