import { notFound } from 'next/navigation';
import { Buffer } from 'buffer';
import process from 'process';

interface PageProps {
  params: any;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = params;

  if (!id) notFound();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/events/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) notFound();

  const { event } = await res.json();

  if (!event) notFound();

  let imageSrc = '';
  if (event.image) {
    if (event.image.data && event.image.contentType) {
      imageSrc = `data:${event.image.contentType};base64,${Buffer.from(event.image.data).toString('base64')}`;
    } else if (typeof event.image === 'string') {
      imageSrc = event.image;
    }
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-[#f8f1eb] p-6 rounded-xl shadow-lg">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="text-4xl font-bold text-[#59371c] mb-4">{event.title}</h1>
      <p className="text-lg text-gray-700 mb-4">{event.description}</p>
      <div className="space-y-3 text-[#59371c]">
        <p><strong>Capacity:</strong> {event.capacity}</p>
        <p><strong>From:</strong> {new Date(event.from).toLocaleString()}</p>
        <p><strong>To:</strong> {new Date(event.to).toLocaleString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Street:</strong> {event.street}</p>
        <p><strong>City:</strong> {event.city}</p>
      </div>
    </div>
  );
}
