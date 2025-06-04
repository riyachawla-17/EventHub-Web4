interface Event {
  id: number;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white border border-emerald-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition duration-300">
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
