'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setToken } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="w-full bg-[#b2784a] text-white p-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-6">
        <img src="/images/logo.png" alt="EventHub Logo" className="h-10" />
        <div className="flex gap-3">
          <Link href="/userDashboard" className="hover:text-[#f8f1eb]">Home</Link>
          <Link href="/myEvents" className="hover:text-[#f8f1eb]">My Events</Link>
          <Link href="/about" className="hover:text-[#f8f1eb]">About</Link>
          <Link href="/contact" className="hover:text-[#f8f1eb]">Contact</Link>
        </div>
      </div>
      <div className="flex gap-2">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push('/edit-profile')}
              className="bg-[#59371c] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#4e3119] transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#f8f1eb] text-[#59371c] font-semibold py-1 px-3 rounded-md hover:bg-[#e6d9cf] transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-[#f8f1eb] text-[#59371c] font-semibold py-1 px-3 rounded-md hover:bg-[#e6d9cf] transition">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-[#59371c] text-[#f8f1eb] font-semibold py-1 px-3 rounded-md hover:bg-[#4e3119] transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}