from app.cache.memory_cache import MemoryCache
from app.clients.bomcontrole import BomControleClient
from app.models.empresa import Empresa


class EmpresaService:
    CACHE_KEY = "empresas"

    def __init__(
        self,
        client: BomControleClient,
        cache: MemoryCache,
        cache_ttl: int = 1800,
    ):
        self._client = client
        self._cache = cache
        self._cache_ttl = cache_ttl

    async def listar_empresas(self) -> list[Empresa]:
        """Lista empresas acessíveis pela chave, com cache de 30 min (RN-05)."""
        cached = self._cache.get(self.CACHE_KEY)
        if cached is not None:
            return cached

        dados = await self._client.listar_empresas()
        empresas = [Empresa.model_validate(item) for item in dados]
        self._cache.set(self.CACHE_KEY, empresas, ttl_seconds=self._cache_ttl)
        return empresas

    def invalidar_cache(self) -> None:
        self._cache.invalidate(self.CACHE_KEY)
