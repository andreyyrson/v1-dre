from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BOM_CONTROLE_API_KEY: str
    BOM_CONTROLE_API_URL: str = "https://apinewintegracao.bomcontrole.com.br/integracao"

    class Config:
        env_file = ".env"


settings = Settings()
