import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.dependencies import get_settings
from app.db import init_db
from app.exceptions import BomControleAPIError

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Dashboard de Contas a Pagar — BomControle",
    description="Backend que consome a API BomControle para exibir contas a pagar.",
    version="0.1.0",
    lifespan=lifespan,
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.exception_handler(BomControleAPIError)
async def bomcontrole_error_handler(request: Request, exc: BomControleAPIError):
    """Mapeia falhas da API externa para respostas HTTP apropriadas."""
    if exc.status_code == 401:
        status = 502  # credencial do servidor inválida; não expor 401 ao cliente final
        detail = "Falha de autenticação com a API BomControle"
    elif exc.status_code == 429:
        status = 429
        detail = "Limite de requisições da API BomControle atingido"
    else:
        status = 502
        detail = exc.message or "Erro ao comunicar com a API BomControle"
    return JSONResponse(status_code=status, content={"detail": detail})


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Preserva detalhe das exceções HTTP (401, 403, etc.) para o frontend."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok"}


app.include_router(api_router)
