import type { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token =
      (request.cookies && (request.cookies as any)["access_token"]) ||
      (request.headers.authorization
        ? (request.headers.authorization as string).replace(/^Bearer\s+/i, "")
        : null);

    if (!token) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const fastify: any = request.server;
    const payload = fastify.jwt.verify(token);

    // attach to request for downstream handlers
    (request as any).user = payload;
  } catch (err) {
    return reply.code(401).send({
      error: "Unauthorized",
      details: err instanceof Error ? err.message : err,
    });
  }
}
