'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Something went wrong');
    } else {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-[#b2784a] focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-[#b2784a] focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <button type="submit" className="w-full bg-[#b2784a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#59371c] transition">
          Log In
        </button>
      </form>
    </div>
  );
}