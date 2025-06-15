'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
      const data = await res.json();
      setIsPaid(data.success);
      setLoading(false);
    };

    const confirmPayment = async()=> {
      if (!sessionId) {
        return;
      }

      const res = await fetch("/api/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });


      const { stripeSession } = await res.json();

      if (!stripeSession) {
        return;
      }

      const confirm = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeSession }),
      });
    }

    confirmPayment();

    verifyPayment();
  }, [sessionId]);

  if (loading) return <div className="text-white">⏳ Checking payment...</div>;
  if (!isPaid) return <div className="text-red-500 text-xl">❌ Access denied. Payment not verified.</div>;

  return (
    <div className="text-green-400 text-xl">
      ✅ Payment verified! You can now access your course. 🎉
    </div>
  );
}
