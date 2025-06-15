'use client';

import { useState } from "react";

export default function ResetPasswordPage() {


    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-[#0e1f3a] flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-md w-full max-w-md border border-white/20"
            >
                <h2 className="text-2xl font-bold text-yellow-300 text-center mb-6">🔒 Reset Password</h2>

                <input
                    type="password"
                    required
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white border border-white/30 placeholder-white focus:outline-none"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg transition"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}
