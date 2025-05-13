import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        groupByCategory(data);
      })
      .catch((err) => console.error("Eroare la încărcarea evenimentelor:", err))
      .finally(() => setLoading(false));
  }, []);

  const groupByCategory = (eventList) => {
    const grouped = {};
    eventList.forEach((event) => {
      const category = event.type || "Fără categorie";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(event);
    });
    setGroupedEvents(grouped);
  };

  const formatType = (type) => {
    return type
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Lista Evenimentelor</h2>
      {loading ? (
        <p>Se încarcă evenimentele...</p>
      ): Object.keys(groupedEvents).length === 0 ? (
        <p>Nu există evenimente disponibile.</p>
      ) : (
        Object.entries(groupedEvents).map(([category, events]) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#0056b3", marginBottom: "1rem", textTransform: "capitalize" }}>
              {formatType(category)}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        ))
        
      )}
    </div>
  );
}

export default EventsList;
