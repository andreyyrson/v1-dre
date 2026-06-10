# Guia de Deploy — Dextro BI Dashboard

## Arquitetura

- **Frontend**: Vercel (gratuito) → React + Vite + Tailwind
- **Backend**: Render (gratuito) → FastAPI + Docker
- **Banco de dados**: Supabase (gratuito) → PostgreSQL

> **Custo total: R$ 0**

---

## Pré-requisitos

1. Conta no [GitHub](https://github.com)
2. Conta no [Vercel](https://vercel.com)
3. Conta no [Render](https://render.com)
4. Conta no [Supabase](https://supabase.com)

---

## Passo 1 — Supabase (PostgreSQL)

1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Escolha uma região próxima (ex: `us-east-1`)
3. Defina uma senha forte para o banco
4. Aguarde a criação (~1 min)
5. Vá em **Project Settings → Database**
6. Copie a **Connection String** (modo `URI`):
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

---

## Passo 2 — Backend no Render

1. No [Render Dashboard](https://dashboard.render.com), clique em **New → Web Service**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `dextro-api` (ou outro nome)
   - **Runtime**: Docker
   - **Root Directory**: `backend`
   - O `Dockerfile` já está pronto no repo
4. Clique em **Advanced** e adicione as **Environment Variables**:

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | *Connection string do Supabase* |
   | `BOMCONTROLE_API_KEY` | *Sua chave da API BomControle* |
   | `JWT_SECRET` | *String aleatória forte (mín. 32 chars)* |
   | `JWT_ALGORITHM` | `HS256` |
   | `JWT_EXPIRE_MINUTES` | `480` |
   | `ADMIN_USERNAME` | `admin@dextro` |
   | `ADMIN_PASSWORD` | *Senha forte para o admin* |
   | `CORS_ORIGINS` | *URL do frontend no Vercel (ver Passo 4)* |
   | `CACHE_TTL_CONTAS` | `300` |
   | `CACHE_TTL_EMPRESAS` | `1800` |

5. Clique em **Create Web Service**
6. Aguarde o build e deploy (~5 min)
7. Anote a URL pública (ex: `https://dextro-api.onrender.com`)

> ⚠️ Plano gratuito: o container "dorme" após 15 min de inatividade. A primeira requisição após dormir pode demorar ~30s.

---

## Passo 3 — Frontend no Vercel

1. No [Vercel Dashboard](https://vercel.com), clique em **Add New → Project**
2. Importe seu repositório GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. Em **Environment Variables**, adicione:
   - `VITE_API_URL` = `https://sua-api.onrender.com` *(URL do Passo 2)*
5. Clique em **Deploy**
6. Aguarde o build (~2 min)
7. Anote a URL do frontend (ex: `https://dextro-dashboard.vercel.app`)

---

## Passo 4 — CORS (conectar frontend + backend)

1. Volte ao **Render Dashboard** → seu Web Service → **Environment**
2. Edite a variável `CORS_ORIGINS`:
   ```
   https://dextro-dashboard.vercel.app,https://dextro-dashboard-git-main-seuusuario.vercel.app
   ```
   > Adicione também a URL de preview do Vercel (aparece nos deploys de PR)
3. O Render fará **auto-deploy** com a nova configuração

---

## Passo 5 — Testar

1. Acesse o frontend: `https://seu-projeto.vercel.app`
2. Faça login com as credenciais de admin configuradas
3. Verifique:
   - [ ] Listar empresas
   - [ ] Buscar contas a pagar
   - [ ] KPIs (Total pago, Vencido, Agendado)
   - [ ] Botão "Atualizar"
   - [ ] Criar novo usuário (admin only)

---

## Variáveis de ambiente resumo

### Backend (Render)

```
DATABASE_URL=postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
BOMCONTROLE_API_KEY=sua-chave-bomcontrole
JWT_SECRET=segredo-muito-forte-com-32-caracteres-minimo
ADMIN_USERNAME=admin@dextro
ADMIN_PASSWORD=senha-forte-admin
CORS_ORIGINS=https://seu-frontend.vercel.app
```

### Frontend (Vercel)

```
VITE_API_URL=https://sua-api.onrender.com
```

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `401` no frontend | Token expirado / CORS bloqueado | Verificar `CORS_ORIGINS` no backend inclui URL do Vercel |
| `502` no backend | API BomControle indisponível | Verificar `BOMCONTROLE_API_KEY` |
| Erro de banco | SQLite em produção | Verificar `DATABASE_URL` aponta para Supabase |
| Container dormindo | 15min sem uso | Normal no plano gratuito; aguarde ~30s na primeira requisição |

---

## Atualizações futuras

A cada `git push` na branch `main`:
- **Frontend**: Deploy automático no Vercel
- **Backend**: Auto-deploy no Render (se habilitado)
