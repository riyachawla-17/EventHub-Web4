'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '../components/EventForm';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface EventType {
  _id: string;
  title: string;
  image?: string | null;
  attendees: { _id: string; name: string }[];
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
  const [showScanModal, setShowScanModal] = useState(false);
  const [scannedQrCode, setScannedQrCode] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null); // Store scanner instance
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events/my', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      })
      .then((data) => {
        if (data && data.events) {
          setEvents(data.events || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, [router]);

  const handleScanQrCode = async (qrCode: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to scan QR code');
        return;
      }

      alert('QR code scanned successfully!');
      setShowScanModal(false);
      setScannedQrCode(null);
    } catch (err) {
      console.error('Error scanning QR code:', err);
      alert('Failed to scan QR code');
    }
  };

  const initializeScanner = () => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedQrCode(decodedText);
        handleScanQrCode(decodedText);
        setScanError(null);
        scanner.clear();
      },
      (error) => {
        if (error.name === 'NotFoundException') {
          setScanError('No QR code detected. Please try again.');
        }
      }
    );

    scannerRef.current = scanner;
  };

  const closeModal = () => {
    setShowScanModal(false);
    setScanError(null);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    if (showScanModal) {
      initializeScanner();
    }
  }, [showScanModal]);

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
                <button
                  onClick={() => setShowScanModal(true)}
                  className="bg-[#b2784a] text-white px-4 py-2 rounded hover:bg-[#a56a3e] transition"
                >
                  Scan QR Code
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

      {showScanModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Scan QR Code</h2>
            <div id="reader" style={{ width: '100%' }}></div>
            {scanError && <p className="text-red-500 text-sm mt-2">{scanError}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}