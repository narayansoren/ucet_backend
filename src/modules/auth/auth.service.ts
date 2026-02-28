import argon2 from "argon2";
import crypto from "crypto";
import { config } from "../../config/env.js";
import { users, refreshTokens } from "../../db/schema.js";
import type { FastifyInstance } from "fastify";
import { and, eq } from "drizzle-orm";

export class AuthService {
  fastify: FastifyInstance;
  db: any;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.db = (fastify as any).db;
  }

  async hashPassword(plain: string) {
    return argon2.hash(plain);
  }

  async verifyPassword(hash: string, plain: string) {
    return argon2.verify(hash, plain);
  }

  createTokens(payload: object) {
    const fastify: any = this.fastify;
    const accessToken = fastify.jwt.sign(payload, { expiresIn: "15m" });

    const refreshToken = crypto.randomBytes(64).toString("hex");
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string, expiresInDays = 7) {
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const tokenHash = await argon2.hash(refreshToken);
    await this.db.insert(refreshTokens).values({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      revoked: false,
    });
  }

  async revokeAllRefreshTokens(userId: number) {
    await this.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.user_id, userId));
  }

  async findUserByEmail(email: string) {
    const [u] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return u;
  }

  async createUser({ name, email, password, role_id }: { name: string; email: string; password: string; role_id: number }) {
    const password_hash = await this.hashPassword(password);
    const [created] = await this.db.insert(users).values({
      name,
      email,
      password_hash,
      role_id,
    }).returning();
    return created;
  }
}