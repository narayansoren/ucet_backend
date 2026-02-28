import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service.js";
import { users, roles } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export class AuthController {
  svc: AuthService;
  fastify: any;

  constructor(fastify: any) {
    this.fastify = fastify;
    this.svc = new AuthService(fastify);
  }

  // POST /api/auth/register
  register = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    const { name, email, password } = body;
    if (!name || !email || !password)
      return reply.code(400).send({ error: "Missing fields" });

    const [roleRow] = await this.svc.db
      .select()
      .from(roles)
      .where(eq(roles.name, "student"))
      .limit(1);

    const role_id = roleRow?.id ?? 4;

    const existing = await this.svc.findUserByEmail(email);
    if (existing) return reply.code(409).send({ error: "Email already used" });

    const user = await this.svc.createUser({ name, email, password, role_id });
    reply
      .code(201)
      .send({ user: { id: user.id, email: user.email, name: user.name } });
  };

  // POST /api/auth/login
  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as any;
    if (!email || !password) return reply.code(400).send({ error: "Missing" });

    const user = await this.svc.findUserByEmail(email);
    if (!user) return reply.code(401).send({ error: "Invalid credentials" });

    const ok = await this.svc.verifyPassword(user.password_hash, password);
    if (!ok) return reply.code(401).send({ error: "Invalid credentials" });

    const [roleRow] = await this.svc.db
      .select()
      .from(roles)
      .where(eq(roles.id, user.role_id))
      .limit(1);

    const roleName =
      roleRow?.name ?? (user.role_id === 4 ? "student" : "unknown");

    const payloadSimple = {
      id: user.id,
      role: roleName,
      token_version: user.token_version,
    };

    const { accessToken, refreshToken } = this.svc.createTokens(payloadSimple);

    await this.svc.saveRefreshToken(user.id, refreshToken);

    reply.setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: this.fastifyConfigIsProd(),
    });

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: this.fastifyConfigIsProd(),
      maxAge: 60 * 15,
    });

    return reply.send({ ok: true });
  };

  fastifyConfigIsProd() {
    return this.fastify.config?.nodeEnv === "production";
  }

  // POST /api/auth/logout
  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user) return reply.code(200).send({ ok: true });

    await this.svc.revokeAllRefreshTokens(user.id);

    reply.clearCookie("access_token");
    reply.clearCookie("refresh_token");
    return reply.send({ ok: true });
  };

  // POST /api/auth/refresh
  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = (request.cookies as any)?.refresh_token;
    if (!refreshToken)
      return reply.code(401).send({ error: "No refresh token" });

    return reply
      .code(501)
      .send({ error: "Refresh endpoint not fully implemented in demo" });
  };
}
