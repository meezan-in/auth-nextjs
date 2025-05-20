"use client";

import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token") || "");
      setUserId(params.get("userId") || "");
    }
  }, []);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        await axios.post("/api/users/verifyemail", { token, userId });
        setVerified(true);
        setError("");
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        if (axiosError.response?.data?.error) {
          setError(axiosError.response.data.error);
        } else if (axiosError.message) {
          setError(axiosError.message);
        } else {
          setError("Verification failed");
        }
        setVerified(false);
      }
    };

    if (token && userId) {
      verifyUserEmail();
    }
  }, [token, userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Verify Email</h1>
        {token && (
          <div className="text-xs text-gray-400 mb-4 break-all text-center">
            Token:{" "}
            <span className="bg-orange-500 text-black px-2 py-1 rounded">
              {token}
            </span>
          </div>
        )}
        {verified && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <h2 className="text-2xl text-green-400 font-semibold">
              Email Verified!
            </h2>
            <Link
              href="/login"
              className="text-blue-400 underline text-lg hover:text-blue-500"
            >
              Go to Login
            </Link>
          </div>
        )}
        {error && <div className="text-red-400 text-center mt-4">{error}</div>}
        {!verified && !error && (
          <div className="text-gray-400 text-center mt-4">Verifying...</div>
        )}
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
