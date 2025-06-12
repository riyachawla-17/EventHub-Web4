'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center h-full py-20 px-4">
      <h2 className="text-4xl font-bold mb-4">Welcome to EventHub</h2>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Join as a user or admin to discover, create, and manage exciting tech events and hackathons.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-[#3c2a21] text-white px-6 py-2 rounded-lg hover:bg-[#291b13] transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-white text-[#3c2a21] border border-[#3c2a21] px-6 py-2 rounded-lg hover:bg-gray-100 transition">
            Register As A New User
          </button>
        </Link>
      </div>
    </div>
  );
}
