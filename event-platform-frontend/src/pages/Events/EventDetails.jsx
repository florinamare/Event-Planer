import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/events/${id}`);
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error("Eroare la preluarea evenimentului:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <h1>Se încarcă detaliile...</h1>;
  if (!event) return <h1>Evenimentul nu a fost găsit.</h1>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-lg">{event.description}</p>
      <p>
  📍 <strong>Locație:</strong> {event.location?.address || "Nespecificată"}
</p>
<p>
  📍 <strong>Coordonate:</strong> {event.location?.coordinates ? event.location.coordinates.join(", ") : "Nespecificate"}
</p>

      <p>🗓 <strong>Data:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p>🎫 <strong>Tip bilete:</strong> {event.tickets ? event.tickets.map(ticket => `${ticket.type} - ${ticket.price}€`).join(", ") : "N/A"}</p>
    </div>
  );
}

export default EventDetails;
