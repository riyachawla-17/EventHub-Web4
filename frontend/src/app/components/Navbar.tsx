import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#b2784a] text-white p-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-bold">EventHub</h2>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-emerald-300">Home</Link>
          <Link href="/events" className="hover:text-emerald-300">Events</Link>
          <Link href="/about" className="hover:text-emerald-300">About</Link>
          <Link href="/contact" className="hover:text-emerald-300">Contact</Link>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/login">
          <button className="bg-[#f8f1eb] text-[#59371c] font-semibold py-2 px-4 rounded-xl hover:bg-emerald-100 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-[#59371c] text-[#f8f1eb] font-semibold py-2 px-4 rounded-xl hover:bg-emerald-800 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}