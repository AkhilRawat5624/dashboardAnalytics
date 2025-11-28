import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbconnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbconnect();

    const user = await User.findById(session.user.id).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        mfaEnabled: user.mfaEnabled,
        recoveryEmail: user.recoveryEmail,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbconnect();

    const body = await req.json();

    // Validate input
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email } = validation.data;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: session.user.id },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
