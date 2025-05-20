"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token") || "");
      setUserId(params.get("userId") || "");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post("/api/users/reset-password", {
        token,
        userId,
        password,
      });
      setMessage("✅ Password reset! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setMessage("❌ Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-center text-green-400 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-400 text-center mb-4">
          Enter your new password below.
        </p>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:border-green-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-green-900 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && (
          <div
            className={`text-center mt-2 ${
              message.startsWith("❌") ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </div>
        )}
      </form>
      <div className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
