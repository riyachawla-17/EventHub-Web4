import Link from 'next/link';

export default function Navbar() {
  return (
    <aside className="w-64 min-h-screen bg-emerald-700 text-white p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">EventHub</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="hover:text-emerald-300">Home</Link>
        <Link href="/events" className="hover:text-emerald-300">Events</Link>
        <Link href="/about" className="hover:text-emerald-300">About</Link>
        <Link href="/contact" className="hover:text-emerald-300">Contact</Link>
      </nav>
    </aside>
  );
}
