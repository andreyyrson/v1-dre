import pytest

CONTA_MOCK = {
    "IdMovimentacaoFinanceiraParcela": "abc-123",
    "Nome": "Energia Elétrica",
    "Valor": 850.0,
    "Debito": True,
    "DataVencimento": "2025-07-20",
    "DataQuitacao": None,
}


@pytest.mark.asyncio
async def test_get_contas_pagar_sucesso(test_app, mock_client):
    async def mock_paginar(*args, **kwargs):
        yield [CONTA_MOCK]

    mock_client.paginar_movimentacoes = mock_paginar

    response = await test_app.get(
        "/contas-pagar",
        params={
            "id_empresa": 1,
            "data_inicial": "2025-07-01",
            "data_final": "2025-07-31",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["contas"]) == 1
    assert data["contas"][0]["id"] == "abc-123"
    assert data["contas"][0]["pago"] is False
    assert "resumo" in data
    assert data["paginacao"]["total"] == 1
    assert data["paginacao"]["page"] == 1
    assert data["paginacao"]["total_pages"] == 1


@pytest.mark.asyncio
async def test_get_contas_pagar_periodo_invalido(test_app):
    response = await test_app.get(
        "/contas-pagar",
        params={
            "id_empresa": 1,
            "data_inicial": "2025-07-31",
            "data_final": "2025-07-01",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_contas_pagar_sem_empresa(test_app):
    response = await test_app.get(
        "/contas-pagar",
        params={"data_inicial": "2025-07-01", "data_final": "2025-07-31"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_contas_pagar_api_indisponivel(test_app, mock_client):
    from app.exceptions import BomControleAPIError

    async def mock_erro(*args, **kwargs):
        raise BomControleAPIError("Serviço indisponível", status_code=500)
        yield  # torna a função um generator

    mock_client.paginar_movimentacoes = mock_erro

    response = await test_app.get(
        "/contas-pagar",
        params={
            "id_empresa": 1,
            "data_inicial": "2025-07-01",
            "data_final": "2025-07-31",
        },
    )
    assert response.status_code == 502


def _conta_mock(i: int, debito: bool = True):
    return {
        "IdMovimentacaoFinanceiraParcela": f"id-{i:02d}",
        "Nome": f"Conta {i}",
        "Valor": float(i),
        "Debito": debito,
        "DataVencimento": f"2025-07-{i:02d}",
        "DataQuitacao": None,
        "NomeClienteFornecedor": f"Fornecedor {i}",
    }


@pytest.mark.asyncio
async def test_get_contas_pagar_paginacao(test_app, mock_client):
    async def mock_paginar(*args, **kwargs):
        yield [_conta_mock(i) for i in range(1, 26)]

    mock_client.paginar_movimentacoes = mock_paginar

    response = await test_app.get(
        "/contas-pagar",
        params={
            "id_empresa": 1,
            "data_inicial": "2025-07-01",
            "data_final": "2025-07-31",
            "apenas_abertas": "false",
            "page": 2,
            "page_size": 10,
            "sort_by": "valor",
            "order": "asc",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["paginacao"] == {
        "page": 2,
        "page_size": 10,
        "total": 25,
        "total_pages": 3,
    }
    assert len(data["contas"]) == 10
    assert data["contas"][0]["id"] == "id-11"
    # Resumo é global (sobre os 25), não sobre a página.
    assert data["resumo"]["total_contas"] == 25


@pytest.mark.asyncio
async def test_export_csv_completo(test_app, mock_client):
    async def mock_paginar(*args, **kwargs):
        yield [_conta_mock(i) for i in range(1, 4)]

    mock_client.paginar_movimentacoes = mock_paginar

    response = await test_app.get(
        "/contas-pagar/export",
        params={
            "id_empresa": 1,
            "data_inicial": "2025-07-01",
            "data_final": "2025-07-31",
            "apenas_abertas": "false",
        },
    )
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "attachment" in response.headers["content-disposition"]
    linhas = [l for l in response.text.splitlines() if l.strip()]
    assert linhas[0].startswith("id;descricao;fornecedor")
    assert len(linhas) == 4  # cabeçalho + 3 contas


@pytest.mark.asyncio
async def test_export_csv_selecionadas(test_app, mock_client):
    async def mock_paginar(*args, **kwargs):
        yield [_conta_mock(i) for i in range(1, 6)]

    mock_client.paginar_movimentacoes = mock_paginar

    response = await test_app.get(
        "/contas-pagar/export",
        params={
            "id_empresa": 1,
            "data_inicial": "2025-07-01",
            "data_final": "2025-07-31",
            "apenas_abertas": "false",
            "ids": "id-02,id-04",
        },
    )
    assert response.status_code == 200
    linhas = [l for l in response.text.splitlines() if l.strip()]
    assert len(linhas) == 3  # cabeçalho + 2 selecionadas


@pytest.mark.asyncio
async def test_get_empresas_sucesso(test_app, mock_client):
    from unittest.mock import AsyncMock

    mock_client.listar_empresas = AsyncMock(
        return_value=[{"Id": 1, "Nome": "DEXTRO", "Documento": "x", "Padrao": True}]
    )

    response = await test_app.get("/empresas")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == 1
    assert body[0]["nome"] == "DEXTRO"
