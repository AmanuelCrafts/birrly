import type { FastifyInstance } from "fastify";
import { verifyTelegramInitData, extractTelegramUserId } from "../../utils/telegram.js";
import { UnauthorizedError } from "../../utils/errors.js";
import type { TelegramUser, AuthenticatedUser, VipInfo } from "./auth.types.js";

export class AuthService {
  constructor(private readonly fastify: FastifyInstance) {}

  /**
   * Verifies Telegram init data and returns the verified user info.
   */
  verifyTelegramAuth(initData: string): TelegramUser {
    const verified = verifyTelegramInitData(
      initData,
      this.fastify.config.telegramBotToken
    );

    if (!verified) {
      throw new UnauthorizedError("Invalid Telegram authentication data");
    }

    const telegramId = extractTelegramUserId(verified);
    if (!telegramId) {
      throw new UnauthorizedError("Invalid Telegram user data");
    }

    return {
      id: telegramId,
      first_name: verified.first_name ?? "",
      last_name: verified.last_name,
      username: verified.username,
      photo_url: verified.photo_url,
      language_code: verified.language_code,
    };
  }

  /**
   * Finds or creates a user based on verified Telegram data.
   */
  async findOrCreateUser(telegramUser: TelegramUser): Promise<AuthenticatedUser> {
    const { prisma } = this.fastify;

    const existingUser = await prisma.user.findUnique({
      where: { telegramId: telegramUser.id },
      include: { currentVipPlan: true },
    });

    if (existingUser) {
      const updated = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name ?? null,
          username: telegramUser.username ?? null,
          avatarUrl: telegramUser.photo_url ?? null,
        },
        include: { currentVipPlan: true },
      });
      return this.toAuthenticatedUser(updated);
    }

    const created = await prisma.user.create({
      data: {
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name ?? null,
        username: telegramUser.username ?? null,
        avatarUrl: telegramUser.photo_url ?? null,
      },
      include: { currentVipPlan: true },
    });

    return this.toAuthenticatedUser(created);
  }

  /**
   * Gets the authenticated user with VIP info.
   */
  async getUserById(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id: userId },
      include: { currentVipPlan: true },
    });

    if (!user) return null;

    return this.toAuthenticatedUser(user);
  }

  /**
   * Serializes a Prisma user into the API response shape.
   */
  private toAuthenticatedUser(user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string;
    lastName: string | null;
    avatarUrl: string | null;
    status: "ACTIVE" | "SUSPENDED";
    createdAt: Date;
    currentVipPlan: {
      level: number;
      name: string;
      depositAmount: { toString(): string };
      dailyIncome: { toString(): string };
      dailyTasksRequired: number;
    } | null;
  }): AuthenticatedUser {
    const currentVip: VipInfo | null = user.currentVipPlan
      ? {
          level: user.currentVipPlan.level,
          name: user.currentVipPlan.name,
          depositAmount: user.currentVipPlan.depositAmount.toString(),
          dailyIncome: user.currentVipPlan.dailyIncome.toString(),
          dailyTasksRequired: user.currentVipPlan.dailyTasksRequired,
        }
      : null;

    return {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      currentVip,
    };
  }
}
