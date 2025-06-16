"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import CheckingAuth from "../../components/Loaders/CheckingAuth";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [justlogin, setjustlogin] = useState(false)


  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: form?.email,
      password: form?.password,
    })

    setLoading(false);

    if (res?.ok) {
      setjustlogin(true)
      toast.success("Login successful!")
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  if (status === "loading" ||status === "authenticated" && !justlogin) {
    return (
       <CheckingAuth />
    )

  }

  // ✅ Show sign-in form if not logged in
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5f4b8b] via-[#826aed] to-[#b8c1ec] px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          <button
            disabled={loading}
            type="submit"
            className={`${loading ? 'opacity-[0.5] cursor-not-allowed w-full bg-white text-purple-800 font-bold py-2 rounded-lg transition hover:bg-opacity-90' : 'w-full bg-white text-purple-800 font-bold py-2 rounded-lg transition hover:bg-opacity-90'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <p className="text-white text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="underline text-white hover:text-yellow-200">
            Sign up
          </Link>
        </p>

        <p className="text-white text-sm text-center mt-6">
          Forgot your password?{" "}
          <Link href="/profile/reset-password" className="underline text-white hover:text-yellow-200">
            Reset it
          </Link>
        </p>
      </div>
    </div>
  );

}