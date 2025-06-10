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
      // Store the JWT token and redirect
      localStorage.setItem('token', data.token);
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Account</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <button type="submit" className="w-full bg-[#b2784a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#59371c] transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}