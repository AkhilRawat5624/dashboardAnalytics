import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { validateRequestBody, resetPasswordSchema, verifyResetTokenSchema } from '@/lib/validations';
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';
import bcrypt from 'bcrypt';

// Verify reset token
export async function GET(request: NextRequest) {
  // Apply rate limiting for token verification
  const rateLimitResult = await applyRateLimit(
    request,
    RATE_LIMITS.API_GENERAL,
    'rl:verify-token'
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error, valid: false },
      { 
        status: 429,
        headers: rateLimitResult.headers,
      }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    const validation = validateRequestBody({ token }, verifyResetTokenSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, valid: false },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token: validation.data.token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });

  } catch (error: any) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: 'Failed to verify reset token', valid: false },
      { status: 500 }
    );
  }
}

// Reset password
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(
      request,
      RATE_LIMITS.AUTH_PASSWORD_RESET,
      'rl:reset-password'
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
    const validation = validateRequestBody(body, resetPasswordSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    await dbConnect();

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    user.passwordHash = hashedPassword;
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    const response = NextResponse.json({
      message: 'Password has been reset successfully',
    });

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
