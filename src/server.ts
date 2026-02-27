import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/", async () => {
  return { message: "Server is running 🚀" };
});

const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    app.log.info("Server running");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
