/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();

  try {
    // Ensure the request body is parsed and has correct shape
    const body: { token?: string; userId?: string } = await request.json();
    const { token, userId } = body;

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
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
