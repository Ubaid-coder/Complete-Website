'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter()

    const [message, setMessage] = useState('Verifying your email... ⏳');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`/api/verify-email?token=${token}`);


                if (res.ok) {
                    setMessage('✅ Email verified successfully! You can now log in.');
                    setTimeout(() => {
                        router.push('/sign-in')
                    }, 2000);
                } else {
                    setMessage(`❌ Verification failed:`);
                }
            } catch (err) {
                console.log('Error ha bhai', err)
                setMessage('❌ Something went wrong.');
            }
        };

        if (token) verify();
    }, [token,router]);

    if (token) {

        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-semibold text-purple-600 mb-4">Email Verification</h1>
                    <p className="text-lg text-zinc-700 dark:text-zinc-300">{message}</p>
                </div>
            </div>
        );
    }
}
