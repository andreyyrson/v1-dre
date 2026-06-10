import httpx
import pytest
import respx

from app.clients.bomcontrole import BomControleClient
from app.config import Settings
from app.exceptions import BomControleAPIError

BASE = "https://apinewintegracao.bomcontrole.com.br/integracao"


@pytest.fixture
def settings():
    return Settings(
        BOMCONTROLE_API_KEY="test-key-123",
        API_RETRY_MAX=3,
        API_RETRY_DELAY=0.0,
    )


@pytest.fixture
def client(settings):
    return BomControleClient(settings)


def _item(id_: str, debito: bool = True, vencimento: str = "2025-07-10"):
    return {
        "IdMovimentacaoFinanceiraParcela": id_,
        "Nome": f"Conta {id_}",
        "Valor": 100.0,
        "Debito": debito,
        "DataVencimento": vencimento,
        "DataQuitacao": None,
    }


@pytest.mark.asyncio
@respx.mock
async def test_paginar_pagina_unica(client):
    respx.get(f"{BASE}/Financeiro/Pesquisar").mock(
        return_value=httpx.Response(
            200, json={"Itens": [_item("a")], "TotalItens": 1}
        )
    )

    resultados = []
    async for pagina in client.paginar_movimentacoes("2025-07-01", "2025-07-31"):
        resultados.extend(pagina)

    assert len(resultados) == 1
    assert resultados[0]["IdMovimentacaoFinanceiraParcela"] == "a"


@pytest.mark.asyncio
@respx.mock
async def test_paginar_multiplas_paginas(client):
    """TotalItens=150 com 100 por página deve gerar 2 páginas."""

    def responder(request):
        pagina = int(request.url.params.get("paginacao.numeroDaPagina", 1))
        qtd = 100 if pagina == 1 else 50
        itens = [_item(f"p{pagina}-{i}") for i in range(qtd)]
        return httpx.Response(200, json={"Itens": itens, "TotalItens": 150})

    respx.get(f"{BASE}/Financeiro/Pesquisar").mock(side_effect=responder)

    resultados = []
    async for pagina in client.paginar_movimentacoes("2025-07-01", "2025-07-31"):
        resultados.extend(pagina)

    assert len(resultados) == 150


@pytest.mark.asyncio
@respx.mock
async def test_autenticacao_invalida(client):
    respx.get(f"{BASE}/Financeiro/Pesquisar").mock(return_value=httpx.Response(401))

    with pytest.raises(BomControleAPIError) as exc:
        async for _ in client.paginar_movimentacoes("2025-07-01", "2025-07-31"):
            pass

    assert exc.value.status_code == 401


@pytest.mark.asyncio
@respx.mock
async def test_header_autenticacao(client):
    captured = {}

    def capture(request):
        captured.update(dict(request.headers))
        return httpx.Response(200, json={"Itens": [], "TotalItens": 0})

    respx.get(f"{BASE}/Financeiro/Pesquisar").mock(side_effect=capture)

    async for _ in client.paginar_movimentacoes("2025-07-01", "2025-07-31"):
        pass

    assert captured.get("authorization") == "ApiKey test-key-123"


@pytest.mark.asyncio
@respx.mock
async def test_retry_em_429_e_sucesso(client):
    chamadas = {"n": 0}

    def responder(request):
        chamadas["n"] += 1
        if chamadas["n"] == 1:
            return httpx.Response(429)
        return httpx.Response(200, json={"Itens": [_item("x")], "TotalItens": 1})

    respx.get(f"{BASE}/Financeiro/Pesquisar").mock(side_effect=responder)

    resultados = []
    async for pagina in client.paginar_movimentacoes("2025-07-01", "2025-07-31"):
        resultados.extend(pagina)

    assert chamadas["n"] == 2
    assert len(resultados) == 1


@pytest.mark.asyncio
@respx.mock
async def test_listar_empresas(client):
    respx.get(f"{BASE}/Empresa/Pesquisar").mock(
        return_value=httpx.Response(
            200,
            json=[{"Id": 1, "Nome": "DEXTRO", "Documento": "x", "Padrao": True}],
        )
    )

    empresas = await client.listar_empresas()
    assert empresas[0]["Id"] == 1
