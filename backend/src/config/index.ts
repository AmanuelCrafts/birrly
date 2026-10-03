const requiredEnvVars = [
  "DATABASE_URL",
  "TELEGRAM_BOT_TOKEN",
  "SESSION_SECRET",
] as const;

type EnvVar = (typeof requiredEnvVars)[number];

function getEnvVar(name: EnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const config = {
  nodeEnv: getOptionalEnvVar("NODE_ENV", "development"),
  port: Number(getOptionalEnvVar("PORT", "3001")),
  databaseUrl: getEnvVar("DATABASE_URL"),
  directUrl: process.env.DIRECT_URL || getEnvVar("DATABASE_URL"),
  telegramBotToken: getEnvVar("TELEGRAM_BOT_TOKEN"),
  sessionSecret: getEnvVar("SESSION_SECRET"),
  frontendUrl: getOptionalEnvVar("FRONTEND_URL", "http://localhost:5173"),
  isProduction: getOptionalEnvVar("NODE_ENV", "development") === "production",
} as const;
