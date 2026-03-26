export interface VisionAdapter {
  describe(base64: string, mimeType: string): Promise<string>;
}

export function getAdapter(model: string, apiKey: string): VisionAdapter {
  if (model === 'gpt-4o') {
    const { OpenAIAdapter } = require('./OpenAIAdapter');
    return new OpenAIAdapter(apiKey);
  } else {
    const { GeminiAdapter } = require('./GeminiAdapter');
    return new GeminiAdapter(apiKey);
  }
}