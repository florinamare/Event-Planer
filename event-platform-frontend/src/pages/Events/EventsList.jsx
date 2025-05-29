import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../../components/EventCard";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Filtrăm după tip dacă există un query type
        const filtered = selectedType
          ? data.filter((ev) => ev.type === selectedType)
          : data;

        setEvents(filtered);
        groupByCategory(filtered);
      })
      .catch((err) => console.error("Eroare la încărcarea evenimentelor:", err))
      .finally(() => setLoading(false));
  }, [selectedType]);

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
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        {selectedType
          ? `Evenimente din categoria: ${formatType(selectedType)}`
          : "Lista Evenimentelor"}
      </h2>

      {loading ? (
        <p>Se încarcă evenimentele...</p>
      ) : Object.keys(groupedEvents).length === 0 ? (
        <p>Nu există evenimente disponibile.</p>
      ) : (
        Object.entries(groupedEvents).map(([category, events]) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            {!selectedType && (
              <h3
                style={{
                  color: "#0056b3",
                  marginBottom: "1rem",
                  textTransform: "capitalize",
                }}
              >
                {formatType(category)}
              </h3>
            )}
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
