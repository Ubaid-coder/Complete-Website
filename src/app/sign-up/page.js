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
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [userName, setuserName] = useState('')
  const [email, setEmail] = useState('')
  const [justRegistered, setJustRegistered] = useState(false);
  const [timer, setTimer] = useState(0);


  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    }
  }, [status, router]);



  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode || !password) {
      toast.error("❌ Please enter OTP and password");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, email, password, verificationCode }),
    });
    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setJustRegistered(true);

      setEmail('');
      setuserName('');
      setPassword('');
      setVerificationCode('');
      setOtpSent(false);
      router.push('/sign-in')

      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !userName) {
      toast.error("❌ Enter userName and email first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userName }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("📧 OTP sent to your email");
        setOtpSent(true);
        setTimer(60); // 🔁 Start timer for 60 seconds
      } else {
        toast.error(data.error || "❌ Failed to send OTP");
      }
    } catch (err) {
      toast.error("❌ Server error while sending OTP");
    }
    setLoading(false);
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
            value={userName}
            placeholder="Enter Your Name"
            onChange={(e) => setuserName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />


          <button
            type="button"
            disabled={loading || timer > 0}
            onClick={handleSendOtp}
            className="cursor-pinter w-full py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {timer > 0 ? `⏳ Resend in ${timer}s` : '📤 Send OTP'}
          </button>


          {otpSent && (

            <>
              <input
                value={verificationCode}
                type="number"
                placeholder="Enter a Verification code that we have sent on your email"
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                value={password}
                type="text"
                placeholder="Enter a Strong Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-green-500 rounded hover:bg-green-600 transition"
              >
                ✅ Submit
              </button>
            </>
          )
          }


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
