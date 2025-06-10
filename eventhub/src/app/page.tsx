'use client';
import { useEffect, useState } from 'react';
import EventCard from './components/EventCard';

interface EventType {
  _id: string;
  title: string;
  description?: string;
  from: string;
  to: string;
  time: string;
  venue: string;
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-3 border border-[#b2784a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b2784a] bg-white text-[#59371c]"
        />
        <button
          onClick={() => setSearch('')}
          className="bg-[#b2784a] text-white px-5 py-3 rounded-xl hover:bg-[#a56a3e] transition-all"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-[#59371c]">Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-lg text-[#59371c]">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}