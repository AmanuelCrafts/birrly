import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";

export default async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController(fastify);

  fastify.post(
    "/api/auth/telegram",
    {
      schema: {
        body: {
          type: "object",
          required: ["initData"],
          properties: {
            initData: { type: "string", minLength: 1 },
          },
        },
      },
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
    },
    controller.telegramAuth.bind(controller)
  );

  fastify.get(
    "/api/auth/me",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getCurrentUser.bind(controller)
  );

  fastify.post(
    "/api/auth/logout",
    {
      preHandler: [fastify.authenticate],
    },
    controller.logout.bind(controller)
  );
}
