import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/", async function (request, reply) {
    return { 
      message: "Welcome to the Document Summarization API!",
      docs: "Visit /docs for API documentation",
      server: "https://7301043b-c38d-4e4a-91d8-e7676f259205-app.joylo.dev"
    };
  });

  fastify.get("/health", async function (request, reply) {
    return { 
      status: "OK", 
      message: "Server is running",
      timestamp: new Date().toISOString(),
      server: "https://7301043b-c38d-4e4a-91d8-e7676f259205-app.joylo.dev"
    };
  });
};

export default root;