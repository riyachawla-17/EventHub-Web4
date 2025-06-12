'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  role: string;
}

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.role !== 'user') {
        router.push('/');
        return;
      }

      setUserId(decoded.userId); 

      fetch(`/api/users/${decoded.userId}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name || '');
          setEmail(data.email || '');
        })
        .catch(() => setError('Failed to load user info'));
    } catch (err) {
      console.error('Invalid token:', err);
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Failed to update profile');
        return;
      }

      setSuccess('Profile updated successfully');
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-[#59371c]">Edit Profile</h2>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
        <button
          type="submit"
          className="w-full bg-[#59371c] text-white px-4 py-2 rounded hover:bg-[#402914] text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
