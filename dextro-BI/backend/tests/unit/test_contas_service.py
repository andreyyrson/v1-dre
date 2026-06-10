from datetime import date

import pytest

from app.cache.memory_cache import MemoryCache
from app.exceptions import PeriodoInvalidoError
from app.models.conta_pagar import ContaPagar
from app.services.contas_service import ContasService


def _raw(id_, valor, vencimento, debito=True, quitacao=None):
    return {
        "IdMovimentacaoFinanceiraParcela": id_,
        "Nome": f"Conta {id_}",
        "Valor": valor,
        "Debito": debito,
        "DataVencimento": vencimento,
        "DataQuitacao": quitacao,
    }


def _conta(id_, valor, vencimento, pago=False):
    return ContaPagar.model_validate(
        _raw(id_, valor, vencimento, quitacao="2025-01-10" if pago else None)
    )


def _make_client(itens):
    class FakeClient:
        async def paginar_movimentacoes(self, *args, **kwargs):
            yield itens

    return FakeClient()


@pytest.fixture
def service_factory():
    def _factory(itens):
        return ContasService(_make_client(itens), MemoryCache(), cache_ttl=300)

    return _factory


@pytest.mark.asyncio
async def test_lista_apenas_debitos(service_factory):
    """Receitas (Debito=False) devem ser descartadas."""
    itens = [
        _raw("a", 100.0, "2025-07-10", debito=True),
        _raw("b", 200.0, "2025-07-15", debito=False),  # receita
    ]
    service = service_factory(itens)
    contas = await service.listar_contas(
        date(2025, 7, 1), date(2025, 7, 31), id_empresa=1
    )
    assert len(contas) == 1
    assert contas[0].id == "a"


@pytest.mark.asyncio
async def test_retorna_todas_incluindo_quitadas(service_factory):
    """O service deve retornar todas as contas a pagar, incluindo quitadas."""
    itens = [
        _raw("a", 100.0, "2025-07-10", quitacao=None),
        _raw("b", 200.0, "2025-07-15", quitacao="2025-07-16"),
    ]
    service = service_factory(itens)
    contas = await service.listar_contas(
        date(2025, 7, 1), date(2025, 7, 31), id_empresa=1
    )
    assert {c.id for c in contas} == {"a", "b"}


@pytest.mark.asyncio
async def test_periodo_invalido(service_factory):
    service = service_factory([])
    with pytest.raises(PeriodoInvalidoError):
        await service.listar_contas(
            date(2025, 7, 31), date(2025, 7, 1), id_empresa=1
        )


@pytest.mark.asyncio
async def test_cache_evita_segunda_chamada(service_factory):
    class CountingClient:
        def __init__(self):
            self.n = 0

        async def paginar_movimentacoes(self, *args, **kwargs):
            self.n += 1
            yield [_raw("a", 100.0, "2025-07-10")]

    client = CountingClient()
    service = ContasService(client, MemoryCache(), cache_ttl=300)

    await service.listar_contas(date(2025, 7, 1), date(2025, 7, 31), id_empresa=1)
    await service.listar_contas(date(2025, 7, 1), date(2025, 7, 31), id_empresa=1)

    assert client.n == 1


def test_calcular_resumo(service_factory):
    service = service_factory([])
    contas = [
        _conta("1", 1000.0, "2020-01-01", pago=False),  # vencida
        _conta("2", 500.0, "2099-12-31", pago=False),   # a vencer
        _conta("3", 200.0, "2020-01-01", pago=True),    # paga
    ]
    resumo = service.calcular_resumo(contas)
    assert resumo.valor_vencido == 1000.0
    assert resumo.valor_a_vencer == 500.0
    assert resumo.valor_pago == 200.0
    assert resumo.quantidade_vencidas == 1
    assert resumo.quantidade_a_vencer == 1
    assert resumo.quantidade_pagas == 1


def test_filtrar_selecionadas(service_factory):
    service = service_factory([])
    contas = [_conta(str(i), 100.0, "2025-07-01") for i in range(1, 6)]
    selecionadas = service.filtrar_selecionadas(contas, ids=["2", "4"])
    assert {c.id for c in selecionadas} == {"2", "4"}


def test_filtrar_selecionadas_inexistentes(service_factory):
    service = service_factory([])
    contas = [_conta("1", 100.0, "2025-07-01")]
    assert service.filtrar_selecionadas(contas, ids=["99"]) == []


def test_dividir_periodo_maior_que_max():
    service = ContasService(_make_client([]), MemoryCache(), max_periodo_dias=90)
    sub = service._dividir_periodo(date(2025, 1, 1), date(2025, 12, 31))
    assert len(sub) >= 4
    assert sub[0][0] == date(2025, 1, 1)
    assert sub[-1][1] == date(2025, 12, 31)


def test_ordenar_por_valor_desc(service_factory):
    service = service_factory([])
    contas = [
        _conta("1", 100.0, "2025-07-01"),
        _conta("2", 300.0, "2025-07-02"),
        _conta("3", 200.0, "2025-07-03"),
    ]
    ordenadas = service.ordenar(contas, sort_by="valor", order="desc")
    assert [c.id for c in ordenadas] == ["2", "3", "1"]


def test_ordenar_por_vencimento_asc(service_factory):
    service = service_factory([])
    contas = [
        _conta("1", 100.0, "2025-07-10"),
        _conta("2", 100.0, "2025-07-01"),
        _conta("3", 100.0, "2025-07-05"),
    ]
    ordenadas = service.ordenar(contas, sort_by="data_vencimento", order="asc")
    assert [c.id for c in ordenadas] == ["2", "3", "1"]


def test_ordenar_e_paginar(service_factory):
    service = service_factory([])
    contas = [_conta(str(i), float(i), f"2025-07-{i:02d}") for i in range(1, 26)]
    page_items, total, total_pages = service.ordenar_e_paginar(
        contas, sort_by="valor", order="asc", page=2, page_size=10
    )
    assert total == 25
    assert total_pages == 3
    assert len(page_items) == 10
    assert page_items[0].id == "11"


def test_paginar_ultima_pagina_parcial(service_factory):
    service = service_factory([])
    contas = [_conta(str(i), float(i), f"2025-07-{i:02d}") for i in range(1, 26)]
    page_items, total, total_pages = service.ordenar_e_paginar(
        contas, page=3, page_size=10
    )
    assert total_pages == 3
    assert len(page_items) == 5
