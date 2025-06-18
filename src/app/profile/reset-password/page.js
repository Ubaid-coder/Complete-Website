'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);

    const router = useRouter();


    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    // ✅ Send OTP handler
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email || !userName) {
            toast.error("❌ Enter username and email first");
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

    // ✅ Submit New Password handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!verificationCode || !newPassword) {
            toast.error("❌ Please enter OTP and new password");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, email, verificationCode, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("✅ Password updated successfully");
                setEmail('');
                setUserName('');
                setNewPassword('');
                setVerificationCode('');
                setOtpSent(false);
                router.push('/sign-in')
            } else {
                toast.error(data.error || "❌ Something went wrong");
            }
        } catch (err) {
            toast.error("❌ Server error while changing password");
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="max-w-md mx-auto p-4 bg-white/10 text-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">🔒 Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Enter User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-black/30 border border-gray-500"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-black/30 border border-gray-500"
                        required
                    />

                    <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || timer > 0}
                        className="cursor-pinter w-full py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {timer > 0 ? `⏳ Resend in ${timer}s` : '📤 Send OTP'}
                    </button>

                    {otpSent && (
                        <>
                            <input
                                type="number"
                                placeholder="Enter OTP sent to email"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full px-4 py-2 rounded bg-black/30 border border-gray-500"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded bg-black/30 border border-gray-500"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-green-500 rounded hover:bg-green-600 transition"
                            >
                                ✅ Verify & Change Password
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
