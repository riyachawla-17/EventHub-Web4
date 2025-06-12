'use client';

import { useState } from 'react';

interface EventFormProps {
  onSubmit: (eventData: any) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    capacity: '',
    from: '',
    to: '',
    time: '',
    street: '',
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-[#f8f1eb] p-4 rounded-lg shadow-md text-sm">
      <input
        type="text"
        placeholder="Title"
        value={eventData.title}
        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <textarea
        placeholder="Description"
        value={eventData.description}
        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
      />
      <input
        type="number"
        placeholder="Capacity"
        value={eventData.capacity}
        onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <input
        type="datetime-local"
        placeholder="From"
        value={eventData.from}
        onChange={(e) => setEventData({ ...eventData, from: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <input
        type="datetime-local"
        placeholder="To"
        value={eventData.to}
        onChange={(e) => setEventData({ ...eventData, to: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <input
        type="text"
        placeholder="Time"
        value={eventData.time}
        onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <input
        type="text"
        placeholder="Street"
        value={eventData.street}
        onChange={(e) => setEventData({ ...eventData, street: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <input
        type="text"
        placeholder="City"
        value={eventData.city}
        onChange={(e) => setEventData({ ...eventData, city: e.target.value })}
        className="w-full p-2 border border-[#b2784a] rounded-md"
        required
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-[#59371c] text-white px-4 py-2 rounded-md hover:bg-[#4e3119] transition-all"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-[#b2784a] text-white px-4 py-2 rounded-md hover:bg-[#a56a3e] transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}