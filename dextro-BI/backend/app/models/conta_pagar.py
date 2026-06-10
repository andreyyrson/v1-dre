from datetime import date, datetime
from typing import Optional, Union

from pydantic import BaseModel, ConfigDict, Field, computed_field, field_validator


def _to_date(value: Union[str, date, datetime, None]) -> Optional[date]:
    """Converte string ISO (com ou sem hora) ou datetime para date."""
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return datetime.fromisoformat(str(value)).date()


class ContaPagar(BaseModel):
    """Parcela financeira (movimentação) retornada por Financeiro/Pesquisar.

    Mapeia os campos PascalCase reais da API BomControle.
    """

    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="IdMovimentacaoFinanceiraParcela")
    descricao: Optional[str] = Field(default=None, alias="Nome")
    observacao: Optional[str] = Field(default=None, alias="Observacao")
    valor: float = Field(default=0.0, alias="Valor")
    valor_bruto: Optional[float] = Field(default=None, alias="ValorBruto")
    valor_desconto: Optional[float] = Field(default=None, alias="ValorDesconto")
    valor_acrescimo: Optional[float] = Field(default=None, alias="ValorAcrescimo")

    debito: bool = Field(default=False, alias="Debito")
    data_vencimento: Optional[date] = Field(default=None, alias="DataVencimento")
    data_competencia: Optional[date] = Field(default=None, alias="DataCompetencia")
    data_quitacao: Optional[date] = Field(default=None, alias="DataQuitacao")

    numero_parcela: Optional[int] = Field(default=None, alias="NumeroParcela")
    quantidade_parcela: Optional[int] = Field(default=None, alias="QuantidadeParcela")

    tipo_movimentacao: Optional[int] = Field(default=None, alias="TipoMovimentacao")
    nome_tipo_movimentacao: Optional[str] = Field(default=None, alias="NomeTipoMovimentacao")

    id_categoria: Optional[int] = Field(default=None, alias="IdCategoriaFinanceira")
    categoria: Optional[str] = Field(default=None, alias="NomeCategoriaFinanceira")
    id_conta_financeira: Optional[int] = Field(default=None, alias="IdContaFinanceira")
    conta_financeira: Optional[str] = Field(default=None, alias="NomeContaFinanceira")

    id_empresa: Optional[int] = Field(default=None, alias="IdEmpresa")
    nome_empresa: Optional[str] = Field(default=None, alias="NomeEmpresa")

    id_fornecedor: Optional[int] = Field(default=None, alias="IdFornecedor")
    id_funcionario: Optional[int] = Field(default=None, alias="IdFuncionario")
    fornecedor: Optional[str] = Field(default=None, alias="NomeClienteFornecedor")
    documento_fornecedor: Optional[str] = Field(default=None, alias="DocumentoClienteFornecedor")

    @field_validator(
        "data_vencimento", "data_competencia", "data_quitacao", mode="before"
    )
    @classmethod
    def _parse_dates(cls, value):
        return _to_date(value)

    @computed_field
    @property
    def pago(self) -> bool:
        return self.data_quitacao is not None


class ResumoContas(BaseModel):
    total_contas: int
    valor_total: float
    valor_vencido: float
    valor_a_vencer: float
    valor_pago: float
    quantidade_vencidas: int
    quantidade_a_vencer: int
    quantidade_pagas: int


class Paginacao(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class ContasPagarResponse(BaseModel):
    contas: list[ContaPagar]
    resumo: ResumoContas
    paginacao: Paginacao
