import { Link } from "react-router-dom";

function EventCard({ event }) {
  const imageUrl = event.image
    ? `http://localhost:3000${event.image}`
    : "/default-event.jpg";

  const formattedDate = new Date(event.date).toLocaleDateString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="shadow-md bg-white rounded-xl overflow-hidden transition hover:shadow-lg w-[280px] min-w-[280px]">
      <img
        src={imageUrl}
        alt={event.title}
        className="w-full h-[180px] object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-[1rem] mb-1 text-gray-900">
          {event.title}
        </h3>
        <p className="text-sm text-gray-700 mb-1">🗓 {formattedDate}</p>
        <p className="text-sm text-gray-700 mb-2">📍 {event.location?.address || "Locație necunoscută"}</p>
        <Link
          to={`/events/${event._id}`}
          className="inline-block mt-2 text-[#c89459] font-medium text-sm hover:underline"
        >
          Vezi Detalii →
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
