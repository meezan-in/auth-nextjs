import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) throw new Error("No token found in cookies");

    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as JwtPayload & { id?: string };

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.id) {
      throw new Error("Invalid or missing token payload");
    }

    return decodedToken.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
