import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromBuffer(buffer: Buffer, contentType: string): Promise<string> {
  try {
    switch (contentType) {
      case 'application/pdf':
        const pdfData = await pdf(buffer);
        return pdfData.text;
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer });
        return docxResult.value;
      
      case 'text/plain':
        return buffer.toString('utf-8');
      
      default:
        throw new Error(`Unsupported file type: ${contentType}`);
    }
  } catch (error) {
    throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}