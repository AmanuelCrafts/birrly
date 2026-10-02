import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import type { FastifyInstance } from "fastify";
import { config } from "../config/index.js";

declare module "fastify" {
  interface Session {
    userId?: string;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCookie);

  await fastify.register(fastifySession, {
    secret: config.sessionSecret,
    cookieName: "birrly.sid",
    cookie: {
      secure: config.isProduction,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    },
    saveUninitialized: false,
  });
});
