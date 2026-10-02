import type { FastifyInstance } from "fastify";
import { VipController } from "./vip.controller.js";

export default async function vipRoutes(fastify: FastifyInstance) {
  const controller = new VipController(fastify);

  fastify.get(
    "/api/vip/plans",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getPlans.bind(controller)
  );

  fastify.get(
    "/api/vip/current",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getCurrentVip.bind(controller)
  );
}
