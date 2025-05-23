"use client";
import Link from "next/link";
import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

// Define TypeScript interfaces
interface UserCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserCredentials>({ 
    email: "", 
    password: "" 
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Login failed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          {loading ? "Processing..." : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="font-medium text-gray-300">
            Email
          </label>
          <input
            className="p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
            id="email"
            type="email"
            autoComplete="email"
            value={user.email}
            onChange={handleInputChange}
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
            autoComplete="current-password"
            value={user.password}
            onChange={handleInputChange}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-between mt-6">
          <Link
            href="/forgot-password"
            className="text-blue-400 hover:underline text-sm"
          >
            Forgot password?
          </Link>
          <Link
            href="/signup"
            className="text-blue-400 hover:underline text-sm"
          >
            Create account
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}