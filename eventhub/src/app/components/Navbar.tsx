'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="w-full bg-[#b2784a] text-white p-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <img src="/images/logo.png" alt="EventHub Logo" className="h-15" />
        <div className="flex gap-4">
          <Link href="/" className="hover:text-[#f8f1eb]">Home</Link>
          <Link href="/events" className="hover:text-[#f8f1eb]">Events</Link>
          <Link href="/about" className="hover:text-[#f8f1eb]">About</Link>
          <Link href="/contact" className="hover:text-[#f8f1eb]">Contact</Link>
        </div>
      </div>
      <div className="flex gap-2">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-[#f8f1eb] text-[#59371c] font-semibold py-2 px-4 rounded-xl hover:bg-[#e6d9cf] transition">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-[#f8f1eb] text-[#59371c] font-semibold py-2 px-4 rounded-xl hover:bg-[#e6d9cf] transition">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-[#59371c] text-[#f8f1eb] font-semibold py-2 px-4 rounded-xl hover:bg-[#4e3119] transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}