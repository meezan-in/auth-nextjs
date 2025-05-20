"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

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
      } catch (error: any) {
        setError(error?.response?.data?.error || "Verification failed");
        setVerified(false);
      }
    };

    if (token && userId) {
      verifyUserEmail();
    }
  }, [token, userId]);

  return (
    <div className="mt-4 flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      {token && (
        <h2 className="text-2xl bg-orange-500 text-black px-4 py-2 rounded mb-4 break-all">
          {token}
        </h2>
      )}
      {verified && (
        <div>
          <h2 className="text-2xl text-green-600">Email Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
