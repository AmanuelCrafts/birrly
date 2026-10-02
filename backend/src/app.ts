import Fastify, { type FastifyInstance } from "fastify";
import corsPlugin from "./plugins/cors.js";
import prismaPlugin from "./plugins/prisma.js";
import sessionPlugin from "./plugins/session.js";
import rateLimitPlugin from "./plugins/rateLimit.js";
import authRoutes from "./modules/auth/auth.routes.js";
import vipRoutes from "./modules/vip/vip.routes.js";
import { AppError } from "./utils/errors.js";
import { config } from "./config/index.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.isProduction
      ? true
      : {
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        },
  });

  // Register plugins
  await app.register(corsPlugin);
  await app.register(prismaPlugin);
  await app.register(sessionPlugin);
  await app.register(rateLimitPlugin);

  // Authentication decorator
  app.decorate("authenticate", async (request, reply) => {
    if (!request.session.userId) {
      return reply.status(401).send({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    }
  });

  // Error handler
  app.setErrorHandler((error: unknown, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    if (error && typeof error === "object" && "validation" in error) {
      const validationError = error as { validation: unknown; message: string };
      return reply.status(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validationError.message,
        },
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An internal error occurred",
      },
    });
  });

  // Health check
  app.get("/api/health", async () => {
    return { success: true, data: { status: "ok" } };
  });

  // Register routes
  await app.register(authRoutes);
  await app.register(vipRoutes);

  return app;
}
