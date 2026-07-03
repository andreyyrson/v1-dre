from fastapi import APIRouter, Depends, Query
from app.services.dre_service import dre_service
from app.schemas.dre import DRE, DREFiltro
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/calcular", response_model=DRE)
async def calcular_dre(
    data_inicio: str = Query(..., description="Data início no formato YYYY-MM-DD"),
    data_termino: str = Query(..., description="Data término no formato YYYY-MM-DD"),
    tipo_data: str = Query("DataCompetencia", description="Tipo de data"),
    id_empresa: int = Query(None, description="ID da empresa"),
    id_departamento: int = Query(None, description="ID do departamento"),
    id_categoria: int = Query(None, description="ID da categoria"),
    current_user: User = Depends(get_current_user)
):
    """Calcula a DRE para o período especificado"""
    return await dre_service.calcular_dre(
        data_inicio=data_inicio,
        data_termino=data_termino,
        tipo_data=tipo_data,
        id_empresa=id_empresa,
        id_departamento=id_departamento,
        id_categoria=id_categoria
    )


@router.get("/comparar")
async def comparar_dre(
    data_inicio_atual: str = Query(..., description="Data início período atual"),
    data_termino_atual: str = Query(..., description="Data término período atual"),
    data_inicio_anterior: str = Query(..., description="Data início período anterior"),
    data_termino_anterior: str = Query(..., description="Data término período anterior"),
    tipo_data: str = Query("DataCompetencia", description="Tipo de data"),
    id_empresa: int = Query(None, description="ID da empresa"),
    current_user: User = Depends(get_current_user)
):
    """Compara DRE entre dois períodos"""
    return await dre_service.comparar_periodos(
        data_inicio_atual=data_inicio_atual,
        data_termino_atual=data_termino_atual,
        data_inicio_anterior=data_inicio_anterior,
        data_termino_anterior=data_termino_anterior,
        tipo_data=tipo_data,
        id_empresa=id_empresa
    )
