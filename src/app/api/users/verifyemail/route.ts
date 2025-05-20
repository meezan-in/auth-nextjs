import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const { token, userId } = await request.json();

    // Validate input
    if (!token || !userId) {
      return NextResponse.json(
        { error: "Missing token or user ID" },
        { status: 400 }
      );
    }

    // Find user with matching token and non-expired token
    const user = await User.findOne({
      _id: userId,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Mark user as verified and clear token fields
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully.",
      success: true,
    });
  } catch (error: unknown) {
    console.error("Email verification error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
