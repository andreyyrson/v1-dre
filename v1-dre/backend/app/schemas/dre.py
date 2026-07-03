from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MovimentacaoFinanceira(BaseModel):
    id: str
    debito: bool
    data_vencimento: datetime
    data_competencia: datetime
    data_quitacao: Optional[datetime]
    data_conciliacao: Optional[datetime]
    valor: float
    forma_pagamento: int
    nome_forma_pagamento: str
    tipo_movimentacao: int
    nome_tipo_movimentacao: str
    nome: str
    observacao: Optional[str]
    numero_parcela: int
    quantidade_parcela: int
    id_categoria_financeira: int
    nome_categoria_financeira: Optional[str]
    icone_categoria_financeira: Optional[str]
    id_conta_financeira: int
    nome_conta_financeira: str
    id_empresa: int
    nome_empresa: str
    documento_empresa: str
    id_cliente: Optional[int]
    id_fornecedor: Optional[int]
    id_funcionario: Optional[int]
    nome_cliente_fornecedor: Optional[str]
    nome_departamento: Optional[str]
    tipo_departamento: Optional[int]
    nome_tipo_departamento: Optional[str]

    class Config:
        from_attributes = True


class DREFiltro(BaseModel):
    data_inicio: str = Field(..., description="Data início no formato YYYY-MM-DD")
    data_termino: str = Field(..., description="Data término no formato YYYY-MM-DD")
    tipo_data: str = Field(default="DataCompetencia", description="Tipo de data: DataPadrao, DataPrevista, DataPagamento, DataCompetencia")
    id_empresa: Optional[int] = None
    id_departamento: Optional[int] = None
    id_categoria: Optional[int] = None
    despesa: Optional[bool] = None


class DREItem(BaseModel):
    nome: str
    valor: float
    tipo: str  # "receita" ou "despesa"
    categoria: Optional[str] = None
    subcategoria: Optional[str] = None


class DRE(BaseModel):
    periodo: str
    receita_operacional: float
    despesa_operacional: float
    resultado_operacional: float
    outras_receitas: float
    outras_despesas: float
    lucro_liquido: float
    margem_lucro: float
    itens: List[DREItem]
    receitas_por_categoria: dict
    despesas_por_categoria: dict


class DREComparacao(BaseModel):
    periodo_atual: DRE
    periodo_anterior: DRE
    variacao_receita: float
    variacao_despesa: float
    variacao_lucro: float
