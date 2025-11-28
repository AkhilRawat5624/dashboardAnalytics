/**
 * Example API route with rate limiting
 * 
 * This demonstrates how to apply rate limiting to any API endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';

export async function GET(request: NextRequest) {
  try {
    // Get user session (optional - for user-specific rate limiting)
    const session = await getServerSession(authOptions);
    
    // Apply rate limiting
    // Use session.user.id for user-specific limits, or undefined for IP-based limits
    const rateLimitResult = await applyRateLimit(
      request,
      RATE_LIMITS.API_GENERAL,
      'rl:example',
      session?.user?.id
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    // Your API logic here
    const data = {
      message: 'Success!',
      timestamp: new Date().toISOString(),
    };

    // Create response with rate limit headers
    const response = NextResponse.json(data);
    
    // Add rate limit headers to response
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Apply stricter rate limiting for POST requests
    const rateLimitResult = await applyRateLimit(
      request,
      {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 requests per minute
        message: 'Too many POST requests. Please slow down.',
      },
      'rl:example-post',
      session?.user?.id
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    const body = await request.json();

    // Your API logic here
    const data = {
      message: 'Data created successfully',
      data: body,
    };

    const response = NextResponse.json(data, { status: 201 });
    
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
