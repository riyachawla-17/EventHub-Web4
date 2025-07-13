'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

interface EventType {
  _id: string;
  title: string;
  description?: string;
  from: string;
  to: string;
  street: string;
  city: string;
  image?: string;
  qrCode?: string;
}

export default function RegisteredEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events/registered', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to fetch registered events');
        return res.json();
      })
      .then((data) => {
        if (data && data.events) {
          setEvents(data.events || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching registered events:', err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registered Events</h1>
      {events.length === 0 ? (
        <p>No registered events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-[#f8f1eb] text-[#59371c] p-4 rounded-lg shadow-md">
              <img
                src={event.image || '/images/placeholder.png'}
                alt={event.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <p className="text-[#59371c] mb-4">{event.description}</p>
              <p className="text-sm text-[#59371c]">
                <strong>From:</strong> {new Date(event.from).toLocaleString()}
              </p>
              <p className="text-sm text-[#59371c]">
                <strong>To:</strong> {new Date(event.to).toLocaleString()}
              </p>
              <p className="text-sm text-[#59371c]">
                <strong>Location:</strong> {event.street}, {event.city}
              </p>
              {event.qrCode && (
                <div className="mt-4">
                  <strong>QR Code:</strong>
                  <QRCodeSVG value={event.qrCode} size={128} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}