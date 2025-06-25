'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EventForm from '../components/EventForm';
import { useAuth } from '../../context/AuthContext';

interface EventType {
  _id: string;
  title: string;
  description: string;
  from: string;
  to: string;
}

export default function UserDashboard() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      selectedDate === null ||
      new Date(event.from).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  const handleCreateEvent = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create event');
      const data = await res.json();
      setEvents(prev => [...prev, data.event]);
      alert('Event created successfully!');
      setFormVisible(false);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholderText="Select a date"
        />
      </div>

      {isLoggedIn && (
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="mt-4 bg-[#59371c] text-white px-4 py-2 rounded hover:bg-[#4e3119] transition"
        >
          Create Event
        </button>
      )}

      {formVisible && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setFormVisible(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500">No events found.</p>
        ) : (
          filteredEvents.map(event => (
            <div key={event._id} className="bg-[#f8f1eb] text-[#59371c] p-4 rounded-lg shadow-md">
                <img
                  src={event.image || '/images/placeholder.png'}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-[#59371c] mb-4">{event.description}</p>
              <p className="text-sm text-[#59371c]">
                <strong>From:</strong> {new Date(event.from).toLocaleString()}
              </p>
              <p className="text-sm text-[#59371c]">
                <strong>To:</strong> {new Date(event.to).toLocaleString()}
              </p>
              <button
                onClick={() => alert(`Booking ticket for ${event.title}`)}
                className="mt-4 bg-[#59371c] text-white px-4 py-2 rounded hover:bg-[#4e3119] transition"
              >
                Book Ticket
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}