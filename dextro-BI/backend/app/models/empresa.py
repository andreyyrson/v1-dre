from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Empresa(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(alias="Id")
    nome: Optional[str] = Field(default=None, alias="Nome")
    documento: Optional[str] = Field(default=None, alias="Documento")
    padrao: bool = Field(default=False, alias="Padrao")
