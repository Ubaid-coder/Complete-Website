'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
    const [email, setemail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [userName, setuserName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName, email, newPassword }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("✅ Password updated successfully!");
            setTimeout(() => {
                router.push('/profile')
            }, 2000);
            setuserName("");
            setemail("");
            setNewPassword("");
            setLoading(false);
        } else {
            toast.error(data.error || "❌ Failed to update password");
            setLoading(false);
        }
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
                        onChange={(e) => setuserName(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-black/30 border border-gray-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Enter Your E-mail"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
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
                        disabled={loading}
                        type="submit"
                        className={`${loading ? 'opacity-[0.5] cursor-not-allowed w-full bg-white text-purple-800 font-bold py-2 rounded-lg transition hover:bg-opacity-90': 'cursor-pointer w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition'}`}
                            >
                            Change Password
                    </button>
            </form>

        </div>
        </div >
    );
}
