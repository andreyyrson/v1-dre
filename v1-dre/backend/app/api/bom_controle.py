from fastapi import APIRouter, Depends, HTTPException
from app.services.bom_controle_service import bom_controle_service
from app.schemas.dre import DREFiltro
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/financeiro")
async def get_financeiro(
    data_inicio: str,
    data_termino: str,
    tipo_data: str = "DataCompetencia",
    despesa: bool | None = None,
    current_user: User = Depends(get_current_user)
):
    """Busca movimentações financeiras do Bom Controle"""
    try:
        data = await bom_controle_service.get_financeiro_detalhado(
            data_inicio=data_inicio,
            data_termino=data_termino,
            tipo_data=tipo_data,
            despesa=despesa
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categorias")
async def get_categorias(
    id_categoria_pai: int | None = None,
    current_user: User = Depends(get_current_user)
):
    """Busca categorias financeiras"""
    try:
        data = await bom_controle_service.get_categorias_financeiras(id_categoria_pai)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/contas")
async def get_contas(
    id_empresa: int,
    texto_pesquisa: str | None = None,
    current_user: User = Depends(get_current_user)
):
    """Busca contas financeiras"""
    try:
        data = await bom_controle_service.get_contas_financeiras(
            id_empresa=id_empresa,
            texto_pesquisa=texto_pesquisa
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/departamentos")
async def get_departamentos(
    id_empresa: int | None = None,
    texto_pesquisa: str | None = None,
    current_user: User = Depends(get_current_user)
):
    """Busca departamentos"""
    try:
        data = await bom_controle_service.get_departamentos(
            id_empresa=id_empresa,
            texto_pesquisa=texto_pesquisa
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/empresas")
async def get_empresas(
    texto_pesquisa: str | None = None,
    current_user: User = Depends(get_current_user)
):
    """Busca empresas"""
    try:
        data = await bom_controle_service.get_empresas(texto_pesquisa)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
