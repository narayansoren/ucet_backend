import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    "/dashboard",
    {
      preHandler: [authenticate, authorize(["admin", "super_user"])],
    },
    async (request, reply) => {
      return {
        message: "Welcome Admin 👑",
        user: request.user,
      };
    },
  );
}
