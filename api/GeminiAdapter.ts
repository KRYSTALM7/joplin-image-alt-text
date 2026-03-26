import { GoogleGenerativeAI } from '@google/generative-ai';
import { VisionAdapter } from './VisionAdapter';
import { withRetry } from '../utils/retry';

export class GeminiAdapter implements VisionAdapter {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async describe(base64: string, mimeType: string): Promise<string> {
    return withRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
      });
      const result = await model.generateContent([
        {
          inlineData: { data: base64, mimeType }
        },
        'Describe this image in one concise sentence suitable for alt text.'
      ]);
      return result.response.text().trim();
    });
  }
}