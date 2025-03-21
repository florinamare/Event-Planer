import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Eroare la încărcarea evenimentelor:", err));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Lista Evenimentelor</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p>Nu există evenimente disponibile.</p>
        )}
      </div>
    </div>
  );
}

export default EventsList;
