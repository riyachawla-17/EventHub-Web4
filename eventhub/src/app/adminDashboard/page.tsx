'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EventCard from './../components/EventCard';
import EventForm from './../components/EventForm';
import jwt from 'jsonwebtoken';

interface EventType {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  from: string;
  to: string;
  time: string;
  venue: string;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
}

interface DecodedToken {
  id: string;
  role: 'admin' | 'user';
  exp: number;
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded: DecodedToken = jwt.verify(token, 'your-secret-key') as DecodedToken;

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setUserRole(decoded.role);
          if (decoded.role === 'admin') {
            router.replace('/admin-dashboard');
          } else {
            router.replace('/user-dashboard');
          }
        }
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('token');
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setAllEvents(data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData: EventType) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error('Failed to create event');
      const data = await res.json();
      setAllEvents((prev) => [...prev, data.event]);
      alert('Event created successfully!');
      setFormVisible(false);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.location?.address.toLowerCase().includes(search.toLowerCase()) ||
    event.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center text-[#3c2a21] mb-4">
        Welcome to EventHub
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <input
          type="text"
          placeholder="Search events by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-[#b2784a] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b2784a] bg-white text-[#59371c] text-sm"
        />

        {!userRole ? (
          <div className="flex gap-2">
            <Link href="/login">
              <button className="bg-[#3c2a21] text-white px-4 py-2 rounded-lg hover:bg-[#291b13] text-sm">Login</button>
            </Link>
            <Link href="/register">
              <button className="bg-white text-[#3c2a21] border border-[#3c2a21] px-4 py-2 rounded-lg hover:bg-gray-100 text-sm">Register</button>
            </Link>
          </div>
        ) : userRole === 'admin' ? (
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="bg-[#59371c] text-white px-4 py-2 rounded-lg hover:bg-[#4e3119] transition-all text-sm"
          >
            {formVisible ? 'Cancel' : 'Create Event'}
          </button>
        ) : null}
      </div>

      {formVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black/50">
          <div className="relative bg-[#f8f1eb] p-4 rounded-lg shadow-lg w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setFormVisible(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-sm text-[#59371c]">Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-sm text-[#59371c]">No events found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
