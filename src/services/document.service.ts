import { db } from '../db/client';
import { documents, summaries } from '../db/schema';
import { AppError } from '../utils/AppError';
import { extractTextFromBuffer } from '../utils/documentProcessor';
import { generateSummary } from './openai.service';
import { eq } from 'drizzle-orm';

export async function processDocument(
  filename: string,
  buffer: Buffer,
  contentType: string
) {
  try {
    // Extract text from document
    const extractedText = await extractTextFromBuffer(buffer, contentType);
    
    if (!extractedText.trim()) {
      throw new AppError('No text content found in document', 400);
    }

    // Store document in database
    const documentResult = await db
      .insert(documents)
      .values({
        filename,
        originalContent: extractedText,
        contentType,
        fileSize: buffer.length,
      })
      .returning({
        id: documents.id,
        filename: documents.filename,
        contentType: documents.contentType,
        fileSize: documents.fileSize,
        createdAt: documents.createdAt,
      });

    const document = documentResult[0];

    // Generate summary using OpenAI
    const summaryText = await generateSummary(extractedText);
    
    // Store summary in database
    const summaryResult = await db
      .insert(summaries)
      .values({
        documentId: document.id,
        summary: summaryText,
        wordCount: summaryText.split(' ').length,
      })
      .returning({
        id: summaries.id,
        summary: summaries.summary,
        wordCount: summaries.wordCount,
        createdAt: summaries.createdAt,
      });

    return {
      document,
      summary: summaryResult[0],
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getAllSummaries() {
  try {
    const result = await db
      .select({
        id: summaries.id,
        summary: summaries.summary,
        wordCount: summaries.wordCount,
        createdAt: summaries.createdAt,
        document: {
          id: documents.id,
          filename: documents.filename,
          contentType: documents.contentType,
          fileSize: documents.fileSize,
          createdAt: documents.createdAt,
        },
      })
      .from(summaries)
      .innerJoin(documents, eq(summaries.documentId, documents.id))
      .orderBy(summaries.createdAt);

    return result;
  } catch (error) {
    throw new AppError('Failed to fetch summaries');
  }
}

export async function getSummaryById(summaryId: string) {
  try {
    const result = await db
      .select({
        id: summaries.id,
        summary: summaries.summary,
        wordCount: summaries.wordCount,
        createdAt: summaries.createdAt,
        document: {
          id: documents.id,
          filename: documents.filename,
          contentType: documents.contentType,
          fileSize: documents.fileSize,
          originalContent: documents.originalContent,
          createdAt: documents.createdAt,
        },
      })
      .from(summaries)
      .innerJoin(documents, eq(summaries.documentId, documents.id))
      .where(eq(summaries.id, summaryId));

    if (result.length === 0) {
      throw new AppError('Summary not found', 404);
    }

    return result[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch summary');
  }
}