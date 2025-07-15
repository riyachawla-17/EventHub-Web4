'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setIsLoggedIn, setToken } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();

  if (!res.ok) {
    setError(data.message || 'Something went wrong');
  } else {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setIsLoggedIn(true);

    try {
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role;

        if (role === 'admin') {
          router.push('/adminDashboard');
        } else {
          router.push('/userDashboard');
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        router.push('/userDashboard');
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-black">Login</h2>
      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-[#b2784a] focus:outline-none focus:ring-1 focus:ring-[#b2784a] rounded-md text-gray-800 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-[#b2784a] focus:outline-none focus:ring-1 focus:ring-[#b2784a] rounded-md text-gray-800 text-sm"
        />
        <button type="submit" className="w-full bg-[#b2784a] text-white font-semibold py-2 px-3 rounded-md hover:bg-[#59371c] transition text-sm">
          Log In
        </button>
      </form>
    </div>
  );
}
