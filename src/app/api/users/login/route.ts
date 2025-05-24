import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("Login attempt:", reqBody);

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Optional: Check if user is verified
    // if (!user.isVerified) {
    //   return NextResponse.json(
    //     { error: "Please verify your email before logging in." },
    //     { status: 401 }
    //   );
    // }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("Password valid:", validPassword);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    // Create JWT token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // Prepare response and set cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      // secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Login error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
