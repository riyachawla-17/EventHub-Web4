'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  date: string;
  category: string;
  location: string;
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Summit 2025',
    date: '2025-06-10',
    category: 'Conference',
    location: 'Toronto',
  },
  {
    id: '2',
    title: 'AI Hackathon',
    date: '2025-06-12',
    category: 'Hackathon',
    location: 'Vancouver',
  },
  {
    id: '3',
    title: 'React Meetup',
    date: '2025-06-15',
    category: 'Meetup',
    location: 'Montreal',
  },
];

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(sampleEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    let filtered = events;

    if (selectedDate) {
      const formatted = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter((event) => event.date.startsWith(formatted));
    }

    if (searchLocation.trim() !== '') {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [selectedDate, searchLocation, events]);

  return (
    <div className="flex flex-col items-center gap-8 w-full px-4">
      {/* Search Bar */}
     <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl mt-4">
      <Input
        placeholder="Search by location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        className="flex-grow px-4 py-2 border rounded-full shadow w-[250px]"
      />
      <Button
        onClick={() => {
          setSearchLocation('');
          setSelectedDate(undefined);
        }}
        className="bg-purple-600 text-white px-4 py-2 rounded-full shadow"
      >
        Clear Filters
      </Button>
    </div>

      {/* Calendar */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-lg border bg-white p-4 rounded-xl shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
      </div>


      {/* Upcoming Events Marquee */}
      <div className="w-full max-w-4xl overflow-hidden border rounded-lg bg-white shadow">
        <motion.div
          className="flex gap-6 py-4 px-6 animate-slide"
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          {sampleEvents.map((event) => (
            <div
              key={event.id}
              className="min-w-[300px] bg-purple-100 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-bold text-purple-800">{event.title}</h3>
              <p className="text-sm text-gray-700">{format(new Date(event.date), 'PPP')}</p>
              <p className="text-sm text-gray-600">📍 {event.location}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Filtered Event List */}
      <div className="w-full max-w-2xl space-y-4">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500">
            No events found for the selected filters.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-indigo-700">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(event.date), 'PPP')} • {event.location}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
