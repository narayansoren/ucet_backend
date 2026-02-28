import Fastify from "fastify";
import { config } from "./config/env.js";
import dbPlugin from "./plugins/db.js";
import authPlugin from "./plugins/auth.js";
import authRoutes from "./modules/auth/auth.route.js";
import { adminRoutes } from "./modules/admin/admin.route.js";

const app = Fastify({ logger: true });

// register our plugins
await app.register(dbPlugin);
await app.register(authPlugin);

// register routes
await app.register(authRoutes);

// Protected routes
app.register(adminRoutes, { prefix: "/api/admin" });

// start
const start = async () => {
  try {
    await app.listen({
      port: config.port,
      host: "0.0.0.0",
    });
    app.log.info(`Server listening on ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
