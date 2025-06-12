'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Something went wrong');
    } else {
      localStorage.setItem('token', data.token);
      router.push('/');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-black">Create Account</h2>
      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b2784a] rounded-md text-gray-800 text-sm"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b2784a] rounded-md text-gray-800 text-sm"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b2784a] rounded-md text-gray-800 text-sm"
        />
        <button type="submit" className="w-full bg-[#b2784a] text-white font-semibold py-2 px-3 rounded-md hover:bg-[#59371c] transition text-sm">
          Sign Up
        </button>
      </form>
    </div>
  );
}