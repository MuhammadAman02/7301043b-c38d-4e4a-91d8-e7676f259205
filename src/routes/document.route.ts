import { FastifyInstance } from 'fastify';
import { uploadDocumentHandler, getSummariesHandler, getSummaryByIdHandler } from '../controllers/document.controller';
import { getSummariesSchema, getSummaryByIdSchema } from '../schemas/document.schema';

export async function documentRoutes(app: FastifyInstance) {
  app.post('/api/documents/upload', {
    schema: {
      tags: ["Documents"],
      description: "Upload a document file (PDF, DOCX, or TXT) and generate an AI summary",
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Document file (PDF, DOCX, or TXT format, max 10MB)'
          }
        },
        required: ['file']
      },
      response: {
        201: {
          type: 'object',
          properties: {
            document: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                filename: { type: 'string' },
                contentType: { type: 'string' },
                fileSize: { type: 'number' },
                createdAt: { type: 'string' }
              }
            },
            summary: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                summary: { type: 'string' },
                wordCount: { type: 'number' },
                createdAt: { type: 'string' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
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