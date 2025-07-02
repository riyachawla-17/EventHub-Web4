'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '../components/EventForm';

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
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
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
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch events');
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

  const handleUpdateEvent = async (formData: FormData) => {
    const token = localStorage.getItem('token');
    if (!editingEvent) return;
    try {
      const res = await fetch(`/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update event');
      const data = await res.json();
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev._id === data.event._id ? data.event : ev))
      );
      alert('Event updated successfully!');
      setEditingEvent(null);
    } catch (err: any) {
      console.error('Error updating event:', err);
      alert(err.message || 'Failed to update event');
    }
  };

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
                <strong>Capacity:</strong> {event.capacity || 'Unlimited'}
              </p>
              <p className="text-sm text-[#59371c]">
                <strong>Attendees:</strong>{' '}
                {event.attendees.length > 0
                  ? event.attendees.map((attendee: any) => attendee.name).join(', ')
                  : 'No attendees yet'}
              </p>
              <p className="mt-2 text-sm text-[#59371c]">
                <strong>Location:</strong> {event.street}, {event.city}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="bg-[#59371c] text-white px-4 py-2 rounded hover:bg-[#4e3119] transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <EventForm
            initialData={{
              title: editingEvent.title,
              description: editingEvent.description || '',
              capacity: editingEvent.capacity ? editingEvent.capacity.toString() : '',
              from: new Date(editingEvent.from).toISOString().slice(0, 16),
              to: new Date(editingEvent.to).toISOString().slice(0, 16),
              street: editingEvent.street,
              city: editingEvent.city,
              image: editingEvent.image || null,
            }}
            onSubmit={handleUpdateEvent}
            onCancel={() => setEditingEvent(null)}
          />
        </div>
      )}
    </div>
  );
}