import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { validateRequestBody, forgotPasswordSchema } from '@/lib/validations';
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(
      request,
      RATE_LIMITS.AUTH_PASSWORD_RESET,
      'rl:password-reset'
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
    
    // Validate request body
    const validation = validateRequestBody(body, forgotPasswordSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration
    // But only create token if user exists
    if (user) {
      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Create password reset record
      await PasswordReset.create({
        userId: user._id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        used: false,
      });

      // In production, send email here
      // For demo, we'll log the reset link
      const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
      console.log('Password Reset Link:', resetUrl);
      console.log('Token:', resetToken);

      // TODO: Send email with reset link
      // await sendPasswordResetEmail(user.email, resetUrl);
    }

    // Always return success message with rate limit headers
    const response = NextResponse.json({
      message: 'If an account exists with that email, a password reset link has been sent.',
    });

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
