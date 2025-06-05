interface Event {
  id: number;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-[#f8f1eb] shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#59371c]">{event.title}</h3>
        <p className="text-sm text-[#b2784a]">{event.startDate} → {event.endDate}</p>
      </div>
    </div>
  );
}