# Dextro DRE

Dashboard de DRE (Demonstrativo do Resultado do Exercício) com integração ao sistema Bom Controle.

## Stack Tecnológica

- **Backend**: Python 3.11+, FastAPI, PostgreSQL, Redis
- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Infraestrutura**: Docker, Docker Compose

## Setup Inicial

1. Copiar arquivo de ambiente:
```bash
cp .env.example .env
```

2. Configurar variáveis de ambiente no arquivo `.env`:
   - `BOM_CONTROLE_API_KEY`: Sua chave da API do Bom Controle
   - `SECRET_KEY`: Chave secreta para JWT (gerar uma nova)
   - Outras variáveis conforme necessário

3. Iniciar os containers:
```bash
docker-compose up -d
```

4. O backend estará disponível em `http://localhost:8000`
5. O frontend estará disponível em `http://localhost:3000`

## Estrutura de Branches

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/nome-funcionalidade` - Nova funcionalidade
- `fix/nome-bug` - Correção de bug
- `hotfix/nome-correcao` - Correção urgente

## Conventional Commits

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Build/dependências

## Roadmap

- ✅ Fase 1: Setup e Autenticação
- ⏳ Fase 2: Integração Bom Controle
- ⏳ Fase 3: Dashboard DRE Básico
- ⏳ Fase 4: Visualizações Avançadas
- ⏳ Fase 5: Exportação
- ⏳ Fase 6: Deploy em VPS
