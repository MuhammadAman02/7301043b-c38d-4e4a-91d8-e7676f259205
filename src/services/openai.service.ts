import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function generateSummary(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise, informative summaries of documents. Focus on key points, main ideas, and important details.'
        },
        {
          role: 'user',
          content: `Please summarize the following document:\n\n${text}`
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || 'Summary could not be generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate summary using OpenAI');
  }
}