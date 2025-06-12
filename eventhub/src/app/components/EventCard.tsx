import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  image?: any;
  from: string;
  to: string;
  time: string;
  venue: string;
}

export default function EventCard({ event }: { event: Event }) {
  let imageSrc = "";

  if (event.image) {
    if (typeof event.image === 'object' && event.image.data && event.image.contentType) {
      if (event.image.data.$binary && event.image.data.$binary.base64) {
        imageSrc = `data:${event.image.contentType};base64,${event.image.data.$binary.base64}`;
      } else {
        let bufferData = event.image.data;
        if (bufferData.data) {
          bufferData = bufferData.data;
        }

        // ✅ Fix: Explicitly assert type to number[]
        const binaryStr = (bufferData as number[]).reduce(
          (acc: string, byte: number) => acc + String.fromCharCode(byte),
          ''
        );
        const base64Str = btoa(binaryStr);
        imageSrc = `data:${event.image.contentType};base64,${base64Str}`;
      }
    } else if (typeof event.image === 'string') {
      imageSrc = event.image;
    }
  }

  return (
    <Link href={`/events/${event._id}`}>
      <div className="bg-[#f8f1eb] shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer">
        {imageSrc ? (
          <img src={imageSrc} alt={event.title} className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-[#59371c]">{event.title}</h3>
          <p className="text-sm text-[#b2784a]">
            {new Date(event.from).toLocaleDateString()} - {new Date(event.to).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
