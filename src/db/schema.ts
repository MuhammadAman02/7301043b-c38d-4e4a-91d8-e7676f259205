import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  originalContent: text('original_content').notNull(),
  contentType: text('content_type').notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const summaries = pgTable('summaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id).notNull(),
  summary: text('summary').notNull(),
  wordCount: integer('word_count').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});