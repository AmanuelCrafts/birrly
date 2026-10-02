import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";
import type { TelegramAuthBody } from "./auth.types.js";

export class AuthController {
  private readonly service: AuthService;

  constructor(fastify: import("fastify").FastifyInstance) {
    this.service = new AuthService(fastify);
  }

  /**
   * POST /api/auth/telegram
   * Verifies Telegram init data, creates/finds user, establishes session.
   */
  async telegramAuth(
    request: FastifyRequest<{ Body: TelegramAuthBody }>,
    reply: FastifyReply
  ) {
    const { initData } = request.body;

    const telegramUser = this.service.verifyTelegramAuth(initData);
    const user = await this.service.findOrCreateUser(telegramUser);

    if (user.status === "SUSPENDED") {
      return reply.status(403).send({
        success: false,
        error: {
          code: "ACCOUNT_SUSPENDED",
          message: "Your account has been suspended",
        },
      });
    }

    request.session.userId = user.id;

    return reply.send({
      success: true,
      data: { user },
    });
  }

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user with VIP info.
   */
  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.session.userId;

    if (!userId) {
      return reply.status(401).send({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        },
      });
    }

    const user = await this.service.getUserById(userId);

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "User not found",
        },
      });
    }

    return reply.send({
      success: true,
      data: { user },
    });
  }

  /**
   * POST /api/auth/logout
   * Destroys the current session.
   */
  async logout(request: FastifyRequest, reply: FastifyReply) {
    await request.session.destroy();

    return reply.send({
      success: true,
      data: { message: "Logged out successfully" },
    });
  }
}
