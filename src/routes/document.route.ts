import { FastifyInstance } from 'fastify';
import { uploadDocumentHandler, getSummariesHandler, getSummaryByIdHandler } from '../controllers/document.controller';
import { processDocumentSchema, getSummariesSchema, getSummaryByIdSchema } from '../schemas/document.schema';

export async function documentRoutes(app: FastifyInstance) {
  app.post('/api/documents/upload', {
    schema: processDocumentSchema,
    handler: uploadDocumentHandler,
  });

  app.get('/api/summaries', {
    schema: getSummariesSchema,
    handler: getSummariesHandler,
  });

  app.get('/api/summaries/:id', {
    schema: getSummaryByIdSchema,
    handler: getSummaryByIdHandler,
  });
}