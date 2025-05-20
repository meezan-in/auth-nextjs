"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      toast.success("Signup successful! Please check your email.");
      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || error.message || "Signup failed");
      } else if (error instanceof Error) {
        toast.error(error.message || "Signup failed");
      } else {
        toast.error("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !user.email || !user.password || !user.username
    );
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          {loading ? "Processing..." : "Sign Up"}
        </h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!buttonDisabled) onSignup();
          }}
          className="flex flex-col gap-4"
        >
          <label htmlFor="username" className="font-medium text-gray-300">
            Username
          </label>
          <input
            className="p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
            id="username"
            type="text"
            value={user.username}
            onChange={e => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="email" className="font-medium text-gray-300">
            Email
          </label>
          <input
            className="p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
            id="email"
            type="email"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password" className="font-medium text-gray-300">
            Password
          </label>
          <input
            className="p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
            id="password"
            type="password"
            value={user.password}
            onChange={e => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            required
          />

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full py-3 mt-4 rounded-lg font-semibold text-white transition ${
              buttonDisabled || loading
                ? "bg-blue-900 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex justify-center mt-6">
          <Link
            href="/login"
            className="text-blue-400 hover:underline text-sm"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
