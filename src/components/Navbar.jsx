'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;



  return (
    <div className="w-full top-0 z-50 backdrop-blur-md border-b border-white/20 text-white shadow-sm bg-[#8989902e]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          UbaidCourses 🎓
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link href="/courses" className="hover:text-yellow-300 transition">Courses</Link>
          <Link href="/about" className="hover:text-yellow-300 transition">About</Link>
          <Link href="/contact" className="hover:text-yellow-300 transition">Contact</Link>
        </div>

        {/* Auth - Desktop */}
        {status === "loading" ? (
          <div className="text-sm text-yellow-300 hidden md:block">Loading...</div>
        ) : (
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <>
                <div className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 transition font-semibold">
                  Logged In
                </div>
                <div className="relative group">
                  <button className="text-white font-medium hover:text-yellow-300 transition">
                    Settings ⚙️
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg text-white rounded-lg shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition-all duration-300 origin-top-right z-50">
                    <ul className="py-2">
                      <li><Link href="/profile" className="block px-4 py-2 hover:bg-white/20 transition">👤 Profile</Link></li>
                      <li><Link href="/settings" className="block px-4 py-2 hover:bg-white/20 transition">⚙️ Account Settings</Link></li>
                      <li><Link href="/dashboard" className="block px-4 py-2 hover:bg-white/20 transition">📊 Dashboard</Link></li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="px-4 py-2 rounded bg-white/20 hover:bg-yellow-400 hover:text-black transition font-semibold">Login</Link>
                <Link href="/sign-up" className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">Sign Up</Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[60] relative">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`
    absolute top-full left-0 w-full min-h-screen
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    transition-transform duration-500 ease-in-out 
    flex flex-col items-center justify-center space-y-6
    bg-[#0e1f3acc] backdrop-blur-xl z-50 md:hidden
  `}
      >

        <Link href="/" onClick={() => setIsOpen(false)} className="text-xl hover:text-yellow-300 transition">Home</Link>
        <Link href="/courses" onClick={() => setIsOpen(false)} className="text-xl hover:text-yellow-300 transition">Courses</Link>
        <Link href="/about" onClick={() => setIsOpen(false)} className="text-xl hover:text-yellow-300 transition">About</Link>
        <Link href="/contact" onClick={() => setIsOpen(false)} className="text-xl hover:text-yellow-300 transition">Contact</Link>

        {user ? (
          <>
            <div className="px-4 py-2 rounded bg-green-700 font-semibold">
              Logged In
            </div>
            <button
              onClick={() => setShowMobileSettings(!showMobileSettings)}
              className="text-white font-medium hover:text-yellow-300 transition"
            >
              Settings ⚙️
            </button>
            {showMobileSettings && (
              <div className="text-white text-sm space-y-2 mt-2 text-center">
                <Link href="/profile" className="block hover:text-yellow-300">👤 Profile</Link>
                <Link href="/settings" className="block hover:text-yellow-300">⚙️ Account Settings</Link>
                <Link href="/dashboard" className="block hover:text-yellow-300">📊 Dashboard</Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Link href="/sign-in" onClick={() => setIsOpen(false)} className="block px-7 py-2 bg-white/20 rounded hover:bg-yellow-400 hover:text-black font-semibold transition">Login</Link>
            <Link href="/sign-up" onClick={() => setIsOpen(false)} className="block px-7 py-2 text-white bg-yellow-400 rounded hover:bg-yellow-300 font-semibold transition">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
