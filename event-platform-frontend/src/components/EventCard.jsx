import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div className="event-card">
      <img src={event.image || "/default-event.jpg"} alt={event.title} />
      <h3>{event.title}</h3>
      <p>
  📍 {event.location?.address || "Adresă indisponibilă"} | 🗓{" "}
  {new Date(event.date).toLocaleDateString()}
</p>

      <Link to={`/events/${event._id}`} className="event-button">
        Vezi Detalii
      </Link>
    </div>
  );
}

export default EventCard;
