import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    // Check all required environment variables
    const requiredEnv = [
      "MAILTRAP_HOST",
      "MAILTRAP_PORT",
      "MAILTRAP_USER",
      "MAILTRAP_PASS",
      "FROM_EMAIL",
      "DOMAIN",
    ];
    for (const envVar of requiredEnv) {
      if (!process.env[envVar]) {
        console.error(`Environment variable ${envVar} is not set.`);
        throw new Error(`Server misconfiguration: ${envVar} not set.`);
      }
    }

    // Create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update user with the appropriate token and expiry
    let updateResult;
    if (emailType === "VERIFY") {
      updateResult = await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour
        },
        { new: true }
      );
    } else if (emailType === "RESET") {
      updateResult = await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
        },
        { new: true }
      );
    }

    if (!updateResult) {
      console.error("User not found or update failed:", userId);
      throw new Error("User not found or update failed");
    }

    // Set up Nodemailer transporter with Mailtrap SMTP credentials
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Verify SMTP connection before sending mail
    try {
      await transport.verify();
      console.log("Mailtrap SMTP connection verified.");
    } catch (smtpError) {
      console.error("Mailtrap SMTP connection failed:", smtpError);
      throw new Error("SMTP connection failed.");
    }

    // Choose the correct URL path for each email type
    const actionPath = emailType === "VERIFY" ? "verifyemail" : "resetpassword";
    const verificationLink = `${process.env.DOMAIN}/${actionPath}?token=${hashedToken}&userId=${userId}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>
          Click <a href="${verificationLink}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.<br>
        </p>
      `,
    };

    // Send the email and log the result
    try {
      const mailResponse = await transport.sendMail(mailOptions);
      console.log("Mailtrap response:", mailResponse);
      return mailResponse;
    } catch (mailError) {
      console.error("Nodemailer sendMail error:", mailError);
      throw new Error("Failed to send email.");
    }
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    if (error && typeof error === "object" && "message" in error) {
      throw new Error((error as { message: string }).message);
    } else {
      throw new Error("Unknown mailer error");
    }
  }
};
