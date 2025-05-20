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

    // Use environment variables for sensitive info
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "be0a1111a21ab1",
        pass: process.env.MAILTRAP_PASS || "cd76484dece72f",
      },
    });

    // Check for required environment variables
    if (!process.env.DOMAIN) {
      throw new Error("DOMAIN environment variable is not set.");
    }

    // Choose the correct URL path for each email type
    const actionPath = emailType === "VERIFY" ? "verifyemail" : "resetpassword";
    const verificationLink = `${process.env.DOMAIN}/${actionPath}?token=${hashedToken}&userId=${userId}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || "no-reply@yourapp.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>
          Click <a href="${verificationLink}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser.<br>
          ${verificationLink}
        </p>
      `,
    };

    // Send the email and log the result
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mailtrap response:", mailResponse);
    return mailResponse;
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
};
