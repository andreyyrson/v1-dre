FROM python:3.12-slim

WORKDIR /app

# Instalar dependências do sistema (psycopg2 precisa de libpq)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos do projeto
COPY pyproject.toml .
COPY app/ ./app/

# Instalar dependências Python
RUN pip install --no-cache-dir -e "."

# Expor a porta que o Render/Render usa via $PORT
ENV PYTHONUNBUFFERED=1

# Comando de inicialização (usa $PORT do ambiente)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
