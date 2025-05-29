import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getRole, isLoggedIn, logout } from '../utils/auth';

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

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
    <div>
      <h1>Dashboard</h1>
      {role && <p>Logged in as: {role}</p>}
      {role === 'admin' && <p>Admin Panel Access</p>}
      {role === 'organizer' && <p>Manage Events</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
