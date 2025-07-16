import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/", async function (request, reply) {
    return { message: "Welcome to the Document Summarization API!" };
  });

  fastify.get("/health", async function (request, reply) {
    return { 
      status: "OK", 
      message: "Server is running",
      timestamp: new Date().toISOString()
    };
  });
};

export default root;