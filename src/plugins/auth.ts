import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { config } from "../config/env.js";

export default fp(async function (fastify, opts) {
  fastify.register(fastifyCookie);

  fastify.register(fastifyJwt, {
    secret: config.jwtSecret,
    sign: { expiresIn: "15m" },
  });
});