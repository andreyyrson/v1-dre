from fastapi import APIRouter, Depends

from app.dependencies import get_empresa_service
from app.models.empresa import Empresa
from app.services.empresa_service import EmpresaService
from app.auth.deps import get_current_user
from app.models.user import User

router = APIRouter(tags=["empresas"])


@router.get("/empresas", response_model=list[Empresa], response_model_by_alias=False)
async def listar_empresas(
    service: EmpresaService = Depends(get_empresa_service),
    _: User = Depends(get_current_user),
) -> list[Empresa]:
    return await service.listar_empresas()
