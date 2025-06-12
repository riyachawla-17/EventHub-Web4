'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from 'jwt-decode';

interface EventType {
  _id: string;
  title: string;
  from: string;
  to: string;
}

interface Ticket {
  eventId: string;
  qrCode: string;
  used: boolean;
}

interface DecodedToken {
  userId: string;
  role: 'user' | 'admin';
}

export default function UserDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [events, setEvents] = useState<EventType[]>([]);
  const [registered, setRegistered] = useState<Ticket[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.role !== 'user') {
        router.push('/login');
        return;
      }

      setUserId(decoded.userId);

      fetch(`/api/users/${decoded.userId}`)
        .then(res => res.json())
        .then(data => {
          setUserName(data.name || 'User');
        })
        .catch(() => {
          setUserName('User');
        });
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []));

    if (!userId) return;

    fetch(`/api/tickets/user/${userId}`)
      .then(res => res.json())
      .then(data => setRegistered(data || []));
  }, [userId]);

  const handleBookTicket = async (eventId: string) => {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        eventId,
        qrCode: `QR-${eventId}-${userId}`
      }),
    });

    if (res.ok) {
      alert('Ticket booked!');
      const newTicket = await res.json();
      setRegistered(prev => [...prev, newTicket]);
    } else {
      alert('Already registered or error occurred');
    }
  };

  const eventsOnSelectedDate = events.filter(e =>
    new Date(e.from).toDateString() === selectedDate.toDateString()
  );

  const registeredEventIds = registered.map(r => r.eventId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/edit-profile')}
            className="bg-[#59371c] text-white px-4 py-2 rounded hover:bg-[#402914] text-sm"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
              } else if (Array.isArray(value) && value[0] instanceof Date) {
                setSelectedDate(value[0]);
              }
            }}
            value={selectedDate}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Events on {selectedDate.toDateString()}
          </h2>
          {eventsOnSelectedDate.length === 0 ? (
            <p>No events scheduled.</p>
          ) : (
            eventsOnSelectedDate.map(event => (
              <div key={event._id} className="mb-4 p-3 border rounded">
                <h3 className="font-bold">{event.title}</h3>
                <p>From: {new Date(event.from).toLocaleString()}</p>
                <p>To: {new Date(event.to).toLocaleString()}</p>
                {!registeredEventIds.includes(event._id) ? (
                  <button
                    onClick={() => handleBookTicket(event._id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Book Ticket
                  </button>
                ) : (
                  <p className="text-green-600 mt-2">Already Registered ✅</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Registered Event History</h2>
        {registered.length === 0 ? (
          <p>No events registered yet.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-2">
            {registered.map(ticket => {
              const event = events.find(e => e._id === ticket.eventId);
              if (!event) return null;
              return (
                <li key={ticket.qrCode}>
                  <strong>{event.title}</strong> —{' '}
                  {new Date(event.from).toLocaleDateString()}
                  {ticket.used && <span className="text-green-600 ml-2">(Used)</span>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
