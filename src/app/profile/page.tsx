"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<string>("Nothing");
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      await router.push("/login");
    } catch (error: any) {
      console.log(error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/me");
      console.log("API response:", res.data);

      // Safely extract user ID from the response
      const userId =
        res.data?.data?._id ||
        res.data?._id ||
        res.data?.data?.id ||
        "No ID found";

      setData(userId);
      if (userId !== "No ID found") {
        toast.success("User details fetched!");
      } else {
        toast.error("User ID not found in response.");
      }
    } catch (error: any) {
      console.log(error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || error.message);
      setData("Nothing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <h2 className="p-3 mt-3 rounded bg-green-700">
        {data === "Nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-purple-800 mt-4 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Get User Details"}
      </button>
    </div>
  );
}
