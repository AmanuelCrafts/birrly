import type { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

/**
 * Authentication middleware.
 * Attaches an `authenticate` hook to the Fastify instance.
 */
export function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  if (!request.session.userId) {
    reply.status(401).send({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }
  done();
}
