import logging
from datetime import date, timedelta
from math import ceil

from app.cache.memory_cache import MemoryCache
from app.clients.bomcontrole import BomControleClient
from app.exceptions import PeriodoInvalidoError
from app.models.conta_pagar import ContaPagar, ResumoContas

logger = logging.getLogger(__name__)


class ContasService:
    def __init__(
        self,
        client: BomControleClient,
        cache: MemoryCache,
        cache_ttl: int = 300,
        max_periodo_dias: int = 90,
    ):
        self._client = client
        self._cache = cache
        self._cache_ttl = cache_ttl
        self._max_periodo_dias = max_periodo_dias

    @staticmethod
    def _validar_periodo(data_inicial: date, data_final: date) -> None:
        if data_final < data_inicial:
            raise PeriodoInvalidoError(
                "dataVencimentoFinal deve ser maior ou igual a dataVencimentoInicial"
            )

    def _dividir_periodo(self, data_inicial: date, data_final: date) -> list[tuple[date, date]]:
        """Divide janelas maiores que MAX_PERIODO_DIAS em sub-períodos (RN-02)."""
        sub_periodos: list[tuple[date, date]] = []
        inicio = data_inicial
        while inicio <= data_final:
            fim = min(inicio + timedelta(days=self._max_periodo_dias - 1), data_final)
            sub_periodos.append((inicio, fim))
            inicio = fim + timedelta(days=1)
        return sub_periodos

    async def listar_contas(
        self,
        data_inicial: date,
        data_final: date,
        id_empresa: int,
    ) -> list[ContaPagar]:
        """Retorna TODAS as contas do período (todas as páginas), com cache (RN-05)."""
        self._validar_periodo(data_inicial, data_final)

        cache_key = f"contas:{id_empresa}:{data_inicial}:{data_final}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            return cached

        todas: list[dict] = []

        for inicio, fim in self._dividir_periodo(data_inicial, data_final):
            async for pagina in self._client.paginar_movimentacoes(
                data_inicial=inicio.isoformat(),
                data_final=fim.isoformat(),
                id_empresa=id_empresa,
            ):
                todas.extend(pagina)

        contas = [ContaPagar.model_validate(item) for item in todas]
        # Somente contas a pagar (despesas): Debito == True.
        contas = [c for c in contas if c.debito]

        self._cache.set(cache_key, contas, ttl_seconds=self._cache_ttl)
        return contas

    def calcular_resumo(self, contas: list[ContaPagar]) -> ResumoContas:
        """Calcula KPIs: total, vencidas, a vencer, pagas."""
        hoje = date.today()
        total_valor = sum(c.valor for c in contas)
        vencidas = [
            c for c in contas
            if not c.pago and c.data_vencimento is not None and c.data_vencimento < hoje
        ]
        a_vencer = [
            c for c in contas
            if not c.pago and (c.data_vencimento is None or c.data_vencimento >= hoje)
        ]
        pagas = [c for c in contas if c.pago]

        return ResumoContas(
            total_contas=len(contas),
            valor_total=total_valor,
            valor_vencido=sum(c.valor for c in vencidas),
            valor_a_vencer=sum(c.valor for c in a_vencer),
            valor_pago=sum(c.valor for c in pagas),
            quantidade_vencidas=len(vencidas),
            quantidade_a_vencer=len(a_vencer),
            quantidade_pagas=len(pagas),
        )

    def filtrar_selecionadas(
        self, contas: list[ContaPagar], ids: list[str]
    ) -> list[ContaPagar]:
        ids_set = set(ids)
        return [c for c in contas if c.id in ids_set]

    @staticmethod
    def ordenar(
        contas: list[ContaPagar],
        sort_by: str = "data_vencimento",
        order: str = "asc",
    ) -> list[ContaPagar]:
        """Ordena as contas por um campo suportado, tratando valores nulos."""
        reverse = order == "desc"
        chaves = {
            "data_vencimento": lambda c: (
                c.data_vencimento is None,
                c.data_vencimento or date.min,
            ),
            "valor": lambda c: c.valor,
            "fornecedor": lambda c: (c.fornecedor or "").lower(),
        }
        key = chaves.get(sort_by, chaves["data_vencimento"])
        return sorted(contas, key=key, reverse=reverse)

    def ordenar_e_paginar(
        self,
        contas: list[ContaPagar],
        sort_by: str = "data_vencimento",
        order: str = "asc",
        page: int = 1,
        page_size: int = 50,
    ) -> tuple[list[ContaPagar], int, int]:
        """Ordena e devolve (itens_da_pagina, total, total_paginas)."""
        ordenadas = self.ordenar(contas, sort_by, order)
        total = len(ordenadas)
        total_pages = max(1, ceil(total / page_size)) if page_size > 0 else 1
        inicio = (page - 1) * page_size
        page_items = ordenadas[inicio : inicio + page_size]
        return page_items, total, total_pages

    def invalidar_cache(self, id_empresa: int, data_inicial: date, data_final: date) -> None:
        self._cache.invalidate(
            f"contas:{id_empresa}:{data_inicial}:{data_final}"
        )
