'use client';

import { useState, useEffect } from 'react';

interface EventFormProps {
  onSubmit: (eventData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    capacity: string;
    from: string;
    to: string;
    street: string;
    city: string;
    image?: File | null | string;
  };
}

export default function EventForm({ onSubmit, onCancel, initialData }: EventFormProps) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    capacity: '',
    from: '',
    to: '',
    street: '',
    city: '',
    image: null as File | null | string,
  });

  useEffect(() => {
    if (initialData) {
      setEventData({
        ...initialData,
        image: initialData.image || null,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
  Object.entries(eventData).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  console.log('FormData being sent from EventForm:', Array.from(formData.entries()));
    await onSubmit(formData);
  };

  return (
    <div className="w-1/2 max-w-2xl rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3 bg-[#f8f1eb] p-4 rounded-lg shadow-md text-sm">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Event' : 'Create Event'}</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setEventData({ ...eventData, image: e.target.files?.[0] || null })}
          className="w-full p-2 border border-[#b2784a] rounded-md"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-[#59371c] text-white px-4 py-2 rounded-md hover:bg-[#4e3119] transition-all"
          >
            {initialData ? 'Save Changes' : 'Submit'}
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
    </div>
  );
}