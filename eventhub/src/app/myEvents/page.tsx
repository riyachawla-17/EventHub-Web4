'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface EventType {
  _id: string;
  title: string;
  description?: string;
  capacity?: number;
  from: string;
  to: string;
  time: string;
  street: string;
  city: string;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch('/api/events/my', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data.events);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-[#f8f1eb] text-[#59371c] p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <p className="text-[#59371c] mb-4">{event.description}</p>
              <p className="text-sm text-[#59371c]">
                <strong>From:</strong> {new Date(event.from).toLocaleString()}
              </p>
              <p className="text-sm text-[#59371c]">
                <strong>To:</strong> {new Date(event.to).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-[#59371c]">
                <strong>Time:</strong> {event.time}
              </p>
              <p className="mt-2 text-sm text-[#59371c]">
                <strong>Location:</strong> {event.street}, {event.city}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}