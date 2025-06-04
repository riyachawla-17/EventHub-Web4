'use client';
import { useState } from 'react';
import EventCard from '../app/components/EventCard';

const allEvents = [
  {
    id: 1,
    title: 'Tech Conference 2025',
    image: '/images/event.jpeg',
    startDate: 'June 10, 2025',
    endDate: 'June 12, 2025',
  },
  {
    id: 2,
    title: 'Design Meetup',
    image: '/images/event.jpeg',
    startDate: 'July 1, 2025',
    endDate: 'July 1, 2025',
  },
  {
    id: 3,
    title: 'Hackathon Night',
    image: '/images/event.jpeg',
    startDate: 'Aug 20, 2025',
    endDate: 'Aug 21, 2025',
  },
];

export default function HomePage() {
  const [search, setSearch] = useState('');

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button className="bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition-all">
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
