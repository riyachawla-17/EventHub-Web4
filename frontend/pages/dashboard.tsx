'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getRole, isLoggedIn, logout } from '../utils/auth';
import UserDashboard from '../components/UserDashboard';

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    } else {
      setRole(getRole());
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-pink-50 relative px-4 py-8 flex flex-col items-center">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow">
        Logout
      </button>


      {/* Welcome */}
      <h1 className="text-4xl font-bold text-purple-800 text-center mb-6">
        Welcome {role}
      </h1>

      {/* Dashboard */}
      {role === 'user' && (
        <div className="w-full max-w-6xl">
          <UserDashboard />
        </div>
      )}
    </div>
  );
}
