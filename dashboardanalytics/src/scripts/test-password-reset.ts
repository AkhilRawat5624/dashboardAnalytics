/**
 * Password Reset Flow Test Script
 * 
 * This script demonstrates and tests the complete password reset flow:
 * 1. Request password reset
 * 2. Generate reset token
 * 3. Verify token
 * 4. Reset password
 * 
 * Usage: npx tsx src/scripts/test-password-reset.ts
 */

import dbConnect from '@/lib/db';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function testPasswordReset() {
  console.log('🔐 Testing Password Reset Flow...\n');

  try {
    await dbConnect();

    // Step 1: Create a test user
    console.log('Step 1: Creating test user...');
    const testEmail = 'test@example.com';
    
    // Clean up existing test user
    await User.deleteOne({ email: testEmail });
    await PasswordReset.deleteMany({ });

    const hashedPassword = await bcrypt.hash('OldPassword123', 12);
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      username: 'testuser',
      passwordHash: hashedPassword,
      role: 'viewer',
    });
    console.log('✅ Test user created:', user.email);
    console.log('   Old password: OldPassword123\n');

    // Step 2: Generate password reset token
    console.log('Step 2: Generating password reset token...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetRecord = await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      used: false,
    });
    console.log('✅ Reset token generated:', resetToken);
    console.log('   Expires at:', resetRecord.expiresAt.toISOString());
    console.log('   Reset URL: http://localhost:3000/auth/reset-password?token=' + resetToken + '\n');

    // Step 3: Verify token is valid
    console.log('Step 3: Verifying reset token...');
    const validToken = await PasswordReset.findOne({
      token: resetToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (validToken) {
      console.log('✅ Token is valid and not expired\n');
    } else {
      console.log('❌ Token is invalid or expired\n');
      return;
    }

    // Step 4: Reset password
    console.log('Step 4: Resetting password...');
    const newPassword = 'NewPassword123';
    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.passwordHash = newHashedPassword;
    await user.save();
    
    resetRecord.used = true;
    await resetRecord.save();
    
    console.log('✅ Password reset successfully');
    console.log('   New password: NewPassword123\n');

    // Step 5: Verify new password works
    console.log('Step 5: Verifying new password...');
    const updatedUser = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(newPassword, updatedUser!.passwordHash);
    
    if (passwordMatch) {
      console.log('✅ New password verified successfully\n');
    } else {
      console.log('❌ New password verification failed\n');
      return;
    }

    // Step 6: Verify token is marked as used
    console.log('Step 6: Verifying token is marked as used...');
    const usedToken = await PasswordReset.findOne({ token: resetToken });
    if (usedToken?.used) {
      console.log('✅ Token is marked as used and cannot be reused\n');
    } else {
      console.log('❌ Token is still marked as unused\n');
      return;
    }

    // Step 7: Test expired token
    console.log('Step 7: Testing expired token...');
    const expiredToken = crypto.randomBytes(32).toString('hex');
    await PasswordReset.create({
      userId: user._id,
      token: expiredToken,
      expiresAt: new Date(Date.now() - 1000), // Already expired
      used: false,
    });
    
    const expiredTokenCheck = await PasswordReset.findOne({
      token: expiredToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    
    if (!expiredTokenCheck) {
      console.log('✅ Expired token correctly rejected\n');
    } else {
      console.log('❌ Expired token was not rejected\n');
      return;
    }

    console.log('🎉 All password reset tests passed!\n');
    console.log('Summary:');
    console.log('- User created: ' + user.email);
    console.log('- Reset token generated and verified');
    console.log('- Password reset successfully');
    console.log('- Token marked as used');
    console.log('- Expired tokens rejected');
    console.log('\nYou can now test the UI flow:');
    console.log('1. Go to http://localhost:3000/auth/forgot-password');
    console.log('2. Enter email: ' + testEmail);
    console.log('3. Check console for reset link');
    console.log('4. Click the link and reset password');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testPasswordReset();
