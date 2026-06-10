import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from unittest.mock import MagicMock

from app.cache.memory_cache import MemoryCache
from app.auth.deps import get_current_user
from app.dependencies import get_cache, get_contas_service, get_empresa_service
from app.main import app
from app.models.user import User
from app.services.contas_service import ContasService
from app.services.empresa_service import EmpresaService


_TEST_USER = User(id=1, username="test@dextro", hashed_password="x", role="admin", is_active=True)


@pytest.fixture
def mock_client():
    return MagicMock()


@pytest.fixture
def memory_cache():
    return MemoryCache()


@pytest_asyncio.fixture
async def test_app(mock_client, memory_cache):
    """App FastAPI com client BomControle mockado e cache em memória."""
    app.dependency_overrides[get_cache] = lambda: memory_cache
    app.dependency_overrides[get_contas_service] = lambda: ContasService(
        client=mock_client, cache=memory_cache, cache_ttl=300, max_periodo_dias=90
    )
    app.dependency_overrides[get_empresa_service] = lambda: EmpresaService(
        client=mock_client, cache=memory_cache, cache_ttl=1800
    )
    app.dependency_overrides[get_current_user] = lambda: _TEST_USER
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
