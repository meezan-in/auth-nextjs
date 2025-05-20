import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer"; // Make sure this import is correct

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
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

    let savedUser;
    try {
      savedUser = await newUser.save();
      console.log("Saved user:", savedUser);
    } catch (err) {
      console.error("Save error:", err);
      return NextResponse.json(
        { error: "Failed to save user" },
        { status: 500 }
      );
    }

    // --- CALL SEND EMAIL HERE ---
    try {
      console.log(
        "About to call sendEmail with:",
        email,
        "VERIFY",
        savedUser._id
      );
      await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
      console.log("sendEmail finished");
    } catch (mailError) {
      console.error("sendEmail error:", mailError);
      // Optionally, delete the user if email fails
      // await User.findByIdAndDelete(savedUser._id);
      return NextResponse.json(
        { error: "Failed to send verification email" },
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
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
