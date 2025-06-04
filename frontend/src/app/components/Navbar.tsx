import Link from 'next/link';

export default function Navbar() {
  return (
    <aside className="w-64 min-h-screen bg-emerald-500 text-white p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">EventHub</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/" className="hover:text-emerald-300">Home</Link>
          <Link href="/events" className="hover:text-emerald-300">Events</Link>
          <Link href="/about" className="hover:text-emerald-300">About</Link>
          <Link href="/contact" className="hover:text-emerald-300">Contact</Link>
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/login">
          <button className="w-full bg-white text-emerald-600 font-semibold py-2 px-4 rounded-xl hover:bg-emerald-100 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="w-full bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl hover:bg-emerald-800 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </aside>
  );
}
