# Backend — Dashboard de Contas a Pagar (BomControle)

Backend FastAPI que consome a API BomControle para listar e resumir contas a pagar por empresa e período.

> **Importante:** o contrato real da API difere do descrito em `docs/arquitetura.md`. As contas a pagar vêm do endpoint **`Financeiro/Pesquisar`** (não existe `ContasPagar/Pesquisar`). Veja a seção "API BomControle (real)" abaixo.

## Requisitos

- Python 3.11+

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[test]"
```

Copie `.env.example` para `.env` e preencha a chave:

```bash
cp .env.example .env
# edite BOMCONTROLE_API_KEY
```

> A chave fica **apenas** em `.env` (ignorado pelo Git). Nunca versione `.env`.

## Executar

```bash
uvicorn app.main:app --reload --port 8000
```

- Documentação OpenAPI: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/empresas` | Lista as empresas acessíveis pela chave |
| `GET` | `/contas-pagar` | Lista contas a pagar (paginada) + resumo global (KPIs) |
| `GET` | `/contas-pagar/export` | Exporta as contas em CSV (todas ou selecionadas) |
| `GET` | `/health` | Health check |

### `GET /contas-pagar`

Paginação **server-side**: o backend busca todas as páginas da API BomControle, calcula o **resumo sobre o conjunto completo** e devolve apenas a fatia da página.

Query params:

- `id_empresa` (int, obrigatório)
- `data_inicial` (date `aaaa-mm-dd`, obrigatório)
- `data_final` (date `aaaa-mm-dd`, obrigatório)
- `apenas_abertas` (bool, default `true`) — quando `true`, retorna só contas não quitadas
- `page` (int, default 1)
- `page_size` (int, default 50, máx 200)
- `sort_by` (`data_vencimento` | `valor` | `fornecedor`, default `data_vencimento`)
- `order` (`asc` | `desc`, default `asc`)

Exemplo:

```bash
curl "http://127.0.0.1:8000/contas-pagar?id_empresa=1&data_inicial=2025-01-01&data_final=2025-03-31&page=1&page_size=5&sort_by=valor&order=desc&apenas_abertas=false"
```

Resposta (resumida):

```json
{
  "contas": [
    {
      "id": "d6b0cc03-...",
      "descricao": "Pix enviado - ...",
      "valor": 24943.21,
      "data_vencimento": "2025-01-04",
      "data_quitacao": "2025-01-04",
      "pago": true,
      "fornecedor": "Porto Seguro",
      "categoria": "...",
      "nome_empresa": "DEXTRO"
    }
  ],
  "resumo": {
    "total_contas": 109,
    "valor_total": 442749.84,
    "valor_vencido": 0.0,
    "valor_a_vencer": 0.0,
    "quantidade_vencidas": 0,
    "quantidade_a_vencer": 0
  },
  "paginacao": { "page": 1, "page_size": 5, "total": 109, "total_pages": 22 }
}
```

### `GET /contas-pagar/export`

Exporta CSV (delimitador `;`). Mesmos filtros de `/contas-pagar` (sem paginação) + param opcional:

- `ids` — GUIDs separados por vírgula. **Omitido:** exporta toda a busca atual. **Informado:** só as selecionadas.

```bash
# Toda a busca
curl -OJ "http://127.0.0.1:8000/contas-pagar/export?id_empresa=1&data_inicial=2025-01-01&data_final=2025-01-31&apenas_abertas=false"
# Apenas selecionadas
curl -OJ "http://127.0.0.1:8000/contas-pagar/export?id_empresa=1&data_inicial=2025-01-01&data_final=2025-01-31&ids=guid1,guid2"
```

> **Rate limit:** janelas muito grandes (ex.: 1 ano) geram muitas chamadas à API BomControle e podem retornar `429`. O client já faz retry com backoff; para períodos longos, prefira janelas menores ou aumente `API_RETRY_MAX`/`API_RETRY_DELAY`.

## API BomControle (real)

- Base: `https://apinewintegracao.bomcontrole.com.br/integracao`
- Auth: header `Authorization: ApiKey {chave}`
- **Empresas:** `GET Empresa/Pesquisar` → array de `{Id, Documento, Nome, Padrao}` (PascalCase)
- **Contas a pagar:** `GET Financeiro/Pesquisar` com query params:
  - `idsEmpresa`, `dataInicio`, `dataTermino`, `tipoData` (usamos `DataPadrao` = vencimento)
  - `paginacao.itensPorPagina` (máx. 100), `paginacao.numeroDaPagina`
  - Resposta: `{"Itens": [...], "TotalItens": N}` — paginação calculada por `ceil(TotalItens / itensPorPagina)`
  - Cada item é uma parcela; `Debito=true` = despesa (conta a pagar); `DataQuitacao=null` = em aberto

## Testes

```bash
pytest tests/ -v
pytest tests/ --cov=app --cov-report=term-missing
```

## Estrutura

```
backend/app/
├── main.py            # App FastAPI, CORS, handlers de erro
├── config.py          # Settings (pydantic-settings)
├── dependencies.py    # Injeção de dependências
├── exceptions.py      # Exceções tipadas
├── api/               # Rotas (/empresas, /contas-pagar)
├── services/          # Regras de negócio (cache, KPIs, filtros)
├── clients/           # HTTP client da API BomControle
├── models/            # Schemas Pydantic
└── cache/             # Cache em memória com TTL
```
