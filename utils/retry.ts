function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.status === 429 || err.status === 503) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}