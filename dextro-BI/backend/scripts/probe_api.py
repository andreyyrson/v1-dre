"""Sonda exploratória da API BomControle (uso único, para inspecionar respostas reais)."""
import json

import httpx

from app.config import Settings

settings = Settings()
BASE = "https://apinewintegracao.bomcontrole.com.br/integracao"
headers = {
    "Authorization": f"ApiKey {settings.BOMCONTROLE_API_KEY}",
    "Content-Type": "application/json",
}


def dump(title, resp):
    print(f"\n===== {title} =====")
    print("status:", resp.status_code)
    pag = {k: v for k, v in resp.headers.items() if k.lower().startswith("x-")}
    print("headers x-*:", pag)
    body = resp.text
    print("body (300):", body[:300])


params = {
    "pagina": 1,
    "dataVencimentoInicial": "2025-01-01",
    "dataVencimentoFinal": "2025-03-31",
    "idEmpresa": 60,
}

candidates = [
    ("GET", "ContasPagar/Pesquisar"),
    ("GET", "ContaPagar/Pesquisar"),
    ("GET", "ContasaPagar/Pesquisar"),
    ("GET", "ContasPagar"),
    ("GET", "ContaPagar"),
    ("GET", "ContasPagar/PesquisarPaginado"),
    ("POST", "ContasPagar/Pesquisar"),
    ("GET", "FinanceiroContaPagar/Pesquisar"),
    ("GET", "ContasPagar/Listar"),
]

with httpx.Client(timeout=30.0) as c:
    r = c.get(f"{BASE}/Empresa/Pesquisar", headers=headers)
    dump("Empresa/Pesquisar (full)", r)
    print("FULL BODY:", r.text)

    for method, path in candidates:
        try:
            if method == "GET":
                resp = c.get(f"{BASE}/{path}", headers=headers, params=params)
            else:
                resp = c.post(f"{BASE}/{path}", headers=headers, json=params)
        except Exception as exc:  # noqa: BLE001
            print(f"\n{method} {path} -> EXC {exc}")
            continue
        print(f"\n{method} {path} -> {resp.status_code} | {resp.text[:200]!r}")
