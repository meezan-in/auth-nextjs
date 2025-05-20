import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// Define TypeScript interfaces for request/response shapes
interface VerificationRequest {
  token: string;
  userId: string;
}

interface SuccessResponse {
  message: string;
  success: boolean;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: NextRequest) {
  await connect();

  try {
    // Parse and validate request body with proper typing
    const body: Partial<VerificationRequest> = await request.json();
    const { token, userId } = body;

    // Input validation
    if (!token || !userId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Missing token or user ID" },
        { status: 400 }
      );
    }

    // Find user with matching token
    const user = await User.findOne({
      _id: userId,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json<SuccessResponse>({
      message: "Email verified successfully",
      success: true,
    });

  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unknown error occurred";
    
    return NextResponse.json<ErrorResponse>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}