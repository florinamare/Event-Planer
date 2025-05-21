import { Link } from "react-router-dom";

function EventCard({ event }) {
  const imageUrl = event.image
    ? `http://localhost:3000${event.image}`
    : "/default-event.jpg"; // fallback

  return (
    <div className="event-card" style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", width: "300px" }}>
      <img
        src={imageUrl}
        alt={event.title}
        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px" }}
      />
      <h3>{event.title}</h3>
      <p>📍 {event.location?.address || "Locație necunoscută"}</p>
      <p>🗓 {new Date(event.date).toLocaleString()}</p>
      <Link to={`/events/${event._id}`} className="event-button">
        Vezi Detalii
      </Link>
    </div>
  );
}

export default EventCard;
