"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await axios.post("/api/users/forgot-password", { email });
      setMessage("If this email exists, a reset link has been sent.");
    } catch {
      setMessage("Error sending reset link.");
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
        <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-400 text-center mb-4">
          Enter your email to receive a password reset link.
        </p>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-blue-900 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && (
          <div
            className={`text-center mt-2 ${
              message.startsWith("Error") ? "text-red-400" : "text-green-400"
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
