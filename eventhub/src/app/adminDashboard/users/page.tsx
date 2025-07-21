'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import type { UserType } from '@/src/types/user';
import type { EventType } from '@/src/types/event';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, EventType[]>>({});
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);
  const [editedEvents, setEditedEvents] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.replace('/login');

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== 'admin') return router.replace('/unauthorized');
      setCurrentAdminId(decoded.id);
    } catch {
      return router.replace('/login');
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchUsers();
    else alert('Failed to delete user');
  };

  const handleInfo = async (user: UserType) => {
    setSelectedUser(user);
    setShowInfo(true);

    if (!eventsMap[user._id]) {
      try {
        const res = await fetch(`/api/users/${user._id}/registered-events`);
        const data = await res.json();
        setEventsMap(prev => ({ ...prev, [user._id]: data.events }));
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    }
  };
const handleEdit = async (user: UserType) => {
  setEditedUser({ ...user });

  if (!eventsMap[user._id]) {
    try {
      const res = await fetch(`/api/users/${user._id}/registered-events`);
      const data = await res.json();
      if (data?.events) {
        setEventsMap(prev => ({ ...prev, [user._id]: data.events }));
        setEditedEvents(data.events.map((e: EventType) => e._id));
      }
    } catch (err) {
      console.error('Failed to fetch events for edit:', err);
    }
  } else {
    setEditedEvents(eventsMap[user._id].map((e) => e._id));
  }

  setTimeout(() => {
    setShowEdit(true);
  }, 100);
};

  const handleSaveEdit = async () => {
    if (!editedUser) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/users/${editedUser._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editedUser.name,
        email: editedUser.email,
        role: editedUser.role,
        registeredEvents: editedEvents,
      }),
    });

    if (res.ok) {
      setShowEdit(false);
      setEditedUser(null);
      fetchUsers();
    
    } else {
      alert('Failed to update user');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">User ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-2">{user.userId}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleInfo(user)} className="text-blue-500 underline">Info</button>
                  <button onClick={() => handleEdit(user)} className="text-green-600 underline">Edit</button>
                  {user._id !== currentAdminId && (
                    <button onClick={() => handleDelete(user._id)} className="text-red-500 underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showInfo && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-lg font-bold mb-3">User Information</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <div className="mt-4">
              <h3 className="font-semibold">Registered Events:</h3>
              <ul className="list-disc pl-5 text-sm mt-1">
                {(eventsMap[selectedUser._id] || []).map(ev => (
                  <li key={ev._id}>{ev.title} ({new Date(ev.from).toLocaleDateString()})</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowInfo(false)} className="text-sm px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && editedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <input
              type="text"
              value={editedUser.name}
              onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Name"
            />
            <input
              type="email"
              value={editedUser.email}
              onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Email"
            />
            <select
              value={editedUser.role}
              onChange={e => setEditedUser({ ...editedUser, role: e.target.value as 'admin' | 'user' })}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div>
              <h4 className="font-semibold mb-1">Registered Events:</h4>
             <ul className="list-disc pl-5 text-sm">
  {editedEvents.map(eventId => {
    const title =
      eventsMap[editedUser._id]?.find(ev => ev._id === eventId)?.title || eventId;
    return (
      <li key={eventId} className="flex justify-between items-center">
        <span>{title}</span>
        <button
          onClick={() =>
            setEditedEvents(prev => prev.filter(id => id !== eventId))
          }
          className="text-xs text-red-500 underline"
        >
          Remove
        </button>
      </li>
    );
  })}
</ul>

            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowEdit(false)} className="text-sm px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button onClick={handleSaveEdit} className="text-sm px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
