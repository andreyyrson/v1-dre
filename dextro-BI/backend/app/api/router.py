from fastapi import APIRouter

from app.api import auth, contas_pagar, empresas, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(empresas.router)
api_router.include_router(contas_pagar.router)
