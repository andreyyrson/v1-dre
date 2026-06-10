from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Empresa(BaseModel):
    model_config = ConfigDict(populate_by_name=True, by_alias=False)

    Id: int
    Nome: Optional[str] = None
    Documento: Optional[str] = None
    Padrao: bool = False
