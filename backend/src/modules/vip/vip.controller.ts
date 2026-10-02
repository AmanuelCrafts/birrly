import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { VipService } from "./vip.service.js";

export class VipController {
  private readonly service: VipService;

  constructor(_fastify: FastifyInstance) {
    this.service = new VipService(_fastify);
  }

  /**
   * GET /api/vip/plans
   * Returns all active VIP plans.
   */
  async getPlans(_request: FastifyRequest, reply: FastifyReply) {
    const plans = await this.service.getAllPlans();

    return reply.send({
      success: true,
      data: { plans },
    });
  }

  /**
   * GET /api/vip/current
   * Returns the authenticated user's current VIP plan.
   */
  async getCurrentVip(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.session.userId!;

    const plan = await this.service.getCurrentVip(userId);

    return reply.send({
      success: true,
      data: { plan },
    });
  }
}
