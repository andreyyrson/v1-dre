class BomControleAPIError(Exception):
    """Erro ao comunicar com a API BomControle."""

    def __init__(self, message: str, status_code: int = 0):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class PeriodoInvalidoError(ValueError):
    """Período de consulta inválido (datas incoerentes)."""


class EmpresaNaoEncontradaError(LookupError):
    """Empresa não encontrada para a chave/credencial atual."""
