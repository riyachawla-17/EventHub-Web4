import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/events/${params.id}`, { cache: 'no-store' });
  if (!res.ok) {
    notFound();
  }
  const data = await res.json();
  const event = data.event;

  if (!event) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-[#59371c]">Event Not Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-[#f8f1eb] p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-[#59371c] mb-4">{event.title}</h1>
      <p className="text-lg text-gray-700 mb-4">{event.description}</p>
      <div className="space-y-3 text-[#59371c]">
        <p>
          <strong>Capacity:</strong> {event.capacity}
        </p>
        <p>
          <strong>From:</strong> {new Date(event.from).toLocaleString()}
        </p>
        <p>
          <strong>To:</strong> {new Date(event.to).toLocaleString()}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Venue:</strong> {event.venue}
        </p>
        <p>
          <strong>Location:</strong>{' '}
          <span className="text-gray-600">
            {event.location.address} (Lat: {event.location.lat}, Lng: {event.location.lng})
          </span>
        </p>
      </div>
    </div>
  );
}