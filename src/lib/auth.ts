export function validateApiKey(apiKey: string | null): boolean {
    const validApiKey = process.env.API_KEY;
    
    if (!validApiKey) {
      console.warn('API_KEY not configured in environment variables');
      return false;
    }
    
    return apiKey === validApiKey;
  }
  
  export function extractApiKey(headers: Headers): string | null {
    return headers.get('x-api-key');
  }