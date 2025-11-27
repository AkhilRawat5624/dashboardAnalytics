import { NextResponse } from 'next/server';
import { checkRateLimit, sanitizeObject } from './sanitize';

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (req: Request) => Promise<NextResponse>,
  options: { maxRequests?: number; windowMs?: number } = {}
) {
  return async (req: Request) => {
    const { maxRequests = 100, windowMs = 60000 } = options;
    
    // Use IP address or a header as identifier
    const identifier = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'anonymous';
    
    const rateLimit = checkRateLimit(identifier, maxRequests, windowMs);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }
    
    const response = await handler(req);
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    
    return response;
  };
}

/**
 * Input sanitization middleware
 */
export function withSanitization(
  handler: (req: Request, sanitizedBody?: any) => Promise<NextResponse>
) {
  return async (req: Request) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      try {
        const body = await req.json();
        const sanitizedBody = sanitizeObject(body);
        return handler(req, sanitizedBody);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid JSON body' },
          { status: 400 }
        );
      }
    }
    
    return handler(req);
  };
}

/**
 * Error handling wrapper
 */
export function withErrorHandling(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Don't expose internal errors in production
      const message = process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An internal server error occurred';
      
      return NextResponse.json(
        { success: false, message },
        { status: 500 }
      );
    }
  };
}

/**
 * Combine multiple middleware
 */
export function withMiddleware(
  handler: (req: Request) => Promise<NextResponse>,
  options: {
    rateLimit?: { maxRequests?: number; windowMs?: number };
    sanitize?: boolean;
    errorHandling?: boolean;
  } = {}
) {
  let wrappedHandler = handler;
  
  if (options.errorHandling !== false) {
    wrappedHandler = withErrorHandling(wrappedHandler);
  }
  
  if (options.sanitize) {
    wrappedHandler = withSanitization(wrappedHandler);
  }
  
  if (options.rateLimit) {
    wrappedHandler = withRateLimit(wrappedHandler, options.rateLimit);
  }
  
  return wrappedHandler;
}
