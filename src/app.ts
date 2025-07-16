import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import root from "./routes/root";
import { documentRoutes } from "./routes/document.route";

export async function createApp() {
  const app = Fastify({
    logger: true,
  });
  
  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Document Summarization API",
        description: "API for uploading documents and generating AI-powered summaries",
        version: "1.0.0",
      },
      consumes: ['multipart/form-data'],
      produces: ['application/json'],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: false,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
    
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        frameAncestors: ["*"],
        connectSrc: ["'self'"],
      },
    },
  });

  // Register multipart support for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      files: 1, // Only allow 1 file at a time
    },
  });

  // Register routes
  app.register(root, { prefix: "/" });
  app.register(documentRoutes);

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation failed",
        details: error.validation,
      });
    }
    
    if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
      return reply.status(413).send({
        error: "File too large. Maximum size is 10MB."
      });
    }
    
    reply.status(500).send({ error: "Internal Server Error" });
  });

  return app;
}