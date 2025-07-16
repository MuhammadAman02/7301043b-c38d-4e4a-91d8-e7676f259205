import { FastifyRequest, FastifyReply } from 'fastify';
import { processDocument, getAllSummaries, getSummaryById } from '../services/document.service';
import { AppError } from '../utils/AppError';

export async function uploadDocumentHandler(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    console.log('Upload request received');
    
    const data = await req.file();
    
    if (!data) {
      console.log('No file in request');
      throw new AppError('No file uploaded. Please select a file.', 400);
    }

    console.log(`File received: ${data.filename}, type: ${data.mimetype}`);

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(data.mimetype)) {
      console.log(`Unsupported file type: ${data.mimetype}`);
      throw new AppError(
        `Unsupported file type: ${data.mimetype}. Supported types: PDF, DOCX, TXT`,
        400
      );
    }

    const buffer = await data.buffer();
    
    if (buffer.length === 0) {
      console.log('Empty file uploaded');
      throw new AppError('Uploaded file is empty', 400);
    }

    console.log(`Processing file: ${data.filename}, size: ${buffer.length} bytes`);
    
    const result = await processDocument(data.filename, buffer, data.mimetype);
    
    console.log('Document processed successfully');
    res.status(201).send(result);
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getSummariesHandler(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const summaries = await getAllSummaries();
    res.status(200).send(summaries);
  } catch (error) {
    console.error('Get summaries error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getSummaryByIdHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const summary = await getSummaryById(req.params.id);
    res.status(200).send(summary);
  } catch (error) {
    console.error('Get summary by ID error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}