import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';

/**
 * Rate limiting middleware for API routes
 * Apply this to protect your API endpoints
 */
export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  limitType: keyof typeof RATE_LIMITS = 'API_GENERAL'
): Promise<NextResponse> {
  const config = RATE_LIMITS[limitType];
  const prefix = `rl:${limitType.toLowerCase()}`;
  
  const result = await applyRateLimit(request, config, prefix);
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { 
        status: 429,
        headers: result.headers,
      }
    );
  }
  
  // Call the actual handler
  const response = await handler(request);
  
  // Add rate limit headers to response
  Object.entries(result.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}
