import NodeCache from 'node-cache';

// Rate limiter configuration
interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Maximum requests per window
  message?: string;  // Custom error message
}

// Rate limit presets
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  AUTH_LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  AUTH_SIGNUP: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 signups per hour per IP
    message: 'Too many signup attempts. Please try again later.',
  },
  AUTH_PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 reset requests per hour
    message: 'Too many password reset requests. Please try again in 1 hour.',
  },
  
  // API endpoints - moderate limits
  API_GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  API_EXPORT: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 exports per minute
    message: 'Too many export requests. Please wait before exporting again.',
  },
  
  // Admin endpoints - relaxed limits
  API_ADMIN: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Rate limit exceeded.',
  },
} as const;

// In-memory cache for rate limiting
// In production, use Redis for distributed rate limiting
const cache = new NodeCache({
  stdTTL: 900, // 15 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false,
});

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private prefix: string;

  constructor(config: RateLimitConfig, prefix: string = 'rl') {
    this.config = config;
    this.prefix = prefix;
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @returns Object with allowed status and remaining requests
   */
  async check(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  }> {
    const key = `${this.prefix}:${identifier}`;
    const now = Date.now();
    
    // Get current rate limit entry
    let entry = cache.get<RateLimitEntry>(key);
    
    if (!entry) {
      // First request in window
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      cache.set(key, entry, this.config.windowMs / 1000);
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: entry.resetTime,
      };
    }
    
    // Check if window has expired
    if (now > entry.resetTime) {
      // Reset window
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      cache.set(key, entry, this.config.windowMs / 1000);
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: entry.resetTime,
      };
    }
    
    // Increment count
    entry.count++;
    cache.set(key, entry, Math.ceil((entry.resetTime - now) / 1000));
    
    // Check if limit exceeded
    if (entry.count > this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        message: this.config.message || 'Rate limit exceeded',
      };
    }
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for identifier
   * @param identifier - Unique identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = `${this.prefix}:${identifier}`;
    cache.del(key);
  }

  /**
   * Get current rate limit status
   * @param identifier - Unique identifier
   */
  async getStatus(identifier: string): Promise<{
    count: number;
    remaining: number;
    resetTime: number;
  } | null> {
    const key = `${this.prefix}:${identifier}`;
    const entry = cache.get<RateLimitEntry>(key);
    
    if (!entry) {
      return null;
    }
    
    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: {
  remaining: number;
  resetTime: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
  };
}

/**
 * Helper function to apply rate limiting to API routes
 */
export async function applyRateLimit(
  request: Request,
  config: RateLimitConfig,
  prefix: string,
  userId?: string
): Promise<{
  success: boolean;
  headers: Record<string, string>;
  error?: string;
}> {
  const limiter = new RateLimiter(config, prefix);
  const identifier = getClientIdentifier(request, userId);
  const result = await limiter.check(identifier);
  
  const headers = createRateLimitHeaders(result);
  
  if (!result.allowed) {
    return {
      success: false,
      headers,
      error: result.message || 'Rate limit exceeded',
    };
  }
  
  return {
    success: true,
    headers,
  };
}
