import httpx
from typing import Optional, List, Dict, Any
from app.core.config import settings
import redis
import json

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


class BomControleService:
    def __init__(self):
        self.api_url = settings.BOM_CONTROLE_API_URL
        self.api_key = settings.BOM_CONTROLE_API_KEY
        self.headers = {
            "Authorization": f"ApiKey {self.api_key}",
            "Content-Type": "application/json"
        }

    async def _get_with_cache(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        cache_key: Optional[str] = None,
        cache_expire: int = 300
    ) -> Dict[str, Any]:
        """Busca dados da API com cache Redis"""
        
        # Tenta buscar do cache
        if cache_key:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        
        # Se não estiver no cache, busca da API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/{endpoint}",
                headers=self.headers,
                params=params,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
        
        # Salva no cache
        if cache_key:
            redis_client.setex(cache_key, cache_expire, json.dumps(data))
        
        return data

    async def get_financeiro_detalhado(
        self,
        data_inicio: str,
        data_termino: str,
        tipo_data: str = "DataCompetencia",
        despesa: Optional[bool] = None,
        ids_empresa: Optional[List[int]] = None,
        ids_cliente: Optional[List[int]] = None,
        ids_fornecedor: Optional[List[int]] = None,
        texto_pesquisa: Optional[str] = None,
        pagina: int = 1,
        itens_por_pagina: int = 50
    ) -> Dict[str, Any]:
        """Busca movimentações financeiras detalhadas"""
        
        params = {
            "filtro.dataInicio": data_inicio,
            "filtro.dataTermino": data_termino,
            "filtro.tipoData": tipo_data,
            "paginacao.numeroDaPagina": pagina,
            "paginacao.itensPorPagina": itens_por_pagina
        }
        
        if despesa is not None:
            params["filtro.despesa"] = despesa
        if ids_empresa:
            params["filtro.idsEmpresa"] = ids_empresa
        if ids_cliente:
            params["filtro.idsCliente"] = ids_cliente
        if ids_fornecedor:
            params["filtro.idsFornecedor"] = ids_fornecedor
        if texto_pesquisa:
            params["filtro.textoPesquisa"] = texto_pesquisa
        
        cache_key = f"financeiro:{data_inicio}:{data_termino}:{tipo_data}:{despesa}:{pagina}"
        
        return await self._get_with_cache(
            "Financeiro/PesquisaDetalhada",
            params=params,
            cache_key=cache_key,
            cache_expire=300  # 5 minutos
        )

    async def get_categorias_financeiras(
        self,
        id_categoria_pai: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Busca categorias financeiras"""
        
        params = {}
        if id_categoria_pai:
            params["idCategoriaPai"] = id_categoria_pai
        
        cache_key = f"categorias:{id_categoria_pai}"
        
        data = await self._get_with_cache(
            "CategoriaFinanceira/PesquisarCategoriasFilhas",
            params=params,
            cache_key=cache_key,
            cache_expire=3600  # 1 hora
        )
        
        return data if isinstance(data, list) else []

    async def get_contas_financeiras(
        self,
        id_empresa: int,
        texto_pesquisa: Optional[str] = None,
        permite_recebimento: Optional[bool] = None,
        permite_pagamento: Optional[bool] = None,
        tipo_conta: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Busca contas financeiras"""
        
        params = {"idEmpresa": id_empresa}
        if texto_pesquisa:
            params["textoPesquisa"] = texto_pesquisa
        if permite_recebimento is not None:
            params["permiteRecebimento"] = permite_recebimento
        if permite_pagamento is not None:
            params["permitePagamento"] = permite_pagamento
        if tipo_conta:
            params["tipoConta"] = tipo_conta
        
        cache_key = f"contas:{id_empresa}:{texto_pesquisa}:{permite_recebimento}:{permite_pagamento}:{tipo_conta}"
        
        data = await self._get_with_cache(
            "ContaFinanceira/Pesquisar",
            params=params,
            cache_key=cache_key,
            cache_expire=3600  # 1 hora
        )
        
        return data if isinstance(data, list) else []

    async def get_departamentos(
        self,
        id_empresa: Optional[int] = None,
        texto_pesquisa: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Busca departamentos"""
        
        params = {}
        if id_empresa:
            params["idEmpresa"] = id_empresa
        if texto_pesquisa:
            params["textoPesquisa"] = texto_pesquisa
        
        cache_key = f"departamentos:{id_empresa}:{texto_pesquisa}"
        
        data = await self._get_with_cache(
            "Departamento/Pesquisar",
            params=params,
            cache_key=cache_key,
            cache_expire=3600  # 1 hora
        )
        
        return data if isinstance(data, list) else []

    async def get_empresas(
        self,
        texto_pesquisa: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Busca empresas"""
        
        params = {}
        if texto_pesquisa:
            params["textoPesquisa"] = texto_pesquisa
        
        cache_key = f"empresas:{texto_pesquisa}"
        
        data = await self._get_with_cache(
            "Empresa/Pesquisar",
            params=params,
            cache_key=cache_key,
            cache_expire=3600  # 1 hora
        )
        
        return data if isinstance(data, list) else []


bom_controle_service = BomControleService()
