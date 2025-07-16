import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const DocumentZod = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  contentType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

const SummaryZod = z.object({
  id: z.string().uuid(),
  summary: z.string(),
  wordCount: z.number(),
  createdAt: z.string(),
});

const ProcessDocumentResponseZod = z.object({
  document: DocumentZod,
  summary: SummaryZod,
});

const GetSummariesResponseZod = z.array(
  z.object({
    id: z.string().uuid(),
    summary: z.string(),
    wordCount: z.number(),
    createdAt: z.string(),
    document: DocumentZod,
  })
);

const GetSummaryByIdResponseZod = z.object({
  id: z.string().uuid(),
  summary: z.string(),
  wordCount: z.number(),
  createdAt: z.string(),
  document: DocumentZod.extend({
    originalContent: z.string(),
  }),
});

export const processDocumentSchema = {
  tags: ["Documents"],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'Document file (PDF, DOCX, or TXT)'
      }
    },
    required: ['file']
  },
  response: {
    201: zodToJsonSchema(ProcessDocumentResponseZod),
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  },
};

export const getSummariesSchema = {
  tags: ["Documents"],
  response: {
    200: zodToJsonSchema(GetSummariesResponseZod),
  },
};

export const getSummaryByIdSchema = {
  tags: ["Documents"],
  params: zodToJsonSchema(z.object({
    id: z.string().uuid(),
  })),
  response: {
    200: zodToJsonSchema(GetSummaryByIdResponseZod),
  },
};