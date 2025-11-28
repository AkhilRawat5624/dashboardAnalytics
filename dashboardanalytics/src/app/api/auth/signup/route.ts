import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbconnect from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, username, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Check if this is the first user (make them admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      username,
      passwordHash,
      role: isFirstUser ? "admin" : "viewer", // First user is admin, others are viewers
      recoveryEmail: email,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
