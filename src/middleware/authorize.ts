import type { FastifyReply, FastifyRequest } from "fastify";

export function authorize(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user || !user.role) {
      return reply.code(403).send({ error: "Forbidden" });
    }
    if (!allowedRoles.includes(user.role)) {
      return reply.code(403).send({ error: "Forbidden" });
    }
  };
}
