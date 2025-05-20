"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserResponse {
  data: {
    _id?: string;
    id?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<string>("Nothing");
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get<UserResponse>("/api/users/me");
      const userId = res.data?.data?._id || res.data?.data?.id || "No ID found";
      setData(userId);
      if (userId !== "No ID found") {
        toast.success("User details fetched!");
      } else {
        toast.error("User ID not found in response.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-lg p-10 border border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Profile</h1>
        <p className="text-gray-300 mb-6">Welcome to your profile page!</p>
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-gray-400 text-sm">User ID</span>
          <span className="px-4 py-2 rounded-lg bg-green-600 text-white font-mono text-base break-all shadow">
            {data === "Nothing" ? (
              "Nothing"
            ) : (
              <Link href={`/profile/${data}`} className="hover:underline">
                {data}
              </Link>
            )}
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
          <button
            onClick={getUserDetails}
            className={`flex-1 bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get User Details"}
          </button>
          <button
            onClick={logout}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
