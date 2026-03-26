import OpenAI from 'openai';
import { VisionAdapter } from './VisionAdapter';
import { withRetry } from '../utils/retry';

export class OpenAIAdapter implements VisionAdapter {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async describe(base64: string, mimeType: string): Promise<string> {
    return withRetry(async () => {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`
                }
              },
              {
                type: 'text',
                text: 'Describe this image in one concise sentence suitable for alt text.'
              }
            ]
          }
        ]
      });
      return response.choices[0].message.content?.trim() ?? '';
    });
  }
}