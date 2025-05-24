// /app/api/users/register/route.ts

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  console.log("🔁 Register endpoint hit");

  try {
    await connect();

    const reqBody = await request.json();
    console.log("📩 Received body:", reqBody);

    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await newUser.save();
    console.log("✅ User saved to DB:", savedUser);

    try {
      await sendEmail({
        email,
        emailType: "VERIFY",
        userId: savedUser._id.toString(),
      });
      console.log("📨 Verification email sent");
    } catch (emailErr) {
      console.error("❌ Failed to send verification email:", emailErr);
      return NextResponse.json(
        { error: "User saved, but failed to send verification email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User created successfully. Please verify your email.",
      success: true,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
