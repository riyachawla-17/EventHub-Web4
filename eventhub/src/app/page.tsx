'use client';
import { useEffect, useState } from 'react';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import { useAuth } from '../context/AuthContext';

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

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const [formVisible, setFormVisible] = useState(false);

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

  return (
    <div className="space-y-4 p-2 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-[#b2784a] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b2784a] bg-white text-[#59371c] text-sm"
        />
        <button
          onClick={() => setSearch('')}
          className="bg-[#b2784a] text-white px-4 py-2 rounded-lg hover:bg-[#a56a3e] transition-all text-sm"
        >
          Clear
        </button>
        {isLoggedIn && (
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="bg-[#59371c] text-white px-4 py-2 rounded-lg hover:bg-[#4e3119] transition-all text-sm"
          >
            {formVisible ? 'Cancel' : 'Create Event'}
          </button>
        )}
      </div>

      {formVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
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
      ) : allEvents.length === 0 ? (
        <p className="text-center text-sm text-[#59371c]">No events found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}