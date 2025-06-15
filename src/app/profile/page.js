'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RouteLoader from '../../components/RouteLoader';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setisloading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') return <RouteLoader />;
  if (status === 'unauthenticated') return null;

  const handleLogout = async () => {
    setisloading(true);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-20 px-4">
      <div className="max-w-md mx-auto bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-white">
        <div className="flex flex-col items-center text-center">
          {/* <img
            src
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-yellow-400 mb-4 shadow-lg"
          /> */}
          <h1 className="text-3xl font-bold text-yellow-300 mb-1">Welcome 👋</h1>
          <p className="text-md text-gray-300 mb-6">{session?.user?.name}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-yellow-300">Name</label>
            <p className="text-lg font-semibold">{session?.user?.name}</p>
          </div>

          <div>
            <label className="text-sm text-yellow-300">Email</label>
            <p className="text-lg font-semibold">{session?.user?.email}</p>
          </div>

          <div>
            <label className="text-sm text-yellow-300">Password</label>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold tracking-widest">
                 •••••••
              </p>
              
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 transition font-bold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-300">
          Change my Password
          <Link href={'/profile/reset-password'}
            className="underline cursor-pointer text-yellow-300 hover:text-yellow-200"
          >
            Change Here
          </Link>
        </p>
      </div>
    </div>
  );
}
