import asyncio
import logging
from typing import Any, AsyncGenerator, Optional

import httpx

from app.config import Settings
from app.exceptions import BomControleAPIError

logger = logging.getLogger(__name__)

# Quantidade máxima de itens por página aceita pela API BomControle.
MAX_ITENS_POR_PAGINA = 100


class BomControleClient:
    """Cliente HTTP para a API BomControle.

    Responsável exclusivamente por montar/disparar requisições, autenticar,
    iterar sobre as páginas e levantar exceções tipadas.
    """

    BASE_URL = "https://apinewintegracao.bomcontrole.com.br/integracao"

    def __init__(self, settings: Settings):
        self._api_key = settings.BOMCONTROLE_API_KEY
        self._headers = {
            "Authorization": f"ApiKey {self._api_key}",
            "Content-Type": "application/json",
        }
        self._timeout = httpx.Timeout(30.0)
        self._retry_max = settings.API_RETRY_MAX
        self._retry_delay = settings.API_RETRY_DELAY

    async def _get(self, endpoint: str, params: dict) -> Any:
        """Executa GET e retorna o JSON. Levanta BomControleAPIError em falha."""
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.get(
                    f"{self.BASE_URL}/{endpoint}",
                    headers=self._headers,
                    params=params,
                )
        except httpx.RequestError as exc:
            raise BomControleAPIError(f"Falha de conexão com a API: {exc}", status_code=0)

        if response.status_code == 401:
            raise BomControleAPIError("API Key inválida ou expirada", status_code=401)
        if response.status_code == 403:
            raise BomControleAPIError("Sem permissão para o recurso", status_code=403)
        if response.status_code == 429:
            raise BomControleAPIError("Rate limit atingido", status_code=429)
        if response.status_code >= 400:
            raise BomControleAPIError(
                f"Erro HTTP {response.status_code} na API BomControle",
                status_code=response.status_code,
            )

        try:
            return response.json()
        except ValueError:
            raise BomControleAPIError("Resposta da API não é um JSON válido", status_code=502)

    async def _get_with_retry(self, endpoint: str, params: dict) -> Any:
        """GET com retry e exponential backoff em caso de 429 (RN-08)."""
        for attempt in range(self._retry_max):
            try:
                return await self._get(endpoint, params)
            except BomControleAPIError as exc:
                if exc.status_code == 429 and attempt < self._retry_max - 1:
                    delay = self._retry_delay * (2 ** attempt)
                    logger.warning("Rate limit; retry em %.1fs (tentativa %d)", delay, attempt + 1)
                    await asyncio.sleep(delay)
                    continue
                raise
        # Inalcançável, mas mantém o type checker satisfeito.
        raise BomControleAPIError("Falha após múltiplas tentativas", status_code=429)

    async def paginar_movimentacoes(
        self,
        data_inicial: str,
        data_final: str,
        id_empresa: Optional[int] = None,
        tipo_data: str = "DataPadrao",
    ) -> AsyncGenerator[list[dict], None]:
        """Itera sobre TODAS as páginas de movimentações financeiras (RN-01).

        Endpoint real: Financeiro/Pesquisar. Resposta: {"Itens": [...], "TotalItens": N}.
        A paginação é calculada a partir de TotalItens e itensPorPagina.
        """
        pagina_atual = 1
        while True:
            params: dict = {
                "dataInicio": data_inicial,
                "dataTermino": data_final,
                "tipoData": tipo_data,
                "paginacao.itensPorPagina": MAX_ITENS_POR_PAGINA,
                "paginacao.numeroDaPagina": pagina_atual,
            }
            if id_empresa:
                params["idsEmpresa"] = id_empresa

            resposta = await self._get_with_retry("Financeiro/Pesquisar", params)
            itens = resposta.get("Itens", []) if isinstance(resposta, dict) else []
            total_itens = int(resposta.get("TotalItens", 0)) if isinstance(resposta, dict) else 0

            yield itens

            total_paginas = max(
                1, -(-total_itens // MAX_ITENS_POR_PAGINA)  # ceil division
            )
            if pagina_atual >= total_paginas or not itens:
                break
            pagina_atual += 1

    async def listar_empresas(self) -> list[dict]:
        dados = await self._get_with_retry("Empresa/Pesquisar", {})
        return dados if isinstance(dados, list) else []
