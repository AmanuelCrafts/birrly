import type { FastifyInstance } from "fastify";
import type { VipPlanResponse } from "./vip.types.js";

export class VipService {
  constructor(private readonly fastify: FastifyInstance) {}

  /**
   * Returns all active VIP plans ordered by level.
   */
  async getAllPlans(): Promise<VipPlanResponse[]> {
    const plans = await this.fastify.prisma.vIPPlan.findMany({
      where: { isActive: true },
      orderBy: { level: "asc" },
    });

    return plans.map((plan) => this.toResponse(plan));
  }

  /**
   * Returns the authenticated user's current VIP plan, or null.
   */
  async getCurrentVip(userId: string): Promise<VipPlanResponse | null> {
    const user = await this.fastify.prisma.user.findUnique({
      where: { id: userId },
      include: { currentVipPlan: true },
    });

    if (!user?.currentVipPlan) {
      return null;
    }

    return this.toResponse(user.currentVipPlan);
  }

  /**
   * Serializes a Prisma VIPPlan into the API response shape.
   */
  private toResponse(plan: {
    level: number;
    name: string;
    depositAmount: { toString(): string };
    dailyIncome: { toString(): string };
    dailyTasksRequired: number;
  }): VipPlanResponse {
    return {
      level: plan.level,
      name: plan.name,
      depositAmount: plan.depositAmount.toString(),
      dailyIncome: plan.dailyIncome.toString(),
      dailyTasksRequired: plan.dailyTasksRequired,
    };
  }
}
