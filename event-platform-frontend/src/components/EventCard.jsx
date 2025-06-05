import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";

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
    <div className="shadow-md bg-white rounded-xl overflow-hidden transition hover:shadow-lg w-[300px] flex-shrink-0">
      
      {/* ✅ Imagine + badge colț stânga sus */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full aspect-[4/3] object-cover"
        />
        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold shadow-md">
          {event.type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[1.05rem] mb-2 text-gray-900 line-clamp-2">
          {event.title}
        </h3>
        <div className="text-sm text-gray-700 flex items-start gap-1 mb-1">
          <CalendarDays className="w-4 h-4 mt-0.5 text-[#1D5C5F]" />
          <span>{formattedDate}</span>
        </div>
        <div className="text-sm text-gray-700 flex items-start gap-1">
          <MapPin className="w-4 h-4 mt-0.5 text-[#1D5C5F]" />
          <span>{event.location?.address || "Locație necunoscută"}</span>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="inline-block mt-3 text-[#c89459] font-medium text-sm hover:underline"
        >
          Vezi Detalii →
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
