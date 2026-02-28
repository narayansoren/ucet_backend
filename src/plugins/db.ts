import fp from "fastify-plugin";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config/env.js";

export default fp(async function (fastify, opts) {
  const client = new Client({
    connectionString: config.databaseUrl,
  });
  await client.connect();

  const db = drizzle(client);

  (fastify as any).db = db;

  (fastify as any).pg = client;

  fastify.addHook("onClose", async (instance) => {
    await client.end();
  });
});