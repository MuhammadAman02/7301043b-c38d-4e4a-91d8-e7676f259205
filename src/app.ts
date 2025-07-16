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
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: ["*"],
      },
    },
  });

  // Register multipart support for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
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
    
    reply.status(500).send({ error: "Internal Server Error" });
  });

  return app;
}