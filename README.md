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

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database (free tier works)
- A Telegram bot (get token from [@BotFather](https://t.me/BotFather))

## Setup

### 1. Create a Neon Postgres Database

1. Go to [neon.tech](https://neon.tech) and sign up / log in
2. Create a new project (e.g., `birrly`)
3. Copy the **connection string** from the dashboard
4. You'll need two URLs:
   - **Pooled connection** (for the app) — uses the pooler endpoint
   - **Direct connection** (for migrations) — uses the direct endpoint

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
# Neon Postgres — pooled connection (for the app)
DATABASE_URL="postgresql://user:password@ep-cool-name-region.aws.neon.tech/birrly?sslmode=require"

# Neon Postgres — direct connection (for Prisma migrations)
DIRECT_URL="postgresql://user:password@ep-cool-name-region.aws.neon.tech/birrly?sslmode=require"

# Telegram bot token from @BotFather
TELEGRAM_BOT_TOKEN="your-bot-token"

# Generate with: openssl rand -hex 32
SESSION_SECRET="your-secret"

FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
PORT="3001"
```

### 4. Run Prisma migrations

```bash
cd backend
npx prisma migrate dev --name init
```

This creates the `users` and `vip_plans` tables in your Neon database.

### 5. Seed VIP plans

```bash
npx prisma seed
```

### 6. Start development servers

```bash
# From the project root
npm run dev
```

This starts both:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173

## Telegram Bot Setup

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token → put it in `backend/.env` as `TELEGRAM_BOT_TOKEN`
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
| GET | `/api/vip/plans` | Get all active VIP plans |
| GET | `/api/vip/current` | Get user's current VIP plan |
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
