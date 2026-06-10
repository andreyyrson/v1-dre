from functools import lru_cache

from fastapi import Depends

from app.cache.memory_cache import MemoryCache
from app.clients.bomcontrole import BomControleClient
from app.config import Settings
from app.services.contas_service import ContasService
from app.services.empresa_service import EmpresaService


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Cache compartilhado entre requisições (singleton de processo).
_cache_singleton = MemoryCache()


def get_cache() -> MemoryCache:
    return _cache_singleton


def get_client(settings: Settings = Depends(get_settings)) -> BomControleClient:
    return BomControleClient(settings)


def get_contas_service(
    client: BomControleClient = Depends(get_client),
    cache: MemoryCache = Depends(get_cache),
    settings: Settings = Depends(get_settings),
) -> ContasService:
    return ContasService(
        client=client,
        cache=cache,
        cache_ttl=settings.CACHE_TTL_CONTAS,
        max_periodo_dias=settings.MAX_PERIODO_DIAS,
    )


def get_empresa_service(
    client: BomControleClient = Depends(get_client),
    cache: MemoryCache = Depends(get_cache),
    settings: Settings = Depends(get_settings),
) -> EmpresaService:
    return EmpresaService(
        client=client,
        cache=cache,
        cache_ttl=settings.CACHE_TTL_EMPRESAS,
    )
