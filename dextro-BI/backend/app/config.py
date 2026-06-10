from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação carregadas de variáveis de ambiente / .env."""

    BOMCONTROLE_API_KEY: str

    CACHE_TTL_CONTAS: int = 300
    CACHE_TTL_EMPRESAS: int = 1800
    MAX_PERIODO_DIAS: int = 90
    API_RETRY_MAX: int = 3
    API_RETRY_DELAY: float = 2.0

    CORS_ORIGINS: str = "http://localhost:5173"

    # Autenticação / JWT
    JWT_SECRET: str = "troque-este-segredo-em-producao"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 480  # 8 horas

    # Banco de dados (usuários)
    DATABASE_URL: str = "sqlite:///./app.db"

    # Admin inicial (seed) criado no primeiro startup se não houver usuários
    ADMIN_USERNAME: str = "admin@dextro"
    ADMIN_PASSWORD: str = "admin123"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
