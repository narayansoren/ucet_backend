import Fastify from "fastify";
import { config } from "./config/env.js";

const app = Fastify({
  logger: true,
});

app.get("/", async () => {
  return { message: "UCET Backend Running 🚀" };
});

const start = async () => {
  try {
    await app.listen({
      port: config.port,
      host: "0.0.0.0",
    });

    app.log.info(`Server running on port ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
