import "fastify";
import "@fastify/session";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    config: {
      telegramBotToken: string;
      isProduction: boolean;
    };
  }

  interface Session {
    userId?: string;
  }
}
