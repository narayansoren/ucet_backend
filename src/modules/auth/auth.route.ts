import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export default async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController(fastify);

  fastify.post("/api/auth/register", controller.register);
  fastify.post("/api/auth/login", controller.login);
  fastify.post(
    "/api/auth/logout",
    { preHandler: authenticate },
    controller.logout,
  );
  fastify.post("/api/auth/refresh", controller.refresh);
}
