'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import EventForm from '../components/EventForm';
import type { EventType } from '@/src/types/event';

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editEvent, setEditEvent] = useState<EventType | null>(null);
  const [search, setSearch] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return router.replace('/login');

    try {
      const decoded: any = jwtDecode(storedToken);
      if (decoded.role !== 'admin') return router.replace('/unauthorized');

      setToken(storedToken);
    } catch {
      return router.replace('/login');
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchEvents(token);
    }
  }, [token]);

  const fetchEvents = async (authToken: string) => {
    try {
      const res = await fetch('/api/events', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        console.error('Fetch failed:', await res.text());
        return;
      }

      const data = await res.json();
      setEvents(data.events || []);
      setFilteredEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchEvents(token!);
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (event: EventType) => {
    setEditEvent(event);
    setFormVisible(true);
  };

  const handleSubmit = async (formData: FormData) => {
    const method = editEvent ? 'PUT' : 'POST';
    const url = editEvent ? `/api/events/${editEvent._id}` : '/api/events/create';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setFormVisible(false);
        setEditEvent(null);
        fetchEvents(token!);
      } else {
        alert('Failed to save event');
      }
    } catch {
      alert('Failed to save event');
    }
  };

  const handleSearch = (keyword: string) => {
    setSearch(keyword);
    const lower = keyword.toLowerCase();
    const filtered = events.filter((e) =>
      e.title.toLowerCase().includes(lower)
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Events</h2>
          <p className="text-xl">{filteredEvents.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:max-w-sm"
        />

        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => {
            setEditEvent(null);
            setFormVisible(true);
          }}
        >
          + Create Event
        </button>
      </div>

      {formVisible && (
        <EventForm
          onSubmit={handleSubmit}
          onCancel={() => setFormVisible(false)}
          initialData={
            editEvent
              ? {
                  title: editEvent.title,
                  description: editEvent.description ?? '',
                  capacity: String(editEvent.capacity ?? ''),
                  from: editEvent.from,
                  to: editEvent.to,
                  street: editEvent.street,
                  city: editEvent.city,
                  image: null,
                }
              : undefined
          }
        />
      )}

      <table className="w-full border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th className="p-2">Date</th>
            <th className="p-2">Venue</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
            <tr key={event._id} className="border-b">
              <td className="p-2">{event.title}</td>
              <td className="p-2">
                {event.from} - {event.to}
              </td>
              <td className="p-2">
                {event.street}, {event.city}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-500 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-500 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
