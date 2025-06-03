interface Event {
  id: number;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.startDate} → {event.endDate}</p>
      </div>
    </div>
  );
}
