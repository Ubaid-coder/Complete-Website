"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    }
  }, [status, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setJustRegistered(true);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  // Wait during session check
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f3460] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Checking authentication...
        </div>
      </div>
    );
  }

  // Already logged in
  if (status === "authenticated" && !justRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-pulse">
          <h2 className="text-white text-2xl font-semibold mb-4">🔐 Redirecting...</h2>
          <p className="text-sm text-gray-300 mb-6">
            You are already logged in, redirecting you to your dashboard.
          </p>
          <div className="w-16 h-16 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show sign-up form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5f4b8b] via-[#826aed] to-[#b8c1ec] px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Your Account 🚀</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <button
            disabled={loading}
            type="submit"
            className={`${loading
              ? "opacity-[0.5] cursor-not-allowed"
              : ""
              } w-full bg-white text-purple-800 font-bold py-2 rounded-lg transition hover:bg-opacity-90`}
          >
            {loading ? "Sending Email..." : "Send Verification Email"}
          </button>
        </form>

        <p className="text-white text-sm text-center mt-6">
         Already have an account?
          <Link href="/sign-in" className="underline text-white hover:text-yellow-200">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
