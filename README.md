# Birrly — Telegram Mini App

A gamified rewards Telegram Mini App.

## Architecture

```
birrly/
├── backend/          # Fastify + TypeScript + Prisma + Neon Postgres
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   └── vip/
│   │   ├── plugins/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── package.json      # Root workspace
```

## Prerequisites

- A [Neon](https://neon.tech) Postgres database (free tier works)
- A Telegram bot (get token from [@BotFather](https://t.me/BotFather))

## Quick Deploy (no local setup)

### Option 1: Railway (Recommended)

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Select your repo — Railway auto-detects `railway.json`
4. Add environment variables in the Railway dashboard:
   - `DATABASE_URL` — your Neon pooled connection string
   - `DIRECT_URL` — your Neon direct connection string
   - `TELEGRAM_BOT_TOKEN` — from @BotFather
   - `SESSION_SECRET` — generate with `openssl rand -hex 32`
   - `FRONTEND_URL` — your Vercel frontend URL
   - `NODE_ENV` = `production`
5. Railway automatically runs migrations + seed on deploy

### Option 2: Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Select your repo — Render auto-detects `render.yaml`
4. Add the same environment variables
5. Render runs migrations + seed on deploy

### Option 3: Docker (any host)

```bash
cd backend
docker build -t birrly-backend .
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e DIRECT_URL="postgresql://..." \
  -e TELEGRAM_BOT_TOKEN="..." \
  -e SESSION_SECRET="..." \
  -e FRONTEND_URL="https://your-app.vercel.app" \
  -e NODE_ENV=production \
  birrly-backend
```

## Local Development

### 1. Create a Neon Postgres Database

1. Go to [neon.tech](https://neon.tech) and sign up / log in
2. Create a new project (e.g., `birrly`)
3. Copy the **connection string** from the dashboard

### 2. Clone and install

```bash
git clone <repo-url>
cd birrly
npm install
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@ep-cool-name-region.aws.neon.tech/birrly?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-cool-name-region.aws.neon.tech/birrly?sslmode=require"
TELEGRAM_BOT_TOKEN="your-bot-token"
SESSION_SECRET="your-secret"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
PORT="3001"
```

### 4. Run Prisma migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma seed
```

### 5. Start development servers

```bash
npm run dev
```

## Telegram Bot Setup

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token → put it in `backend/.env` as `TELEGRAM_BOT_TOKEN`
4. Send `/newapp` to BotFather to create a Mini App
5. Set the Mini App URL to your frontend URL (use ngrok for local dev)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/telegram` | Authenticate with Telegram init data |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/vip/plans` | Get all active VIP plans |
| GET | `/api/vip/current` | Get user's current VIP plan |
| GET | `/api/health` | Health check |

## Security

- Telegram init data verified server-side using HMAC-SHA256
- Bot token never exposed to frontend
- HTTP-only session cookies
- Rate limiting on auth endpoints
- Input validation with Zod
- CORS restricted to frontend URL
- Timing-safe hash comparison
- Neon Postgres with SSL required

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run build` | Build both packages |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:seed` | Seed VIP plans |
