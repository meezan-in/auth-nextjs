import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({
        message: "If this email exists, a reset link has been sent.",
      });
    }

    // Generate token
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = await bcryptjs.hash(resetToken, 10);

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Check required environment variables
    if (
      !process.env.DOMAIN ||
      !process.env.MAILTRAP_HOST ||
      !process.env.MAILTRAP_PORT ||
      !process.env.MAILTRAP_USER ||
      !process.env.MAILTRAP_PASS ||
      !process.env.FROM_EMAIL
    ) {
      console.error("One or more required environment variables are missing.");
      return NextResponse.json(
        { error: "Server misconfiguration." },
        { status: 500 }
      );
    }

    // Build reset link
    const resetLink = `${process.env.DOMAIN}/reset-password?token=${resetToken}&userId=${user._id}`;

    // Set up Nodemailer transporter with Mailtrap SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Verify transporter connection before sending
    try {
      await transporter.verify();
      console.log("Mailtrap SMTP connection verified.");
    } catch (smtpError) {
      console.error("Mailtrap SMTP connection failed:", smtpError);
      return NextResponse.json(
        { error: "SMTP connection failed." },
        { status: 500 }
      );
    }

    // Send the email
    try {
      const mailResult = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });
      console.log("Mailtrap response:", mailResult);
    } catch (mailError) {
      console.error("Nodemailer sendMail error:", mailError);
      return NextResponse.json(
        { error: "Failed to send reset email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (error: unknown) {
    console.error("Error sending reset link:", error);
    return NextResponse.json(
      { error: "Error sending reset link." },
      { status: 500 }
    );
  }
}
