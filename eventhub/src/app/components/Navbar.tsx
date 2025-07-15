'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole(null);
      }
    };

    if (isLoggedIn) {
      fetchRole();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <nav className="w-full bg-[#b2784a] text-white p-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-6">
        <img src="/images/logo.png" alt="EventHub Logo" className="h-14" />
        <div className="flex gap-6">
          {role === 'admin' ? (
            <>
              <Link href="/adminDashboard" className="hover:scale-115 transition-transform duration-200 hover:text-[#f8f1eb]">Admin Dashboard</Link>
              <Link href="/adminDashboard/users" className="hover:scale-115 transition-transform duration-200 hover:text-[#f8f1eb]">Users</Link>
            </>
          ) : (
            <>
              <Link href="/userDashboard" className="hover:scale-115 transition-transform duration-200 hover:text-[#f8f1eb]">Home</Link>
              <Link href="/myEvents" className="hover:scale-115 transition-transform duration-200 hover:text-[#f8f1eb]">My Events</Link>
              <Link href="/registeredEvents" className="hover:scale-115 transition-transform duration-200 hover:text-[#f8f1eb]">Registered Events</Link>
              <Link href="/about" className="hover:scale-115 transition-transform duration-200 hover:text-[#f8f1eb]">About</Link>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push('/edit-profile')}
              className="bg-[#59371c] text-white font-semibold py-2 px-3 rounded-md hover:bg-[#4e3119] transition"
            >
              Edit Profile
            </button>
            <button onClick={handleLogout} className="bg-[#f8f1eb] text-[#59371c] font-semibold py-2 px-3 rounded-md hover:bg-[#e6d9cf] transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-[#f8f1eb] text-[#59371c] font-semibold py-2 px-3 rounded-md hover:bg-[#e6d9cf] transition">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-[#59371c] text-[#f8f1eb] font-semibold py-2 px-3 rounded-md hover:bg-[#4e3119] transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
