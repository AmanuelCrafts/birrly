# Birrly — Telegram Mini App

A gamified rewards Telegram Mini App. Phase 1: Authentication + User System.

## Architecture

```
birrly/
├── backend/          # Fastify + TypeScript + Prisma + PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/auth/
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

- Node.js 20+
- PostgreSQL 14+
- A Telegram bot (get token from [@BotFather](https://t.me/BotFather))

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd birrly
npm install
```

### 2. Set up PostgreSQL

```bash
# Create database
createdb birrly
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/birrly?schema=public"
TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
SESSION_SECRET="generate-with-openssl-rand-hex-32"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
PORT="3001"
```

### 4. Run Prisma migrations

```bash
npm run db:migrate
```

This creates the `users` table with proper indexes and constraints.

### 5. Start development servers

```bash
npm run dev
```

This starts both:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173

## Telegram Bot Setup

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token and put it in `backend/.env` as `TELEGRAM_BOT_TOKEN`
4. Send `/newapp` to BotFather to create a Mini App
5. Set the Mini App URL to your frontend URL (use ngrok for local dev)

### Local development with ngrok

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Expose your frontend
ngrok http 5173

# Use the https URL as your Mini App URL in BotFather
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/telegram` | Authenticate with Telegram init data |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/health` | Health check |

## Authentication Flow

```
Telegram → Open Mini App → WebApp SDK init → Send initData to backend
→ Backend verifies HMAC → Find/create user → Create session cookie
→ Return user → Frontend loads Home page
```

## Security

- Telegram init data verified server-side using HMAC-SHA256
- Bot token never exposed to frontend
- HTTP-only session cookies
- Rate limiting on auth endpoints
- Input validation with Zod
- CORS restricted to frontend URL
- Timing-safe hash comparison

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run build` | Build both packages |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |
