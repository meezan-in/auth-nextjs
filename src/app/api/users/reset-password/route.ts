/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  await connect();
  const { token, userId, password } = await request.json();

  if (!token || !userId || !password) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const user = await User.findOne({
    _id: userId,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user || !(await bcryptjs.compare(token, user.forgotPasswordToken))) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  user.password = await bcryptjs.hash(password, 10);
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Password reset successful" });
}
